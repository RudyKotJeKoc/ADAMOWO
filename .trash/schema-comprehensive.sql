-- Radio Adamowo - Enhanced Database Schema
-- MySQL/MariaDB compatible with comprehensive security and performance optimizations

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS radio_adamowo 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE radio_adamowo;

-- Comments table for calendar functionality
CREATE TABLE IF NOT EXISTS calendar_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_date DATE NOT NULL COMMENT 'Date the comment refers to',
    name VARCHAR(50) NOT NULL COMMENT 'Commenter name (sanitized)',
    text TEXT NOT NULL COMMENT 'Comment content (sanitized)',
    ip_address VARCHAR(64) NOT NULL COMMENT 'Hashed IP address for rate limiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When comment was created',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_approved TINYINT(1) DEFAULT 1 COMMENT 'Moderation status',
    is_flagged TINYINT(1) DEFAULT 0 COMMENT 'Flagged for review',
    
    -- Performance indexes
    INDEX idx_date_approved (comment_date, is_approved),
    INDEX idx_created_approved (created_at, is_approved),
    INDEX idx_ip_date (ip_address, comment_date),
    INDEX idx_moderation (is_approved, is_flagged),
    
    -- Full-text search index for content search
    FULLTEXT INDEX ft_content (name, text),
    
    -- Constraints for data validation
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 2 AND CHAR_LENGTH(name) <= 50),
    CONSTRAINT chk_text_length CHECK (CHAR_LENGTH(text) >= 5 AND CHAR_LENGTH(text) <= 1000),
    CONSTRAINT chk_date_valid CHECK (comment_date >= '2020-01-01' AND comment_date <= DATE_ADD(CURDATE(), INTERVAL 1 YEAR))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User comments for calendar dates with moderation support';

-- Rate limiting table for API security
CREATE TABLE IF NOT EXISTS rate_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL COMMENT 'API action being rate limited',
    client_id VARCHAR(255) NOT NULL COMMENT 'Hashed client identifier',
    ip_address VARCHAR(45) NULL COMMENT 'Original IP for analytics',
    user_agent_hash VARCHAR(64) NULL COMMENT 'Hashed user agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Performance indexes for rate limiting lookups
    INDEX idx_action_client_time (action, client_id, created_at),
    INDEX idx_cleanup (created_at),
    INDEX idx_action_time (action, created_at),
    INDEX idx_ip_time (ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Rate limiting tracking for API endpoints';

-- User sessions table for CSRF and authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    csrf_token VARCHAR(64) NOT NULL,
    csrf_token_expires TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 HOUR),
    is_active TINYINT(1) DEFAULT 1,
    
    -- Performance and cleanup indexes
    INDEX idx_token_expires (csrf_token, csrf_token_expires),
    INDEX idx_cleanup_expires (expires_at, is_active),
    INDEX idx_ip_active (ip_address, is_active),
    INDEX idx_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Session management with CSRF protection';

