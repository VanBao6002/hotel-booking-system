INSERT INTO roles (name) VALUES
('USER'),
('ADMIN');

INSERT INTO genders (name) VALUES
('MALE'),
('FEMALE'),
('OTHER');

INSERT INTO countries (code, name) VALUES
('US', 'United States'),
('VN', 'Vietnam'),
('JP', 'Japan');

INSERT INTO users (
	user_name,
	email,
	password_hash,
	role_id,
	full_name,
	date_of_birth,
	gender_id,
	phone_number,
	current_address,
	country_id,
	is_active,
	failed_login_attempts,
	locked_until,
	last_login_at
) VALUES
(
	'john_doe',
	'john.doe@example.com',
	'$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6',
	1,
	'John Doe',
	'1995-04-10',
	1,
	'+1234567890',
	'123 Main St, New York',
	1,
	TRUE,
	0,
	NULL,
	NULL
),
(
	'jane_smith',
	'jane.smith@example.com',
	'$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6',
	1,
	'Jane Smith',
	'1997-08-21',
	2,
	'+1234567891',
	'456 Ocean Ave, Miami',
	1,
	TRUE,
	0,
	NULL,
	NULL
),
(
	'admin_hotel',
	'admin@hotel.com',
	'$2a$10$X5wFWHJp5.FzpKmFTLLhfOhOLvvlPY7.vQI8b4V0B4GXxqqXDR3K6',
	2,
	'Admin User',
	'1990-01-01',
	3,
	'+1234567892',
	'789 Admin Blvd',
	1,
	TRUE,
	0,
	NULL,
	NULL
);