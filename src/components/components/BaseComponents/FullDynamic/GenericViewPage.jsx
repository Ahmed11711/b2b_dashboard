import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAll, getOne } from "../../../../service/services/apiService";
import { useTranslation } from "../../../../hooks/useTranslation";

const getValueByPath = (obj, path) => {
  if (!path || !obj) return null;
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
      obj,
    );
};

const isImageValue = (val) => {
  const s = String(val ?? "");
  return (
    (s.startsWith("http") ||
      s.startsWith("/storage") ||
      s.startsWith("data:image")) &&
    (s.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || s.startsWith("data:image"))
  );
};

const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return [val];
  return [];
};

const getCellValue = (item, key) => {
  if (key.includes(".")) {
    return key.split(".").reduce((acc, k) => acc?.[k] ?? null, item);
  }
  return item[key];
};

const htmlToPlainText = (value) => {
  const raw = String(value ?? "");
  const htmlLike = /<\/?[a-z][\s\S]*>/i.test(raw) || raw.includes("&nbsp;");
  if (!htmlLike) return raw;

  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    const temp = window.document.createElement("div");
    temp.innerHTML = raw;
    return temp.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  return raw.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
};

// ================= DynamicValueRenderer =================
function DynamicValueRenderer({ value, labelKey, format }) {
  const { t } = useTranslation();
  if (value === null || value === undefined || value === "") {
    return <span className="text-secondary-link font-medium italic">-</span>;
  }

  if (format === "short_id") {
    return (
      <span className="font-mono text-xs bg-bg-surface px-2 py-1 rounded-lg text-secondary-link">
        #{String(value).padStart(8, "0").toUpperCase()}
      </span>
    );
  }

  if (format === "link") {
    return (
      <a
        href={String(value)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-emerald-solid hover:underline text-sm font-medium"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        View on Map
      </a>
    );
  }

  if (format === "rating") {
    const rating = parseFloat(value) || 0;
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: fullStars }).map((_, i) => (
            <svg
              key={`f${i}`}
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          {hasHalf && (
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2v15.27z" />
            </svg>
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <svg
              key={`e${i}`}
              className="w-4 h-4 text-border-light"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <span className="text-xs font-bold text-secondary-link">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <span className="text-carbon-black font-medium text-sm">
        {value.title || value.name || value.label || `ID: ${value.id}`}
      </span>
    );
  }

  const stringValue = String(value);
  const plainTextValue = htmlToPlainText(value);
  const keyName = String(labelKey || "").toLowerCase();
  const isImageUrl = stringValue.match(
    /\.(jpeg|jpg|gif|png|webp|svg)$|unsplash\.com/i,
  );

  if (stringValue.startsWith("http") && isImageUrl) {
    return (
      <div className="relative group">
        <img
          src={stringValue}
          alt="rel"
          className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow hover:scale-105 transition-all duration-300"
        />
        <a
          href={stringValue}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-[9px] font-black uppercase"
        >
          {t("common.view")}
        </a>
      </div>
    );
  }

  if (isImageValue(value)) {
    return (
      <img
        src={stringValue}
        alt="img"
        className="w-10 h-10 rounded-lg object-cover border border-border-thin"
      />
    );
  }

  if (value === 0 || value === 1 || value === true || value === false) {
    const isActive = value == 1 || value === true;
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-status-success-bg text-status-success-text" : "bg-status-error-bg text-status-error-text"}`}
      >
        {isActive ? t("common.yes") : t("common.no")}
      </span>
    );
  }

  if (keyName.includes("status")) {
    const statusColors = {
      pending: "bg-status-warning-bg text-status-warning-text",
      active: "bg-status-success-bg text-status-success-text",
      published: "bg-status-success-bg text-status-success-text",
      confirmed: "bg-status-success-bg text-status-success-text",
      canceled: "bg-status-error-bg text-status-error-text",
      expired: "bg-border-light text-carbon-gray",
    };
    const colorClass =
      statusColors[stringValue.toLowerCase()] ||
      "bg-status-info-bg text-status-info-text";
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass}`}
      >
        {t(`common.${stringValue.toLowerCase()}`, { defaultValue: stringValue })}
      </span>
    );
  }

  if (plainTextValue.length > 60) {
    return (
      <span className="text-text-description text-sm">
        {plainTextValue.substring(0, 60)}...
      </span>
    );
  }

  return (
    <span className="text-carbon-black font-medium text-sm">{plainTextValue}</span>
  );
}

// ================= InlineRelationTable =================
function InlineRelationTable({ items, headers, viewRoute, editRoute }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!items || items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-secondary-link">
        <svg
          className="w-12 h-12 mb-3 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-sm font-medium">{t("No records found")}</p>
      </div >
    );

  const cols = Array.isArray(headers)
    ? headers
    : Object.keys(items[0] || {})
      .filter((k) => typeof items[0][k] !== "object")
      .slice(0, 6)
      .map((k) => ({ key: k, label: k.replace(/_/g, " ") }));

  const hasActions = viewRoute || editRoute;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-bg-surface">
            {cols.map((h) => (
              <th
                key={h.key}
                className="px-6 py-4 text-xs font-bold text-secondary-link uppercase tracking-wider border-b border-border-light"
              >
                {t(h.label)}
              </th >
            ))
            }
            {
              hasActions && (
                <th className="px-6 py-4 text-xs font-bold text-secondary-link uppercase tracking-wider border-b border-border-light text-center">
                  {t("Actions")}
                </th >
              )
            }
          </tr >
        </thead >
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id || idx}
              className="hover:bg-emerald-tint/50 transition-colors border-b border-border-light last:border-0"
            >
              {cols.map((h) => (
                <td key={h.key} className="px-6 py-4 text-sm text-carbon-gray">
                  <DynamicValueRenderer
                    value={getCellValue(item, h.key)}
                    labelKey={h.key}
                    format={h.format || null}
                  />
                </td>
              ))}
              {hasActions && (
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {viewRoute && (
                      <button
                        onClick={() =>
                          navigate(viewRoute.replace(":id", item.id))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-tint text-emerald-solid hover:bg-emerald-solid hover:text-white transition-all"
                        title={t("View")}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    )}
                    {editRoute && (
                      <button
                        onClick={() =>
                          navigate(editRoute.replace(":id", item.id))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        title={t("Edit")}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table >
    </div >
  );
}

// ================= Tab Table Section =================
function TabTableSection({ field, recordId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getAll(field.endpoint, {
          [field.filterKey]: recordId,
        });
        setItems(res.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [field.endpoint, recordId]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-border-light border-t-emerald-solid rounded-full animate-spin" />
      </div>
    );

  const headers = field.headers
    ? field.headers.filter((h) => h.table_show)
    : Object.keys(items[0] || {})
      .filter((k) => typeof items[0][k] !== "object")
      .slice(0, 5)
      .map((k) => ({ key: k, label: k.replace(/_/g, " ") }));

  return <InlineRelationTable items={items} headers={headers} />;
}

// ================= Relation Modal =================
function RelationModal({ isOpen, onClose, item, label }) {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-carbon-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-card-bg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-border-light animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-light sticky top-0 bg-card-bg z-10 rounded-t-3xl">
          <h3 className="text-xl font-bold text-heading-slate">{label}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-bg-surface text-carbon-gray hover:bg-status-error-bg hover:text-status-error-text transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap gap-4">
            {Object.entries(item).map(([key, val]) => {
              if (!isImageValue(val)) return null;
              return (
                <div key={key} className="space-y-2">
                  <p className="text-xs font-bold uppercase text-secondary-link tracking-wider">
                    {key.replace(/_/g, " ")}
                  </p>
                  <img
                    src={String(val)}
                    alt={key}
                    className="w-32 h-32 rounded-2xl object-cover border border-border-light shadow-sm"
                  />
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-5">
            {Object.entries(item).map(([key, val]) => {
              if (typeof val === "object" && val !== null) return null;
              if (isImageValue(val)) return null;
              return (
                <div
                  key={key}
                  className="bg-bg-surface rounded-2xl p-4 border border-border-light"
                >
                  <p className="text-[10px] font-bold uppercase text-secondary-link mb-1 tracking-widest">
                    {key.replace(/_/g, " ")}
                  </p>
                  <DynamicValueRenderer value={val} labelKey={key} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Relation Table =================
function RelationSection({ label, items, navigateTo }) {
  const navigate = useNavigate();
  const [modalItem, setModalItem] = useState(null);

  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const handleRowClick = (item) => {
    if (navigateTo) navigate(navigateTo.replace(":id", item.id));
    else setModalItem(item);
  };

  const allKeys = items.reduce((keys, item) => {
    Object.keys(item).forEach((k) => {
      if (
        !keys.includes(k) &&
        typeof item[k] !== "object" &&
        !isImageValue(item[k])
      ) {
        keys.push(k);
      }
    });
    return keys;
  }, []);

  const displayKeys = allKeys.length > 0 ? allKeys : Object.keys(items[0]).slice(0, 4);

  return (
    <>
      <div className="bg-card-bg rounded-2xl shadow-sm border border-border-light overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-border-light bg-card-bg">
          <h3 className="text-lg font-bold text-heading-slate capitalize">
            {label}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface">
                {displayKeys.map((key) => (
                  <th
                    key={key}
                    className="px-6 py-4 text-xs font-bold text-secondary-link uppercase tracking-wider border-b border-border-light"
                  >
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  onClick={() => handleRowClick(item)}
                  className="hover:bg-emerald-tint/50 cursor-pointer transition-colors border-b border-border-light last:border-0"
                >
                  {displayKeys.map((key) => (
                    <td
                      key={key}
                      className="px-6 py-4 text-sm text-carbon-gray"
                    >
                      <DynamicValueRenderer value={item[key]} labelKey={key} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RelationModal
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        item={modalItem}
        label={label}
      />
    </>
  );
}


// ================= LoadingSkeleton =================
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-surface py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-border-thin rounded-lg"></div>
        <div className="h-64 bg-card-bg rounded-2xl border border-border-light shadow-sm"></div>
        <div className="h-48 bg-card-bg rounded-2xl border border-border-light shadow-sm"></div>
      </div>
    </div>
  );
}

// ================= NotFound =================
function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center">
      <div className="text-center space-y-4 bg-card-bg p-10 rounded-2xl border border-border-light shadow-sm">
        <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-secondary-link"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-heading-slate">
          {t("Record Not Found")}
        </h2>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 bg-bg-surface hover:bg-border-light text-carbon-gray font-bold rounded-xl transition-all text-sm"
        >
          {t("Go Back")}
        </button>
      </div>
    </div>
  );
}

// ================= Main Page =================
export default function GenericViewPage({ entityName, title, fields }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getOne(entityName, id);
        setData(res.data || res);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [entityName, id]);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <NotFound />;

  const tabFields = fields.filter((f) => f.tab === true);

  const mainFields = fields.filter(
    (f) =>
      f.view_show !== false &&
      f.cell_type !== "relation" &&
      f.cell_type !== "relation_list" &&
      !f.tab,
  );

  const relationListFields = fields.filter(
    (f) =>
      f.view_show === true &&
      !f.tab &&
      (f.cell_type === "relation" || f.cell_type === "relation_list"),
  );

  const relationTabs = tabFields
    .map((f) => ({
      key: f.key,
      label: f.label,
      items: data[f.key] || [],
      headers: f.headers || null,
      view_route: f.view_route || null,
      edit_route: f.edit_route || null,
    }))
    .filter((tab) => Array.isArray(tab.items));

  const hasTabs = relationTabs.length > 0;

  const imageFields = mainFields.filter(
    (f) => f.type === "file" || f.cell_type === "image",
  );
  const numericFields = mainFields.filter(
    (f) => f.type === "number" || typeof data[f.key] === "number",
  );
  const statusFields = mainFields.filter(
    (f) =>
      f.key.toLowerCase().includes("status") ||
      typeof data[f.key] === "boolean",
  );
  const otherFields = mainFields.filter(
    (f) =>
      !imageFields.includes(f) &&
      !numericFields.includes(f) &&
      !statusFields.includes(f) &&
      f.key !== "title" &&
      f.key !== "name" &&
      typeof data[f.key] !== "object",
  );

  const titleVal =
    data.title || data.name || data.label || title || `Item #${id}`;
  const firstImage = imageFields.length > 0 ? data[imageFields[0].key] : null;
  const mainStatusField = statusFields.length > 0 ? statusFields[0] : null;

  return (
    <div className="min-h-screen bg-bg-surface py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-card-bg hover:bg-emerald-tint text-carbon-gray rounded-full transition-all duration-300 shadow-sm border border-border-thin"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-heading-slate">
            {t("Details")}
          </h2>
        </div>

        {/* Basic Information Card */}
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-border-light">
            <h3 className="text-lg font-bold text-heading-slate">
              {t("Basic Information")}
            </h3>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {/* Title + Image + Status */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-5">
                {imageFields.length > 0 &&
                  (firstImage ? (
                    <img
                      src={firstImage}
                      alt={titleVal}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-bg-surface shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-border-light flex items-center justify-center border-4 border-bg-surface shadow-sm">
                      <svg
                        className="w-8 h-8 text-secondary-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  ))}
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-heading-slate mb-2">
                    {titleVal}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-secondary-link font-medium">
                    {otherFields.slice(0, 2).map((f) => (
                      <span key={f.key} className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-secondary-link"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {data[f.key] || "N/A"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {mainStatusField && data[mainStatusField.key] !== undefined && (
                <div className="shrink-0">
                  <DynamicValueRenderer
                    value={data[mainStatusField.key]}
                    labelKey={mainStatusField.key}
                  />
                </div>
              )}
            </div>

            {/* Numeric Fields */}
            {numericFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {numericFields.map((field) => (
                  <div
                    key={field.key}
                    className="bg-bg-surface rounded-2xl p-5 border border-border-light flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase text-secondary-link mb-1">
                        {t(field.label)}
                      </p>
                      <h5 className="text-xl font-bold text-heading-slate">
                        {data[field.key] || 0}
                      </h5>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-tint flex items-center justify-center bg-card-bg">
                      <span className="text-emerald-solid font-bold text-sm">
                        {String(data[field.key] || 0).slice(0, 3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other Fields */}
            {otherFields.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border-light">
                {otherFields.slice(2).map((field) => (
                  <div key={field.key} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-status-warning-bg text-status-warning-text flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary-link mb-0.5">
                        {t(field.label)}
                      </p>
                      <div className="text-sm font-semibold text-carbon-gray">
                        <DynamicValueRenderer
                          value={data[field.key]}
                          labelKey={field.key}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Inline List */}
            {fields
              .filter((f) => f.inline === true && f.cell_type === "inline_list")
              .map((field) => {
                const items = toArray(data[field.key]);
                if (!items.length) return null;
                return (
                  <div
                    key={field.key}
                    className="pt-6 border-t border-border-light"
                  >
                    <p className="text-xs font-bold uppercase text-secondary-link mb-4 tracking-widest">
                      {t(field.label)}
                    </p>

                    {/* images */}
                    {field.inline_type === "images" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {items.map((item, idx) => {
                          const imgSrc =
                            item[field.image_key] ||
                            item.image ||
                            item.url ||
                            item.path ||
                            null;
                          if (!imgSrc) return null;
                          return (
                            <a
                              key={idx}
                              href={imgSrc}
                              target="_blank"
                              rel="noreferrer"
                              className="relative group aspect-square rounded-2xl overflow-hidden border border-border-light shadow-sm"
                            >
                              <img
                                src={imgSrc}
                                alt={`${t(field.label)} ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* cards */}
                    {field.inline_type === "cards" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item, idx) => {
                          const keys =
                            field.display_keys ||
                            Object.keys(item)
                              .filter((k) => typeof item[k] !== "object")
                              .slice(0, 4);
                          return (
                            <div
                              key={idx}
                              className="bg-bg-surface rounded-2xl p-4 border border-border-light space-y-3"
                            >
                              {keys.map((k) => (
                                <div key={k}>
                                  <p className="text-[10px] font-bold uppercase text-secondary-link mb-0.5">
                                    {t(k.replace(/_/g, " "))}
                                  </p>
                                  <DynamicValueRenderer
                                    value={getCellValue(item, k)}
                                    labelKey={k}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* table */}
                    {field.inline_type === "table" && (
                      <InlineRelationTable
                        items={items}
                        headers={
                          field.display_keys
                            ? field.display_keys.map((k) => ({
                              key: k,
                              label: k.replace(/_/g, " "),
                            }))
                            : null
                        }
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Relation بدون tabs */}
        {relationListFields.map((relField, idx) => (
          <RelationSection
            key={idx}
            label={t(relField.label)}
            items={toArray(data[relField.key])}
            navigateTo={relField.navigate_to || null}
          />
        ))}

        {/* Tabs Section */}
        {hasTabs && (
          <div className="bg-card-bg rounded-2xl shadow-sm border border-border-light overflow-hidden">
            <div className="flex border-b border-border-light overflow-x-auto">
              {relationTabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-6 py-4 text-sm font-bold whitespace-nowrap capitalize transition-all border-b-2 -mb-px ${activeTab === idx
                    ? "border-emerald-solid text-emerald-solid bg-emerald-tint/30"
                    : "border-transparent text-secondary-link hover:text-carbon-gray hover:bg-bg-surface"
                    }`}
                >
                  {t(tab.label)}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-bg-surface text-secondary-link">
                    {tab.items.length}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-0">
              <InlineRelationTable
                items={relationTabs[activeTab]?.items || []}
                headers={relationTabs[activeTab]?.headers || null}
                viewRoute={relationTabs[activeTab]?.view_route || null}
                editRoute={relationTabs[activeTab]?.edit_route || null}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
