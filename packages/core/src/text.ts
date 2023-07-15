const stripComments = (input: string): string => {
  return (
    input
      // Strip html comments from string javas
      .replaceAll(/<!--[\s\S]*?-->/g, '')
      // Strip javascript comments from string
      .replaceAll(/\/\/.*/g, '')
      .trim()
  )
}

const firstLine = (input: string): string => {
  return input.split('\n')[0]!
}

export { stripComments, firstLine }
