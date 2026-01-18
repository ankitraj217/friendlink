// src/components/input.js
import { EyeIcon, EyeInvisibleIcon } from "../assets/icons";

export function Input({ label, type = "text", value, onChange, placeholder, isPasswordVisible, togglePasswordVisibility }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium" style={{ color: "var(--subtext-color)" }}>
                {label}
            </label>

            <div className="relative flex w-full items-center">
                <input
                    type={type === "password" && isPasswordVisible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                        w-full px-4 py-3 
                        rounded-lg outline-none 
                        text-sm transition-all duration-200
                        bg-background text-text placeholder-subtext
                        border border-transparent focus:border-accent
                        focus:ring-2 focus:ring-accent/40
                    "
                />
                {type === "password" && (
                    isPasswordVisible ? (
                        <EyeIcon
                            className="absolute right-3 h-5 w-5 cursor-pointer text-subtext"
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                        <EyeInvisibleIcon
                            className="absolute right-3 h-5 w-5 cursor-pointer text-subtext"
                            onClick={togglePasswordVisibility}
                        />
                    )
                )}
            </div>
        </div>
    );
}
