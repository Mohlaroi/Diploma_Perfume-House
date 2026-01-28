<?php
// diagnostic.php - диагностика системы
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Диагностика системы</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        pre { background: #f5f5f5; padding: 10px; }
    </style>
</head>
<body>
    <h1>🔧 Диагностика системы авторизации</h1>
    
    <?php
    // 1. Проверка PHP
    echo '<div class="section">';
    echo '<h2>1. Проверка PHP</h2>';
    echo 'Версия PHP: <strong>' . phpversion() . '</strong><br>';
    
    // Проверка расширений
    $required = ['pdo_mysql', 'json', 'session'];
    foreach ($required as $ext) {
        if (extension_loaded($ext)) {
            echo "<span class='success'>✅ $ext</span><br>";
        } else {
            echo "<span class='error'>❌ $ext - НЕ УСТАНОВЛЕНО</span><br>";
        }
    }
    echo '</div>';
    
    // 2. Проверка путей
    echo '<div class="section">';
    echo '<h2>2. Проверка путей</h2>';
    echo 'Текущий файл: ' . __FILE__ . '<br>';
    echo 'Директория: ' . __DIR__ . '<br>';
    echo 'Доступна для записи: ' . (is_writable(__DIR__) ? '✅ Да' : '❌ Нет') . '<br>';
    echo '</div>';
    
    // 3. Проверка MySQL
    echo '<div class="section">';
    echo '<h2>3. Проверка MySQL</h2>';
    
    try {
        // Пробуем разные варианты подключения
        $configs = [
            ['host' => 'localhost', 'user' => 'root', 'pass' => ''],
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root'],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => ''],
            ['host' => '127.0.0.1', 'user' => 'root', 'pass' => 'root']
        ];
        
        $connected = false;
        foreach ($configs as $config) {
            try {
                $pdo = new PDO(
                    "mysql:host=" . $config['host'],
                    $config['user'],
                    $config['pass']
                );
                
                echo "<span class='success'>✅ Успешное подключение!</span><br>";
                echo "Хост: {$config['host']}<br>";
                echo "Пользователь: {$config['user']}<br>";
                echo "Версия MySQL: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "<br>";
                
                // Создаем тестовую базу
                $pdo->exec("CREATE DATABASE IF NOT EXISTS test_auth");
                $pdo->exec("USE test_auth");
                $pdo->exec("CREATE TABLE IF NOT EXISTS test (id INT)");
                $pdo->exec("INSERT INTO test VALUES (1)");
                
                echo "<span class='success'>✅ База данных работает</span><br>";
                $connected = true;
                break;
                
            } catch(PDOException $e) {
                echo "<span class='warning'>❌ Не удалось: {$config['host']} - {$config['user']}</span><br>";
                continue;
            }
        }
        
        if (!$connected) {
            echo "<span class='error'>❌ Не удалось подключиться к MySQL</span><br>";
            echo "Возможные причины:<br>";
            echo "1. MySQL не запущен<br>";
            echo "2. Неправильный пароль<br>";
            echo "3. Пользователь не существует<br>";
        }
        
    } catch(Exception $e) {
        echo "<span class='error'>❌ Ошибка: " . $e->getMessage() . "</span><br>";
    }
    echo '</div>';
    
    // 4. Проверка файлов
    echo '<div class="section">';
    echo '<h2>4. Проверка файлов</h2>';
    
    $required_files = [
        'config/database.php',
        'login.php',
        'register.php',
        'auth_check.php'
    ];
    
    foreach ($required_files as $file) {
        $path = __DIR__ . '/' . $file;
        if (file_exists($path)) {
            echo "<span class='success'>✅ $file</span><br>";
        } else {
            echo "<span class='error'>❌ $file - НЕ НАЙДЕН</span><br>";
        }
    }
    echo '</div>';
    
    // 5. Тестовая форма
    echo '<div class="section">';
    echo '<h2>5. Тестовая форма входа</h2>';
    echo '<form id="testForm">';
    echo 'Email: <input type="email" id="testEmail" value="test@example.com"><br>';
    echo 'Пароль: <input type="password" id="testPassword" value="Test123!"><br>';
    echo '<button type="button" onclick="testLogin()">Тестовый вход</button>';
    echo '</form>';
    echo '<div id="testResult"></div>';
    echo '</div>';
    ?>
    
    <script>
    async function testLogin() {
        const email = document.getElementById('testEmail').value;
        const password = document.getElementById('testPassword').value;
        const result = document.getElementById('testResult');
        
        result.innerHTML = 'Отправка запроса...';
        
        try {
            const response = await fetch('login.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            
            const data = await response.json();
            result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            
        } catch(error) {
            result.innerHTML = `❌ Ошибка: ${error.message}`;
        }
    }
    </script>
</body>
</html>