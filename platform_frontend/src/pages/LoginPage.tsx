import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
// @ts-ignore
import "../styles/login.css";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_BACKEND_URL

export default function LoginPage() {
  const [iin, setIin] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast(); // используем метод из контекста
  const navigate = useNavigate(); // <- подключаем навигацию

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(`${url}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        iin: iin,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      addToast("Успешный вход!", "success");

      // можешь сохранить токен в localStorage, если хочешь
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } else {
      const error = await response.json();
      addToast(error.detail || "Ошибка авторизации", "error");
    }
  } catch (err) {
    console.error("Login error:", err);
    addToast("Ошибка подключения к серверу", "error");
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