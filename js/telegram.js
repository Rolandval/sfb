// Telegram Bot Configuration
const BOT_TOKEN = '1061081297:AAGYBjmA0cynnYYLwJTVu7TJq4ZElcU9xfE';
const CHAT_ID = '-4764124672';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Debug logging
console.log('Telegram API URL:', TELEGRAM_API);

/**
 * Sends a message to Telegram
 * @param {string} message - The message to send
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
async function sendToTelegram(message) {
    console.log('Sending message to Telegram...');
    console.log('Message content:', message);
    
    try {
        const response = await fetch(TELEGRAM_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }),
        });

        const responseData = await response.json();
        console.log('Telegram API response:', responseData);

        if (!response.ok) {
            const errorMsg = `Telegram API Error: ${response.status} - ${responseData.description || 'Unknown error. Check console for details.'}`;
            console.error('Telegram API error status:', response.status);
            console.error('Error details:', responseData);
            throw new Error(errorMsg);
        }

        console.log('Message sent successfully!');
        return true; // Explicitly return true on success
    } catch (error) {
        // If error is already an Error object (e.g., from fetch failure or the throw above), rethrow it.
        // Otherwise, wrap it in a new Error object.
        if (error instanceof Error) {
            console.error('Error sending to Telegram:', error.message);
            throw error;
        } else {
            const unknownErrorMsg = 'Unknown error during Telegram send. Check console.';
            console.error('Error sending to Telegram (unknown type):', error);
            throw new Error(unknownErrorMsg);
        }
    }
}

/**
 * Formats form data into a readable message
 * @param {Object} formData - Form data object
 * @returns {string} - Formatted message
 */
function formatFormMessage(formData) {
    let message = '<b>📋 Нова заявка з сайту</b>\n\n';
    
    // Add timestamp
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Europe/Kiev',
        hour12: false
    };
    message += `🕒 <i>${now.toLocaleString('uk-UA', options)}</i>\n\n`;
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
            const label = getFieldLabel(key);
            message += `🔹 <b>${label}:</b> ${value}\n`;
        }
    });
    
    // Add page URL
    message += `\n🌐 <i>Відправлено зі сторінки: ${window.location.href}</i>`;
    
    return message;
}

/**
 * Gets a human-readable label for form fields
 * @param {string} fieldName - Field name
 * @returns {string} - Human-readable label
 */
function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Ім\'я',
        'phone': 'Телефон',
        'email': 'Email',
        'message': 'Повідомлення',
        'service': 'Послуга',
        'square': 'Площа даху',
        'consumption': 'Споживання електроенергії',
        'roof-type': 'Тип даху',
        'budget': 'Бюджет',
        'project-stage': 'Стадія проекту',
        'address': 'Адреса',
        'company': 'Назва компанії',
        'position': 'Посада',
        'employees': 'Кількість працівників',
        'equipment': 'Обладнання',
        'power': 'Потужність',
        'area': 'Площа',
        'efficiency': 'Ефективність',
        'warranty': 'Гарантія',
        'price': 'Ціна',
        'promo': 'Промокод',
        'callback-time': 'Зручний час дзвінка',
        'source': 'Джерело',
        'utm_source': 'UTM Source',
        'utm_medium': 'UTM Medium',
        'utm_campaign': 'UTM Campaign',
        'utm_term': 'UTM Term',
        'utm_content': 'UTM Content'
    };

    return labels[fieldName] || fieldName;
}

// Export functions for use in other files
window.TelegramService = {
    sendFormData: async (formData) => {
        console.log('Formatting form data...');
        console.log('Raw form data:', formData);
        
        try {
            const message = formatFormMessage(formData);
            console.log('Formatted message:', message);
            
            await sendToTelegram(message); // This will throw on error
            console.log('TelegramService.sendFormData: Success');
            return true; // Return true if sendToTelegram was successful
        } catch (error) {
            // Log the specific error message and re-throw to be caught by leadform.js
            console.error('Error in TelegramService.sendFormData:', error.message);
            throw error; 
        }
    }
};

// Initialize Telegram service
document.addEventListener('DOMContentLoaded', () => {
    console.log('Telegram service initialized');
});
