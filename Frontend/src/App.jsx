import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import ComponentLibraryPanel from './components/ComponentLibraryPanel';
import WorkspacePanel from './components/WorkspacePanel';
import ConfigurationPanel from './components/ConfigurationPanel';

const initialNodes = [];
const initialEdges = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Reset selected node when clicking on the pane
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">GenAI Stack</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Build Stack
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Chat with Stack
          </button>
        </div>
      </header>
      <main className="flex flex-grow">
        <ComponentLibraryPanel />
        <div className="flex-grow" onClick={onPaneClick}>
          <WorkspacePanel
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            edges={edges}
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
            onNodeClick={onNodeClick}
          />
        </div>
        <ConfigurationPanel selectedNode={selectedNode} />
      </main>
    </div>
  );
}

export default App;