CREATE TABLE university (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    numstudent INT,
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    university INT,
    rso TEXT[],
    FOREIGN KEY (university) REFERENCES university(id)
);

CREATE TABLE rso (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    description TEXT,
    category VARCHAR(100)
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    event_time TIMESTAMP,
    location VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    university VARCHAR(255),
    rso VARCHAR(255),
    rating INTEGER,  
    comments_count INTEGER DEFAULT 0  
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT[],
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);