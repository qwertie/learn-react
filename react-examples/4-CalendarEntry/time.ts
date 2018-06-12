/**
 * Parses a string into a Date. Supports several formats: "12", "1234",
 * "12:34", "12:34pm", "12:34 PM", "12:34:56 pm", and "12:34:56.789".
 * The time must be at the beginning of the string but can have leading spaces.
 * Anything is allowed after the time as long as the time itself appears to
 * be valid, e.g. "12:34*Z" is OK but "12345" is not.
 * @param {string} t Time string, e.g. "1435" or "2:35 PM" or "14:35:00.0"
 * @param {Date|undefined} localDate If this parameter is provided, setHours
 *        is called on it. Otherwise, setUTCHours is called on 1970/1/1.
 * @returns {Date|undefined} The parsed date, if parsing succeeded.
 */
export function parseTime(t: string, localDate?: Date): Date|undefined {
  // ?: means non-capturing group and ?! is zero-width negative lookahead
  var time = t.match(/^\s*(\d\d?)(?::?(\d\d))?(?::(\d\d))?(?!\d)(\.\d+)?\s*(pm?|am?)?/i);
  if (time) {
    var hour = parseInt(time[1]), pm = (time[5] || ' ')[0].toUpperCase();
    var min = time[2] ? parseInt(time[2]) : 0;
    var sec = time[3] ? parseInt(time[3]) : 0;
    var ms = (time[4] ? parseFloat(time[4]) * 1000 : 0);
    if (pm !== ' ' && (hour == 0 || hour > 12) || hour > 24 || min >= 60 || sec >= 60)
      return undefined;
    if (pm === 'A' && hour === 12) hour = 0;
    if (pm === 'P' && hour !== 12) hour += 12;
    if (hour === 24) hour = 0;
    var date = new Date(localDate!==undefined ? localDate.valueOf() : 0);
    var set = (localDate!==undefined ? date.setHours : date.setUTCHours);
    set.call(date, hour, min, sec, ms);
    return date;
  }
  return undefined;
}

export function unwrapDate(date: Date|number): number
{
  return typeof date === 'number' ? date : date.valueOf();
}

/**
 * Gets a string holding the time-of-day of a Date, assuming UTC time zone.
 * @param time A time that you want to conver to a string
 * @param use24hourTime If false, am or pm time is used.
 * @param showSeconds Whether to show the number of seconds (and milliseconds, if nonzero)
 */
export function timeToStringUTC(time: Date|number, use24hourTime: boolean, showSeconds?: boolean): string
{
  time = unwrapDate(time);
  let ms = time % (24*3600*60000), sec, min, hour;
  sec = ms / 1000 | 0; ms %= 1000;
  min = sec / 60 | 0; sec %= 60;
  hour = min / 60 | 0; min %= 60;
  var secString = (showSeconds === undefined ? sec != 0 || ms != 0 : showSeconds) ? twoDigit(sec) : '';
  var suffix = secString !== '' && ms != 0 ? secString + '.' + threeDigit(ms) : secString;
  var result: string;
  if (use24hourTime)
    result = twoDigit(hour) + ':' + twoDigit(min) + suffix;
  else {
    var pm = hour >= 12;
    result = ((hour + 11) % 12 + 1).toString() + ':' + twoDigit(min) + suffix + (pm ? ' pm' : ' am');
  }
  return result;

  function twoDigit(n: number) { var s = n.toString(); return s.length >= 2 ? s : '0' + s; }
  function threeDigit(n: number) { var s = twoDigit(n); return s.length >= 3 ? s : '0' + s; }
}

function runParseTests() // TODO: convert to use unit test framework
{
  var testSuite: any = {
    '1300':  ['1:00 pm','1:00 P.M.','1:00 p','1:00pm','1:00p.m.','1:00p','1 pm',
              '1 p.m.','1 p','1pm','1p.m.', '1p', '13:00','13', '1:00:00PM', '1300', '13'],
    '1100':  ['11:00am', '11:00 AM', '11:00', '11:00:00', '1100'],
    '1359':  ['1:59 PM', '13:59', '13:59:00', '1359', '1359:00', '0159pm'],
    '100':   ['1:00am', '1:00 am', '0100', '1', '1a', '1 am'],
    '0':     ['00:00', '24:00', '12:00am', '12am', '12:00:00 AM', '0000', '1200 AM'],
    '30':    ['0:30', '00:30', '24:30', '00:30:00', '12:30:00 am', '0030', '1230am'],
    '1435':  ["2:35 PM", "14:35:00.0", "1435"],
    '715.5': ["7:15:30", "7:15:30am"],
    '109':   ['109'], // Three-digit numbers work (I wasn't sure if they would)
    '':      ['12:60', '11:59:99', '-12:00', 'foo', '0660', '12345', '25:00'],
  };

  var passed = 0;
  for (var key in testSuite) {
    let num = parseFloat(key), h = num / 100 | 0;
    let m = num % 100 | 0, s = (num % 1) * 60;
    let expected = Date.UTC(1970, 0, 1, h, m, s); // Month is zero-based
    let strings = testSuite[key];
    for (let i = 0; i < strings.length; i++) {
      var result = parseTime(strings[i]);
      if (result === undefined ? key !== '' : key === '' || expected !== result.valueOf()) {
        console.log(`Test failed at ${key}:"${strings[i]}" with result ${result ? result.toUTCString() : 'undefined'}`);
      } else {
        passed++;
      }
    }
  }
  console.log(passed + ' tests passed.');
}
