import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card.tsx";
import ReportCreationModal from "../../features/ReportModal/ReportModal";
import { useNavigate, useParams } from 'react-router-dom';

interface Dashboard {
  dashboard_id: number;
  dashboard_name: string;
  dashboard_url: string;
  category?: string;
}

export default function ReportSelector({ title = "Отчёты" }) {
  const navigate = useNavigate();
  const { type } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[] | null>(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const response = await fetch(`${backendUrl}/api/v1/metabase/dashboards`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboards");
        }
        const data = await response.json();
        setDashboards(data);
      } catch (error) {
        console.error(error);
        setDashboards([]);
      }
    }
    fetchDashboards();
  }, [backendUrl]);

  if (dashboards === null) {
    return <div className="flex flex-col min-h-screen bg-white p-6">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <button
            onClick={handleOpenModal}
            className="bg-[#5FB3F6] text-white font-medium text-sm px-4 py-2 rounded-md h-10"
          >
            Добавить новый отчёт
          </button>
        </div>

        {/* Subheading */}
        <p className="text-muted-foreground mb-6">
          Выберите нужный вид отчёта из списка ниже
        </p>

        {/* Report Grid */}
        <div className="grid grid-cols-2 gap-6">
          {Array.isArray(dashboards) && dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <Card
                key={dashboard.dashboard_id}
                className="cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/reports/${type}/${dashboard.dashboard_id}`)}
              >
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{dashboard.dashboard_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {dashboard.category || "Описание отсутствует"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Нет доступных отчётов</p>
          )}
        </div>
      </div>

      {/* Modal Integration */}
      <ReportCreationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}