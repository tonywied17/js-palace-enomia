/**
 * Switches the theme of the page, saves to localStorage and loads from localStorage.
 * @param {*} e
 */
// ? Save theme preference to local storage
function saveThemePreference(theme, checked)
{
	localStorage.setItem("theme", theme);
	localStorage.setItem("checked", checked);
}
// ! Operating Theme Preference is Dark Mode
const lovesDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// ? Load theme preference from local storage
function loadThemePreference()
{
	const theme = localStorage.getItem("theme");
	const checked = localStorage.getItem("checked");

	if (theme && checked)
	{
		document.documentElement.setAttribute("data-theme", theme);
		ge_toggle_switch.checked = checked === "true";
	} else
	{
		if (lovesDarkMode)
		{
			document.documentElement.setAttribute("data-theme", "dark");
			ge_toggle_switch.checked = true;
			saveThemePreference("dark", true);
		}
	}
}

// ? Switch theme
function switchTheme(e)
{
	if (e.target.checked)
	{
		document.documentElement.setAttribute("data-theme", "dark");
		saveThemePreference("dark", true);
	} else
	{
		document.documentElement.setAttribute("data-theme", "light");
		saveThemePreference("light", false);
	}
}


// ! Desktop Buttons
const ge_toggle_switch = Class('theme-switch input[type="checkbox"]');
const ge_connect_button = Id('connect-btn');
const ge_users_button = Id('users-btn');
const ge_rooms_button = Id('rooms-btn');
const ge_log_button = Id('log-btn');
const ge_prefs_button = Id('prefs-btn');
const ge_props_button = Id('props-btn');
// ! Mobile Buttons
const ge_connect_button_m = Id('connect-btn-m');
const ge_users_button_m = Id('users-btn-m');
const ge_rooms_button_m = Id('rooms-btn-m');
const ge_log_button_m = Id('log-btn-m');
const ge_prefs_button_m = Id('prefs-btn-m');
const ge_props_button_m = Id('props-btn-m');
const ge_chat_button_m = Id('chat-btn-m');
// ! Window Divs
const ge_connect_div = Id('connect');
const ge_users_div = Id('users');
const ge_rooms_div = Id('rooms');
const ge_log_div = Id('log');
const ge_prefs_div = Id('prefs');
const ge_props_div = Id('props');
const ge_chat_div = Id('chat');
const ge_most_popular_room = Id('mostPopularRoom');

// ? Set initial visibility of connection window
ge_connect_div.style.display = 'block';

// ? Set initial visibility of chat window on mobile
const mobileQuery = window.matchMedia('(max-width: 1023px)');

function handleMobileChange(mobileQuery)
{
	if (mobileQuery.matches)
	{
		ge_chat_div.style.display = 'block';
	} else
	{
		ge_chat_div.style.display = 'none';
	}
}
handleMobileChange(mobileQuery);
mobileQuery.addEventListener('change', handleMobileChange);

// ? Set initial visibility of other windows
ge_users_div.style.display = 'none';
ge_rooms_div.style.display = 'none';
ge_log_div.style.display = 'block';
ge_prefs_div.style.display = 'none';
ge_props_div.style.display = 'none';

// hide log by default for mobile
if (mobileQuery.matches)
{
	ge_log_div.style.display = 'none';
}

// ! Desktop Button Event Listeners
ge_toggle_switch.addEventListener("change", switchTheme, false);
loadThemePreference();

