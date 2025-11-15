-- Radio Adamowo - Extended Database Schema
-- Enhanced schema supporting all new features while maintaining backward compatibility

-- ============================================================================
-- EXTENDED TABLES FOR NEW FEATURES
-- ============================================================================

-- Enhanced user management system
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    email_verified TINYINT(1) DEFAULT 0,
    last_login TIMESTAMP NULL,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    
    CONSTRAINT chk_username_length CHECK (CHAR_LENGTH(username) >= 3),
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session management for enhanced authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    user_agent_hash VARCHAR(64),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_user_active (user_id, expires_at),
    INDEX idx_cleanup (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment reactions system
CREATE TABLE IF NOT EXISTS comment_reactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NULL,
    client_id VARCHAR(64) NOT NULL COMMENT 'For anonymous reactions',
    reaction_type ENUM('like', 'dislike', 'heart', 'angry', 'laugh') NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (comment_id) REFERENCES calendar_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_user_comment (comment_id, COALESCE(user_id, 0), client_id),
    INDEX idx_comment_type (comment_id, reaction_type),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment reports and moderation
CREATE TABLE IF NOT EXISTS comment_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    reporter_user_id INT NULL,
    client_id VARCHAR(64),
    reason TEXT NOT NULL,
    status ENUM('open', 'reviewing', 'resolved', 'dismissed') DEFAULT 'open',
    moderator_id INT NULL,
    moderator_notes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (comment_id) REFERENCES calendar_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_comment_status (comment_id, status),
    INDEX idx_status_created (status, created_at),
    INDEX idx_moderator (moderator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Podcast/Audio content management
CREATE TABLE IF NOT EXISTS podcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    audio_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    duration_seconds INT,
    file_size BIGINT,
    is_published TINYINT(1) DEFAULT 0,
    publish_date TIMESTAMP NULL,
    play_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    metadata JSON COMMENT 'Audio metadata, transcription, etc.',
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_published_date (is_published, publish_date),
    INDEX idx_category (category),
    INDEX idx_slug (slug),
    INDEX idx_play_count (play_count),
    FULLTEXT INDEX ft_content (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Playlist management system
CREATE TABLE IF NOT EXISTS playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('radio', 'podcast', 'ambient', 'special') NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    is_default TINYINT(1) DEFAULT 0,
    play_order ENUM('sequential', 'random', 'weighted') DEFAULT 'sequential',
    metadata JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type_active (type, is_active),
    INDEX idx_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Playlist tracks relationship
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    podcast_id INT NULL,
    external_url VARCHAR(500) NULL,
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(100),
    position INT NOT NULL,
    weight INT DEFAULT 1 COMMENT 'For weighted random play',
    is_active TINYINT(1) DEFAULT 1,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
    INDEX idx_playlist_position (playlist_id, position),
    INDEX idx_playlist_active (playlist_id, is_active),
    
    CONSTRAINT chk_source CHECK (
        (podcast_id IS NOT NULL AND external_url IS NULL) OR
        (podcast_id IS NULL AND external_url IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stream analytics and statistics
CREATE TABLE IF NOT EXISTS stream_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id INT NULL,
    event_type ENUM('play', 'pause', 'stop', 'skip', 'seek', 'volume', 'connect', 'disconnect') NOT NULL,
    track_info JSON,
    timestamp_seconds INT COMMENT 'Position in track when event occurred',
    ip_address VARCHAR(45),
    user_agent_hash VARCHAR(64),
    referrer VARCHAR(500),
    country_code VARCHAR(2),
    city VARCHAR(100),
    device_type ENUM('mobile', 'desktop', 'tablet', 'tv', 'other'),
    browser VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_session_time (session_id, created_at),
    INDEX idx_event_time (event_type, created_at),
    INDEX idx_user_time (user_id, created_at),
    INDEX idx_analytics_query (created_at, event_type, device_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification system
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL COMMENT 'NULL for broadcast notifications',
    type ENUM('info', 'warning', 'success', 'error', 'podcast', 'comment', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON COMMENT 'Additional notification data',
    is_read TINYINT(1) DEFAULT 0,
    is_email_sent TINYINT(1) DEFAULT 0,
    is_push_sent TINYINT(1) DEFAULT 0,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read, created_at),
    INDEX idx_type_created (type, created_at),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    endpoint VARCHAR(500) NOT NULL,
    p256dh_key VARCHAR(200) NOT NULL,
    auth_key VARCHAR(50) NOT NULL,
    user_agent VARCHAR(500),
    ip_address VARCHAR(45),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_endpoint (endpoint(255)),
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content management system
CREATE TABLE IF NOT EXISTS cms_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    type ENUM('page', 'post', 'guide', 'faq', 'news') NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    publish_date TIMESTAMP NULL,
    seo_title VARCHAR(200),
    seo_description TEXT,
    metadata JSON,
    view_count BIGINT DEFAULT 0,
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status_date (status, publish_date),
    INDEX idx_type_status (type, status),
    INDEX idx_slug (slug),
    FULLTEXT INDEX ft_content (title, content, excerpt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System settings and configuration
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    description TEXT,
    is_public TINYINT(1) DEFAULT 0 COMMENT 'Can be exposed to frontend',
    category VARCHAR(50) DEFAULT 'general',
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API usage tracking and analytics
CREATE TABLE IF NOT EXISTS api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45),
    user_agent_hash VARCHAR(64),
    request_size INT,
    response_size INT,
    response_time_ms INT,
    status_code INT NOT NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_endpoint_time (endpoint, created_at),
    INDEX idx_status_time (status_code, created_at),
    INDEX idx_user_time (user_id, created_at),
    INDEX idx_cleanup (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EXTEND EXISTING TABLES
-- ============================================================================

-- Add new columns to existing calendar_comments table
ALTER TABLE calendar_comments 
ADD COLUMN IF NOT EXISTS user_id INT NULL AFTER id,
ADD COLUMN IF NOT EXISTS parent_id INT NULL AFTER user_id COMMENT 'For comment replies',
ADD COLUMN IF NOT EXISTS edit_count INT DEFAULT 0 AFTER is_flagged,
ADD COLUMN IF NOT EXISTS last_edited TIMESTAMP NULL AFTER edit_count,
ADD COLUMN IF NOT EXISTS metadata JSON AFTER last_edited;

-- Add foreign keys and indexes to calendar_comments
ALTER TABLE calendar_comments 
ADD FOREIGN KEY IF NOT EXISTS fk_comment_user (user_id) REFERENCES users(id) ON DELETE SET NULL,
ADD FOREIGN KEY IF NOT EXISTS fk_comment_parent (parent_id) REFERENCES calendar_comments(id) ON DELETE CASCADE;

ALTER TABLE calendar_comments 
ADD INDEX IF NOT EXISTS idx_user (user_id),
ADD INDEX IF NOT EXISTS idx_parent (parent_id),
ADD INDEX IF NOT EXISTS idx_thread (parent_id, created_at);

-- ============================================================================
-- DEFAULT DATA AND INITIAL SETUP
-- ============================================================================

-- Insert default admin user (password: admin123 - change in production!)
INSERT IGNORE INTO users (id, username, email, password_hash, role, display_name, is_active, email_verified) VALUES 
(1, 'admin', 'admin@radioadamowo.pl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator', 1, 1);

-- Default playlists
INSERT IGNORE INTO playlists (id, name, description, type, is_active, is_default, created_by) VALUES 
(1, 'Radio Główny', 'Główna playlista radia Adamowo', 'radio', 1, 1, 1),
(2, 'Podcasty Analityczne', 'Audycje analityczne o manipulacji', 'podcast', 1, 0, 1),
(3, 'Ambient Atmosfery', 'Utwory ambient dla atmosfery', 'ambient', 1, 0, 1);

-- Default system settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, description, is_public, category) VALUES 
('app_name', '"Radio Adamowo"', 'Application name', 1, 'general'),
('app_version', '"2.1.0"', 'Application version', 1, 'general'),
('stream_url', '"https://stream.radioadamowo.pl/live"', 'Live stream URL', 1, 'stream'),
('max_comments_per_day', '10', 'Maximum comments per user per day', 0, 'moderation'),
('enable_notifications', 'true', 'Enable push notifications', 1, 'features'),
('maintenance_mode', 'false', 'Enable maintenance mode', 0, 'system');

-- ============================================================================
-- VIEWS FOR ENHANCED ANALYTICS
-- ============================================================================

-- View for comment analytics
CREATE OR REPLACE VIEW comment_analytics AS
SELECT 
    DATE(c.created_at) as date,
    COUNT(*) as total_comments,
    COUNT(CASE WHEN c.is_approved = 1 THEN 1 END) as approved_comments,
    COUNT(CASE WHEN c.is_flagged = 1 THEN 1 END) as flagged_comments,
    COUNT(DISTINCT c.ip_address) as unique_commenters,
    COALESCE(AVG(r.reaction_count), 0) as avg_reactions_per_comment
FROM calendar_comments c
LEFT JOIN (
    SELECT comment_id, COUNT(*) as reaction_count
    FROM comment_reactions
    GROUP BY comment_id
) r ON c.id = r.comment_id
GROUP BY DATE(c.created_at);

-- View for stream analytics summary
CREATE OR REPLACE VIEW stream_analytics_daily AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(CASE WHEN event_type = 'play' THEN 1 END) as play_events,
    COUNT(CASE WHEN event_type = 'skip' THEN 1 END) as skip_events,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id END) as registered_listeners,
    COUNT(DISTINCT ip_address) as unique_ips,
    COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile_sessions,
    COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop_sessions
FROM stream_analytics
GROUP BY DATE(created_at);

-- ============================================================================
-- CLEANUP AND MAINTENANCE PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure to cleanup old analytics data
CREATE PROCEDURE IF NOT EXISTS CleanupOldAnalytics()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
    
    START TRANSACTION;
    
    -- Remove analytics data older than 6 months
    DELETE FROM stream_analytics WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
    DELETE FROM api_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);
    DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
    
    -- Remove expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Remove old notifications
    DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW();
    DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_read = 1;
    
    COMMIT;
END//

DELIMITER ;

-- ============================================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
ALTER TABLE calendar_comments ADD INDEX IF NOT EXISTS idx_date_approved_created (comment_date, is_approved, created_at);
ALTER TABLE comment_reactions ADD INDEX IF NOT EXISTS idx_comment_type_created (comment_id, reaction_type, created_at);
ALTER TABLE stream_analytics ADD INDEX IF NOT EXISTS idx_session_event_time (session_id, event_type, created_at);
ALTER TABLE notifications ADD INDEX IF NOT EXISTS idx_user_type_unread (user_id, type, is_read);

-- ============================================================================
-- TRIGGERS FOR DATA INTEGRITY
-- ============================================================================

DELIMITER //

-- Update comment edit tracking
CREATE TRIGGER IF NOT EXISTS tr_calendar_comments_edit
BEFORE UPDATE ON calendar_comments
FOR EACH ROW
BEGIN
    IF OLD.text != NEW.text THEN
        SET NEW.edit_count = OLD.edit_count + 1;
        SET NEW.last_edited = NOW();
    END IF;
END//

-- Update podcast play count
CREATE TRIGGER IF NOT EXISTS tr_podcast_play_analytics
AFTER INSERT ON stream_analytics
FOR EACH ROW
BEGIN
    IF NEW.event_type = 'play' AND JSON_EXTRACT(NEW.track_info, '$.podcast_id') IS NOT NULL THEN
        UPDATE podcasts 
        SET play_count = play_count + 1 
        WHERE id = JSON_EXTRACT(NEW.track_info, '$.podcast_id');
    END IF;
END//

DELIMITER ;