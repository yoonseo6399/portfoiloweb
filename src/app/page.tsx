'use client'


import React, {EventHandler, MouseEvent, MouseEventHandler, useEffect, useRef, useState} from "react";
import { LoopingQueue } from "./LoopingQueue";
import { repeat } from "./Util";


//TODO ContentLoader Combine
const DisplayedContent_Max = 9
const ContentLoadMax = DisplayedContent_Max*2+1
const ContentAmount = 20
export default function Home() {
  const [selected, setSelected] = useState(0)
  const childClickHandler = (id : number) => {setSelected(id)}
  const divRef = useRef<HTMLDivElement>(null);

  //Lodash에서 throttle 함수 가져오기: 스로틀방식으로 속도제한
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

  const loopIndex = LoopingQueue.create(i => i,ContentAmount)
  const lefting = selected-(ContentLoadMax-1)/2
  loopIndex.setIndex(lefting)
  let distance = lefting-1-selected

  //console.log(`------${"Selected : "+selected + " With starting point : "+(selected-(ContentLoadMax-1)/2) + " Index(0) : " + loopIndex.get(0)}----------------------------------`)

  const contents = repeat(ContentLoadMax, () =>{
    let id = loopIndex.next()
    distance++
   //if(id === selected) console.log("center"); else console.log("distance : "+distance + " INDEX : "+id)
    return <ContentsCard key={id} id={id} selected={selected} onClick={() => childClickHandler(id)} relativePosToCenter={distance}></ContentsCard>
  })


  return (
    <>
      <div ref={divRef} id={`content-area`} className={`bg-lime-400 min-h-[80vh] border-4 min-w-max border-amber-700 flex items-center justify-center whitespace-nowrap`}>
        {contents}
      </div>
    </>
  );
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

  const size = props.selected === props.id ? 'size-56' : 'size-48'
  const shadow = props.selected === props.id ? 'shadow-md' : ''
  //const translate = `ml-[px]`
  const translate : React.CSSProperties ={
    transform :`translateX(${(12+margin)*props.relativePosToCenter}rem)`,
    backdropFilter : `blur(${props.relativePosToCenter*10}px)`,
    opacity : `${abs(100-abs(props.relativePosToCenter*10))}%`
  }
  return(
      <div className={`rounded-md transition-all duration-1000 ${size} bg-white ${shadow} flex items-center justify-center text-5xl absolute`} onClick={props.onClick} style={translate}>{props.id}</div>
  );
}

