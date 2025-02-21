"use strict";

var gpi_bubble_width = 150;

/** 	bubbleInfo.type = 1 = Normal */
/** 	bubbleInfo.type = 2 = Spiky */
/** 	bubbleInfo.type = 3 = Thought */
/** 	bubbleInfo.type = 4 = Sticky */

/** Bubbles drawn on screen */
var ga_bubbles = new Array();


function DeleteStickyBubbles(user)
{
	var bubbles = new Array();
	for (var i = 0; i < ga_bubbles.length; i++)
	{
		if (user.userID != ga_bubbles[i].userID)
		{
			bubbles.push(ga_bubbles[i]);
		} else
		{
			if (ga_bubbles[i].type != 4)
				bubbles.push(ga_bubbles[i]);
		}
	}
	ga_bubbles = bubbles;
}

function DeleteBubbles(user)
{
	var bubbles = new Array();
	for (var i = 0; i < ga_bubbles.length; i++)
	{
		if (user.userID != ga_bubbles[i].userID)
		{
			bubbles.push(ga_bubbles[i]);
		}
	}
	ga_bubbles = bubbles;
}

function DeleteOldBubbles()
{
	var bubbles = new Array();
	for (var i = 0; i < ga_bubbles.length; i++)
	{
		if (ga_bubbles[i].type == 4)
		{
			bubbles.push(ga_bubbles[i]);
			continue;
		}
		if (timer_elapsed(ga_bubbles[i].start) < (Math.max(ga_bubbles[i].len, 32) * 100)) // older than 1 second
		{
			bubbles.push(ga_bubbles[i]);
		}
	}
	ga_bubbles = bubbles;
}


function DrawBubbles()
{
	// loop through bubbles and draw them...
	if (ga_bubbles.length > 0)
	{
		for (var i = 0; i < ga_bubbles.length; i++)
		{
			if (ga_bubbles[i].drawn == true) 
			{
				switch (ga_bubbles[i].type)
				{
					case 1:	// Normal
						render_normal_bubble(ga_bubbles[i]);
						break;

					case 2: // Spikey
						render_spiky_bubble(ga_bubbles[i]);
						break;

					case 3: // Thought 
						render_thought_bubble(ga_bubbles[i]);
						break;

					case 4: // Sticky
						render_sticky_bubble(ga_bubbles[i]);
						break;
				}// bub type
			}
		}
	}

	DeleteOldBubbles();
}



// Create bubble rect 
function CreateUserBubble(user, text) 
{
	var bubbleInfo;
	var offsetY = 0;
	var offsetX = 0;
	var ctr = 0;
	var overlapping = true;

	DeleteStickyBubbles(user);
	switch (text.substr(0, 1))
	{
		case ':': // Thought
			text = text.substr(1);
			bubbleInfo = create_thought_bubble(user.posX, user.posY, user.userID, text, 0, 0, user.colorNbr);
			break;
		case '!': // Spikey
			text = text.substr(1);
			bubbleInfo = create_spiky_bubble(user.posX, user.posY, user.userID, text, 0, 0, user.colorNbr);
			break;
		case '^': // Sticky 
			text = text.substr(1);
			bubbleInfo = create_sticky_bubble(user.posX, user.posY, user.userID, text, 0, 0, user.colorNbr);
			break;
		default: // Normal
			bubbleInfo = create_normal_bubble(user.posX, user.posY, user.userID, text, 0, 0, user.colorNbr);
			break;
	}

	// check bubble doesn't overlap 
	while (overlapping == true)
	{
		overlapping = false;

		for (var i = 0; i < ga_bubbles.length; i++)
		{

			if (ctr++ > 1000)
			{
				break;
			}

			// check rect height
			if (!(((bubbleInfo.y) >= (ga_bubbles[i].y + ga_bubbles[i].h) ||
				(bubbleInfo.y + bubbleInfo.h) <= (ga_bubbles[i].y)) ||
				((bubbleInfo.x) >= (ga_bubbles[i].x + ga_bubbles[i].w) ||
					(bubbleInfo.x + bubbleInfo.w) <= (ga_bubbles[i].x))))
			{
				overlapping = true;

				if (bubbleInfo.y + bubbleInfo.h > gpi_canvas_height)
				{
					//CreateUserBubbleHistory(user, text);
					return;
				} else
				{

					offsetY += (ga_bubbles[i].h);
					offsetX += 10 + Math.random() * -20;
					switch (bubbleInfo.type)
					{
						case 1: // Normal
							bubbleInfo = create_normal_bubble(user.posX, user.posY, user.userID, text, offsetX, offsetY, user.colorNbr);
							break;

						case 2: // Spiky
							bubbleInfo = create_spiky_bubble(user.posX, user.posY, user.userID, text, offsetX, offsetY, user.colorNbr);
							break;

						case 3: //Thought
							bubbleInfo = create_thought_bubble(user.posX, user.posY, user.userID, text, offsetX, offsetY, user.colorNbr);
							break;

						case 4: // Sticky
							bubbleInfo = create_sticky_bubble(user.posX, user.posY, user.userID, text, offsetX, offsetY, user.colorNbr);
							break;

					}// bub type
				}
				break;
			}

		}
	}

	bubbleInfo.drawn = true;
	ga_bubbles.unshift(bubbleInfo);
}



