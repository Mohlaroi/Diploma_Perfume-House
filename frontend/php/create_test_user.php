<?php
// create_test_user.php - создание тестового пользователя
require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

// Создаем тестового пользователя
$email = 'test@example.com';
$firstName = 'Тестовый';
$lastName = 'Пользователь';
$password = 'Test123!';
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Удаляем если существует
    $db->exec("DELETE FROM users WHERE email = '$email'");
    
    // Создаем заново
    $query = "INSERT INTO users (email, first_name, last_name, password_hash) 
             VALUES (:email, :first_name, :last_name, :password_hash)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':first_name', $firstName);
    $stmt->bindParam(':last_name', $lastName);
    $stmt->bindParam(':password_hash', $passwordHash);
    
    if ($stmt->execute()) {
        echo "✅ Тестовый пользователь создан!<br>";
        echo "Email: $email<br>";
        echo "Пароль: $password<br>";
        echo "Имя: $firstName $lastName<br><br>";
        
        // Показываем всех пользователей
        $users = $db->query("SELECT * FROM users")->fetchAll();
        echo "Все пользователи в базе:<br>";
        foreach ($users as $user) {
            echo "ID: {$user['id']}, Email: {$user['email']}, Имя: {$user['first_name']}<br>";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage();
}
?>