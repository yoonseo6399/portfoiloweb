import { MouseEventHandler } from "react"

type StyleModifier = (style : CSSStyleDeclaration) => void
export function onClickCSSApplier<E extends MouseEventHandler<T>,T extends HTMLElement>(provider : StyleModifier){
  const t : MouseEventHandler<T> = event => {
    if(!event.currentTarget) return
    const style = (event.currentTarget as T).style
    provider(style)
  }
  return t
}




type Function<T,R> = (t : T) => R
export function repeat<R>(times : number ,block : Function<number,R>) : R[]{
  let result : R[] = []
  for (let i = 0; i < times; i++){
    result.push(block(i))
  }
  return result
}