// Normal Bubbles (Create Rect width,height,stem)
function create_sticky_bubble(x, y, usrID, text, distance_x, distance_y, usrColor)
{
	var bubbleInfo = new Object();

	var radius = 8;
	var padding = 10;
	var line_spacing = 1; //line spacing

	var font_height = parseInt(gps_canvas_font);

	var obj = text_wrap(text, gpi_bubble_width, font_height);
	var lines = obj['lines'];

	var w = Math.round(obj['text_width']); // calculated width 
	var h = Math.round(obj['text_height']); // calculated height
	if (w < 25) w = 25;

	w += padding - 2;
	h += padding;

	// draw rectangle
	var px = 0;
	var py = 0;

	// distance between stem and bubble
	//	var distance_x =  0;//(200  * Math.random());
	//var distance_y = 0;// (200  * Math.random()); ;

	// Bubble Bottom Right
	if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		//x -= (w + 10) + distance_x;
		//y -= (h + 20) + distance_y;

		// stem start
		px = (x + w + 5) + distance_x;
		py = (y + h + 20) + distance_y;

		// Bubble Bottom Left
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		//	x += 10 + distance_x;
		//y -= (h + 20) + distance_y;

		// stem start
		px = (x - 5) - distance_x;
		py = (y + h + 20) + distance_y;

		// Bubble Top Left 
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		//	x += 10 + distance_x;
		//	y += 20 + distance_y;

		// stem start
		px = (x - 5) - distance_x;
		py = (y - 15) - distance_y;

		// Bubble Top Right
	} else if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		//	x -= (w + 10) + distance_x;
		//	y += 20 + distance_y;

		// stem start
		px = (x + w + 5) + distance_x;
		py = (y - 15) - distance_y;
	} else
	{
		console.log("Doh!");
	}

	var r = x + w
	var b = y + h;


	var dir;

	if (py < y) dir = 2;
	if (py > y) dir = 3;
	if (px < x && py >= y && py <= b) dir = 0;
	if (px > x && py >= y && py <= b) dir = 1;
	if (px >= x && px <= r && py >= y && py <= b) dir = -1;


	// store x,y,w,h so we can check if bubble has been drawn
	bubbleInfo.start = timer_start();
	bubbleInfo.len = text.length;
	bubbleInfo.x = x;
	bubbleInfo.y = y;
	bubbleInfo.w = w;
	bubbleInfo.h = h;
	bubbleInfo.px = px;
	bubbleInfo.py = py;
	bubbleInfo.dir = dir;
	bubbleInfo.lines = lines;
	bubbleInfo.userID = usrID;
	bubbleInfo.colorNbr = usrColor;
	bubbleInfo.type = 4;
	return bubbleInfo;
}


