#!/bin/bash
export PATH="/Users/shreetasingla/.local/node/bin:$PATH"
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "  BVLGARI ETERNAL — Digital Product Passport"
echo "=========================================="
echo ""
echo "Starting app server for Web, iOS, and Android..."
echo "Web preview will open at http://localhost:8081"
echo "On iPhone/Android, install 'Expo Go' and scan the QR code below."
echo ""

(sleep 6 && open "http://localhost:8081") &
npx expo start --tunnel --port 8081
