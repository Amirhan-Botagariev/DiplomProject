export interface VisualField {
  id: string;
  label: string;
  value: string;
  type: 'string' | 'number' | 'date';
  table: string;
  join?: {
    from: string;
    to: string;
  };
}

export interface Filter {
  id: string;
  field: VisualField;
  operator: string;
  value: string | number | string[] | number[];
}

export interface Sort {
  id: string;
  field: VisualField;
  direction: 'asc' | 'desc';
}

export interface QueryConfig {
  selectedFields: VisualField[];
  filters: Filter[];
  sorts: Sort[];
  mainTable: string;
}

export interface OperatorOption {
  label: string;
  value: string;
  types: ('string' | 'number' | 'date')[];
  needsValue: boolean;
  multiple?: boolean;
}