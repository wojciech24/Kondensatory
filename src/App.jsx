import ReactFlow from "reactflow";
import 'reactflow/dist/style.css';
import { useRef, useState } from "react";
import { nodeTypes } from "./components/InitialVals.constants";
import {solve} from "./components/resistors";
const initialNodes = []
const initalEdges = []
function App() {
  const [WichNode, setWichNode] = useState(initialNodes);
  const [WichEdge, setWichEdge] = useState(initalEdges);
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
  function CreateNodes() {
        let daneParsed = dane.current.value.split(",");
        let wynik = JSON.parse(solve(oczekiwana.current.value,daneParsed));
        iterate(wynik);
        console.log(wynik)
  }
  return (
    <div style={{ width: '50vw', height: '50vh', marginLeft: '200px', marginTop: '100px' }}>
        <div>
            <h1>Test</h1>
            oczekiwane:
            <input type="text" ref={oczekiwana}/>
            <br />
            dane:
            <input type="text" ref={dane}/>
            <br />
            <input type="button" value={"oblicz"} onClick={CreateNodes}></input>
        </div>
      <div style={{ width: '50vw', height: '50vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ReactFlow nodes={WichNode} edges={WichEdge} nodeTypes={nodeTypes} style={{ border: '1px solid black' }} />
      </div>
    </div>
  );
}

export default App;
