import React from 'react';
import { FileText, Download, MoreHorizontal } from 'lucide-react';

export interface Document {
  id: number;
  title: string;
  category: string;
  date: string;
  size: string;
  type: string;
  author: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{document.title}</h3>
            <span className="text-xs text-gray-500">{document.type}</span>
          </div>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-blue-600 hover:text-blue-900 p-1">
            <Download className="h-4 w-4" />
          </button>
          <button className="text-gray-500 hover:text-gray-900 p-1">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <span>{document.date}</span>
        <span>{document.size}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {document.category}
        </span>
      </div>
    </div>
  );
};

export default DocumentCard;