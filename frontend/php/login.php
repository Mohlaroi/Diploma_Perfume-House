<?php
// login.php - Авторизация пользователя
// Версия 2.0 для диплома

define('DB_ACCESS', true);
require_once 'config.php';

// Разрешаем CORS для локальной разработки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

try {
    // Получаем данные
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        sendJSON(['success' => false, 'error' => 'Некорректные данные'], 400);
    }
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $remember = $data['remember'] ?? false;
    
    // Валидация
    $errors = [];
    
    if (empty($email)) {
        $errors['email'] = 'Email обязателен';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Некорректный email';
    }
    
    if (empty($password)) {
        $errors['password'] = 'Пароль обязателен';
    }
    
    if (!empty($errors)) {
        sendJSON(['success' => false, 'errors' => $errors], 422);
    }
    
    // Подключаемся к БД
    $db = getDB();
    if (!$db) {
        sendJSON(['success' => false, 'error' => 'Ошибка подключения к БД'], 500);
    }
    
    // Ищем пользователя
    $stmt = $db->prepare("SELECT id, name, email, phone, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendJSON(['success' => false, 'error' => 'Неверный email или пароль'], 401);
    }
    
    // Проверяем пароль
    if (!password_verify($password, $user['password'])) {
        sendJSON(['success' => false, 'error' => 'Неверный email или пароль'], 401);
    }
    
    // Успешная авторизация - создаем сессию
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in'] = true;
    
    // Если нужно запомнить
    if ($remember) {
        // Продлеваем сессию на 30 дней
        ini_set('session.gc_maxlifetime', 30 * 24 * 60 * 60);
        session_set_cookie_params(30 * 24 * 60 * 60);
    }
    
    // Логируем сессию в БД
    $token = bin2hex(random_bytes(32));
    $stmt = $db->prepare("INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) 
                         VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))");
    $stmt->execute([
        $user['id'],
        $token,
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);
    
    // Возвращаем данные пользователя (без пароля!)
    unset($user['password']);
    
    sendJSON([
        'success' => true,
        'message' => 'Вход выполнен успешно',
        'user' => $user,
        'redirect' => '/Users/mahisabirova/Documents/Диплом_Таиржанова_ИС-43/Diploma_Perfume-House/frontend/account.html'
    ], 200);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Внутренняя ошибка сервера'], 500);
}
?>
