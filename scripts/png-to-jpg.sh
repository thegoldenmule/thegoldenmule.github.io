#!/bin/bash

# Convert all PNG files in public/tex/ to JPG format using macOS sips
# Usage: ./scripts/png-to-jpg.sh [--delete-originals]

TEX_DIR="public/tex"
DELETE_ORIGINALS=false
QUALITY=80

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --delete-originals)
            DELETE_ORIGINALS=true
            shift
            ;;
        --quality)
            QUALITY="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--delete-originals] [--quality N]"
            exit 1
            ;;
    esac
done

# Check if tex directory exists
if [ ! -d "$TEX_DIR" ]; then
    echo "Error: Directory $TEX_DIR not found"
    exit 1
fi

# Count PNG files
PNG_COUNT=$(find "$TEX_DIR" -maxdepth 1 -name "*.png" | wc -l | tr -d ' ')

if [ "$PNG_COUNT" -eq 0 ]; then
    echo "No PNG files found in $TEX_DIR"
    exit 0
fi

echo "Found $PNG_COUNT PNG files in $TEX_DIR"
echo "Converting to JPG (quality: $QUALITY)..."
echo ""

CONVERTED=0
FAILED=0

for png_file in "$TEX_DIR"/*.png; do
    if [ -f "$png_file" ]; then
        # Get the base name without extension
        base_name="${png_file%.png}"
        jpg_file="${base_name}.jpg"

        echo -n "Converting: $(basename "$png_file") -> $(basename "$jpg_file")... "

        # Convert using sips
        if sips -s format jpeg -s formatOptions "$QUALITY" "$png_file" --out "$jpg_file" > /dev/null 2>&1; then
            echo "done"
            ((CONVERTED++))

            if [ "$DELETE_ORIGINALS" = true ]; then
                rm "$png_file"
                echo "  Deleted original: $(basename "$png_file")"
            fi
        else
            echo "FAILED"
            ((FAILED++))
        fi
    fi
done

echo ""
echo "Conversion complete!"
echo "  Converted: $CONVERTED"
echo "  Failed: $FAILED"

if [ "$DELETE_ORIGINALS" = false ] && [ "$CONVERTED" -gt 0 ]; then
    echo ""
    echo "Tip: Run with --delete-originals to remove the original PNG files"
fi
