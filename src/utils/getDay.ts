const getDay = (day: number = 99, now: Date = new Date()): string => {
  const month: number = now.getMonth()
  if (day >= 32)
    day = now.getDate()
  return day + '' + month + '' + now.getFullYear()
}

export default getDay
