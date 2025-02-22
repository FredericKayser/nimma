// covers:
// $..

import * as b from '../ast/builders.mjs';
import generateEmitCall from '../templates/emit-call.mjs';
import sandbox from '../templates/sandbox.mjs';

const IS_OBJECT_IDENTIFIER = b.identifier('isObject');
const IS_NOT_OBJECT_IF_STATEMENT = b.ifStatement(
  b.unaryExpression(
    '!',
    b.callExpression(IS_OBJECT_IDENTIFIER, [sandbox.value]),
  ),
  b.returnStatement(),
);

const EMIT_ROOT_CALL_EXPRESSION = generateEmitCall('$..', {
  keyed: false,
  parents: 0,
});

export default (nodes, tree, ctx) => {
  if (nodes.length !== 1 || nodes[0].type !== 'AllParentExpression') {
    return false;
  }

  tree.addRuntimeDependency(IS_OBJECT_IDENTIFIER.name);

  tree.push(
    b.blockStatement([
      IS_NOT_OBJECT_IF_STATEMENT,
      generateEmitCall(ctx.id, ctx.iterator.modifiers),
    ]),
    'tree-method',
  );

  tree.push(b.stringLiteral(ctx.id), 'traverse');
  tree.push(EMIT_ROOT_CALL_EXPRESSION, 'body');

  return true;
};
