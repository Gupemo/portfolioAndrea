CREATE DATABASE IF NOT EXISTS portfolio_andrea CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE portfolio_andrea;

CREATE TABLE IF NOT EXISTS contact (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    privacy_accepted_at DATETIME NULL,
    privacy_version VARCHAR(50) NULL
) ENGINE=InnoDB;

-- Corrige instalaciones antiguas donde contact se creó sin identificador.
ALTER TABLE contact
    ADD COLUMN IF NOT EXISTS id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

ALTER TABLE contact
    ADD COLUMN IF NOT EXISTS privacy_accepted_at DATETIME NULL,
    ADD COLUMN IF NOT EXISTS privacy_version VARCHAR(50) NULL;

-- =========================
-- ILLUSTRATIONS
-- =========================

CREATE TABLE IF NOT EXISTS illustrations (
    illustration_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    original_image VARCHAR(255) NULL,
    watermark_type VARCHAR(20) NOT NULL DEFAULT 'none',
    watermark_position VARCHAR(30) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE illustrations
    ADD COLUMN IF NOT EXISTS original_image VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS watermark_type VARCHAR(20) NOT NULL DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS watermark_position VARCHAR(30) NULL;

CREATE TABLE IF NOT EXISTS illustration_translations (
    translation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    illustration_id INT NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_illustration_translation FOREIGN KEY (illustration_id) REFERENCES illustrations(illustration_id) ON DELETE CASCADE,
    CONSTRAINT uk_illustration_locale
    UNIQUE (illustration_id, locale)
) ENGINE=InnoDB;

-- =========================
-- PHOTOGRAPHY
-- =========================

CREATE TABLE IF NOT EXISTS pictures (
    picture_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    original_image VARCHAR(255) NULL,
    watermark_type VARCHAR(20) NOT NULL DEFAULT 'none',
    watermark_position VARCHAR(30) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE pictures
    ADD COLUMN IF NOT EXISTS original_image VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS watermark_type VARCHAR(20) NOT NULL DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS watermark_position VARCHAR(30) NULL;

CREATE TABLE IF NOT EXISTS picture_translations (
    translation_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    picture_id INT NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_picture_translation FOREIGN KEY (picture_id) REFERENCES pictures(picture_id) ON DELETE CASCADE,
    CONSTRAINT uk_picture_locale
    UNIQUE (picture_id, locale)
) ENGINE=InnoDB;

-- =========================
-- ABOUT ME
-- =========================

CREATE TABLE IF NOT EXISTS about_translations (
    locale VARCHAR(5) NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- PRIVACY POLICY
-- =========================

CREATE TABLE IF NOT EXISTS privacy_policy_translations (
    locale VARCHAR(5) NOT NULL PRIMARY KEY,
    content LONGTEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- BETTER AUTH
-- =========================

CREATE TABLE IF NOT EXISTS `user` (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `session` (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    expiresAt DATETIME NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    ipAddress TEXT NULL,
    userAgent TEXT NULL,
    userId VARCHAR(36) NOT NULL,
    INDEX session_userId_idx (userId),
    CONSTRAINT session_user_fk FOREIGN KEY (userId) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS account (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    accountId VARCHAR(255) NOT NULL,
    providerId VARCHAR(255) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    accessToken TEXT NULL,
    refreshToken TEXT NULL,
    idToken TEXT NULL,
    accessTokenExpiresAt DATETIME NULL,
    refreshTokenExpiresAt DATETIME NULL,
    scope TEXT NULL,
    password TEXT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    INDEX account_userId_idx (userId),
    CONSTRAINT account_user_fk FOREIGN KEY (userId) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS verification (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME NULL,
    updatedAt DATETIME NULL,
    INDEX verification_identifier_idx (identifier)
) ENGINE=InnoDB;
