// components/layout/TableCellRenderer.jsx
import React from "react";

/**
 * TableCellRenderer - المكون السحري لعرض البيانات بديناميكية احترافية
 * كخبير، صممت هذا المكون ليعالج (الصور، العملات، التواريخ، الحالات، والنسخ) تلقائياً.
 */

// 1. تعريف الثيمات للألوان (Enterprise Color Palette)
const BADGE_THEMES = {
  success: "bg-green-50 text-green-700 border-green-200", // Completed, Active, Paid
  danger: "bg-red-50 text-red-700 border-red-200", // Cancelled, Failed, Inactive
  warning: "bg-amber-50 text-amber-700 border-amber-200", // Pending, Waiting, Processing
  info: "bg-blue-50 text-blue-700 border-blue-200", // Shipped, Info, Documentation
  default: "bg-gray-50 text-gray-600 border-gray-200", // N/A, Others
};

export default function TableCellRenderer({
  cell_type,
  value,
  options,
  onImageClick,
}) {
  // --- أ- فحص البيانات الفارغة (Data Integrity Guardian) ---
  if ((value === null || value === undefined || value === "") && value !== 0) {
    return (
      <span className="text-gray-300 italic text-[10px] tracking-widest font-light">
        EMPTY
      </span>
    );
  }

  // --- ب- دالة النسخ مع الـ Feedback (UX Experience) ---
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // Alert بسيط واحترافي ليعرف المستخدم أن العملية تمت
    alert(`✅ Copied to clipboard: \n"${text}"`);
  };

  // --- ج- مكوّن التغليف للنسخ (Smart Copy Wrapper) ---
  const CopyWrapper = ({ children, textToCopy }) => (
    <div className="group flex items-center gap-2 relative max-w-fit">
      {children}
    </div>
  );

  // --- د- منطق العرض بناءً على النوع (The Core Switch) ---
  switch (cell_type) {
    // 1. الشارات الذكية (Smart Badges) مع هندلة الحالات
    case "badge":
      const val = String(value).toLowerCase();
      const option = options?.find(
        (opt) => String(opt.value).toLowerCase() === val,
      );

      let themeKey = option?.color;

      // منطق خبير لتحديد اللون تلقائياً بناءً على الكلمة (لو لم يرسل الـ API لوناً)
      if (!themeKey) {
        if (
          ["completed", "active", "delivered", "paid", "success", "1"].includes(
            val,
          )
        )
          themeKey = "success";
        else if (
          ["pending", "waiting", "processing", "on_hold", "warning"].includes(
            val,
          )
        )
          themeKey = "warning";
        else if (
          ["cancelled", "failed", "rejected", "deleted", "0"].includes(val)
        )
          themeKey = "danger";
        else themeKey = "default";
      }

      return (
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize tracking-tight shadow-sm ${BADGE_THEMES[themeKey] || BADGE_THEMES.default}`}
        >
          {option ? option.label : value}
        </span>
      );

    case "progress":
      const max = 10;
      const percent = Math.min((value / max) * 100, 100);
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-1.5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-solid rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-secondary-link shrink-0">
            {value}
          </span>
        </div>
      );
    case "rating":
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-gray-500">({value})</span>
        </div>
      );

    case "image":
      return (
        <div className="relative w-10 h-10 group">
          <img
            src={value}
            alt="Thumbnail"
            className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100 cursor-zoom-in transition-all duration-300 group-hover:brightness-90 group-hover:scale-105"
            onClick={() => onImageClick(value)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=No+Image";
            }}
          />
        </div>
      );

    // 3. المبالغ المالية (Currency) بتنسيق عالمي
    case "price":
      return (
        <div className="flex items-baseline gap-1 font-mono tracking-tighter">
          <span className="font-bold text-gray-900 text-sm">
            {Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-[9px] text-gray-400 font-black uppercase">
            USD
          </span>
        </div>
      );

    // 4. التواريخ (Detailed Dates)
    case "date":
      const d = new Date(value);
      if (isNaN(d.getTime()))
        return <span className="text-gray-400 text-xs">{value}</span>;
      return (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            {d.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      );

    // 5. الروابط (External Resources)
    case "link":
    case "url":
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold transition-all group/link underline decoration-blue-200 underline-offset-4"
        >
          View Resource
          <svg
            className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
      );

    // 6. العلاقات (Relation Tags)
    case "relation":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          #{value}
        </span>
      );

    // 7. الحالة الافتراضية (Default Text) مع خاصية النسخ الذكي
    case "text":
    default:
      return (
        <CopyWrapper textToCopy={value}>
          <span
            className="text-gray-600 text-sm font-medium block whitespace-nowrap transition-colors hover:text-gray-900"
            title={value}
          >
            {value}
          </span>
        </CopyWrapper>
      );
  }
}
