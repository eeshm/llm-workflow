import React from 'react'
import { Handle, Position } from 'reactflow'
import { UserIcon } from '@heroicons/react/24/outline'

export default function UserQueryNode({ data, selected }) {
  return (
    <div className={`
      min-w-[200px] bg-white rounded-lg shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-black shadow-xl scale-105' : ' hover:shadow-xl'}
    `}>
      <div className="p-4 text-black">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">User Query</h3>
            <p className="text-xs opacity-90">Input Processing</p>
          </div>
        </div>
        
        <div className="text-xs opacity-80 leading-relaxed">
          Receives and processes user questions to initiate the workflow
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="bg-black/70 rounded px-2 py-1">
          <div className="text-xs text-white">Status: Ready</div>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 border-2 border-blue-200 bg-blue-500 hover:bg-blue-400" 
      />
    </div>
  )
}