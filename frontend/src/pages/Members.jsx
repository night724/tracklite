import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

export default function Members() {
    const [members, setMembers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("Member");
    const [loading, setLoading] = useState(true);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState("");
    const [inviteError, setInviteError] = useState("");

    useEffect(() => {
        loadMembers();
        loadInvites();
    }, []);
    async function loadMembers() {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/members");
            setMembers(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.members || []
            );
        } catch (err) {
            console.error("LOAD MEMBERS ERROR:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load members"
            );
        } finally {
            setLoading(false);
        }
    }
    async function loadInvites() {
        try {
            const response = await api.get("/members/invites");
            setInvites(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.invites || []
            );
        } catch (err) {
            console.error("LOAD INVITES ERROR:", err);
            setInvites([]);
        }
    }

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const name =
                member.name?.toLowerCase() || "";
            const email =
                member.email?.toLowerCase() || "";
            const searchText =
                search.toLowerCase().trim();
            const matchesSearch =
                name.includes(searchText) ||
                email.includes(searchText);
            const memberRole =
                member.role || "Member";
            const matchesRole =
                roleFilter === "All" ||
                memberRole === roleFilter;
            return (
                matchesSearch &&
                matchesRole
            );
        });
    }, [members, search, roleFilter]);
    async function handleInvite(event) {
        event.preventDefault();
        setInviteError("");
        if (!inviteEmail.trim()) {
            setInviteError("Email is required");
            return;
        }
        try {
            setInviteLoading(true);
            await api.post("/members/invite", {
                email: inviteEmail.trim(),
                role: inviteRole
            });
            setInviteEmail("");
            setInviteRole("Member");
            setShowInviteModal(false);
            await loadInvites();
        } catch (err) {
            console.error("INVITE MEMBER ERROR:", err);
            setInviteError(
                err.response?.data?.message ||
                "Failed to send invitation"
            );
        } finally {
            setInviteLoading(false);
        }
    }

    async function handleResendInvite(inviteId) {
        try {
            await api.post(
                `/members/invites/${inviteId}/resend`
            );
            await loadInvites();
        } catch (err) {
            console.error(
                "RESEND INVITE ERROR:",
                err
            );
            alert(
                err.response?.data?.message ||
                "Failed to resend invitation"
            );
        }
    }

    async function handleRevokeInvite(inviteId) {
        const confirmed =
            window.confirm(
                "Are you sure you want to revoke this invitation?"
            );
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(
                `/members/invites/${inviteId}`
            );
            await loadInvites();
        } catch (err) {
            console.error(
                "REVOKE INVITE ERROR:",
                err
            );
            alert(
                err.response?.data?.message ||
                "Failed to revoke invitation"
            );
        }
    }
    return (
        <div className="page">
            {/* HEADER */}
            <div className="members-header">
                <div>
                    <div className="breadcrumb">
                        Acme Inc
                        <span>/</span>
                        <strong>Members</strong>
                    </div>
                    <h1>
                        Members
                    </h1>
                    <p className="members-subtitle">
                        {members.length} members
                        <span> · </span>
                        {invites.length} pending invites
                    </p>
                </div>
                <button
                    className="primary-button invite-button"
                    onClick={() =>
                        setShowInviteModal(true)
                    }
                >
                    + Invite member
                </button>
            </div>
            {/* ERROR */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {/* SEARCH */}
            <div className="members-toolbar">
                <input
                    type="text"
                    placeholder="Search members..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    className="member-search"
                />
                <select
                    value={roleFilter}
                    onChange={(event) =>
                        setRoleFilter(event.target.value)
                    }
                    className="role-filter"
                >
                    <option value="All">
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
            {/* MEMBERS TABLE */}
            <section className="members-card">
                <div className="members-table-header">
                    <div>
                        NAME
                    </div>
                    <div>
                        EMAIL
                    </div>
                    <div>
                        ROLE
                    </div>
                    <div>
                        JOINED
                    </div>
                </div>
                {loading ? (
                    <div className="members-empty">
                        Loading members...
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="members-empty">
                        No members found.
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <MemberRow
                            key={member.id}
                            member={member}
                        />
                    ))
                )}
            </section>
            {/* PENDING INVITES */}
            <section className="pending-section">
                <h2>
                    Pending invites
                </h2>
                {invites.length === 0 ? (
                    <div className="empty-invites">
                        No pending invitations.
                    </div>
                ) : (
                    invites.map((invite) => (
                        <InviteRow
                            key={invite.id}
                            invite={invite}
                            onResend={handleResendInvite}
                            onRevoke={handleRevokeInvite}
                        />
                    ))
                )}
            </section>
            {/* INVITE MODAL */}
            {showInviteModal && (
                <div
                    className="modal-backdrop"
                    onClick={() =>
                        setShowInviteModal(false)
                    }
                >
                    <div
                        className="invite-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <h2>
                            Invite member
                        </h2>
                        <p>
                            Send an invitation to join Acme Inc.
                        </p>
                        <form
                            onSubmit={handleInvite}
                        >
                            <label>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={inviteEmail}
                                onChange={(event) =>
                                    setInviteEmail(
                                        event.target.value
                                    )
                                }
                                autoFocus
                            />
                            <label>
                                Role
                            </label>
                            <select
                                value={inviteRole}
                                onChange={(event) =>
                                    setInviteRole(
                                        event.target.value
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
                            {inviteError && (
                                <div className="invite-error">
                                    {inviteError}
                                </div>
                            )}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowInviteModal(false)
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={inviteLoading}
                                >
                                    {inviteLoading
                                        ? "Sending..."
                                        : "Send invite"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function MemberRow({ member }) {
    const name =
        member.name || "Unknown";
    const email =
        member.email || "";
    const role =
        member.role || "Member";
    const joined =
        formatDate(member.joined_at || member.created_at);
    const initials =
        getInitials(name);
    return (
        <div className="member-row">
            <div className="member-name-cell">
                <div className="avatar">
                    {initials}
                </div>
                <strong>
                    {name}
                </strong>
            </div>
            <div className="member-email">
                {email}
            </div>
            <div>
                <RoleBadge role={role} />
            </div>
            <div className="member-joined">
                {joined}
            </div>
        </div>
    );
}

function RoleBadge({ role }) {
    return (
        <span
            className={`role-badge role-${role.toLowerCase()}`}
        >
            <span className="role-dot" />
            {role}
        </span>
    );
}

function InviteRow({
    invite,
    onResend,
    onRevoke
}) {
    const email =
        invite.email || "";
    const role =
        invite.role || "Member";
    const expires =
        invite.expires_at
            ? formatExpiry(invite.expires_at)
            : "";
    return (
        <div className="invite-row">
            <div className="invite-avatar">
                @
            </div>
            <div className="invite-email">
                {email}
            </div>
            <div className="invite-description">
                Invited as {role}
                {expires && (
                    <>
                        {" · "}
                        {expires}
                    </>
                )}
            </div>
            <button
                className="text-button"
                onClick={() =>
                    onResend(invite.id)
                }
            >
                Resend
            </button>
            <button
                className="revoke-button"
                onClick={() =>
                    onRevoke(invite.id)
                }
            >
                Revoke
            </button>
        </div>
    );
}
function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}
function formatDate(date) {
    if (!date) {
        return "-";
    }
    const parsed =
        new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return "-";
    }
    return parsed.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }
    );
}
function formatExpiry(date) {
    const parsed =
        new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return "";
    }
    const now =
        new Date();
    const difference =
        parsed.getTime() -
        now.getTime();
    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    if (days <= 0) {
        return "expired";
    }
    if (days === 1) {
        return "expires in 1 day";
    }
    return `expires in ${days} days`;
}