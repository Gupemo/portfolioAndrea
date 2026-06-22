CREATE DATABASE IF NOT EXISTS portfolio_andrea CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE portfolio_andrea;

CREATE TABLE IF NOT EXISTS contact (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
)

-- =========================
-- ILLUSTRATIONS
-- =========================

CREATE TABLE IF NOT EXISTS illustrations (
    illustration_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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