"use strict";

/**
 * Dump object debug function
 * 
 * @param obj		Object to debug into console
 * 
 * @return --
 */
function dump(obj)
{
	var out = '';
	for (var i in obj)
	{
		out += i + ": " + obj[i] + "\n";
	}
	debug(out);
}


/**
 * Debug message to console.log/debug browser function
 * 
 * @param str		String to debug into console 
 * 
 * @return --
 */
function debug(str)
{
	if (console)
	{
		console.debug(str);
	}
}

/**
 * Remove elements from array
 * 
 * @param from		Start index into object
 * @param to  		End index into object 
 * 
 * @return 			Array without element(s)
 */
Array.prototype.remove = function (from, to)
{
	var rest = this.slice(parseInt(to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;

	return this.push.apply(this, rest);
};


/**
 * putString into protocol structure
 * 
 * @param out		Object returned
 * @param data  	data to assigned to string 
 * @param len 		length of string to assign
 * @param ofst 		offset into string to assign
 * 
 * @return 			length of data
 */
function putStr(out, data, len, ofst)
{
	var tmp = (len - data.length);
	var strLen = (data.length >= len) ? len : data.length;

	for (var i = 0; i < strLen; i++)
	{
		out[ofst + i] = data.charCodeAt(i) & 0xFF;
	}

	return ofst + len;
}


/**
 * putLong into protocol structure
 * 
 * @param out		Object returned
 * @param data  	32bit number to assign to string 
 * @param ofst 		offset into string to assign
 * 
 * @return 			length of data
 */
function putLong(out, data, ofst)
{
	out[ofst + 3] = (data >> 24) & 0xFF;
	out[ofst + 2] = (data >> 16) & 0xFF;
	out[ofst + 1] = (data >> 8) & 0xFF;
	out[ofst] = (data) & 0xFF;

	return ofst + 4;
}

/**
 * putShort into protocol structure
 * 
 * @param out		Object returned
 * @param data  	16bit number to assign to string 
 * @param ofst 		offset into string to assign
 * 
 * @return 			length of data
 */
function putShort(out, data, ofst)
{
	out[ofst + 1] = (data >> 8) & 0xFF;
	out[ofst] = (data) & 0xFF;

	return ofst + 2;
}

/**
 * putByte into protocol structure
 * 
 * @param out		Object returned
 * @param data  	8bit number to assign to string 
 * @param ofst 		offset into string to assign
 * 
 * @return 			length of data
 */
function putByte(buf, data, ofst)
{
	buf[ofst] = data & 0xFF;

	return ofst + 1;
}

/**
 * getString from protocol structure
 * 
 * @param len 		length of string to get 
 * 
 * @return 			string from buffer
 */
function getStr(len)
{
	var ret = buffer.substr(0, len);

	// remove packet from buffer
	buffer = buffer.substr(len, buffer.length - len);

	return ret;
}

/**
 * getByte from protocol structure
 * 
 * @param start		index into string to get byte
 * 
 * @return 			8bit byte from buffer
 */
function getByte(start)
{
	var ret = buffer.charCodeAt(0);
	buffer = buffer.substr(1, buffer.length - 1);

	return ret;
}

/**
 * getShort from protocol structure
 * 
 * @param start		index into string to get short
 * 
 * @return 			16bit short from buffer
 */
function getShort(start)
{
	var ret = buffer.charCodeAt(1) << 8 | buffer.charCodeAt(0);
	buffer = buffer.substr(2, buffer.length - 2);

	return ret;
}

/**
 * getLong from protocol structure
 * 
 * @param start		index into string to get long
 * 
 * @return 			32bit long from buffer
 */
function getLong(start)
{
	var ret = buffer.charCodeAt(3) << 24 |
		buffer.charCodeAt(2) << 16 |
		buffer.charCodeAt(1) << 8 |
		buffer.charCodeAt(0);

	buffer = buffer.substr(4, buffer.length - 4);
	return ret;
}

/**
 * Endian swap 16bit short 
 * 
 * @param val		short to reverse
 * 
 * @return 			16bit short reversed
 */
function swapS(val)
{
	return ((val & 0xff) << 8) |
		((val & 0xff00) >> 8);
}

/**
 * Endian swap 32bit short 
 * 
 * @param val		short to reverse
 * 
 * @return 			32bit short reversed
 */
function swapL(val)
{
	return (val >> 24) |
		((val & 0x00ff0000) >> 8) |
		((val & 0x0000ff00) << 8) |
		(val << 24);
}

/**
 * Convert number to HEX
 * 
 * @param data		Data to convert to HEX (ascii pairs)
 * @param len		Length of data		
 * 
 * @return 			HEX string made up from data param
 */
function NumToHex(data, len)
{
	return Pad(parseInt(data, 10).toString(16), len, "0").toUpperCase();
}


/**
 * Convert HEX string to ASCII
 * 
 * @param data		Data to convert to ASCII from HEX
 * 
 * @return 			ASCII string made up from data param
 */
function HexToAsc(data)
{
	var ret = "";
	// if ((data.length % 2) != 0)
	//    return "Error= ! / 2";

	for (var i = 0; i < data.length; i += 2)
	{
		ret += (String.fromCharCode(parseInt(data.substr(i, 2), 16)));
	}
	return ret;
}


/**
 * Convert ASC string to HEX (ascii pairs)
 * 
 * @param data		Data to convert to HEX from ASCII
 * 
 * @return 			HEX string made up from data param
 */
function AscToHex(data)
{
	var ret = "";

	for (var i = 0; i < data.length; i++)
	{
		ret += Pad(data.charCodeAt(i).toString(16), 2, "0");
	}
	return ret;
}


/**
 * Pad String to specified size using specific character 
 * 
 * @param val		Value to pad 
 * @param size		length of value to pad up
 * @param ch		ch to pad default = ' ' or '0' 
 * 
 * @return 			Padded number
 */
function Pad(val, size, ch)
{
	var result = String(val);

	if (!ch)
	{
		ch = " ";
	}

	while (result.length < size)
	{
		result = ch + result;
	}

	return result;
}


/**
 * ? Get Elements by ID, Class, or Tag
 */
function Id(id)
{
	return document.getElementById(id) || null;
}

function Class(className)
{
	return document.querySelector('.' + className) || null;
}

function Classes(className)
{
	return Array.from(document.getElementsByClassName(className));
}

function Children(parentId)
{
	const parentElement = document.getElementById(parentId);
	return parentElement ? Array.from(parentElement.children) : [];
}
