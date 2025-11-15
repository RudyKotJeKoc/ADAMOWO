#!/bin/bash

###############################################################################
# safe-delete.sh
# Skrypt do bezpiecznego usuwania nieużywanych plików
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
echo -e "${BLUE}     ADAMOWO - Bezpieczne Usuwanie Plików${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Katalog główny projektu
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${RED}UWAGA: Ten skrypt usunie nieużywane pliki z projektu!${NC}"
echo -e "${YELLOW}Upewnij się, że masz backup przed kontynuacją.${NC}"
echo ""
read -p "Czy utworzyłeś backup? (tak/nie): " backup_created

if [ "$backup_created" != "tak" ]; then
    echo ""
    echo -e "${YELLOW}Najpierw utwórz backup:${NC}"
    echo "  ./scripts/cleanup/create-backup.sh"
    echo ""
    exit 1
fi

echo ""
echo -e "${YELLOW}Wybierz poziom czyszczenia:${NC}"
echo "1) Bezpieczne (tylko pliki tymczasowe: .DS_Store, Thumbs.db, *.bak)"
echo "2) Umiarkowane (+ duplikaty: *-optimized, *-backup, *-comprehensive)"
echo "3) Agresywne (+ legacy PHP/JS, nieużywane CSS)"
echo "4) Pełne czyszczenie (wszystko powyżej + placeholdery obrazów)"
echo ""
read -p "Wybór [1-4, domyślnie 1]: " level
level=${level:-1}

echo ""
echo -e "${YELLOW}Co chcesz zrobić z plikami?${NC}"
echo "1) Przenieś do katalogu .trash (bezpieczne, można przywrócić)"
echo "2) Usuń na stałe (NIEODWRACALNE)"
echo ""
read -p "Wybór [1-2, domyślnie 1]: " action
action=${action:-1}

# Przygotuj katalog trash jeśli potrzebny
if [ "$action" = "1" ]; then
    TRASH_DIR="$PROJECT_ROOT/.trash/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$TRASH_DIR"
    echo ""
    echo -e "${BLUE}Pliki zostaną przeniesione do: $TRASH_DIR${NC}"
fi

echo ""
echo -e "${YELLOW}Rozpoczynam czyszczenie (poziom $level)...${NC}"
echo ""

# Liczniki
deleted_count=0
deleted_size=0

# Funkcja do usuwania/przenoszenia pliku
delete_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        return
    fi

    # Pobierz rozmiar
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
    deleted_size=$((deleted_size + size))
    deleted_count=$((deleted_count + 1))

    if [ "$action" = "1" ]; then
        # Przenieś do trash zachowując strukturę
        dir=$(dirname "$file")
        mkdir -p "$TRASH_DIR/$dir"
        mv "$file" "$TRASH_DIR/$file"
        echo -e "  ${YELLOW}→${NC} $file"
    else
        # Usuń na stałe
        rm "$file"
        echo -e "  ${RED}✗${NC} $file"
    fi
}

