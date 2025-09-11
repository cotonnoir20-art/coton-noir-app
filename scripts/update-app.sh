#!/bin/bash

# 🚀 Script de Mise à Jour Coton Noir
# Usage: ./scripts/update-app.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}
echo "🔄 Mise à jour $VERSION_TYPE en cours..."

# 1. Vérifier que nous sommes sur main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo "❌ Vous devez être sur la branche main"
    exit 1
fi

# 2. Pull les derniers changements depuis Lovable
echo "📥 Récupération des derniers changements..."
git pull origin main

# 3. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 4. Build le projet
echo "🏗️ Build du projet..."
npm run build

# 5. Incrémenter la version
echo "📈 Incrémentation de la version..."
npm version $VERSION_TYPE --no-git-tag-version

# 6. Obtenir la nouvelle version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "🎯 Nouvelle version: $NEW_VERSION"

# 7. Sync Capacitor
echo "🔄 Synchronisation Capacitor..."
npx cap sync

# 8. Build Android
echo "🤖 Build Android..."
if [ -d "android" ]; then
    cd android
    ./gradlew bundleRelease
    cd ..
    echo "✅ Android build terminé: android/app/build/outputs/bundle/release/app-release.aab"
else
    echo "⚠️ Dossier Android non trouvé, exécutez 'npx cap add android' d'abord"
fi

# 9. Commit et tag
echo "💾 Commit des changements..."
git add .
git commit -m "chore: release v$NEW_VERSION"
git tag "v$NEW_VERSION"
git push origin main --tags

echo "🎉 Mise à jour terminée!"
echo ""
echo "📋 Actions suivantes:"
echo "1. Android: Uploadez android/app/build/outputs/bundle/release/app-release.aab sur Google Play Console"
echo "2. iOS: Exécutez 'npx cap open ios' puis Archive → Distribute dans Xcode"
echo "3. Attendez l'approbation des stores (Android: 2-3h, iOS: 24-48h)"
echo ""
echo "🔗 Liens utiles:"
echo "- Google Play Console: https://play.google.com/console"
echo "- App Store Connect: https://appstoreconnect.apple.com"