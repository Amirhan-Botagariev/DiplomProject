// import React, { useState, useEffect, useMemo } from 'react';
// import FieldSelectionStep from '../FieldSelectionStep.tsx';
// // import FilterSortStep from '../sql-builder/FilterSortStep.tsx';
//
// import { generateSqlQuery } from './sqlGenerator';
// import { VisualField, Filter, Sort } from './index';
//
// interface SQLBuilderProps {
//   onQueryChange: (query: string) => void;
// }
//
// const SQLBuilder: WReact.FC<SQLBuilderProps> = ({ onQueryChange }) => {
//   const [selectedFields, setSelectedFields] = useState<VisualField[]>([]);
//   const [filters, setFilters] = useState<Filter[]>([]);
//   const [sorts, setSorts] = useState<Sort[]>([]);
//   const [sql, setSql] = useState('');
//
//   const mainTable = 'employees';
//
//   const query = useMemo(() => {
//     return generateSqlQuery({
//       selectedFields,
//       filters,
//       sorts,
//       mainTable,
//     });
//   }, [selectedFields, filters, sorts]);
//
// useEffect(() => {
//   setSql(query);
//   onQueryChange(query);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [query]);
//
//   return (
//     <div className="flex flex-col items-center w-full px-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl items-start">
//         <div className="w-full">
//           <FieldSelectionStep
//             selectedFields={selectedFields}
//             setSelectedFields={setSelectedFields}
//           />
//         </div>
//         {/*<div className="w-full">*/}
//         {/*  <FilterSortStep*/}
//         {/*    filters={filters}*/}
//         {/*    setFilters={setFilters}*/}
//         {/*    sorts={sorts}*/}
//         {/*    setSorts={setSorts}*/}
//         {/*    selectedFields={selectedFields}*/}
//         {/*    sql={sql}*/}
//         {/*  />*/}
//         {/*</div>*/}
//       </div>
//     </div>
//   );
// };
//
// export default SQLBuilder;