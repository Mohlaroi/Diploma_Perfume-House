<?php
// config.php - Конфигурация базы данных
// Версия 2.0 для диплома

// Предотвращаем прямой доступ
if (!defined('DB_ACCESS')) {
    define('DB_ACCESS', true);
}

// Настройки базы данных
define('DB_HOST', 'localhost');
define('DB_NAME', 'perfume_shop');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Настройки сессий
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Для локальной разработки
session_start();

// Подключение к БД
function getDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log("DB Connection Error: " . $e->getMessage());
        return null;
    }
}

// Функция для безопасного вывода JSON
function sendJSON($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Проверка авторизации
function isAuth() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Получение текущего пользователя
function getCurrentUser() {
    if (!isAuth()) return null;
    
    $db = getDB();
    if (!$db) return null;
    
    $stmt = $db->prepare("SELECT id, name, email, phone, created_at FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}
?>
