
import React, { useState } from 'react';
import { ScriptData } from '../types/podcast';

interface ScriptViewerProps {
  script: ScriptData;
}

const ScriptViewer = ({ script }: ScriptViewerProps) => {
  const [editableContent, setEditableContent] = useState(script.content);
  const [isEditing, setIsEditing] = useState(false);

  const formatScript = (content: string) => {
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      // Headers and sections
      if (trimmedLine.toLowerCase().includes('intro') || 
          trimmedLine.toLowerCase().includes('opening') ||
          trimmedLine.toLowerCase().includes('conclusion') ||
          trimmedLine.toLowerCase().includes('outro')) {
        return (
          <h3 key={index} className="font-bold text-lg text-purple-600 mt-4 mb-2">
            {trimmedLine}
          </h3>
        );
      }
      
      // Stage directions (text in parentheses or brackets)
      if (trimmedLine.includes('(') || trimmedLine.includes('[')) {
        return (
          <p key={index} className="italic text-gray-500 text-sm my-1">
            {trimmedLine}
          </p>
        );
      }
      
      // Speaker labels (lines ending with :)
      if (trimmedLine.endsWith(':') && trimmedLine.length < 50) {
        return (
          <p key={index} className="font-semibold text-blue-600 mt-3 mb-1">
            {trimmedLine}
          </p>
        );
      }
      
      // Empty lines
      if (!trimmedLine) {
        return <br key={index} />;
      }
      
      // Regular content
      return (
        <p key={index} className="text-gray-800 leading-relaxed mb-2">
          {trimmedLine}
        </p>
      );
    });
  };

  const wordCount = editableContent.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedDuration = Math.ceil(wordCount / 150); // ~150 words per minute

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-2">
        <div className="flex gap-4">
          <span>Words: {wordCount}</span>
          <span>Est. Duration: ~{estimatedDuration} min</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          {isEditing ? 'Done Editing' : 'Edit Script'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg border p-6 max-h-96 overflow-y-auto">
        {isEditing ? (
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full h-80 p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Edit your script here..."
          />
        ) : (
          <div className="font-mono text-sm">
            {formatScript(editableContent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptViewer;
