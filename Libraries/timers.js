"use strict";


/** Timer is running at 1 MS interrupt */
// #define TICKS_PER_SECOND ( TIMER )1000UL

// #define SECONDS_TO_TICKS(a)  TICKS_PER_SECOND * ( TIMER )a

/**
 * Start Timer
 * 
 * @param --
 * 
 * @return bit		true if configuration loaded
 */
function timer_start()
{
	if ((!performance) && (!performance.now))
	{
		var d = new Date();
		timer = d.getTime();

		return Math.round(d.getTime(), 0);
	} else
	{
		return performance.now();
	}

	return 0;
}

function timer_elapsed(timer)
{
	var now = timer_start();
	return (now - timer);
}

function timer_timeout(timer, msecs)
{
	if (timer_elapsed(timer) >= msecs)
	{
		return true;
	}

	return false;
}

/**
*/
function timer_delay(msecs)
{
	var now = timer_start();

	while (timer_timeout(now, msecs) == false) 
	{
	};
}