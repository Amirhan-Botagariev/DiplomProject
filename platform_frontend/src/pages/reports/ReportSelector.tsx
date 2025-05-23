import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  ChartDataset,
  Colors,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import GridLayout from "react-grid-layout";
import ReportModal from "../../features/ReportModal/ReportModal.tsx";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Colors
);

interface Graph {
  name: string;
  description?: string;
  query_type: string;
  query: string;
  chart_type: "bar" | "line" | "pie" | "scatter" | "histogram" | "gauge" | "stacked_bar";
  legend?: string;
  ox_name?: string;
  oy_name?: string;
}

interface Dashboard {
  id: number;
  name: string;
  route_id: string;
  description?: string;
  category?: string;
  graphs?: Graph[];
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<Record<string, any>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${backendUrl}/api/v1/dashboards`);
        if (!res.ok) throw new Error("Не удалось загрузить отчёты");

        const data: Dashboard[] = await res.json();
        const cleanId = id?.replace(/^my-reports\//, "");
        const found = data.find((d) => d.route_id === cleanId);
        if (!found) throw new Error("Отчёт не найден");
        setDashboard(found);

        const results: Record<string, any> = {};
        for (const graph of found.graphs || []) {
          const resp = await fetch(`${backendUrl}/api/v1/query/execute_sql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sql: graph.query }),
          });

          const data = await resp.json();
          results[graph.name] = data.data;
        }
        setGraphData(results);
      } catch (err: any) {
        setError(err.message || "Произошла ошибка");
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id, backendUrl]);

  const renderChart = (graph: Graph, data: any[]) => {
    if (!data || data.length === 0) return <p>Нет данных для графика "{graph.name}"</p>;

    const xKey = graph.ox_name ?? "x";
    const yKey = graph.oy_name ?? "y";
    const groupKey = "gender_name";

    const labels = [...new Set(data.map((item) => item[xKey]))];

    let datasets: ChartDataset<any, number[]>[] = [];

    const grouped: [string, Map<any, number>][] = Array.from(
      data.reduce((acc, item) => {
        const label = item[xKey];
        const group = item[groupKey];
        const val = item[yKey];
        if (!acc.has(group)) acc.set(group, new Map());
        acc.get(group)!.set(label, val);
        return acc;
      }, new Map<string, Map<any, number>>())
    );

    datasets = grouped.map(([group, values]) => ({
      label: group,
      data: labels.map((l) => values.get(l) || 0),
    }));

    const chartProps = {
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: !!graph.name, text: graph.name },
          legend: { display: true, position: "top" as const },
        },
      },
    };

    switch (graph.chart_type) {
      case "bar":
      case "stacked_bar":
        return <Bar {...(chartProps as any)} />;
      case "histogram":
        return <Bar {...(chartProps as any)} />;
      case "line":
        return <Line {...(chartProps as any)} />;
      case "pie":
        return <Pie {...(chartProps as any)} />;
      case "scatter":
        return (
          <Scatter
            data={{
              datasets: [
                {
                  label: graph.name,
                  data: data.map((d) => ({ x: d[xKey], y: d[yKey] })),
                },
              ],
            }}
          />
        );
      default:
        return <p>Неподдерживаемый тип графика: {graph.chart_type}</p>;
    }
  };

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!dashboard) return <div className="p-6">Нет данных для отчёта</div>;

  const layout = dashboard.graphs?.map((graph, i) => ({
    i: graph.name,
    x: (i * 4) % 12,
    y: Infinity,
    w: 4,
    h: 4,
  })) ?? [];

  return (
    <div className={`p-6 space-y-6 ${isDragging ? 'dragging-disable-select' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{dashboard.name}</h1>
          {dashboard.description && <p className="text-gray-600 mb-4">{dashboard.description}</p>}
        </div>
        <button
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setModalOpen(true)}
        >
          Добавить новый график
        </button>
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        preventCollision={true}
        isResizable={true}
        isDraggable={true}
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onResizeStart={() => setIsDragging(true)}
        onResizeStop={() => setIsDragging(false)}
      >
        {dashboard.graphs?.map((graph) => (
          <div key={graph.name} className="bg-white rounded shadow p-4 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">{graph.name}</h2>
            {graph.description && <p className="text-sm text-gray-500 mb-2">{graph.description}</p>}
            <div className="w-full h-[calc(100%-3rem)]">
              {renderChart(graph, graphData[graph.name])}
            </div>
          </div>
        ))}
      </GridLayout>

      <ReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}