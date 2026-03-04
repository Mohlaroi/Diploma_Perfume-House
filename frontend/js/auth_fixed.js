// auth.js - Полный файл для авторизации и регистрации

// Базовый URL для API запросов (определяем автоматически)

const API_BASE = './';
console.log('🔗 API_BASE:', API_BASE);

// Основная инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Auth.js загружен и инициализирован');
    
    // Инициализация всех форм
    initLoginForm();
    initRegisterForm();
    initPasswordToggle();
    initCookieNotice();
    initTestButtons();
    checkAuthStatus();
    
    // Тест подключения
    testConnection();
});

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================

// Тест подключения к API
async function testConnection() {
    try {
        const response = await fetch(API_BASE + 'test.php');
        if (response.ok) {
            console.log('✅ PHP API работает!');
        }
    } catch (error) {
        console.error('❌ PHP недоступен:', error);
    }
}
// Инициализация формы входа
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    console.log('Инициализация формы входа');
    
    // Валидация в реальном времени
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailField(this, 'emailError');
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePasswordField(this, 'passwordError');
        });
    }
    
    // Обработка отправки формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Попытка входа...');
        
        // Собираем данные
        const formData = {
            email: document.getElementById('loginEmail').value.trim(),
            password: document.getElementById('loginPassword').value,
            remember: document.getElementById('rememberMe')?.checked || false
        };
        
        // Валидация
        const errors = validateLoginData(formData);
        if (Object.keys(errors).length > 0) {
            showErrors(errors);
            showMessage('error', 'Исправьте ошибки в форме');
            return;
        }
        
        // Блокируем форму
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        setButtonLoading(submitBtn, true, 'Вход...');
        
        try {
            // Отправляем запрос
            const response = await fetch(API_BASE + 'login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('📡 Ответ сервера:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Данные ответа:', data);
            
            if (data.success) {
                showMessage('success', data.message || 'Вход выполнен успешно!');
                
                // Сохраняем данные пользователя
                if (data.data?.user) {
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                }
                
                // Редирект через 1 секунду
                setTimeout(() => {
                    const redirectUrl = data.data?.redirect || '../account/';
                    console.log('🔄 Редирект на:', redirectUrl);
                    window.location.href = redirectUrl;
                }, 1000);
                
            } else {
                showMessage('error', data.message || 'Ошибка входа');
                
                // Показываем тестовые данные если есть
                if (data.data?.test_credentials) {
                    const test = data.data.test_credentials;
                    showMessage('info', 
                        `Тестовые данные для отладки:<br>
                         Email: ${test.email}<br>
                         Пароль: ${test.password}`
                    );
                }
            }
            
        } catch (error) {
            console.error('❌ Ошибка при входе:', error);
            showMessage('error', 
                `Ошибка сети: ${error.message}<br><br>
                 Проверьте:<br>
                 1. Запущен ли PHP сервер?<br>
                 2. Правильный ли путь к файлам?<br>
                 3. Существует ли файл ${API_BASE}login.php?`
            );
            
            // Показываем текущие пути для отладки
            console.log('🔍 Отладка путей:');
            console.log('- API Base:', API_BASE);
            console.log('- Полный путь к login.php:', window.location.origin + API_BASE + 'login.php');
            console.log('- Текущий URL:', window.location.href);
            
        } finally {
            setButtonLoading(submitBtn, false, originalText);
        }
    });
}

