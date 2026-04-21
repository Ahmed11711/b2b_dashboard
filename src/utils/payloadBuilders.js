const appendValue = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, value);
};

export const buildPayloadByEndpoint = (endpoint, input = {}) => {
  const payload = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    if (key === "gallery" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!item?.file) return;
        payload.append(`gallery[${index}][file]`, item.file);
        payload.append(`gallery[${index}][type]`, item.type || "image");
      });
      return;
    }

    if (key === "features" && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (!item?.feature_id) return;
        payload.append(`features[${index}][feature_id]`, item.feature_id);
        payload.append(`features[${index}][value]`, item.value || "");
        payload.append(`features[${index}][lable]`, item.lable || "");
      });
      return;
    }

    if (value instanceof File) {
      payload.append(key, value);
      return;
    }

    if (typeof value === "string" && value.startsWith("http")) {
      return;
    }

    appendValue(payload, key, value);
  });

  return payload;
};
