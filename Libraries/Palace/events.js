"use strict";


/**
* Palace Protocol Events taken from server plugin API
* 
* 32bit identifiers in header messages
*
*/
var MSG_ALTLOGONREPLY = 0x72657032 /**  'rep2' */
var MSG_ASSETNEW = 0x61417374 /**  'aAst' Acknowledge Asset - provides type and ID#, sent in response to user->'rAst' */
var MSG_ASSETQUERY = 0x71417374 /**  'qAst' */
var MSG_ASSETREGI = 0x72417374 /**  'rAst' */
var MSG_ASSETSEND = 0x73417374 /**  'sAst' Send Asset - provides asset to user. */

var MSG_AUTHENTICATE = 0x61757468 /**  'auth' */
var MSG_AUTHRESPONSE = 0x61757472 /**  'autr' */
var MSG_AVATARFLAGS = 0x66417661 /**  'fAva' */
var MSG_AVATARQUERY = 0x71417661 /**  'qAva' */
var MSG_AVATARSEND = 0x73417661 /**  'sAva' */

var MSG_BADAUTH = 0x6662646e /**  'fbdn' */
var MSG_BLOWTHRU = 0x626c6f77 /**  'blow' */
var MSG_DISPLAYURL = 0x6475726c /**  'durl' */
var MSG_DIYIT = 0x72796974 /**  'ryit' */
var MSG_TIYID = 0x74697972 /**  'ryit' */

var MSG_DOORLOCK = 0x6c6f636b /**  'lock' Lock Door */

var MSG_DOORUNLOCK = 0x756e6c6f /**  'unlo' Unlock Door */
var MSG_DRAW = 0x64726177 /**  'draw' Add drawing command to object layer (or blow up) */
var MSG_EXTENDEDINFO = 0x73496e66 /**  'sInf' Extends server info packet */
var MSG_FILENOTFND = 0x666e6665 /**  'fnfe' File not found error */
var MSG_FILEQUERY = 0x7146696c /**  'qFil' */

var MSG_FILESEND = 0x7346696c /**  'sFil' */
var MSG_GETORSETPREFS = 0x70726566 /**  'pref' */
var MSG_GETORSETPREFSREPLY = 0x70726672   /** 'prfr'*/
var MSG_GETUSERIDENTITY = 0x75696471      /**  'uidq' */
var MSG_GETUSERIDENTITYREPLY = 0x75696472 /**  'uidr' */

var MSG_GMSG = 0x676d7367 /**  'gmsg' */
var MSG_HTTPSERVER = 0x48545450 /**  'HTTP' HTTP Server URL */
var MSG_INITCONNECTION = 0x634c6f67 /**  'cLog' */ /**  XXX obsolete?? */
var MSG_KILLUSER = 0x6b696c6c /**  'kill' */
var MSG_LISTOFALLROOMS = 0x724c7374 /**  'rLst' */

var MSG_LISTOFALLUSERS = 0x754c7374 /**  'uLst' */
var MSG_LOGOFF = 0x62796520 /**  'bye ' Sign off */
var MSG_LOGON = 0x72656769 /**  'regi' Sign on */
var MSG_NAVERROR = 0x73457272 /**  'sErr' Server error, such as navigation refused */
var MSG_NOOP = 0x4e4f4f50 /**  'NOOP' No operation; no response */

var MSG_PICTDEL = 0x46505371 /**  'FPSq' */
var MSG_PICTMOVE = 0x704c6f63 /**  'pLoc' */
var MSG_PICTNEW = 0x6e506374 /**  'nPct' */
var MSG_PICTSETDESC = 0x73506374 /**  'sPct' */
var MSG_PING = 0x70696e67 /**  'ping' See if server is there */

var MSG_PONG = 0x706f6e67 /**  'pong' Response to ping */
var MSG_PROPDEL = 0x64507270 /**  'dPrp' */
var MSG_PROPMOVE = 0x6d507270 /**  'mPrp' */
var MSG_PROPNEW = 0x6e507270 /**  'nPrp' */
var MSG_PROPSETDESC = 0x73507270 /**  'sPrp' */

var MSG_RESPORT = 0x72657370 /**  'resp' For HTTP tunneling */
var MSG_RMSG = 0x726d7367 /**  'rmsg' */
var MSG_ROOMDESC = 0x726f6f6d /**  'room' Current Room Description */
var MSG_ROOMDESCEND = 0x656e6472 /**  'endr' End Room Description */
var MSG_ROOMGOTO = 0x6e617652 /**  'navR' Navigation to new room */

var MSG_ROOMNEW = 0x6e526f6d /**  'nRom' New room request */
var MSG_ROOMSETDESC = 0x73526f6d /**  'sRom' Set room description */
var MSG_SERVERDOWN = 0x646f776e /**  'down' Server is going down */
var MSG_SERVERINFO = 0x73696e66 /**  'sinf' Server Info Packet */
var MSG_SERVERUP = 0x696e6974 /**  'init' Server is going up */

var MSG_SMSG = 0x736d7367 /**  'smsg' */
var MSG_SPOTDEL = 0x6f705364 /**  'opSd' Delete Spot */
var MSG_SPOTMOVE = 0x636f4c73 /**  'coLs' Update spot location */
var MSG_SPOTNEW = 0x6f70536e /**  'opSn' New spot request */
var MSG_SPOTSETDESC = 0x6f705373 /**  'opSs' Set spot description */

var MSG_SPOTSTATE = 0x73537461 /**  'sSta' Update state (and possibly
                                                picture) for hotspot */
var MSG_SUPERUSER = 0x73757372 /**  'susr' */
var MSG_TALK = 0x74616c6b /**  'talk' Talk */
var MSG_TIMYID = 0x74696d79 /**  'timy' This is my ID; for reconnecting dropped HTTP users */
var MSG_TIYID = 0x74697972 /**  'tiyr' This is your id# */

var MSG_TROPSER = 0x70736572 /**  'pser' For HTTP tunneling */
var MSG_USERCOLOR = 0x75737243 /**  'usrC' Change user parameters */
var MSG_USERDESC = 0x75737244 /**  'usrD' */
var MSG_USERENTER = 0x77707273 /**  'wprs' New Person in Current Room */
var MSG_USEREXIT = 0x65707273 /**  'eprs' Person is leaving your Room */

var MSG_USERFACE = 0x75737246 /**  'usrF' Change user face */
var MSG_USERLIST = 0x72707273 /**  'rprs' Room Person Descriptions */
var MSG_USERLOG = 0x6c6f6720 /**  'log ' User logged on */
var MSG_USERMOVE = 0x754c6f63 /**  'uLoc' User has changed position */
var MSG_USERNAME = 0x7573724e /**  'usrN' New user name */

var MSG_USERNEW = 0x6e707273 /**  'nprs' */
var MSG_USERPROP = 0x75737250 /**  'usrP' Change user prop */
var MSG_USERSTATUS = 0x75537461 /**  'uSta' */
var MSG_VERSION = 0x76657273 /**  'vers' Mansion Version Number */
var MSG_WHISPER = 0x77686973 /**  'whis' Whisper */

var MSG_WMSG = 0x776d7367 /**  'wmsg' */
var MSG_XTALK = 0x78746c6b /**  'xtlk' */
var MSG_XWHISPER = 0x78776973 /**  'xwis' */

