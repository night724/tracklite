import { useEffect, useState } from "react";
import api from "../api/client";

export default function Settings() {
    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const response = await api.get("/auth/me");

            setUser(response.data);

            setName(response.data.name || "");
            setEmail(response.data.email || "");
        } catch (err) {
            console.error(
                "LOAD PROFILE ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const response = await api.patch(
                "/auth/profile",
                {
                    name,
                    email
                }
            );

            setUser(response.data);

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error(
                "UPDATE PROFILE ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    }

    async function changePassword(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword || !newPassword) {
            setError("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "New password must be at least 8 characters."
            );
            return;
        }

        setSaving(true);

        try {
            await api.patch(
                "/auth/password",
                {
                    currentPassword,
                    newPassword
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setMessage(
                "Password changed successfully."
            );
        } catch (err) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h2>Loading settings...</h2>
            </div>
        );
    }

    return (
        <div className="page">

            <div className="page-header">

                <div>

                    <div className="breadcrumb">
                        Acme Inc / Settings
                    </div>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your TrackLite account
                    </p>

                </div>

            </div>


            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            <section className="panel">

                <h2>
                    Profile
                </h2>

                <p>
                    Update your account information.
                </p>


                <form onSubmit={updateProfile}>

                    <div className="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save changes"}
                    </button>

                </form>

            </section>


            <section className="panel">

                <h2>
                    Change password
                </h2>

                <p>
                    Update your account password.
                </p>


                <form onSubmit={changePassword}>

                    <div className="form-group">

                        <label>
                            Current password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            New password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Confirm new password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Changing..."
                            : "Change password"}
                    </button>

                </form>

            </section>


            <section className="panel">

                <h2>
                    Account
                </h2>

                <div className="detail-row">

                    <strong>
                        User ID
                    </strong>

                    <span>
                        {user?.id || "-"}
                    </span>

                </div>


                <div className="detail-row">

                    <strong>
                        Email
                    </strong>

                    <span>
                        {user?.email || email}
                    </span>

                </div>

            </section>

        </div>
    );
}