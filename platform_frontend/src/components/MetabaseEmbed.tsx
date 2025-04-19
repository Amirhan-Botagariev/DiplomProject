import { useEffect, useState } from "react";

type Props = {
  dashboardId: number;
  question_id: number;
  height?: number;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MetabaseEmbed = ({ dashboardId, question_id, height = 500 }: Props) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          dashboard_id: dashboardId.toString(),
          question_id: question_id.toString(),
        });

        const response = await fetch(`${backendUrl}/api/v1/metabase/dashboard-url?${params}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            // Если нужен токен — раскомментируй:
            // "Authorization": `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });

        const contentType = response.headers.get("content-type");

        const rawText = await response.text();
        console.log("📦 Статус:", response.status);
        console.log("📑 Content-Type:", contentType);
        console.log("📄 Raw response:", rawText.slice(0, 300));

        if (!response.ok) {
          console.error("❌ Ответ с ошибкой от сервера");
          return;
        }

        if (!contentType?.includes("application/json")) {
          console.error("❌ Ожидался JSON, но получено что-то другое");
          return;
        }

        const data = JSON.parse(rawText);
        setEmbedUrl(data.embed_url);
        console.log("✅ Дэшборд получен");
      } catch (err) {
        console.error("❌ Ошибка при получении Metabase URL:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, [dashboardId, question_id]);

  if (loading) return <p className="text-sm">Загрузка Metabase дэшборда...</p>;
  if (!embedUrl) return <p className="text-sm text-red-500">Не удалось загрузить дэшборд</p>;

  return (
    <iframe
      src={embedUrl}
      frameBorder="0"
      width="100%"
      height={height}
      allowTransparency
      title={`Metabase Dashboard #${dashboardId}`}
    />
  );
};

export default MetabaseEmbed;