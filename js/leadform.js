/**
 * Lead Form Handler - Обробник форми заявки
 * 
 * Цей файл містить логіку для обробки форми заявки, включаючи:
 * - Валідацію полів
 * - Маску для телефону
 * - Відправку даних
 */

document.addEventListener('DOMContentLoaded', function() {
    // Знаходимо форму заявки
    const leadForm = document.getElementById('lead-form-element');
    
    // Знаходимо поле телефону та додаємо маску
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        setupPhoneMask(phoneInput);
    }
    
    // Обробка відправки форми
    if (leadForm) {
        leadForm.addEventListener('submit', handleFormSubmit);
    }
    
    /**
     * Налаштовує маску для поля телефону
     * Формат: +38 (XXX) XX-XX-XXXX
     */
    function setupPhoneMask(input) {
        const prefixNumber = (str) => {
            if (str.startsWith('8') || str.startsWith('0')) { // Handle cases like 8050... or 050...
                return '3' + str;
            }
            return str;
        };

        const formatPhoneNumber = (value) => {
            if (!value) return "+38 (";

            let digits = value.replace(/\D/g, '');

            // Ensure the number starts with 380
            if (digits.startsWith('380')) {
                digits = digits.substring(3); // Remove 380, keep the rest
            } else if (digits.startsWith('38')) {
                 // handles case where user types +38 and then starts typing operator code
                digits = digits.substring(2);
            } else if (digits.startsWith('0')) {
                // If starts with 0, it's part of the operator code after 38
                // No change needed here, it will be handled below
            } else if (digits.length > 0 && digits.length <= 10 && !digits.startsWith('3')) {
                // If user starts typing operator code directly without 0
                // and it's not starting with 3 (e.g. 501234567)
                // we assume it's a Ukrainian number missing the initial 0
                // or they deleted the initial 0
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
                formattedNumber += digits.substring(7, 10);
            }
            return formattedNumber;
        };

        input.addEventListener('input', (e) => {
            const target = e.target;
            let value = target.value;
            const originalCursorPos = target.selectionStart;
            let originalDigits = value.substring(0, originalCursorPos).replace(/\D/g, '');

            // Handle cases where +38 ( is deleted
            if (!value.startsWith('+38 (') && value.length < 5) {
                 target.value = '+38 (';
                 target.setSelectionRange(5,5);
                 return;
            }


            let digits = value.replace(/\D/g, '');

            if (digits.startsWith('380')) {
                digits = digits.substring(3);
            } else if (digits.startsWith('38')) {
                digits = digits.substring(2);
            }
            // Limit to 10 digits for the main number part (XXX XX XX XXX)
            digits = digits.substring(0, 10);


            let formatted = "+38 (";
            let nonDigitCharsBeforeCursor = 0;
            let currentDigitGroup = 0;

            if (digits.length > 0) {
                formatted += digits.substring(0, Math.min(3, digits.length));
            }
            if (digits.length >= 3) {
                formatted += ") ";
            }
            if (digits.length > 3) {
                formatted += digits.substring(3, Math.min(5, digits.length));
            }
            if (digits.length >= 5) {
                formatted += "-";
            }
            if (digits.length > 5) {
                formatted += digits.substring(5, Math.min(7, digits.length));
            }
            if (digits.length >= 7) {
                formatted += "-";
            }
            if (digits.length > 7) {
                formatted += digits.substring(7, Math.min(10, digits.length));
            }

            target.value = formatted;

            // Calculate new cursor position
            let newCursorPos = 0;
            let numDigitsProcessed = 0;
            const prefix = "+38 (";

            if (originalCursorPos <= prefix.length) {
                newCursorPos = prefix.length;
            } else {
                newCursorPos = prefix.length; // Start after "+38 ("
                let digitsInOriginal = originalDigits;
                if (originalDigits.startsWith('380')) digitsInOriginal = originalDigits.substring(3);
                else if (originalDigits.startsWith('38')) digitsInOriginal = originalDigits.substring(2);


                for (let i = 0; i < digitsInOriginal.length; i++) {
                    newCursorPos++; // Move for the digit
                    if (i === 2) newCursorPos += 2; // After XXX, add for ") "
                    if (i === 4) newCursorPos += 1; // After XX, add for "-"
                    if (i === 6) newCursorPos += 1; // After XX, add for "-"
                    if (newCursorPos > formatted.length) break;
                }
                 // If a formatting char was just added right before where cursor should be
                if (originalCursorPos === target.selectionStart && originalCursorPos > 0 && !/\d/.test(value[originalCursorPos-1]) && /\d/.test(value[originalCursorPos-2])) {
                     //This case handles when a user types a digit that causes a formatting char to be inserted
                     //e.g. +38 (050)1 -> +38 (050) 1, cursor should move after the space
                } else if (value.length > formatted.length && originalCursorPos === formatted.length -1 && !/\d/.test(formatted[originalCursorPos])) {
                    // If typing at the end and a formatting char was added
                    newCursorPos = formatted.length;
                }


                // Correction if cursor is beyond the current formatted length
                if (newCursorPos > formatted.length) {
                    newCursorPos = formatted.length;
                }
            }
             // If user is deleting and cursor is right after a formatting char, move it before
            if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
                if (originalCursorPos > 0 && !/\d/.test(formatted[originalCursorPos - 1]) && formatted[originalCursorPos -1] !== '(') {
                     // Check if the character before the original cursor position was a non-digit (and not the opening parenthesis)
                     // This means we just deleted a digit and landed on a formatting character
                     // Example: +38 (050) 12-34-56|7 -> delete -> +38 (050) 12-34-5|6
                     // We need to find the correct position based on remaining digits.
                     // Let's recalculate based on current digits up to cursor
                     let currentDigitsBeforeCursor = formatted.substring(0, originalCursorPos).replace(/\D/g, '');
                     if (currentDigitsBeforeCursor.startsWith('380')) currentDigitsBeforeCursor = currentDigitsBeforeCursor.substring(3);
                     else if (currentDigitsBeforeCursor.startsWith('38')) currentDigitsBeforeCursor = currentDigitsBeforeCursor.substring(2);

                     newCursorPos = prefix.length;
                     for (let i = 0; i < currentDigitsBeforeCursor.length; i++) {
                         newCursorPos++;
                         if (i === 2) newCursorPos += 2;
                         if (i === 4) newCursorPos += 1;
                         if (i === 6) newCursorPos += 1;
                     }
                }
            }


            // Ensure cursor is not placed before "+38 ("
            if (newCursorPos < prefix.length) {
                newCursorPos = prefix.length;
            }
            // Ensure cursor is not beyond the length of the formatted string
            if (newCursorPos > formatted.length) {
                newCursorPos = formatted.length;
            }

            target.setSelectionRange(newCursorPos, newCursorPos);

        });

        input.addEventListener('keydown', (e) => {
            const target = e.target;
            const cursorPos = target.selectionStart;

            // Prevent deleting "+38 ("
            if ((e.key === 'Backspace' && cursorPos <= 5) || (e.key === 'Delete' && cursorPos < 5)) {
                e.preventDefault();
            }

            // If backspacing and cursor is right after a formatting char, move cursor before it
            if (e.key === 'Backspace') {
                if (cursorPos > 5 && !/\d/.test(target.value[cursorPos - 1])) {
                    // If char before cursor is a formatting char (and not part of +38 ()
                    // e.g. +38 (XXX) |XX-XX-XXX, pressing backspace
                    // We want to delete X, not )
                    // So, move cursor one step back. The 'input' event will handle reformatting.
                    // target.setSelectionRange(cursorPos - 1, cursorPos - 1);
                    // No, this is too complex. The input event should handle it.
                    // Let's allow default backspace behavior and let input event re-format.
                }
            }
        });

        input.addEventListener('focus', (e) => {
            const target = e.target;
            if (!target.value || target.value.replace(/\D/g, '').length <= 2) { // <=2 to account for "38"
                target.value = '+38 (';
                target.setSelectionRange(5, 5);
            } else {
                // Set cursor to the end if already filled
                let digits = target.value.replace(/\D/g, '');
                if (digits.startsWith('380')) digits = digits.substring(3);
                else if (digits.startsWith('38')) digits = digits.substring(2);

                let newCursorPos = 5; // after "+38 ("
                 for (let i = 0; i < digits.length; i++) {
                    newCursorPos++;
                    if (i === 2) newCursorPos += 2; // ") "
                    if (i === 4) newCursorPos += 1; // "-"
                    if (i === 6) newCursorPos += 1; // "-"
                    if (newCursorPos > target.value.length) break;
                }
                target.setSelectionRange(Math.min(newCursorPos, target.value.length), Math.min(newCursorPos, target.value.length));
            }
        });

        // Initial formatting if the field already has a value (e.g. from autocomplete)
        if (input.value) {
            let digitsOnly = input.value.replace(/\D/g, '');
            if (digitsOnly.startsWith('380')) {
                 input.value = formatPhoneNumber(digitsOnly);
            } else if (digitsOnly.startsWith('38') && digitsOnly.length > 2) {
                 input.value = formatPhoneNumber('380' + digitsOnly.substring(2));
            } else if (digitsOnly.length === 10 && !digitsOnly.startsWith('0')) { // e.g. 501234567
                 input.value = formatPhoneNumber('380' + digitsOnly);
            } else if (digitsOnly.length === 10 && digitsOnly.startsWith('0')) { // e.g. 0501234567
                 input.value = formatPhoneNumber('38' + digitsOnly);
            } else if (digitsOnly.length > 0) {
                 input.value = formatPhoneNumber('380' + digitsOnly);
            } else {
                input.value = '+38 (';
            }
        } else {
             input.value = '+38 (';
        }
    }
    
    /**
     * Обробляє відправку форми
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = this.querySelector('[name="name"]').value.trim();
        const phone = this.querySelector('[name="phone"]').value.trim();
        const email = this.querySelector('[name="email"]').value.trim();
        const power = this.querySelector('[name="power"]').value;
        
        // Валідація форми
        let isValid = true;
        
        if (!name) {
            showError(this.querySelector('[name="name"]'), 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        } else {
            clearError(this.querySelector('[name="name"]'));
        }
        
        if (!phone) {
            showError(this.querySelector('[name="phone"]'), 'Будь ласка, введіть ваш телефон');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError(this.querySelector('[name="phone"]'), 'Введіть коректний номер телефону');
            isValid = false;
        } else {
            clearError(this.querySelector('[name="phone"]'));
        }
        
        if (email && !isValidEmail(email)) {
            showError(this.querySelector('[name="email"]'), 'Введіть коректний email');
            isValid = false;
        } else {
            clearError(this.querySelector('[name="email"]'));
        }
        
        if (isValid) {
            // Підготовка даних форми
            const formData = {
                name: name,
                phone: phone,
                email: email,
                power: power,
                comment: this.querySelector('[name="comment"]').value.trim(),
                source: window.location.href
            };
            
            // Показуємо стан завантаження
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Відправляємо...';
            
            // Імітуємо відправку форми (в реальному проекті замінити на API-запит)
            setTimeout(() => {
                // Скидаємо форму
                this.reset();
                
                // Показуємо повідомлення про успіх
                const formContainer = document.querySelector('.form-container');
                formContainer.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Дякуємо за заявку!</h3>
                        <p>Наш менеджер зв'яжеться з вами протягом 10 хвилин.</p>
                        <a href="#" class="cta-btn primary" onclick="location.reload()">Повернутися на сайт</a>
                    </div>
                `;
                
                // В реальному проекті відправляємо дані на сервер
                console.log('Form submitted:', formData);
                
                // Відправляємо дані в Telegram
                sendToTelegram(formData);
                
            }, 1500);
        }
    }
    
    /**
     * Показує повідомлення про помилку
     */
    function showError(input, message) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message') || document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formControl.querySelector('.error-message')) {
            formControl.appendChild(errorElement);
        }
        
        formControl.classList.add('error');
    }
    
    /**
     * Очищає повідомлення про помилку
     */
    function clearError(input) {
        const formControl = input.parentElement;
        formControl.classList.remove('error');
        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Перевіряє коректність email
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Перевіряє коректність номера телефону
     */
    function isValidPhone(phone) {
        // Перевіряємо, що номер містить 12 цифр (з кодом країни)
        const digits = phone.replace(/\D/g, '');
        return digits.length === 12 && digits.startsWith('38');
    }
    
    /**
     * Відправляє дані в Telegram
     */
    function sendToTelegram(formData) {
        const botToken = '7767027068:AAGyyNHsn6OiaLWB9IrE3z08sUaG5YHhELI';
        const chatId = '-4764124672';
        
        const text = `
🚀 Нова заявка з сайту!
        
👤 Ім'я: ${formData.name}
📞 Телефон: ${formData.phone}
✉️ Email: ${formData.email || 'Не вказано'}
⚡ Потужність: ${formData.power}
💬 Коментар: ${formData.comment || 'Не вказано'}
🔗 Джерело: ${formData.source}
        `;
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}&parse_mode=HTML`;
        
        // Створюємо приховане зображення для відправки запиту
        const img = document.createElement('img');
        img.style.display = 'none';
        img.src = url;
        document.body.appendChild(img);
        
        // Видаляємо елемент після завантаження
        img.onload = function() {
            document.body.removeChild(img);
        };
        
        img.onerror = function() {
            document.body.removeChild(img);
        };
    }
});
