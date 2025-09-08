function ConfigurationPanel({ selectedNode }) {

  const renderConfigContent = () => {
    if (!selectedNode) {
      return (
        <div className="text-center text-gray-500 mt-10">
          <p>Select a node to configure it.</p>
        </div>
      );
    }

    const { type } = selectedNode;

    let title = "Configuration";
    let content = null;

    switch (type) {
      case 'llmEngine':
        title = "LLM Engine Settings";
        content = (
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Custom Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
              placeholder="Enter custom prompt..."
              disabled
            />
          </div>
        );
        break;
      case 'knowledgeBase':
        title = "Knowledge Base Settings";
        content = (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <div className="mt-1">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 cursor-not-allowed"
                disabled
              >
                Choose File
              </button>
            </div>
          </div>
        );
        break;
      default:
        title = `${type.charAt(0).toUpperCase() + type.slice(1)} Settings`;
        content = <p className="text-gray-600">No configuration available for this node.</p>;
        break;
    }

    return (
      <>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {content}
      </>
    );
  }

  return (
    <aside className="w-[300px] p-4 bg-gray-50 border-l border-gray-200">
      {renderConfigContent()}
    </aside>
  );
}

export default ConfigurationPanel;