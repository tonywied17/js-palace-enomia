/**
 * HTML5 - Palace Client
 * Copyright (C) 2013-2016 - Martyn Gilbertson. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 *
 * <b>         Storage.js</b>
 * <p>         Palace Chat - Local Storage Routines</p>
 * @version    1.0.0
 * @since      25 Feb 2016
 * @author     Martyn Gilbertson
 * <p>
 * Last modified by -
 *  v1.0.0   - 25 Feb 2016
 *          [+] Initial release
 * </p>
 **/
"use strict";


/** Local Configuration */
var go_local_store = 0;


/**
 * Load user Configuration
 * 
 * @param --
 * 
 * @return bit		true if configuration loaded
 */
function load_config() {
	gs_username = "Enter Name";
	gs_server = "chat.epalaces.com:7777";


	// Default Window Positions
	var connectLeft = "10%",
		connectTop = "40%",
		roomsLeft = "10%",
		roomsTop = "69px",
		usersLeft = "20%",
		usersTop = "69px",
		logLeft = "70%",
		logTop = "69px",
		chatLeft = "3%",
		chatTop = "0",
		prefsLeft = "25%",
		prefsTop = "69px",
		propsLeft = "25%",
		propsTop = "69px";


	//load values from browser storage cache
	if (typeof (Storage) !== "undefined") // MG Disabled - 14-Jul-2023 && window.innerWidth > 900)
	{

		go_local_store = 1;

		if (typeof (localStorage.username) !== "undefined") {
			gs_username = window.localStorage.getItem("username");
		}
		if (typeof (localStorage.server) !== "undefined") {
			gs_server = window.localStorage.getItem("server");
		}


		if (typeof (localStorage.connectTop) !== "undefined") {
			connectTop = window.localStorage.getItem("connectTop");
		}
		if (typeof (localStorage.connectLeft) !== "undefined") {
			connectLeft = window.localStorage.getItem("connectLeft");
		}


		if (typeof (localStorage.usersLeft) !== "undefined") {
			usersLeft = window.localStorage.getItem("usersLeft");
		}
		if (typeof (localStorage.usersTop) !== "undefined") {
			usersTop = window.localStorage.getItem("usersTop");
		}


		if (typeof (localStorage.roomsLeft) !== "undefined") {
			roomsLeft = window.localStorage.getItem("roomsLeft");
		}
		if (typeof (localStorage.roomsTop) !== "undefined") {
			roomsTop = window.localStorage.getItem("roomsTop");
		}

		if (typeof (localStorage.logLeft) !== "undefined") {
			logLeft = window.localStorage.getItem("logLeft");
		}
		if (typeof (localStorage.logTop) !== "undefined") {
			logTop = window.localStorage.getItem("logTop");
		}

		if (typeof (localStorage.prefsLeft) !== "undefined") {
			prefsLeft = window.localStorage.getItem("prefsLeft");
		}
		if (typeof (localStorage.prefsTop) !== "undefined") {
			prefsTop = window.localStorage.getItem("prefsTop");
		}

		if (typeof (localStorage.propsLeft) !== "undefined") {
			propsLeft = window.localStorage.getItem("propsLeft");
		}

		if (typeof (localStorage.propsTop) !== "undefined") {
			propsTop = window.localStorage.getItem("propsTop");
		}

		if (typeof (localStorage.chatLeft) !== "undefined") {
			chatLeft = window.localStorage.getItem("chatLeft");
		}
		if (typeof (localStorage.chatTop) !== "undefined") {
			chatTop = window.localStorage.getItem("chatTop");
		}

	}

	Id('userName').value = gs_username;
	Id('serverAddress').value = gs_server;

	Id("connect").style.left = connectLeft;
	Id("connect").style.top = connectTop;

	Id("rooms").style.left = roomsLeft;
	Id("rooms").style.top = roomsTop;

	Id("users").style.left = usersLeft;
	Id("users").style.top = usersTop;

	Id("log").style.left = logLeft;
	Id("log").style.top = logTop;

	Id("prefs").style.left = prefsLeft;
	Id("prefs").style.top = prefsTop;

	Id("props").style.left = propsLeft;
	Id("props").style.top = propsTop;

	Id("chat").style.left = chatLeft;
	Id("chat").style.top = chatTop;

	// ? Set Window Positions for Mobile
	window.addEventListener('load', () => {

		if (window.innerWidth > 1023) {
			// ? Try to force max height window on desktop for user and room lists, fuck you safari
			Id("client-room-list").style.maxHeight = "100%";
			Id("client-user-list").style.maxHeight = "100%";
			console.log("Desktop UI Set");
		} else {
			// ! Window Positions for Mobile
			connectLeft = "10%", connectTop = "40%",
				roomsLeft = "0", roomsTop = "69px",
				usersLeft = "0", usersTop = "69px",
				logLeft = "0", logTop = "69px",
				chatLeft = "3%", chatTop = "0",
				prefsLeft = "0", prefsTop = "69px",
				propsLeft = "0", propsTop = "69px";

			Id("client-room-list").style.maxHeight = "67vh";
			Id("client-user-list").style.maxHeight = "67vh";
			Id("connect").style.left = connectLeft;
			Id("connect").style.top = connectTop;
			Id("rooms").style.left = roomsLeft;
			Id("rooms").style.top = roomsTop;
			Id("users").style.left = usersLeft;
			Id("users").style.top = usersTop;
			Id("log").style.left = logLeft;
			Id("log").style.top = logTop;
			Id("prefs").style.left = prefsLeft;
			Id("prefs").style.top = prefsTop;
			Id("props").style.left = propsLeft;
			Id("props").style.top = propsTop;
			Id("chat").style.left = chatLeft;
			Id("chat").style.top = chatTop;
			console.log("Mobile UI Set");
		}
	});

}

