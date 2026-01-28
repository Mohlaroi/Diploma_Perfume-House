<?php
// test.php - файл для проверки PHP
header('Content-Type: text/html; charset=utf-8');

echo "<h1>✅ PHP работает правильно!</h1>";
echo "<p>Версия PHP: " . phpversion() . "</p>";
echo "<p>Текущая дата: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>Путь к файлу: " . __FILE__ . "</p>";

// Проверка расширений
$extensions = ['pdo_mysql', 'json', 'session'];
echo "<h2>Проверка расширений:</h2>";
foreach ($extensions as $ext) {
    echo extension_loaded($ext) 
        ? "✅ $ext: установлено<br>" 
        : "❌ $ext: не установлено<br>";
}

// Проверка прав на запись
echo "<h2>Проверка прав:</h2>";
$writable = is_writable(__DIR__);
echo $writable ? "✅ Папка доступна для записи<br>" : "❌ Папка только для чтения<br>";

// Информация о сервере
echo "<h2>Информация о сервере:</h2>";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
?>