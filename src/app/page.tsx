'use client'


import Image from "next/image";
import React, {EventHandler, MouseEvent, MouseEventHandler, useEffect, useRef, useState} from "react";

const DisplayedContent_Max = 9
const ContentLoadMax = DisplayedContent_Max*2+1
const ContentAmount = 20
export default function Home() {
  const [selected, setSelected] = useState(0)
  const childClickHandler = (id : number) => {setSelected(id)}
  const divRef = useRef<HTMLDivElement>(null);
  const handleScroll = (event: WheelEvent) => {
    if (divRef.current) {
      const scrollAmount = event.deltaY;
      setSelected(prevSelected => {
        let newSelected = prevSelected + Math.sign(scrollAmount); // Scroll one card at a time


        //띠모양 셀렉션
        if(newSelected < 0) newSelected = ContentAmount
        else if(newSelected > ContentAmount) newSelected = 0
        return newSelected;
      });
    }
  };
// 이벤트 등록
  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);


  const center = selected
  //센터를 제외하고 반쪽 계산
  const startingPosTemp = center - ((selected-ContentLoadMax-1)/2)
  const startingPos = startingPosTemp < 0 ? ContentAmount+startingPosTemp : startingPosTemp
  LoopingQueue()
  const contents = repeat(ContentLoadMax, i =>{
    return <ContentsCard id={loadID} selected={selected} onClick={() => childClickHandler(loadID)} relativePosToCenter={}></ContentsCard>
  })


  return (
    <>
      <div ref={divRef} id={`content-area`} className={`min-h-[80vh] border-4 min-w-max border-amber-700 flex items-center justify-center whitespace-nowrap`}>
        {}
      </div>
    </>
  );
}

type ArrayInitializer<T> = (index : number) => T
class LoopingQueue<T>{
  private readonly array: T[];
  private index: number = 0
  constructor(anyArray : any[]){
    this.array = anyArray;
  }
  static create<T>(initializer : ArrayInitializer<T>,length : number) : LoopingQueue<T>{
    return new LoopingQueue(repeat(length,initializer))
  }

  next() : T{
    const r = (this.array)[this.index]
    this.index++
    if(this.index > this.array.length) this.index = 0
    return r
  }
  previous() : T{
    --this.index
    if(this.index < 0) this.index = this.array.length-1
    return (this.array)[this.index]
  }
  setIndex(index : number){
    if(index < 0 || index > this.array.length-1 || !Number.isInteger(index)) return false
    this.index = index
    return true
  }
}




interface ContentsProps{
  id : number;
  selected : number;
  onClick : () => void;
  relativePosToCenter : number;
  className? : string;
  // title : string;
  // img : string;
  // author : string;

}

function abs(n: number): number {
  return n < 0 ? -n : n
}

export function ContentsCard(props : ContentsProps) {
  const margin = 2

  //id 를 -1 로 만드는 수법
  const size = props.selected === props.id ? 'size-56' : 'size-48'
  const shadow = props.selected === props.id ? 'shadow-md' : ''
  //const translate = `ml-[px]`
  const translate : React.CSSProperties ={
    transform :`translateX(${(12+margin)*props.relativePosToCenter}rem)`,
  }
  return(
      <div className={`rounded-md transition-all duration-1000 ${size} bg-white ${shadow} flex items-center justify-center text-5xl absolute`} onClick={props.onClick} style={translate}>{props.id}</div>
  );
}

type StyleModifier = (style : CSSStyleDeclaration) => void
export function onClickCSSApplier<E extends MouseEventHandler<T>,T extends HTMLElement>(provider : StyleModifier){
  const t : MouseEventHandler<T> = event => {
    if(!event.currentTarget) return
    const style = (event.currentTarget as T).style
    provider(style)
  }
  return t
}
type Consumer<T> = (t : T) => void
type Function<T,R> = (t : T) => R
export function repeat<R>(times : number ,block : Function<number,R>) : R[]{
  let result : R[] = []
  for (let i = 0; i < times; i++){
    result.push(block(i))
  }
  return result
}