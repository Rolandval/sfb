document.addEventListener('DOMContentLoaded', function() {
    // Scroll animations implementation directly
    const animateElements = document.querySelectorAll('.animate');
    
    const animateOnScroll = function() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial check for elements in view
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // FAQ Accordion functionality implementation
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
    
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            body.classList.toggle('mobile-nav-active');
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (body.classList.contains('mobile-nav-active') && 
            !e.target.closest('.mobile-nav-toggle') && 
            !e.target.closest('.mobile-nav')) {
            body.classList.remove('mobile-nav-active');
        }
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else if (savedTheme === 'blue-yellow') {
        body.classList.add('blue-yellow-theme');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-theme')) {
                // Switch to blue-yellow theme
                body.classList.remove('dark-theme');
                body.classList.add('blue-yellow-theme');
                localStorage.setItem('theme', 'blue-yellow');
            } else if (body.classList.contains('blue-yellow-theme')) {
                // Switch to light theme
                body.classList.remove('blue-yellow-theme');
                localStorage.setItem('theme', 'light');
            } else {
                // Switch to dark theme
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile nav if open
                if (body.classList.contains('mobile-nav-active')) {
                    body.classList.remove('mobile-nav-active');
                }
            }
        });
    });
    
    // Цей блок видалено, оскільки він дублюється з блоком вище
    
    // Form validation
    const leadForm = document.getElementById('lead-form-element');
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="name"]').value.trim();
            const phone = this.querySelector('[name="phone"]').value.trim();
            const email = this.querySelector('[name="email"]').value.trim();
            const power = this.querySelector('[name="power"]').value;
            
            // Simple validation
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
                // Prepare form data
                const formData = {
                    name: name,
                    phone: phone,
                    email: email,
                    power: power,
                    comment: this.querySelector('[name="comment"]').value.trim(),
                    source: window.location.href
                };
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Відправляємо...';
                
                // Simulate form submission (in a real project, replace with actual API call)
                setTimeout(() => {
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    const formContainer = document.querySelector('.form-container');
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Дякуємо за заявку!</h3>
                            <p>Наш менеджер зв'яжеться з вами протягом 10 хвилин.</p>
                            <a href="#" class="cta-btn primary" onclick="location.reload()">Повернутися на сайт</a>
                        </div>
                    `;
                    
                    // In a real project, send data to server
                    console.log('Form submitted:', formData);
                    
                    // Send data to Telegram bot
                    sendToTelegram(formData);
                    
                }, 1500);
            }
        });
    }
    
    // Helper functions for form validation
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
    
    function clearError(input) {
        const formControl = input.parentElement;
        formControl.classList.remove('error');
        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function isValidPhone(phone) {
        // Simple validation for Ukrainian numbers
        const re = /^(\+?38)?(0\d{9})$/;
        return re.test(String(phone).replace(/\s/g, ''));
    }
    
    // Send lead to Telegram
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
        
        // Create a hidden image to send the request
        const img = document.createElement('img');
        img.style.display = 'none';
        img.src = url;
        document.body.appendChild(img);
        
        // Remove the image after a delay
        setTimeout(() => {
            document.body.removeChild(img);
        }, 5000);
    }
    
    // Phone number mask for input
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            let formatted = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formatted = '+38(0' + value;
                } else if (value.length <= 5) {
                    formatted = '+38(0' + value.substring(0, 2) + ') ' + value.substring(2);
                } else if (value.length <= 8) {
                    formatted = '+38(0' + value.substring(0, 2) + ') ' + value.substring(2, 5) + '-' + value.substring(5);
                } else {
                    formatted = '+38(0' + value.substring(0, 2) + ') ' + value.substring(2, 5) + '-' + value.substring(5, 7) + '-' + value.substring(7, 9);
                }
            }
            
            this.value = formatted;
        });
    });
    
    // ROI Calculator
    const roiCalculator = document.getElementById('roi-calculator');
    
    if (roiCalculator) {
        const powerSlider = roiCalculator.querySelector('#power-slider');
        const powerValue = roiCalculator.querySelector('#power-value');
        const electricityPrice = roiCalculator.querySelector('#electricity-price');
        const grantCheckbox = roiCalculator.querySelector('#grant-checkbox');
        const monthlyEconomy = roiCalculator.querySelector('#monthly-economy');
        const paybackPeriod = roiCalculator.querySelector('#payback-period');
        
        // Update calculation on input changes
        const updateCalculation = function() {
            const power = parseInt(powerSlider.value);
            const pricePerKwh = parseFloat(electricityPrice.value) || 2.64; // Default to 2.64 UAH per kWh
            const hasGrant = grantCheckbox.checked;
            
            // Update displayed power value
            powerValue.textContent = power;
            
            // Calculate monthly generation (average for Ukraine)
            // Assuming 3.8 peak sun hours per day on average
            const monthlyGeneration = power * 3.8 * 30; // kWh per month
            
            // Calculate monthly economy
            const economy = monthlyGeneration * pricePerKwh;
            monthlyEconomy.textContent = Math.round(economy).toLocaleString('uk-UA');
            
            // Calculate system cost
            let systemCost = power * 1000; // $1000 per kW
            if (hasGrant) {
                systemCost = systemCost * 0.7; // 30% government grant
            }
            
            // Calculate payback period in years
            const annualEconomy = economy * 12;
            const paybackYears = systemCost / annualEconomy;
            
            // Format years and months
            const years = Math.floor(paybackYears);
            const months = Math.round((paybackYears - years) * 12);
            
            paybackPeriod.textContent = years + ' років ' + months + ' місяців';
        };
        
        // Set initial values and calculate
        powerSlider.value = 50; // Default 50 kW
        electricityPrice.value = 2.64; // Default 2.64 UAH per kWh
        updateCalculation();
        
        // Add event listeners
        powerSlider.addEventListener('input', updateCalculation);
        electricityPrice.addEventListener('input', updateCalculation);
        grantCheckbox.addEventListener('change', updateCalculation);
    }
});
