"use strict";

var gs_server = ""; /**   Server   user input   */
var gs_username = ""; /**   Username user input   */

/** Server Configuration */

var gi_user_id = 0; /**   userID Received from server */

var gs_media_server = "";
var gi_server_users = 0;
var gs_server_name = "";

var gs_most_popular_room = 0;

var go_room_record = new Object(); /** Room Info Object */
var ga_users_room = new Array(); /** User Objects in room */
var ga_user_list = new Array(); /** User List objects on server */
var ga_room_list = new Array(); /** Room list objects on server */

var ge_log = Id("client-chat-log") /* chat log dom element */
var gb_log_bottom = false /* boolean for if chat log is at bottom */

var gb_fps_on = false;

function Disconnect()
{
	gi_user_id = 0;

	gs_media_server = "";
	gi_server_users = 0;
	gs_server_name = "";

	go_room_record = new Object();
	ga_users_room = new Array();
	ga_user_list = new Array();
	ga_room_list = new Array();
}
/**
 * Protocol -  Server Info (sinf)
 * 
 * 32bit Version
 * 8bit pString
 *
 * @param --
 * 
 * @return --
 */
function ServerInfo()
{
	getLong(); /** version */
	gs_server_name = getStr(getByte());
	UpdateStatus();
}



/**
 * Protocol -  User Logoff (bye )
 * 
 * 16bit number of users on server
 *
 * @param --
 * 
 * @return --
 */
function UserLogoff()
{
	gi_server_users = getShort();
	UpdateUserCount(gi_server_users, ga_users_room.length);
}

/**
 * Protocol -  User Logon (log )
 * 
 * 16bit number of users on server
 *
 * @param --
 * 
 * @return --
 */
async function UserLogon()
{
	gi_server_users = getShort();
	UpdateUserCount(gi_server_users, ga_users_room.length);
}

/**
 * Protocol -  User Exit (eprs)
 *
 * @param usrID		- User ID of person leaving room 
 * 
 * @return --
 */
function UserExit(usrID)
{
	for (var i = 0; i < ga_users_room.length; i++)
	{
		if (ga_users_room[i].userID == usrID)
		{
			DeleteBubbles(ga_users_room[i]);

			//debug( "User Left:" + ga_users_room[i].name);
			ga_users_room.remove(i);
			UpdateUserCount(gi_server_users, ga_users_room.length);
			return;
		}
	}
}

/**
 * Protocol -  User Enter current room (wprs)
 *
 *  - User info structure
 *
 * @param --
 * 
 * @return --
 */
function UserEnter()
{
	var nbrUsers = buffer.length / 124;
	if (nbrUsers > 255)
	{
		return;
	}

	var user = new Object();

	user.userID = getLong(); /** Unique User ID */
	user.posY = getShort(); /** Applies to gObject */
	user.posX = getShort();
	user.propSpec = getStr(72);
	user.roomID = getShort(); /** Applies to socket, not gObject */
	user.faceNbr = getShort(); /** Applies to Person (gObject subtype) */
	user.colorNbr = getShort();
	user.avatarType = getShort();
	user.avatarFlags = getShort();
	user.nbrProps = getShort();
	user.name = getStr(32); /** Applies to Person */
	user.name = user.name.substr(1, user.name.charCodeAt(0));

	user.text = "";
	user.bubble = timer_start();

	//debug( "User Entered:" + user.name );

	ga_users_room.push(user);
	UpdateUserCount(gi_server_users, ga_users_room.length);
}


async function UserListAll(nbrUsers)
{
	ga_user_list = new Array();
	// gs_most_popular_room = await mostFrequentRoomID(ga_user_list);
	if (nbrUsers > 0)
	{
		for (var i = 0; i < nbrUsers; i++)
		{
			var user = new Object();

			user.userID = getLong();
			user.userStat = getShort();
			user.roomID = getShort();
			user.nameLen = getByte();
			user.name = getStr(user.nameLen);
			getStr(Math.abs((user.nameLen % 4) - 3));

			//debug(i + " userID: " + user.userID);
			//debug(i + " stat: " + user.userStat);
			//debug(i + " room: " + user.roomID);
			//debug(i + " name: " + user.name);

			ga_user_list.push(user);
		}

	}

	UpdateUserList(ga_user_list, ga_room_list);
}

async function mostFrequentRoomID(userList)
{
	let roomCount = {};

	// Count the occurrences of each roomID
	userList.forEach(user =>
	{
		const roomID = user.roomID;
		if (roomCount[roomID])
		{
			roomCount[roomID]++;
		} else
		{
			roomCount[roomID] = 1;
		}
	});

	// Find the roomID with the highest count
	let maxCount = 0;
	let mostFrequentRoomID = null;
	for (let roomID in roomCount)
	{
		if (roomCount[roomID] > maxCount)
		{
			maxCount = roomCount[roomID];
			mostFrequentRoomID = roomID;
		}
	}

	return mostFrequentRoomID;
}


