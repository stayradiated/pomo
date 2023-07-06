export type Event = {
  subject: string // Required, name of event
  startDate: string // Required, first day of event, format: MM/DD/YYYY
  startTime: string // Time the event begins, format: HH:MM AM/PM
  endDate: string // Last day of event, format: MM/DD/YYYY
  endTime: string // Time the event ends, format: HH:MM AM/PM
  allDayEvent: 'True' | 'False' // Whether the event is an all-day event
  description: string // Description or notes about the event
  location: string // Location for the event
  private: 'True' | 'False' // Whether the event should be marked private
}
