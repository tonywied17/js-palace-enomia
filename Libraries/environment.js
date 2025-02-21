"use strict";

/** Canvas */
var gpc_canvas = Id('canvas');
var gpc_context = gpc_canvas.getContext("2d");

/** Used for second buffer */
var gpc_buffer_canvas = document.createElement("CANVAS");
var gpc_buffer_context = gpc_buffer_canvas.getContext("2d");


/** Global Client Properties */

/** TODO Load/save these in local storage */
var gps_canvas_font = "13px 'Noto Sans', sans-serif";
var gb_window_scale = false;

var gi_max_width = 90090;
var gi_max_height = 90900;


/** Automatic */
var gpi_canvas_width = 0;
var gpi_canvas_height = 0;

var gpi_canvas_width_scaled = 0;
var gpi_canvas_height_scaled = 0;

var gpi_fps_max = 60;

/** Global  objects */
var go_image_cache = new Object();

var gi_draw_last_frame = timer_start();

var gf_aspect_ratio = 0;

function init_environment()
{
	environment_cache_picture("./Media/Content/Splash.png", go_image_cache['background'] = new Object(), true);
	environment_cache_picture("./Media/Smileys/dinks2k7.png", go_image_cache['smileys'] = new Object());

	canvas.addEventListener('mousedown', environment_mouse_move, false);
	canvas_animation_frame(canvas_draw_frame);
}


function canvas_animation_frame(frame)
{
	var ref = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback)
		{
			window.setTimeout(callback, 1000 / 60);
		};

	if (gpi_fps_max > 120)
	{
		ref = function (callback)
		{
			window.setTimeout(callback, 1);
		};
	}

	ref(frame);
}

/** draw_Frame gets requested every 16ms at 60fps */
function canvas_draw_frame()
{
	canvas_animation_frame(canvas_draw_frame);

	var delta = timer_elapsed(gi_draw_last_frame);
	if (delta > (1000 / gpi_fps_max))
	{
		gi_draw_last_frame = timer_start() - (delta % (1000 / gpi_fps_max));
		environment_draw();
	}

}

function check_y(y, max = 44, min = 0)
{
	if (y < min)
	{
		y = min;
	}

	if (y + max > gpi_canvas_height)
	{
		y = gpi_canvas_height - max;
	}

	return y;
}

function check_x(x, max = 44)
{
	if (x < 0)
	{
		x = 0;
	}

	if (x + max > gpi_canvas_width)
	{
		x = gpi_canvas_width - max;
	}

	return x;
}

function environment_mouse_move(event)
{
	var x = event.pageX * (gpi_canvas_width / gpi_canvas_width_scaled);
	var y = event.pageY * (gpi_canvas_height / gpi_canvas_height_scaled);

	y -= 11;
	x -= 11;

	DoMove(x, y)
}


/**
 * Load background picture from HTTP server
 * 
 * @param imgURL	HTTP URL for image from asset server		 
 * 
 * @return 	--
 */
function GetPicture(imgURL)
{
	environment_cache_picture(imgURL, go_image_cache['background'] = new Object(), true);
}



function environment_cache_picture(image_url, image_object, background_image)
{
	var img = new Image();
	img.src = image_url;

	image_object['loaded'] = false;
	image_object['name'] = image_url;

	img.onload = function ()
	{
		image_loaded();
	}
	img.onerror = function ()
	{
		debug("Error loading:" + image_url)
	}

	function image_loaded()
	{
		if (background_image)
		{
			img.width = img.width < 512 ? 512 : img.width;
			img.height = img.height < 384 ? 384 : img.height;
			canvas_set_size(img.width, img.height);
		}

		image_object['loaded'] = true;
		image_object['image'] = img;
	};
}


function canvas_get_ratio(context)
{
	// finally query the various pixel ratios
	var devicePixelRatio = window.devicePixelRatio || 1;
	var backingStoreRatio = context.webkitBackingStorePixelRatio ||
		context.mozBackingStorePixelRatio ||
		context.msBackingStorePixelRatio ||
		context.oBackingStorePixelRatio ||
		context.backingStorePixelRatio || 1;

	return devicePixelRatio / backingStoreRatio;
}

function canvas_set_size(width, height, buffer)
{
	var canvas = gpc_canvas;
	var context = gpc_context;

	context.imageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;

	if (buffer == true)
	{
		canvas = gpc_buffer_canvas;
		context = gpc_buffer_context;
	}

	/** font is set in preferences */
	context.font = gps_canvas_font;

	var ratio = canvas_get_ratio(context);
	gpi_canvas_width = width;
	gpi_canvas_height = height;

	/** */
	canvas.width = gpi_canvas_width * ratio;
	canvas.height = gpi_canvas_height * ratio;

	canvas.style.width = gpi_canvas_width;
	canvas.style.height = gpi_canvas_height;

	ratio = canvas_get_ratio(context);

	/** */
	context.setTransform(ratio, 0, 0, ratio, 0, 0);

	/** Set same parameters on the buffer canvas */
	if (!buffer)
	{
		canvas_set_size(width, height, true);
	}
}



