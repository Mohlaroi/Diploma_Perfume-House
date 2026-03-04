<?php
// register.php - Регистрация нового пользователя
// Версия 2.0 для диплома

define('DB_ACCESS', true);
require_once 'config.php';

// Разрешаем CORS
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
    
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $password_confirm = $data['password_confirm'] ?? '';
    $agree = $data['agree'] ?? false;
    
    // Валидация
    $errors = [];
    
    if (empty($name)) {
        $errors['name'] = 'Имя обязательно';
    } elseif (strlen($name) < 2) {
        $errors['name'] = 'Имя должно содержать минимум 2 символа';
    }
    
    if (empty($email)) {
        $errors['email'] = 'Email обязателен';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Некорректный email';
    }
    
    if (!empty($phone)) {
        // Очищаем телефон от всего кроме цифр и +
        $phone = preg_replace('/[^0-9+]/', '', $phone);
        if (strlen($phone) < 10) {
            $errors['phone'] = 'Некорректный номер телефона';
        }
    }
    
    if (empty($password)) {
        $errors['password'] = 'Пароль обязателен';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'Пароль должен содержать минимум 6 символов';
    }
    
    if ($password !== $password_confirm) {
        $errors['password_confirm'] = 'Пароли не совпадают';
    }
    
    if (!$agree) {
        $errors['agree'] = 'Необходимо согласие с условиями';
    }
    
    if (!empty($errors)) {
        sendJSON(['success' => false, 'errors' => $errors], 422);
    }
    
    // Подключаемся к БД
    $db = getDB();
    if (!$db) {
        sendJSON(['success' => false, 'error' => 'Ошибка подключения к БД'], 500);
    }
    
    // Проверяем, не занят ли email
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendJSON(['success' => false, 'errors' => ['email' => 'Email уже зарегистрирован']], 422);
    }
    
    // Хешируем пароль
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Создаем пользователя
    $stmt = $db->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
    $success = $stmt->execute([$name, $email, $phone ?: null, $password_hash]);
    
    if (!$success) {
        sendJSON(['success' => false, 'error' => 'Ошибка создания аккаунта'], 500);
    }
    
    $user_id = $db->lastInsertId();
    
    // Автоматически авторизуем пользователя
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['logged_in'] = true;
    
    // Создаем сессию в БД
    $token = bin2hex(random_bytes(32));
    $stmt = $db->prepare("INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) 
                         VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))");
    $stmt->execute([
        $user_id,
        $token,
        $_SERVER['REMOTE_ADDR'] ?? null,
        $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);
    
    sendJSON([
        'success' => true,
        'message' => 'Регистрация успешна! Добро пожаловать!',
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ],
        'redirect' => './account.html'
    ], 201);
    
} catch (Exception $e) {
    error_log("Register error: " . $e->getMessage());
    sendJSON(['success' => false, 'error' => 'Внутренняя ошибка сервера'], 500);
}
?>
