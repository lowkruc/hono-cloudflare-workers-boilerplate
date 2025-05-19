-- Seed data for testing
INSERT INTO users (id, email, name, created_at, updated_at)
VALUES 
    ('1', 'john@example.com', 'John Doe', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
    ('2', 'jane@example.com', 'Jane Smith', '2023-01-02T00:00:00.000Z', '2023-01-02T00:00:00.000Z'),
    ('3', 'bob@example.com', 'Bob Johnson', '2023-01-03T00:00:00.000Z', '2023-01-03T00:00:00.000Z')
ON CONFLICT(id) DO NOTHING; 