// Normal Bubbles (Draw bubbles on screen)
function render_sticky_bubble(bubble) 
{
	var x = bubble.x;
	var y = bubble.y;
	var w = bubble.w;
	var h = bubble.h;
	var px = bubble.px;
	var py = bubble.py;
	var dir = bubble.dir;
	var lines = bubble.lines;
	var color = userColorHex(bubble.colorNbr);

	var radius = 8;
	var padding = 10;
	var line_spacing = 1; //line spacing

	var con1 = 0;
	var con2 = 0;

	var font_height = parseInt(gps_canvas_font);
	var r = x + w;
	var b = y + h;

	if (py < y || py > y + h)
	{
		con1 = Math.min(Math.max(x + radius, px - 10), r - radius - 15);
		con2 = Math.min(Math.max(x + radius + 20, px + 10), r - radius);
	} else
	{
		con1 = Math.min(Math.max(y + radius, py - 10), b - radius - 20);
		con2 = Math.min(Math.max(y + radius + 20, py + 10), b - radius);
	}


	// Create a Gradient
	var gradient = gpc_buffer_context.createLinearGradient(x, y, x + w, y + h);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, lightenColor(color, 50));
	gpc_buffer_context.fillStyle = gradient;

	// font 
	gpc_buffer_context.font = "500 " + gps_canvas_font;
	gpc_buffer_context.strokeStyle = darkenColor(color, 122);
	gpc_buffer_context.lineWidth = 2;


	gpc_buffer_context.beginPath();

	// start 
	gpc_buffer_context.moveTo(x + radius, y);

	// top right corner
	/*if (dir == 2) {
		gpc_buffer_context.lineTo(con1, y);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(con2, y);
		gpc_buffer_context.lineTo(r - radius, y);
	} else {
		gpc_buffer_context.lineTo(r - radius, y);
	}*/
	// top right edge
	gpc_buffer_context.quadraticCurveTo(r, y, r, y + radius);

	// bottom right edge
	/*if (dir == 1) {
		gpc_buffer_context.lineTo(r, con1);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(r, con2);
		gpc_buffer_context.lineTo(r, b - radius);
	} else {
		gpc_buffer_context.lineTo(r, b - radius);
	}*/
	// bottom right corner
	gpc_buffer_context.quadraticCurveTo(r, b, r - radius, b);

	// bottom left edge 
	/*if (dir == 3) {
		gpc_buffer_context.lineTo(con2, b);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(con1, b);
		gpc_buffer_context.lineTo(x + radius, b);
	} else {
		gpc_buffer_context.lineTo(x + radius, b);
	}*/

	// bottom left corner
	gpc_buffer_context.quadraticCurveTo(x, b, x, b - radius);

	// top left edge 
	/*if (dir == 0) {
		gpc_buffer_context.lineTo(x, con2);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(x, con1);
		gpc_buffer_context.lineTo(x, y + radius);
	} else {
		gpc_buffer_context.lineTo(x, y + radius);
	}*/
	// top left corner
	gpc_buffer_context.quadraticCurveTo(x, y, x + radius, y);


	gpc_buffer_context.globalAlpha = 0.8;
	gpc_buffer_context.fill();
	gpc_buffer_context.lineWidth = 1;
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath();

	padding = 2.5;
	// draw text
	var ly = (y + font_height) + (padding / 2) + 2;
	var lx;


	// loops
	for (var j = 0; j < lines.length; ++j)
	{
		// We continue to centralize the lines
		lx = padding + 1 + (padding / 2) + x + (w / 2) - (gpc_buffer_context.measureText(lines[j]).width / 2);

		// BUBBLE DRAW TEXT COLOR
		gpc_buffer_context.strokeStyle = lightenColor(color, 122);
		gpc_buffer_context.fillStyle = darkenColor(color, 122);
		gpc_buffer_context.fillText(lines[j], lx, ly);

		ly += (font_height + line_spacing);

	}
}



