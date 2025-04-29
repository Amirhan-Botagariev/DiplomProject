import { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Row {
  [key: string]: any;
}

export default function DashboardPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState<Row[]>([]);
  const [chartType, setChartType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`${backendUrl}/api/v1/query/execute_predefined`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_id: 4,
            filters: {
              risk_threshold: "0.1",
            },
          }),
        });

        const result = await response.json();
        setData(result.data || []);
        setChartType(result.chart_type || null);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (!chartType) {
    return <div>Тип графика не определен</div>;
  }

  if (data.length === 0) {
    return <div>Нет данных для отображения.</div>;
  }

  const keys = Object.keys(data[0]);
  const labelKey = keys[0];
  const valueKey = keys[1];

  const chartData = {
    labels: data.map((row) => row[labelKey]?.toString()),
    datasets: [
      {
        label: valueKey,
        data: data.map((row) => row[valueKey]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `График по ${valueKey}`,
      },
    },
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Данные дашборда</h1>

      {chartType === "bar" && <Bar data={chartData} options={chartOptions} />}
      {chartType === "line" && <Line data={chartData} options={chartOptions} />}
      {chartType === "pie" && <Pie data={chartData} options={chartOptions} />}
      {chartType === "doughnut" && <Doughnut data={chartData} options={chartOptions} />}
      {chartType === "metric" && (
        <div className="flex justify-center items-center h-64">
          <h1 className="text-6xl font-bold">
            {data[0]?.[valueKey] || "Нет данных"}
          </h1>
        </div>
      )}
      {chartType === "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                {keys.map((key) => (
                  <th key={key} className="px-4 py-2 border">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {keys.map((key) => (
                    <td key={key} className="px-4 py-2 border">
                      {row[key] !== null ? row[key].toString() : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chartType === "boxplot" && (
        <div>Boxplot визуализация будет здесь (позже подключим плагин chartjs-box-plot)</div>
      )}
      {chartType === "map" && (
        <div>Карта будет здесь (позже интегрируем react-leaflet)</div>
      )}
    </div>
  );
}