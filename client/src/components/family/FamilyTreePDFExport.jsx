import React, { useState } from 'react';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import { exportTreeToPDF, exportTextTreeToPDF } from '../../utils/pdfExport';
import { useToast } from '../../context/ToastContext';

const FamilyTreePDFExport = ({ treeData, viewType, rootMemberName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const { addToast } = useToast();

  const handleExportPDF = async (type) => {
    try {
      setIsExporting(true);
      setExportType(type);

      const timestamp = new Date().toISOString().slice(0, 10);
      const rootName = rootMemberName || treeData?.name || 'Unknown';
      
      if (type === 'text') {
        // Export text-based tree
        const filename = `family-tree-text-${rootName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
        await exportTextTreeToPDF(treeData, filename, rootName);
      } else {
        // Export visual tree using specialized tree export function
        const elementId = getElementIdForViewType(viewType);
        const filename = `family-tree-${viewType}-${rootName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
        
        // Use specialized tree export for better handling of large trees
        await exportTreeToPDF(elementId, filename, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
      }
      
      addToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  const getElementIdForViewType = (viewType) => {
    switch (viewType) {
      case 'modern': return 'modern-tree-container';
      case 'card': return 'card-tree-container';
      case 'horizontal': return 'horizontal-tree-container';
      case 'vertical': return 'vertical-tree-container';
      case 'reactd3': return 'reactd3-tree-container';
      case 'text': return 'text-tree-container';
      default: return 'tree-container';
    }
  };

  const getViewTypeLabel = (viewType) => {
    switch (viewType) {
      case 'modern': return 'Modern Tree';
      case 'card': return 'Card View';
      case 'horizontal': return 'Horizontal Tree';
      case 'vertical': return 'Vertical Tree';
      case 'text': return 'Text View';
      default: return 'Family Tree';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Download className="h-5 w-5 mr-2 text-blue-500" />
        Export Family Tree as PDF
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Download the family tree in different formats for offline viewing or printing.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export current view as image PDF */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Visual Export</h4>
          <p className="text-sm text-blue-700 mb-3">
            Export the current {getViewTypeLabel(viewType).toLowerCase()} as a high-quality PDF image. 
            Large trees will be automatically split across multiple pages.
          </p>
          <button
            onClick={() => handleExportPDF('visual')}
            disabled={isExporting}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting && exportType === 'visual' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Image className="h-4 w-4 mr-2" />
            )}
            {isExporting && exportType === 'visual' ? 'Preparing Tree...' : `Export ${getViewTypeLabel(viewType)}`}
          </button>
          {isExporting && exportType === 'visual' && (
            <p className="text-xs text-blue-600 mt-2 text-center">
              Expanding all nodes and capturing full tree...
            </p>
          )}
        </div>
        
        {/* Export as text-based PDF */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Text Report</h4>
          <p className="text-sm text-green-700 mb-3">
            Export detailed family information as a structured text document with statistics and complete member details.
          </p>
          <button
            onClick={() => handleExportPDF('text')}
            disabled={isExporting}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting && exportType === 'text' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isExporting && exportType === 'text' ? 'Generating Report...' : 'Export Text Report'}
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 rounded-lg p-3 border">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Export Tips:</h5>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Visual exports automatically expand all tree nodes for complete capture</p>
          <p>• Large trees are split across multiple pages for better readability</p>
          <p>• Text reports include family statistics and complete member information</p>
          <p>• Files are saved with descriptive names including date and member info</p>
          <p>• For best results with large trees, use horizontal or vertical layouts</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreePDFExport;