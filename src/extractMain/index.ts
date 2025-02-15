import { readFile } from "node:fs/promises";
import ts from "typescript";

export const extractMain = async (filepath: string): Promise<string> => {
	const originalSource = await readFile(filepath, "utf8");
	const sourceFile = ts.createSourceFile(
		filepath,
		originalSource,
		ts.ScriptTarget.Latest,
	);

	const findMainFunction = (node: ts.Node): string | undefined => {
		if (ts.isExportAssignment(node)) {
			const expr = node.expression;
			if (
				ts.isCallExpression(expr) &&
				ts.isIdentifier(expr.expression) &&
				expr.expression.text === "defineUserScript"
			) {
				const arg = expr.arguments[0];
				if (arg && ts.isObjectLiteralExpression(arg)) {
					for (const prop of arg.properties) {
						/**
						 * main: () => { ... }
						 * or
						 * main: function () { ... })
						 */
						if (ts.isPropertyAssignment(prop)) {
							const propName =
								ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
									? prop.name.text
									: undefined;
							if (propName === "main") {
								return prop.initializer.getFullText(sourceFile);
							}

							continue;
						}

						/**
						 * Method Declaration (e.g. main() { ... })
						 */
						if (ts.isMethodDeclaration(prop)) {
							const propName =
								ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
									? prop.name.text
									: undefined;

							if (propName === "main") {
								if (!prop.body) {
									throw new Error("main method has no body.");
								}

								// Convert the method declaration to a function expression.
								const funcExpr = ts.factory.createFunctionExpression(
									undefined,
									undefined,
									undefined,
									prop.typeParameters,
									prop.parameters,
									prop.type,
									prop.body,
								);

								const tempPrinter = ts.createPrinter();
								return tempPrinter.printNode(
									ts.EmitHint.Expression,
									funcExpr,
									sourceFile,
								);
							}
						}
					}
				}
			}
		}

		return ts.forEachChild(node, findMainFunction);
	};

	const mainFunctionText = findMainFunction(sourceFile);
	if (!mainFunctionText) {
		throw new Error("No main function found in defineUserScript export.");
	}

	const statementsWithoutTheExport = sourceFile.statements.filter(
		(statement) => {
			if (ts.isExportAssignment(statement)) {
				const expr = statement.expression;
				if (
					ts.isCallExpression(expr) &&
					ts.isIdentifier(expr.expression) &&
					expr.expression.text === "defineUserScript"
				) {
					return false;
				}
			}
			return true;
		},
	);

	const updatedSourceFile = ts.factory.updateSourceFile(
		sourceFile,
		statementsWithoutTheExport,
	);
	const printer = ts.createPrinter();
	const codeWithoutExport = printer.printFile(updatedSourceFile);

	const trimmedMainFunction = mainFunctionText.trim();
	const iifeText = `void (${trimmedMainFunction})();\n`;

	return `${codeWithoutExport}\n${iifeText}`;
};
