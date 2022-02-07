import React, {useRef, useState} from 'react';
import Victor from 'victor';
import './App.css';
import settings from './settings';
import Board from "./Board/Board";

console.log(settings);
// @ts-ignore
window.v = Victor;

function App() {
    const info = useRef<number>(0);
    // const [info, setInfo] = useState<number>(0);

    const add = () => {
        info.current += 1;
        // console.log(info)
    }

    return (
        <div className="App">
            {info.current}
            <br />
            <Board key={'board'} setInfo={add} />
        </div>
    );
}

export default React.memo(App);
