// src/pages/auth/login.jsx
import Toast from "../../components/toast";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Input } from "../../components/input";
import { useAuthContext, useServerContext, useToastContext } from "../../contexts";


export default function LoginPage() {
    const { api } = useServerContext();
    const { saveAuthUser, saveAuthToken } = useAuthContext();
    const { showToast } = useToastContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
            setIsLoggingIn(true);

            try {
                // Make a POST request to the server to authenticate the user
                api.post('/api/auth/login', { email, password })
                    .then(response => {
                        // Handle successful login
                        const { user, token, message } = response.data;
                        saveAuthUser(user);
                        saveAuthToken(token);
                        showToast(message, "success");
                    })
                    .catch(error => {
                        // Handle login error
                        showToast(error.response?.data, "error");
                        console.error("Login error:", error);
                    });
            } catch (error) {
                showToast("Login failed", "error");
                console.error("Login failed:", error);
            } finally {
                setIsLoggingIn(false);
            }
        } else {
            showToast("Please fill in all fields", "warning");
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">

            <Toast />

            <h1 className="text-3xl font-bold mb-6">Welcome to Friend<span className="text-accent">Link</span></h1>

            <div className="w-full max-w-md bg-surface p-6 rounded-2xl shadow-md">

                <h3 className="text-2xl font-semibold mb-4 text-center">
                    Login
                </h3>

                <form onSubmit={handleFormSubmit} className="flex flex-col w-full max-w-md gap-4">

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

                    <div className="flex w-full justify-end text-sm text-subtext">
                        <NavLink to={'/'}
                            className="text-accent cursor-pointer text-end"
                        >
                            Forgot Password?
                        </NavLink>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className={`w-full btn btn-primary mt-4 flex items-center justify-center gap-2
                            ${isLoggingIn ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                    >
                        {isLoggingIn ? (
                            <>
                                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <div className="text-center text-sm text-subtext">
                        Don't have an account?&nbsp;
                        <NavLink to={"/register"} className="text-accent cursor-pointer">Create one</NavLink>
                    </div>
                </form>

            </div>
        </div>
    );
}
