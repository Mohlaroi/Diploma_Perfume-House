<?php
require_once 'config/database.php';

header('Content-Type: application/json');

$database = new Database();
$connection = $database->getConnection();

if ($connection) {
    echo json_encode([
        'success' => true,
        'message' => 'Подключение к БД успешно',
        'database' => 'dom_parfumerii',
        'host' => 'localhost'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка подключения к БД'
    ]);
}
?>