// Инициализация формы регистрации
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    console.log('Инициализация формы регистрации');
    
    // Валидация пароля в реальном времени
    const passwordInput = document.getElementById('registerPassword');
    const confirmInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updatePasswordStrength(strength);
            
            // Проверка подтверждения
            if (confirmInput && confirmInput.value && password !== confirmInput.value) {
                showError('confirmPasswordError', 'Пароли не совпадают');
            } else {
                clearError('confirmPasswordError');
            }
        });
    }
    
    if (passwordInput && confirmInput) {
        confirmInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                showError('confirmPasswordError', 'Пароли не совпадают');
            } else {
                clearError('confirmPasswordError');
            }
        });
    }
    
    // Валидация email в реальном времени
    const emailInput = document.getElementById('registerEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailField(this, 'emailError');
        });
    }
    
    // Маска телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
    
    // Обработка отправки формы регистрации
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Попытка регистрации...');
        
        // Собираем данные
        const formData = {
            first_name: document.getElementById('firstName').value.trim(),
            last_name: document.getElementById('lastName').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            phone: document.getElementById('phone')?.value.trim() || '',
            password: document.getElementById('registerPassword').value,
            confirm_password: document.getElementById('confirmPassword').value,
            consent_pd: document.getElementById('consentPd')?.checked || false,
            consent_news: document.getElementById('consentNews')?.checked || false,
            consent_sms: document.getElementById('consentSms')?.checked || false,
            age_confirm: document.getElementById('ageConfirm')?.checked || false
        };
        
        // Валидация
        const errors = validateRegistrationData(formData);
        if (Object.keys(errors).length > 0) {
            showErrors(errors);
            showMessage('error', 'Исправьте ошибки в форме');
            return;
        }
        
        // Блокируем форму
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        setButtonLoading(submitBtn, true, 'Регистрация...');
        
        try {
            // Отправляем запрос
            const response = await fetch(API_BASE + 'register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('📡 Ответ сервера:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Данные ответа:', data);
            
            if (data.success) {
                showMessage('success', data.message || 'Регистрация успешна!');
                
                // Сохраняем пользователя
                if (data.data?.user) {
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                }
                
                // Если нужно подтверждение email
                if (data.data?.needs_verification) {
                    const email = formData.email;
                    setTimeout(() => {
                        window.location.href = `verify-email.html?email=${encodeURIComponent(email)}`;
                    }, 2000);
                } else {
                    // Редирект на личный кабинет
                    setTimeout(() => {
                        const redirectUrl = data.data?.redirect || '../account/';
                        console.log('🔄 Редирект на:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 1500);
                }
                
            } else {
                showMessage('error', data.message || 'Ошибка регистрации');
                
                // Показываем ошибки полей
                if (data.data?.errors) {
                    showErrors(data.data.errors);
                }
            }
            
        } catch (error) {
            console.error('❌ Ошибка при регистрации:', error);
            showMessage('error', 
                `Ошибка сети: ${error.message}<br><br>
                 Проверьте:<br>
                 1. Запущен ли PHP сервер?<br>
                 2. Существует ли файл ${API_BASE}register.php?`
            );
            
        } finally {
            setButtonLoading(submitBtn, false, originalText);
        }
    });
}

// Инициализация переключателей видимости пароля
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Скрыть пароль');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Показать пароль');
            }
        });
    });
}

// Инициализация уведомления о cookies
function initCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const cookieAccept = document.getElementById('cookieAccept');
    
    if (!cookieNotice || !cookieAccept) return;
    
    // Проверяем, не принимал ли пользователь уже согласие
    const cookieAccepted = localStorage.getItem('cookie_accepted');
    
    if (!cookieAccepted) {
        cookieNotice.style.display = 'flex';
    }
    
    cookieAccept.addEventListener('click', function() {
        localStorage.setItem('cookie_accepted', 'true');
        localStorage.setItem('cookie_accepted_date', new Date().toISOString());
        cookieNotice.style.display = 'none';
    });
}

