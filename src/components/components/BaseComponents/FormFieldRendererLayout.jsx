import { useState, useEffect } from "react";
import { getAll } from "../../../service/services/apiService";
import MultiSelectField from "../../components/BaseComponents/MultiSelectField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function FormFieldRendererLayout({
  field,
  value,
  onChange,
  error,
  disabled,
}) {
  // ================= STATE =================
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("image");

  const displayValue =
    value === null || value === undefined ? "" : value;

  const isFullWidth =
    field?.type === "textarea" ||
    field?.type === "gallery" ||
    field?.type === "file" ||
    field?.key?.toLowerCase().includes("description");

  // ================= FETCH OPTIONS =================
  useEffect(() => {
    if (!field) return;

    const isRelation =
      field.type === "select" && !Array.isArray(field.options);

    if (!isRelation) {
      setOptions(field.options || []);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const target =
          field.endpoint || field.key.replace("_id", "s");

        const res = await getAll(target);
        const data = res.data || res;

        const labelKey = field.options?.label || "name";
        const valueKey = field.options?.value || "id";

        const formatted = data.map((item) => ({
          label: item[labelKey],
          value: item[valueKey],
        }));

        setOptions(formatted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [field]);

  // ================= GALLERY HANDLERS =================
  const galleryFiles = Array.isArray(value) ? value : [];

  const FILE_TYPES = [
    { label: "Image", value: "image", accept: "image/*" },
    { label: "PDF", value: "pdf", accept: ".pdf" },
    { label: "Word", value: "word", accept: ".doc,.docx" },
    { label: "Excel", value: "excel", accept: ".xls,.xlsx" },
    { label: "Video", value: "video", accept: "video/*" },
    { label: "Download Demo", value: "download_demo", accept: ".zip,.rar,.tar.gz,.pdf,.doc,.docx" },
  ];

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      type: selectedType,
      preview:
        selectedType === "image"
          ? URL.createObjectURL(file)
          : null,
      name: file.name,
    }));

    onChange(field.key, [...galleryFiles, ...files]);
    e.target.value = "";
  };

  const handleGalleryRemove = (index) => {
    const updated = galleryFiles.filter((_, i) => i !== index);
    onChange(field.key, updated);
  };

  // ================= ReactQuill Config =================
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  // ================= RENDER INPUT =================
  const renderInput = () => {
    switch (field.type) {
      // ===== SELECT =====
      case "select":
        return (
          <select
            value={displayValue}
            disabled={disabled || loading}
            onChange={(e) =>
              onChange(field.key, e.target.value)
            }
            className="w-full border rounded p-2"
          >
            <option value="">
              {loading ? "Loading..." : "Select"}
            </option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      // ===== GALLERY =====
      case "gallery":
        return (
          <div className="flex flex-col gap-3">
            {/* Type Selector */}
            <div className="flex gap-2 flex-wrap">
              {FILE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSelectedType(t.value)}
                  className={`px-2 py-1 border rounded text-xs tracking-wider uppercase font-bold transition-all ${selectedType === t.value
                    ? "bg-emerald-solid text-white border-emerald-solid shadow-md"
                    : "bg-bg-surface text-secondary-link border-border-light hover:border-emerald-tint"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Upload */}
            <input
              type="file"
              multiple
              accept={
                FILE_TYPES.find(
                  (t) => t.value === selectedType
                )?.accept
              }
              onChange={handleGalleryAdd}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-tint file:text-emerald-solid hover:file:bg-emerald-solid hover:file:text-white transition-all text-sm text-carbon-gray"
            />

            {/* Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryFiles.map((item, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden border border-border-light aspect-square flex items-center justify-center bg-card-bg shadow-sm">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={item.name}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-2 text-center text-secondary-link">
                      <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="text-[10px] font-bold truncate w-full">{item.name}</span>
                      <span className="text-[9px] uppercase tracking-wider bg-bg-surface px-2 py-0.5 rounded text-carbon-gray border border-border-light">{item.type}</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleGalleryRemove(i)
                    }
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      // ===== RICH TEXT =====
      case "textarea":
        return (
          <div className="quill-wrapper-custom">
            <ReactQuill
              value={displayValue}
              onChange={(val) =>
                onChange(field.key, val)
              }
              modules={quillModules}
              readOnly={disabled}
              className="bg-card-bg"
            />
          </div>
        );

      // ===== CHECKBOX =====
      case "checkbox":
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={() =>
              onChange(field.key, value ? 0 : 1)
            }
          />
        );

      // ===== FILE =====
      case "file":
        return (
          <div className="flex flex-col gap-3 relative mt-2">
            {/* Same floating label style for consistency */}
            <label className="absolute -top-2 left-4 px-1 bg-card-bg text-[11px] font-medium text-text-description pointer-events-none z-10">
              {field.label}
              {field.required ? (
                <span className="text-status-error-text text-sm ml-0.5">*</span>
              ) : null}
            </label>
            <div className="relative w-full">
              <div className="relative group border border-dashed border-emerald-solid/50 bg-emerald-tint/20 rounded-[20px] p-6 w-full text-center hover:bg-emerald-tint/40 transition-all cursor-pointer mt-0 min-h-[120px] flex items-center justify-center overflow-hidden">
                <input
                  type="file"
                  onChange={(e) => onChange(field.key, e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />

                {/* If no value, show upload prompt */}
                {!value && (
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="text-xl text-emerald-solid group-hover:-translate-y-1 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>

                    <p className="text-text-description font-medium text-xs">
                      Click or drag to upload
                    </p>
                  </div>
                )}

                {/* If value exists, show image filling the box */}
                {value && (
                  <>
                    <img
                      src={value instanceof File ? URL.createObjectURL(value) : value}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="preview"
                    />
                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-carbon-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                      <div className="flex flex-col items-center gap-1 cursor-pointer">
                        <span className="text-white text-xs font-medium">Click to change</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onChange(field.key, null);
                        }}
                        className="p-2 bg-status-error-bg text-status-error-text rounded-full hover:scale-110 transition-transform relative z-30"
                        title="Remove Image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case "multi-select":
        return (
          <MultiSelectField
            field={field}
            value={value}
            onChange={onChange}
            error={error}
          />
        );

      // ===== DEFAULT =====
      default:
        return (
          <input
            type="text"
            value={displayValue}
            onChange={(e) =>
              onChange(field.key, e.target.value)
            }
            disabled={disabled}
          />
        );
    }
  };

  // ================= RETURN =================
  return (
    <div
      className={`flex flex-col gap-1 ${isFullWidth ? "col-span-2" : ""
        }`}
    >
      {field.type !== "checkbox" && (
        <label className="text-sm font-medium">
          {field.label}
        </label>
      )}

      {renderInput()}

      {error && (
        <span className="text-red-500 text-xs">
          {error}
        </span>
      )}
    </div>
  );
}