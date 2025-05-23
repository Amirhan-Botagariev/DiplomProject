import React, { useState } from 'react';

interface VisualQueryBuilderStepProps {
  onQueryBuilt: (query: string) => void;
}

const availableTables = {
  employees: {
    name: 'Сотрудники',
    fields: ['Возраст', 'Пол', 'Отдел', 'Лет в компании'],
    sqlFields: ['age', 'gender', 'department', 'years_at_company'],
  },
  orders: {
    name: 'Заказы',
    fields: ['Дата заказа', 'Сумма', 'Статус'],
    sqlFields: ['order_date', 'amount', 'status'],
  },
};

const VisualQueryBuilderStep: React.FC<VisualQueryBuilderStepProps> = ({ onQueryBuilt }) => {
  const [selectedTable, setSelectedTable] = useState<'employees' | 'orders'>('employees');
  const [selectedFields, setSelectedFields] = useState<string[]>(['Возраст']);
  const [filters, setFilters] = useState<{ field: string; op: string; value: string }[]>([]);
  const [sorts, setSorts] = useState<{ field: string; order: 'ASC' | 'DESC' }[]>([]);

  const fields = availableTables[selectedTable].fields;
  const sqlFields = availableTables[selectedTable].sqlFields;

  const buildQuery = () => {
    const fieldSql = selectedFields.map(f => {
      const idx = fields.indexOf(f);
      return sqlFields[idx];
    }).join(', ') || '*';

    let whereSql = filters.map(f => {
      const idx = fields.indexOf(f.field);
      return `${sqlFields[idx]} ${f.op} '${f.value}'`;
    }).join(' AND ');

    let orderSql = sorts.map(s => {
      const idx = fields.indexOf(s.field);
      return `${sqlFields[idx]} ${s.order}`;
    }).join(', ');

    const query = `SELECT ${fieldSql} FROM ${selectedTable}` +
      (whereSql ? ` WHERE ${whereSql}` : '') +
      (orderSql ? ` ORDER BY ${orderSql}` : '');

    onQueryBuilt(query);
  };

  return (
    <div className="space-y-6">
      {/* Шаг 1 */}
      <div>
        <h3 className="text-md font-semibold">Что вы хотите проанализировать?</h3>
        <div className="flex gap-4 mt-2">
          {Object.keys(availableTables).map((key) => (
            <button
              key={key}
              className={`px-3 py-2 rounded border ${selectedTable === key ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
              onClick={() => setSelectedTable(key as any)}
            >
              {availableTables[key as keyof typeof availableTables].name}
            </button>
          ))}
        </div>
      </div>

      {/* Шаг 2 */}
      <div>
        <h3 className="text-md font-semibold">Что показать?</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {fields.map((f) => (
            <label key={f} className="text-sm">
              <input
                type="checkbox"
                checked={selectedFields.includes(f)}
                onChange={() => {
                  setSelectedFields((prev) =>
                    prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
                  );
                }}
                className="mr-2"
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* Шаг 3 */}
      <div>
        <h3 className="text-md font-semibold">Уточните условия</h3>
        {filters.map((f, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center mt-1">
            <select
              value={f.field}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => {
                  const copy = [...prev];
                  copy[i].field = val;
                  return copy;
                });
              }}
              className="min-w-[140px] p-1 border rounded"
            >
              {fields.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select
              value={f.op}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => {
                  const copy = [...prev];
                  copy[i].op = val;
                  return copy;
                });
              }}
              className="min-w-[140px] p-1 border rounded"
            >
              <option value="=">равен</option>
              <option value=">">больше чем</option>
              <option value="<">меньше чем</option>
              <option value="!=">не равен</option>
            </select>
            <input
              className="min-w-[140px] p-1 border rounded"
              value={f.value}
              onChange={(e) => {
                const val = e.target.value;
                setFilters((prev) => {
                  const copy = [...prev];
                  copy[i].value = val;
                  return copy;
                });
              }}
              placeholder="Значение"
            />
            <button onClick={() => {
              setFilters((prev) => prev.filter((_, idx) => idx !== i));
            }} className="text-red-600">➖</button>
          </div>
        ))}
        <button
          className="mt-2 text-blue-600 text-sm"
          onClick={() => setFilters([...filters, { field: fields[0], op: '=', value: '' }])}
        >
          ➕ Добавить условие
        </button>
      </div>

      {/* Шаг 4 */}
      <div>
        <h3 className="text-md font-semibold">Сортировка</h3>
        {sorts.map((s, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center mt-1">
            <select
              value={s.field}
              onChange={(e) => {
                const val = e.target.value;
                setSorts((prev) => {
                  const copy = [...prev];
                  copy[i].field = val;
                  return copy;
                });
              }}
              className="min-w-[140px] p-1 border rounded"
            >
              {fields.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select
              value={s.order}
              onChange={(e) => {
                const val = e.target.value as 'ASC' | 'DESC';
                setSorts((prev) => {
                  const copy = [...prev];
                  copy[i].order = val;
                  return copy;
                });
              }}
              className="min-w-[140px] p-1 border rounded"
            >
              <option value="ASC">по возрастанию</option>
              <option value="DESC">по убыванию</option>
            </select>
            <button onClick={() => {
              setSorts((prev) => prev.filter((_, idx) => idx !== i));
            }} className="text-red-600">➖</button>
          </div>
        ))}
        <button
          className="mt-2 text-blue-600 text-sm"
          onClick={() => setSorts([...sorts, { field: fields[0], order: 'ASC' }])}
        >
          ➕ Добавить сортировку
        </button>
      </div>

      {/* Финальный блок */}
      <div className="text-right">
        <button
          onClick={buildQuery}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          ✅ Построить запрос
        </button>
      </div>
    </div>
  );
};

export default VisualQueryBuilderStep;