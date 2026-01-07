import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="w-full p-8">
      <div className="prose prose-invert prose-slate max-w-none 
        prose-headings:font-bold prose-headings:text-gray-100 
        prose-p:text-gray-300 prose-p:leading-relaxed
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
        prose-ul:list-disc prose-ol:list-decimal
        prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-gray-800
        prose-hr:border-gray-800
      ">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({node, ...props}) => (
              <a target="_blank" rel="noopener noreferrer" {...props} />
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