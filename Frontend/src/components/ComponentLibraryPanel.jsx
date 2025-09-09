import React from 'react'
import { 
  UserIcon, 
  DocumentTextIcon, 
  CpuChipIcon, 
  ArrowRightCircleIcon 
} from '@heroicons/react/24/outline'

const components = [
  {
    type: 'userQuery',
    label: 'User Query',
    icon: UserIcon,
    description: 'Input node for user questions',
    color: 'bg-gray-50'
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: DocumentTextIcon,
    description: 'Document repository and search',
    color: 'bg-gray-50'
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    icon: CpuChipIcon,
    description: 'AI processing and reasoning',
    color: 'bg-gray-50'
  },
  {
    type: 'output',
    label: 'Output',
    icon: ArrowRightCircleIcon,
    description: 'Final response delivery',
    color: 'bg-gray-50'
  }
]

export default function ComponentLibraryPanel() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Components</h2>
        <p className="text-sm text-gray-600 mt-1">Drag to add to workflow</p>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {components.map((component) => {
          const Icon = component.icon
          
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => onDragStart(e, component.type)}
              className={`
                ${component.color} 
                text-black p-4 rounded-lg cursor-move shadow-lg transition-all duration-200 
                transform hover:scale-105 hover:shadow-xl border 
                hover:border-white/20 border-black
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className="h-6 w-6" />
                <span className="font-semibold">{component.label}</span>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">
                {component.description}
              </p>
            </div>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <p>*User Query → Knowledge Base → LLM → Output</p>
        </div>
      </div>
    </div>
  )
}