ge_connect_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_connect_div);
	toggleButtonColor(ge_connect_button, ge_connect_div);
	save_config();
});
ge_users_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_users_div);
	toggleButtonColor(ge_users_button, ge_users_div);
	save_config();
});
// ge_most_popular_room.addEventListener('click', () => {
// 	gs_most_popular_room = mostFrequentRoomID(ga_user_list)
// 	GotoRoom(gs_most_popular_room);
// });
ge_rooms_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_rooms_div);
	toggleButtonColor(ge_rooms_button, ge_rooms_div);
	save_config();
});
ge_log_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_log_div);
	toggleButtonColor(ge_log_button, ge_log_div);
	save_config();
});
ge_prefs_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_prefs_div);
	toggleButtonColor(ge_prefs_button, ge_prefs_div);
	save_config();
});
ge_props_button.addEventListener('click', () =>
{
	toggleDivVisibility(ge_props_div);
	toggleButtonColor(ge_props_button, ge_props_div);
	save_config();
});
// ? enter key listeners for user, room list filters and chat message
Id('speekMsg').addEventListener('keypress', (event) =>
{
	if (event.keyCode === 13 || event.key === 'Enter')
	{
		event.preventDefault();
		handleChatMessage();

	}
});
Id('roomFilter').addEventListener('keydown', function (event)
{
	if (event.keyCode === 13 || event.key === 'Enter')
	{
		event.preventDefault()
		RequestRoomList();
	}
});
Id('userFilter').addEventListener('keydown', function (event)
{
	if (event.keyCode === 13 || event.key === 'Enter')
	{
		event.preventDefault()
		RequestUserList();
	}
});

// Id('mostPopularRoom').addEventListener('click', function () {
// 	GotoRoom(gs_most_popular_room);
// });

// ! Mobile Button Event Listeners
ge_connect_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_connect_div);
	toggleButtonColor(ge_connect_button_m, ge_connect_div);
});
ge_users_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_users_div);
	toggleButtonColor(ge_users_button_m, ge_users_div);
});
ge_rooms_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_rooms_div);
	toggleButtonColor(ge_rooms_button_m, ge_rooms_div);
});
ge_log_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_log_div);
	toggleButtonColor(ge_log_button_m, ge_log_div);
});
ge_prefs_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_prefs_div);
	toggleButtonColor(ge_prefs_button_m, ge_prefs_div);
});
ge_props_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_props_div);
	toggleButtonColor(ge_props_button_m, ge_props_div);
});
ge_chat_button_m.addEventListener('click', () =>
{
	toggleDivVisibility(ge_chat_div);
	toggleButtonColor(ge_chat_button_m, ge_chat_div);
});
Id('speekMsgMobile').addEventListener('keypress', (e) =>
{
	if (e.key === "Enter")
	{
		e.preventDefault();
		Id("speakMobile").click();
		Id("speekMsgMobile").value = "";
	}
});

// ? Check initial visibility and update button color accordingly
toggleButtonColor(ge_connect_button, ge_connect_div);
toggleButtonColor(ge_users_button, ge_users_div);
toggleButtonColor(ge_rooms_button, ge_rooms_div);
toggleButtonColor(ge_log_button, ge_log_div);
toggleButtonColor(ge_prefs_button, ge_prefs_div);
toggleButtonColor(ge_props_button, ge_props_div);
// ! Mobile Buttons
toggleButtonColor(ge_connect_button_m, ge_connect_div);
toggleButtonColor(ge_users_button_m, ge_users_div);
toggleButtonColor(ge_rooms_button_m, ge_rooms_div);
toggleButtonColor(ge_log_button_m, ge_log_div);
toggleButtonColor(ge_chat_button_m, ge_chat_div);
toggleButtonColor(ge_prefs_button_m, ge_prefs_div);
toggleButtonColor(ge_props_button_m, ge_props_div);

// ? Function to toggle visibility from navbar
// Set the maximum z-index value you want to reach before cycling
const maxZIndexValue = 100;
let currentMaxZIndex = 1;


