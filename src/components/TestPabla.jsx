import { useRef, useState } from "react";
import {solve} from "./resistors";
function TestPabla() {
    const [wynik,setWynik] = useState();
    const oczekiwana = useRef();
    const dane = useRef();
    const iterate = (obj) => {
        Object.keys(obj).forEach(key => {
        console.log(`key: ${key}, value: ${obj[key]}`)
        if (typeof obj[key] === 'object' && obj[key] !== null) {
                iterate(obj[key])
            }
        })
    }
    function oblicz(){
        let daneParsed = dane.current.value.split(",");
        // console.log(solve(oczekiwana.current.value,daneParsed))
        let wynik = JSON.parse(solve(oczekiwana.current.value,daneParsed));
        iterate(wynik);
        setWynik(<>{solve(oczekiwana.current.value,daneParsed)}</>);
    }
    return (
        <div>
            <h1>Test</h1>
            oczekiwane:
            <input type="text" ref={oczekiwana}/>
            <br />
            dane:
            <input type="text" ref={dane}/>
            <br />
            <input type="button" value={"oblicz"} onClick={oblicz}></input>
            wynik:
            {wynik}
        </div>
    );
}
export default TestPabla;