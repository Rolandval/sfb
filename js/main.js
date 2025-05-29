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
    
    // Обробка форми та маска телефону перенесені в окремий файл leadform.js
    
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
