const getDay = (day: number = 99, now: Date = new Date()) => {
  const month = now.getMonth()
  if (day >= 32)
    day = now.getDate()
  return day + '' + month + '' + now.getFullYear()
}

export default getDay
