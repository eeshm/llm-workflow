import React, { useState, useRef, useEffect } from 'react'
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  UserIcon, 
  CpuChipIcon 
} from '@heroicons/react/24/outline'

export default function ChatPanel({ isOpen, onClose, nodes, edges }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const validateWorkflow = () => {
    if (nodes.length === 0) {
      return { valid: false, message: 'No workflow nodes found. Please add components to your workflow first.' }
    }

    const nodeTypes = nodes.map(n => n.type)
    const requiredTypes = ['userQuery', 'knowledgeBase', 'llmEngine', 'output']
    const missingTypes = requiredTypes.filter(type => !nodeTypes.includes(type))
    
    if (missingTypes.length > 0) {
      return { 
        valid: false, 
        message: `Missing required components: ${missingTypes.join(', ')}. Please add all workflow components.` 
      }
    }

    if (edges.length < 3) {
      return { 
        valid: false, 
        message: 'Workflow components are not properly connected. Please connect your nodes.' 
      }
    }

    const hasKnowledgeBase = nodes.find(n => n.type === 'knowledgeBase')
    if (hasKnowledgeBase && !hasKnowledgeBase.data?.config?.uploadedFile) {
      return { 
        valid: false, 
        message: 'Knowledge Base node requires a PDF document. Please upload a document first.' 
      }
    }

    return { valid: true }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    // Validate workflow before sending query
    const validation = validateWorkflow()
    if (!validation.valid) {
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `❌ **Workflow Error:** ${validation.message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/v1/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          workflow: {
            nodes: nodes,
            edges: edges
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.response || 'I received your query but got an empty response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Query error:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `❌ **Error:** Failed to process your query. ${error.message}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CpuChipIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chat with Stack</h3>
              <p className="text-sm text-gray-600">Query your workflow and get AI responses</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Chat
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Start a Conversation</h4>
              <p className="text-gray-600 max-w-md mx-auto">
                Ask questions about your documents or test your workflow. 
                Make sure your workflow is properly configured first.
              </p>
              
              {/* Workflow Status */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Workflow Status</h5>
                <div className="text-left space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Components:</span>
                    <span className={nodes.length >= 4 ? 'text-green-600' : 'text-red-600'}>
                      {nodes.length}/4
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span className={edges.length >= 3 ? 'text-green-600' : 'text-red-600'}>
                      {edges.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className={
                      nodes.find(n => n.type === 'knowledgeBase')?.data?.config?.uploadedFile 
                        ? 'text-green-600' : 'text-red-600'
                    }>
                      {nodes.find(n => n.type === 'knowledgeBase')?.data?.config?.uploadedFile ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  flex items-start space-x-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }
                `}
              >
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                    }
                  `}
                >
                  {message.type === 'user' ? (
                    <UserIcon className="h-5 w-5 text-white" />
                  ) : (
                    <CpuChipIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                
                <div
                  className={`
                    p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div
                    className={`
                      text-xs mt-2 opacity-70 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }
                    `}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-sm">Processing your query...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  text-black focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                  !inputValue.trim() || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>Send</span>
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Make sure your workflow is configured properly
          </p>
        </div>
      </div>
    </div>
  )
}