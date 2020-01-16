/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  isArrow,
  isLeftParen,
  isRightParen,
  isNotRightParen,
  isLeftBracket,
  isRightBracket,
  isColon,
  isQuestion,
  isExtendsKeyword,
  last
} = require('./indent-utils')

/** @type {TSNode['type'][]} */
const TS_NODES = [
  'TSAbstractClassProperty',
  'TSAbstractKeyword',
  'TSAbstractMethodDefinition',
  'TSAnyKeyword',
  'TSArrayType',
  'TSAsExpression',
  'TSAsyncKeyword',
  'TSBooleanKeyword',
  'TSBigIntKeyword',
  'TSConditionalType',
  'TSConstructorType',
  'TSCallSignatureDeclaration',
  'TSClassImplements',
  'TSConstructSignatureDeclaration',
  'TSDeclareKeyword',
  'TSDeclareFunction',
  'TSEmptyBodyFunctionExpression',
  'TSEnumDeclaration',
  'TSEnumMember',
  'TSExportAssignment',
  'TSExportKeyword',
  'TSExternalModuleReference',
  'TSImportType',
  'TSInferType',
  'TSLiteralType',
  'TSIndexedAccessType',
  'TSIndexSignature',
  'TSInterfaceBody',
  'TSInterfaceDeclaration',
  'TSInterfaceHeritage',
  'TSImportEqualsDeclaration',
  'TSFunctionType',
  'TSMethodSignature',
  'TSModuleBlock',
  'TSModuleDeclaration',
  'TSNamespaceExportDeclaration',
  'TSNonNullExpression',
  'TSNeverKeyword',
  'TSNullKeyword',
  'TSNumberKeyword',
  'TSMappedType',
  'TSObjectKeyword',
  'TSParameterProperty',
  'TSPrivateKeyword',
  'TSPropertySignature',
  'TSProtectedKeyword',
  'TSPublicKeyword',
  'TSQualifiedName',
  'TSReadonlyKeyword',
  'TSRestType',
  'TSStaticKeyword',
  'TSStringKeyword',
  'TSSymbolKeyword',
  'TSThisType',
  'TSTypeAnnotation',
  'TSTypeAliasDeclaration',
  'TSTypeAssertion',
  'TSTypeLiteral',
  'TSTypeOperator',
  'TSTypeParameter',
  'TSTypeParameterDeclaration',
  'TSTypeParameterInstantiation',
  'TSTypePredicate',
  'TSTypeReference',
  'TSTypeQuery',
  'TSIntersectionType',
  'TSTupleType',
  'TSOptionalType',
  'TSParenthesizedType',
  'TSUnionType',
  'TSUndefinedKeyword',
  'TSUnknownKeyword',
  'TSVoidKeyword'
]

module.exports = {
  TS_NODES,
  defineVisitor
}

/**
 * Process the given node list.
 * The first node is offsetted from the given left token.
 * Rest nodes are adjusted to the first node.
 * @callback ProcessNodeList
 * @param {(ASTNode|null)[]} nodeList The node to process.
 * @param {ASTNode|Token|null} left The left parenthesis token.
 * @param {ASTNode|Token|null} right The right parenthesis token.
 * @param {number} offset The offset to set.
 * @param {boolean} [alignVertically=true] The flag to align vertically. If `false`, this doesn't align vertically even if the first node is not at beginning of line.
 * @returns {void}
 */
/**
 * Set offset to the given tokens.
 * @callback SetOffset
 * @param {Token|Token[]|null|(Token|null)[]} token The token to set.
 * @param {number} offset The offset of the tokens.
 * @param {Token} baseToken The token of the base offset.
 * @returns {void}
 */
/**
 * Collect prefix tokens of the given property.
 * The prefix includes `async`, `get`, `set`, `static`, and `*`.
 * @callback GetPrefixTokens
 * @param {ASTNode} node The property node to collect prefix tokens.
 * @param {ASTNode | Token} keyNode The key node.
 * @returns {Token[]}
 */
