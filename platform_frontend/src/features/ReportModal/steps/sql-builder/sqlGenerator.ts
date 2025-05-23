import { VisualField, Filter, Sort, QueryConfig } from './index.ts';

// Generates the SELECT clause
const generateSelectClause = (selectedFields: VisualField[]): string => {
  if (selectedFields.length === 0) {
    return 'SELECT *';
  }
  
  return `SELECT ${selectedFields.map(field => field.value).join(', ')}`;
};

// Generates the FROM clause
const generateFromClause = (mainTable: string): string => {
  return `FROM ${mainTable}`;
};

// Generates all necessary JOINs based on selected fields, filters, and sorts
const generateJoins = (config: QueryConfig): string => {
  const { selectedFields, filters, sorts, mainTable } = config;
  const allFields: VisualField[] = [
    ...selectedFields,
    ...filters.map(filter => filter.field),
    ...sorts.map(sort => sort.field)
  ];
  
  // Track processed joins to avoid duplicates
  const processedJoins = new Set<string>();
  const joins: string[] = [];
  
  // Map of table dependencies (which tables require which other tables)
  const tableDependencies: Record<string, Set<string>> = {};
  
  // First, collect all direct joins
  allFields.forEach(field => {
    if (field.join && field.table !== mainTable) {
      const joinKey = `${field.join.from}-${field.join.to}`;
      
      if (!processedJoins.has(joinKey)) {
        joins.push(`LEFT JOIN ${field.table} ON ${field.join.from} = ${field.join.to}`);
        processedJoins.add(joinKey);
        
        // Track which tables are connected
        const fromTable = field.join.from.split('.')[0];
        const toTable = field.join.to.split('.')[0];
        
        if (!tableDependencies[toTable]) {
          tableDependencies[toTable] = new Set();
        }
        
        tableDependencies[toTable].add(fromTable);
      }
    }
  });
  
  // Check for multi-level dependencies (e.g., countries -> locations -> departments)
  let shouldContinue = true;
  while (shouldContinue) {
    shouldContinue = false;
    
    Object.entries(tableDependencies).forEach(([toTable, fromTablesSet]) => {
      fromTablesSet.forEach(fromTable => {
        if (fromTable !== mainTable && tableDependencies[fromTable]) {
          // This table depends on another table which isn't the main table
          // We need to ensure there's a join path to the main table
          tableDependencies[toTable].add(mainTable);
          shouldContinue = true;
        }
      });
    });
  }
  
  return joins.join('\n');
};

// Generates the WHERE clause based on filters
const generateWhereClause = (filters: Filter[]): string => {
  if (filters.length === 0) {
    return '';
  }
  
  const conditions = filters.map(filter => {
    const { field, operator, value } = filter;
    
    // Handle different operators
    switch (operator) {
      case 'IS NULL':
      case 'IS NOT NULL':
        return `${field.value} ${operator}`;
      case 'LIKE':
        return `${field.value} LIKE '%${value}%'`;
      case 'STARTS_WITH':
        return `${field.value} LIKE '${value}%'`;
      case 'ENDS_WITH':
        return `${field.value} LIKE '%${value}'`;
      case 'IN':
      case 'NOT IN': {
        const values = Array.isArray(value) ? value : [value];
        const formattedValues = values.map(v => 
          field.type === 'string' ? `'${v}'` : v
        ).join(', ');
        return `${field.value} ${operator} (${formattedValues})`;
      }
      default: {
        const formattedValue = field.type === 'string' ? `'${value}'` : value;
        return `${field.value} ${operator} ${formattedValue}`;
      }
    }
  });
  
  return `WHERE ${conditions.join(' AND ')}`;
};

// Generates the ORDER BY clause
const generateOrderByClause = (sorts: Sort[]): string => {
  if (sorts.length === 0) {
    return '';
  }
  
  const sortClauses = sorts.map(sort => `${sort.field.value} ${sort.direction.toUpperCase()}`);
  return `ORDER BY ${sortClauses.join(', ')}`;
};

// Main function to generate the complete SQL query
export const generateSqlQuery = (config: QueryConfig): string => {
  const { selectedFields, filters, sorts, mainTable } = config;
  
  const selectClause = generateSelectClause(selectedFields);
  const fromClause = generateFromClause(mainTable);
  const joinClause = generateJoins(config);
  const whereClause = generateWhereClause(filters);
  const orderByClause = generateOrderByClause(sorts);
  
  const parts = [
    selectClause,
    fromClause,
    joinClause,
    whereClause,
    orderByClause
  ].filter(part => part.length > 0);
  
  return parts.join('\n');
};