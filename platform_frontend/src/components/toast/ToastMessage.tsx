type Props = {
  message: string;
  type: "success" | "error";
};

export const ToastMessage = ({ message, type }: Props) => {
  return (
    <div
      className={`toast-message ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white px-4 py-2 rounded-lg shadow-md`}
    >
      {message}
    </div>
  );
};