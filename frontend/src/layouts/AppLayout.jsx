import {
    Link,
    Outlet
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AppLayout() {

    const { user, logout } = useAuth();

    return (
        <div className="app">

            <aside className="sidebar">

                <div className="organization">
                    <strong>Acme Inc</strong>
                </div>

                <nav>

                    <Link to="/">
                        Inbox
                    </Link>

                    <Link to="/">
                        My Issues
                    </Link>

                    <Link to="/members">
                        Members
                    </Link>

                    <Link to="/">
                        Settings
                    </Link>

                </nav>

                <div className="projects-title">
                    PROJECTS
                </div>

                <div className="projects">

                    <Link to="/projects/1/issues">
                        <span className="project-color blue"/>
                        Website Redesign
                    </Link>

                    <Link to="/projects/2/issues">
                        <span className="project-color green"/>
                        Mobile App
                    </Link>

                    <Link to="/projects/3/issues">
                        <span className="project-color orange"/>
                        API Platform
                    </Link>

                </div>

                <div className="current-user">

                    <div>
                        {user?.name}
                    </div>

                    <small>
                        Owner
                    </small>

                    <button onClick={logout}>
                        Log out
                    </button>

                </div>

            </aside>

            <main className="main">

                <header className="topbar">

                    <div>
                        Acme Inc
                        {" / "}
                        Website Redesign
                    </div>

                </header>

                <section className="content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}
