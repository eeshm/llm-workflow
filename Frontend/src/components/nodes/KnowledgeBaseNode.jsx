import { Handle, Position } from 'reactflow';

function KnowledgeBaseNode() {
  return (
    <div className="border border-gray-300 rounded-md bg-white shadow-md w-52">
      <div className="bg-green-100 text-green-800 p-2 rounded-t-md font-bold text-sm">
        Knowledge Base
      </div>
      <div className="p-3 text-xs">
        <p>Connects to your data files.</p>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-3 !bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="w-3 h-3 !bg-green-500"
      />
    </div>
  );
}

export default KnowledgeBaseNode;