// Thought Bubbles (Draw bubbles on screen)
function render_thought_bubble(bubble) 
{
	var animateBubbles = 1;
	var x = bubble.x;
	var y = bubble.y;
	var w = bubble.w;
	var h = bubble.h;
	var px = bubble.px;
	var py = bubble.py;
	var dir = bubble.dir;
	var lines = bubble.lines;
	var color = userColorHex(bubble.colorNbr);

	var line_spacing = 1; //line spacing

	var font_height = parseInt(gps_canvas_font);
	var r = x + w;
	var b = y + h;


	var padding = 2;
	// draw text
	var ly = y; //(y + font_height) + (padding / 2) + 2;
	var lx = x;

	// Create a Gradient
	var gradient = gpc_buffer_context.createLinearGradient(x, y, x + w, y + h);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, lightenColor(color, 50));
	gpc_buffer_context.fillStyle = gradient;

	// font 
	gpc_buffer_context.font = "500 " + gps_canvas_font;
	gpc_buffer_context.strokeStyle = darkenColor(color, 122);
	gpc_buffer_context.lineWidth = 2;


	var pi = Math.PI;
	var sSwitch = false, uSwitch = false;
	bubble.bubPnts = Array();

	var h = bubble.h; + (lines.length - 1 * padding);

	if (lines.length == 1)
	{
		lx += 8;
		ly += 2;
		h += 2;
	} else
	{
		h += 10;
		w += 5;
	}
	if (lines.length > 3)
	{
		h += lines.length * padding + 16;
		ly -= lines.length * (padding + 2) + 8;
	}

	var w = bubble.w;

	var ra = 0;
	var rX;
	var rY;
	var dX;
	var dY;

	// start drawing
	gpc_buffer_context.beginPath();


	for (var i = -pi; i < pi; i = i + bubble.s)
	{
		if (sSwitch)
		{
			if (animateBubbles)
				ra = 3 * Math.random();
			else
				ra = 0;
			rX = w / 20 + 5 + ra;
			rY = h / 20 + 5 + ra;

		} else
		{
			if (animateBubbles)
				ra = 5 * Math.random();
			else
				ra = 0;
			rX = w / 40 + 3 + ra;
			rY = h / 40 + 3 + ra;
		}

		if (animateBubbles)
		{
			dX = x + (rX / 4) * Math.random() - (rX / 4) * Math.random() + (Math.cos(i) * w) - rX;
			dY = y + (rY / 4) * Math.random() - (rY / 4) * Math.random() + (Math.sin(i) * h) - rY;

		} else
		{
			dX = x + (rX / 4) - (rX / 4) + (Math.cos(i) * w) - rX;
			dY = y + (rY / 4) - (rY / 4) + (Math.sin(i) * h) - rY;
		}

		gpc_buffer_context.ellipse(dX, dY, rX * 2, rY * 2, 0, 0, 0);
		sSwitch = !sSwitch;
	}


	gpc_buffer_context.fill();
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath()

	// start drawing
	gpc_buffer_context.beginPath();
	gpc_buffer_context.ellipse(px, py, 5 * Math.random(), 5 * Math.random(), Math.PI / 4, 0, 2 * Math.PI);

	gpc_buffer_context.fill();
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath();

	gpc_buffer_context.beginPath();
	gpc_buffer_context.ellipse(px + 10, py + 10, 10 * Math.random(), 10 * Math.random(), Math.PI / 4, 0, 2 * Math.PI);



	//gpc_buffer_context.moveTo(bubble.bubPnts[0].x, bubble.bubPnts[0].y);
	//for (var i = 1; i < bubble.bubPnts.length; i++) {
	//    gpc_buffer_context.lineTo(bubble.bubPnts[i].x, bubble.bubPnts[i].y);
	//}

	gpc_buffer_context.fill();
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath();


	gpc_buffer_context.lineWidth = 2;

	lx += 2;
	ly -= lines.length * 2;

	// loops
	for (var j = 0; j < lines.length; ++j)
	{
		// We continue to centralize the lines
		lx -= (gpc_buffer_context.measureText(lines[j]).width / 2);


		//)(-8) + x + (w / 2) - (gpc_buffer_context.measureText(lines[j]).width / 2);
		//ly += 5;
		// BUBBLE DRAW TEXT COLOR
		gpc_buffer_context.strokeStyle = lightenColor(color, 122);
		gpc_buffer_context.fillStyle = darkenColor(color, 122);
		gpc_buffer_context.fillText(lines[j], lx, ly);

		ly += (5) + (font_height + line_spacing);
		lx = x;
	}
}


// Thought Bubbles (Create Rect width,height,stem)
function create_thought_bubble(x, y, usrID, text, distance_x, distance_y, usrColor)
{
	var bubbleInfo = new Object();
	bubbleInfo.bubPnts = new Array();

	var padding = 15;
	var line_spacing = 2; //line spacing

	var font_height = parseInt(gps_canvas_font);

	var obj = text_wrap(text, gpi_bubble_width, font_height);
	var lines = obj['lines'];

	var w = Math.round(obj['text_width']); // calculated width 
	var h = Math.round(obj['text_height']); // calculated height
	if (w < 25) w = 25;

	w += padding;
	h += padding;


	// draw rectangle
	var px = 0; // user x
	var py = 0; // user y


	// distance between stem and bubble
	//	var distance_x =  0;//(200  * Math.random());
	//var distance_y = 0;// (200  * Math.random()); ;

	// Bubble Bottom Right
	if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 0) + distance_x;
		y -= (h + 5) + distance_y;

		// stem start
		px = (x + w + 0) + distance_x;
		py = (y + h + 5) + distance_y;

		// Bubble Bottom Left
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x += 5 + distance_x;
		y -= (h + 5) + distance_y;

		// stem start
		px = (x - 0) - distance_x;
		py = (y + h + 5) + distance_y;

		// Bubble Top Left 
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{

		// rect start 
		x += (w + 0) + distance_x;
		y += 5 + distance_y;

		// stem start
		px = (x - w - 0) + distance_x;
		py = (y - 5) - distance_y;


		// Bubble Top Right
	} else if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 5) + distance_x;
		y += 5 + distance_y;

		// stem start
		px = (x + w + 0) + distance_x;
		py = (y - 5) - distance_y;
	} else
	{
		console.log("Doh!");
	}

	var s;
	var pi = Math.PI;

	var c = pi * (w + h) / 2;
	if (Math.floor(c / 10) == 0) return;
	var s = 6.283 / ((c / (w / 27 + h / 27 + 10)) * 2);

	//c = Pi * (Wi + He) / 2
	//If CLng(c / 10) = 0 Then Exit Sub
	//s = 6.283 / (CLng(c / (Wi / 27 + He / 27 + 10)) * 2)


	w = w / 2;
	h = h / 2;


	// store x,y,w,h so we can check if bubble has been drawn
	bubbleInfo.start = timer_start();
	bubbleInfo.len = text.length;
	bubbleInfo.s = s;
	bubbleInfo.x = x;
	bubbleInfo.y = y;
	bubbleInfo.w = w;
	bubbleInfo.h = h;
	bubbleInfo.px = px;
	bubbleInfo.py = py;
	bubbleInfo.dir = 0;
	bubbleInfo.lines = lines;
	bubbleInfo.userID = usrID;
	bubbleInfo.colorNbr = usrColor;
	bubbleInfo.type = 3;

	// DrawGDIPPolygon hdc, VarPtr(BubPnts(0)), UBound(BubPnts) - 1, 4, 1, PenTypeSolidColor, GDIpColor Or &HFFF0F0F0, 0, GDIpColor, , , UserX, UserY, Y, X 'x - Width / 2, y + Height + 20, y - Height - 20, x - Width / 2


	return bubbleInfo;
}