function RoomsListAll(nbrRooms)
{
	ga_room_list = new Array();
	if (nbrRooms > 0)
	{
		for (var i = 0; i < nbrRooms; i++)
		{
			var room = new Object();

			room.roomID = getLong();
			room.flags = getShort();
			room.pop = getShort();

			room.nameLen = getByte();
			room.name = getStr(room.nameLen);

			getStr(Math.abs((room.nameLen % 4) - 3));

			//debug(i + " name: " + room.name)
			//debug(i + "   id: " + room.roomID);
			//debug(i + "  pop: " + room.pop);

			ga_room_list.push(room);
		}
	}

	UpdateRoomList(ga_room_list);
}


/**
 * Protocol -  User List (rprs)
 *
 *  - User info structure array
 *
 * @param --
 * 
 * @return --
 */
function UserList(nbrUsers)
{
	ga_users_room = new Array();
	if (nbrUsers > 255)
	{
		return;
	}

	for (var i = 0; i < nbrUsers; i++)
	{
		var user = new Object();

		user.userID = getLong(); /** Unique User ID */
		user.posY = parseInt(getShort()); /** Applies to gObject */
		user.posX = parseInt(getShort());
		user.prop = new Array();

		//user.propSpec = getStr( 72 );
		for (var p = 0; p < 9; p++)
		{
			var prop = new Object();
			prop.ID = getLong();
			prop.CRC = getLong();
			prop.requested = false;
			prop.requestTime = 0;

			user.prop.push(prop);
		}

		user.roomID = getShort(); /** Applies to socket, not gObject */
		user.faceNbr = getShort(); /** Applies to Person (gObject subtype) */
		user.colorNbr = getShort();
		user.avatarType = getShort();
		user.avatarFlags = getShort();
		user.nbrProps = getShort();
		user.name = getStr(32); /** Applies to Person */
		user.name = user.name.substr(1, user.name.charCodeAt(0));

		//debug( "User:" + user.name);

		ga_users_room.push(user);
	}

	UpdateUserCount(gi_server_users, ga_users_room.length);

	RequestUserProps(ga_users_room);
}

/**
 * Protocol -  room description (room)
 *
 *  - User info structure array
 *
 * @param --
 * 
 * @return --
 */
function RoomDesc()
{
	go_room_record.roomFlags = getLong();
	go_room_record.facesID = getLong();
	go_room_record.roomID = getShort(); /** Room Number */

	var roomNameOfst = getShort();
	var pictNameOfst = getShort();
	var artistNameOfst = getShort();
	var passwordOfst = getShort();

	go_room_record.nbrHotspots = getShort(); /** Number of hot spots (doors & such) */

	var hotspotOfst = getShort();

	go_room_record.nbrPictures = getShort(); /** Number of attached pictures */

	var pictureOfst = getShort();

	go_room_record.nbrDrawCmds = getShort(); /** Number of draw commands */

	var firstDrawCmd = getShort();

	go_room_record.nbrPeople = getShort(); /** Number of people in room */
	go_room_record.nbrLProps = getShort(); /** Loose Prop Objects */

	var firstLProp = getShort();
	var reserved = getShort(); /** keep structure 4-byte aligned */
	var lenVars = getShort();

	var tmp = buffer;

	buffer = buffer.substr(roomNameOfst, buffer.length - roomNameOfst);
	go_room_record.roomName = getStr(getByte());

	buffer = tmp.substr(pictNameOfst, tmp.length - pictNameOfst);
	go_room_record.roomPic = getStr(getByte());

	UpdateStatus();

	debug("Room Name:" + go_room_record.roomName,);
	debug("Pic Name:" + go_room_record.roomPic);

	GetPicture(gs_media_server + go_room_record.roomPic);
}

/**
 * Protocol -  User List (HTTP)
 *
 *  - pString 	- HTTP URL to media server
 *
 * @param --
 * 
 * @return --
 */
function HTTPServer()
{
	var dat = getStr(buffer.length - 1);
	gs_media_server = dat;
}

/**
 * Protocol -  Server/User Talk (talk)
 *
 *  - Talk Structure
 *
 * @param --
 * 
 * @return --
 */
function Talk()
{
	var dat = getStr(buffer.length - 1);
	debug(dat);
}



/**
 * Protocol -  Server/User Encrypted Talk (xtlk)
 *
 *  - XTalk Structure
 *
 * @param --
 * 
 * @return --
 */
