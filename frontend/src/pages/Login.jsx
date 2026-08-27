import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const emailValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const canLogin =
        emailValid &&
        password.length > 0;

    async function handleSubmit(e) {

        e.preventDefault();

        if (!canLogin) return;

        setError("");
        setLoading(true);

        try {

            await login(email, password);

            navigate("/projects");

        } catch (error) {

            setError(
                "Email or password is incorrect."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="logo">
                    TrackLite
                </div>

                <h1>Log in to TrackLite</h1>

                <p>
                    Fast, simple project tracking
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        placeholder="you@company.com"
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <label>Password</label>

                    <div className="password-input">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            placeholder="Password"
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>

                    </div>

                    <a href="#">
                        Forgot password?
                    </a>

                    <button
                        className="primary-button"
                        disabled={!canLogin || loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Log in"}
                    </button>

                </form>

                <div className="divider">
                    or
                </div>

                <button
                    className="oauth-button"
                    disabled
                >
                    Continue with Google
                    {" "}
                    (later phase)
                </button>

                <p>
                    New to TrackLite?
                    {" "}
                    <a href="#">Sign up</a>
                </p>

            </div>

        </div>
    );
}
