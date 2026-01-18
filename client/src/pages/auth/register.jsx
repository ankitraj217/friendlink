// src/pages/auth/register.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useServerContext, useToastContext } from "../../contexts";
import Toast from "../../components/toast";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { api } = useServerContext();
    const { showToast } = useToastContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            showToast("Please fill in all fields", "warning");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match", "warning");
            return;
        }

        setIsRegistering(true);

        try {
            const response = await api.post('/api/auth/register', { name, email, password });
            const { message } = response.data;
            showToast(message, "success");
            navigate("/login");
        } catch (error) {
            showToast(error.response?.data || "Registration failed", "error");
            console.error("Registration error:", error);
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">

            <Toast />

            <h1 className="text-3xl font-bold mb-6">
                Welcome to Friend<span className="text-accent">Link</span>
            </h1>

            <div className="w-full max-w-md bg-surface p-6 rounded-2xl shadow-md">

                <h3 className="text-2xl font-semibold mb-4 text-center">Sign Up</h3>

                <form onSubmit={handleFormSubmit} className="flex flex-col w-full max-w-md gap-4">

                    <Input
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        isPasswordVisible={isPasswordVisible}
                        togglePasswordVisibility={togglePasswordVisibility}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        isPasswordVisible={isConfirmPasswordVisible}
                        togglePasswordVisibility={toggleConfirmPasswordVisibility}
                    />

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className={`w-full btn btn-primary mt-4 flex items-center justify-center gap-2
                            ${isRegistering ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                    >
                        {isRegistering ? (
                            <>
                                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>

                    <div className="text-center text-sm text-subtext">
                        Already have an account?&nbsp;
                        <NavLink to={"/login"} className="text-accent cursor-pointer">Login</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}