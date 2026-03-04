<?php
// test.php - Тест подключения
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'PHP работает!',
    'time' => date('Y-m-d H:i:s')
]);
?>
