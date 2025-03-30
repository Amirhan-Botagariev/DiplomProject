type Props = {
  message: string;
  type: "success" | "error";
};

export const Toast = ({ message, type }: Props) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`min-w-[280px] px-4 py-3 text-white rounded shadow-lg ${bgColor}`}
    >
      {message}
    </div>
  );
};