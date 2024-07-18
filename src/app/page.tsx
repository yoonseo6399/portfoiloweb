'use client'


import Image from "next/image";
import React, {EventHandler, MouseEvent, MouseEventHandler, useEffect, useRef, useState} from "react";


const MaxContent = 9*2
const ContentAmount = 20
export default function Home() {
  const [selected, setSelected] = useState(0)

  const childClickHandler = (id : number) => {
    setSelected(id)
  }

  const divRef = useRef<HTMLDivElement>(null);
  //const [scrollAmount, setScrollAmount] = useState(0);

  const handleScroll = (event: WheelEvent) => {
    if (divRef.current) {
      const scrollAmount = event.deltaY;
      setSelected(prevSelected => {
        let newSelected = prevSelected + Math.sign(scrollAmount); // Scroll one card at a time
        newSelected = Math.max(newSelected, 0); // Ensure selected is not less than 0
        newSelected = Math.min(newSelected, ContentAmount - 1); // Ensure selected is not more than MaxContent - 1
        return newSelected;
      });
    }
  };

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



  console.log("a")

  return (
    <>
      <div ref={divRef} id={`content-area`} className={`min-h-[80vh] border-4 min-w-max border-amber-700 flex items-center justify-center whitespace-nowrap`}>
        {

          repeat(MaxContent,i => {
            let left = i + selected - (MaxContent / 2);

            let now = left < 0 ? ContentAmount + left : left
            console.log(now)
            return <ContentsCard key={now.toString()} id={now} onClick={() => childClickHandler(now)}
                          selected={selected}></ContentsCard>
          })
        }
      </div>
    </>
  );
}

interface ContentsProps{
  id : number;
  selected : number;
  onClick : () => void;
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
  const relativePos = (((props.id-MaxContent/2) < 0 ? (props.id-ContentAmount) : props.id)-props.selected)
  const size = props.selected === props.id ? 'size-56' : 'size-48'
  const shadow = props.selected === props.id ? 'shadow-md' : ''
  //const translate = `ml-[px]`
  const translate : React.CSSProperties ={
    transform :`translateX(${(12+margin)*relativePos}rem)`,
    opacity : `${100-(10*abs(relativePos))}%`
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