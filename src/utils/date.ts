export function convertDateToTimestamp(date: string) {
  const [day, month, year] = date.split('/').map((number) => parseInt(number))
  const timestamp = new Date(year, month - 1, day).getTime()
  return timestamp
}

export function convertTimestampToDate(timestamp: number) {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const fullDate = `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString()}`
  return fullDate
}
