import * as VAST from './util-types/ast'
import * as VNODE from './util-types/node'
import * as parserServices from './util-types/parser-services'
import * as eslint from 'eslint'

declare global {
  // **** Rule Helpers ****
  type RuleModule = eslint.Rule.RuleModule
  type RuleContext = eslint.Rule.RuleContext
  namespace Rule {
    type ReportDescriptor = eslint.Rule.ReportDescriptor
    type SuggestionReportDescriptor = eslint.Rule.SuggestionReportDescriptor
  }
  type SourceCode = eslint.SourceCode
  namespace SourceCode {
    type CursorWithSkipOptions = eslint.SourceCode.CursorWithSkipOptions
    type CursorWithCountOptions = eslint.SourceCode.CursorWithCountOptions
  }
  type RuleFixer = eslint.Rule.RuleFixer
  type Fix = eslint.Rule.Fix

  type NodeListener = eslint.Rule.NodeListener
  type RuleListener = eslint.Rule.RuleListener
  type TemplateListener = parserServices.TemplateListener
  type ParserServices = parserServices.ParserServices
  namespace ParserServices {
    type TokenStore = parserServices.ParserServices.TokenStore
  }

  // **** Node data ****

  type Range = VNODE.Range
  type Position = VNODE.Position
  type SourceLocation = VNODE.SourceLocation
  type Token = VNODE.Token
  type Comment = VNODE.Comment
  type HTMLComment = VNODE.HTMLComment
  type HTMLBogusComment = VNODE.HTMLBogusComment

  type NodeListenerMap = VAST.NodeListenerMap
  type VNodeListenerMap = VAST.VNodeListenerMap

  // **** AST nodes ****

  type ASTNode = VAST.ASTNode
  type ESNode = VAST.ESNode
  type VNode = VAST.VNode
  type TSNode = VAST.TSNode
  type JSXNode = VAST.JSXNode

  // ---- Vue Template Nodes ----

  type VAttribute = VAST.VAttribute
  type VDirective = VAST.VDirective
  type VDirectiveKey = VAST.VDirectiveKey
  type VDocumentFragment = VAST.VDocumentFragment
  type VElement = VAST.VElement
  type VRootElement = VAST.VRootElement
  type VEndTag = VAST.VEndTag
  type VExpressionContainer = VAST.VExpressionContainer
  type VIdentifier = VAST.VIdentifier
  type VLiteral = VAST.VLiteral
  type VStartTag = VAST.VStartTag
  type VText = VAST.VText
  type VForExpression = VAST.VForExpression
  type VOnExpression = VAST.VOnExpression
  type VSlotScopeExpression = VAST.VSlotScopeExpression
  type VFilterSequenceExpression = VAST.VFilterSequenceExpression
  type VFilter = VAST.VFilter

  // ---- ES Nodes ----

  type Identifier = VAST.Identifier
  type Literal = VAST.Literal
  type Program = VAST.Program
  type SwitchCase = VAST.SwitchCase
  type CatchClause = VAST.CatchClause
  type VariableDeclarator = VAST.VariableDeclarator
  type Statement = VAST.Statement
  type ExpressionStatement = VAST.ExpressionStatement
  type BlockStatement = VAST.BlockStatement
  type EmptyStatement = VAST.EmptyStatement
  type DebuggerStatement = VAST.DebuggerStatement
  type WithStatement = VAST.WithStatement
  type ReturnStatement = VAST.ReturnStatement
  type LabeledStatement = VAST.LabeledStatement
  type BreakStatement = VAST.BreakStatement
  type ContinueStatement = VAST.ContinueStatement
  type IfStatement = VAST.IfStatement
  type SwitchStatement = VAST.SwitchStatement
  type ThrowStatement = VAST.ThrowStatement
  type TryStatement = VAST.TryStatement
  type WhileStatement = VAST.WhileStatement
  type DoWhileStatement = VAST.DoWhileStatement
  type ForStatement = VAST.ForStatement
  type ForInStatement = VAST.ForInStatement
  type ForOfStatement = VAST.ForOfStatement
  type Declaration = VAST.Declaration
  type FunctionDeclaration = VAST.FunctionDeclaration
  type VariableDeclaration = VAST.VariableDeclaration
  type ClassDeclaration = VAST.ClassDeclaration
  type Expression = VAST.Expression
  type ThisExpression = VAST.ThisExpression
  type ArrayExpression = VAST.ArrayExpression
  type ObjectExpression = VAST.ObjectExpression
  type FunctionExpression = VAST.FunctionExpression
  type ArrowFunctionExpression = VAST.ArrowFunctionExpression
  type YieldExpression = VAST.YieldExpression
  type UnaryExpression = VAST.UnaryExpression
  type UpdateExpression = VAST.UpdateExpression
  type BinaryExpression = VAST.BinaryExpression
  type AssignmentExpression = VAST.AssignmentExpression
  type LogicalExpression = VAST.LogicalExpression
  type MemberExpression = VAST.MemberExpression
  type ConditionalExpression = VAST.ConditionalExpression
  type CallExpression = VAST.CallExpression
  type NewExpression = VAST.NewExpression
  type SequenceExpression = VAST.SequenceExpression
  type TemplateLiteral = VAST.TemplateLiteral
  type TaggedTemplateExpression = VAST.TaggedTemplateExpression
  type ClassExpression = VAST.ClassExpression
  type MetaProperty = VAST.MetaProperty
  type AwaitExpression = VAST.AwaitExpression
  type ChainExpression = VAST.ChainExpression
  type ChainElement = VAST.ChainElement
  type Property = VAST.Property
  type AssignmentProperty = VAST.AssignmentProperty
  type Super = VAST.Super
  type TemplateElement = VAST.TemplateElement
  type SpreadElement = VAST.SpreadElement
  type Pattern = VAST.Pattern
  type ObjectPattern = VAST.ObjectPattern
  type ArrayPattern = VAST.ArrayPattern
  type RestElement = VAST.RestElement
  type AssignmentPattern = VAST.AssignmentPattern
  type ClassBody = VAST.ClassBody
  type MethodDefinition = VAST.MethodDefinition
  type ModuleDeclaration = VAST.ModuleDeclaration
  type ImportDeclaration = VAST.ImportDeclaration
  type ExportNamedDeclaration = VAST.ExportNamedDeclaration
  type ExportDefaultDeclaration = VAST.ExportDefaultDeclaration
  type ExportAllDeclaration = VAST.ExportAllDeclaration
  type ModuleSpecifier = VAST.ModuleSpecifier
  type ImportSpecifier = VAST.ImportSpecifier
  type ImportDefaultSpecifier = VAST.ImportDefaultSpecifier
  type ImportNamespaceSpecifier = VAST.ImportNamespaceSpecifier
  type ExportSpecifier = VAST.ExportSpecifier
  type ImportExpression = VAST.ImportExpression

  // ---- ESNext Nodes ----

  type Decorator = VAST.Decorator
  type ClassProperty = VAST.ClassProperty

  // ---- TS Nodes ----

  type TSAbstractClassProperty = VAST.TSAbstractClassProperty
  type TSAbstractKeyword = VAST.TSAbstractKeyword
  type TSAbstractMethodDefinition = VAST.TSAbstractMethodDefinition
  type TSAnyKeyword = VAST.TSAnyKeyword
  type TSArrayType = VAST.TSArrayType
  type TSAsExpression = VAST.TSAsExpression
  type TSAsyncKeyword = VAST.TSAsyncKeyword
  type TSBigIntKeyword = VAST.TSBigIntKeyword
  type TSBooleanKeyword = VAST.TSBooleanKeyword
  type TSCallSignatureDeclaration = VAST.TSCallSignatureDeclaration
  type TSClassImplements = VAST.TSClassImplements
  type TSConditionalType = VAST.TSConditionalType
  type TSConstructorType = VAST.TSConstructorType
  type TSConstructSignatureDeclaration = VAST.TSConstructSignatureDeclaration
  type TSDeclareFunction = VAST.TSDeclareFunction
  type TSDeclareKeyword = VAST.TSDeclareKeyword
  type TSEmptyBodyFunctionExpression = VAST.TSEmptyBodyFunctionExpression
  type TSEnumDeclaration = VAST.TSEnumDeclaration
  type TSEnumMember = VAST.TSEnumMember
  type TSExportAssignment = VAST.TSExportAssignment
  type TSExportKeyword = VAST.TSExportKeyword
  type TSExternalModuleReference = VAST.TSExternalModuleReference
  type TSFunctionType = VAST.TSFunctionType
  type TSImportEqualsDeclaration = VAST.TSImportEqualsDeclaration
  type TSImportType = VAST.TSImportType
  type TSIndexedAccessType = VAST.TSIndexedAccessType
  type TSIndexSignature = VAST.TSIndexSignature
  type TSInferType = VAST.TSInferType
  type TSInterfaceDeclaration = VAST.TSInterfaceDeclaration
  type TSInterfaceBody = VAST.TSInterfaceBody
  type TSInterfaceHeritage = VAST.TSInterfaceHeritage
  type TSIntersectionType = VAST.TSIntersectionType
  type TSLiteralType = VAST.TSLiteralType
  type TSMappedType = VAST.TSMappedType
  type TSMethodSignature = VAST.TSMethodSignature
  type TSModuleBlock = VAST.TSModuleBlock
  type TSModuleDeclaration = VAST.TSModuleDeclaration
  type TSNamespaceExportDeclaration = VAST.TSNamespaceExportDeclaration
  type TSNeverKeyword = VAST.TSNeverKeyword
  type TSNonNullExpression = VAST.TSNonNullExpression
  type TSNullKeyword = VAST.TSNullKeyword
  type TSNumberKeyword = VAST.TSNumberKeyword
  type TSObjectKeyword = VAST.TSObjectKeyword
  type TSOptionalType = VAST.TSOptionalType
  type TSParameterProperty = VAST.TSParameterProperty
  type TSParenthesizedType = VAST.TSParenthesizedType
  type TSPropertySignature = VAST.TSPropertySignature
  type TSPublicKeyword = VAST.TSPublicKeyword
  type TSPrivateKeyword = VAST.TSPrivateKeyword
  type TSProtectedKeyword = VAST.TSProtectedKeyword
  type TSQualifiedName = VAST.TSQualifiedName
  type TSReadonlyKeyword = VAST.TSReadonlyKeyword
  type TSRestType = VAST.TSRestType
  type TSStaticKeyword = VAST.TSStaticKeyword
  type TSStringKeyword = VAST.TSStringKeyword
  type TSSymbolKeyword = VAST.TSSymbolKeyword
  type TSThisType = VAST.TSThisType
  type TSTupleType = VAST.TSTupleType
  type TSTypeAliasDeclaration = VAST.TSTypeAliasDeclaration
  type TSTypeAnnotation = VAST.TSTypeAnnotation
  type TSTypeAssertion = VAST.TSTypeAssertion
  type TSTypeLiteral = VAST.TSTypeLiteral
  type TSTypeOperator = VAST.TSTypeOperator
  type TSTypeParameter = VAST.TSTypeParameter
  type TSTypeParameterDeclaration = VAST.TSTypeParameterDeclaration
  type TSTypeParameterInstantiation = VAST.TSTypeParameterInstantiation
  type TSTypePredicate = VAST.TSTypePredicate
  type TSTypeQuery = VAST.TSTypeQuery
  type TSTypeReference = VAST.TSTypeReference
  type TSUndefinedKeyword = VAST.TSUndefinedKeyword
  type TSUnionType = VAST.TSUnionType
  type TSUnknownKeyword = VAST.TSUnknownKeyword
  type TSVoidKeyword = VAST.TSVoidKeyword

  // ---- JSX Nodes ----

  type JSXAttribute = VAST.JSXAttribute
  type JSXClosingElement = VAST.JSXClosingElement
  type JSXClosingFragment = VAST.JSXClosingFragment
  type JSXElement = VAST.JSXElement
  type JSXEmptyExpression = VAST.JSXEmptyExpression
  type JSXExpressionContainer = VAST.JSXExpressionContainer
  type JSXFragment = VAST.JSXFragment
  type JSXIdentifier = VAST.JSXIdentifier
  type JSXOpeningElement = VAST.JSXOpeningElement
  type JSXOpeningFragment = VAST.JSXOpeningFragment
  type JSXSpreadAttribute = VAST.JSXSpreadAttribute
  type JSXSpreadChild = VAST.JSXSpreadChild
  type JSXMemberExpression = VAST.JSXMemberExpression
  type JSXText = VAST.JSXText

  // **** Variables ****

  type VVariable = VAST.VVariable
  type VReference = VAST.VReference

  type Variable = eslint.Scope.Variable
  type Reference = eslint.Scope.Reference
}
