/**
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/types/src/ts-estree.ts
 */
import { HasParentNode } from '../node'
import * as ES from './es-ast'
import * as NEXT from './esnext-ast'
export type TSNode =
  | TSAbstractClassProperty
  | TSAbstractKeyword
  | TSAbstractMethodDefinition
  | TSAnyKeyword
  | TSArrayType
  | TSAsExpression
  | TSAsyncKeyword
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSCallSignatureDeclaration
  | TSClassImplements
  | TSConditionalType
  | TSConstructorType
  | TSConstructSignatureDeclaration
  | TSDeclareFunction
  | TSDeclareKeyword
  | TSEmptyBodyFunctionExpression
  | TSEnumDeclaration
  | TSEnumMember
  | TSExportAssignment
  | TSExportKeyword
  | TSExternalModuleReference
  | TSFunctionType
  | TSImportEqualsDeclaration
  | TSImportType
  | TSIndexedAccessType
  | TSIndexSignature
  | TSInferType
  | TSInterfaceDeclaration
  | TSInterfaceBody
  | TSInterfaceHeritage
  | TSIntersectionType
  | TSLiteralType
  | TSMappedType
  | TSMethodSignature
  | TSModuleBlock
  | TSModuleDeclaration
  | TSNamespaceExportDeclaration
  | TSNeverKeyword
  | TSNonNullExpression
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSOptionalType
  | TSParameterProperty
  | TSParenthesizedType
  | TSPropertySignature
  | TSPublicKeyword
  | TSPrivateKeyword
  | TSProtectedKeyword
  | TSQualifiedName
  | TSReadonlyKeyword
  | TSRestType
  | TSStaticKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSThisType
  | TSTupleType
  | TSTypeAliasDeclaration
  | TSTypeAnnotation
  | TSTypeAssertion
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypeParameter
  | TSTypeParameterDeclaration
  | TSTypeParameterInstantiation
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUndefinedKeyword
  | TSUnionType
  | TSUnknownKeyword
  | TSVoidKeyword

type TypeNode =
  | TSAnyKeyword
  | TSArrayType
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSConditionalType
  | TSConstructorType
  | TSFunctionType
  | TSImportType
  | TSIndexedAccessType
  | TSInferType
  | TSInterfaceHeritage
  | TSIntersectionType
  | TSLiteralType
  | TSMappedType
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSOptionalType
  | TSParenthesizedType
  | TSRestType
  | TSStringKeyword
  | TSSymbolKeyword
  | TSThisType
  | TSTupleType
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypePredicate
  | TSTypeReference
  | TSTypeQuery
  | TSUndefinedKeyword
  | TSUnionType
  | TSUnknownKeyword
  | TSVoidKeyword

type Accessibility = 'public' | 'protected' | 'private'
interface FunctionSignatureBase extends HasParentNode {
  params: ES._FunctionParameter[]
  returnType?: TSTypeAnnotation
  typeParameters?: TSTypeParameterDeclaration
}

interface FunctionDeclarationBase extends HasParentNode {
  id: ES.Identifier | null
  generator: boolean
  expression: boolean
  async: boolean
  params: ES._FunctionParameter[]
  body?: ES.BlockStatement | null
  returnType?: TSTypeAnnotation
  typeParameters?: TSTypeParameterDeclaration
  declare?: boolean
}

interface TSHeritageBase extends HasParentNode {
  expression: ES.Expression
  typeParameters?: TSTypeParameterInstantiation
}
type Modifier =
  | TSAbstractKeyword
  | TSAsyncKeyword
  | TSDeclareKeyword
  | TSExportKeyword
  | TSPublicKeyword
  | TSPrivateKeyword
  | TSProtectedKeyword
  | TSReadonlyKeyword
  | TSStaticKeyword

type EntityName = ES.Identifier | TSQualifiedName
type TypeElement =
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSIndexSignature
  | TSMethodSignature
  | TSPropertySignature
