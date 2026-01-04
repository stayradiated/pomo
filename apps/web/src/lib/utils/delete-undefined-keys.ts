const deleteUndefinedKeys = <T>(value: T): T => {
  for (const key in value) {
    if (value[key] === undefined) {
      delete value[key]
    }
  }
  return value
}

export { deleteUndefinedKeys }
