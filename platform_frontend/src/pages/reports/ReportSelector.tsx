import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card.tsx";
import ReportCreationModal from "../../features/ReportModal/ReportModal";

export default function ReportSelector({ title = "Отчёты" }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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
          <Card className="cursor-pointer hover:shadow-md transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">Возрастной профиль</h2>
              <p className="text-sm text-muted-foreground">
                Распределение сотрудников по возрасту, группам и категориям
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">Пол и семейное положение</h2>
              <p className="text-sm text-muted-foreground">
                Анализ гендерного состава и семейного статуса сотрудников
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">Образование</h2>
              <p className="text-sm text-muted-foreground">
                Образовательный уровень персонала
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">Стаж в компании</h2>
              <p className="text-sm text-muted-foreground">
                Продолжительность работы сотрудников в компании
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Integration */}
      <ReportCreationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}