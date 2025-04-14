import ReactFlow from "reactflow";
import 'reactflow/dist/style.css';
import { useRef, useState } from "react";
import { nodeTypes } from "./components/InitialVals.constants";

const initialNodes = []
const initalEdges = []
function App() {
  const [WichNode, setWichNode] = useState(initialNodes);
  const [WichEdge, setWichEdge] = useState(initalEdges);
  const KonNum = useRef();
  const KonNumUp = useRef();
  const KonNumDown = useRef(); 
  function CreateNodes()
  {
    if(KonNum.current.value >= 2)
    {
      let KonNumVal = parseInt(KonNum.current.value)
      const Nodes = [
        {id: '0', position:{x: 0, y: 200},data: { label: 'Początek' }, type: 'KondStartNode'},]
      const Edges = []
      let KonNumValUp = parseInt(KonNumUp.current.value)
      let KonNumValDown = parseInt(KonNumDown.current.value)
      let lastId = 1
      

      for (let i = 1; i < KonNumVal-1; lastId++,i++) {
        Nodes.push({id: `${lastId}`, position:{x: 130 * lastId-1, y: 200},data: { label: `${lastId}` }, type: 'KondRightLeftNode'})
      }      
      for (let i = 0; i < Nodes.length+1; i++) {
        Edges.push({id:`e${i}-${i+1}`, source:`${i}`, target:`${i+1}`})
      }
      if(KonNumValUp >0)
      {
        if(KonNumValDown<1)
        {
          KonNumDown.current.value = 1
        }
        const NodeUp = []
        // let startId = lastId;
        let startingId = lastId
        for (let i = 1; i < KonNumValUp+1; i++,lastId++) {
          NodeUp.push({id: `${lastId}`, position:{x: 130 * lastId, y: 100},data: { label: `${lastId}` }, type: 'KondRightLeftNode'})
        }
        for(let i = startingId+1; i < NodeUp.length+startingId-1; i++)
        {
          Edges.push({id:`e${i}-${i+1}`, source:`${i}`, target:`${i+1}`})
        }
        Edges.push({id:`e${lastId-1}-${KonNumValDown+1}`, source:`${lastId-1}`, target:`${lastId+KonNumValDown}`})

        let lastNodeUpId = lastId;
        let originId = startingId;
        const NodeDown = []
        for (let i = 1; i < KonNumValDown+1; i++,lastId++,startingId++) {
          NodeDown.push({id: `${lastId}`, position:{x: 130 * startingId, y: 300},data: { label: `${lastId}` }, type: 'KondRightLeftNode'})
        }
        for(let i = lastNodeUpId; i < NodeDown.length+lastNodeUpId-1; i++)
        {
          Edges.push({id:`e${i}-${i+1}`, source:`${i}`, target:`${i+1}`})
        }
        Edges.push({id:`e${lastId-1}-${lastId}`, source:`${lastId-1}`, target:`${lastId}`})
        Edges.push({id:`e${originId-1}-${lastNodeUpId}`, source:`${originId-1}`, target:`${lastNodeUpId}`})
        Nodes.push(...NodeUp)
        Nodes.push(...NodeDown)
        Nodes.push({id: `${lastId}`, position:{x: 130*(Math.max(KonNumValDown,KonNumValUp)+0.4+originId), y: 200},data: { label: `Koniec` }, type: 'KondEndNode'})
      }
      else{
        Edges.push({id:`e${lastId-1}-${lastId+1}`, source:`${lastId-1}`, target:`${lastId+1}`})
        Nodes.push({id: `${lastId}`, position:{x: 130*lastId, y: 200},data: { label: `Koniec` }, type: 'KondEndNode'})
      }
      
      setWichEdge(Edges)
      setWichNode(Nodes)    
    }
    else if(KonNum.current.value < 2)
    {
      alert('Podaj conajmniej 2 kondensatory')
    }
  }
  
  return (
    <div style={{ width: '50vw', height: '50vh',marginLeft: '200px',marginTop: '100px'}}>
      Ile kondensatorów szeregowych?
      <br />
      <input type="number" ref={KonNum} />
      <br />
      Ile na górze?
      <br />
      <input type="number" ref={KonNumUp}/>
      <br />
      Ile na dole?
      <br />
      <input type="number" ref={KonNumDown}/>
      <input type="button" value={'Generuj'} onClick={CreateNodes}/>
      <div style={{ width: '50vw', height: '50vh',paddingTop: '100px',display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ReactFlow nodes={WichNode} edges={WichEdge} nodeTypes={nodeTypes} style={{border: '1px solid black'}}/>
      </div>
    </div>
  );
}

export default App;
