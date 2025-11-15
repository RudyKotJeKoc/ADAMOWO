#!/bin/bash

###############################################################################
# create-backup.sh
# Skrypt do tworzenia bezpiecznego backupu przed czyszczeniem projektu
# Autor: Claude Code
# Data: 2025-11-15
###############################################################################

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     ADAMOWO - Tworzenie Backupu Projektu${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Katalog główny projektu
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_NAME=$(basename "$PROJECT_ROOT")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$PROJECT_ROOT/../backups"
BACKUP_NAME="${PROJECT_NAME}_backup_${TIMESTAMP}"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo -e "${YELLOW}Projekt:${NC} $PROJECT_ROOT"
echo -e "${YELLOW}Backup:${NC} $BACKUP_PATH"
echo ""

# Utwórz katalog backupów jeśli nie istnieje
mkdir -p "$BACKUP_DIR"

# Zapytaj użytkownika o rodzaj backupu
echo -e "${YELLOW}Wybierz rodzaj backupu:${NC}"
echo "1) Pełny backup (z node_modules)"
echo "2) Backup produkcyjny (bez node_modules, dist, build)"
echo "3) Backup tylko nieużywanych plików (zalecane)"
echo ""
read -p "Wybór [1-3, domyślnie 2]: " choice
choice=${choice:-2}

cd "$PROJECT_ROOT"

case $choice in
    1)
        echo -e "${YELLOW}Tworzę pełny backup...${NC}"
        tar -czf "$BACKUP_PATH.tar.gz" \
            --exclude=".git" \
            .
        ;;
    2)
        echo -e "${YELLOW}Tworzę backup produkcyjny...${NC}"
        tar -czf "$BACKUP_PATH.tar.gz" \
            --exclude=".git" \
            --exclude="node_modules" \
            --exclude="dist" \
            --exclude="build" \
            --exclude=".next" \
            --exclude=".cache" \
            --exclude="coverage" \
            .
        ;;
    3)
        echo -e "${YELLOW}Tworzę backup tylko nieużywanych plików...${NC}"

        # Utwórz tymczasowy katalog
        TEMP_BACKUP="$BACKUP_DIR/temp_$BACKUP_NAME"
        mkdir -p "$TEMP_BACKUP"

        # Lista plików do backupu
        FILES_TO_BACKUP=(
            # Legacy PHP
            "api-add-comment.php"
            "api-add-comment-optimized.php"
            "api-get-comments.php"
            "api-get-comments-optimized.php"
            "api-csrf-token.php"
            "api-csrf-token-optimized.php"
            "config-enhanced.php"
            "config-optimized.php"
            "db_config.php"

            # Legacy JS
            "app-comprehensive.js"
            "app-optimized.js"
            "sw-comprehensive.js"

            # Nieużywane CSS
            "style.css"
            "styles.css"

            # Duplikaty
            "manifest-optimized.json"
            "playlist.json"
            "playlist-optimized.json"
            "playlist-backup.json"
            "schema-comprehensive.sql"
            "schema-extended.sql"

            # Service Worker duplikat
            "public/sw-comprehensive.js"

            # Backup w src
            "src/lib/hlsClient.ts.backup"
        )

        # Kopiuj pliki
        for file in "${FILES_TO_BACKUP[@]}"; do
            if [ -f "$file" ]; then
                # Utwórz strukturę katalogów
                dir=$(dirname "$file")
                mkdir -p "$TEMP_BACKUP/$dir"
                cp -p "$file" "$TEMP_BACKUP/$file"
                echo "  ✓ $file"
            fi
        done

        # Backup katalogów z placeholderami
        if [ -d "images" ]; then
            cp -rp images "$TEMP_BACKUP/"
            echo "  ✓ images/"
        fi

        # Skompresuj
        tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "temp_$BACKUP_NAME"

        # Usuń tymczasowy katalog
        rm -rf "$TEMP_BACKUP"
        ;;
    *)
        echo -e "${RED}Nieprawidłowy wybór!${NC}"
        exit 1
        ;;
esac

# Sprawdź czy backup się udał
if [ -f "$BACKUP_PATH.tar.gz" ]; then
    SIZE=$(du -h "$BACKUP_PATH.tar.gz" | cut -f1)
    echo ""
    echo -e "${GREEN}✓ Backup utworzony pomyślnie!${NC}"
    echo -e "${YELLOW}Plik:${NC} $BACKUP_PATH.tar.gz"
    echo -e "${YELLOW}Rozmiar:${NC} $SIZE"
    echo ""
    echo -e "${BLUE}Aby przywrócić backup:${NC}"
    echo "  cd $PROJECT_ROOT"
    echo "  tar -xzf $BACKUP_PATH.tar.gz"
    echo ""

    # Utwórz plik README w katalogu backupów
    cat > "$BACKUP_DIR/README.txt" <<EOF
BACKUPY PROJEKTU ADAMOWO
========================

Data utworzenia: $(date)

NAJNOWSZY BACKUP:
$BACKUP_NAME.tar.gz (rozmiar: $SIZE)

JAK PRZYWRÓCIĆ BACKUP:
1. Przejdź do katalogu projektu:
   cd $PROJECT_ROOT

2. Rozpakuj backup:
   tar -xzf $BACKUP_PATH.tar.gz

3. (Opcjonalnie) Przywróć node_modules:
   pnpm install

UWAGA: Przed przywróceniem backupu upewnij się, że masz kopię
aktualnych zmian!
EOF

else
    echo -e "${RED}✗ Błąd podczas tworzenia backupu!${NC}"
    exit 1
fi