export interface TSAbstractClassProperty extends HasParentNode {
  type: 'TSAbstractClassProperty'
  key: ES.Expression
  value: ES.Expression | null
  computed: boolean
  static: boolean
  declare: boolean
  readonly?: boolean
  decorators?: NEXT.Decorator[]
  accessibility?: Accessibility
  optional?: boolean
  definite?: boolean
  typeAnnotation?: TSTypeAnnotation
}

export interface TSAbstractKeyword extends HasParentNode {
  type: 'TSAbstractKeyword'
}

export interface TSAbstractMethodDefinition extends HasParentNode {
  type: 'TSAbstractMethodDefinition'
  key: ES.Expression
  value: FunctionExpression | TSEmptyBodyFunctionExpression
  computed: boolean
  static: boolean
  kind: 'method' | 'get' | 'set' | 'constructor'
  optional?: boolean
  decorators?: NEXT.Decorator[]
  accessibility?: Accessibility
  typeParameters?: TSTypeParameterDeclaration
}

export interface TSAnyKeyword extends HasParentNode {
  type: 'TSAnyKeyword'
}

export interface TSArrayType extends HasParentNode {
  type: 'TSArrayType'
  elementType: TypeNode
}

export interface TSAsExpression extends HasParentNode {
  type: 'TSAsExpression'
  expression: ES.Expression
  typeAnnotation: TypeNode
}

export interface TSAsyncKeyword extends HasParentNode {
  type: 'TSAsyncKeyword'
}

export interface TSBigIntKeyword extends HasParentNode {
  type: 'TSBigIntKeyword'
}

export interface TSBooleanKeyword extends HasParentNode {
  type: 'TSBooleanKeyword'
}

export interface TSCallSignatureDeclaration extends FunctionSignatureBase {
  type: 'TSCallSignatureDeclaration'
}

export interface TSClassImplements extends TSHeritageBase {
  type: 'TSClassImplements'
}

export interface TSConditionalType extends HasParentNode {
  type: 'TSConditionalType'
  checkType: TypeNode
  extendsType: TypeNode
  trueType: TypeNode
  falseType: TypeNode
}

export interface TSConstructorType extends FunctionSignatureBase {
  type: 'TSConstructorType'
}

export interface TSConstructSignatureDeclaration extends FunctionSignatureBase {
  type: 'TSConstructSignatureDeclaration'
}

export interface TSDeclareFunction extends FunctionDeclarationBase {
  type: 'TSDeclareFunction'
  id: ES.Identifier
}

export interface TSDeclareKeyword extends HasParentNode {
  type: 'TSDeclareKeyword'
}

export interface TSEmptyBodyFunctionExpression extends FunctionDeclarationBase {
  type: 'TSEmptyBodyFunctionExpression'
  body: null
}

export interface TSEnumDeclaration extends HasParentNode {
  type: 'TSEnumDeclaration'
  id: Identifier
  members: TSEnumMember[]
  const?: boolean
  declare?: boolean
  modifiers?: Modifier[]
  decorators?: NEXT.Decorator[]
}

export interface TSEnumMember extends HasParentNode {
  type: 'TSEnumMember'
  id: ES.Expression
  initializer?: ES.Expression
  computed?: boolean
}

export interface TSExportAssignment extends HasParentNode {
  type: 'TSExportAssignment'
  expression: ES.Expression
}

export interface TSExportKeyword extends HasParentNode {
  type: 'TSExportKeyword'
}

export interface TSExternalModuleReference extends HasParentNode {
  type: 'TSExternalModuleReference'
  expression: ES.Expression
}

export interface TSFunctionType extends FunctionSignatureBase {
  type: 'TSFunctionType'
  returnType: TSTypeAnnotation
}

export interface TSImportEqualsDeclaration extends HasParentNode {
  type: 'TSImportEqualsDeclaration'
  id: Identifier
  moduleReference: EntityName | TSExternalModuleReference
  isExport: boolean
}

export interface TSImportType extends HasParentNode {
  type: 'TSImportType'
  isTypeOf: boolean
  parameter: TypeNode
  qualifier: EntityName | null
  typeParameters: TSTypeParameterInstantiation | null
}