// Инициализация тестовых кнопок (только для разработки)
function initTestButtons() {
    // Кнопка тестового входа
    const loginBox = document.getElementById('loginBox');
    if (loginBox) {
        const testBtn = document.createElement('button');
        testBtn.type = 'button';
        testBtn.className = 'test-btn';
        testBtn.innerHTML = '<i class="fas fa-vial"></i> Заполнить тестовые данные';
        
        // Стили для кнопки
        testBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        `;
        
        testBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
        });
        
        testBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        testBtn.addEventListener('click', function() {
            document.getElementById('loginEmail').value = 'test@example.com';
            document.getElementById('loginPassword').value = 'Test123!';
            document.getElementById('rememberMe').checked = true;
            showMessage('success', 'Тестовые данные заполнены. Нажмите "Войти"');
        });
        
        loginBox.querySelector('.auth-form').appendChild(testBtn);
    }
    
    // Кнопка диагностики
    const diagnosticBtn = document.createElement('button');
    diagnosticBtn.type = 'button';
    diagnosticBtn.innerHTML = '🛠️ Диагностика';
    
    diagnosticBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #666;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
        font-size: 12px;
        opacity: 0.8;
        transition: opacity 0.3s;
    `;
    
    diagnosticBtn.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
    });
    
    diagnosticBtn.addEventListener('mouseleave', function() {
        this.style.opacity = '0.8';
    });
    
    diagnosticBtn.onclick = () => {
        const diagnosticUrl = API_BASE.replace('php/', '') + 'diagnostic.php';
        window.open(diagnosticUrl, '_blank');
    };
    
    document.body.appendChild(diagnosticBtn);
}

// Проверка статуса авторизации
function checkAuthStatus() {
    // Проверяем наличие сессионного токена
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});
    
    // Если пользователь уже авторизован и находится на странице входа/регистрации
    if (cookies.session_token) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            console.log('👤 Пользователь уже авторизован, редирект в личный кабинет');
            setTimeout(() => {
                window.location.href = '../account/';
            }, 1000);
        }
    }
}

// ==================== ФУНКЦИИ ВАЛИДАЦИИ ====================

// Валидация данных для входа
function validateLoginData(data) {
    const errors = {};
    
    if (!data.email) {
        errors.email = 'Введите email';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Неверный формат email';
    }
    
    if (!data.password) {
        errors.password = 'Введите пароль';
    } else if (data.password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    return errors;
}

// Валидация данных для регистрации
function validateRegistrationData(data) {
    const errors = {};
    
    // Имя
    if (!data.first_name || data.first_name.length < 2) {
        errors.first_name = 'Имя должно быть не менее 2 символов';
    }
    
    // Фамилия
    if (!data.last_name || data.last_name.length < 2) {
        errors.last_name = 'Фамилия должна быть не менее 2 символов';
    }
    
    // Email
    if (!data.email) {
        errors.email = 'Введите email';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Неверный формат email';
    }
    
    // Пароль
    const strength = checkPasswordStrength(data.password);
    if (!data.password) {
        errors.password = 'Введите пароль';
    } else if (data.password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
    } else if (strength < 2) {
        errors.password = 'Пароль слишком простой. Добавьте цифры и заглавные буквы';
    }
    
    // Подтверждение пароля
    if (!data.confirm_password) {
        errors.confirm_password = 'Подтвердите пароль';
    } else if (data.password !== data.confirm_password) {
        errors.confirm_password = 'Пароли не совпадают';
    }
    
    // Согласия
    if (!data.consent_pd) {
        errors.consent_pd = 'Необходимо согласие на обработку персональных данных';
    }
    
    if (!data.age_confirm) {
        errors.age_confirm = 'Подтвердите, что вам исполнилось 18 лет';
    }
    
    return errors;
}

// Валидация email поля
function validateEmailField(input, errorId) {
    const email = input.value.trim();
    
    if (!email) {
        showError(errorId, 'Введите email');
    } else if (!validateEmail(email)) {
        showError(errorId, 'Неверный формат email');
    } else {
        clearError(errorId);
    }
}

// Валидация поля пароля
function validatePasswordField(input, errorId) {
    const password = input.value;
    
    if (!password) {
        showError(errorId, 'Введите пароль');
    } else if (password.length < 6) {
        showError(errorId, 'Минимум 6 символов');
    } else {
        clearError(errorId);
    }
}

// Проверка email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Проверка сложности пароля
function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Длина
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Содержит цифры
    if (/\d/.test(password)) strength++;
    
    // Содержит буквы в разных регистрах
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    
    // Содержит спецсимволы
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4); // Максимум 4
}

