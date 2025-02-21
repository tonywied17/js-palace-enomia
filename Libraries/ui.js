/**
 * Update user counter text display
 * 
 * @param server	Total online on this server		 
 * @param room		Total in current room
 *
 * @return 	--
 */
function UpdateUserCount(server, room)
{
	Id('textUserCount').innerHTML = "People: <b>" + room + "/" + server + "<b>";
	document.title = `${gs_server_name} (${room + "/" + server})`;
}

/**
 * Update user server info text display
 * 
 * @param status	Current connection status (Connecting/Disconnected/etc..)	 
 *
 * @return 	--
 */
function UpdateStatus(status)
{
	if (go_room_record.roomName)
	{
		Id('textStatus').innerHTML = gs_server_name + " - " + go_room_record.roomName;
	} else if (gs_server_name)
	{
		Id('textStatus').innerHTML = gs_server_name;

	} else
	{
		Id('textStatus').innerHTML = status;
	}
}

/**
 * Update User list 
 * 
 * @param users	Users Object	 
 *
 * @return 	--
 */
function UpdateUserList(users, rooms)
{
	let userList = Id("client-user-list");
	let filterText = Id("userFilter").value.toLowerCase();

	if (!Array.isArray(users))
	{
		users = window.ga_user_list;
	}

	users.sort((a, b) => b.userStat - a.userStat);

	userList.innerHTML = '';
	let resultsFound = false;

	for (var i = 0; i < users.length; i++)
	{
		var roomName = "";

		for (var r = 0; r < rooms.length; r++)
		{
			if (rooms[r].roomID == users[i].roomID)
			{
				roomName = rooms[r].name;
			}
		}

		let userName = users[i].name.toLowerCase();
		if (!userName.includes(filterText))
		{
			continue;
		}

		resultsFound = true;

		let peoplesDivContainer = document.createElement('div');
		peoplesDivContainer.style.marginTop = '10px';


		let peoplesDiv = document.createElement('div');
		peoplesDiv.style.display = 'flex';
		peoplesDiv.style.alignItems = 'center';
		peoplesDiv.style.width = '100%';
		peoplesDiv.style.gap = '2';
		peoplesDivContainer.classList.add('people-div');

		let personName = document.createElement('div');
		personName.style.flexGrow = '1';
		personName.innerHTML = `
  		${users[i].userStat === 3 ? '<i class="fa-solid fa-crown" style="color: rgb(252 211 77);"></i>' :
				users[i].userStat === 2 ? '<i style="color: rgb(217 119 6);" class="fa-solid fa-hat-wizard"></i>' :
					users[i].userStat === 1 ? '<i style="color: rgb(2 132 199);" class="fa-solid fa-hat-wizard"></i>' :
						''}
  		${escapeHTML(users[i].name)}
		`;

		let roomNameDiv = document.createElement('div');
		roomNameDiv.innerHTML = `${roomName}`;
		roomNameDiv.style.fontWeight = '200';
		roomNameDiv.style.marginRight = '5px';
		roomNameDiv.style.fontSize = '0.8rem';

		let whisperUser = document.createElement('button');
		whisperUser.classList.add('list-button');
		whisperUser.style.maxWidth = 'fit-content';
		whisperUser.style.paddingLeft = '10px';
		whisperUser.style.marginLeft = 'auto';
		whisperUser.innerHTML = '<i class="fa-solid fa-comment-dots" style="color: rgb(168 85 247);"></i>';
		whisperUser.onclick = function (userName, userID)
		{
			return function ()
			{
				gb_do_xwhisper = true;
				alert("Your next message will whisper: " + userName + " (" + userID + ")");
			};
		}(users[i].name, users[i].userID);

		let gotoPerson = document.createElement('button');
		gotoPerson.classList.add('cursor-pointer', 'hover:opacity-80', 'list-button');
		gotoPerson.style.marginLeft = 'auto';
		gotoPerson.style.paddingLeft = '10px';
		gotoPerson.style.paddingRight = '5px';
		gotoPerson.innerHTML = '<i class="fa-solid fa-person-walking-arrow-right" style="color: rgb(22 163 74);"></i>';
		gotoPerson.onclick = function (roomID)
		{
			return function ()
			{
				window.GotoRoom(roomID);
			};
		}(users[i].roomID);

		peoplesDiv.appendChild(personName);
		peoplesDiv.appendChild(roomNameDiv);
		peoplesDiv.appendChild(whisperUser);
		peoplesDiv.appendChild(gotoPerson);
		peoplesDivContainer.appendChild(peoplesDiv);
		userList.appendChild(peoplesDivContainer);
	}

	if (!resultsFound)
	{
		console.log("No results found");
		userList.innerHTML = '<h3>No Results</h3>';
	}
}

/**
 * Update Room list 
 * 
 * @param Rooms Object	 
 *
 * @return 	--
 */
