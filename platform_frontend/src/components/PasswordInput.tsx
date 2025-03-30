// src/components/PasswordInput.tsx
import { useState } from "react";
import eyeIcon from "../icons/eye.svg";
import eyeCloseIcon from "../icons/eye-close.svg";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = ({ value, onChange }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full mb-6 font-montserrat">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Введите пароль"
        className="w-full h-14 pl-4 pr-12 text-[18px] leading-[20px] font-medium text-black placeholder-[#838B90] border border-[#9C9B9B] rounded-[9px] focus:outline-none focus:border-[#5FB3F6]"
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "18px",
          WebkitTextSecurity: visible ? "none" : "disc",
        } as React.CSSProperties}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setVisible(!visible)}
      >
        <img src={visible ? eyeIcon : eyeCloseIcon} className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PasswordInput;