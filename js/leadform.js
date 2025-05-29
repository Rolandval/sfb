/**
 * Lead Form Handler - Обробник форми заявки
 * 
 * Цей файл містить логіку для обробки форми заявки, включаючи:
 * - Валідацію полів
 * - Маску для телефону
 * - Відправку даних
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load Telegram service
    const telegramScript = document.createElement('script');
    telegramScript.src = 'js/telegram.js';
    telegramScript.async = true;
    document.head.appendChild(telegramScript);
    
    // Знаходимо форму заявки
    const leadForm = document.getElementById('lead-form-element');
    
    // Знаходимо поле телефону та додаємо маску
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        // setupPhoneMask(phoneInput);
    }
    
    // Обробка відправки форми
    if (leadForm) {
        leadForm.addEventListener('submit', handleFormSubmit);
    }
    
    /**
     * Обробляє відправку форми
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let isValid = true;

        // Валідація полів
        for (const [name, value] of formData.entries()) {
            const input = form.querySelector(`[name="${name}"]`);
            if (input && input.required && !value.trim()) {
                showError(input, 'Це поле обов\'язкове');
                isValid = false;
            } else if (name === 'email' && value && !isValidEmail(value)) {
                showError(input, 'Будь ласка, введіть коректний email');
                isValid = false;
            } else {
                clearError(input);
            }
        }

        if (!isValid) {
            return;
        }

        // Показуємо лоадер
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Відправка...';

        try {
            // Перевіряємо чи завантажено Telegram сервіс
            if (typeof window.TelegramService === 'undefined') {
                throw new Error('Сервіс відправки не завантажено. Будь ласка, оновіть сторінку.');
            }

            // Відправляємо дані в Telegram
            await window.TelegramService.sendFormData(data);
            
            // Якщо sendFormData не кинув помилку, значить успіх
            alert('Дякуємо за заявку! Ми зв\'яжемося з вами найближчим часом.');
            form.reset();
            
            // Скидаємо всі помилки валідації
            form.querySelectorAll('.is-invalid').forEach(el => {
                el.classList.remove('is-invalid');
                const feedback = el.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.remove();
                }
            });
        } catch (error) {
            console.error('Помилка при відправці форми в leadform.js:', error);
            // Display the specific error message from TelegramService or a generic one
            const errorMessage = error.message || 'Сталася невідома помилка при відправці форми. Будь ласка, спробуйте ще раз або зателефонуйте нам.';
            alert(errorMessage);
        } finally {
            // Приховуємо лоадер
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
    
    /**
     * Показує повідомлення про помилку
     */
    function showError(input, message) {
        const formControl = input.closest('.form-group') || input.parentElement;
        formControl.classList.add('error');
        
        let errorElement = formControl.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1 small';
            formControl.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('is-invalid');
    }
    
    /**
     * Очищає повідомлення про помилку
     */
    function clearError(input) {
        const formControl = input.closest('.form-group') || input.parentElement;
        formControl.classList.remove('error');
        
        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('is-invalid');
    }
    
    /**
     * Перевіряє коректність email
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Налаштовує маску для поля телефону
     * Формат: +38 (XXX) XX-XX-XXX
     */
    function setupPhoneMask(input) {
        const formatPhoneNumber = (value) => {
            if (!value) return "+38 (";

            let digits = value.replace(/\D/g, '');

            // Ensure the number starts with 38
            if (digits.startsWith('380')) {
                digits = digits.substring(3);
            } else if (digits.startsWith('38')) {
                digits = digits.substring(2);
            } else if (digits.startsWith('0')) {
                digits = digits.substring(1);
            }

            let formattedNumber = "+38 (";

            if (digits.length > 0) {
                formattedNumber += digits.substring(0, 3);
            }
            if (digits.length >= 3) {
                formattedNumber += ") ";
            }
            if (digits.length > 3) {
                formattedNumber += digits.substring(3, 5);
            }
            if (digits.length >= 5) {
                formattedNumber += "-";
            }
            if (digits.length > 5) {
                formattedNumber += digits.substring(5, 7);
            }
            if (digits.length >= 7) {
                formattedNumber += "-";
            }
            if (digits.length > 7) {
                formattedNumber += digits.substring(7, 9);
            }
            return formattedNumber;
        };

        input.addEventListener('input', (e) => {
            const target = e.target;
            const value = target.value;
            const cursorPos = target.selectionStart;
            
            // Don't format if user is deleting characters
            if (e.inputType === 'deleteContentBackward') {
                return;
            }
            
            const formatted = formatPhoneNumber(value);
            if (value !== formatted) {
                target.value = formatted;
                // Adjust cursor position
                const diff = formatted.length - value.length;
                target.setSelectionRange(cursorPos + diff, cursorPos + diff);
            }
        });

        // Format on page load if there's a value
        if (input.value) {
            input.value = formatPhoneNumber(input.value);
        }
    }
});