function XTalk(usrID)
{
	var len = getShort();
	var dat = getStr(len - 3);
	var text = Decrypt(dat);

	for (var i = 0; i < ga_users_room.length; i++)
	{
		if (ga_users_room[i].userID == usrID)
		{
			CreateUserBubble(ga_users_room[i], text);

			// create p element and append to chat log dom
			let new_msg = document.createElement("div")
			new_msg.style.wordBreak = "break-word"
			new_msg.classList.add("right-swing");
			let color = userColorHex(ga_users_room[i].colorNbr);

			// Log chat styling
			// roboto msg text <span style="font-weight:300;font-family: 'Noto Sans', sans-serif !important;">${text}</span>


			let userNameDiv = document.createElement("span");
			userNameDiv.style.fontWeight = "500";
			userNameDiv.style.color = color;
			userNameDiv.style.textShadow = `2.22px 2.22px 0px ${darkenColor(color, 145)}`;
			userNameDiv.innerHTML = `${ga_users_room[i].name}: `;

			let msgDiv = document.createElement("span");
			msgDiv.style.fontWeight = "300";
			msgDiv.style.color = "var(--font-color)";
			msgDiv.style.textShadow = "none";
			msgDiv.innerHTML = text;

			new_msg.appendChild(userNameDiv);
			new_msg.appendChild(msgDiv);

			gb_log_bottom = ge_log.scrollHeight - ge_log.scrollTop <= ge_log.clientHeight + 5;

			ge_log.appendChild(new_msg)

			if (gb_log_bottom)
			{
				ge_log.scrollTop = ge_log.scrollHeight;
			}
			return;
		}
	}
}

function UserMove(usrID)
{
	var posY = parseInt(getShort());
	var posX = parseInt(getShort());

	for (var i = 0; i < ga_users_room.length; i++)
	{
		if (ga_users_room[i].userID == usrID)
		{
			DeleteBubbles(ga_users_room[i]);

			ga_users_room[i].posX = posX;
			ga_users_room[i].posY = posY;
			return;
		}
	}
}


/**
 * Protocol -  User Move to position in room (uLoc)
 *
 *  - User Move structure 
 *
 * @param --
 * 
 * @return --
 */
function DoMove(posx, posy)
{
	var out = new Array(12 + 4);
	var ofst = 0;

	ofst = putLong(out, MSG_USERMOVE, ofst);
	ofst = putLong(out, 4, ofst); /**  length (128 fixed)    */
	ofst = putLong(out, gi_user_id, ofst); /**  user ID (unused)      */

	ofst = putShort(out, posy, ofst);
	ofst = putShort(out, posx, ofst);

	sendData(out);

	for (var i = 0; i < ga_users_room.length; i++)
	{
		if (ga_users_room[i].userID == gi_user_id)
		{
			DeleteBubbles(ga_users_room[i]);
			ga_users_room[i].posX = posx;
			ga_users_room[i].posY = posy;
			return;
		}
	}

}


/**
 * Protocol -  Client Encrypted Talk (xtlk)
 *
 *  - User Encrypted Talk structure 
 *
 * @param --
 * 
 * @return --
 */
function DoXTalk(text)
{

	if (text.length > 240)
	{
		text = text.slice(0, 240);
	}
	if (text.length < 1)
		return;

	var out = new Array(12 + text.length + 3);
	var ofst = 0;

	ofst = putLong(out, MSG_XTALK, ofst);
	ofst = putLong(out, text.length + 3, ofst); /**  length (128 fixed)   */
	ofst = putLong(out, gi_user_id, ofst); /**  user ID (unused)     */

	ofst = putShort(out, text.length + 3, ofst);
	ofst = putStr(out, Encrypt(text), text.length + 1, ofst);


	sendData(out);
}

function handleChatMessage()
{
	const messageInput = Id('speekMsg');
	const message = messageInput.value.trim();

	if (message.startsWith("~"))
	{
		const commandText = message.slice(1);
		const words = commandText.split(' ');
		const command = words[0];
		const parameters = words.slice(1);
		executeCommand(command, parameters);
	} else
	{
		DoXTalk(message);
	}

	// Clear the input box after sending the message
	messageInput.value = "";
}


function RequestUserList()
{
	var out = new Array(12);
	var ofst = 0;
	ofst = putLong(out, MSG_LISTOFALLUSERS, ofst);
	ofst = putLong(out, 0x00000000, ofst); /**  length (0 fixed)   */
	ofst = putLong(out, gi_user_id, ofst); /**  user ID      */

	//  debug("Pong sent");  
	sendData(out);
}



