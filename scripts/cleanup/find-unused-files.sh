#!/bin/bash

###############################################################################
# find-unused-files.sh
# Skrypt do automatycznego znajdowania nieużywanych plików w projekcie
# Autor: Claude Code
# Data: 2025-11-15
###############################################################################

set -e

# Kolory dla output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     ADAMOWO - Skaner Nieużywanych Plików${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Katalog główny projektu
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Pliki z rezultatami
RESULTS_DIR="$PROJECT_ROOT/scripts/cleanup/results"
mkdir -p "$RESULTS_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
UNUSED_IMAGES="$RESULTS_DIR/unused_images_$TIMESTAMP.txt"
UNUSED_CSS="$RESULTS_DIR/unused_css_$TIMESTAMP.txt"
UNUSED_JS="$RESULTS_DIR/unused_js_$TIMESTAMP.txt"
UNUSED_MEDIA="$RESULTS_DIR/unused_media_$TIMESTAMP.txt"
SUMMARY="$RESULTS_DIR/summary_$TIMESTAMP.txt"

echo "Rozpoczynam skanowanie w: $PROJECT_ROOT"
echo ""

###############################################################################
# 1. Szukanie nieużywanych obrazów
###############################################################################
echo -e "${YELLOW}[1/5] Szukam nieużywanych obrazów...${NC}"

echo "# NIEUŻYWANE OBRAZY - $(date)" > "$UNUSED_IMAGES"
echo "# Obrazy które nie są referencjonowane w kodzie źródłowym" >> "$UNUSED_IMAGES"
echo "" >> "$UNUSED_IMAGES"

# Znajdź wszystkie obrazy
find images public/images -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.svg" -o -iname "*.ico" -o -iname "*.webp" \) 2>/dev/null | while read -r img; do
    # Pobierz nazwę pliku
    filename=$(basename "$img")

    # Sprawdź czy jest używany w kodzie
    if ! grep -r --exclude-dir={node_modules,.git,dist,build,scripts} \
         --include=\*.{tsx,ts,jsx,js,html,css,json} \
         -q "$filename" .; then
        echo "$img" >> "$UNUSED_IMAGES"
    fi
done

UNUSED_IMG_COUNT=$(grep -v "^#" "$UNUSED_IMAGES" | grep -v "^$" | wc -l)
echo -e "${GREEN}✓ Znaleziono: $UNUSED_IMG_COUNT nieużywanych obrazów${NC}"

###############################################################################
# 2. Szukanie nieużywanych plików CSS
###############################################################################
echo -e "${YELLOW}[2/5] Szukam nieużywanych plików CSS...${NC}"

echo "# NIEUŻYWANE PLIKI CSS - $(date)" > "$UNUSED_CSS"
echo "" >> "$UNUSED_CSS"

# Znajdź wszystkie pliki CSS w głównym katalogu (nie w src/)
find . -maxdepth 1 -type f -name "*.css" | while read -r css; do
    filename=$(basename "$css")

    # Sprawdź czy jest importowany w kodzie
    if ! grep -r --exclude-dir={node_modules,.git,dist,build,scripts} \
         --include=\*.{tsx,ts,jsx,js,html} \
         -E "import.*$filename|href=.*$filename|link.*$filename" . > /dev/null 2>&1; then
        echo "$css" >> "$UNUSED_CSS"
    fi
done

UNUSED_CSS_COUNT=$(grep -v "^#" "$UNUSED_CSS" | grep -v "^$" | wc -l)
echo -e "${GREEN}✓ Znaleziono: $UNUSED_CSS_COUNT nieużywanych plików CSS${NC}"

###############################################################################
# 3. Szukanie nieużywanych plików JavaScript (legacy)
###############################################################################
echo -e "${YELLOW}[3/5] Szukam nieużywanych plików JS (legacy)...${NC}"

echo "# NIEUŻYWANE PLIKI JS (LEGACY) - $(date)" > "$UNUSED_JS"
echo "" >> "$UNUSED_JS"

# Znajdź pliki JS w głównym katalogu (nie w src/ ani node_modules)
find . -maxdepth 1 -type f -name "*.js" ! -name "*.config.js" | while read -r js; do
    filename=$(basename "$js")

    # Sprawdź czy jest importowany lub używany
    if ! grep -r --exclude-dir={node_modules,.git,dist,build,scripts} \
         --include=\*.{tsx,ts,jsx,js,html} \
         -E "import.*$filename|src=.*$filename|script.*$filename" . > /dev/null 2>&1; then
        echo "$js" >> "$UNUSED_JS"
    fi
done

UNUSED_JS_COUNT=$(grep -v "^#" "$UNUSED_JS" | grep -v "^$" | wc -l)
echo -e "${GREEN}✓ Znaleziono: $UNUSED_JS_COUNT nieużywanych plików JS${NC}"

###############################################################################
# 4. Szukanie nieużywanych plików multimedialnych
###############################################################################
echo -e "${YELLOW}[4/5] Szukam nieużywanych plików multimedialnych...${NC}"

