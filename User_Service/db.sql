CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email, password)
SELECT
    'Test User',
    'test@example.com',
    '$2a$10$DCn6D5T2vL6Iy9ewNk.gI.YUc8Vljcg9UIXI/mIGrapHbEotEXTyW'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'test@example.com'
);
