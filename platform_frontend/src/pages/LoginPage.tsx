import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
// @ts-ignore
import "../styles/login.css";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [iin, setIin] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast(); // используем метод из контекста

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (iin === "admin" && password === "admin") {
      addToast("Добро пожаловать!", "success");
    } else {
      addToast("Неправильный ИИН или пароль.", "error");
    }
  };

  const isFilled = iin.trim() !== "" && password.trim() !== "";

  return (
    <div className="login-wrapper">
      <h1 className="login-title">HRDashboard</h1>

      <form className="login-form" onSubmit={handleLogin}>
        {/* ИИН */}
        <label className="input-label" htmlFor="iin">ИИН</label>
        <input
          id="iin"
          type="text"
          placeholder="Введите ИИН"
          value={iin}
          onChange={(e) => setIin(e.target.value)}
          className="w-full h-14 pl-4 pr-12 text-[18px] leading-[20px] font-medium text-black placeholder-[#838B90] border border-[#9C9B9B] rounded-[9px] focus:outline-none focus:border-[#5FB3F6] tracking-wide font-montserrat mb-6"
        />

        {/* Пароль */}
        <label className="input-label" htmlFor="password">Пароль</label>
        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

        {/* Кнопка */}
        <button
          type="submit"
          disabled={!isFilled}
          className={`submit-button ${isFilled ? "submit-button-filled" : ""}`}
        >
          Войти
        </button>
      </form>
    </div>
  );
}