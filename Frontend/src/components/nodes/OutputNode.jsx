import { Handle, Position } from 'reactflow';

function OutputNode() {
  return (
    <div className="border border-gray-300 rounded-md bg-white shadow-md w-52">
      <div className="bg-yellow-100 text-yellow-800 p-2 rounded-t-md font-bold text-sm">
        Output
      </div>
      <div className="p-3 text-xs">
        <p>Displays the final result.</p>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-3 !bg-yellow-500"
      />
    </div>
  );
}

export default OutputNode;