function UpdateRoomList(rooms)
{
	let roomList = Id("client-room-list");
	let filterText = Id("roomFilter").value.toLowerCase();

	if (!Array.isArray(rooms))
	{
		rooms = window.ga_room_list;
	}

	roomList.innerHTML = '';
	let resultsFound = false;

	for (var i = 0; i < rooms.length; i++)
	{
		let rName = rooms[i].name.toLowerCase();
		if (!rName.includes(filterText))
		{
			continue;
		}

		resultsFound = true;

		let ge_rooms_divContainer = document.createElement('div');
		ge_rooms_divContainer.style.marginTop = '10px';

		let ge_rooms_div = document.createElement('div');
		ge_rooms_div.style.display = 'flex';
		ge_rooms_div.style.width = '100%';
		ge_rooms_div.style.gap = '2';
		ge_rooms_div.style.alignItems = 'center';
		ge_rooms_divContainer.classList.add('room-div');

		let roomNameContainer = document.createElement('div');
		roomNameContainer.style.display = 'flex';
		roomNameContainer.style.flexGrow = '1';
		roomNameContainer.style.alignItems = 'center';

		let roomPop = document.createElement('span');
		roomPop.style.fontWeight = '200';
		roomPop.style.background = 'var(--client-color-2)';
		roomPop.style.marginRight = '5px';
		roomPop.style.padding = '1px 3px';
		roomPop.style.borderRadius = '0.25rem';
		roomPop.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
		roomPop.innerHTML = `<i class="fa-solid fa-person"></i> ${rooms[i].pop}`;

		let roomName = document.createElement('div');
		roomName.style.flexGrow = '1';
		roomName.textContent = rooms[i].name.normalize();

		let gotoRoom = document.createElement('button');
		gotoRoom.classList.add('list-button');
		gotoRoom.style.maxWidth = 'fit-content';
		gotoRoom.style.padding = '0 10px';
		gotoRoom.style.marginLeft = 'auto';
		gotoRoom.innerHTML = '<i class="fa-solid fa-person-walking-arrow-right" style="color: rgb(22 163 74);"></i>';
		gotoRoom.onclick = function (roomID)
		{
			return function ()
			{
				window.GotoRoom(roomID);
			};
		}(rooms[i].roomID);

		ge_rooms_div.appendChild(roomNameContainer);
		ge_rooms_div.appendChild(gotoRoom);
		roomNameContainer.appendChild(roomPop);
		roomNameContainer.appendChild(roomName);
		ge_rooms_divContainer.appendChild(ge_rooms_div);
		roomList.appendChild(ge_rooms_divContainer);
	}

	if (!resultsFound)
	{
		console.log("No results found");
		roomList.innerHTML = '<h3>No Results</h3>';
	}
}

/**
 * Convert color number to hex color
 * @param {*} color - index number of users smiley color
 */
function userColorHex(color)
{
	var hexColor =
		(color === 0) ? "#889ad8" :
			(color === 1) ? "#8da4c3" :
				(color === 2) ? "#a2c4cf" :
					(color === 3) ? "#a2cfcd" :
						(color === 4) ? "#aad4c2" :
							(color === 5) ? "#b7dac0" :
								(color === 6) ? "#c6dbba" :
									(color === 7) ? "#d9e2c5" :
										(color === 8) ? "#cfcda5" :
											(color === 9) ? "#c8b396" :
												(color === 10) ? "#cca79c" :
													(color === 11) ? "#cfa2a7" :
														(color === 12) ? "#c691aa" :
															(color === 13) ? "#bb7eb1" :
																(color === 14) ? "#9a59a8" :
																	(color === 15) ? "#8461ac" :
																		"lightblue";

	return hexColor;
}

/**
 * Darken color hex by amount
 * @param {*} color hexadecimal color
 * @param {*} amount 
 * @returns 
 */
function darkenColor(color, amount)
{
	var hex = color.slice(1);
	var rgb = parseInt(hex, 16);

	var r = (rgb >> 16) & 0xFF;
	var g = (rgb >> 8) & 0xFF;
	var b = rgb & 0xFF;

	r = Math.max(r - amount, 0);
	g = Math.max(g - amount, 0);
	b = Math.max(b - amount, 0);

	var darkenedHex = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

	return darkenedHex;
}

/**
 * Lighten color hex by amount
 * @param {*} color hexadecimal color
 * @param {*} amount 
 * @returns 
 */
function lightenColor(color, amount)
{
	var hex = color.slice(1);
	var rgb = parseInt(hex, 16);

	var r = (rgb >> 16) & 0xFF;
	var g = (rgb >> 8) & 0xFF;
	var b = rgb & 0xFF;

	r = Math.min(r + amount, 255);
	g = Math.min(g + amount, 255);
	b = Math.min(b + amount, 255);

	var lightenedHex = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

	return lightenedHex;
}

/**
 * HEX to RGBA
 * @param {*} hex 
 * @param {*} opacity 
 * @returns 
 */
function hexToRGBA(hex, opacity)
{
	hex = hex.replace('#', '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Convert to char code then throw in html tag if special character
 * @param {*} text 
 * @returns 
 */
function escapeHTML(text)
{
	return text.replace(/[\u0000-\uFFFF]/g, function (char)
	{
		return `&#${char.charCodeAt(0)};`;
	});
}