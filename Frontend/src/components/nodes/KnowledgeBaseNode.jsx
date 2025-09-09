import React from 'react'
import { Handle, Position } from 'reactflow'
import { DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function KnowledgeBaseNode({ data, selected }) {
  const hasUploadedFile = data?.config?.uploadedFile
  
  return (
    <div className={`
      min-w-[200px] bg-white rounded-lg shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-black shadow-xl scale-105' : 'hover:shadow-xl'}
    `}>
      <div className="p-4 text-black">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <DocumentTextIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Knowledge Base</h3>
            <p className="text-xs opacity-90">Document Repository</p>
          </div>
          <div className="flex-shrink-0">
            {hasUploadedFile ? (
              <CheckCircleIcon className="h-5 w-5 text-green-200" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5" />
            )}
          </div>
        </div>
        
        <div className="text-xs opacity-80 leading-relaxed mb-3">
          Stores and searches through uploaded documents
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className={`rounded px-2 py-1 ${
          hasUploadedFile ? 'bg-green-500' : 'bg-red-600'
        }`}>
          <div className="text-xs text-white">
            {hasUploadedFile ? (
              <>
                📄 {hasUploadedFile.name}
                <div className="text-xs text-white mt-1">
                  {(hasUploadedFile.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </>
            ) : (
              'No document uploaded'
            )}
          </div>
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left}
        className="w-4 h-4 border-2 border-green-200 bg-green-500 hover:bg-green-400" 
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-4 h-4 border-2 border-green-200 bg-green-500 hover:bg-green-400" 
      />
    </div>
  )
}