###############################################################################
# POZIOM 1: Pliki tymczasowe i systemowe (BEZPIECZNE)
###############################################################################
if [ "$level" -ge 1 ]; then
    echo -e "${BLUE}[1] Usuwam pliki tymczasowe i systemowe...${NC}"

    # .DS_Store
    find . -name ".DS_Store" ! -path "*/node_modules/*" ! -path "*/.git/*" | while read -r f; do
        delete_file "$f"
    done

    # Thumbs.db
    find . -name "Thumbs.db" ! -path "*/node_modules/*" ! -path "*/.git/*" | while read -r f; do
        delete_file "$f"
    done

    # Pliki *.bak, *.backup, *.old, *.tmp
    find . -type f \( -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*.tmp" \) \
        ! -path "*/node_modules/*" ! -path "*/.git/*" | while read -r f; do
        delete_file "$f"
    done
fi

###############################################################################
# POZIOM 2: Duplikaty (UMIARKOWANE)
###############################################################################
if [ "$level" -ge 2 ]; then
    echo -e "${BLUE}[2] Usuwam duplikaty...${NC}"

    # Pliki z sufiksami -optimized, -comprehensive, -backup, -enhanced, -extended
    files=(
        "api-add-comment-optimized.php"
        "api-csrf-token-optimized.php"
        "api-get-comments-optimized.php"
        "config-optimized.php"
        "config-enhanced.php"
        "manifest-optimized.json"
        "playlist-optimized.json"
        "playlist-backup.json"
        "app-optimized.js"
        "app-comprehensive.js"
        "sw-comprehensive.js"
        "public/sw-comprehensive.js"
        "schema-comprehensive.sql"
        "schema-extended.sql"
        "src/lib/hlsClient.ts.backup"
    )

    for file in "${files[@]}"; do
        delete_file "$file"
    done
fi

###############################################################################
# POZIOM 3: Legacy PHP/JS i nieużywane CSS (AGRESYWNE)
###############################################################################
if [ "$level" -ge 3 ]; then
    echo -e "${BLUE}[3] Usuwam legacy PHP/JS i nieużywane CSS...${NC}"

    # Legacy PHP
    legacy_php=(
        "api-add-comment.php"
        "api-get-comments.php"
        "api-csrf-token.php"
        "db_config.php"
    )

    for file in "${legacy_php[@]}"; do
        delete_file "$file"
    done

    # Nieużywane CSS
    delete_file "style.css"
    delete_file "styles.css"

    # Nieużywane duplikaty playlisty/manifestu
    delete_file "playlist.json"
fi

###############################################################################
# POZIOM 4: Placeholdery obrazów (PEŁNE CZYSZCZENIE)
###############################################################################
if [ "$level" -ge 4 ]; then
    echo -e "${BLUE}[4] Usuwam placeholdery obrazów...${NC}"

    # Obrazy placeholder (130-132 bajty)
    find images -type f -size -200c 2>/dev/null | while read -r f; do
        delete_file "$f"
    done

    # Nieużywane obrazy w public/images
    delete_file "public/images/favicon.jpg"

    # Nieużywane multimedia (placeholdery < 200 bajtów)
    find public/music public/video -type f -size -200c 2>/dev/null | while read -r f; do
        delete_file "$f"
    done

    # Usuń puste katalogi
    find images -type d -empty -delete 2>/dev/null || true
fi

###############################################################################
# Podsumowanie
###############################################################################
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  CZYSZCZENIE ZAKOŃCZONE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Usunięto plików:${NC} $deleted_count"

# Konwertuj rozmiar do czytelnej formy
if [ $deleted_size -ge 1048576 ]; then
    size_mb=$((deleted_size / 1048576))
    echo -e "${YELLOW}Zwolniono miejsca:${NC} ${size_mb} MB"
elif [ $deleted_size -ge 1024 ]; then
    size_kb=$((deleted_size / 1024))
    echo -e "${YELLOW}Zwolniono miejsca:${NC} ${size_kb} KB"
else
    echo -e "${YELLOW}Zwolniono miejsca:${NC} ${deleted_size} bajtów"
fi

if [ "$action" = "1" ]; then
    echo ""
    echo -e "${BLUE}Pliki zostały przeniesione do:${NC}"
    echo "  $TRASH_DIR"
    echo ""
    echo -e "${YELLOW}Aby przywrócić pliki:${NC}"
    echo "  cp -r $TRASH_DIR/* $PROJECT_ROOT/"
    echo ""
    echo -e "${YELLOW}Aby usunąć na stałe:${NC}"
    echo "  rm -rf $TRASH_DIR"
fi

echo ""
echo -e "${YELLOW}KOLEJNE KROKI:${NC}"
echo "1. Sprawdź czy aplikacja działa: pnpm dev"
echo "2. Uruchom testy: pnpm test"
echo "3. Zbuduj projekt: pnpm build"
echo "4. Jeśli wszystko działa, zatwierdź zmiany w git"
echo ""
