"use strict";

/** TODO Clean up and store user in prop object so we can do less loops */
/** TODO use width and height from webservice instead of png width and height */

var props = new Array();


function LoadUserProp(prop, uri, users)
{
	for (var i = 0; i < users.length; i++)
	{
		for (var p = 0; p < users[i].nbrProps; p++)
		{
			if (users[i].prop[p].ID == prop.id)
			{
				users[i].prop[p].flags = prop.flags;
				users[i].prop[p].x = prop.offsets.x;
				users[i].prop[p].y = prop.offsets.y;
				environment_cache_picture(uri + prop.id, users[i].prop[p].cache = new Object(), false);
			}
		}
	}
}

function RequestPropInfo(users)
{
	var xhr = new XMLHttpRequest();
	var uri = gs_media_server + "webservice/props/get/"

	var obj = new Object();
	obj.props = props;
	obj.api_version = 1;
	obj.url = uri;

	var body = JSON.stringify(obj);

	xhr.open("GET", "http://chat.tonewebdesign.com/props.php?data=" + encodeURIComponent(body));
	//xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

	xhr.onload = () =>
	{
		if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) 
		{
			var propInfo = JSON.parse(xhr.responseText);
			for (var i = 0; i < propInfo.props.length; i++)
			{
				if (propInfo.props[i].success == true)
				{
					LoadUserProp(propInfo.props[i], propInfo.img_url, users);
				}
			}
		} else
		{
			debug(`Error: ${xhr.status}`);
		}
	};

	xhr.send();

}

function RequestUserProps(users)
{
	for (var i = 0; i < users.length; i++)
	{
		for (var p = 0; p < users[i].nbrProps; p++)
		{
			var prop = new Object();
			prop.id = users[i].prop[p].ID;
			props.push(prop);
		}
	}
	if (props.length)
	{
		RequestPropInfo(users);
	}
}