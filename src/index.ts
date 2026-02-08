import type { Literal, Node, Parent } from "mdast";
import type { Options } from "mdast-util-to-markdown";
import type {} from "remark-stringify";
import type { Plugin, Processor } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * A custom node representing a literal `[` character.
 * By using a custom node type, we bypass remark-stringify's text escaping.
 */
export interface BracketLiteral extends Literal {
	type: "bracketLiteral";
	value: "[";
}

declare module "mdast" {
	interface PhrasingContentMap {
		bracketLiteral: BracketLiteral;
	}
	interface RootContentMap {
		bracketLiteral: BracketLiteral;
	}
}

declare module "mdast-util-to-markdown" {
	interface ConstructNameMap {
		bracketLiteral: "bracketLiteral";
	}
}

const toMarkdownExtension: Options = {
	handlers: {
		bracketLiteral() {
			return "[";
		},
	},
};

// biome-ignore lint/suspicious/noExplicitAny: peek requires assignment as a property
(toMarkdownExtension.handlers as any).bracketLiteral.peek = () => "[";

const remarkDisableBracketEscape: Plugin<[], import("mdast").Root> = function (this: Processor) {
	const data = this.data();
	if (!data.toMarkdownExtensions) {
		data.toMarkdownExtensions = [];
	}
	const extensions = data.toMarkdownExtensions;
	extensions.push(toMarkdownExtension);

	return (tree) => {
		visit(tree, "text", (node, index, parent) => {
			if (index === undefined || parent === undefined) return;
			if (!node.value.includes("[")) return;

			const parts = node.value.split("[");
			const newNodes: Node[] = [];

			for (let i = 0; i < parts.length; i++) {
				if (parts[i].length > 0) {
					newNodes.push({ type: "text", value: parts[i] } as Node);
				}
				if (i < parts.length - 1) {
					newNodes.push({ type: "bracketLiteral", value: "[" } as Node);
				}
			}

			(parent as Parent).children.splice(index, 1, ...(newNodes as never[]));
			return [SKIP, index + newNodes.length] as const;
		});
	};
};

export default remarkDisableBracketEscape;
