import React from 'react';
import Card from './Card';
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');


interface Column {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  onSelectAll?: (selected: boolean) => void;
  selectedItems?: any[];
  className?: string;
}

export function DataTable({ 
  columns, 
  data, 
  renderRow, 
  onSelectAll, 
  selectedItems = [],
  className 
}: DataTableProps) {
  const allSelected = selectedItems.length === data.length;

  return (
    <Card className={`p-0 overflow-hidden ${className || ''}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {onSelectAll && (
                <th className="text-left p-4 border-b border-slate-200">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}