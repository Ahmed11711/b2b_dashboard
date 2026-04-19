import React from 'react';
import { cn } from '../lib/utils';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-light bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-bg-surface border-b border-border-light">
          <tr>
            {columns.map((column, idx) => (
              <th 
                key={idx} 
                className={cn(
                  'px-6 py-4 text-[48px] font-bold uppercase tracking-widest text-carbon-black', 
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse border-b border-border-light">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 bg-white">
                    <div className="h-4 w-full rounded bg-bg-surface" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400 bg-white">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'group transition-all duration-300 ease-in-out hover:bg-emerald-tint/60 border-b border-border-light hover:border-b-emerald-solid/30',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column, idx) => (
                  <td key={idx} className={cn('px-6 py-4 bg-white transition-colors group-hover:bg-transparent', column.className)}>
                    <div className="text-text-description">
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
