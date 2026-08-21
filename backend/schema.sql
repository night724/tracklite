CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS issue_labels CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL
        REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    project_key VARCHAR(20) NOT NULL,
    description TEXT,
    color VARCHAR(30) DEFAULT '#6366f1',
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, user_id)
);

CREATE TABLE organization_members (
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL
        CHECK(role IN ('Owner', 'Admin', 'Member')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(organization_id, user_id)
);

CREATE TABLE invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK(role IN ('Admin', 'Member')),
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    issue_key VARCHAR(30) NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'Backlog'
        CHECK(status IN (
            'Backlog',
            'Todo',
            'In Progress',
            'In Review',
            'Done',
            'Canceled'
        )),

    priority VARCHAR(30) NOT NULL DEFAULT 'Medium'
        CHECK(priority IN (
            'Urgent',
            'High',
            'Medium',
            'Low'
        )),

    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,

    due_date DATE,

    created_by UUID REFERENCES users(id),

    deleted_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    name VARCHAR(50) NOT NULL,

    color VARCHAR(30) DEFAULT '#64748b'
);

CREATE TABLE issue_labels (
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,

    PRIMARY KEY(issue_id, label_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,

    user_id UUID REFERENCES users(id),

    body TEXT NOT NULL,

    edited BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,

    user_id UUID REFERENCES users(id),

    activity_type VARCHAR(30) NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issues_project
ON issues(project_id);

CREATE INDEX idx_issues_status
ON issues(status);

CREATE INDEX idx_issues_assignee
ON issues(assignee_id);

CREATE INDEX idx_issues_updated
ON issues(updated_at DESC);
