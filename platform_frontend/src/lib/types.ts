export interface Graph {
  name: string;
  description?: string;
  query_type: string;
  query: string;
  chart_type: "bar" | "line" | "pie" | "scatter" | "histogram" | "stacked_bar";
  legend?: string;
  ox_name?: string;
  oy_name?: string;
}

export interface Dashboard {
  id: number;
  name: string;
  route_id: string;
  description?: string;
  category?: string;
  graphs?: Graph[];
}