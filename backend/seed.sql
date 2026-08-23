INSERT INTO organizations(name)
VALUES ('Acme Inc');

INSERT INTO users(
    name,
    email,
    password_hash
)
VALUES
(
    'Priya Sharma',
    'priya@acme.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC7S3D6Wz0kKJ9Y6P2fK'
),
(
    'Mia Torres',
    'mia@studio.co',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC7S3D6Wz0kK'
),
(
    'Sam Ortiz',
    'sam@acme.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC7S3D6Wz0kK'
);
INSERT INTO notifications
(title,message)
VALUES
(
'Welcome to TrackLite',
'Your account was created successfully'
);
INSERT INTO projects(
    organization_id,
    name,
    project_key,
    description,
    color
)
SELECT
    id,
    'Website Redesign',
    'WEB',
    'Relaunch of the marketing site',
    '#6366f1'
FROM organizations
WHERE name = 'Acme Inc';

INSERT INTO organization_members(
    organization_id,
    user_id,
    role
)
SELECT
    o.id,
    u.id,
    CASE
        WHEN u.email = 'priya@acme.com'
            THEN 'Owner'
        WHEN u.email = 'dan@acme.com'
            THEN 'Admin'
        ELSE 'Member'
    END
FROM organizations o
CROSS JOIN users u
WHERE o.name = 'Acme Inc';

INSERT INTO project_members(
    project_id,
    user_id
)
SELECT
    p.id,
    u.id
FROM projects p
CROSS JOIN users u
WHERE p.project_key = 'WEB';

INSERT INTO issues(
    project_id,
    issue_key,
    title,
    description,
    status,
    priority,
    assignee_id,
    created_by,
    due_date
)
SELECT
    p.id,
    'WEB-41',
    'Hero section animation janky on Safari',
    'On Safari 19 the hero entrance animation drops to ~20 fps.',
    'In Progress',
    'Urgent',
    u.id,
    u.id,
    '2026-08-12'
FROM projects p
JOIN users u
ON u.email = 'dan@acme.com'
WHERE p.project_key = 'WEB';

INSERT INTO issues(
    project_id,
    issue_key,
    title,
    description,
    status,
    priority,
    assignee_id,
    created_by,
    due_date
)
SELECT
    p.id,
    'WEB-40',
    'Rebuild nav for mobile breakpoints',
    'Improve navigation behavior on mobile.',
    'In Progress',
    'High',
    u.id,
    u.id,
    '2026-08-14'
FROM projects p
JOIN users u
ON u.email = 'mia@studio.co'
WHERE p.project_key = 'WEB';

INSERT INTO issues(
    project_id,
    issue_key,
    title,
    description,
    status,
    priority,
    assignee_id,
    created_by,
    due_date
)
SELECT
    p.id,
    'WEB-38',
    'Pricing page copy review',
    'Review final pricing page copy.',
    'In Review',
    'Medium',
    u.id,
    u.id,
    NULL
FROM projects p
JOIN users u
ON u.email = 'sam@acme.com'
WHERE p.project_key = 'WEB';

INSERT INTO issues(
    project_id,
    issue_key,
    title,
    description,
    status,
    priority,
    created_by
)
SELECT
    p.id,
    'WEB-35',
    'Set up CDN caching for images',
    'Configure image caching.',
    'Done',
    'Medium',
    u.id
FROM projects p
JOIN users u
ON u.email = 'priya@acme.com'
WHERE p.project_key = 'WEB';
