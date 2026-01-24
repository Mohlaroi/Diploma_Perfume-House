// Простая реализация каталога как у Moudon

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const filterToggle = document.getElementById('filterToggle');
    const filtersModal = document.getElementById('filtersModal');
    const modalClose = document.getElementById('modalClose');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const sortSelect = document.getElementById('sortSelect');
    const productCards = document.querySelectorAll('.product-card');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Текущие активные фильтры
    let activeFilters = {
        category: [],
        brand: []
    };
    
    // Открытие/закрытие модального окна фильтров
    filterToggle.addEventListener('click', () => {
        filtersModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    modalClose.addEventListener('click', () => {
        filtersModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    filtersModal.addEventListener('click', (e) => {
        if (e.target === filtersModal || e.target.classList.contains('modal-overlay')) {
            filtersModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Очистка всех фильтров
    clearFiltersBtn.addEventListener('click', () => {
        // Сбрасываем все чекбоксы
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Очищаем активные фильтры
        activeFilters = { category: [], brand: [] };
        
        // Обновляем UI
        updateActiveFilters();
        filterProducts();
    });
    
    // Применение фильтров
    applyFiltersBtn.addEventListener('click', () => {
        // Собираем выбранные фильтры
        const selectedCategories = Array.from(
            document.querySelectorAll('input[name="category"]:checked')
        ).map(cb => cb.value);
        
        const selectedBrands = Array.from(
            document.querySelectorAll('input[name="brand"]:checked')
        ).map(cb => cb.value);
        
        activeFilters = {
            category: selectedCategories,
            brand: selectedBrands
        };
        
        // Обновляем UI
        updateActiveFilters();
        filterProducts();
        
        // Закрываем модальное окно
        filtersModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Обновление отображения активных фильтров
    function updateActiveFilters() {
        activeFiltersContainer.innerHTML = '';
        
        // Добавляем категории
        activeFilters.category.forEach(filter => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>${getFilterName(filter)}</span>
                <button class="remove-filter" data-type="category" data-value="${filter}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
        
        // Добавляем бренды
        activeFilters.brand.forEach(filter => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                <span>${getFilterName(filter)}</span>
                <button class="remove-filter" data-type="brand" data-value="${filter}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.remove-filter').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');
                
                // Удаляем фильтр из активных
                const index = activeFilters[type].indexOf(value);
                if (index > -1) {
                    activeFilters[type].splice(index, 1);
                }
                
                // Снимаем чекбокс в модальном окне
                const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Обновляем UI
                updateActiveFilters();
                filterProducts();
            });
        });
    }
    
    // Получение читаемого названия фильтра
    function getFilterName(filterValue) {
        const filterNames = {
            // Категории
            'women': 'Женские духи',
            'men': 'Мужские духи',
            'unisex': 'Унисекс',
            'niche': 'Нишевые',
            'arabic': 'Арабские',
            'oils': 'Масла на разлив',
            
            // Бренды
            'initio': 'Initio Parfums',
            'memo': 'Memo Paris',
            'moudon': 'Moudon',
            'lattafa': 'Lattafa',
            'swiss': 'Swiss Arabian',
            'louizon': 'Louizon',
            'chopard': 'Chopard',
            'rasasi': 'Rasasi'
        };
        
        return filterNames[filterValue] || filterValue;
    }
    
    // Фильтрация товаров
    function filterProducts() {
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const brand = card.getAttribute('data-brand');
            
            // Проверка категорий
            const categoryMatch = activeFilters.category.length === 0 || 
                activeFilters.category.some(filter => categories.includes(filter));
            
            // Проверка бренда
            const brandMatch = activeFilters.brand.length === 0 || 
                activeFilters.brand.includes(brand);
            
            // Показываем/скрываем карточку
            if (categoryMatch && brandMatch) {
                card.style.display = 'block';
                visibleCount++;
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Обновляем текст кнопки фильтра
        const totalActive = activeFilters.category.length + activeFilters.brand.length;
        filterToggle.innerHTML = totalActive > 0 
            ? `<span>Фильтры (${totalActive})</span>`
            : `<span>Показать фильтры</span>`;
    }
    
    // Сортировка товаров
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
    
    function sortProducts(sortType) {
        const products = Array.from(productCards);
        
        products.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const nameA = a.querySelector('.product-name').textContent.toLowerCase();
            const nameB = b.querySelector('.product-name').textContent.toLowerCase();
            
            switch(sortType) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });
        
        // Переставляем товары в DOM
        const grid = document.querySelector('.products-grid');
        products.forEach(product => {
            grid.appendChild(product);
        });
    }
    
    // Быстрый просмотр
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // В реальном проекте здесь будет открытие страницы товара
            window.location.href = 'product-detail.html';
        });
    });
    
    // Добавление в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            // Обновление счетчика корзины
            const cartCount = document.querySelector('.cart-count');
            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            
            // Анимация счетчика
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
            
            // Уведомление
            showNotification(`"${productName}" добавлен в корзину`);
            
            // В реальном проекте здесь будет AJAX-запрос
            console.log('Товар добавлен в корзину:', productName);
        });
    });
    
    // Функция уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем стили
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s, opacity 0.3s;
                z-index: 10000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                color: #4ecdc4;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
    
    // Инициализация
    updateActiveFilters();
});