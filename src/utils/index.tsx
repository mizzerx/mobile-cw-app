export const formatDateAndTime = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (minutes < 10) {
    return `${year}-${month}-${day} ${hours}:0${minutes}`;
  }

  if (hours < 10) {
    return `${year}-${month}-${day} 0${hours}:${minutes}`;
  }

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
