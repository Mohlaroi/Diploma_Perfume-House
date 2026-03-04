<?php
// logout.php - Выход из системы
define('DB_ACCESS', true);
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Удаляем сессию из БД
if (isset($_SESSION['user_id'])) {
    $db = getDB();
    if ($db) {
        $stmt = $db->prepare("DELETE FROM sessions WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
    }
}

// Очищаем сессию
session_unset();
session_destroy();

sendJSON([
    'success' => true,
    'message' => 'Выход выполнен успешно',
    'redirect' => './index.html'
]);
?>
