import { HasParentNode } from '../node'
import * as ES from './es-ast'
import * as TS from './ts-ast'

export type ESNEXTNode = Decorator | ClassProperty
// https://github.com/estree/estree/blob/master/experimental/decorators.md
export interface Decorator extends HasParentNode {
  type: 'Decorator'
  expression: ES.Expression
}

export interface ClassProperty extends HasParentNode {
  type: 'ClassProperty'
  key: Expression
  value: Expression | null
  computed: boolean
  static: boolean
  decorators?: Decorator[]

  // ts
  typeAnnotation?: TS.TSTypeAnnotation
}
