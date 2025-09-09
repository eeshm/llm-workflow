import { useState, useCallback } from 'react'
import { ReactFlowProvider } from 'reactflow'
import ComponentLibraryPanel from './components/ComponentLibraryPanel'
import WorkspacePanel from './components/WorkspacePanel'
import ConfigurationPanel from './components/ConfigurationPanel'
import ChatPanel from './components/ChatPanel'
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { ChatBubbleLeftRightIcon, CogIcon } from '@heroicons/react/24/outline'

function App() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const[reactFlowInstance, setReactFlowInstance] = useState(null)

  const onNodesChange = useCallback(
  (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  [setNodes]
  )

const onEdgesChange = useCallback(
  (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  [setEdges]
);

const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
);

  const addNode = useCallback((type, position) => {
    const nodeTypes = {
      userQuery: {
        label: 'User Query',
        color: 'bg-blue-500'
      },
      knowledgeBase: {
        label: 'Knowledge Base',
        color: 'bg-green-500'
      },
      llmEngine: {
        label: 'LLM Engine',
        color: 'bg-purple-500'
      },
      output: {
        label: 'Output',
        color: 'bg-orange-500'
      }
    }

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: nodeTypes[type]?.label || type,
        config: {} 
      }
    }
    
    setNodes((nds) => [...nds, newNode])
  }, [])

  const updateNodeConfig = useCallback((nodeId, config) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      )
    )
  }, [])

  const validateWorkflow = () => {
    if (nodes.length === 0) {
      alert('Please add some nodes to your workflow first!')
      return
    }
    
    const nodeTypes = nodes.map(n => n.type)
    const hasAllRequired = ['userQuery', 'knowledgeBase', 'llmEngine', 'output']
      .every(type => nodeTypes.includes(type))
    
    if (!hasAllRequired) {
      alert('Workflow should include all components: User Query, Knowledge Base, LLM Engine, and Output')
      return
    }
    
    if (edges.length < 3) {
      alert('Please connect your workflow components properly')
      return
    }
    
    alert('Workflow validated successfully')
  }
  const onNodeClick = useCallback((event, node) => {
  setSelectedNode(node);
}, []);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50 w-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">GenAI Stack</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={validateWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Build Stack
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>Chat with Stack</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Component Library */}
          <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
            <ComponentLibraryPanel />
          </div>

          {/* Center - Workspace */}
          <div className="flex-1 bg-gray-50">
            <WorkspacePanel
              nodes={nodes}
              edges={edges}

              setNodes={setNodes}
              setEdges={setEdges}

              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}

              onConnect={onConnect}
              addNode={addNode}
              onNodeClick={onNodeClick} 
              
              selectedNode={selectedNode}
              reactFlowInstance={reactFlowInstance}
              setReactFlowInstance={setReactFlowInstance}
            />
          </div>

          {/* Right Sidebar - Configuration  */} 
    <div className="w-80 bg-white border-l border-gray-200 shadow-sm">
            <ConfigurationPanel
              selectedNode={selectedNode}
              updateNodeConfig={updateNodeConfig}
            />
          </div>
        </div>

        {/* Chat Panel Modal */}
        {chatOpen && (
          <ChatPanel 
            isOpen={chatOpen} 
            onClose={() => setChatOpen(false)}
            nodes={nodes}
            edges={edges}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}

export default App