// Обновление индикатора сложности пароля
function updatePasswordStrength(strength) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    // Обновляем ширину и цвет
    const width = ['0%', '25%', '50%', '75%', '100%'][strength];
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'];
    const texts = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Отличный'];
    
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = colors[strength];
    strengthText.textContent = texts[strength];
    strengthText.style.color = colors[strength];
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Показать сообщение
function showMessage(type, text) {
    // Удаляем старые сообщения
    const oldMessages = document.querySelectorAll('.message-popup');
    oldMessages.forEach(msg => msg.remove());
    
    // Создаем новое сообщение
    const message = document.createElement('div');
    message.className = `message-popup ${type}`;
    
    // Иконки для разных типов сообщений
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    message.innerHTML = `
        <div class="message-content">
            <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    // Стили для сообщения
    const style = document.createElement('style');
    style.textContent = `
        .message-popup {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 500px;
            padding: 20px;
            border-radius: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .message-popup.success {
            background: linear-gradient(135deg, rgba(212, 237, 218, 0.95) 0%, rgba(195, 230, 203, 0.95) 100%);
            color: #0f5132;
            border-color: #badbcc;
        }
        
        .message-popup.error {
            background: linear-gradient(135deg, rgba(248, 215, 218, 0.95) 0%, rgba(245, 198, 203, 0.95) 100%);
            color: #842029;
            border-color: #f5c2c7;
        }
        
        .message-popup.info {
            background: linear-gradient(135deg, rgba(207, 226, 255, 0.95) 0%, rgba(158, 197, 254, 0.95) 100%);
            color: #084298;
            border-color: #b6d4fe;
        }
        
        .message-popup.warning {
            background: linear-gradient(135deg, rgba(255, 243, 205, 0.95) 0%, rgba(255, 230, 156, 0.95) 100%);
            color: #664d03;
            border-color: #ffecb5;
        }
        
        .message-content {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        
        .message-content i {
            font-size: 1.5rem;
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .message-text {
            line-height: 1.5;
            font-size: 0.95rem;
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
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#message-styles')) {
        style.id = 'message-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 5000);
    
    // Закрытие по клику
    message.addEventListener('click', function() {
        this.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Показать ошибку в поле
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.style.color = '#dc3545';
        errorEl.style.fontSize = '0.85rem';
        errorEl.style.marginTop = '5px';
        
        // Подсвечиваем поле
        const inputId = elementId.replace('Error', '');
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = '#dc3545';
            input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        }
    }
}

// Очистить ошибку
function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        
        const inputId = elementId.replace('Error', '');
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        }
    }
}

// Показать несколько ошибок
function showErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorId = field + 'Error';
        showError(errorId, errors[field]);
    });
}

// Установить состояние загрузки кнопки
function setButtonLoading(button, isLoading, text) {
    if (isLoading) {
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
        
        if (text) {
            button.innerHTML = `
                <div class="spinner" style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                "></div>
                ${text}
            `;
        }
    } else {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
        
        if (text && typeof text === 'string') {
            button.innerHTML = text;
        } else if (text && typeof text === 'object') {
            button.innerHTML = text;
        }
    }
}

