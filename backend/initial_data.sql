-- ============================================
-- Smart Meeting Room System - Initial Data Setup
-- ============================================

-- Create default tenant if not exists
INSERT INTO tenants (id, name, created_at)
VALUES (1, 'Default Organization', NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Create admin user
-- Password: password123 (BCrypt hash)
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status)
VALUES (
    1,
    1,
    'admin@company.com',
    '$2a$12$LkTWF/QmN5e5r/RNFPGSquiUj3tD5dLV4ILZnPjswG4V3YDl8pZHW',
    'Admin',
    'User',
    'admin',
    'active'
) ON DUPLICATE KEY UPDATE email = email;

-- Create regular user for testing
-- Password: password123
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status)
VALUES (
    2,
    1,
    'john.doe@company.com',
    '$2a$12$a53R8kjBNBz8cL2JcOZrie5eBSsxOKhIdvYQytOtngnLMkWNtOUiC',
    'John',
    'Doe',
    'user',
    'active'
) ON DUPLICATE KEY UPDATE email = email;

-- Create sample rooms
INSERT INTO rooms (tenant_id, name, description, capacity, floor, building, is_active) VALUES
(1, 'Innovation Hub', 'Spacious room for brainstorming and creative sessions', 12, 3, 'Main Building', true),
(1, 'Creative Studio', 'Perfect for design reviews and workshops', 8, 2, 'Main Building', true),
(1, 'Executive Boardroom', 'Premium boardroom with video conferencing', 20, 5, 'Main Building', true),
(1, 'Focus Pod', 'Small room for focused work or 1-on-1s', 4, 2, 'Main Building', true),
(1, 'Training Center', 'Large room equipped for training sessions', 25, 4, 'Main Building', true),
(1, 'Collaboration Space', 'Open space for team collaboration', 10, 3, 'Main Building', true)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Note: You need to generate actual BCrypt hashes for passwords
-- You can use the BCryptGenerator.java class in your backend to generate these
-- Or use online BCrypt generators with cost factor 10

COMMIT;
