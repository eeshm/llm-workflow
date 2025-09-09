import React from 'react'
import { Handle, Position } from 'reactflow'
import { CpuChipIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function LlmEngineNode({ data, selected }) {
  const hasCustomPrompt = data?.config?.customPrompt?.trim()
  
  return (
    <div className={`
      min-w-[200px] bg-white rounded-lg shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-black shadow-xl scale-105' : ' hover:shadow-xl'}
    `}>
      <div className="p-4 text-black">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <CpuChipIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">LLM Engine</h3>
            <p className="text-xs opacity-90">AI Processing</p>
          </div>
          <div className="flex-shrink-0">
            <SparklesIcon className="h-5 w-5 text-purple-200 animate-pulse" />
          </div>
        </div>
        
        <div className="text-xs opacity-80 leading-relaxed mb-3">
          Processes queries using advanced language models
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="bg-black/70 rounded px-2 py-1">
          <div className="text-xs text-white">
            {hasCustomPrompt ? (
              <>
                Custom Prompt
                <div className="text-xs text-black mt-1">
                  {hasCustomPrompt.length} characters
                </div>
              </>
            ) : (
              'Default Configuration'
            )}
          </div>
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left}
        className="w-4 h-4 border-2 border-purple-200 bg-purple-500 hover:bg-purple-400" 
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-4 h-4 border-2 border-purple-200 bg-purple-500 hover:bg-purple-400" 
      />
    </div>
  )
}