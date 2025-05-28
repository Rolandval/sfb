#!/bin/bash

# Кольори для виводу
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[SOLAR PROJECT]${NC} Простий скрипт для відправки проекту на GitHub"
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Автоматично налаштуємо все необхідне..."

# Перевіряємо чи встановлено Homebrew, якщо ні - встановлюємо
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Встановлюємо Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Перевіряємо чи встановлено GitHub CLI, якщо ні - встановлюємо
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Встановлюємо GitHub CLI..."
    brew install gh
fi

# Перевіряємо, чи автентифіковані ми в GitHub CLI
gh auth status &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Зараз відкриється браузер для авторизації на GitHub..."
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Слідуйте інструкціям у браузері для авторизації."
    gh auth login -w
fi

# Перевіряємо, чи існує репозиторій на GitHub
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Перевіряємо наявність репозиторію на GitHub..."

# Створюємо тимчасовий файл для запису невидимого вмісту
gh repo list Rolandval --json name -q '.[].name' > /tmp/repo_list.txt

# Перевіряємо, чи існує репозиторій
if grep -q "solar-for-business" /tmp/repo_list.txt; then
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Репозиторій вже існує на GitHub"
else
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Створюємо новий репозиторій на GitHub..."
    gh repo create Rolandval/solar-for-business --public --description "Сучасний лендінг для продажу сонячних електростанцій" --source=. --remote=origin
fi

# Видаляємо тимчасовий файл
rm /tmp/repo_list.txt

# Вносимо невелику зміну в README, щоб гарантувати наявність змін для коміту
echo -e "\nОновлено: $(date '+%Y-%m-%d %H:%M:%S')" >> README.md

# Додаємо всі файли до індексу
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Додаємо ваші файли..."
git add .

# Створюємо коміт
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Зберігаємо зміни..."
git commit -m "Оновлення сайту: $(date '+%Y-%m-%d %H:%M:%S')"

# Відправляємо на GitHub
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Відправляємо на GitHub..."
git push -u origin main

# Перевіряємо статус відправки
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SOLAR PROJECT]${NC} Успіх! Ваш проект відправлено на GitHub."
    echo -e "${GREEN}[SOLAR PROJECT]${NC} Відвідайте: https://github.com/Rolandval/solar-for-business"
    echo -e "${GREEN}[SOLAR PROJECT]${NC} Щоб переглянути опубліковану версію (GitHub Pages), відвідайте:"
    echo -e "${GREEN}[SOLAR PROJECT]${NC} https://rolandval.github.io/solar-for-business/"
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} (GitHub Pages може бути недоступний відразу, зачекайте кілька хвилин)"
else
    echo -e "${RED}[SOLAR PROJECT]${NC} Помилка під час відправки. Будь ласка, перевірте повідомлення вище."
ficd /Users/valeriy_k./Downloads/Projects/Solar-for-business/solar-landing
chmod +x deploy_easy.sh
./deploy_easy.sh