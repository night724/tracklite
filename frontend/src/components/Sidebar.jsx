import {
    NavLink
} from "react-router-dom";

export default function Sidebar(){
    return (
        <aside className="sidebar">
            <div className="logo">
                🟣 TrackLite
            </div>
            <nav className="sidebar-menu">
                <NavLink
                    to="/projects"
                    className="sidebar-link"
                >
                    📁 Projects
                </NavLink>

                <NavLink
                    to="/inbox"
                    className="sidebar-link"
                >
                    📥 Inbox
                </NavLink>

                <NavLink
                    to="/my-issues"
                    className="sidebar-link"
                >
                    ✅ My Issues
                </NavLink>
                <NavLink
                    to="/members"
                    className="sidebar-link"
                >
                    👥 Members
                </NavLink>

                <NavLink
                    to="/settings"
                    className="sidebar-link"
                >
                    ⚙ Settings
                </NavLink>
            </nav>

            <div className="sidebar-bottom">
                <div className="workspace">
                    <small> Workspace </small>
                    <strong> Acme Inc </strong>
                </div>
            </div>
        </aside>
    );
}