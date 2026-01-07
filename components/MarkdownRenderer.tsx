import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none w-full p-8 overflow-y-auto custom-scrollbar">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-4 border-b border-gray-800 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-100 mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-medium text-gray-200 mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-gray-300 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-gray-900/50 rounded-r italic text-gray-400" {...props} />,
          code: ({node, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            return isInline ? (
              <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <div className="relative group my-4">
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-800">
                  <code className={`font-mono text-sm text-gray-200 ${className || ''}`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto mb-6 rounded-lg border border-gray-800"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({node, ...props}) => <th className="bg-gray-900 p-3 font-semibold text-gray-200 border-b border-gray-800" {...props} />,
          td: ({node, ...props}) => <td className="p-3 border-b border-gray-800/50 text-gray-300" {...props} />,
          img: ({node, ...props}) => <img className="rounded-lg max-h-[500px] object-contain mx-auto my-6 border border-gray-800 shadow-lg" {...props} />,
          hr: ({node, ...props}) => <hr className="my-8 border-gray-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;