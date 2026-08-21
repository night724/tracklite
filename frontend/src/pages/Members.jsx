import {
    useEffect,
    useState
} from "react";

import api from "../api/client";

export default function Members() {

    const [members, setMembers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("");

    const [showInvite, setShowInvite] =
        useState(false);

    const [inviteEmail, setInviteEmail] =
        useState("");

    const [inviteRole, setInviteRole] =
        useState("Member");

    useEffect(() => {

        loadMembers();

    }, []);

    async function loadMembers() {

        const response =
            await api.get("/members");

        setMembers(response.data);
    }

    async function inviteMember(e) {

        e.preventDefault();

        await api.post(
            "/members/invite",
            {
                email: inviteEmail,
                role: inviteRole
            }
        );

        setInviteEmail("");
        setShowInvite(false);

        loadMembers();
    }

    const filtered =
        members.filter(member => {

            const matchesSearch =
                member.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                member.email
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesRole =
                !role ||
                member.role === role;

            return (
                matchesSearch &&
                matchesRole
            );
        });

    return (
        <div>

            <div className="page-header">

                <div>

                    <div className="breadcrumb">
                        Acme Inc / Members
                    </div>

                    <h1>
                        Members
                    </h1>

                    <p>
                        {members.length} members
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        setShowInvite(true)
                    }
                >
                    Invite member
                </button>

            </div>

            <div className="member-toolbar">

                <input
                    placeholder="Search members…"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={role}
                    onChange={(e) =>
                        setRole(e.target.value)
                    }
                >
                    <option value="">
                        Role: All
                    </option>

                    <option value="Owner">
                        Owner
                    </option>

                    <option value="Admin">
                        Admin
                    </option>

                    <option value="Member">
                        Member
                    </option>
                </select>

            </div>

            <table className="members-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                    </tr>
                </thead>

                <tbody>

                    {filtered.map(member => (

                        <tr key={member.id}>

                            <td>
                                {member.name}
                            </td>

                            <td>
                                {member.email}
                            </td>

                            <td>
                                <span className="role-chip">
                                    {member.role}
                                </span>
                            </td>

                            <td>
                                {new Date(
                                    member.joined_at
                                ).toLocaleDateString()}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {showInvite && (

                <div className="modal-backdrop">

                    <div className="modal">

                        <h2>
                            Invite member
                        </h2>

                        <form
                            onSubmit={inviteMember}
                        >

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) =>
                                    setInviteEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <label>
                                Role
                            </label>

                            <select
                                value={inviteRole}
                                onChange={(e) =>
                                    setInviteRole(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="Member">
                                    Member
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>
                            </select>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowInvite(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="primary-button"
                                >
                                    Send invite
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}
