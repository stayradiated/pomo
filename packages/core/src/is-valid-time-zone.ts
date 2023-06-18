const isValidTimeZone = (tz: string): boolean => {
  try {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
      return false
    }

    if (typeof tz !== 'string') {
      return false
    }

    // Throws an error if timezone is not valid
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  } catch {
    return false
  }
}

export { isValidTimeZone }
