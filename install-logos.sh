#!/bin/bash

# Install Maslow Logo Variations
# This script copies the 9 logo PNG files from your Downloads folder to the project

DOWNLOAD_DIR="$HOME/Downloads"
DEST_DIR="public/maslow-logos"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Array of logo files
logos=(
  "maslow-universal.png"
  "maslow-cane.png"
  "maslow-wheelchair.png"
  "maslow-cape.png"
  "maslow-family.png"
  "maslow-body-positive.png"
  "maslow-cape-alt.png"
  "maslow-man.png"
  "maslow-woman.png"
)

echo "📦 Installing Maslow logo variations..."
echo ""

copied=0
missing=0

for logo in "${logos[@]}"; do
  if [ -f "$DOWNLOAD_DIR/$logo" ]; then
    cp "$DOWNLOAD_DIR/$logo" "$DEST_DIR/"
    echo "✅ Copied: $logo"
    ((copied++))
  else
    echo "❌ Missing: $logo (not found in Downloads)"
    ((missing++))
  fi
done

echo ""
echo "📊 Summary:"
echo "   ✅ Copied: $copied files"
echo "   ❌ Missing: $missing files"
echo ""

if [ $copied -eq 9 ]; then
  echo "🎉 All logos installed successfully!"
  echo "   Location: $DEST_DIR/"
else
  echo "⚠️  Some logos are missing. Please download them and try again."
fi
