import React from 'react';
import { Input } from '../../../components/ui/input';

interface Props {
  ox: string;
  oy: string;
  legend: string;
  chartType: string;
  onChange: (key: 'ox' | 'oy' | 'legend' | 'chart_type', value: string) => void;
}

const ChartConfigStep: React.FC<Props> = ({ ox, oy, legend, onChange, chartType }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Ось X</label>
        <Input placeholder="Пример: gender" value={ox} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('ox', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Ось Y</label>
        <Input placeholder="Пример: count" value={oy} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('oy', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium">Легенда</label>
        <Input placeholder="Пример: Пол" value={legend} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('legend', e.target.value)} />
      </div>

      <div>
      <select
          value={chartType}
          onChange={(e) => onChange('chart_type', e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
          <option value="scatter">Scatter</option>
          <option value="histogram">Histogram</option>
          <option value="gauge">Gauge</option>
          <option value="stacked_bar">Stacked Bar</option>
        </select>
      </div>
    </div>
  );
};

export default ChartConfigStep;