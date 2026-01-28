<?php
class Database {
    private $host = "localhost";
    private $db_name = "dom_parfumerii";
    private $username = "root";
    private $password = "";
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        $configs = [
            ['host' => 'localhost', 'user' => 'root', 'pass' => ''],
            ['host' => 'localhost', 'user' => 'root', 'pass' => 'root']
        ];
        
        foreach ($configs as $config) {
            try {
                $this->conn = new PDO(
                    "mysql:host=" . $config['host'] . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                    $config['user'],
                    $config['pass'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
                
                $this->createTables();  // Тихо создаёт таблицы
                return $this->conn;
                
            } catch(PDOException $e) {
                continue;
            }
        }
        throw new Exception("Не удалось подключиться к MySQL");
    }
    
    // Остальные методы БЕЗ echo!
}
?>
