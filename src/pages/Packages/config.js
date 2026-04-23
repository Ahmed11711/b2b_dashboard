export const packagesEndpoint = "packages";
export const packagesTitle = "Packages";

export const packagesFields = [
  { key: "name", label: "Name", type: "text", cell_type: "text", required: 1, placeholder: "Enter Name", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "description", label: "Description", type: "text", cell_type: "text", required: 0, placeholder: "Enter Description", searchable: true, filterable: false, sortable: false, table_show: false, form_show: true, options: null },
  { key: "price", label: "Price", type: "text", cell_type: "text", required: 1, placeholder: "Enter Price", searchable: false, filterable: false, sortable: true, table_show: true, form_show: true, options: null },
  { key: "duration_months", label: "Duration Months", type: "text", cell_type: "text", required: 1, placeholder: "Enter Duration Months", searchable: false, filterable: true, sortable: true, table_show: true, form_show: true, options: null },
  { key: "active", label: "Status", type: "select", cell_type: "badge", required: 1, placeholder: "Select Status", searchable: false, filterable: true, sortable: true, table_show: true, form_show: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
  { key: "category_ids", label: "Categories", type: "multi-select", endpoint: "categories", optionLabel: "name", optionValue: "id", required: false, table_show: false, form_show: false },
  { key: "features", label: "Package Features", type: "multi-features", cell_type: "relation_list", required: 0, table_show: false, form_show: true, view_show: true },
  { key: "created_at", label: "Created At", type: "date", cell_type: "date", required: 0, placeholder: "Enter Created At", searchable: false, filterable: false, sortable: true, table_show: true, form_show: false, options: null },
  { key: "updated_at", label: "Updated At", type: "date", cell_type: "date", required: 0, placeholder: "Enter Updated At", searchable: false, filterable: false, sortable: true, table_show: false, form_show: false, options: null },
];
