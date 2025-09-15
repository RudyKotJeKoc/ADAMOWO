-- Radio Adamowo Database Schema
-- MySQL/MariaDB compatible

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS radio_adamowo 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE radio_adamowo;

-- Comments table for calendar functionality
CREATE TABLE IF NOT EXISTS calendar_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_date DATE NOT NULL,
    name VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_date (comment_date),
    INDEX idx_created (created_at),
    INDEX idx_ip (ip_address),
    
    -- Constraints
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 2 AND CHAR_LENGTH(name) <= 50),
    CONSTRAINT chk_text_length CHECK (CHAR_LENGTH(text) >= 5 AND CHAR_LENGTH(text) <= 1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create user for the application (run as root)
-- CREATE USER IF NOT EXISTS 'radio_adamowo'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON radio_adamowo.* TO 'radio_adamowo'@'localhost';
-- FLUSH PRIVILEGES;

-- Sample data (optional)
-- INSERT INTO calendar_comments (comment_date, name, text, ip_address) VALUES
-- ('2025-01-01', 'TestUser', 'To jest przykładowy komentarz dla testów.', '127.0.0.1'),
-- ('2025-01-01', 'AnotherUser', 'Kolejny komentarz testowy.', '127.0.0.1');