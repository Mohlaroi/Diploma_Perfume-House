-- ============================================
-- БАЗА ДАННЫХ ДОМ ПАРФЮМЕРИИ
-- Версия: 1.0
-- Создано: 28.01.2026
-- Автор: Дипломный проект
-- ============================================

-- Удаляем существующую БД, если она есть (для пересоздания)
DROP DATABASE IF EXISTS dom_parfumerii;

-- Создаем базу данных с правильной кодировкой
CREATE DATABASE dom_parfumerii 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Выбираем созданную БД для дальнейших операций
USE dom_parfumerii;

-- ============================================
-- ТАБЛИЦА: ПОЛЬЗОВАТЕЛИ
-- Хранит основную информацию о пользователях
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email пользователя (уникальный)',
    phone VARCHAR(20) COMMENT 'Телефон в формате +7XXXXXXXXXX',
    first_name VARCHAR(100) NOT NULL COMMENT 'Имя пользователя',
    last_name VARCHAR(100) NOT NULL COMMENT 'Фамилия пользователя',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Хеш пароля',
    
    -- Статусы подтверждения
    email_verified BOOLEAN DEFAULT FALSE COMMENT 'Подтвержден ли email',
    phone_verified BOOLEAN DEFAULT FALSE COMMENT 'Подтвержден ли телефон',
    
    -- Системные поля
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Активен ли аккаунт',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата регистрации',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата последнего обновления',
    
    -- Индексы для быстрого поиска
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: СОГЛАСИЯ НА ОБРАБОТКУ ПДн
-- Обязательно по закону РФ 152-ФЗ
-- ============================================
CREATE TABLE user_consents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    
    -- Типы согласий
    consent_type VARCHAR(50) NOT NULL COMMENT 'Тип согласия (pd/news/sms)',
    consent_text TEXT NOT NULL COMMENT 'Полный текст согласия',
    
    -- Техническая информация
    ip_address VARCHAR(45) COMMENT 'IP адрес пользователя',
    user_agent TEXT COMMENT 'User-Agent браузера',
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата принятия согласия',
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_consent_type (consent_type),
    INDEX idx_accepted_at (accepted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: СЕССИИ ПОЛЬЗОВАТЕЛЕЙ
-- Хранит активные сессии для авторизации
-- ============================================
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    
    -- Токен сессии
    session_token VARCHAR(255) UNIQUE NOT NULL COMMENT 'Уникальный токен сессии',
    
    -- Техническая информация
    ip_address VARCHAR(45) COMMENT 'IP адрес',
    user_agent TEXT COMMENT 'User-Agent браузера',
    expires_at TIMESTAMP NOT NULL COMMENT 'Дата истечения сессии',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания сессии',
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ПОПЫТКИ ВХОДА
-- Защита от брутфорс-атак
-- ============================================
CREATE TABLE login_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL COMMENT 'Email, с которого пытались войти',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP адрес',
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Время попытки',
    success BOOLEAN DEFAULT FALSE COMMENT 'Успешна ли попытка',
    
    -- Индексы для быстрого поиска и анализа
    INDEX idx_email_ip (email, ip_address),
    INDEX idx_time (attempt_time),
    INDEX idx_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: СБРОС ПАРОЛЯ
-- Хранит токены для восстановления пароля
-- ============================================
CREATE TABLE password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    
    -- Токен для сброса
    token VARCHAR(255) UNIQUE NOT NULL COMMENT 'Уникальный токен сброса',
    
    -- Статус
    expires_at TIMESTAMP NOT NULL COMMENT 'Дата истечения токена',
    used BOOLEAN DEFAULT FALSE COMMENT 'Использован ли токен',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания запроса',
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ПОДТВЕРЖДЕНИЕ EMAIL
-- Для подтверждения email при регистрации
-- ============================================
CREATE TABLE email_verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    
    -- Токен подтверждения
    token VARCHAR(255) UNIQUE NOT NULL COMMENT 'Уникальный токен подтверждения',
    
    -- Статус
    expires_at TIMESTAMP NOT NULL COMMENT 'Дата истечения токена',
    verified_at TIMESTAMP NULL COMMENT 'Дата подтверждения (NULL если не подтвержден)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания токена',
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ИСТОРИЯ ИЗМЕНЕНИЙ ПРОФИЛЯ
-- Для аудита изменений (GDPR/152-ФЗ)
-- ============================================
CREATE TABLE profile_changes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    
    -- Данные об изменении
    change_type VARCHAR(50) NOT NULL COMMENT 'Тип изменения (email/password/phone)',
    old_value TEXT COMMENT 'Старое значение',
    new_value TEXT COMMENT 'Новое значение',
    
    -- Техническая информация
    ip_address VARCHAR(45) COMMENT 'IP адрес',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата изменения',
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_change_type (change_type),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ЗАКАЗЫ
-- Основная таблица заказов
-- ============================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT COMMENT 'ID пользователя (может быть NULL для гостевых заказов)',
    
    -- Информация о заказе
    order_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'Уникальный номер заказа',
    total_amount DECIMAL(10,2) NOT NULL COMMENT 'Общая сумма заказа',
    
    -- Статус заказа
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT 'Статус заказа',
    
    -- Адрес доставки
    shipping_address TEXT COMMENT 'Адрес доставки',
    shipping_city VARCHAR(100) COMMENT 'Город доставки',
    shipping_zip VARCHAR(20) COMMENT 'Индекс',
    
    -- Контактная информация
    customer_name VARCHAR(200) COMMENT 'Имя получателя',
    customer_phone VARCHAR(20) COMMENT 'Телефон получателя',
    customer_email VARCHAR(255) COMMENT 'Email получателя',
    
    -- Системные поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания заказа',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    
    -- Внешний ключ (могут быть гостевые заказы)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ТОВАРЫ В ЗАКАЗЕ
-- Связь заказов и товаров
-- ============================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL COMMENT 'ID заказа',
    
    -- Информация о товаре
    product_id INT COMMENT 'ID товара (если есть в каталоге)',
    product_name VARCHAR(255) NOT NULL COMMENT 'Название товара',
    product_price DECIMAL(10,2) NOT NULL COMMENT 'Цена за единицу',
    quantity INT NOT NULL DEFAULT 1 COMMENT 'Количество',
    
    -- Дополнительная информация
    product_image VARCHAR(500) COMMENT 'URL изображения товара',
    product_volume VARCHAR(50) COMMENT 'Объем/размер',
    
    -- Системные поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата добавления',
    
    -- Внешний ключ
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ИЗБРАННЫЕ ТОВАРЫ
-- ============================================
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    product_id INT NOT NULL COMMENT 'ID товара',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата добавления в избранное',
    
    -- Уникальная пара пользователь-товар
    UNIQUE KEY unique_user_product (user_id, product_id),
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_added_at (added_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ОТЗЫВЫ
-- ============================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'ID пользователя',
    product_id INT NOT NULL COMMENT 'ID товара',
    
    -- Данные отзыва
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT 'Оценка от 1 до 5',
    comment TEXT COMMENT 'Текст отзыва',
    
    -- Статус
    is_approved BOOLEAN DEFAULT FALSE COMMENT 'Одобрен ли отзыв модератором',
    
    -- Системные поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания отзыва',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    
    -- Внешние ключи
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: АДМИНИСТРАТОРЫ
-- ============================================
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Логин администратора',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email администратора',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Хеш пароля',
    full_name VARCHAR(200) COMMENT 'Полное имя',
    
    -- Права доступа
    role ENUM('superadmin', 'admin', 'moderator', 'manager') DEFAULT 'manager' COMMENT 'Роль',
    permissions JSON COMMENT 'JSON с правами доступа',
    
    -- Статус
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Активен ли аккаунт',
    last_login TIMESTAMP NULL COMMENT 'Дата последнего входа',
    
    -- Системные поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    
    -- Индексы
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТАБЛИЦА: ЖУРНАЛ СОБЫТИЙ
-- Для аудита действий пользователей и администраторов
-- ============================================
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Кто совершил действие
    user_id INT NULL COMMENT 'ID пользователя (если зарегистрированный)',
    admin_id INT NULL COMMENT 'ID администратора (если действие от админа)',
    
    -- Что произошло
    action_type VARCHAR(100) NOT NULL COMMENT 'Тип действия (login/register/order/create)',
    description TEXT COMMENT 'Описание действия',
    
    -- Где произошло
    ip_address VARCHAR(45) COMMENT 'IP адрес',
    user_agent TEXT COMMENT 'User-Agent браузера',
    
    -- Когда произошло
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата события',
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ (ОПЦИОНАЛЬНО)
-- Удалите этот блок если не нужны тестовые данные
-- ============================================

-- Пароль для всех тестовых пользователей: Test123!
INSERT INTO users (email, phone, first_name, last_name, password_hash, email_verified) VALUES
('test@example.com', '+79991234567', 'Анна', 'Иванова', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('user@example.com', '+79998765432', 'Иван', 'Петров', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('admin@example.com', '+79995554433', 'Мария', 'Сидорова', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Тестовые заказы
INSERT INTO orders (user_id, order_number, total_amount, status, customer_name, customer_email) VALUES
(1, 'ORD-2026-00001', 18900.00, 'delivered', 'Анна Иванова', 'test@example.com'),
(2, 'ORD-2026-00002', 3200.00, 'processing', 'Иван Петров', 'user@example.com'),
(1, 'ORD-2026-00003', 12400.00, 'shipped', 'Анна Иванова', 'test@example.com');

-- Тестовые товары в заказах
INSERT INTO order_items (order_id, product_name, product_price, quantity) VALUES
(1, 'Initio Parfums - Psychedelic Love', 18900.00, 1),
(2, 'Lattafa - Khamrah', 3200.00, 1),
(3, 'Moudon - Vanille Exquise', 12400.00, 1);

-- Тестовый администратор (пароль: Admin123!)
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@dome-parfumerii.ru', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Администратор Системы', 'superadmin');

-- ============================================
-- ПРОЦЕДУРЫ И ТРИГГЕРЫ
-- ============================================

-- Триггер для автоматического обновления updated_at
DELIMITER //
CREATE TRIGGER update_users_timestamp 
BEFORE UPDATE ON users 
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Процедура для очистки старых сессий
DELIMITER //
CREATE PROCEDURE cleanup_old_sessions()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM password_resets WHERE expires_at < NOW();
    DELETE FROM email_verifications WHERE expires_at < NOW();
END //
DELIMITER ;

-- ============================================
-- ПРАВА ДОСТУПА
-- Создайте пользователя для приложения
-- ============================================

-- Создаем пользователя БД для приложения
-- ЗАМЕНИТЕ 'your_password' на реальный пароль!
CREATE USER IF NOT EXISTS 'dom_parfumerii_app'@'localhost' IDENTIFIED BY 'your_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON dom_parfumerii.* TO 'dom_parfumerii_app'@'localhost';
FLUSH PRIVILEGES;

-- ============================================
-- ВЫВОД ИНФОРМАЦИИ О СОЗДАННЫХ ТАБЛИЦАХ
-- ============================================
SELECT 
    TABLE_NAME AS 'Таблица',
    TABLE_ROWS AS 'Количество записей',
    DATA_LENGTH AS 'Размер данных (байт)',
    CREATE_TIME AS 'Дата создания',
    TABLE_COLLATION AS 'Кодировка'
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'dom_parfumerii'
ORDER BY 
    TABLE_NAME;