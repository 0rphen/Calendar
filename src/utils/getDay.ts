const getDay = (day: number = 99) => {
  const now = new Date()
  const month = now.getMonth()
  if (day >= 32)
    day = now.getDate()
  return day + '' + month + '' + now.getFullYear()
}

export default getDay