-- Analytics table for tracking application usage
CREATE TABLE IF NOT EXISTS usage_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL COMMENT 'Type of event (page_view, stream_start, comment_add)',
    event_data JSON NULL COMMENT 'Additional event data',
    client_hash VARCHAR(64) NOT NULL COMMENT 'Anonymous client identifier',
    ip_country VARCHAR(2) NULL COMMENT 'Country code from IP geolocation',
    user_agent_hash VARCHAR(64) NOT NULL,
    referrer_hash VARCHAR(64) NULL COMMENT 'Hashed referrer for privacy',
    session_duration INT NULL COMMENT 'Session duration in seconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Analytics indexes
    INDEX idx_event_type_date (event_type, created_at),
    INDEX idx_client_events (client_hash, event_type),
    INDEX idx_country_date (ip_country, created_at),
    INDEX idx_date_partitioning (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Privacy-conscious usage analytics'
PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p_past VALUES LESS THAN (TO_DAYS('2025-01-01')),
    PARTITION p_2025_q1 VALUES LESS THAN (TO_DAYS('2025-04-01')),
    PARTITION p_2025_q2 VALUES LESS THAN (TO_DAYS('2025-07-01')),
    PARTITION p_2025_q3 VALUES LESS THAN (TO_DAYS('2025-10-01')),
    PARTITION p_2025_q4 VALUES LESS THAN (TO_DAYS('2026-01-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Content moderation log
CREATE TABLE IF NOT EXISTS moderation_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    target_table VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL COMMENT 'approve, reject, flag, unflag',
    reason TEXT NULL,
    moderator_ip VARCHAR(45) NOT NULL,
    automated TINYINT(1) DEFAULT 0 COMMENT 'Was this an automated action',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_target (target_table, target_id),
    INDEX idx_action_date (action, created_at),
    INDEX idx_moderator_date (moderator_ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit trail for content moderation actions';

-- Application configuration table
CREATE TABLE IF NOT EXISTS app_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value JSON NOT NULL,
    config_type ENUM('string', 'number', 'boolean', 'array', 'object') NOT NULL DEFAULT 'string',
    description TEXT NULL,
    is_public TINYINT(1) DEFAULT 0 COMMENT 'Can this config be exposed to frontend',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_public (is_public),
    INDEX idx_type (config_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Application configuration storage';

-- Create application user (run as root)
-- CREATE USER IF NOT EXISTS 'radio_adamowo'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON radio_adamowo.* TO 'radio_adamowo'@'localhost';
-- GRANT CREATE TEMPORARY TABLES ON radio_adamowo.* TO 'radio_adamowo'@'localhost';
-- FLUSH PRIVILEGES;

-- Insert default configuration
INSERT IGNORE INTO app_config (config_key, config_value, config_type, description, is_public) VALUES
('rate_limit_comments', '10', 'number', 'Comments per minute limit', 0),
('rate_limit_tokens', '20', 'number', 'CSRF tokens per minute limit', 0),
('max_comment_length', '1000', 'number', 'Maximum comment length in characters', 1),
('min_comment_length', '5', 'number', 'Minimum comment length in characters', 1),
('max_name_length', '50', 'number', 'Maximum name length in characters', 1),
('min_name_length', '2', 'number', 'Minimum name length in characters', 1),
('csrf_token_lifetime', '3600', 'number', 'CSRF token lifetime in seconds', 0),
('session_lifetime', '3600', 'number', 'Session lifetime in seconds', 0),
('enable_moderation', 'true', 'boolean', 'Enable comment moderation', 0),
('stream_urls', '["https://stream.radioadamowo.pl/live.m3u8", "https://backup.radioadamowo.pl/stream"]', 'array', 'Available stream URLs', 1),
('app_version', '"2.0.0"', 'string', 'Current application version', 1);

-- Sample data for development (optional)
INSERT IGNORE INTO calendar_comments (comment_date, name, text, ip_address) VALUES
('2025-01-01', 'Test User', 'To jest przykładowy komentarz dla testów systemu.', SHA2('127.0.0.1' + CURDATE(), 256)),
('2025-01-01', 'Another User', 'Kolejny komentarz testowy z dłuższą treścią do sprawdzenia formatowania i wyświetlania.', SHA2('127.0.0.1' + CURDATE(), 256)),
('2025-01-02', 'Demo User', 'Komentarz na inny dzień do testowania funkcji kalendarza.', SHA2('127.0.0.1' + CURDATE(), 256));

-- Create views for common queries
CREATE OR REPLACE VIEW recent_comments AS
SELECT 
    c.id,
    c.comment_date,
    c.name,
    c.text,
    c.created_at,
    c.is_approved,
    CASE WHEN c.created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 1 ELSE 0 END as is_very_recent
FROM calendar_comments c
WHERE c.is_approved = 1
    AND c.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY c.created_at DESC;

CREATE OR REPLACE VIEW daily_comment_stats AS
SELECT 
    comment_date,
    COUNT(*) as total_comments,
    COUNT(CASE WHEN is_approved = 1 THEN 1 END) as approved_comments,
    COUNT(CASE WHEN is_flagged = 1 THEN 1 END) as flagged_comments,
    MIN(created_at) as first_comment,
    MAX(created_at) as last_comment
FROM calendar_comments
GROUP BY comment_date
ORDER BY comment_date DESC;

-- Cleanup procedures for maintenance
DELIMITER //

CREATE OR REPLACE PROCEDURE CleanupOldData()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cleanup_date TIMESTAMP;
    
    -- Clean old rate limits (older than 24 hours)
    DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
    
    -- Clean expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = 0;
    
    -- Archive old analytics (move to archive table or delete after 90 days)
    DELETE FROM usage_analytics WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    -- Clean old moderation logs (keep for 1 year)
    DELETE FROM moderation_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Update statistics
    ANALYZE TABLE calendar_comments, rate_limits, user_sessions, usage_analytics;
    
    SELECT 'Cleanup completed successfully' as message;
END //

CREATE OR REPLACE PROCEDURE GetDailyStats(IN target_date DATE)
BEGIN
    SELECT 
        target_date as date,
        COALESCE(c.total_comments, 0) as comments,
        COALESCE(c.approved_comments, 0) as approved,
        COALESCE(c.flagged_comments, 0) as flagged,
        COALESCE(a.page_views, 0) as page_views,
        COALESCE(a.stream_starts, 0) as stream_starts
    FROM 
        (SELECT target_date as comment_date) d
    LEFT JOIN daily_comment_stats c ON c.comment_date = d.comment_date
    LEFT JOIN (
        SELECT 
            DATE(created_at) as date,
            COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
            COUNT(CASE WHEN event_type = 'stream_start' THEN 1 END) as stream_starts
        FROM usage_analytics 
        WHERE DATE(created_at) = target_date
        GROUP BY DATE(created_at)
    ) a ON a.date = target_date;
END //

DELIMITER ;

-- Create event for automatic cleanup (requires EVENT scheduler to be enabled)
-- SET GLOBAL event_scheduler = ON;

-- CREATE EVENT IF NOT EXISTS daily_cleanup
-- ON SCHEDULE EVERY 1 DAY
-- STARTS '2025-01-01 02:00:00'
-- ON COMPLETION PRESERVE
-- DO CALL CleanupOldData();

-- Performance optimization hints
-- Consider adding these settings to my.cnf for better performance:
-- innodb_buffer_pool_size = 70% of available RAM
-- innodb_log_file_size = 256M
-- innodb_flush_log_at_trx_commit = 2
-- max_connections = 200
-- query_cache_size = 64M (if using MySQL < 8.0)