export type HighlightOptions = {
  query?: string
  disabled?: boolean
  fuzzy?: boolean
  node_filter?: (node: Node) => number
  css_class?: string
}

export const highlight_matches =
  (ops: HighlightOptions) => (node: HTMLElement) => {
    const {
      query = '',
      disabled = false,
      fuzzy = false,
      node_filter = () => NodeFilter.FILTER_ACCEPT,
      css_class = 'highlight-match',
    } = ops

    // abort if CSS highlight API not supported
    if (typeof CSS === 'undefined' || !CSS.highlights) {
      return
    }
    // always clear our own highlight first
    CSS.highlights.delete(css_class)
    // if disabled or empty query, stop after cleanup
    if (!query || disabled) {
      return
    }

    const tree_walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: node_filter,
    })
    const text_nodes: Node[] = []
    let current_node = tree_walker.nextNode()

    while (current_node) {
      text_nodes.push(current_node)
      current_node = tree_walker.nextNode()
    }

    // iterate over all text nodes and find matches
    const ranges = text_nodes.map((el) => {
      const text = el.textContent?.toLowerCase()
      if (!text) {
        return []
      }

      const search = query.toLowerCase()

      if (fuzzy) {
        // Fuzzy highlighting: highlight individual characters that match in order
        const matching_indices: number[] = []

        let search_idx = 0
        let target_idx = 0

        // Find matching character indices
        while (search_idx < search.length && target_idx < text.length) {
          if (search[search_idx] === text[target_idx]) {
            matching_indices.push(target_idx)
            search_idx++
          }
          target_idx++
        }

        // Only create ranges if we found all characters in order
        if (search_idx === search.length) {
          return matching_indices.map((index) => {
            const range = new Range()
            range.setStart(el, index)
            range.setEnd(el, index + 1) // highlight single character
            return range
          })
        }

        return []
      }
      // Substring highlighting: highlight consecutive substrings
      const indices = []
      let start_pos = 0
      while (start_pos < text.length) {
        const index = text.indexOf(search, start_pos)
        if (index === -1) {
          break
        }
        indices.push(index)
        start_pos = index + search.length
      }

      // create range object for each substring found in the text node
      return indices.map((index) => {
        const range = new Range()
        range.setStart(el, index)
        range.setEnd(el, index + search.length)
        return range
      })
    })

    // create Highlight object from ranges and add to registry
    CSS.highlights.set(css_class, new Highlight(...ranges.flat()))

    // Return cleanup function
    return () => CSS.highlights.delete(css_class)
  }
