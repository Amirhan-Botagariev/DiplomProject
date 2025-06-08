import React, { useState } from 'react';

const TableSchemaExplorer: React.FC<{ schema: Record<string, string[]> }> = ({ schema }) => {
  const [openTable, setOpenTable] = useState<string | null>(null);

  return (
    <div className="w-full max-h-[300px] overflow-y-auto border rounded p-3 bg-gray-50 text-sm">
      {Object.entries(schema).map(([table, columns]) => (
        <div key={table} className="mb-2">
          <button
            onClick={() => setOpenTable(openTable === table ? null : table)}
            className="w-full text-left font-medium text-blue-700 hover:underline"
          >
            {table}
          </button>
          {openTable === table && (
            <ul className="pl-4 list-disc text-gray-700">
              {columns.map((col) => (
                <li key={col}>{col}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableSchemaExplorer;