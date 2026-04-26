export const bagItemsEndpoint = "bag_items";
export const bagItemsTitle = "Bag Items";

export const bagItemsFields = [
  { key: "id", label: "Id", type: "text", cell_type: "text", required: 1, placeholder: "Enter Id", searchable: false, filterable: false, sortable: true, table_show: false, form_show: true, options: null },
  { key: "bags_categories_id", label: "Bags Categories Id", type: "select", cell_type: "relation", display_field: "bagsCategories.title", required: 0, placeholder: "Enter Bags Categories Id", searchable: false, filterable: true, sortable: true, table_show: true, form_show: true, endpoint: "bags_categories", relation_fields: "id,title", options: { label: "title", value: "id" } },
  { key: "title", label: "Title", type: "text", cell_type: "text", required: 1, placeholder: "Enter Title", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "price", label: "Price", type: "text", cell_type: "text", required: 1, placeholder: "Enter Price", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "image", label: "Image", type: "file", cell_type: "image", required: 1, placeholder: "Enter Image", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "currency", label: "Currency", type: "select", cell_type: "badge", required: 1, placeholder: "Enter Currency", searchable: false, filterable: true, sortable: true, table_show: true, form_show: true, options: [{ label: "ريال", value: "ريال" }, { label: "دولار", value: "دولار" }, { label: "جنيه مصري", value: "جنيه مصري" }] },
  { key: "rating", label: "Rating", type: "text", cell_type: "text", required: 0, placeholder: "Enter Rating", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "desc", label: "Desc", type: "textarea", cell_type: "textarea", required: 1, placeholder: "Enter Desc", searchable: true, filterable: false, sortable: false, table_show: false, form_show: true, options: null },
  { key: "gallery", label: "Gallery", type: "gallery", cell_type: "gallery", required: 0, placeholder: "Upload files", searchable: false, filterable: false, sortable: false, table_show: false, form_show: true, options: null },
  { key: "text", label: "Whose", type: "textarea", cell_type: "text", required: 0, placeholder: "Enter Whose", searchable: true, filterable: false, sortable: false, table_show: false, form_show: true, options: null },
  { key: "what_will_you_get", label: "What Will You Get", type: "textarea", cell_type: "text", required: 0, placeholder: "Enter What Will You Get", searchable: true, filterable: false, sortable: false, table_show: false, form_show: true, options: null },
  { key: "created_at", label: "Created At", type: "date", cell_type: "date", required: 0, placeholder: "Enter Created At", searchable: false, filterable: false, sortable: true, table_show: true, form_show: false, options: null },
  { key: "updated_at", label: "Updated At", type: "date", cell_type: "date", required: 0, placeholder: "Enter Updated At", searchable: false, filterable: false, sortable: true, table_show: false, form_show: false, options: null },
];