/**
 * Process semicolons of the given statement node.
 * @callback ProcessSemicolons
 * @param {ASTNode} node The statement node to process.
 * @returns {void}
 */
/**
 * @typedef {object} DefineVisitorParam
 * @property {ProcessNodeList} processNodeList
 * @property {ParserServices.TokenStore | SourceCode} tokenStore
 * @property {SetOffset} setOffset
 * @property {GetPrefixTokens} getPrefixTokens
 * @property {ProcessSemicolons} processSemicolons
 */

/**
 * @param {DefineVisitorParam} param
 * @returns {TemplateListener}
 */
function defineVisitor({
  processNodeList,
  tokenStore,
  setOffset,
  getPrefixTokens,
  processSemicolons
}) {
  return {
    // Support TypeScript
    /**
     * Override the process of the ObjectPattern with typeAnnotation
     * https://github.com/estree/estree/blob/master/extensions/type-annotations.md
     * @param {ObjectExpression & { typeAnnotation: TSTypeAnnotation }} node
     */
    'ObjectPattern[typeAnnotation]'(node) {
      processNodeList(
        node.properties,
        tokenStore.getFirstToken(node),
        tokenStore.getTokenBefore(node.typeAnnotation),
        1
      )
    },
    /**
     * Override the process of the ArrayPattern with typeAnnotation
     * https://github.com/estree/estree/blob/master/extensions/type-annotations.md
     * @param {ArrayPattern & { typeAnnotation: TSTypeAnnotation }} node
     */
    'ArrayPattern[typeAnnotation]'(node) {
      processNodeList(
        node.elements,
        tokenStore.getFirstToken(node),
        tokenStore.getTokenBefore(node.typeAnnotation),
        1
      )
    },
    /**
     * Override the process of the ClassDeclaration and ClassExpression with superTypeParameters
     * @param { (ClassDeclaration | ClassExpression) & { superTypeParameters: TSTypeParameterInstantiation }  } node
     */
    'ClassDeclaration[superTypeParameters], ClassExpression[superTypeParameters]'(
      node
    ) {
      if (node.superClass != null) {
        const superClassToken = tokenStore.getFirstToken(node.superClass)
        const superTypeToken = tokenStore.getFirstToken(
          node.superTypeParameters
        )
        setOffset(superTypeToken, 0, superClassToken)
      }
    },
    /**
     * Override the process of the ClassDeclaration and ClassExpression with implements
     * @param { (ClassDeclaration | ClassExpression) & { implements: TSClassImplements[] }  } node
     */
    'ClassDeclaration[implements], ClassExpression[implements]'(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const implementsFirstToken = tokenStore.getFirstToken(node.implements[0])
      const implementsToken = tokenStore.getTokenBefore(implementsFirstToken)

      setOffset(implementsToken, 1, firstToken)
      processNodeList(node.implements, implementsToken, null, 1)
    },
    /**
     * Process class properties
     *
     * e.g.
     * ```
     * class Foo {
     *   prop = ''
     * //^^^^
     *   abstract absProp = ''
     * //^^^^^^^^^^^^^
     * }
     * ```
     * @param {ClassProperty | TSAbstractClassProperty} node
     */
    'ClassProperty, TSAbstractClassProperty'(node) {
      const prefixTokens = getPrefixTokens(node, node.key)
      const lastPrefix = last(prefixTokens)

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      let lastKeyToken = null
      if (node.computed) {
        const keyLeftToken = /** @type {Token} */ (tokenStore.getFirstToken(
          node,
          isLeftBracket
        ))
        const keyToken = tokenStore.getTokenAfter(keyLeftToken)
        const keyRightToken = (lastKeyToken = /** @type {Token} */ (tokenStore.getTokenAfter(
          node.key,
          isRightBracket
        )))

        if (lastPrefix) {
          setOffset(keyLeftToken, 0, lastPrefix)
        }
        setOffset(keyToken, 1, keyLeftToken)
        setOffset(keyRightToken, 0, keyLeftToken)
      } else {
        const idToken = (lastKeyToken = tokenStore.getFirstToken(node.key))

        if (lastPrefix) {
          setOffset(idToken, 0, lastPrefix)
        }
      }

      if (node.value != null) {
        const equalToken = tokenStore.getTokenAfter(
          node.typeAnnotation || lastKeyToken
        )
        const valueToken = tokenStore.getTokenAfter(equalToken)

        setOffset([equalToken, valueToken], 1, lastKeyToken)
      }

      processSemicolons(node)
    },
    /**
     * Process type annotation
     *
     * e.g.
     * ```
     * const foo: Type
     * //       ^^^^^^
     * type foo = () => string
     * //            ^^^^^^^^^
     * function foo(value): value is string;
     * //                            ^^^^^^
     * ```
     */
    TSTypeAnnotation(node) {
      let beforeToken = tokenStore.getTokenBefore(node)
      if (node.parent && node.parent.optional && isQuestion(beforeToken)) {
        const question = beforeToken
        beforeToken = tokenStore.getTokenBefore(question)
        setOffset(question, 1, beforeToken)
      }

      const firstToken = tokenStore.getFirstToken(node)
      if (isArrow(firstToken) || isColon(firstToken)) {
        const arrowOrColonToken = firstToken
        const nextToken = tokenStore.getTokenAfter(arrowOrColonToken)

        setOffset([arrowOrColonToken, nextToken], 1, beforeToken)
      } else {
        setOffset(firstToken, 1, beforeToken)
      }
    },
    /**
     * Process as expression
     *
     * e.g.
     * ```
     * var foo = bar as boolean
     * //        ^^^^^^^^^^^^^^
     * ```
     */
    TSAsExpression(node) {
      const firstToken = tokenStore.getFirstToken(node.expression)
      const asToken = tokenStore.getTokenAfter(node.expression)
      const nextToken = tokenStore.getTokenAfter(asToken)

      setOffset([asToken, nextToken], 1, firstToken)
    },
    /**
     * Process type reference
     *
     * e.g.
     * ```
     * const foo: Type<P>
     * //         ^^^^^^^
     * ```
     */
    TSTypeReference(node) {
      if (node.typeParameters != null) {
        const nameToken = tokenStore.getFirstToken(node.typeName)
        const paramFirstToken = tokenStore.getFirstToken(node.typeParameters)
        setOffset(paramFirstToken, 0, nameToken)
      }
    },
    /**
     * Process type parameter instantiation
     *
     * e.g.
     * ```
     * const foo: Type<P>
     * //             ^^^
     * ```
     */
    TSTypeParameterInstantiation(node) {
      const firstToken = tokenStore.getFirstToken(node)
      if (node.parent) {
        if (node.parent.typeParameters === node) {
          setOffset(firstToken, 0, tokenStore.getTokenBefore(firstToken))
        }
      }
      processNodeList(node.params, firstToken, tokenStore.getLastToken(node), 1)
    },
    /**
     * Process array type
     *
     * e.g.
     * ```
     * const foo: Type[]
     * //         ^^^^^^
     * ```
     */
    TSArrayType(node) {
      const rightBracket = tokenStore.getLastToken(node)
      const leftBracket = tokenStore.getTokenBefore(rightBracket)
      setOffset([leftBracket, rightBracket], 0, tokenStore.getFirstToken(node))
    },
    /**
     * Process type literal
     *
     * e.g.
     * ```
     * const foo: { bar: string }
     * //         ^^^^^^^^^^^^^^^
     * ```
     */
    TSTypeLiteral(node) {
      processNodeList(
        node.members,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process property signature
     *
     * e.g.
     * ```
     * const foo: { bar: string }
     * //           ^^^^^^^^^^^
     * ```
     */
    TSPropertySignature(node) {
      const prefixTokens = getPrefixTokens(node, node.key)
      const lastPrefix = last(prefixTokens)

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      let lastKeyToken = null
      if (node.computed) {
        const keyLeftToken = /** @type {Token} */ (tokenStore.getFirstToken(
          node,
          isLeftBracket
        ))
        const keyToken = tokenStore.getTokenAfter(keyLeftToken)
        const keyRightToken = (lastKeyToken = /** @type {Token} */ (tokenStore.getTokenAfter(
          node.key,
          isRightBracket
        )))

        if (lastPrefix) {
          setOffset(keyLeftToken, 0, lastPrefix)
        }
        setOffset(keyToken, 1, keyLeftToken)
        setOffset(keyRightToken, 0, keyLeftToken)
      } else {
        const idToken = (lastKeyToken = tokenStore.getFirstToken(node.key))

        if (lastPrefix) {
          setOffset(idToken, 0, lastPrefix)
        }
      }

      if (node.initializer != null) {
        const equalToken = tokenStore.getTokenAfter(
          node.typeAnnotation || lastKeyToken
        )
        const valueToken = tokenStore.getTokenAfter(equalToken)

        setOffset([equalToken, valueToken], 1, lastKeyToken)
      }

      processSemicolons(node)
    },
    /**
     * Process index signature
     *
     * e.g.
     * ```
     * const foo: { [bar: string]: string }
     * //           ^^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSIndexSignature(node) {
      const prefixTokens = getPrefixTokens(node, node.parameters[0])
      const lastPrefix = last(prefixTokens)

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      const paramLeftToken = /** @type {Token} */ (lastPrefix
        ? tokenStore.getTokenAfter(lastPrefix, isLeftBracket)
        : tokenStore.getFirstToken(node, isLeftBracket))
      const paramRightToken = tokenStore.getTokenAfter(
        last(node.parameters) || paramLeftToken,
        isRightBracket
      )

      if (lastPrefix) {
        setOffset(paramLeftToken, 0, lastPrefix)
      }
      processNodeList(node.parameters, paramLeftToken, paramRightToken, 1)
      setOffset(paramRightToken, 0, paramLeftToken)

      processSemicolons(node)
    },
    /**
     * Process abstract method definition
     *
     * e.g.
     * ```
     * class Foo {
     *   abstract fn()
     * //^^^^^^^^^^^^^
     * }
     * ```
     */
    TSAbstractMethodDefinition(node) {
      const prefixTokens = getPrefixTokens(node, node.key)
      const lastPrefix = last(prefixTokens)

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      let lastKeyToken = null
      if (node.computed) {
        const keyLeftToken = /** @type {Token} */ (tokenStore.getFirstToken(
          node,
          isLeftBracket
        ))
        const keyToken = tokenStore.getTokenAfter(keyLeftToken)
        const keyRightToken = (lastKeyToken = /** @type {Token} */ (tokenStore.getTokenAfter(
          node.key,
          isRightBracket
        )))

        if (lastPrefix) {
          setOffset(keyLeftToken, 0, lastPrefix)
        }
        setOffset(keyToken, 1, keyLeftToken)
        setOffset(keyRightToken, 0, keyLeftToken)
      } else {
        const idToken = (lastKeyToken = tokenStore.getFirstToken(node.key))

        if (lastPrefix) {
          setOffset(idToken, 0, lastPrefix)
        }
      }

      const leftParenToken = tokenStore.getTokenAfter(lastKeyToken)

      setOffset(leftParenToken, 1, lastKeyToken)
    },
    /**
     * Process empty body function
     *
     * e.g.
     * ```
     * class Foo {
     *   abstract fn();
     * //           ^^^
     * }
     * ```
     */
    TSEmptyBodyFunctionExpression(node) {
      const leftToken = tokenStore.getFirstToken(node)
      const rightToken = tokenStore.getTokenAfter(
        last(node.params) || leftToken,
        isRightParen
      )

      processNodeList(node.params, leftToken, rightToken, 1)

      processSemicolons(node)
    },
    /**
     * Process type operator
     *
     * e.g.
     * ```
     * type Foo = keyof Bar
     * //         ^^^^^^^^^
     * ```
     */
    TSTypeOperator(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const nextToken = tokenStore.getTokenAfter(firstToken)

      setOffset(nextToken, 0, firstToken)
    },
    /**
     * Process conditional type
     *
     * e.g.
     * ```
     * type Foo = A extends B ? Bar : Baz
     * //         ^^^^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSConditionalType(node) {
      const prevToken = tokenStore.getTokenBefore(node)
      const firstToken = tokenStore.getFirstToken(node)
      const questionToken = /** @type {Token} */ (tokenStore.getTokenAfter(
        node.extendsType,
        isNotRightParen
      ))
      const consequentToken = tokenStore.getTokenAfter(questionToken)
      const colonToken = /** @type {Token} */ (tokenStore.getTokenAfter(
        node.trueType,
        isNotRightParen
      ))
      const alternateToken = tokenStore.getTokenAfter(colonToken)
      const isFlat =
        prevToken &&
        prevToken.loc.end.line !== node.loc.start.line &&
        node.extendsType.loc.end.line === node.trueType.loc.start.line

      if (isFlat) {
        setOffset(
          [questionToken, consequentToken, colonToken, alternateToken],
          0,
          firstToken
        )
      } else {
        setOffset([questionToken, colonToken], 1, firstToken)
        setOffset([consequentToken, alternateToken], 1, questionToken)
      }
    },
    /**
     * Process type alias declaration
     *
     * e.g.
     * ```
     * type Foo
     * ```
     */
    TSTypeAliasDeclaration(node) {
      const prefixTokens = getPrefixTokens(node, node.id)
      const lastPrefix = /** @type {Token}*/ (last(prefixTokens))

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }
      const idToken = tokenStore.getFirstToken(node.id)
      setOffset(idToken, 1, lastPrefix)

      // process TSTypeParameterDeclaration
      // if (node.typeParameters) {
      //   setOffset(tokenStore.getFirstToken(node.typeParameters), 1, idToken)
      // }

      const eqToken = tokenStore.getTokenAfter(node.typeParameters || node.id)
      const initToken = tokenStore.getTokenAfter(eqToken)

      setOffset([eqToken, initToken], 1, idToken)
    },
    /**
     * Process interface declaration
     *
     * e.g.
     * ```
     * interface Foo { }
     * ```
     */
    TSInterfaceDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const bodyToken = tokenStore.getFirstToken(node.body)

      setOffset(tokenStore.getFirstToken(node.id), 1, firstToken)

      if (node.extends != null) {
        const extendsToken = tokenStore.getTokenAfter(
          node.typeParameters || node.id,
          isExtendsKeyword
        )
        setOffset(extendsToken, 1, firstToken)
        processNodeList(node.extends, extendsToken, null, 1)
      }
      setOffset(bodyToken, 0, firstToken)
    },
    /**
     * Process interface heritage and class implements
     *
     * e.g.
     * ```
     * interface Foo<T> extends Bar<T> { }
     * //                       ^^^^^^
     * class Foo<T> implements Bar<T> { }
     * //                      ^^^^^^
     * ```
     * @param {TSInterfaceHeritage|TSClassImplements} node
     */
    'TSInterfaceHeritage, TSClassImplements'(node) {
      if (node.typeParameters != null) {
        const expressionToken = tokenStore.getFirstToken(node.expression)
        const paramFirstToken = tokenStore.getFirstToken(node.typeParameters)
        setOffset(paramFirstToken, 0, expressionToken)
      }
    },
    /**
     * Process interface body
     *
     * e.g.
     * ```
     * interface Foo { }
     * //            ^^^
     * ```
     */
    TSInterfaceBody(node) {
      processNodeList(
        node.body,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process type parameter declaration
     *
     * e.g.
     * ```
     * type Foo<T>
     * //      ^^^
     * ```
     */
    TSTypeParameterDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)
      if (node.parent && node.parent.typeParameters === node) {
        setOffset(firstToken, 1, tokenStore.getTokenBefore(firstToken))
      }
      processNodeList(node.params, firstToken, tokenStore.getLastToken(node), 1)
    },
    /**
     * Process type parameter
     *
     * e.g.
     * ```
     * type Foo<T, U extends T, V = U>
     * //       ^  ^^^^^^^^^^^  ^^^^^
     * ```
     */
    TSTypeParameter(node) {
      const firstToken = tokenStore.getFirstToken(node)

      // e.g U extends T
      if (node.constraint != null) {
        const constraintToken = tokenStore.getFirstToken(node.constraint)
        const extendsToken = tokenStore.getTokenBefore(constraintToken)
        setOffset([extendsToken, constraintToken], 1, firstToken)
      }

      // e.g. V = U
      if (node.default != null) {
        const defaultToken = tokenStore.getFirstToken(node.default)
        const equalToken = tokenStore.getTokenBefore(defaultToken)
        setOffset([equalToken, defaultToken], 1, firstToken)
      }
    },
    /**
     * Process constructor type and construct signature declaration
     *
     * e.g.
     * ```
     * type Foo = new () => T
     * //         ^^^^^^^^^^^
     * interface Foo {
     *   new ();
     * //^^^^^^^
     * }
     * ```
     * @param {TSConstructorType|TSConstructSignatureDeclaration} node
     */
    'TSConstructorType, TSConstructSignatureDeclaration'(node) {
      const newToken = tokenStore.getFirstToken(node)

      let leftParen
      if (node.typeParameters != null) {
        const paramFirstToken = tokenStore.getFirstToken(node.typeParameters)
        setOffset(paramFirstToken, 0, newToken)
        leftParen = /** @type {Token} */ (tokenStore.getTokenAfter(
          node.typeParameters,
          isLeftParen
        ))
      } else {
        leftParen = /** @type {Token} */ (tokenStore.getTokenAfter(
          newToken,
          isLeftParen
        ))
      }

      setOffset(leftParen, 1, newToken)
      const rightParen = /** @type {Token} */ (tokenStore.getTokenAfter(
        last(node.params) || leftParen,
        isRightParen
      ))
      processNodeList(node.params, leftParen, rightParen, 1)

      const arrowOrColonToken = tokenStore.getTokenAfter(
        rightParen,
        (node) => isArrow(node) || isColon(node)
      )
      setOffset(arrowOrColonToken, 1, newToken)

      if (node.returnType != null) {
        const returnFirstToken = tokenStore.getFirstToken(node.returnType)
        setOffset(returnFirstToken, 1, newToken)
      }
    },
    /**
     * Process call signature declaration
     *
     * e.g.
     * ```
     * interface Foo {
     *   (): string;
     * //^^^^^^^^^^^
     * }
     * ```
     */
    TSCallSignatureDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)

      let leftParen
      if (node.typeParameters != null) {
        leftParen = tokenStore.getTokenAfter(node.typeParameters)
        setOffset(leftParen, 0, firstToken)
      } else {
        leftParen = firstToken
      }

      const rightParen = /** @type {Token} */ (tokenStore.getTokenAfter(
        last(node.params) || leftParen,
        isRightParen
      ))
      processNodeList(node.params, leftParen, rightParen, 1)

      const arrowOrColonToken = tokenStore.getTokenAfter(
        rightParen,
        (node) => isArrow(node) || isColon(node)
      )
      setOffset(arrowOrColonToken, 1, firstToken)

      if (node.returnType != null) {
        const returnFirstToken = tokenStore.getFirstToken(node.returnType)
        setOffset(returnFirstToken, 1, firstToken)
      }
    },
    /**
     * Process declare function
     *
     * e.g.
     * ```
     * declare function foo();
     * ```
     */
    TSDeclareFunction(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const idToken = tokenStore.getFirstToken(node.id)
      const starToken = node.generator
        ? tokenStore.getTokenBefore(idToken)
        : null

      const prefixTokens = getPrefixTokens(node, starToken || idToken)

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      const leftToken = tokenStore.getTokenAfter(idToken)
      const rightToken = tokenStore.getTokenAfter(
        last(node.params) || leftToken,
        isRightParen
      )

      if (node.generator) {
        setOffset(starToken, 1, firstToken)
      }

      setOffset(idToken, 1, firstToken)

      setOffset(leftToken, 1, firstToken)
      processNodeList(node.params, leftToken, rightToken, 1)

      if (node.body != null) {
        const bodyToken = tokenStore.getFirstToken(node.body)
        setOffset(bodyToken, 0, firstToken)
      }

      processSemicolons(node)
    },
    /**
     * Process type predicate
     *
     * e.g.
     * ```
     * function foo(value): value is string;
     * //                   ^^^^^^^^^^^^^^^
     * ```
     */
    TSTypePredicate(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const isToken = tokenStore.getTokenAfter(node.parameterName)
      setOffset(isToken, 1, firstToken)
      if (node.typeAnnotation != null) {
        const typeAnnotationToken = tokenStore.getFirstToken(
          node.typeAnnotation
        )
        setOffset(typeAnnotationToken, 1, firstToken)
      }
    },
    /**
     * Process enum
     *
     * e.g.
     * ```
     * enum Foo { }
     * ```
     */
    TSEnumDeclaration(node) {
      const prefixTokens = getPrefixTokens(node, node.id)
      const lastPrefix = /** @type {Token}*/ (last(prefixTokens))

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }
      setOffset(tokenStore.getFirstToken(node.id), 1, lastPrefix)
      const firstToken = tokenStore.getFirstToken(node)
      const bodyToken = tokenStore.getTokenAfter(node.id)

      setOffset(bodyToken, 0, firstToken)

      processNodeList(
        node.members,
        tokenStore.getTokenAfter(node.id),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process enum member
     *
     * e.g.
     * ```
     * enum Foo { Bar = x }
     * //         ^^^^^^^
     * ```
     */
    TSEnumMember(node) {
      /** @type {Token} */
      let lastIdToken
      if (node.computed) {
        const keyLeftToken = /** @type {Token} */ (tokenStore.getFirstToken(
          node,
          isLeftBracket
        ))
        const keyToken = tokenStore.getTokenAfter(keyLeftToken)
        const keyRightToken = (lastIdToken = /** @type {Token} */ (tokenStore.getTokenAfter(
          node.id,
          isRightBracket
        )))

        setOffset(keyToken, 1, keyLeftToken)
        setOffset(keyRightToken, 0, keyLeftToken)
      } else {
        lastIdToken = tokenStore.getFirstToken(node.id)
      }

      if (node.initializer) {
        const equalToken = tokenStore.getTokenAfter(lastIdToken)

        setOffset(
          [equalToken, tokenStore.getFirstToken(node.initializer)],
          1,
          lastIdToken
        )
      }
    },
    /**
     * Process export assignment
     *
     * e.g.
     * ```
     * export = foo
     * ```
     */
    TSExportAssignment(node) {
      const prefixTokens = getPrefixTokens(node, node.expression)
      const firstToken =
        prefixTokens.shift() || tokenStore.getFirstToken(node.expression)

      setOffset(
        [...prefixTokens, tokenStore.getFirstToken(node.expression)],
        1,
        firstToken
      )
    },
    /**
     * Process import equal
     *
     * e.g.
     * ```
     * import foo = require('foo')
     * ```
     */
    TSImportEqualsDeclaration(node) {
      processNodeList(
        [node.id, node.moduleReference],
        tokenStore.getFirstToken(node),
        null,
        1
      )

      const idToken = tokenStore.getFirstToken(node.id)
      const eqToken = tokenStore.getTokenAfter(node.id)
      const initToken = tokenStore.getTokenAfter(eqToken)

      setOffset([eqToken, initToken], 1, idToken)
    },
    /**
     * Process external module reference
     *
     * e.g.
     * ```
     * import foo = require('foo')
     * //           ^^^^^^^^^^^^^^
     * ```
     */
    TSExternalModuleReference(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const rightToken = tokenStore.getLastToken(node)
      const leftToken = tokenStore.getTokenBefore(node.expression, isLeftParen)

      setOffset(leftToken, 1, firstToken)
      processNodeList([node.expression], leftToken, rightToken, 1)
    },
    /**
     * Process import type
     *
     * e.g.
     * ```
     * const foo: import('foo').Bar<T>
     * //         ^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSImportType(node) {
      // process import('foo')
      const prefixTokens = getPrefixTokens(node, node.parameter)
      const lastPrefix = /** @type {Token}*/ (last(prefixTokens))

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }
      const leftParenToken = tokenStore.getTokenBefore(
        node.parameter,
        isLeftParen
      )
      const rightParenToken = /** @type {Token}*/ (tokenStore.getTokenAfter(
        node.parameter,
        isRightParen
      ))

      setOffset(leftParenToken, 1, lastPrefix)
      processNodeList([node.parameter], leftParenToken, rightParenToken, 1)

      // process .Bar
      if (node.qualifier) {
        const dotToken = tokenStore.getTokenAfter(rightParenToken)
        const qualifierToken = tokenStore.getFirstToken(node.qualifier)

        setOffset([dotToken, qualifierToken], 1, lastPrefix)
      }
    },
    /**
     * Process infer type
     *
     * e.g.
     * ```
     * type Foo<T> = T extends Bar<infer U> ? U : T;
     * //                          ^^^^^^^
     * ```
     */
    TSInferType(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const nextToken = tokenStore.getTokenAfter(firstToken)

      setOffset(nextToken, 1, firstToken)
    },
    TSIndexedAccessType(node) {
      const objectToken = tokenStore.getFirstToken(node)
      const leftBracketToken = /** @type {Token} */ (tokenStore.getTokenBefore(
        node.indexType,
        isLeftBracket
      ))
      const propertyToken = tokenStore.getTokenAfter(leftBracketToken)
      const rightBracketToken = tokenStore.getTokenAfter(
        node.indexType,
        isRightBracket
      )

      setOffset(leftBracketToken, 1, objectToken)
      setOffset(propertyToken, 1, leftBracketToken)
      setOffset(rightBracketToken, 0, leftBracketToken)
    },
    TSFunctionType(node) {
      const leftParenToken = tokenStore.getFirstToken(node)
      const arrowToken = tokenStore.getFirstToken(node.returnType, isArrow)

      const rightParenToken = tokenStore.getTokenAfter(
        last(node.params) || leftParenToken,
        isRightParen
      )
      processNodeList(node.params, leftParenToken, rightParenToken, 1)

      setOffset(arrowToken, 1, leftParenToken)
    },
    TSMethodSignature() {
      console.log('not impl TSMethodSignature')
    },
    TSModuleBlock() {
      console.log('not impl TSModuleBlock')
    },
    TSModuleDeclaration() {
      console.log('not impl TSModuleDeclaration')
    },
    TSNamespaceExportDeclaration() {
      console.log('not impl TSNamespaceExportDeclaration')
    },
    TSNonNullExpression() {
      console.log('not impl TSNonNullExpression')
    },
    TSMappedType() {
      console.log('not impl TSMappedType')
    },
    TSParameterProperty() {
      console.log('not impl TSParameterProperty')
    },
    TSQualifiedName() {
      console.log('not impl TSQualifiedName')
    },
    TSRestType() {
      console.log('not impl TSRestType')
    },
    TSThisType() {
      console.log('not impl TSThisType')
    },
    TSTypeAssertion() {
      console.log('not impl TSTypeAssertion')
    },
    TSTypeQuery() {
      console.log('not impl TSTypeQuery')
    },
    TSIntersectionType() {
      console.log('not impl TSIntersectionType')
    },
    TSTupleType() {
      console.log('not impl TSTupleType')
    },
    TSOptionalType() {
      console.log('not impl TSOptionalType')
    },
    TSParenthesizedType() {
      console.log('not impl TSParenthesizedType')
    },
    TSUnionType() {
      console.log('not impl TSUnionType')
    },
    TSAnyKeyword() {}, // noop
    TSBooleanKeyword() {}, // noop
    TSNumberKeyword() {}, // noop
    TSStringKeyword() {}, // noop
    TSUndefinedKeyword() {}, // noop
    TSVoidKeyword() {}, // noop
    TSLiteralType() {} // noop
  }
}
