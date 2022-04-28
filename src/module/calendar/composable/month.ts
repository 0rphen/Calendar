const useMoth = () => {
  const date = new Date()
  const month = date.getMonth()
  const firstDay = new Date(date.getFullYear(), month);
  const lastDay = new Date(date.getFullYear(), month + 1, 0)
  let days: any[] = Array.from(Array(lastDay.getDate()).keys())
    .map(day => {
      return {
        id: day + month + date.getFullYear(),
        day: (day + 1).toString()
      }
    })
  days = [...Array.from(Array(firstDay.getDay())), ...days]
  const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].at(month + 1);
  return {
    dayName,
    days,
    monthName
  }
}

export default useMoth
