import { useState } from "react";
import TableCellRenderer from "./layout/TableCellRenderer";

function ImagePreviewModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative max-w-[80%] max-h-[80%] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 -right-10 text-white hover:text-emerald-400 p-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img src={src} alt="Preview" className="rounded-xl shadow-2xl object-contain max-h-[80vh] border-4 border-white" />
      </div>
    </div>
  );
}

export default function TableComponent({ headers, data, onEdit, onDelete, onView, meta, onPageChange, onSearchChange, onFilterChange }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedImg, setSelectedImg] = useState(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    return sortConfig.direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
      const resolveValue = (obj, path) => {
  if (!path || !obj) return null;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

  const requestSort = (key) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="table-main-container flex flex-col bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      
      {/* 1. Toolbar */}
      <div className="p-5 border-b border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
       <input
  type="text"
  placeholder="Search records..."
  className="input-minimal w-full pl-12 h-11"
  onChange={(e) => onSearchChange(e.target.value)}
/>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-right">
          {headers.filter(h => h.filterable && h.options && Array.isArray(h.options)).map((header) => (
            <select
              key={header.key}
              className="input-minimal py-2 px-3 text-xs min-w-[140px] h-10 cursor-pointer"
              onChange={(e) => onFilterChange(header.key, e.target.value)}
            >
              <option value="">All {header.label}</option>
              {header.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* 2. Table Area */}
      <div className="table-scroll-area overflow-x-auto relative">
        <table className="w-full border-separate border-spacing-0 min-w-[1000px] table-fixed">
          <thead>
            <tr>
              {headers.filter(h => h.table_show).map((header) => (
                <th 
                  key={header.key} 
                  className={`table-header-sticky text-right bg-slate-50 border-b border-border-thin px-6 py-4 ${header.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                  onClick={() => header.sortable && requestSort(header.key)}
                  style={{ width: header.width || 'auto' }}
                >
                  <div className="flex items-center justify-start gap-2 font-bold text-[11px] text-slate-500 uppercase tracking-widest">
                    {header.label}
                    {header.sortable && <span className="text-slate-300">↕</span>}
                  </div>
                </th>
              ))}
              <th className="table-header-sticky right-0 z-30 text-center bg-slate-50 px-6 py-4 font-bold text-[11px] uppercase text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-light bg-white">
            {sortedData.map((row, idx) => (
              <tr key={row.id || idx} className="table-row group">
                {headers.filter(h => h.table_show).map((header) => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="flex justify-start items-center">
                      {header.cell_type === "image" ? (
                        <img 
                          src={row[header.key]} 
                          className="w-10 h-10 rounded-lg object-cover cursor-zoom-in border border-border-light shadow-sm hover:scale-110 transition-transform"
                          onClick={() => setSelectedImg(row[header.key])}
                          alt=""
                        />
                      ) : (
                   <TableCellRenderer
    cell_type={header.cell_type}
    value={header.display_field 
      ? resolveValue(row, header.display_field) 
      : resolveValue(row, header.key)} 
    options={Array.isArray(header.options) ? header.options : null}
  />
                      )}
                    </div>
                  </td>
                ))}

                <td className="right-0 z-20 bg-white group-hover:bg-emerald-tint/50 transition-colors px-4 py-4 shadow-[-6px_0_15px_-8px_rgba(0,0,0,0.08)]">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onView(row)} className="btn-action-icon" title="View"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg></button>
                    <button onClick={() => onEdit(row)} className="btn-action-icon" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg></button>
                    <button onClick={() => onDelete(row)} className="btn-action-icon btn-action-delete" title="Delete"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  {/* 3. Pagination Footer */}
{meta && (
<div className="px-8 py-6 bg-card-bg border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
  {(() => {
    const currentPage = Number(meta.current_page) || 1;
    const lastPage = Number(meta.last_page) || 1;
    const perPage = Number(meta.per_page) || 10;
    const total = Number(meta.total) || 0;

    const getPageNumbers = () => {
      const pages = [];
      const range = 1;

      for (let i = 1; i <= lastPage; i++) {
        if (
          i === 1 ||
          i === lastPage ||
          (i >= currentPage - range && i <= currentPage + range)
        ) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
          pages.push("...");
        }
      }
      return pages;
    };


    // ===== Variants =====
    const navButtonStyle = `
      w-10 h-10 flex items-center justify-center rounded-xl border
      border-border-thin bg-card-bg text-carbon-gray
      hover:border-emerald-solid hover:text-emerald-solid
      transition-all duration-300 shadow-sm
      disabled:opacity-30 disabled:cursor-not-allowed
      disabled:hover:border-border-thin disabled:hover:text-carbon-gray
    `;

    const pageButtonBase = `
      min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all duration-300
      border border-border-light
    `;

    const activePageStyle = `
      bg-emerald-solid text-white shadow-lg
      scale-110
    `;

    const inactivePageStyle = `
      bg-card-bg text-carbon-gray
      hover:border-emerald-solid/30 hover:bg-emerald-tint
    `;

    return (
      <>
        {/* Counter */}
        <div className="flex items-center gap-2 text-sm font-semibold text-text-description">
          <span className="flex items-center justify-center bg-bg-surface text-carbon-gray px-3 py-1 rounded-full text-xs">
            {(currentPage - 1) * perPage + 1} -{" "}
            {Math.min(currentPage * perPage, total)}
          </span>
          <span>of</span>
          <span className="text-carbon-black">
            {total.toLocaleString()} records
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={navButtonStyle}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Pages */}
          <div className="flex items-center gap-2">
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="text-border-thin font-bold px-1">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`${pageButtonBase} ${
                    currentPage === p
                      ? activePageStyle
                      : inactivePageStyle
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            disabled={currentPage === lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className={navButtonStyle}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </>
    );
  })()}
</div>
)}
      <ImagePreviewModal src={selectedImg} onClose={() => setSelectedImg(null)} />
    </div>
  );
}