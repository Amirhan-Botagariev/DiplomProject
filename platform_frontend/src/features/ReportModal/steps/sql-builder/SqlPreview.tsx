import React, { useState } from 'react';
import { Code, Clipboard, CheckCircle2 } from 'lucide-react';

interface SqlPreviewProps {
  sql: string;
}

const SqlPreview: React.FC<SqlPreviewProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSql = (sql: string) => {
    if (!sql) return <span className="text-gray-500 italic">Запрос ещё не сформирован</span>;

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'JOIN', 'ON', 'AND', 'OR',
      'ORDER BY', 'ASC', 'DESC', 'LIKE', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'
    ];

    const lines = sql.split('\n');

    return (
      <>
        {lines.map((line, index) => {
          let formattedLine = line;
          keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formattedLine = formattedLine.replace(regex, match =>
              `<span class="text-blue-600 font-medium">${match}</span>`
            );
          });
          return (
            <div key={index} className="whitespace-pre" dangerouslySetInnerHTML={{ __html: formattedLine }} />
          );
        })}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Code className="h-5 w-5 mr-2 text-gray-700" />
          Превью SQL
        </h2>

        <button
          className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
              <span className="text-green-500">Скопировано</span>
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1.5" />
              <span>Скопировать SQL</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 font-mono text-sm overflow-x-auto">
        {formatSql(sql)}
      </div>
    </div>
  );
};

export default SqlPreview;