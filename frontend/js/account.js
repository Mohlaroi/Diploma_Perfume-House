// account.js - Логика личного кабинета

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const cartCount = document.getElementById('cartCount');
    
    // Проверка авторизации
    checkAuth();
    
    // Загрузка данных пользователя
    loadUserData();
    
    // Обработчик выпадающего меню
    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdownMenu.style.display = 
                userDropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', function() {
            userDropdownMenu.style.display = 'none';
        });
        
        // Предотвращение закрытия при клике внутри меню
        userDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Функция проверки авторизации
    async function checkAuth() {
        try {
            const response = await fetch('/frontend/php/auth_check.php', {
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!data.authenticated) {
                // Если пользователь не авторизован, редирект на вход
                window.location.href = '../auth/login.html?redirect=' + 
                    encodeURIComponent(window.location.pathname);
            }
            
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
            showMessage('error', 'Ошибка проверки авторизации');
        }
    }
    
    // Загрузка данных пользователя
    async function loadUserData() {
        try {
            const response = await fetch('/frontend/php/auth_check.php?stats=true&orders=true&recommendations=true', {
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success && data.authenticated) {
                const user = data.data.user;
                const stats = data.data.stats || {};
                const orders = data.data.recent_orders || [];
                const recommendations = data.data.recommendations || [];
                
                // Обновляем информацию о пользователе
                updateUserInfo(user);
                
                // Обновляем статистику
                updateUserStats(stats);
                
                // Обновляем заказы
                updateRecentOrders(orders);
                
                // Обновляем рекомендации
                updateRecommendations(recommendations);
                
                // Загружаем корзину
                loadCartCount();
                
            } else {
                // Если данные не загрузились, редирект
                window.location.href = '../auth/login.html';
            }
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            showMessage('error', 'Ошибка загрузки данных пользователя');
        }
    }
    
    // Обновление информации о пользователе
    function updateUserInfo(user) {
        // Имя пользователя
        const userNameElements = document.querySelectorAll('#userName, #sidebarUserName, #welcomeUserName');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.full_name;
        });
        
        // Email
        const emailElements = document.querySelectorAll('#userEmail, #sidebarUserEmail');
        emailElements.forEach(el => {
            if (el) el.textContent = user.email;
        });
        
        // Приветственное сообщение
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            const hour = new Date().getHours();
            let greeting = '';
            
            if (hour < 12) greeting = 'Доброе утро';
            else if (hour < 18) greeting = 'Добрый день';
            else greeting = 'Добрый вечер';
            
            welcomeMessage.textContent = `${greeting}, ${user.first_name}!`;
        }
    }
    
    // Обновление статистики
    function updateUserStats(stats) {
        // Общее количество заказов
        const ordersCountEl = document.getElementById('ordersCount');
        if (ordersCountEl) {
            ordersCountEl.textContent = stats.orders_count || 0;
        }
        
        // Количество избранного
        const wishlistCountEl = document.getElementById('wishlistCount');
        if (wishlistCountEl) {
            wishlistCountEl.textContent = stats.wishlist_count || 0;
        }
        
        // Дата регистрации
        const userSinceEl = document.getElementById('userSince');
        if (userSinceEl && stats.created_at) {
            const regDate = new Date(stats.created_at);
            userSinceEl.textContent = regDate.getFullYear();
        }
        
        // Заказы по статусам
        const statusCounts = stats.status_counts || {};
        updateOrderStatusCounts(statusCounts);
    }
    
    // Обновление счетчиков заказов по статусам
    function updateOrderStatusCounts(statusCounts) {
        const pendingOrders = document.getElementById('pendingOrders');
        const processingOrders = document.getElementById('processingOrders');
        const wishlistItems = document.getElementById('wishlistItems');
        
        if (pendingOrders) {
            pendingOrders.textContent = `${statusCounts.pending || 0} заказов`;
        }
        
        if (processingOrders) {
            const processing = (statusCounts.processing || 0) + (statusCounts.shipped || 0);
            processingOrders.textContent = `${processing} заказов`;
        }
        
        if (wishlistItems) {
            // Будет обновлено из другого запроса
            wishlistItems.textContent = '0 товаров';
        }
    }
    
    // Обновление списка последних заказов
    function updateRecentOrders(orders) {
        const ordersContainer = document.getElementById('recentOrders');
        if (!ordersContainer) return;
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>У вас пока нет заказов</h3>
                    <p>Совершите первую покупку в нашем магазине</p>
                    <a href="../catalog.html" class="action-btn primary">Перейти в каталог</a>
                </div>
            `;
            return;
        }
        
        let ordersHTML = '';
        
        orders.forEach(order => {
            // Форматирование даты
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            
            // Текст статуса
            const statusTexts = {
                'pending': 'Ожидает оплаты',
                'processing': 'В обработке',
                'shipped': 'Отправлен',
                'delivered': 'Доставлен',
                'cancelled': 'Отменен'
            };
            
            // Класс статуса для стилизации
            const statusClass = 'status-' + order.status;
            
            // Форматирование суммы
            const formattedAmount = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
            }).format(order.total_amount);
            
            ordersHTML += `
                <div class="order-item">
                    <div class="order-info">
                        <h3>Заказ ${order.order_number}</h3>
                        <p>${formattedDate} • ${order.items_count || 1} товар(ов)</p>
                    </div>
                    <div class="order-status ${statusClass}">
                        ${statusTexts[order.status] || order.status}
                    </div>
                    <div class="order-amount">
                        ${formattedAmount}
                    </div>
                </div>
            `;
        });
        
        ordersContainer.innerHTML = ordersHTML;
    }
    
    // Обновление рекомендаций
    function updateRecommendations(recommendations) {
        const recommendationsContainer = document.getElementById('recommendations');
        if (!recommendationsContainer || recommendations.length === 0) return;
        
        let recommendationsHTML = '';
        
        recommendations.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0
            }).format(product.price);
            
            recommendationsHTML += `
                <div class="recommendation-card">
                    <a href="../product.html?id=${product.id}">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="price">${formattedPrice}</div>
                        </div>
                    </a>
                </div>
            `;
        });
        
        recommendationsContainer.innerHTML = recommendationsHTML;
    }
    
    // Загрузка количества товаров в корзине
    async function loadCartCount() {
        try {
            // В реальном проекте здесь будет запрос к API корзины
            const cartData = JSON.parse(localStorage.getItem('cart')) || [];
            const totalCount = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
            
            if (cartCount) {
                cartCount.textContent = totalCount;
                cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
            }
            
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    }
    
    // Показать сообщение
    function showMessage(type, text) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${text}</span>
        `;
        
        // Добавляем стили
        if (!document.querySelector('#messageStyles')) {
            const style = document.createElement('style');
            style.id = 'messageStyles';
            style.textContent = `
                .message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .message.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .message.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageEl);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }
    
    // Выход из системы
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch(this.href, {
                    method: 'POST',
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Очищаем localStorage
                    localStorage.clear();
                    
                    // Редирект
                    window.location.href = data.redirect || '../index.html';
                } else {
                    showMessage('error', 'Ошибка при выходе');
                }
                
            } catch (error) {
                console.error('Ошибка выхода:', error);
                // Все равно делаем редирект
                localStorage.clear();
                window.location.href = '../index.html';
            }
        });
    });
    
    // Обновление активности (периодическая проверка)
    setInterval(() => {
        checkAuth();
    }, 5 * 60 * 1000); // Каждые 5 минут
    
    // Обработка неактивности
    let lastActivity = Date.now();
    
    document.addEventListener('mousemove', () => lastActivity = Date.now());
    document.addEventListener('keypress', () => lastActivity = Date.now());
    document.addEventListener('click', () => lastActivity = Date.now());
    
    setInterval(() => {
        if (Date.now() - lastActivity > 30 * 60 * 1000) { // 30 минут
            showMessage('info', 'Сессия скоро истечет из-за неактивности');
        }
    }, 5 * 60 * 1000); // Проверка каждые 5 минут
});