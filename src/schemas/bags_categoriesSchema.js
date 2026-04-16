/**
 * Auto-generated fields for BagsCategory
 * Generated at: 2026-04-16 12:55:59
 */
export const BagsCategoryFields = [
  { 
    key: "id", 
    label: "Id", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 1, 
    placeholder: "Enter Id",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: false,
    form_show: true,
    options: null
  },
  { 
    key: "bag_id", 
    label: "Bag Id", 
    type: "select", 
    cell_type: "relation",
    display_field: "bag.name",
    required: 1, 
    placeholder: "Enter Bag Id",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: false,
    form_show: true,
    endpoint: 'bags',
    relation_fields: 'id,name',
    options: { label: 'name', value: 'id' }
  },
  { 
    key: "title", 
    label: "Title", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 1, 
    placeholder: "Enter Title",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: true,
    options: null
  },
  { 
    key: "image", 
    label: "Image", 
    type: "file", 
    cell_type: "image",
    display_field: null,
    required: 0, 
    placeholder: "Enter Image",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: true,
    options: null
  },
  { 
    key: "created_at", 
    label: "Created At", 
    type: "date", 
    cell_type: "date",
    display_field: null,
    required: 0, 
    placeholder: "Enter Created At",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: false,
    options: null
  },
  { 
    key: "updated_at", 
    label: "Updated At", 
    type: "date", 
    cell_type: "date",
    display_field: null,
    required: 0, 
    placeholder: "Enter Updated At",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: false,
    form_show: false,
    options: null
  }
];