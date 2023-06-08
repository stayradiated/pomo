const stripComments = (input: string): string => {
  return (
    input
      // Strip html comments from string javas
      .replace(/<!--[\s\S]*?-->/g, '')
      // Strip c-style comments from string
      .replace(/\/\/.*/g, '')
      .trim()
      .split('\n')[0]!
  )
}

export { stripComments }
