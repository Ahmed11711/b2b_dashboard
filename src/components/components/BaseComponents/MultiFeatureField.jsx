import { useState, useEffect } from "react";
import { getAll } from "../../../service/services/apiService";

export default function MultiFeatureField({ field, value = [], onChange, error, disabled }) {
  const [featureOptions, setFeatureOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch feature options from API
  useEffect(() => {
    setLoading(true);
    getAll("features")
      .then((res) => {
        const raw = res.data || res;
        setFeatureOptions(
          Array.isArray(raw)
            ? raw.map((f) => ({
                label: f.key || f.name || f.title,
                value: f.id,
              }))
            : []
        );
      })
      .catch((err) => console.error("Error fetching features:", err))
      .finally(() => setLoading(false));
  }, []);

  const features = Array.isArray(value) ? value : [];

  const addFeature = () => {
    const newFeature = {
      feature_id: "",
      value: "",
      lable: "",
    };
    onChange(field.key, [...features, newFeature]);
  };

  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    onChange(field.key, updated);
  };

  const updateFeature = (index, key, val) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [key]: val } : f
    );
    onChange(field.key, updated);
  };

  const getFeatureLabel = (featureId) => {
    const option = featureOptions.find((opt) => String(opt.value) === String(featureId));
    return option?.label || "Unknown";
  };

  return (
    <div className="flex flex-col gap-4 mt-2 rounded-2xl border border-border-light bg-bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-text-description">
            {field.label}
            {field.required && <span className="text-status-error-text ml-1">*</span>}
          </label>
          <p className="text-[11px] text-secondary-link mt-1">
            Add package features with custom values and labels.
          </p>
        </div>
        <button
          type="button"
          onClick={addFeature}
          disabled={disabled}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-solid text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Feature
        </button>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-8 bg-card-bg rounded-[16px] border border-dashed border-border-thin">
          <p className="text-text-description text-xs font-medium">No features added yet. Click "Add Feature" to start.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-card-bg rounded-[16px] border border-border-thin hover:border-emerald-solid/30 transition-all duration-300 hover:shadow-md"
            >
              <div className="md:col-span-3 flex items-center justify-between border-b border-border-light pb-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-link">
                  Feature #{index + 1}
                </span>
                {feature.feature_id && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-tint text-emerald-solid font-semibold">
                    {getFeatureLabel(feature.feature_id)}
                  </span>
                )}
              </div>

              {/* Feature Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-text-description uppercase ml-1">Select Feature</label>
                <select
                  value={feature.feature_id || ""}
                  onChange={(e) => updateFeature(index, "feature_id", e.target.value)}
                  disabled={disabled || loading}
                  className="w-full h-11 px-4 rounded-xl border bg-slate-50/50 border-border-thin focus:border-emerald-solid outline-none text-sm font-semibold transition-all"
                >
                  <option value="">{loading ? "Loading..." : "Select Feature"}</option>
                  {featureOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-text-description uppercase ml-1">Value</label>
                <input
                  type="text"
                  value={feature.value || ""}
                  placeholder="Enter value"
                  onChange={(e) => updateFeature(index, "value", e.target.value)}
                  disabled={disabled}
                  className="w-full h-11 px-4 rounded-xl border bg-slate-50/50 border-border-thin focus:border-emerald-solid outline-none text-sm font-semibold transition-all"
                />
              </div>

              {/* Label Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-text-description uppercase ml-1">Label</label>
                <input
                  type="text"
                  value={feature.lable || ""}
                  placeholder="Enter label"
                  onChange={(e) => updateFeature(index, "lable", e.target.value)}
                  disabled={disabled}
                  className="w-full h-11 px-4 rounded-xl border bg-slate-50/50 border-border-thin focus:border-emerald-solid outline-none text-sm font-semibold transition-all"
                />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                disabled={disabled}
                className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-status-error-bg text-status-error-text rounded-full shadow-sm hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 disabled:opacity-0"
                title="Remove feature"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-status-error-text text-xs font-bold ml-2">
          ⚠ {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