// Normal Bubbles (Draw bubbles on screen)
function render_spiky_bubble(bubble) 
{
	var animateBubbles = 1;
	var x = bubble.x;
	var y = bubble.y;
	var w = bubble.w;
	var h = bubble.h;
	var px = bubble.px;
	var py = bubble.py;
	var dir = bubble.dir;
	var lines = bubble.lines;
	var color = userColorHex(bubble.colorNbr);

	var line_spacing = 1; //line spacing

	var font_height = parseInt(gps_canvas_font);
	var r = x + w;
	var b = y + h;


	var padding = 2;
	// draw text
	var ly = y; //(y + font_height) + (padding / 2) + 2;
	var lx = x;

	// Create a Gradient
	var gradient = gpc_buffer_context.createLinearGradient(x, y, x + w, y + h);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, lightenColor(color, 50));
	gpc_buffer_context.fillStyle = gradient;

	// font 
	gpc_buffer_context.font = "500 " + gps_canvas_font;
	gpc_buffer_context.strokeStyle = darkenColor(color, 122);
	gpc_buffer_context.lineWidth = 2;


	var pi = Math.PI;
	var sSwitch = false, uSwitch = false;
	bubble.bubPnts = Array();

	var h = bubble.h; + (lines.length - 1 * padding);

	if (lines.length == 1)
	{
		lx += 2;
		ly += 5;
		h -= 5;
	} else
	{
		h += 10;
		w += 5;
	}
	if (lines.length > 3)
	{
		h += lines.length * padding;
		ly -= lines.length * (padding + 2);
		debug(h);
	}

	var w = bubble.w;

	for (i = -pi; i < pi; i = i + bubble.s)
	{
		var points = new Object();
		uSwitch = (i > bubble.RADangle - bubble.s && i < bubble.RADangle + bubble.s);
		if (sSwitch) 
		{
			if (uSwitch)
			{
				points.x = bubble.px;
				points.y = bubble.py;
			} else
			{
				if (animateBubbles)
				{
					points.x = x + Math.cos(i) * (w + 6 + 12 * Math.random());
					points.y = y + Math.sin(i) * (h + 6 + 12 * Math.random());
				} else
				{
					points.x = x + Math.cos(i) * (w + 12),
						points.y = y + Math.sin(i) * (h + 12);
				}
			}
		} else
		{
			points.x = x + Math.cos(i) * w
			points.y = y + Math.sin(i) * h;
		}

		bubble.bubPnts.push(points);
		sSwitch = !sSwitch;
	}


	// start drawing
	gpc_buffer_context.beginPath();

	gpc_buffer_context.moveTo(bubble.bubPnts[0].x, bubble.bubPnts[0].y);
	for (var i = 1; i < bubble.bubPnts.length; i++)
	{
		gpc_buffer_context.lineTo(bubble.bubPnts[i].x, bubble.bubPnts[i].y);
	}

	gpc_buffer_context.fill();
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath();


	gpc_buffer_context.lineWidth = 2;

	ly -= lines.length * 2;

	// loops
	for (var j = 0; j < lines.length; ++j)
	{
		// We continue to centralize the lines
		lx -= (gpc_buffer_context.measureText(lines[j]).width / 2);


		//)(-8) + x + (w / 2) - (gpc_buffer_context.measureText(lines[j]).width / 2);
		//ly += 5;
		// BUBBLE DRAW TEXT COLOR
		gpc_buffer_context.strokeStyle = lightenColor(color, 122);
		gpc_buffer_context.fillStyle = darkenColor(color, 122);
		gpc_buffer_context.fillText(lines[j], lx, ly);

		ly += (5) + (font_height + line_spacing);
		lx = x;
	}
}