/**
 * Save user Configuration
 * 
 * @param --
 * 
 * @return bit		true if configuration saved
 */
function save_config() {
	gs_username = Id('userName').value;
	gs_server = Id('serverAddress').value;

	var connectLeft = Id("connect").style.left;
	var connectTop = Id("connect").style.top;

	var roomsLeft = Id("rooms").style.left;
	var roomsTop = Id("rooms").style.top;

	var usersLeft = Id("users").style.left;
	var usersTop = Id("users").style.top;

	var logLeft = Id("log").style.left;
	var logTop = Id("log").style.top;

	var prefsLeft = Id("prefs").style.left;
	var prefsTop = Id("prefs").style.top;

	var propsLeft = Id("props").style.left;
	var propsTop = Id("props").style.top;

	var chatLeft = Id("chat").style.left;
	var chatTop = Id("chat").style.top;




	//store values in cache
	if (go_local_store == 1) {
		try {
			window.localStorage.setItem("username", gs_username);
		} catch (err) {
			alert("Failed to store username");
		}

		try {
			window.localStorage.setItem("server", gs_server);
		} catch (err) {
			alert("Failed to store server");
		}

		try {
			window.localStorage.setItem("connectLeft", connectLeft);
		} catch (err) {
			alert("Failed to store connectLeft");
		}

		try {
			window.localStorage.setItem("connectTop", connectTop);
		} catch (err) {
			alert("Failed to store connectTop");
		}


		try {
			window.localStorage.setItem("roomsLeft", roomsLeft);
		} catch (err) {
			alert("Failed to store roomsLeft");
		}

		try {
			window.localStorage.setItem("roomsTop", roomsTop);
		} catch (err) {
			alert("Failed to store roomsTop");
		}


		try {
			window.localStorage.setItem("usersLeft", usersLeft);
		} catch (err) {
			alert("Failed to store usersLeft");
		}

		try {
			window.localStorage.setItem("usersTop", usersTop);
		} catch (err) {
			alert("Failed to store usersTop");
		}


		try {
			window.localStorage.setItem("logLeft", logLeft);
		} catch (err) {
			alert("Failed to store logLeft");
		}

		try {
			window.localStorage.setItem("logTop", logTop);
		} catch (err) {
			alert("Failed to store logTop");
		}

		try {
			window.localStorage.setItem("prefsLeft", prefsLeft);

		} catch (err) {
			alert("Failed to store prefsLeft");
		}

		try {
			window.localStorage.setItem("prefsTop", prefsTop);
		} catch (err) {
			alert("Failed to store prefsTop");
		}

		try {
			window.localStorage.setItem("propsLeft", propsLeft);
		} catch (err) {
			alert("Failed to store propsLeft");
		}

		try {
			window.localStorage.setItem("propsTop", propsTop);
		} catch (err) {
			alert("Failed to store propsTop");
		}

		try {
			window.localStorage.setItem("chatLeft", chatLeft);
		} catch (err) {
			alert("Failed to store chatLeft");
		}

		try {
			window.localStorage.setItem("chatTop", chatTop);
		} catch (err) {
			alert("Failed to store chatTop");
		}


	}
}