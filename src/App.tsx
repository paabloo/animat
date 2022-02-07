import React, {useRef, useState} from 'react';
import Victor from 'victor';
import './App.css';
import settings from './settings';
import Board from "./Board/Board";
import Info from "./Info";

console.log(settings);
// @ts-ignore
window.v = Victor;

function App() {
    // const info = useRef<number>(0);
    const [info, setInfo] = useState<number>(0);

    const add = (e: number) => {
        // setInfo(info + e);
    }

    return (
        <div className="App">
            <Info key={'info'} info={info} />
            <br />
            <Board key={'board'} setInfo={add} />
        </div>
    );
}

export default React.memo(App);
