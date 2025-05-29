#!/bin/bash

# Кольори для виводу
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[SOLAR PROJECT]${NC} Скрипт для автоматичного завантаження сайту на FTP"

# FTP дані
FTP_SERVER="agmakku.ftp.tools"
FTP_USER="agmakku_sfb"
FTP_PASS="fUp2ER888y"
FTP_PORT="21"
REMOTE_DIR="/"  # Кореневий каталог на FTP
LOCAL_DIR="/Users/valeriy_k./Downloads/Projects/Solar-for-business/solar-landing"

# Перевіряємо наявність lftp
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}[SOLAR PROJECT]${NC} Встановлюємо lftp..."
    brew install lftp
fi

# Створюємо тимчасовий файл з налаштуваннями
TEMP_FILE=$(mktemp)
cat > "$TEMP_FILE" << EOF
open ftp://$FTP_USER:$FTP_PASS@$FTP_SERVER:$FTP_PORT
lcd $LOCAL_DIR
mirror -R --delete --verbose
bye
EOF

echo -e "${YELLOW}[SOLAR PROJECT]${NC} Завантажуємо сайт на FTP-сервер..."
echo -e "${YELLOW}[SOLAR PROJECT]${NC} Цей процес може зайняти деякий час в залежності від розміру сайту..."

# Запускаємо lftp з налаштуваннями
lftp -f "$TEMP_FILE"

# Видаляємо тимчасовий файл
rm "$TEMP_FILE"

# Перевіряємо статус виконання
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SOLAR PROJECT]${NC} Сайт успішно завантажено на FTP-сервер!"
    echo -e "${GREEN}[SOLAR PROJECT]${NC} Відвідайте сайт: https://solar-for-business.akumulyator.center/"
else
    echo -e "${RED}[SOLAR PROJECT]${NC} Під час завантаження виникла помилка. Перевірте логи вище."
fi

echo -e "${YELLOW}[SOLAR PROJECT]${NC} Завершено!"
