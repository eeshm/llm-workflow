import React, { useState, useCallback } from 'react'
import { 
  CogIcon, 
  DocumentArrowUpIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline'

export default function ConfigurationPanel({ selectedNode, updateNodeConfig }) {
  const [uploadStatus, setUploadStatus] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = useCallback(async (event, nodeId) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    setIsUploading(true)
    setUploadStatus({ status: 'uploading', message: 'Uploading PDF...' })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      setUploadStatus({
        status: 'success',
        message: ` ${file.name} uploaded successfully`,
        fileInfo: result
      })

      // Update node configuration with file info
      updateNodeConfig(nodeId, {
        uploadedFile: {
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          ...result
        }
      })
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        status: 'error',
        message: `Upload failed: ${error.message}`
      })
    } finally {
      setIsUploading(false)
    }
  }, [updateNodeConfig])

  const handlePromptChange = useCallback((event, nodeId) => {
    updateNodeConfig(nodeId, {
      customPrompt: event.target.value
    })
  }, [updateNodeConfig])

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <CogIcon className="h-5 w-5" />
            <span>Configuration</span>
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <CogIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Node Selected
            </h3>
            <p className="text-gray-600 max-w-sm">
              Select a node from the workspace to configure its settings and properties.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getNodeTypeInfo = (type) => {
    const nodeInfo = {
      userQuery: {
        title: 'User Query Settings',
        icon: '❓',
        description: 'Configure how user input is processed'
      },
      knowledgeBase: {
        title: 'Knowledge Base Settings',
        icon: '📚',
        description: 'Upload and manage documents'
      },
      llmEngine: {
        title: 'LLM Engine Settings',
        icon: '🧠',
        description: 'Configure AI processing parameters'
      },
      output: {
        title: 'Output Settings',
        icon: '📤',
        description: 'Configure response formatting'
      }
    }
    return nodeInfo[type] || { title: 'Node Settings', icon: '⚙️', description: '' }
  }

  const nodeInfo = getNodeTypeInfo(selectedNode.type) 

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <span className="text-2xl">{nodeInfo.icon}</span>
          <span>{nodeInfo.title}</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">{nodeInfo.description}</p>
      </div>
      
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Node ID and Type Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Node Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Node ID:</span>
              <span className="font-mono text-gray-900">{selectedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize text-gray-900">{selectedNode.type}</span>
            </div>
          </div>
        </div>

        {/* Knowledge Base Configuration */}
        {selectedNode.type === 'knowledgeBase' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF Document
              </label>
              <div className="file-upload-dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50">
                <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop a PDF file
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, selectedNode.id)}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Upload Status */}
              {uploadStatus.message && (
                <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
                  uploadStatus.status === 'success' ? 'bg-green-50 text-green-800' :
                  uploadStatus.status === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  {uploadStatus.status === 'uploading' && (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  )}
                  {uploadStatus.status === 'success' && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                  {uploadStatus.status === 'error' && (
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">{uploadStatus.message}</span>
                </div>
              )}

              {/* Show uploaded file info */}
              {selectedNode.data?.config?.uploadedFile && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Uploaded File</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Name:</strong> {selectedNode.data.config.uploadedFile.name}</p>
                    <p><strong>Size:</strong> {(selectedNode.data.config.uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Uploaded:</strong> {new Date(selectedNode.data.config.uploadedFile.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LLM Engine Configuration */}
        {selectedNode.type === 'llmEngine' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Prompt Template
              </label>
              <textarea
                rows={8}
                className="w-full p-3 border border-gray-300  text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                placeholder="Enter custom prompt template for the LLM...

Example:
You are a helpful AI assistant. Based on the provided context from the knowledge base, answer the user's question accurately and concisely.

Context: {context}
Question: {question}

Answer:"
                value={selectedNode.data?.config?.customPrompt || ''}
                onChange={(e) => handlePromptChange(e, selectedNode.id)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Use {'{context}'} and {'{question}'} as placeholders for dynamic content
              </p>
            </div>

          </div>
        )}

        {/* User Query Configuration */}
        {selectedNode.type === 'userQuery' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Input Configuration</h4>
              <p className="text-sm text-blue-700">
                This node receives user queries and passes them to the workflow. 
                No additional configuration required.
              </p>
            </div>
          </div>
        )}

        {/* Output Configuration */}
        {selectedNode.type === 'output' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg" disabled>
                <option>Plain Text</option>
                <option>Markdown</option>
                <option>JSON</option>
              </select>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-orange-800 mb-2">Output Settings</h4>
              <p className="text-sm text-orange-700">
                This node delivers the final response to the user. Format and delivery 
                options will be available in future versions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}