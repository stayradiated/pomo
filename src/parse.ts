import { unified, type CompilerFunction } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toString } from 'mdast-util-to-string'

type Output = Record<string, string>

const parse = (input: string): Output => {
  const file = unified()
    .use(remarkParse)
    .use(function () {
      const compiler: CompilerFunction = (tree) => {
        let currentHeading = ''
        const record: Record<string, string> = {}

        visit(tree, (node) => {
          if (node.type === 'heading') {
            currentHeading = toString(node)
          } else if (node.type === 'paragraph') {
            const content = toMarkdown(node as any)
            record[currentHeading] ??= ''
            record[currentHeading] += content
          }
        })

        // Trim each value
        for (const [key, value] of Object.entries(record)) {
          record[key] = value.trim()
        }

        return record
      }

      Object.assign(this, { Compiler: compiler })
    })
    .processSync(input)

  return file.result as Output
}

export { parse }
