CREATE DATABASE IF NOT EXISTS adamowo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS adamowo.page_visits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    path VARCHAR(500) NOT NULL,
    visited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_id CHAR(36) NOT NULL,
    referrer VARCHAR(1000) DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_page_visits_path (path),
    INDEX idx_page_visits_time (visited_at),
    INDEX idx_page_visits_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