// Normal Bubbles (Create Rect width,height,stem)
function create_spiky_bubble(x, y, usrID, text, distance_x, distance_y, usrColor)
{
	var bubbleInfo = new Object();
	bubbleInfo.bubPnts = new Array();

	var padding = 15;
	var line_spacing = 2; //line spacing

	var font_height = parseInt(gps_canvas_font);

	var obj = text_wrap(text, gpi_bubble_width, font_height);
	var lines = obj['lines'];

	var w = Math.round(obj['text_width']); // calculated width 
	var h = Math.round(obj['text_height']); // calculated height
	if (w < 25) w = 25;

	w += padding;
	h += padding;


	// draw rectangle
	var px = 0; // user x
	var py = 0; // user y


	// distance between stem and bubble
	//	var distance_x =  0;//(200  * Math.random());
	//var distance_y = 0;// (200  * Math.random()); ;

	// Bubble Bottom Right
	if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 0) + distance_x;
		y -= (h + 5) + distance_y;

		// stem start
		px = (x + w + 0) + distance_x;
		py = (y + h + 5) + distance_y;

		// Bubble Bottom Left
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x += 5 + distance_x;
		y -= (h + 5) + distance_y;

		// stem start
		px = (x - 0) - distance_x;
		py = (y + h + 5) + distance_y;

		// Bubble Top Left 
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{

		// rect start 
		x += (w + 0) + distance_x;
		y += 5 + distance_y;

		// stem start
		px = (x - w - 0) + distance_x;
		py = (y - 5) - distance_y;


		// Bubble Top Right
	} else if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 5) + distance_x;
		y += 5 + distance_y;

		// stem start
		px = (x + w + 0) + distance_x;
		py = (y - 5) - distance_y;
	} else
	{
		console.log("Doh!");
	}

	var i, s;
	var RADangle;
	var pi = Math.PI;

	//var c = pi  (3  (w + h) - Math.sqrt((w + 3  h)  (3 * w + h)));
	var c = pi * (3 * (w + h) - Math.sqrt((w + 3 * h) * (3 * w + h)));
	if (Math.floor(c / 12) == 0) return;
	var s = 24 * 3 / c;

	w = 2 + w / 2;
	h = 2 + h / 2;

	if (py == y) y = y + 1;
	if (px == x) x = x + 1;


	RADangle = Math.atan((py - y) / (px - x));
	if (h > w)
	{
		if (px > x)
		{
			if (py < y) RADangle = RADangle + (h - w) / c;
			else RADangle = RADangle - (h - w) / c;
		} else if (px < x)
		{
			if (py < y) RADangle = RADangle - (h - w) / c;
			else RADangle = RADangle + (h - w) / c;
		}
	} else
	{
		if (px > x)
		{
			if (py < y) RADangle = RADangle - (w - h) / c;
			else RADangle = RADangle + (w - h) / c;
		} else if (px < x)
		{
			if (py < y) RADangle = RADangle + (w - h) / c;
			else RADangle = RADangle - (w - h) / c;
		}
	}

	if (px < x) RADangle = RADangle + pi;
	if (RADangle > pi) RADangle = RADangle - 2 * pi;



	// store x,y,w,h so we can check if bubble has been drawn
	bubbleInfo.start = timer_start();
	bubbleInfo.len = text.length;
	bubbleInfo.RADangle = RADangle;
	bubbleInfo.s = s;
	bubbleInfo.x = x;
	bubbleInfo.y = y;
	bubbleInfo.w = w;
	bubbleInfo.h = h;
	bubbleInfo.px = px;
	bubbleInfo.py = py;
	bubbleInfo.dir = 0;
	bubbleInfo.lines = lines;
	bubbleInfo.userID = usrID;
	bubbleInfo.colorNbr = usrColor;
	bubbleInfo.type = 2;

	// DrawGDIPPolygon hdc, VarPtr(BubPnts(0)), UBound(BubPnts) - 1, 4, 1, PenTypeSolidColor, GDIpColor Or &HFFF0F0F0, 0, GDIpColor, , , UserX, UserY, Y, X 'x - Width / 2, y + Height + 20, y - Height - 20, x - Width / 2


	return bubbleInfo;
}



