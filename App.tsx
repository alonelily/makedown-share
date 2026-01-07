import { useState, useEffect } from 'react';
import { ViewMode } from './types';
import Toolbar from './components/Toolbar';
import MarkdownRenderer from './components/MarkdownRenderer';
import { encodeStateToHash, decodeStateFromHash } from './services/urlService';
import { Icons } from './components/Icon';

const DEFAULT_MARKDOWN = `# Welcome to MarkShare 👋

Paste your Markdown here, or type away!

## Features
- **Real-time Preview**: See changes instantly.
- **Instant Sharing**: Click 'Share' to generate a permanent link.
- **Beautiful Typography**: Clean and readable.

\`\`\`javascript
console.log("Code highlighting works too!");
\`\`\`

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci
`;

function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize from URL or Default
  useEffect(() => {
    const hashContent = decodeStateFromHash(window.location.hash);
    if (hashContent) {
      setMarkdown(hashContent);
      setViewMode(ViewMode.PREVIEW); // Auto-preview shared content
    } else {
      setMarkdown(DEFAULT_MARKDOWN);
    }

    // Handle window resize for responsive view mode
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode(prev => prev === ViewMode.SPLIT ? ViewMode.EDITOR : prev);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleShare = () => {
    // Check for Blob/Sandbox environment
    if (window.location.protocol === 'blob:') {
      showToast("⚠️ You are in a private Sandbox. Links generated here cannot be shared externally. Please deploy the app first.", 'error');
      return;
    }

    const hash = encodeStateToHash(markdown);
    
    // Check for URL length limits (rough safety check)
    if (hash.length > 20000) {
      showToast("Content is too long to generate a shareable link.", 'error');
      return;
    }

    try {
      window.location.hash = hash;
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Link copied to clipboard! Share it anywhere.");
      }).catch(() => {
        showToast("Failed to copy link automatically.", 'error');
      });
    } catch (e) {
      console.error(e);
      showToast("Error generating link.", 'error');
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setMarkdown("");
      setViewMode(ViewMode.EDITOR);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <Toolbar 
        markdown={markdown}
        setMarkdown={setMarkdown}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShare={handleShare}
        onClear={handleClear}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        <div 
          className={`
            flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300
            ${viewMode === ViewMode.EDITOR ? 'w-full' : ''}
            ${viewMode === ViewMode.SPLIT ? 'w-1/2 hidden md:flex' : ''}
            ${viewMode === ViewMode.PREVIEW ? 'w-0 hidden' : ''}
          `}
        >
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-200 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane */}
        <div 
          className={`
            flex flex-col bg-gray-950 transition-all duration-300
            ${viewMode === ViewMode.PREVIEW ? 'w-full' : ''}
            ${viewMode === ViewMode.SPLIT ? 'w-1/2 hidden md:flex' : ''}
            ${viewMode === ViewMode.EDITOR ? 'w-0 hidden' : ''}
          `}
        >
          <div className="h-full overflow-y-auto custom-scrollbar flex justify-center">
            <div className="w-full max-w-4xl bg-gray-950 min-h-full">
              {markdown ? (
                <MarkdownRenderer content={markdown} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <Icons.Pencil size={48} className="mb-4 opacity-20" />
                  <p>Start typing to see the preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle (Floating) if in Split mode wasn't possible */}
        <div className="md:hidden absolute bottom-6 right-6 flex gap-2">
           <button
             onClick={() => setViewMode(viewMode === ViewMode.EDITOR ? ViewMode.PREVIEW : ViewMode.EDITOR)}
             className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-900/50 transition-transform active:scale-95"
           >
             {viewMode === ViewMode.EDITOR ? <Icons.Eye size={24} /> : <Icons.Pencil size={24} />}
           </button>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`
          absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up border max-w-md w-full
          ${toast.type === 'success' ? 'bg-gray-800 border-green-500/30 text-green-400' : ''}
          ${toast.type === 'error' ? 'bg-gray-800 border-red-500/30 text-red-400' : ''}
          ${toast.type === 'info' ? 'bg-gray-800 border-blue-500/30 text-blue-400' : ''}
        `}>
          {toast.type === 'success' && <Icons.Check size={20} className="shrink-0" />}
          {toast.type === 'error' && <Icons.Alert size={20} className="shrink-0" />}
          {toast.type === 'info' && <Icons.Share size={20} className="shrink-0" />}
          <span className="font-medium text-gray-200 text-sm leading-tight">{toast.msg}</span>
        </div>
      )}
      
      {/* Tailwind Animation for Toast */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;