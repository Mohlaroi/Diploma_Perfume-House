<?php
// init_db.php - Инициализация базы данных
// Создает структуру БД для авторизации

define('DB_ACCESS', true);

$host = 'localhost';
$dbname = 'perfume_shop';
$username = 'root';
$password = '';

try {
    // Подключаемся без выбора БД
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "📡 Подключение к MySQL установлено<br>";
    
    // Создаем БД если не существует
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ База данных '$dbname' готова<br>";
    
    // Переключаемся на нашу БД
    $pdo->exec("USE `$dbname`");
    
    // Создаем таблицу пользователей
    $sql_users = "CREATE TABLE IF NOT EXISTS `users` (
        `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `phone` VARCHAR(20) DEFAULT NULL,
        `password` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `idx_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql_users);
    echo "✅ Таблица 'users' создана<br>";
    
    // Создаем таблицу сессий
    $sql_sessions = "CREATE TABLE IF NOT EXISTS `sessions` (
        `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        `user_id` INT(11) UNSIGNED NOT NULL,
        `token` VARCHAR(255) NOT NULL,
        `ip_address` VARCHAR(45) DEFAULT NULL,
        `user_agent` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `expires_at` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        INDEX `idx_user_id` (`user_id`),
        INDEX `idx_token` (`token`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $pdo->exec($sql_sessions);
    echo "✅ Таблица 'sessions' создана<br>";
    
    // Создаем тестового пользователя
    $test_email = 'test@perfume.ru';
    $test_password = password_hash('123456', PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$test_email]);
    
    if (!$stmt->fetch()) {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Тестовый Пользователь', $test_email, '+7 (900) 123-45-67', $test_password]);
        echo "✅ Создан тестовый пользователь<br>";
        echo "📧 Email: <strong>$test_email</strong><br>";
        echo "🔑 Пароль: <strong>123456</strong><br>";
    } else {
        echo "ℹ️ Тестовый пользователь уже существует<br>";
    }
    
    echo "<br><strong>🎉 Инициализация завершена успешно!</strong><br>";
    echo "<a href='test_auth.html'>→ Перейти к тестированию авторизации</a>";
    
} catch(PDOException $e) {
    echo "<strong style='color:red'>❌ Ошибка: </strong>" . $e->getMessage();
}
?>
