import {Handle,Position} from "reactflow";
export default function Connector() {
    return(
        <div style={{width: '20px', height: '30px', visibility:"hidden"}}>
            <p>łącznik</p>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}