export interface TSIndexedAccessType extends HasParentNode {
  type: 'TSIndexedAccessType'
  objectType: TypeNode
  indexType: TypeNode
}

export interface TSIndexSignature extends HasParentNode {
  type: 'TSIndexSignature'
  parameters: ES._FunctionParameter[]
  typeAnnotation?: TSTypeAnnotation
  readonly?: boolean
  accessibility?: Accessibility
  export?: boolean
  static?: boolean
}

export interface TSInferType extends HasParentNode {
  type: 'TSInferType'
  typeParameter: TSTypeParameter
}

export interface TSInterfaceDeclaration extends HasParentNode {
  type: 'TSInterfaceDeclaration'
  body: TSInterfaceBody
  id: ES.Identifier
  typeParameters?: TSTypeParameterDeclaration
  extends?: TSInterfaceHeritage[]
  implements?: TSInterfaceHeritage[]
  decorators?: NEXT.Decorator[]
  abstract?: boolean
  declare?: boolean
}

export interface TSInterfaceBody extends HasParentNode {
  type: 'TSInterfaceBody'
  body: TypeElement[]
}

export interface TSInterfaceHeritage extends TSHeritageBase {
  type: 'TSInterfaceHeritage'
}

export interface TSIntersectionType extends HasParentNode {
  type: 'TSIntersectionType'
  types: TypeNode[]
}

export interface TSLiteralType extends HasParentNode {
  type: 'TSLiteralType'
  literal:
    | ES.Literal
    | ES.TemplateLiteral
    | ES.UnaryExpression
    | ES.UpdateExpression
}

export interface TSMappedType extends HasParentNode {
  type: 'TSMappedType'
  typeParameter: TSTypeParameterDeclaration
  readonly?: boolean | '-' | '+'
  optional?: boolean | '-' | '+'
  typeAnnotation?: TypeNode
}

export interface TSMethodSignature extends HasParentNode {
  type: 'TSMethodSignature'
  key: Expression
  computed: boolean
  params: ES._FunctionParameter[]
  optional?: boolean
  returnType?: TSTypeAnnotation
  readonly?: boolean
  typeParameters?: TSTypeParameterDeclaration
  accessibility?: Accessibility
  export?: boolean
  static?: boolean
}

export interface TSModuleBlock extends HasParentNode {
  type: 'TSModuleBlock'
  body: Statement[]
}

export interface TSModuleDeclaration extends HasParentNode {
  type: 'TSModuleDeclaration'
  id: Identifier | Literal
  body?: TSModuleBlock | TSModuleDeclaration
  global?: boolean
  declare?: boolean
  modifiers?: Modifier[]
}

export interface TSNamespaceExportDeclaration extends HasParentNode {
  type: 'TSNamespaceExportDeclaration'
  id: Identifier
}

export interface TSNeverKeyword extends HasParentNode {
  type: 'TSNeverKeyword'
}

export interface TSNonNullExpression extends HasParentNode {
  type: 'TSNonNullExpression'
  expression: ES.Expression
}

export interface TSNullKeyword extends HasParentNode {
  type: 'TSNullKeyword'
}

export interface TSNumberKeyword extends HasParentNode {
  type: 'TSNumberKeyword'
}

export interface TSObjectKeyword extends HasParentNode {
  type: 'TSObjectKeyword'
}

export interface TSOptionalType extends HasParentNode {
  type: 'TSOptionalType'
  typeAnnotation: TypeNode
}

export interface TSParameterProperty extends HasParentNode {
  type: 'TSParameterProperty'
  accessibility?: Accessibility
  readonly?: boolean
  static?: boolean
  export?: boolean
  parameter:
    | ES.AssignmentPattern
    | ES.ArrayPattern
    | ES.ObjectPattern
    | ES.Identifier
    | ES.RestElement
  decorators?: NEXT.Decorator[]
}

export interface TSParenthesizedType extends HasParentNode {
  type: 'TSParenthesizedType'
  typeAnnotation: TypeNode
}

