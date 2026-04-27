-- ============================================
-- Study Garden - MySQL Database Schema (OPTIMIZED)
-- Loại bỏ 4 bảng không cần thiết
-- Chỉ giữ 9 bảng core
-- ============================================

-- Drop existing tables (nếu có)
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS uploaded_files;
DROP TABLE IF EXISTS user_inventory;
DROP TABLE IF EXISTS shop_items;
DROP TABLE IF EXISTS mission_progress;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS study_sessions;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(50),
    avatar_url VARCHAR(500),
    
    -- Gamification
    total_leaves INT DEFAULT 0,
    daily_leaves INT DEFAULT 0,
    level INT DEFAULT 1,
    experience_points INT DEFAULT 0,
    
    -- Titles/Badges
    current_title VARCHAR(100),
    badges JSON, -- Array of badge IDs
    
    -- Stats
    total_study_minutes INT DEFAULT 0,
    total_quiz_completed INT DEFAULT 0,
    total_missions_completed INT DEFAULT 0,
    
    -- Settings
    preferred_music VARCHAR(50) DEFAULT 'lofi',
    music_volume INT DEFAULT 50,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    last_daily_reset DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_total_leaves (total_leaves)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lưu thông tin người dùng và stats';

-- ============================================
-- 2. STUDY SESSIONS TABLE
-- ============================================
CREATE TABLE study_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Session info
    session_type ENUM('alone', 'group') NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    duration_minutes INT DEFAULT 0,
    
    -- Settings
    music_type VARCHAR(50),
    timer_mode ENUM('countup', 'countdown'),
    target_minutes INT,
    
    -- Rewards
    leaves_earned INT DEFAULT 0,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id, created_at),
    INDEX idx_session_type (session_type),
    INDEX idx_start_time (start_time),
    INDEX idx_user_active_sessions (user_id, is_completed, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lưu các phiên học tập (alone & group)';

-- ============================================
-- 3. MISSIONS TABLE
-- ============================================
CREATE TABLE missions (
    mission_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Mission info
    mission_code VARCHAR(50) UNIQUE NOT NULL,
    mission_name VARCHAR(200) NOT NULL,
    mission_description TEXT,
    mission_type ENUM('daily', 'weekly', 'special') DEFAULT 'daily',
    
    -- Requirements
    requirement_type ENUM('study_alone', 'study_group', 'quiz', 'complete_all') NOT NULL,
    requirement_value INT NOT NULL, -- minutes or count
    
    -- Rewards
    leaves_reward INT NOT NULL,
    
    -- Order
    display_order INT DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_mission_type (mission_type, is_active),
    INDEX idx_mission_code (mission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh sách nhiệm vụ';

-- ============================================
-- 4. MISSION PROGRESS TABLE
-- ============================================
CREATE TABLE mission_progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mission_id INT NOT NULL,
    
    -- Progress
    current_progress INT DEFAULT 0,
    target_progress INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    
    -- Date tracking
    progress_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id) ON DELETE CASCADE,
    INDEX idx_user_missions (user_id, progress_date),
    INDEX idx_mission_progress (mission_id, progress_date),
    INDEX idx_user_daily_progress (user_id, progress_date, is_completed),
    INDEX idx_mission_progress_date (progress_date, is_completed),
    UNIQUE KEY unique_user_mission_date (user_id, mission_id, progress_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tiến độ nhiệm vụ của user';

-- ============================================
-- 5. SHOP ITEMS TABLE
-- ============================================
CREATE TABLE shop_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Item info
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_description TEXT,
    item_category ENUM('slot', 'time_card', 'title', 'avatar', 'theme', 'other') NOT NULL,
    
    -- Pricing
    price_leaves INT DEFAULT 0,
    price_money DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'VND',
    
    -- Item properties
    item_properties JSON, -- { "slot_count": 1, "time_minutes": 5, etc }
    
    -- Display
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    
    -- Status
    is_available BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT -1, -- -1 = unlimited
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (item_category, is_available),
    INDEX idx_item_code (item_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh sách items trong shop';

-- ============================================
-- 6. USER INVENTORY TABLE
-- ============================================
CREATE TABLE user_inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    
    -- Quantity
    quantity INT DEFAULT 1,
    
    -- Status
    is_equipped BOOLEAN DEFAULT FALSE,
    is_used BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES shop_items(item_id) ON DELETE CASCADE,
    INDEX idx_user_inventory (user_id, is_used),
    INDEX idx_item_owners (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Kho đồ của user';

-- ============================================
-- 7. UPLOADED FILES TABLE
-- ============================================
CREATE TABLE uploaded_files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- File info
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, docx, txt
    mime_type VARCHAR(100),
    
    -- Content
    extracted_text LONGTEXT,
    text_preview TEXT, -- First 500 chars
    
    -- Status
    processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_files (user_id, uploaded_at),
    INDEX idx_file_type (file_type),
    INDEX idx_processing_status (processing_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Files đã upload (PDF, DOCX, TXT)';

-- ============================================
-- 8. QUIZZES TABLE
-- ============================================
CREATE TABLE quizzes (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    file_id INT NULL, -- NULL if manually created
    
    -- Quiz info
    quiz_title VARCHAR(200),
    difficulty ENUM('easy', 'normal', 'hard', 'extreme') DEFAULT 'normal',
    total_questions INT NOT NULL,
    time_limit_minutes INT DEFAULT 30,
    
    -- Results
    score INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    
    -- Rewards
    leaves_earned INT DEFAULT 0,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(file_id) ON DELETE SET NULL,
    INDEX idx_user_quizzes (user_id, started_at),
    INDEX idx_difficulty (difficulty),
    INDEX idx_completed (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh sách quiz và kết quả';

-- ============================================
-- 9. QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE quiz_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    
    -- Question info
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'fill_blank', 'true_false') DEFAULT 'fill_blank',
    
    -- Options (for multiple choice)
    options JSON, -- ["Option A", "Option B", "Option C", "Option D"]
    
    -- Answer
    correct_answer TEXT NOT NULL,
    
    -- Points
    points INT DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    INDEX idx_quiz_questions (quiz_id, question_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Câu hỏi của quiz';

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Default Missions
INSERT INTO missions (mission_code, mission_name, mission_description, mission_type, requirement_type, requirement_value, leaves_reward, display_order) VALUES
('STUDY_ALONE_15', 'Task 1: Study alone 15 phút', 'Học một mình trong 15 phút', 'daily', 'study_alone', 15, 10, 1),
('STUDY_ALONE_30', 'Task 2: Study alone 30 phút', 'Học một mình trong 30 phút', 'daily', 'study_alone', 30, 20, 2),
('STUDY_GROUP_15', 'Task 3: Group Study 15 phút', 'Học nhóm trong 15 phút', 'daily', 'study_group', 15, 10, 3),
('STUDY_GROUP_30', 'Task 4: Group Study 30 phút', 'Học nhóm trong 30 phút', 'daily', 'study_group', 30, 20, 4),
('COMPLETE_ALL', 'Task 5: Hoàn thành tất cả nhiệm vụ', 'Hoàn thành tất cả nhiệm vụ trong ngày', 'daily', 'complete_all', 4, 40, 5);

-- Default Shop Items
INSERT INTO shop_items (item_code, item_name, item_description, item_category, price_leaves, price_money, item_properties, display_order) VALUES
-- Leaves items
('SLOT_GROUP_1', '+1 Slot Group Study', 'Tăng thêm 1 slot trong phòng học nhóm', 'slot', 300, 0, '{"slot_count": 1}', 1),
('TIME_CARD_5', 'Time Card (+5 phút)', 'Thêm 5 phút vào timer', 'time_card', 100, 0, '{"time_minutes": 5}', 2),
('TITLE_DILIGENT', 'Danh hiệu "Diligent Learner"', 'Danh hiệu học sinh chăm chỉ', 'title', 1000, 0, '{"title": "Diligent Learner", "icon": "🏅"}', 3),

-- Money items
('SLOT_GROUP_1_MONEY', '+1 Slot Group Study', 'Tăng thêm 1 slot trong phòng học nhóm', 'slot', 0, 10000, '{"slot_count": 1}', 4),
('TIME_CARD_5X5', 'Time Card x5', 'Gói 5 time card (+5 phút mỗi cái)', 'time_card', 0, 10000, '{"time_minutes": 5, "quantity": 5}', 5),
('TITLE_TYCOON', 'Title: Tycoon', 'Danh hiệu đại gia', 'title', 0, 500000, '{"title": "Tycoon", "icon": "💰"}', 6),
('TITLE_TYCOON_PRO', 'Title: Tycoon Pro Max', 'Danh hiệu đại gia siêu cấp', 'title', 0, 999999, '{"title": "Tycoon Pro Max", "icon": "👑"}', 7);

-- ============================================
-- VIEWS (Optional - for easier queries)
-- ============================================

-- User Stats View
CREATE VIEW user_stats_view AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.total_leaves,
    u.daily_leaves,
    u.level,
    u.total_study_minutes,
    u.total_quiz_completed,
    u.total_missions_completed,
    COUNT(DISTINCT ss.session_id) as total_sessions,
    COUNT(DISTINCT mp.mission_id) as completed_missions_today,
    COUNT(DISTINCT ui.item_id) as total_items_owned
FROM users u
LEFT JOIN study_sessions ss ON u.user_id = ss.user_id
LEFT JOIN mission_progress mp ON u.user_id = mp.user_id 
    AND mp.progress_date = CURDATE() 
    AND mp.is_completed = TRUE
LEFT JOIN user_inventory ui ON u.user_id = ui.user_id
GROUP BY u.user_id;

-- Daily Mission Progress View
CREATE VIEW daily_mission_progress_view AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    m.mission_id,
    m.mission_name,
    m.leaves_reward,
    COALESCE(mp.current_progress, 0) as current_progress,
    m.requirement_value as target_progress,
    COALESCE(mp.is_completed, FALSE) as is_completed,
    ROUND((COALESCE(mp.current_progress, 0) / m.requirement_value) * 100, 2) as progress_percentage
FROM users u
CROSS JOIN missions m
LEFT JOIN mission_progress mp ON u.user_id = mp.user_id 
    AND m.mission_id = mp.mission_id 
    AND mp.progress_date = CURDATE()
WHERE m.mission_type = 'daily' 
    AND m.is_active = TRUE
    AND u.is_active = TRUE
ORDER BY u.user_id, m.display_order;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure: Update Mission Progress
CREATE PROCEDURE update_mission_progress(
    IN p_user_id INT,
    IN p_mission_code VARCHAR(50),
    IN p_progress_increment INT
)
BEGIN
    DECLARE v_mission_id INT;
    DECLARE v_target_progress INT;
    DECLARE v_leaves_reward INT;
    DECLARE v_current_progress INT;
    
    -- Get mission info
    SELECT mission_id, requirement_value, leaves_reward 
    INTO v_mission_id, v_target_progress, v_leaves_reward
    FROM missions 
    WHERE mission_code = p_mission_code AND is_active = TRUE;
    
    -- Insert or update progress
    INSERT INTO mission_progress (user_id, mission_id, current_progress, target_progress, progress_date)
    VALUES (p_user_id, v_mission_id, p_progress_increment, v_target_progress, CURDATE())
    ON DUPLICATE KEY UPDATE 
        current_progress = current_progress + p_progress_increment,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Check if completed
    SELECT current_progress INTO v_current_progress
    FROM mission_progress
    WHERE user_id = p_user_id 
        AND mission_id = v_mission_id 
        AND progress_date = CURDATE();
    
    IF v_current_progress >= v_target_progress THEN
        UPDATE mission_progress 
        SET is_completed = TRUE, completed_at = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id 
            AND mission_id = v_mission_id 
            AND progress_date = CURDATE()
            AND is_completed = FALSE;
        
        -- Award leaves
        UPDATE users 
        SET total_leaves = total_leaves + v_leaves_reward,
            daily_leaves = daily_leaves + v_leaves_reward,
            total_missions_completed = total_missions_completed + 1
        WHERE user_id = p_user_id;
    END IF;
END //

-- Procedure: Reset Daily Missions
CREATE PROCEDURE reset_daily_missions()
BEGIN
    -- This should be run daily at midnight
    UPDATE users 
    SET daily_leaves = 0,
        last_daily_reset = CURDATE()
    WHERE last_daily_reset < CURDATE() OR last_daily_reset IS NULL;
END //

-- Procedure: Purchase Item (Simplified)
CREATE PROCEDURE purchase_item(
    IN p_user_id INT,
    IN p_item_id INT,
    IN p_quantity INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_price_leaves INT;
    DECLARE v_user_leaves INT;
    DECLARE v_total_cost INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Transaction failed';
    END;
    
    START TRANSACTION;
    
    -- Get item price
    SELECT price_leaves INTO v_price_leaves
    FROM shop_items WHERE item_id = p_item_id AND is_available = TRUE;
    
    -- Get user leaves
    SELECT total_leaves INTO v_user_leaves FROM users WHERE user_id = p_user_id;
    
    SET v_total_cost = v_price_leaves * p_quantity;
    
    IF v_user_leaves < v_total_cost THEN
        SET p_success = FALSE;
        SET p_message = 'Not enough leaves';
        ROLLBACK;
    ELSE
        -- Deduct leaves
        UPDATE users SET total_leaves = total_leaves - v_total_cost
        WHERE user_id = p_user_id;
        
        -- Add to inventory
        INSERT INTO user_inventory (user_id, item_id, quantity)
        VALUES (p_user_id, p_item_id, p_quantity)
        ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;
        
        SET p_success = TRUE;
        SET p_message = 'Purchase successful';
        COMMIT;
    END IF;
END //

DELIMITER ;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Summary:
-- ✅ 9 tables (optimized from 13)
-- ❌ Removed: group_study_rooms, group_study_participants (Firebase handles)
-- ❌ Removed: shop_transactions (not needed yet)
-- ❌ Removed: quiz_answers (not needed yet)
-- ✅ Simpler, easier to maintain
-- ✅ Sufficient for MVP
