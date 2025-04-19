import PeopleIcon from "../icons/people.svg?react";
import PlusIcon from "../icons/plus.svg?react";
import MinusIcon from "../icons/minus.svg?react";
import TrendUpIcon from "../icons/trend-up.svg?react";
import TrendDownIcon from "../icons/trend-down.svg?react";
import CandidatesIcon from "../icons/candidates.svg?react";
import MetabaseEmbed from "../components/MetabaseEmbed";

const Dashboard = () => {
  return (
    <div className="font-montserrat text-black">
      {/* Заголовки */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold mb-1 tracking-[0.03em]">
          Отчет по кадровым показателям
        </h1>
        <p className="text-sm font-medium tracking-[0.03em]">
          Основные кадровые показатели
        </p>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Общее количество сотрудников"
          value="1,540"
          change="+12,5%"
          changeType="up"
          icon={<PeopleIcon />}
        />
        <MetricCard
          title="Кандидаты на вакансии"
          value="750"
          change="+2,7%"
          changeType="up"
          icon={<CandidatesIcon />}
        />
        <MetricCard
          title="Новые сотрудники"
          value="134"
          change="+6,5%"
          changeType="up"
          icon={<PlusIcon />}
        />
        <MetricCard
          title="Уволившиеся сотрудники"
          value="56"
          change="-17,5%"
          changeType="down"
          icon={<MinusIcon />}
        />
      </div>

      {/* Metabase Dashboard */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-medium tracking-[0.03em] uppercase mb-4">
          Численность сотрудников (Metabase)
        </h3>
        <MetabaseEmbed dashboardId={1} question_id={1} />
      </div>
    </div>
  );
};

type MetricProps = {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
};

const MetricCard = ({ title, value, change, changeType, icon }: MetricProps) => {
  const isUp = changeType === "up";
  const trendColor = isUp ? "#6FA690" : "#D17072";
  const trendBg = isUp ? "bg-[#ECF5F2]" : "bg-[#FFF4F5]";
  const TrendIcon = isUp ? TrendUpIcon : TrendDownIcon;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="w-[54px] h-[54px] bg-[#F8F8F8] flex items-center justify-center rounded-full mb-4">
        {icon}
      </div>
      <div className="flex items-center gap-4">
        <h2 className="text-[32px] font-semibold">{value}</h2>
        <div
          className={`rounded-full flex items-center px-3 py-1 text-xs font-medium gap-1 ${trendBg}`}
          style={{ color: trendColor }}
        >
          <TrendIcon className="w-3 h-3" />
          {change}
        </div>
      </div>
      <p className="mt-2 text-sm font-medium">{title}</p>
    </div>
  );
};

export default Dashboard;