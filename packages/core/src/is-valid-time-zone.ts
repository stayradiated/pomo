const isValidTimeZone = (tz: string): boolean => {
  try {
    if (!Intl) {
      return false
    }

    const testDateTimeFormat = new Intl.DateTimeFormat()
    if (testDateTimeFormat.resolvedOptions().timeZone) {
      return false
    }

    if (typeof tz !== 'string') {
      return false
    }

    // Throws an error if timezone is not valid
    const result = new Intl.DateTimeFormat(undefined, { timeZone: tz })

    return Boolean(result) // True
  } catch {
    return false
  }
}

export { isValidTimeZone }
