type Leaf<Node> = {
  node: Node
  children: Array<Leaf<Node>>
}

type Tree<Node> = Array<Leaf<Node>>

type ChildLike = {
  id: string
  parentId: string | null
}

const getTree = <Node extends ChildLike>(input: Node[]): Tree<Node> => {
  const leafMap = new Map<string, Leaf<Node>>()
  for (const node of input) {
    leafMap.set(node.id, { node, children: [] })
  }

  const tree: Tree<Node> = []
  for (const leaf of leafMap.values()) {
    const { parentId } = leaf.node
    if (typeof parentId === 'string') {
      const parentStream = leafMap.get(parentId)
      if (!parentStream) {
        throw new Error(`Could not find item with id "${parentId}"`)
      }

      parentStream.children.push(leaf)
    } else {
      tree.push(leaf)
    }
  }

  return tree
}

export { getTree }
export type { Leaf, Tree }
