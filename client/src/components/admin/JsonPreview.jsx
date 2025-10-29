import React from 'react';
import { Copy, Download } from 'lucide-react';

const JsonPreview = ({ title, data, onCopy }) => {
  const prettyJson = React.useMemo(() => {
    if (!data) return '{\n  // no data\n}';
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return '// Unable to format data';
    }
  }, [data]);

  const handleCopy = () => {
    if (!prettyJson) return;
    navigator.clipboard.writeText(prettyJson).then(() => {
      onCopy?.();
    });
  };

  const handleDownload = () => {
    if (!prettyJson) return;
    const blob = new Blob([prettyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title || 'data'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-800">{title || 'JSON Preview'}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Copy size={14} />
            Copy
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
      <pre className="w-full max-h-[600px] overflow-auto rounded-lg border border-gray-200 bg-gray-900 p-6 text-sm text-green-100 font-mono">
        {prettyJson}
      </pre>
    </div>
  );
};

export default JsonPreview;