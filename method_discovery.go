package main

func DiscoverFunctionDefinitions(node *AstNode) []*AstNode {
	if node.NodeType == NodeTypeFunctionDefinition &&
		node.Kind != "constructor" &&
		node.Visibility == "private" {
		return []*AstNode{node}
	}

	var receivers []*AstNode
	for _, n := range node.Nodes {
		receivers = append(receivers, DiscoverFunctionDefinitions(n)...)
	}

	return receivers
}

func DiscoverReceivers(node *AstNode) []string {
	if node.NodeType == NodeTypeFunctionDefinition && node.Kind != "constructor" {
		return []string{node.Receiver()}
	}

	var receivers []string
	for _, n := range node.Nodes {
		receivers = append(receivers, DiscoverReceivers(n)...)
	}

	return receivers
}
