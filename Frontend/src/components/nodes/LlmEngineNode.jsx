import { Handle, Position } from 'reactflow';

function LlmEngineNode() {
  return (
    <div className="border border-gray-300 rounded-md bg-white shadow-md w-52">
      <div className="bg-purple-100 text-purple-800 p-2 rounded-t-md font-bold text-sm">
        LLM Engine
      </div>
      <div className="p-3 text-xs">
        <p>Processes input with an AI model.</p>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-3 !bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  );
}

export default LlmEngineNode;