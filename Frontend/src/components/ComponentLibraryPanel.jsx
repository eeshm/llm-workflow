const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-3 border border-gray-300 rounded-md cursor-grab bg-white shadow-sm hover:shadow-md transition-shadow"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {label}
    </div>
  );
};

function ComponentLibraryPanel() {
  return (
    <aside className="p-4 bg-gray-50 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Components</h2>
      <div className="space-y-3">
        <DraggableNode type="userQuery" label="User Query Component" />
        <DraggableNode type="knowledgeBase" label="KnowledgeBase Component" />
        <DraggableNode type="llmEngine" label="LLM Engine Component" />
        <DraggableNode type="output" label="Output Component" />
      </div>
    </aside>
  );
}

export default ComponentLibraryPanel;