import React from 'react'
import { Handle, Position } from 'reactflow'
import { ArrowRightCircleIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline'

export default function OutputNode({ data, selected }) {
  return (
    <div className={`
      min-w-[200px] bg-white rounded-lg shadow-lg border-2 transition-all duration-200
      ${selected ? 'border-black shadow-xl ' : 'hover:shadow-xl'}
    `}>
      <div className="p-4 text-black">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <ArrowRightCircleIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Output</h3>
            <p className="text-xs opacity-90">Response Delivery</p>
          </div>
          <div className="flex-shrink-0">
            <PresentationChartLineIcon className="h-5 w-5 text-orange-200" />
          </div>
        </div>
        
        <div className="text-xs opacity-80 leading-relaxed mb-3">
          Formats and delivers the final response to the user
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="bg-black/70 rounded px-2 py-1">
          <div className="text-xs text-white/90">
            📋 Plain Text Format
            <div className="text-xs text-white/70 mt-1">
              Ready for delivery
            </div>
          </div>
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left}
        className="w-4 h-4 border-2 border-orange-200 bg-orange-500 hover:bg-orange-400" 
      />
    </div>
  )
}