// Normal Bubbles (Create Rect width,height,stem)
function create_normal_bubble(x, y, usrID, text, distance_x, distance_y, usrColor)
{
	var bubbleInfo = new Object();

	var radius = 8;
	var padding = 10;
	var line_spacing = 1; //line spacing

	var font_height = parseInt(gps_canvas_font);

	var obj = text_wrap(text, gpi_bubble_width, font_height);
	var lines = obj['lines'];

	var w = Math.round(obj['text_width']); // calculated width 
	var h = Math.round(obj['text_height']); // calculated height
	if (w < 25) w = 25;

	w += padding - 2;
	h += padding;

	// draw rectangle
	var px = 0;
	var py = 0;

	// distance between stem and bubble
	//	var distance_x =  0;//(200  * Math.random());
	//var distance_y = 0;// (200  * Math.random()); ;

	// Bubble Bottom Right
	if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 10) + distance_x;
		y -= (h + 20) + distance_y;

		// stem start
		px = (x + w + 5) + distance_x;
		py = (y + h + 20) + distance_y;

		// Bubble Bottom Left
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) >= gpi_canvas_height / 2))
	{
		// rect start 
		x += 10 + distance_x;
		y -= (h + 20) + distance_y;

		// stem start
		px = (x - 5) - distance_x;
		py = (y + h + 20) + distance_y;

		// Bubble Top Left 
	} else if ((((x + w + padding) - w) <= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		x += 10 + distance_x;
		y += 20 + distance_y;

		// stem start
		px = (x - 5) - distance_x;
		py = (y - 15) - distance_y;

		// Bubble Top Right
	} else if ((((x + w + padding) - w) >= gpi_canvas_width / 2) &&
		(((y + h + padding) - h) <= gpi_canvas_height / 2))
	{
		// rect start 
		x -= (w + 10) + distance_x;
		y += 20 + distance_y;

		// stem start
		px = (x + w + 5) + distance_x;
		py = (y - 15) - distance_y;
	} else
	{
		console.log("Doh!");
	}

	var r = x + w
	var b = y + h;


	var dir;

	if (py < y) dir = 2;
	if (py > y) dir = 3;
	if (px < x && py >= y && py <= b) dir = 0;
	if (px > x && py >= y && py <= b) dir = 1;
	if (px >= x && px <= r && py >= y && py <= b) dir = -1;


	// store x,y,w,h so we can check if bubble has been drawn
	bubbleInfo.start = timer_start();
	bubbleInfo.len = text.length;
	bubbleInfo.x = x;
	bubbleInfo.y = y;
	bubbleInfo.w = w;
	bubbleInfo.h = h;
	bubbleInfo.px = px;
	bubbleInfo.py = py;
	bubbleInfo.dir = dir;
	bubbleInfo.lines = lines;
	bubbleInfo.userID = usrID;
	bubbleInfo.colorNbr = usrColor;
	bubbleInfo.type = 1;
	return bubbleInfo;
}


