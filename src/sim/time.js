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
