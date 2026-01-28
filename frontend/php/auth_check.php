<?php
// auth_check.php - Проверка авторизации пользователя
header('Content-Type: application/json');
session_start();

require_once __DIR__ . '/config/database.php';

class AuthCheck {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Проверка сессии по токену
    public function checkSession($token) {
        if (empty($token)) {
            return false;
        }
        
        try {
            $query = "SELECT us.*, u.email, u.first_name, u.last_name, u.email_verified 
                     FROM user_sessions us 
                     JOIN users u ON us.user_id = u.id 
                     WHERE us.session_token = :token 
                     AND us.expires_at > NOW() 
                     AND u.is_active = 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $session = $stmt->fetch();
                
                // Обновляем время истечения сессии
                $this->updateSessionExpiry($token);
                
                return [
                    'authenticated' => true,
                    'user' => [
                        'id' => $session['user_id'],
                        'email' => $session['email'],
                        'first_name' => $session['first_name'],
                        'last_name' => $session['last_name'],
                        'full_name' => $session['first_name'] . ' ' . $session['last_name'],
                        'email_verified' => (bool)$session['email_verified']
                    ]
                ];
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("Auth check error: " . $e->getMessage());
            return false;
        }
    }
    
    // Обновление времени истечения сессии
    private function updateSessionExpiry($token) {
        try {
            $query = "UPDATE user_sessions 
                     SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) 
                     WHERE session_token = :token";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
        } catch (Exception $e) {
            error_log("Session update error: " . $e->getMessage());
        }
    }
    
    // Получение статистики пользователя
    public function getUserStats($userId) {
        try {
            $stats = [];
            
            // Количество заказов
            $query = "SELECT COUNT(*) as count FROM orders WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $stats['orders_count'] = $stmt->fetch()['count'];
            
            // Заказы по статусам
            $query = "SELECT status, COUNT(*) as count 
                     FROM orders 
                     WHERE user_id = :user_id 
                     GROUP BY status";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            
            $statusCounts = [];
            while ($row = $stmt->fetch()) {
                $statusCounts[$row['status']] = $row['count'];
            }
            
            $stats['status_counts'] = $statusCounts;
            
            // Количество избранного
            $query = "SELECT COUNT(*) as count FROM wishlist WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $stats['wishlist_count'] = $stmt->fetch()['count'];
            
            // Дата регистрации
            $query = "SELECT created_at FROM users WHERE id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $stats['created_at'] = $stmt->fetch()['created_at'];
            
            return $stats;
            
        } catch (Exception $e) {
            error_log("Get user stats error: " . $e->getMessage());
            return [];
        }
    }
    
    // Получение последних заказов
    public function getRecentOrders($userId, $limit = 5) {
        try {
            $query = "SELECT o.*, 
                     (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count,
                     (SELECT SUM(product_price * quantity) FROM order_items WHERE order_id = o.id) as total
                     FROM orders o 
                     WHERE o.user_id = :user_id 
                     ORDER BY o.created_at DESC 
                     LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $orders = [];
            while ($row = $stmt->fetch()) {
                $orders[] = [
                    'id' => $row['id'],
                    'order_number' => $row['order_number'],
                    'status' => $row['status'],
                    'total_amount' => $row['total_amount'],
                    'items_count' => $row['items_count'],
                    'created_at' => $row['created_at'],
                    'formatted_date' => date('d.m.Y', strtotime($row['created_at']))
                ];
            }
            
            return $orders;
            
        } catch (Exception $e) {
            error_log("Get recent orders error: " . $e->getMessage());
            return [];
        }
    }
    
    // Получение рекомендаций (заглушка)
    public function getRecommendations($userId) {
        // В реальном проекте здесь будет алгоритм рекомендаций
        return [
            [
                'id' => 1,
                'name' => 'Moudon Vanille Exquise',
                'description' => 'Изысканная ваниль с цветочными акцентами',
                'price' => 12400,
                'image' => '../images/products/moudon-vanille.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Initio Parfums - Musk Therapy',
                'description' => 'Чистый мускус с нотами бергамота',
                'price' => 17600,
                'image' => '../images/products/initio-musk.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Lattafa - Khamrah',
                'description' => 'Богатый восточный аромат с финиками',
                'price' => 3200,
                'image' => '../images/products/lattafa-khamrah.jpg'
            ]
        ];
    }
}

// Обработка запроса
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $authCheck = new AuthCheck();
    
    // Получаем токен из cookie
    $token = $_COOKIE['session_token'] ?? '';
    
    $result = $authCheck->checkSession($token);
    
    if ($result) {
        // Если нужно получить дополнительную информацию
        if (isset($_GET['stats']) && $_GET['stats'] === 'true') {
            $result['stats'] = $authCheck->getUserStats($result['user']['id']);
        }
        
        if (isset($_GET['orders']) && $_GET['orders'] === 'true') {
            $result['recent_orders'] = $authCheck->getRecentOrders($result['user']['id'], 5);
        }
        
        if (isset($_GET['recommendations']) && $_GET['recommendations'] === 'true') {
            $result['recommendations'] = $authCheck->getRecommendations($result['user']['id']);
        }
        
        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'data' => $result
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'authenticated' => false,
            'message' => 'Требуется авторизация'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Метод не разрешен'
    ]);
}
?>