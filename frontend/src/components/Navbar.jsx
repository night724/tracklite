import {
    useAuth
} from "../context/AuthContext";

export default function Navbar(){
    const { user } = useAuth();
    return (
        <header className="navbar">
            <div>
                <h3> TrackLite </h3>
            </div>
            <div className="navbar-user">
                <div className="avatar">
                    { user?.name ?.charAt(0) .toUpperCase() || "U" }
                </div>
                <div>
                    <strong>
                        { user?.name || "User" }
                    </strong>
                    <small>
                        { user?.email }
                    </small>
                </div>
            </div>
        </header>
    );
}