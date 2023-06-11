import { unified } from 'unified'
import type { CompilerFunction } from 'unified'
import remarkParse from 'remark-parse'
import { visit, SKIP, CONTINUE } from 'unist-util-visit'
import { source } from 'unist-util-source'
import { toString } from 'mdast-util-to-string'

type Output = Record<string, string>

const parse = (input: string): Output => {
  const file = unified()
    .use(remarkParse)
    .use(function () {
      const compiler: CompilerFunction = (tree) => {
        let currentHeading: string | undefined
        const record: Record<string, string> = {}

        visit(tree, (node) => {
          if (node.type === 'root') {
            return CONTINUE
          }

          if (node.type === 'heading') {
            currentHeading = toString(node)
            return SKIP
          }

          if (typeof currentHeading === 'string') {
            const content = source(node, input) ?? ''
            record[currentHeading] = record[currentHeading]
              ? `${record[currentHeading]}\n\n${content}`
              : content
          }

          return SKIP
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