echo "# NIEUŻYWANE PLIKI MULTIMEDIALNE - $(date)" > "$UNUSED_MEDIA"
echo "" >> "$UNUSED_MEDIA"

# Znajdź pliki audio/video
find public -type f \( -iname "*.mp3" -o -iname "*.mp4" -o -iname "*.ogg" -o -iname "*.webm" \) 2>/dev/null | while read -r media; do
    filename=$(basename "$media")

    # Sprawdź czy jest używany w kodzie
    if ! grep -r --exclude-dir={node_modules,.git,dist,build,scripts} \
         --include=\*.{tsx,ts,jsx,js,json,html} \
         -q "$filename" .; then
        # Sprawdź rozmiar (jeśli < 200 bajtów to placeholder)
        size=$(stat -f%z "$media" 2>/dev/null || stat -c%s "$media" 2>/dev/null)
        if [ "$size" -lt 200 ]; then
            echo "$media (placeholder, $size bajtów)" >> "$UNUSED_MEDIA"
        else
            echo "$media" >> "$UNUSED_MEDIA"
        fi
    fi
done

UNUSED_MEDIA_COUNT=$(grep -v "^#" "$UNUSED_MEDIA" | grep -v "^$" | wc -l)
echo -e "${GREEN}✓ Znaleziono: $UNUSED_MEDIA_COUNT nieużywanych plików multimedialnych${NC}"

###############################################################################
# 5. Szukanie plików tymczasowych i systemowych
###############################################################################
echo -e "${YELLOW}[5/5] Szukam plików tymczasowych i systemowych...${NC}"

TEMP_FILES="$RESULTS_DIR/temp_files_$TIMESTAMP.txt"
echo "# PLIKI TYMCZASOWE I SYSTEMOWE - $(date)" > "$TEMP_FILES"
echo "" >> "$TEMP_FILES"

# Szukaj plików tymczasowych
find . -type f \( \
    -name "*.bak" -o \
    -name "*.backup" -o \
    -name "*.old" -o \
    -name "*.tmp" -o \
    -name ".DS_Store" -o \
    -name "Thumbs.db" -o \
    -name "desktop.ini" -o \
    -name "*~" \
\) ! -path "*/node_modules/*" ! -path "*/.git/*" >> "$TEMP_FILES"

TEMP_COUNT=$(grep -v "^#" "$TEMP_FILES" | grep -v "^$" | wc -l)
echo -e "${GREEN}✓ Znaleziono: $TEMP_COUNT plików tymczasowych${NC}"

###############################################################################
# Generowanie podsumowania
###############################################################################
echo ""
echo -e "${YELLOW}Generuję podsumowanie...${NC}"

cat > "$SUMMARY" <<EOF
═══════════════════════════════════════════════════════════
  RAPORT SKANOWANIA NIEUŻYWANYCH PLIKÓW
  Projekt: ADAMOWO
  Data: $(date)
═══════════════════════════════════════════════════════════

PODSUMOWANIE:
─────────────────────────────────────────────────────────

Nieużywane obrazy:           $UNUSED_IMG_COUNT plików
Nieużywane pliki CSS:        $UNUSED_CSS_COUNT plików
Nieużywane pliki JS:         $UNUSED_JS_COUNT plików
Nieużywane multimedia:       $UNUSED_MEDIA_COUNT plików
Pliki tymczasowe:            $TEMP_COUNT plików

RAZEM:                       $((UNUSED_IMG_COUNT + UNUSED_CSS_COUNT + UNUSED_JS_COUNT + UNUSED_MEDIA_COUNT + TEMP_COUNT)) plików do przeglądu

SZCZEGÓŁOWE RAPORTY:
─────────────────────────────────────────────────────────

1. Nieużywane obrazy:        $UNUSED_IMAGES
2. Nieużywane CSS:           $UNUSED_CSS
3. Nieużywane JS:            $UNUSED_JS
4. Nieużywane multimedia:    $UNUSED_MEDIA
5. Pliki tymczasowe:         $TEMP_FILES

REKOMENDACJE:
─────────────────────────────────────────────────────────

1. Przejrzyj raporty szczegółowe przed usunięciem
2. Utwórz backup używając: ./scripts/cleanup/create-backup.sh
3. Usuń pliki używając: ./scripts/cleanup/safe-delete.sh
4. Sprawdź czy aplikacja działa poprawnie po usunięciu

UWAGA: Ten skrypt identyfikuje pliki które nie są bezpośrednio
referencjonowane w kodzie. Niektóre pliki mogą być używane
dynamicznie lub przez zewnętrzne systemy. Zawsze sprawdzaj
przed usunięciem!

═══════════════════════════════════════════════════════════
EOF

cat "$SUMMARY"

echo ""
echo -e "${GREEN}✓ Skanowanie zakończone!${NC}"
echo -e "${BLUE}Rezultaty zapisane w: $RESULTS_DIR${NC}"
echo ""