// Добавляем стили для спиннера
if (!document.querySelector('#spinner-styles')) {
    const spinnerStyle = document.createElement('style');
    spinnerStyle.id = 'spinner-styles';
    spinnerStyle.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
    `;
    document.head.appendChild(spinnerStyle);
}

// ==================== ОБРАБОТКА СОЦИАЛЬНЫХ КНОПОК ====================

// Инициализация социальных кнопок
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('vk-btn') ? 'VK' : 
                       this.classList.contains('google-btn') ? 'Google' : 'Социальная сеть';
        
        showMessage('info', 
            `Вход через ${provider} временно недоступен.<br>
             Пожалуйста, используйте стандартную форму входа.`
        );
    });
});

// ==================== ЗАЩИТА ОТ ВСТАВКИ ПАРОЛЯ ====================

document.addEventListener('copy', function(e) {
    const activeEl = document.activeElement;
    if (activeEl && activeEl.type === 'password') {
        showMessage(
            'warning',
            '⚠️ Копирование пароля небезопасно!<br> Рекомендуем использовать менеджер паролей.'
        );
    }
});

// ==================== ОБРАБОТКА НЕАКТИВНОСТИ ====================

let lastActivity = Date.now();

// Обновляем время при активности
['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
    document.addEventListener(event, () => {
        lastActivity = Date.now();
    });
});

// Проверка неактивности каждые 5 минут
setInterval(() => {
    const inactiveTime = Date.now() - lastActivity;
    const warningThreshold = 25 * 60 * 1000; // 25 минут
    const logoutThreshold = 30 * 60 * 1000; // 30 минут
    
    if (inactiveTime > warningThreshold && inactiveTime < logoutThreshold) {
        const minutesLeft = Math.ceil((logoutThreshold - inactiveTime) / 60000);
        showMessage('warning', 
            `Сессия будет закрыта через ${minutesLeft} минут из-за неактивности.<br>
             Пожалуйста, обновите страницу или выполните действие.`
        );
    }
}, 5 * 60 * 1000); // Проверка каждые 5 минут

// ==================== ОБРАБОТКА ПЕРЕЗАГРУЗКИ СТРАНИЦЫ ====================

window.addEventListener('beforeunload', function(e) {
    // Сохраняем состояние формы при перезагрузке
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const formData = {
            email: document.getElementById('loginEmail')?.value || '',
            remember: document.getElementById('rememberMe')?.checked || false
        };
        localStorage.setItem('loginFormData', JSON.stringify(formData));
    }
});

// Восстановление формы при загрузке
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('loginFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            const emailInput = document.getElementById('loginEmail');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (emailInput && formData.email) {
                emailInput.value = formData.email;
            }
            
            if (rememberCheckbox) {
                rememberCheckbox.checked = formData.remember;
            }
        } catch (e) {
            console.log('Не удалось восстановить данные формы');
        }
    }
});

// ==================== ЛОГГИРОВАНИЕ ДЕЙСТВИЙ ====================

// Логируем важные действия (только в development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Режим разработки: логирование включено');
    
    // Логируем клики по формам
    document.addEventListener('click', function(e) {
        if (e.target.closest('form') || e.target.closest('.submit-btn')) {
            console.log('🖱️ Клик по форме или кнопке отправки');
        }
    });
}

// ==================== ДЕБАГ ФУНКЦИИ ====================

// Функция для отладки (доступна из консоли)
window.debugAuth = {
    testConnection: async function() {
        console.log('🔍 Тестирование подключения...');
        try {
            const response = await fetch(API_BASE + 'test.php');
            console.log('Статус:', response.status);
            const text = await response.text();
            console.log('Ответ:', text.substring(0, 200) + '...');
        } catch (error) {
            console.error('Ошибка:', error);
        }
    },
    
    checkDatabase: async function() {
        console.log('🔍 Проверка базы данных...');
        try {
            const response = await fetch(API_BASE + 'login.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: 'test@example.com', password: 'Test123!'})
            });
            const data = await response.json();
            console.log('Ответ БД:', data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    },
    
    clearStorage: function() {
        localStorage.clear();
        console.log('✅ LocalStorage очищен');
    },
    
    showInfo: function() {
        console.log('=== ИНФОРМАЦИЯ О СИСТЕМЕ ===');
        console.log('API Base:', API_BASE);
        console.log('Текущий URL:', window.location.href);
        console.log('Путь:', window.location.pathname);
        console.log('Пользователь в localStorage:', localStorage.getItem('user'));
        console.log('Cookie session_token:', document.cookie.includes('session_token'));
        console.log('===========================');
    }
};

console.log('ℹ️ Для отладки используйте debugAuth в консоли:');
console.log('- debugAuth.testConnection() - проверить подключение');
console.log('- debugAuth.checkDatabase() - проверить базу данных');
console.log('- debugAuth.clearStorage() - очистить localStorage');
console.log('- debugAuth.showInfo() - показать информацию');

// ==================== ЭКСПОРТ ФУНКЦИЙ ====================

// Экспортируем функции для использования в других файлах
window.authModule = {
    showMessage,
    validateEmail,
    checkPasswordStrength,
    API_BASE
};

console.log('✅ Модуль авторизации полностью загружен и готов к работе!');