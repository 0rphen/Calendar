const useMoth = () => {
  const date = new Date()
  const month = date.getMonth()
  const emptyDays = new Date(date.getFullYear(), month).getDay()
  const lastDay = new Date(date.getFullYear(), month + 1, 0)
  let days: any[] = Array.from(Array(lastDay.getDate()).keys())
    .map(day => {
      day += 1
      return {
        id: (day + '' + month + '' + date.getFullYear()).toString(),
        day: (day).toString()
      }
    })
  const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].at(month);
  return {
    emptyDays,
    dayName,
    days,
    monthName
  }
}

export default useMoth
