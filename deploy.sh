#!/bin/bash

# Скрипт для автоматичної відправки коду на GitHub

# Кольори для виводу
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функція для виводу повідомлень з форматуванням
function echo_status() {
    echo -e "${YELLOW}[DEPLOY]${NC} $1"
}

# Перевіряємо, чи знаходимося в правильній директорії
if [ ! -d ".git" ]; then
    echo_status "${RED}Помилка: Це не Git-репозиторій. Запустіть скрипт з кореневої папки проекту.${NC}"
    exit 1
fi

# Запитуємо повідомлення для коміту
echo_status "Введіть повідомлення для коміту (або натисніть Enter для стандартного повідомлення):"
read commit_message

# Якщо повідомлення не введено, використовуємо стандартне
if [ -z "$commit_message" ]; then
    commit_message="Оновлення сайту: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Додаємо всі зміни
echo_status "Додаємо всі файли до коміту..."
git add .

# Створюємо коміт
echo_status "Створюємо коміт з повідомленням: \"$commit_message\"..."
git commit -m "$commit_message"

# Перевіряємо, чи успішно створено коміт
if [ $? -ne 0 ]; then
    echo_status "${RED}Помилка: Не вдалося створити коміт. Перевірте, чи є зміни для коміту.${NC}"
    exit 1
fi

# Відправляємо зміни на GitHub
echo_status "Відправляємо зміни на GitHub у гілку main..."
git push -u origin main

# Перевіряємо, чи успішно відправлено зміни
if [ $? -ne 0 ]; then
    echo_status "${RED}Помилка: Не вдалося відправити зміни на GitHub. Можливо, потрібна автентифікація.${NC}"
    echo_status "Спробуйте одне з наступного:"
    echo_status "1. Налаштувати SSH-ключі для GitHub: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo_status "2. Використати GitHub CLI: gh auth login"
    echo_status "3. Використати Personal Access Token:"
    echo_status "   git remote set-url origin https://USERNAME:TOKEN@github.com/Rolandval/solar-for-business.git"
    exit 1
fi

echo_status "${GREEN}Успішно! Зміни відправлено на GitHub у гілку main.${NC}"
echo_status "Відвідайте https://github.com/Rolandval/solar-for-business для перевірки."
