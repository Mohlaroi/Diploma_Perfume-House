<?php
// check_auth.php - Проверка авторизации
define('DB_ACCESS', true);
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if (isAuth()) {
    $user = getCurrentUser();
    sendJSON([
        'success' => true,
        'authorized' => true,
        'user' => $user
    ]);
} else {
    sendJSON([
        'success' => true,
        'authorized' => false
    ]);
}
?>