function toggleDivVisibility(div)
{
	// ? Function to find the maximum z-index on the page
	function getMaxZIndex()
	{
		var allElements = document.getElementsByTagName("*");
		var maxZIndex = 0;

		for (var i = 0; i < allElements.length; i++)
		{
			var zIndex = document.defaultView.getComputedStyle(allElements[i], null).getPropertyValue("z-index");
			if (!isNaN(zIndex) && zIndex > maxZIndex)
			{
				maxZIndex = zIndex;
			}
		}

		return maxZIndex;
	}

	// ? Function to reset z-index to "auto" for all elements except the target div
	function resetOtherZIndexes(targetDiv)
	{
		var allElements = document.getElementsByTagName("*");

		for (var i = 0; i < allElements.length; i++)
		{
			var element = allElements[i];
			if (element !== targetDiv)
			{
				element.style.zIndex = 'auto';
			}
		}
	}

	if (div.style.display === 'block')
	{
		div.style.animation = 'scale-center-out .2s ease 0s 1 normal forwards';

		setTimeout(function ()
		{
			div.style.display = 'none';
			div.style.animation = '';
		}, 200);
	} else
	{
		div.style.display = 'block';
		div.style.animation = 'scale-center .2s ease 0s 1 normal forwards';

		if (currentMaxZIndex >= maxZIndexValue)
		{
			currentMaxZIndex = 1;
		} else
		{
			currentMaxZIndex++;
		}

		resetOtherZIndexes(div);
		div.style.zIndex = currentMaxZIndex;

		if (div === ge_users_div)
		{
			window.RequestUserList();
		}
		if (div === ge_rooms_div)
		{
			window.RequestRoomList();
		}
		if (div === ge_log_div)
		{
			ge_log.scrollTop = ge_log.scrollHeight;
		}
	}
}

// ? Function to toggle button color
function toggleButtonColor(button, div)
{

	setTimeout(() =>
	{
		if (div.style.display === 'block')
		{
			// button.style.boxShadow = 'inset 0 1px 10px var(--client-color-2), inset 0 0 0 1px var(--client-color-1)';
			button.style.background = '#dce5ec67';
			button.style.color = '#000000';
		} else
		{
			button.style.background = '';
			button.style.color = '';
		}
	}, 200);



}

/**
 * ? Window/Button Toggler for closing windows with the X icon.
 * @param {*} divId the id you want to toggle
 */
function toggleDivIdVisibility(divId)
{
	let div = Id(divId);
	let button = Id(divId + "-btn");

	if (div.style.display === 'block')
	{
		div.style.animation = 'scale-center-out .2s ease 0s 1 normal forwards';

		setTimeout(function ()
		{
			div.style.display = 'none';
			div.style.animation = '';
		}, 200);

		button.style.background = '';
		button.style.color = '';
	} else
	{
		div.style.display = 'block';
		div.style.animation = 'scale-center .2s ease 0s 1 normal forwards';

		if (divId === 'ge_users_div')
		{
			window.RequestUserList();
		}
		if (divId === 'ge_rooms_div')
		{
			window.RequestRoomList();
		}
		if (divId === 'ge_log_div')
		{
			ge_log.scrollTop = ge_log.scrollHeight;
		}

		button.style.background = '#dce5ec67';
		button.style.color = '#000000';
	}
}


/**
 * ? Keyboard shortcuts for toggling windows.
 */
document.addEventListener('keydown', (event) =>
{
	if (event.ctrlKey && event.key === 'f')
	{
		event.preventDefault();
		toggleDivVisibility(ge_users_div);
		toggleButtonColor(ge_users_button, ge_users_div);
	}
	if (event.ctrlKey && event.key === 'l')
	{
		event.preventDefault();
		toggleDivVisibility(ge_log_div);
		toggleButtonColor(ge_log_button, ge_log_div);
	}
	if (event.ctrlKey && event.key === 'o')
	{
		event.preventDefault();
		toggleDivVisibility(ge_connect_div);
		toggleButtonColor(ge_connect_button, ge_connect_div);
	}
	if (event.ctrlKey && event.key === 'g')
	{
		event.preventDefault();
		toggleDivVisibility(ge_rooms_div);
		toggleButtonColor(ge_rooms_button, ge_rooms_div);
	}

	if (event.ctrlKey && event.key === 'p')
	{
		event.preventDefault();
		toggleDivVisibility(ge_props_div);
		toggleButtonColor(ge_props_buttonButton, ge_props_div);
	}
});

Id("upload-button").addEventListener('click', function ()
{
	Id('file-input').click();
});


// Id("connect").style.display = "none";

// Children("connect").forEach((child) => {
// 	  child.style.opacity = "0.5";
// }
// );