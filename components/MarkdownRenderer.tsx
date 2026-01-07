import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="w-full p-8">
      {/* 
        prose: Enables typography plugin
        prose-invert: Dark mode optimized colors
        prose-slate: Base color theme
        max-w-none: Allows content to fill the container width
      */}
      <div className="prose prose-invert prose-slate max-w-none prose-headings:border-b prose-headings:border-gray-800 prose-headings:pb-2 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Override links to open in new tab
            a: ({node, ...props}) => (
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 no-underline hover:underline"
                {...props} 
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;