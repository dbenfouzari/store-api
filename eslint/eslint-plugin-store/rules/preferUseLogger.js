/**
 * @file
 * This rule is used to enforce the use of the logger instead of console.log.
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce the use of the `AppLogger` instead of `console.log`",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.object?.name === "console") {
          context.report({
            node,
            message: "Use the AppLogger instead of console.log",
          });
        }
      },
    };
  },
};
