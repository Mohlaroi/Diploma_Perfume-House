// Обработка страницы "Оптовикам"

document.addEventListener('DOMContentLoaded', function() {
    // FAQ аккордеон
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Закрываем все открытые вопросы
            document.querySelectorAll('.faq-question.active').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Если вопрос не был активен, открываем его
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
    
    // Обработка формы для оптовиков
    const wholesaleForm = document.getElementById('wholesaleForm');
    
    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация
            const company = document.getElementById('company').value.trim();
            const city = document.getElementById('city').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const volume = document.getElementById('volume').value;
            const agreement = document.getElementById('agreement').checked;
            
            if (!company || !city || !phone || !volume || !agreement) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Сбор данных формы
            const formData = {
                company: company,
                city: city,
                phone: phone,
                email: document.getElementById('email').value.trim(),
                category: document.getElementById('category').value,
                volume: volume,
                message: document.getElementById('message').value.trim()
            };
            
            console.log('Заявка от оптовика:', formData);
            
            // Показываем сообщение об успехе
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Спасибо за заявку!</h4>
                    <p>Мы свяжемся с вами в течение 2 часов для уточнения деталей и расчета стоимости.</p>
                    <p>Также вы можете написать нам в WhatsApp или Telegram для более быстрого ответа.</p>
                </div>
            `;
            
            // Вставляем сообщение перед формой
            wholesaleForm.parentNode.insertBefore(successMsg, wholesaleForm);
            
            // Скрываем форму
            wholesaleForm.style.display = 'none';
            
            // Через 8 секунд показываем форму снова (для тестирования)
            setTimeout(() => {
                wholesaleForm.style.display = 'block';
                successMsg.remove();
                wholesaleForm.reset();
            }, 8000);
        });
    }
    
    // Плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "Наверх"
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
});