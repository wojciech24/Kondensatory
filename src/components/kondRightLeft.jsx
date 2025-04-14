import React from "react";
import {Handle,Position} from "reactflow";
export default function KondRightLeft({data}) {
    return(
        <div style={{width: '100px', height: '30px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <h5>{data.label}</h5>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}