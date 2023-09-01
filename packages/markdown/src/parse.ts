import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit, SKIP, CONTINUE } from 'unist-util-visit'
import { source } from 'unist-util-source'
import { toString } from 'mdast-util-to-string'
import type { Node } from 'unist'

type ParsedItem = {
  heading: string
  labels: string[]
  text: string
}

const parse = (input: string): ParsedItem[] => {
  const file = unified()
    .use(remarkParse)
    .use(function () {
      Object.assign(this, {
        Compiler(tree: Node) {
          let currentItem: ParsedItem
          const output = [] as ParsedItem[]

          visit(tree, (node) => {
            if (node.type === 'root') {
              return CONTINUE
            }

            if (node.type === 'heading') {
              currentItem = {
                heading: toString(node),
                labels: [],
                text: '',
              }
              output.push(currentItem)
              return SKIP
            }

            if (node.type === 'blockquote') {
              const text = toString(node).trim()
              const labels = text.split(/[,\n]/).map((label) => label.trim())
              if (currentItem) {
                currentItem.labels.push(...labels)
              }

              return SKIP
            }

            if (currentItem) {
              const content = source(input, node) ?? ''
              currentItem.text = currentItem.text
                ? `${currentItem.text}\n\n${content}`
                : content
            }

            return SKIP
          })

          return output.map((item) => ({
            ...item,
            text: item.text.trim(),
          }))
        },
      })
    })
    .processSync(input)

  return file.result as ParsedItem[]
}

export { parse }
export type { ParsedItem }