function environment_draw()
{
	var start_time = timer_start();

	/** Draw Background / spot images */

	// image, src x, src y, src h, src w,  dst x, dst y, dst w, dst h
	if (go_image_cache['background']['loaded'] == true)
	{
		gpc_context.globalAlpha = 1;
		gpc_buffer_context.globalAlpha = 1; // disable alpha

		gpc_buffer_context.drawImage(go_image_cache['background']['image'], 0, 0, go_image_cache['background']['image'].width, go_image_cache['background']['image'].height);

		gpc_buffer_context.globalAlpha = 1;
		gpc_context.globalAlpha = 0.5;

	} else
	{
		gpc_buffer_context.globalAlpha = 1;
		gpc_context.globalAlpha = 1;

		gpc_buffer_context.clearRect(0, 0, gpi_canvas_width, gpi_canvas_height);
		gpc_context.clearRect(0, 0, gpi_canvas_width, gpi_canvas_height);
	}



	/** Draw smileys */
	if (go_image_cache['smileys']['loaded'] == true)
	{
		for (var i = 0; i < ga_users_room.length; i++)
		{

			var FPos = ga_users_room[i].colorNbr * 45
			var CPos = ga_users_room[i].faceNbr * 45

			var x = ga_users_room[i].posX - 22;
			x = check_x(x);
			var y = ga_users_room[i].posY - 22;
			y = check_y(y);

			for (var p = 0; p < ga_users_room[i].nbrProps; p++)
			{
				if (ga_users_room[i].prop.length > 0)
				{
					if (ga_users_room[i].prop[p].cache && ga_users_room[i].prop[p].cache.loaded)
					{
						var posX = x + parseInt(ga_users_room[i].prop[p].x);
						var posY = y + parseInt(ga_users_room[i].prop[p].y);

						gpc_buffer_context.drawImage(ga_users_room[i].prop[p].cache['image'], 0, 0,
							ga_users_room[i].prop[p].cache['image'].width, ga_users_room[i].prop[p].cache['image'].height,
							posX,
							posY,
							ga_users_room[i].prop[p].cache['image'].width, ga_users_room[i].prop[p].cache['image'].height);
					}
				}
			}
			// 22 + x - (ga_users_room[i].prop[p].cache['image'].width / 2), 
			//  y - (ga_users_room[i].prop[p].cache['image'].height/2), 

			// TODO Check for head flag
			if (ga_users_room[i].nbrProps == 0)
			{
				//gpc_buffer_context.drawImage( go_image_cache['smileys']['image'], 0, 0, 44, 44,  Math.random() * 512 , Math.random() * 384 ,44, 44);
				gpc_buffer_context.drawImage(go_image_cache['smileys']['image'], CPos, FPos, 44, 44, x, y, 44, 44);
			}


		}
	}

	/** Drop Shadow for Elevation */
	gpc_buffer_context.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Add the shadow color (semi-transparent black in this case)
	gpc_buffer_context.shadowBlur = 3; // Adjust blur radius
	gpc_buffer_context.shadowOffsetX = 0; // Adjust horizontal distance
	gpc_buffer_context.shadowOffsetY = 0; // Adjust vertical distance

	var preFont = gps_canvas_font;
	gpc_buffer_context.font = "500 14px 'Noto Sans', sans-serif";

	/* Name Tags */
	for (var i = 0; i < ga_users_room.length; i++)
	{
		var uWidth = gpc_buffer_context.measureText(ga_users_room[i].name).width / 2;

		var x = ga_users_room[i].posX - uWidth;
		x = check_x(x, uWidth * 2);

		var y = ga_users_room[i].posY + 22 + 6;
		y = check_y(y, 4, 44 + 6);

		let color = userColorHex(ga_users_room[i].colorNbr);
		gpc_buffer_context.fillStyle = color;

		// Set shadow properties for stroke effect
		// gpc_buffer_context.shadowColor = hexToRGBA(color, 0.222);
		// gpc_buffer_context.shadowOffsetX = 2;
		// gpc_buffer_context.shadowOffsetY = 2;
		// gpc_buffer_context.shadowBlur = 2;

		// Set the font weight to 700

		// Convert special characters to HTML entities
		var parser = new DOMParser();
		var entityEncodedName = parser.parseFromString(escapeHTML(ga_users_room[i].name), "text/html").body.textContent;

		// Draw the text with stroke and fill
		gpc_buffer_context.strokeStyle = "black";
		gpc_buffer_context.lineWidth = 2.22;

		// Draw the text with the stroke effect
		gpc_buffer_context.strokeText(entityEncodedName, x, y);

		// Draw the text with the fill effect
		gpc_buffer_context.fillText(entityEncodedName, x, y);

		// Reset shadow properties for filling the text
		gpc_buffer_context.shadowColor = "transparent";
		gpc_buffer_context.shadowOffsetX = 0;
		gpc_buffer_context.shadowOffsetY = 0;
		gpc_buffer_context.shadowBlur = 0;

		// Set fill style for the main text
		gpc_buffer_context.fillStyle = lightenColor(color, 0);
		gpc_buffer_context.fillText(entityEncodedName, x, y);
	}


	gpc_buffer_context.font = preFont;
	gps_canvas_font = gpc_buffer_context.font;

	/** Draw Bubbles.. clever that! */
	DrawBubbles();



	/** FPS Counter */

	if (gb_fps_on)
	{
		if (timer_elapsed(window.fps_sec) < 1000) // if start time is less then a second then count how many frames we drew 
		{
			++window.fps;
			if (window.fps > window.fps_max_counter)
			{
				window.fps_max_counter = window.fps;
			}

		} else
		{ //reset count every seconds

			if (!window.fps_max_counter)
			{
				window.fps = 0;
				window.fps_max_counter = 0;
				window.fps_max = 0;
			}

			window.fps = 0;
			window.fps_sec = timer_start();
			window.fps_max = window.fps_max_counter;
			window.fps_max_counter = 0;
		}

		//draw diagnostics 
		gpc_buffer_context.font = gps_canvas_font;
		gpc_buffer_context.fontWeight = 900;
		gpc_buffer_context.fillStyle = "black";
		gpc_buffer_context.fillText(" FPS " + (window.fps) + " Max " + (window.fps_max) + " Frame " + Math.round(timer_elapsed(start_time) * 10) / 10, 20 + 1, 20 + 1);
		gpc_buffer_context.fillText(" FPS " + (window.fps) + " Max " + (window.fps_max) + " Frame " + Math.round(timer_elapsed(start_time) * 10) / 10, 20 - 1, 20);
		gpc_buffer_context.fillText(" FPS " + (window.fps) + " Max " + (window.fps_max) + " Frame " + Math.round(timer_elapsed(start_time) * 10) / 10, 20, 20 - 1);
		gpc_buffer_context.fillText(" FPS " + (window.fps) + " Max " + (window.fps_max) + " Frame " + Math.round(timer_elapsed(start_time) * 10) / 10, 20 - 1, 20 - 1);


		gpc_buffer_context.fillStyle = "white";
		gpc_buffer_context.fillText(" FPS " + (window.fps) + " Max " + (window.fps_max) + " Frame " + Math.round(timer_elapsed(start_time) * 10) / 10, 20, 20);
	}




	var aspectRatio = 0;
	var scaleWidth = 0;
	var scaleHeight = 0;

	// don't do any transformation if image is less than max
	if (gpi_canvas_width <= gi_max_width && gpi_canvas_height <= gi_max_height)
	{
		gpi_canvas_width_scaled = gpi_canvas_width;
		gpi_canvas_height_scaled = gpi_canvas_height;

		var ratio = canvas_get_ratio(gpc_context);
		gpc_buffer_context.setTransform(ratio, 0, 0, ratio, 0, 0);
		gpc_context.setTransform(ratio, 0, 0, ratio, 0, 0);

		gpc_context.drawImage(gpc_buffer_canvas, 0, 0, gpi_canvas_width, gpi_canvas_height);

	} else
	{
		gf_aspect_ratio = Math.min(gi_max_width / gpi_canvas_width, gi_max_height / gpi_canvas_height);
		gpi_canvas_width_scaled = gpi_canvas_width * gf_aspect_ratio;
		gpi_canvas_height_scaled = gpi_canvas_height * gf_aspect_ratio;

		gpc_buffer_context.setTransform(1, 0, 0, 1, 0, 0); // restore default
		gpc_context.setTransform(1, 0, 0, 1, 0, 0); // restore default

		gpc_context.drawImage(gpc_buffer_canvas, 0, 0, gpi_canvas_width, gpi_canvas_height, 0, 0,
			gpi_canvas_width_scaled * canvas_get_ratio(gpc_context),
			gpi_canvas_height_scaled * canvas_get_ratio(gpc_context)
		);
	}
}