import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "../auth.css";
import { MyContext } from "../../../App";

function Login() {
    const { setEncryptedItem } = useContext(MyContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const CACHE_DURATION = 20 * 60 * 1000;
    const LOGIN_CACHE_EXPIRATION = "loginCacheExpiration";
    const USER_CACHE_KEY = "userCache";

    const isCacheValid = (expirationKey) => {
        const expiration = localStorage.getItem(expirationKey);
        return expiration && new Date().getTime() < Number(expiration);
    };

    useEffect(() => {
        if (localStorage.getItem("rememberMe") === "true" && isCacheValid(LOGIN_CACHE_EXPIRATION)) {
            const cachedUser = JSON.parse(localStorage.getItem(USER_CACHE_KEY));
            if (cachedUser) {
                setEmail(cachedUser.email || "");
                setPassword(cachedUser.password || "");
                setRememberMe(true);
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const cleanEmail = DOMPurify.sanitize(email.trim());
        const cleanPassword = DOMPurify.sanitize(password.trim());

        if (!cleanEmail || !cleanPassword) {
            setError("Email and password are required.");
            return;
        }

        try {
            const response = await fetch("https://dash.watchizereg.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Code": "NbmFylY0vcwnhxUrm1udMgcX1MtPYb4QWXy1EKqVenm6uskufcXKeHh5W4TM5Iv0",
                },
                body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`Welcome, ${data.first_name} ${data.last_name}!`);

                localStorage.setItem("user_id", data.id);
                localStorage.setItem("first_name", data.first_name);
                localStorage.setItem("last_name", data.last_name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("phone_number", data.phone_number);
                localStorage.setItem(
                    "image",
                    data.image ? `https://dash.watchizereg.com/Uploads_Images/Category/${data.image}` : null
                );
                setEncryptedItem("token", data.token);

                const userData = {
                    email: cleanEmail,
                    password: cleanPassword,
                };

                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
                    localStorage.setItem(LOGIN_CACHE_EXPIRATION, new Date().getTime() + CACHE_DURATION);
                } else {
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem(USER_CACHE_KEY);
                    localStorage.removeItem(LOGIN_CACHE_EXPIRATION);
                }

                navigate("/");
                window.location.reload();
            } else {
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please check your connection and try again.");
        }
    };

    return (
        <div className="login" style={{ height: "100%", width: "100vw", position: "fixed", top: 0, left: 0 }}>
            <div className="container" style={{ height: "100%" }}>
                <div className="row justify-content-center px-md-5 px-4" style={{ height: "100%" }}>
                    <div className="col-md-6 col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "100%" }}>
                        <div className="login-form col-12 p-5 bg-light rounded-3">
                            <h2 className="text-center">Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn position-absolute top-50 end-0 translate-middle-y"
                                            style={{ padding: "0 10px", border: "none", background: "transparent" }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "👁️" : "🙈"}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="remember">Remember me</label>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Submit</button>
                                <div className="mt-3 text-center">
                                    <span>Don't have an account? </span>
                                    <Link to="/register">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
