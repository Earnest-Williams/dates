export const incrementTime = (currentTime, ticks) => {
  let newMinute = currentTime.minute + (10 * ticks);
  let newHour = currentTime.hour;
  let newDay = currentTime.day;

  while (newMinute >= 60) {
    newMinute -= 60;
    newHour += 1;
  }

  const daysCrossed = [];
  while (newHour >= 24) {
    newHour -= 24;
    newDay += 1;
    daysCrossed.push(newDay);
  }

  return {
    time: { day: newDay, hour: newHour, minute: newMinute },
    daysCrossed
  };
};

export const formatTime = (hour, minute) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
};

export const getDaypart = (hour) => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

const toAbsoluteMinutes = (time) => ((time.day - 1) * 24 * 60) + (time.hour * 60) + time.minute;

const hourToMinutes = (hour) => hour * 60;

const formatHour = (hour) => formatTime(hour % 24, 0).replace(':00', '');

const pluralize = (count, singular) => `${count} ${singular}${count === 1 ? '' : 's'}`;

export const formatTimeWindow = (window) => {
  if (!window) return 'Any time';
  return `${formatHour(window.startHour)}-${formatHour(window.endHour)}`;
};

export const getTimeWindowStatus = (time, window, durationTicks = 0) => {
  if (!window) return { available: true, reason: null };

  const currentMinutes = (time.hour * 60) + time.minute;
  const startMinutes = hourToMinutes(window.startHour);
  const endMinutes = hourToMinutes(window.endHour);
  const durationMinutes = durationTicks * 10;
  const wrapsMidnight = endMinutes <= startMinutes;
  const currentWindowMinutes = wrapsMidnight && currentMinutes < endMinutes
    ? currentMinutes + (24 * 60)
    : currentMinutes;
  const endWindowMinutes = wrapsMidnight ? endMinutes + (24 * 60) : endMinutes;

  const startOk = currentWindowMinutes >= startMinutes && currentWindowMinutes < endWindowMinutes;
  const finishOk = !window.requireFinish || currentWindowMinutes + durationMinutes <= endWindowMinutes;

  if (startOk && finishOk) return { available: true, reason: null };

  return {
    available: false,
    reason: window.requireFinish
      ? `Available ${formatTimeWindow(window)} if there is enough time to finish.`
      : `Available ${formatTimeWindow(window)}.`,
  };
};

export const formatDurationMinutes = (durationMinutes) => {
  const clamped = Math.max(0, Math.floor(durationMinutes));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;

  if (hours === 0) return pluralize(minutes, 'minute');
  if (minutes === 0) return pluralize(hours, 'hour');
  return `${pluralize(hours, 'hour')} ${pluralize(minutes, 'minute')}`;
};

export const describeElapsedDuration = (startTime, endTime) => {
  const startMinutes = toAbsoluteMinutes(startTime);
  const endMinutes = toAbsoluteMinutes(endTime);
  return formatDurationMinutes(Math.max(0, endMinutes - startMinutes));
};

export const describeTimeSpanChunk = (startTime, endTime) => {
  const startMinutes = toAbsoluteMinutes(startTime);
  const endMinutes = toAbsoluteMinutes(endTime);
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const startPart = getDaypart(startTime.hour);
  const endPart = getDaypart(endTime.hour);

  if (durationMinutes === 0) return 'no time';

  if (startPart === endPart) {
    if (durationMinutes >= 180) return `most of your ${startPart}`;
    return `part of your ${startPart}`;
  }

  if (durationMinutes >= 300) {
    return `a long stretch of your ${startPart} and ${endPart}`;
  }

  return `the end of your ${startPart} and the start of your ${endPart}`;
};

export const describeTimePassage = (startTime, endTime, activityText) => {
  const startLabel = formatTime(startTime.hour, startTime.minute);
  const endLabel = formatTime(endTime.hour, endTime.minute);
  const startMinutes = toAbsoluteMinutes(startTime);
  const endMinutes = toAbsoluteMinutes(endTime);
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const startPart = getDaypart(startTime.hour);
  const endPart = getDaypart(endTime.hour);
  const dayNote = endTime.day > startTime.day ? ` on Day ${endTime.day}` : '';

  let passage = `from ${startLabel} to ${endLabel}${dayNote}`;
  if (startPart === endPart && durationMinutes >= 180) {
    passage = `all ${startPart}, ${passage}`;
  } else if (startPart !== endPart) {
    passage = `through the ${startPart} and into the ${endPart}, ${passage}`;
  }

  return `You ${activityText} ${passage}.`;
};
