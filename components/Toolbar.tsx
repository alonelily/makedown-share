import React from 'react';
import { Icons } from './Icon';
import { ViewMode } from '../types';

interface ToolbarProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onShare: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  setViewMode,
  onShare,
  onClear
}) => {
  return (
    <div className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Icons.Columns className="text-white w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 hidden sm:block">
          MarkShare
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* View Toggles (Desktop) */}
        <div className="hidden md:flex bg-gray-800 rounded-lg p-1 mr-2">
          <button
            onClick={() => setViewMode(ViewMode.EDITOR)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.EDITOR ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            title="Editor Only"
          >
            <Icons.Pencil size={18} />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.SPLIT)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.SPLIT ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            title="Split View"
          >
            <Icons.Columns size={18} />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.PREVIEW)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
            title="Preview Only"
          >
            <Icons.Eye size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-800 mx-1" />

        <button
          onClick={onClear}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Clear All"
        >
          <Icons.Trash size={18} />
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Icons.Share size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;