export interface TSPropertySignature extends HasParentNode {
  type: 'TSPropertySignature'
  key: Expression
  optional?: boolean
  computed: boolean
  typeAnnotation?: TSTypeAnnotation
  initializer?: Expression
  readonly?: boolean
  static?: boolean
  export?: boolean
  accessibility?: Accessibility
}

export interface TSPublicKeyword extends HasParentNode {
  type: 'TSPublicKeyword'
}

export interface TSPrivateKeyword extends HasParentNode {
  type: 'TSPrivateKeyword'
}

export interface TSProtectedKeyword extends HasParentNode {
  type: 'TSProtectedKeyword'
}

export interface TSQualifiedName extends HasParentNode {
  type: 'TSQualifiedName'
  left: EntityName
  right: ES.Identifier
}

export interface TSReadonlyKeyword extends HasParentNode {
  type: 'TSReadonlyKeyword'
}

export interface TSRestType extends HasParentNode {
  type: 'TSRestType'
  typeAnnotation: TypeNode
}

export interface TSStaticKeyword extends HasParentNode {
  type: 'TSStaticKeyword'
}

export interface TSStringKeyword extends HasParentNode {
  type: 'TSStringKeyword'
}

export interface TSSymbolKeyword extends HasParentNode {
  type: 'TSSymbolKeyword'
}

export interface TSThisType extends HasParentNode {
  type: 'TSThisType'
}

export interface TSTupleType extends HasParentNode {
  type: 'TSTupleType'
  elementTypes: TypeNode[]
}

export interface TSTypeAliasDeclaration extends HasParentNode {
  type: 'TSTypeAliasDeclaration'
  id: ES.Identifier
  typeAnnotation: TypeNode
  declare?: boolean
  typeParameters?: TSTypeParameterDeclaration
}

export interface TSTypeAnnotation extends HasParentNode {
  type: 'TSTypeAnnotation'
  typeAnnotation: TypeNode

  parent: HasParentNode['parent'] & { optional?: boolean }
}

export interface TSTypeAssertion extends HasParentNode {
  type: 'TSTypeAssertion'
  typeAnnotation: TypeNode
  expression: ES.Expression
}

export interface TSTypeLiteral extends HasParentNode {
  type: 'TSTypeLiteral'
  members: TypeElement[]
}

export interface TSTypeOperator extends HasParentNode {
  type: 'TSTypeOperator'
  operator: 'keyof' | 'unique' | 'readonly'
  typeAnnotation?: TypeNode
}

export interface TSTypeParameter extends HasParentNode {
  type: 'TSTypeParameter'
  name: ES.Identifier
  constraint?: TypeNode
  default?: TypeNode
}

export interface TSTypeParameterDeclaration extends HasParentNode {
  type: 'TSTypeParameterDeclaration'
  params: TSTypeParameter[]

  parent: HasParentNode['parent'] & {
    typeParameters?: TSTypeParameterDeclaration
  }
}

export interface TSTypeParameterInstantiation extends HasParentNode {
  type: 'TSTypeParameterInstantiation'
  params: TypeNode[]

  parent: HasParentNode['parent'] & {
    typeParameters?: TSTypeParameterInstantiation
  }
}

export interface TSTypePredicate extends HasParentNode {
  type: 'TSTypePredicate'
  asserts: boolean
  parameterName: ES.Identifier | TSThisType
  typeAnnotation: TSTypeAnnotation | null
}

export interface TSTypeQuery extends HasParentNode {
  type: 'TSTypeQuery'
  exprName: EntityName
}

export interface TSTypeReference extends HasParentNode {
  type: 'TSTypeReference'
  typeName: EntityName
  typeParameters?: TSTypeParameterInstantiation
}

export interface TSUndefinedKeyword extends HasParentNode {
  type: 'TSUndefinedKeyword'
}

export interface TSUnionType extends HasParentNode {
  type: 'TSUnionType'
  types: TypeNode[]
}

export interface TSUnknownKeyword extends HasParentNode {
  type: 'TSUnknownKeyword'
}

export interface TSVoidKeyword extends HasParentNode {
  type: 'TSVoidKeyword'
}
