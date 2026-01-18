const isValidTimeZone = (tz: string): boolean => {
  try {
    if (!Intl) {
      return false
    }

    const dtf = new Intl.DateTimeFormat()
    if (!dtf.resolvedOptions().timeZone) {
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
