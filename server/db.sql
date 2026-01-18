-- Datebase setup script for FriendLink application

-- DATABASE
CREATE DATABASE IF NOT EXISTS friendlink_db;
USE friendlink_db;

-- USERS
CREATE TABLE users (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    joined DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PROFILES
CREATE TABLE profiles (
    user_id VARCHAR(30) PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    bio TEXT,
    dob DATE,
    verified BOOLEAN DEFAULT FALSE,
    friend_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FRIENDS
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id VARCHAR(30) NOT NULL,
    user2_id VARCHAR(30) NOT NULL,
    status BOOLEAN DEFAULT FALSE, -- FALSE = pending, TRUE = accepted
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (user1_id < user2_id),
    UNIQUE (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

-- POSTS
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    media_url VARCHAR(255),
    media_type ENUM('image','video') DEFAULT 'image',
    caption TEXT,
    location VARCHAR(150),
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id VARCHAR(30) NOT NULL,
    comment TEXT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- LIKES
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    post_id INT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,

    UNIQUE (user_id, post_id)
);

-- MESSAGES
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(30) NOT NULL,
    receiver_id VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    notification TEXT NOT NULL,
    status ENUM('SEEN','UNSEEN') DEFAULT 'UNSEEN',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TRIGGERS
-- ---------- LIKE COUNT ----------
DELIMITER $$

CREATE TRIGGER after_like_insert
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
    IF NEW.post_id IS NOT NULL THEN
        UPDATE posts
        SET like_count = like_count + 1
        WHERE id = NEW.post_id;
    END IF;
END$$

CREATE TRIGGER after_like_delete
AFTER DELETE ON likes
FOR EACH ROW
BEGIN
    IF OLD.post_id IS NOT NULL THEN
        UPDATE posts
        SET like_count = like_count - 1
        WHERE id = OLD.post_id;
    END IF;
END$$

-- ---------- COMMENT COUNT ----------
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
END$$

CREATE TRIGGER after_comment_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
END$$

-- ---------- FRIEND COUNT ----------
CREATE TRIGGER after_friend_accept
AFTER UPDATE ON friends
FOR EACH ROW
BEGIN
    IF OLD.status = 0 AND NEW.status = 1 THEN
        UPDATE profiles
        SET friend_count = friend_count + 1
        WHERE user_id IN (NEW.user1_id, NEW.user2_id);
    END IF;
END$$

CREATE TRIGGER after_friend_delete
AFTER DELETE ON friends
FOR EACH ROW
BEGIN
    IF OLD.status = 1 THEN
        UPDATE profiles
        SET friend_count = friend_count - 1
        WHERE user_id IN (OLD.user1_id, OLD.user2_id);
    END IF;
END$$

DELIMITER ;
