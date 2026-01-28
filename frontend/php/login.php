<?php
ob_start();  // ✅ КРИТИЧНО!

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// ❌ УДАЛИЛИ error_reporting + ini_set!

function jsonResponse($success, $message, $data = []) {
    ob_end_clean();  // ✅ Очищаем ДО JSON!
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ... весь ваш код login ...
    jsonResponse(true, 'Вход выполнен успешно!', $userData);
} else {
    jsonResponse(false, 'Метод не разрешен');
}
?>
