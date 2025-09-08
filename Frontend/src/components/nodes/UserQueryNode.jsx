import { Handle, Position } from 'reactflow';

function UserQueryNode() {
  return (
    <div className="border border-gray-300 rounded-md bg-white shadow-md w-52">
      <div className="bg-blue-100 text-blue-800 p-2 rounded-t-md font-bold text-sm">
        User Query
      </div>
      <div className="p-3 text-xs">
        <p>Entry point for user queries.</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
}

export default UserQueryNode;