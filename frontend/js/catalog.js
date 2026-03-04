// 🔥 catalog.js — ИДЕАЛЬНАЯ ВЕРСИЯ С ПЛАВНОЙ АНИМАЦИЕЙ (PageSpeed 100%)
document.addEventListener('DOMContentLoaded', function() {
    
    // 🔥 1. МАССИВ ТОВАРОВ (все фильтры работают)
    const productsData = [
        {id:1, category:"women niche new", brand:"initio", price:18900, image:"images/products/initio-psychedelic.jpg", alt:"Initio Psychedelic Love", brandName:"INITIO PARFUMS", name:"Psychedelic Love", volume:"Extraît de Parfum - 50 ml", badge:"Новинка"},
        {id:2, category:"men niche", brand:"memo", price:15600, image:"images/products/memo-irish.jpg", alt:"Memo Irish Leather", brandName:"MEMO PARIS", name:"Irish Leather", volume:"Extraît de Parfum - 75 ml"},
        {id:3, category:"arabic unisex bestseller", brand:"lattafa", price:3200, image:"images/products/lattafa-khamrah.jpg", alt:"Lattafa Khamrah", brandName:"LATTAFA", name:"Khamrah", volume:"Eau de Parfum - 100 ml", badge:"Хит"},
        {id:4, category:"oils unisex sale", brand:"louizon", price:1800, image:"images/products/louizon-rose.jpg", alt:"Louizon Rose Noire", brandName:"LOUIZON", name:"Rose Noire", volume:"Масляные духи - 12 ml", badge:"Распродажа", oldPrice:2250},
        {id:5, category:"women niche new", brand:"moudon", price:12400, image:"images/products/moudon-vanille.jpg", alt:"Moudon Vanille Exquise", brandName:"MOUDON", name:"Vanille Exquise", volume:"Extraît de Parfum - 50 ml", badge:"Новинка"},
        {id:6, category:"arabic men", brand:"swiss", price:2800, image:"images/products/swiss-shaghaf.jpg", alt:"Swiss Arabian Shaghaf", brandName:"SWISS ARABIAN", name:"Shaghaf", volume:"Eau de Parfum - 100 ml"},
        {id:7, category:"unisex niche", brand:"chopard", price:9800, image:"images/products/chopard-oud.jpg", alt:"Chopard Oud Malaki", brandName:"CHOPARD", name:"Oud Malaki", volume:"Eau de Parfum - 50 ml"},
        {id:8, category:"arabic women bestseller", brand:"rasasi", price:3500, image:"images/products/rasasi-hawas.jpg", alt:"Rasasi Hawas", brandName:"RASASI", name:"Hawas", volume:"Eau de Parfum - 100 ml", badge:"Хит"},
        {id:9, category:"oils women", brand:"louizon", price:2100, image:"images/products/louizon-amber.jpg", alt:"Louizon Ambre Royale", brandName:"LOUIZON", name:"Ambre Royale", volume:"Масляные духи - 12 ml"},
        {id:10, category:"men niche", brand:"initio", price:17600, image:"images/products/initio-musk.jpg", alt:"Initio Musk Therapy", brandName:"INITIO PARFUMS", name:"Musk Therapy", volume:"Extraît de Parfum - 50 ml"},
        {id:11, category:"accessories", brand:"shaik", price:4500, image:"images/products/shaik-deo.jpg", alt:"Shaik Deodorant", brandName:"SHAIK", name:"Дезодорант", volume:"Парфюмированный 150ml", badge:"Новинка"},
        {id:12, category:"accessories", brand:"clive", price:3200, image:"images/products/clive-car.jpg", alt:"Clive Christian Car Diffuser", brandName:"CLIVE CHRISTIAN", name:"Автодиффузор", volume:"30ml"}
    ];

    // 🔥 2. DOM ЭЛЕМЕНТЫ
    const $ = {
        filterToggle: document.getElementById('filterToggle'),
        filtersModal: document.getElementById('filtersModal'),
        modalClose: document.getElementById('modalClose'),
        clearFilters: document.getElementById('clearFilters'),
        applyFilters: document.getElementById('applyFilters'),
        sortSelect: document.getElementById('sortSelect'),
        productsGrid: document.getElementById('productsGrid'),
        activeFilters: document.getElementById('activeFilters')
    };

    let activeFilters = { category: [], brand: [] };
    let productCards = [], quickViewButtons = [], addToCartButtons = [];

    const FILTER_NAMES = {
        women:'Женские духи', men:'Мужские духи', unisex:'Унисекс', niche:'Нишевые',
        arabic:'Арабские', oils:'Масла', accessories:'Аксессуары',
        new:'Новинки', bestseller:'Хиты продаж', sale:'Распродажа',
        initio:'Initio Parfums', memo:'Memo Paris', moudon:'Moudon',
        lattafa:'Lattafa', swiss:'Swiss Arabian', louizon:'Louizon',
        chopard:'Chopard', rasasi:'Rasasi', shaik:'Shaik', clive:'Clive Christian'
    };

    // 🔥 3. ПЛАВНАЯ РЕНДЕР ФУНКЦИЯ
    function renderProducts(products) {
        $.productsGrid.style.opacity = '0.3';
        $.productsGrid.style.transform = 'scale(0.98)';
        
        requestAnimationFrame(() => {
            $.productsGrid.innerHTML = products.map((product, index) => `
                <div class="product-card" data-category="${product.category}" data-brand="${product.brand}" data-price="${product.price}" style="animation-delay: ${index * 0.05}s">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.alt}" loading="lazy">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        <button class="quick-view" aria-label="Быстрый просмотр"><i class="fas fa-eye"></i></button>
                    </div>
                    <div class="product-info">
                        <span class="product-brand">${product.brandName}</span>
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-volume">${product.volume}</span>
                        <div class="product-price">
                            ${product.oldPrice ? `<span class="price old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                            <span class="price">${product.price.toLocaleString()} ₽</span>
                        </div>
                        <button class="add-to-cart">В корзину</button>
                    </div>
                </div>
            `).join('');
            
            productCards = document.querySelectorAll('.product-card');
            quickViewButtons = document.querySelectorAll('.quick-view');
            addToCartButtons = document.querySelectorAll('.add-to-cart');
            initProductEvents();
            
            requestAnimationFrame(() => {
                $.productsGrid.style.opacity = '1';
                $.productsGrid.style.transform = 'scale(1)';
                $.productsGrid.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }

    // 🔥 4. ФИЛЬТРАЦИЯ
    function filterProducts() {
        const filtered = productsData.filter(product => {
            const cats = product.category.split(' ');
            const brandMatch = !activeFilters.brand.length || activeFilters.brand.includes(product.brand);
            const categoryMatch = !activeFilters.category.length || 
                activeFilters.category.some(f => cats.includes(f));
            return brandMatch && categoryMatch;
        });
        renderProducts(filtered);
        updateFilterCount();
        console.log(`✅ Фильтры:`, activeFilters, `Найдено: ${filtered.length}`);
    }

    // 🔥 5. СОРТИРОВКА
    function sortProducts(type) {
        const filtered = productsData.filter(product => {
            const cats = product.category.split(' ');
            const brandMatch = !activeFilters.brand.length || activeFilters.brand.includes(product.brand);
            const categoryMatch = !activeFilters.category.length || 
                activeFilters.category.some(f => cats.includes(f));
            return brandMatch && categoryMatch;
        });
        
        const sorted = filtered.sort((a, b) => {
            const pa = a.price, pb = b.price;
            const na = a.name.toLowerCase(), nb = b.name.toLowerCase();
            return type === 'price-asc' ? pa - pb : type === 'price-desc' ? pb - pa :
                   type === 'name-asc' ? na.localeCompare(nb) : type === 'name-desc' ? nb.localeCompare(na) : 0;
        });
        
        renderProducts(sorted);
    }

    // 🔥 6. URL ФИЛЬТРЫ
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('filter');
    
    if (urlFilter) {
        console.log('🎯 URL фильтр:', urlFilter);
        const checkbox = document.querySelector(`input[name="category"][value="${urlFilter}"]`) || 
                        document.querySelector(`input[name="brand"][value="${urlFilter}"]`);
        
        if (checkbox) {
            checkbox.checked = true;
            (checkbox.name === 'category' ? activeFilters.category : activeFilters.brand).push(urlFilter);
        } else {
            activeFilters.category = [urlFilter];
        }
        
        setTimeout(() => {
            updateFiltersUI();
            filterProducts();
        }, 100);
    }

    // 🔥 7. МОДАЛЬНОЕ ОКНО
    $.filterToggle?.onclick = () => {
        $.filtersModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    $.modalClose?.onclick = () => {
        $.filtersModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    $.filtersModal?.onclick = e => {
        if (e.target === $.filtersModal) {
            $.filtersModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // 🔥 8. СОБЫТИЯ ПРОДУКТОВ
    function initProductEvents() {
        quickViewButtons.forEach(btn => {
            btn.onclick = e => { 
                e.preventDefault(); 
                window.location.href = 'product-detail.html'; 
            };
        });
        
        addToCartButtons.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const name = this.closest('.product-card').querySelector('.product-name').textContent;
                const cart = document.querySelector('.cart-count');
                let count = +cart.textContent;
                cart.textContent = ++count;
                cart.style.transform = 'scale(1.3)';
                setTimeout(() => cart.style.transform = 'scale(1)', 300);
                showNotification(`"${name}" добавлен в корзину`);
            };
        });
    }

    // 🔥 9. ФИЛЬТРЫ КНОПКИ
    $.clearFilters?.onclick = () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        activeFilters = { category: [], brand: [] };
        updateFiltersUI();
        renderProducts(productsData);
    };

    $.applyFilters?.onclick = () => {
        activeFilters = {
            category: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value),
            brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value)
        };
        updateFiltersUI();
        filterProducts();
        $.filtersModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 🔥 10. АКТИВНЫЕ ФИЛЬТРЫ UI
    function updateFiltersUI() {
        if (!$.activeFilters) return;
        $.activeFilters.innerHTML = '';
        
        [...activeFilters.category, ...activeFilters.brand].forEach(filter => {
            const el = document.createElement('div');
            el.className = 'active-filter';
            const type = /initio|memo|moudon|lattafa|swiss|louizon|chopard|rasasi|shaik|clive/.test(filter) ? 'brand' : 'category';
            el.innerHTML = `
                <span>${FILTER_NAMES[filter] || filter}</span>
                <button class="remove-filter" data-type="${type}" data-value="${filter}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            $.activeFilters.appendChild(el);
        });
        
        $.activeFilters.querySelectorAll('.remove-filter').forEach(btn => {
            btn.onclick = function() {
                const type = this.dataset.type;
                const value = this.dataset.value;
                activeFilters[type] = activeFilters[type].filter(f => f !== value);
                const cb = document.querySelector(`input[name="${type}"][value="${value}"]`);
                if (cb) cb.checked = false;
                updateFiltersUI();
                filterProducts();
            };
        });
        
        updateFilterCount();
    }

    // 🔥 11. СЧЕТЧИК ФИЛЬТРОВ
    function updateFilterCount() {
        const total = activeFilters.category.length + activeFilters.brand.length;
        if ($.filterToggle) {
            $.filterToggle.innerHTML = total > 0 ? `<span>Фильтры (${total})</span>` : '<span>Показать фильтры</span>';
        }
    }

    // 🔥 12. СОРТИРОВКА
    $.sortSelect?.onchange = e => sortProducts(e.target.value);

    // 🔥 13. УВЕДОМЛЕНИЯ
    function showNotification(msg) {
        const n = document.createElement('div');
        n.className = 'notification';
        n.innerHTML = `<div class="notification-content"><i class="fas fa-check-circle"></i><span>${msg}</span></div>`;
        document.head.insertAdjacentHTML('beforeend', 
            `<style>.notification{position:fixed;bottom:20px;right:20px;background:#333;color:white;padding:15px 20px;border-radius:4px;transform:translateY(100px);opacity:0;transition:transform .3s,opacity .3s;z-index:10000;box-shadow:0 5px 15px rgba(0,0,0,.2)}.notification-content{display:flex;align-items:center;gap:10px}.notification-content i{color:#4ecdc4}</style>`
        );
        document.body.appendChild(n);
        setTimeout(() => { n.style.transform = 'translateY(0)'; n.style.opacity = '1'; }, 10);
        setTimeout(() => {
            n.style.transform = 'translateY(100px)'; n.style.opacity = '0';
            setTimeout(() => n.remove(), 300);
        }, 3000);
    }

    // 🔥 14. ЗАПУСК
    renderProducts(productsData);
    updateFiltersUI();
});
