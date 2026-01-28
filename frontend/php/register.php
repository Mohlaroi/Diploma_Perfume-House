<?php
// register.php - ЧИСТЫЙ JSON API (PHP 8.5+)
ob_start();  // ✅ БЛОКИРУЕМ HTML вывод!

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

function jsonResponse($success, $message, $data = []) {
    ob_end_clean();  // ✅ Очищаем ВСЕ перед JSON!
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Только POST запросы разрешены');
    exit;
}

// Получаем JSON данные
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;  // Fallback для form-data
}

if (empty($data)) {
    jsonResponse(false, 'Нет данных для регистрации');
}

// Валидация обязательных полей
$required = ['first_name', 'last_name', 'email', 'password', 'confirm_password'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        jsonResponse(false, "Заполните поле: $field");
    }
}

// Проверка email
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Неверный формат email');
}

// Проверка пароля
if ($data['password'] !== $data['confirm_password']) {
    jsonResponse(false, 'Пароли не совпадают');
}
if (strlen($data['password']) < 6) {
    jsonResponse(false, 'Пароль должен быть не менее 6 символов');
}

// Подключение БД (БЕЗ echo!)
require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Проверяем дубликат email
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        jsonResponse(false, 'Этот email уже зарегистрирован');
    }
    
    // Хешируем пароль
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Создаём пользователя
    $insertQuery = "INSERT INTO users (email, first_name, last_name, password_hash, is_active) 
                   VALUES (:email, :first_name, :last_name, :password_hash, 1)";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':first_name', $data['first_name']);
    $insertStmt->bindParam(':last_name', $data['last_name']);
    $insertStmt->bindParam(':password_hash', $passwordHash);
    
    if (!$insertStmt->execute()) {
        jsonResponse(false, 'Ошибка при сохранении пользователя');
    }
    
    $userId = $db->lastInsertId();
    
    // Создаём сессию
    $sessionToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    $sessionQuery = "INSERT INTO user_sessions (user_id, session_token, ip_address, expires_at) 
                    VALUES (:user_id, :token, :ip, :expires)";
    
    $sessionStmt = $db->prepare($sessionQuery);
    $sessionStmt->bindParam(':user_id', $userId);
    $sessionStmt->bindParam(':token', $sessionToken);
    $sessionStmt->bindParam(':ip', $ip);
    $sessionStmt->bindParam(':expires', $expiresAt);
    $sessionStmt->execute();
    
    // Устанавливаем cookie
    setcookie('session_token', $sessionToken, [
        'expires' => time() + 7 * 24 * 3600,
        'path' => '/',
        'secure' => false,  // localhost
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    
    // ✅ УСПЕХ!
    jsonResponse(true, 'Регистрация успешна!', [
        'user' => [
            'id' => $userId,
            'email' => $email,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name']
        ],
        'redirect' => '/account/'
    ]);
    
} catch (Exception $e) {
    error_log("Register error: " . $e->getMessage());  // Только в лог!
    jsonResponse(false, 'Ошибка сервера. Попробуйте позже.');
}
?>