// Normal Bubbles (Draw bubbles on screen)
function render_normal_bubble(bubble) 
{
	var x = bubble.x;
	var y = bubble.y;
	var w = bubble.w;
	var h = bubble.h;
	var px = bubble.px;
	var py = bubble.py;
	var dir = bubble.dir;
	var lines = bubble.lines;
	var color = userColorHex(bubble.colorNbr);

	var radius = 8;
	var padding = 10;
	var line_spacing = 1; //line spacing

	var con1 = 0;
	var con2 = 0;

	var font_height = parseInt(gps_canvas_font);
	var r = x + w;
	var b = y + h;

	if (py < y || py > y + h)
	{
		con1 = Math.min(Math.max(x + radius, px - 10), r - radius - 15);
		con2 = Math.min(Math.max(x + radius + 20, px + 10), r - radius);
	} else
	{
		con1 = Math.min(Math.max(y + radius, py - 10), b - radius - 20);
		con2 = Math.min(Math.max(y + radius + 20, py + 10), b - radius);
	}


	// Create a Gradient
	var gradient = gpc_buffer_context.createLinearGradient(x, y, x + w, y + h);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, lightenColor(color, 50));
	gpc_buffer_context.fillStyle = gradient;

	// font 
	gpc_buffer_context.font = "500 " + gps_canvas_font;
	gpc_buffer_context.strokeStyle = darkenColor(color, 122);
	gpc_buffer_context.lineWidth = 2;


	gpc_buffer_context.beginPath();

	// start 
	gpc_buffer_context.moveTo(x + radius, y);

	// top right corner
	if (dir == 2)
	{
		gpc_buffer_context.lineTo(con1, y);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(con2, y);
		gpc_buffer_context.lineTo(r - radius, y);
	} else
	{
		gpc_buffer_context.lineTo(r - radius, y);
	}
	// top right edge
	gpc_buffer_context.quadraticCurveTo(r, y, r, y + radius);

	// bottom right edge
	if (dir == 1)
	{
		gpc_buffer_context.lineTo(r, con1);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(r, con2);
		gpc_buffer_context.lineTo(r, b - radius);
	} else
	{
		gpc_buffer_context.lineTo(r, b - radius);
	}
	// bottom right corner
	gpc_buffer_context.quadraticCurveTo(r, b, r - radius, b);

	// bottom left edge 
	if (dir == 3)
	{
		gpc_buffer_context.lineTo(con2, b);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(con1, b);
		gpc_buffer_context.lineTo(x + radius, b);
	} else
	{
		gpc_buffer_context.lineTo(x + radius, b);
	}

	// bottom left corner
	gpc_buffer_context.quadraticCurveTo(x, b, x, b - radius);

	// top left edge 
	if (dir == 0)
	{
		gpc_buffer_context.lineTo(x, con2);
		gpc_buffer_context.lineTo(px, py);
		gpc_buffer_context.lineTo(x, con1);
		gpc_buffer_context.lineTo(x, y + radius);
	} else
	{
		gpc_buffer_context.lineTo(x, y + radius);
	}
	// top left corner
	gpc_buffer_context.quadraticCurveTo(x, y, x + radius, y);


	gpc_buffer_context.fill();
	gpc_buffer_context.lineWidth = 1;
	gpc_buffer_context.stroke();
	gpc_buffer_context.closePath();

	padding = 2.5;
	// draw text
	var ly = (y + font_height) + (padding / 2) + 2;
	var lx;


	// loops
	for (var j = 0; j < lines.length; ++j)
	{
		// We continue to centralize the lines
		lx = padding + 1 + (padding / 2) + x + (w / 2) - (gpc_buffer_context.measureText(lines[j]).width / 2);

		// BUBBLE DRAW TEXT COLOR
		gpc_buffer_context.strokeStyle = lightenColor(color, 122);
		gpc_buffer_context.fillStyle = darkenColor(color, 122);
		gpc_buffer_context.fillText(lines[j], lx, ly);

		ly += (font_height + line_spacing);

	}
}


//wrap fragments
function frag_wrap(text, max_width)
{
	var words = text.split(' ');
	var lines = [];
	var line = '';
	var line_test = '';

	// loop words
	for (var i = 0; i < words.length; i++)
	{
		line_test = line + words[i] + ' ';

		// Check total width of line or last word
		if (gpc_buffer_context.measureText(line_test).width > max_width) 
		{
			if (line.length)
			{
				lines.push(line + ' ');
				line = words[i] + ' ';
			}
		} else
		{
			line = line_test;
		}
	}

	lines.push(line + ' ');
	return lines;
}


/**
 * split word phrase up into array up to max width
 */
function text_wrap(text, max_width, font_height)
{
	var split = false;
	var words = text.split(' ');
	var lines = [];
	var tmp;

	var mx = gpc_buffer_context.measureText(text.substr(0, 2)).width;

	if (mx > max_width)
	{
		max_width = mx;
		console.log("Max Width not large enough!");
	}

	// fragment - loop all words and store in lines 
	while (words.length)
	{
		split = false;

		// check word is smaller than width unless we ran out of characters
		while (gpc_buffer_context.measureText(words[0]).width >= max_width && words[0].length > 1)
		{
			tmp = words[0];
			words[0] = tmp.slice(0, -1);

			if (!split)
			{
				//remove 1 character 
				split = true;
				words.splice(1, 0, tmp.slice(-1));
			} else
			{
				words[1] = tmp.slice(-1) + words[1];
			}

		} // width loop

		//console.log( "Line Length=" + words[0].length + " px=" +  +  " " + words[0] );
		lines.push(words[0]); // add word to lines
		words.shift(); // remove first word

	} // fragment 

	text = lines.join(" ");
	lines = frag_wrap(text, max_width);

	// calculate maximum width 
	var w = 0;
	var text_width = 0;
	var text_height = 0;

	// loop text finding maximum width line 
	for (var i = 0; i < lines.length; i++)
	{
		w = gpc_buffer_context.measureText(lines[i]).width;
		if (w > text_width)
		{
			text_width = w;
		}
		text_height += font_height + 1; /// add line spacing
	}

	var k = [];

	/** Support IE8+ */
	k['lines'] = lines;
	k['text_width'] = text_width;
	k['text_height'] = text_height + 2;

	return k;
}