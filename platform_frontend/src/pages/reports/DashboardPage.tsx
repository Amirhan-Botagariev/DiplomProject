import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Dashboard {
  embed_url: string;
}

export default function DashboardPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams<{ type: string; id: string }>();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      if (!id) return;

      const response = await fetch(`${backendUrl}/api/v1/metabase/dashboards/${id}`);
      const data = await response.json();
      setDashboard(data);
    }

    fetchDashboard();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <iframe
        src={dashboard?.embed_url || ""}
        width="100%"
        height="1000px"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}