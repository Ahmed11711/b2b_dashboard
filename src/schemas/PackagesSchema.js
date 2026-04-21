/**
 * Auto-generated fields for Package
 * Generated at: 2026-04-16 10:05:20
 */
export const PackagesFields = [
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
    key: "name", 
    label: "Name", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 1, 
    placeholder: "Enter Name",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: true,
    options: null
  },
  { 
    key: "description", 
    label: "Description", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 0, 
    placeholder: "Enter Description",
    searchable: true,
    filterable: false,
    sortable: false,
    table_show: false,
    form_show: true,
    options: null
  },
  { 
    key: "price", 
    label: "Price", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 1, 
    placeholder: "Enter Price",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: true,
    options: null
  },
  { 
    key: "duration_months", 
    label: "Duration Months", 
    type: "text", 
    cell_type: "text",
    display_field: null,
    required: 1, 
    placeholder: "Enter Duration Months",
    searchable: false,
    filterable: false,
    sortable: true,
    table_show: true,
    form_show: true,
    options: null
  },
   { 
    key: "active", 
    label: "Status", 
    type: "select", 
    cell_type: "badge",
    display_field: null,
    required: 1, 
    placeholder: "Select Status",
    searchable: false,
    filterable: true,
    sortable: true,
    table_show: true,
    form_show: true,
     options: [
      
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
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
  },
  { 
    key: "category_ids",     
    label: "Categories",
    type: "multi-select",      
    endpoint: "categories",    
    optionLabel: "name",       
    optionValue: "id",        
    required: true
  },

 
  
];