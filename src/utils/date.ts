import { DateTime } from 'luxon'
export const getFormattedDateTime = () => {
  return DateTime.local().toFormat('yyyy-MM-dd_HHmmss')
}

export const getFormattedDate = () => {
  return DateTime.local().toFormat('yyyy-MM-dd')
}