function RequestRoomList()
{
	var out = new Array(12);
	var ofst = 0;
	ofst = putLong(out, MSG_LISTOFALLROOMS, ofst);
	ofst = putLong(out, 0x00000000, ofst); /**  length (0 fixed)   */
	ofst = putLong(out, gi_user_id, ofst); /**  user ID      */

	//  debug("Pong sent");  
	sendData(out);
}


function GotoRoom(roomID)
{
	var out = new Array(14);
	var ofst = 0;
	ofst = putLong(out, MSG_ROOMGOTO, ofst);
	ofst = putLong(out, 2, ofst); /**  length (0 fixed)   */
	ofst = putLong(out, gi_user_id, ofst); /**  user ID      */
	ofst = putShort(out, roomID, ofst); /**  room ID      */

	debug("Goto: " + roomID);
	sendData(out);
}



/**
 * Protocol -  Pong (pong)
 *
 *  - User pong structure 
 *
 * @param --
 * 
 * @return --
 */
function Pong()
{
	var out = new Array(12);
	var ofst = 0;
	ofst = putLong(out, MSG_PONG, ofst);
	ofst = putLong(out, 0x00000000, ofst); /**  length (128 fixed)   */
	ofst = putLong(out, 0x00000000, ofst); /**  user ID (unused)     */

	//  debug("Pong sent");  
	sendData(out);
}



/**
 * Protocol -  Registration (regi)
 *
 *  - User Registration structure 
 *
 * @param --
 * 
 * @return --
 */
function Registration()
{

	/**   build logon packet   */
	var out = new Array(128 + 12);
	var ofst = 0;

	// PUID = 2000000000 
	// regi:getRandomInt(100,2147483647)

	var seed = 214748367 + (100 * Math.random());
	var regCRC = genRegCRC(swapL(seed));
	var regCTR = genRegCounter(seed, regCRC);

	var puidCRC = genRegCRC(swapL(2000000000));
	var puidCTR = genRegCounter(2000000000, puidCRC);


	/**  header   */
	//  ofst = putStr(out, "iger",  4, ofst);  /** registration  */
	ofst = putLong(out, MSG_LOGON, ofst);
	ofst = putLong(out, 0x00000080, ofst); /**  length (128 fixed)   */
	ofst = putLong(out, 0x00000000, ofst); /**  user ID (unused)     */

	ofst = putLong(out, regCRC, ofst); /**  regCRC    */
	ofst = putLong(out, regCTR, ofst); /**  regCode   */

	//ofst = putLong( out, 0x0778e8ac, ofst );    /**  regCRC    */
	//ofst = putLong( out, 0xf5acd621, ofst );    /**  regCode   */

	ofst = putByte(out, gs_username.length, ofst);
	ofst = putStr(out, gs_username, 31, ofst); /**  user   */

	ofst = putStr(out, 0x00, 32, ofst); /**  pass    */

	//ofst = putLong( out, 0x80000002, ofst ); /**  aux flags  */
	ofst = putLong(out, 0x80000004, ofst); /**  aux flags  */

	ofst = putLong(out, puidCRC, ofst); /**  puidCRC         */
	ofst = putLong(out, puidCTR, ofst); /**  puidCode        */

	//ofst = putLong( out, swapL(0x44593bca), ofst );        /**  puidCRC         */
	//ofst = putLong( out, 0xcee6c6be, ofst );        /**  puidCode        */
	//92 

	ofst = putLong(out, 0x00011940, ofst); /**  demo elapsed   96 */
	ofst = putLong(out, 0x00011940, ofst); /**  total elapsed  100 */
	ofst = putLong(out, 0x00011940, ofst); /**  demo limit     104 */

	ofst = putShort(out, 0x0000, ofst); /**  roomID         108 */
	ofst = putStr(out, "PC4237", 6, ofst); /**  client ID      110 */


	ofst = putLong(out, 0x00000000, ofst); /**  ulRequestedprotocolVers  114  */
	ofst = putLong(out, 0x00000041, ofst); /**  ulDloadCaps  118  */

	var retry = false;

	// retry  with  0x00000111
	if (retry == true)
	{
		ofst = putLong(out, 0x00000111, ofst); /**  ulUploadCaps   */
	} else
	{
		ofst = putLong(out, 0x00000151, ofst); /**  ulUploadCaps   */
	}
	ofst = putLong(out, 0x00000001, ofst); /**  ul2DEngineCaps     */
	ofst = putLong(out, 0x00000001, ofst); /**  ul2dGraphicsCaps   */
	ofst = putLong(out, 0x00000000, ofst); /**  ul3DEngineCaps     */

	///  debug("Registration sent");  
	sendData(out);
}