<?php
// logout.php - Выход из системы
header('Content-Type: application/json');
session_start();

require_once __DIR__ . '/config/database.php';

class Logout {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Завершение сессии
    public function logoutUser($token) {
        if (empty($token)) {
            return true;
        }
        
        try {
            // Удаляем сессию из БД
            $query = "DELETE FROM user_sessions WHERE session_token = :token";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
            // Очищаем сессию PHP
            session_destroy();
            
            return true;
            
        } catch (Exception $e) {
            error_log("Logout error: " . $e->getMessage());
            return false;
        }
    }
}

// Обработка запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $logout = new Logout();
    
    // Получаем токен из cookie
    $token = $_COOKIE['session_token'] ?? '';
    
    // Удаляем cookie
    setcookie('session_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    
    // Завершаем сессию
    $success = $logout->logoutUser($token);
    
    echo json_encode([
        'success' => $success,
        'message' => 'Выход выполнен успешно',
        'redirect' => '../index.html'
    ]);
    
} else {
    // Если запрос GET - редирект
    $token = $_COOKIE['session_token'] ?? '';
    
    if (!empty($token)) {
        $logout = new Logout();
        $logout->logoutUser($token);
    }
    
    // Очищаем cookie
    setcookie('session_token', '', [
        'expires' => time() - 3600,
        'path' => '/'
    ]);
    
    // Редирект на главную
    header('Location: ../index.html');
    exit;
}
?>