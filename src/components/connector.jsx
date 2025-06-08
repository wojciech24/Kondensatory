import {Handle,Position} from "reactflow";
export default function Connector() {
    return(
        <div style={{width: '1px', height: '30px', visibility:"hidden"}}>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}