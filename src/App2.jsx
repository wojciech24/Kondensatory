import ReactFlow from "reactflow";
import 'reactflow/dist/style.css';
import { useRef, useState } from "react";
import {nodeTypes} from "./components/InitialVals.constants";
import { sendData } from "./components/resistors_2";
import { StepEdge } from 'reactflow';
const edgeTypes = {
  default: StepEdge
};
const initialNodes = []
const initalEdges = []
function App() {
  const [WichNode, setWichNode] = useState(initialNodes);
  const [WichEdge, setWichEdge] = useState(initalEdges);
  const oczekiwana = useRef();
  const dane = useRef();
  function extractResistors(data) {
    function traverse(node) {
      if (Array.isArray(node)) {
        return node.map(traverse).flat();
      }

      if (typeof node === 'object' && node !== null) {
        if ('resistors' in node) {
          const group = node.resistors.map(traverse);
          if (node.parellel === true) {
            return [group.map(series => Array.isArray(series) ? series.flat() : [series])];
          } else {
            return group.flat();
          }
        }
      }
      if (!isNaN(Number(node))) {
        return Number(node);
      }
      return [];
    }
    return traverse(data);
  }


  function CreateNodes() {
    let daneParsed = dane.current.value.split(",");
    let wynik = sendData(oczekiwana.current.value, daneParsed);
    let resistorsArray = extractResistors(wynik);
    let Nodes = [{ id: '0', position: { x: 0, y: 200 }, data: { label: 'Początek' }, type: 'KondStartNode' },]
    let Edges = []
    let lastid = 0
    let temp = 0;
    let connectorId = 100;
    const xOffset = 160
    function createNotParalelNodes(resistors) {
      let steps = resistors.length;
      for (let i = 0; i < steps; i++) {
        let tempId = temp
        for (let j = 0; j < resistors[i].length; j++) {
          lastid += 1
          Nodes.push({ id: `${lastid}`, position: { x: xOffset * (j + tempId + 1), y: (i + 1) * 120 }, data: { label: `${resistors[i][j]}` }, type: 'KondRightLeftNode' })
        }
        Edges.push({ id: `e${lastid}-${connectorId}`, source: `${lastid}`, target: `${connectorId}` })
      }
    }
    function createParalelNodes(resistors) {
      resistorsArray.forEach(element => {
        if (Number.isInteger(element)) {
          lastid += 1
          Nodes.push({ id: `${lastid}`, position: { x: xOffset * (lastid + 1), y: 200 }, data: { label: `${element}` }, type: 'KondRightLeftNode' })
        }
        else {
          createNotParalelNodes(element)
          let maxCols = 0;
          for (let i = 0; i < element.length; i++) {
            const cols = element[i].length;
            if (cols > maxCols) {
              maxCols = cols;
            }
          }
          const x = xOffset * (maxCols + temp+1)+30;
          Nodes.push({ id: `${connectorId}`, position: { x:x, y: 200 }, type: 'ConnectorNode' })
          connectorId++;
          temp = lastid - element.length + 1
        }
      });
    }
    createParalelNodes(resistorsArray);
    
    const proximityThreshold = 30;
    const filteredNodes = Nodes.filter((node, idx, arr) => {
      if (node.type !== 'ConnectorNode') return true;

      return !arr.some(other => 
        other.id !== node.id &&
        Math.abs(other.position.x - node.position.x) <= proximityThreshold &&
        Math.abs(other.position.y - node.position.y) <= proximityThreshold
      );
    });
    filteredNodes.push({ id: `${lastid + 1}`, position: { x: xOffset * (lastid-temp + 2), y: 200 }, data: { label: 'Koniec' }, type: 'KondEndNode' })
    
    setWichNode(filteredNodes);
    console.log(filteredNodes)
    function createEdges(nodes, maxXDiff = 160) {
      const Edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const xDiff = nodeB.position.x - nodeA.position.x;
          const yDiff = nodeB.position.y - nodeA.position.y;
          if (xDiff > 0 && xDiff <= maxXDiff && (Math.abs(yDiff) <=200|| nodeA.type === "KondStartNode" ||nodeB.type === "ConnectorNode" || nodeA.type === "ConnectorNode")&& nodeB.type !== "KondEndNode") {
            Edges.push({
              id: `e${nodeA.id}-${nodeB.id}`,
              source: `${nodeA.id}`,
              target: `${nodeB.id}`
            });
          }
        }
      }
      return Edges;
    }
    const EdgesFinal = [...createEdges(Nodes), ...Edges]
    EdgesFinal.push({ id: `e${lastid}-${lastid+1}`, source: `${lastid-temp}`, target: `${lastid+1}` })
    console.log(EdgesFinal)
    setWichEdge(EdgesFinal);
  }
  return (
    <div style={{ width: '80vw', height: '50vh', marginLeft: '300px', marginTop: '100px' }}>
      <div>
        <h1>Połączenia kondensatorów</h1>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize: '20px', width: '30vw'}}>
            <h5>Oczekiwane:</h5>
            <input type="text" ref={oczekiwana} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '30vw', fontSize: '20px'}}>
            <h5>Opory kondensatorów:</h5>
            <input type="text" ref={dane} />
          </div>
        </div>
        <input type="button" value={"oblicz"} onClick={CreateNodes}></input>
      </div>
      <div style={{ width: '70vw', height: '50vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/*edgeTypes={edgeTypes}*/}
        <ReactFlow nodes={WichNode} edges={WichEdge} nodeTypes={nodeTypes}  style={{ border: '1px solid black' }} />
      </div>
    </div>
  );
}

export default App;
