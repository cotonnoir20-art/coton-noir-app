# 📱 Guide de Déploiement sur les Stores

## 🔧 **Configuration Initiale**

### Android (Google Play)
```bash
# 1. Créer le keystore (une seule fois)
keytool -genkey -v -keystore coton-noir-release.keystore -alias coton-noir -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurer dans android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('../../coton-noir-release.keystore')
            storePassword 'TON_MOT_DE_PASSE'
            keyAlias 'coton-noir'
            keyPassword 'TON_MOT_DE_PASSE'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### iOS (App Store)
```bash
# Ouvrir Xcode
npx cap open ios

# Dans Xcode:
# 1. Sélectionner votre équipe de développement
# 2. Configurer Bundle Identifier: app.lovable.5ed19065694d47c6867b6f2d53a8ed43
# 3. Créer les certificats de distribution
```

## 🚀 **Publication Initiale**

### Android
```bash
# Build release
cd android
./gradlew bundleRelease

# Upload sur Google Play Console
# Fichier: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS  
```bash
# Dans Xcode:
# Product → Archive → Distribute App → App Store Connect
```

---

## 🔄 **PROCESSUS DE MISE À JOUR**

### **Workflow Automatisé avec GitHub Actions**

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Stores
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Build Android
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: app.lovable.5ed19065694d47c6867b6f2d53a8ed43
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: production

  deploy-ios:
    runs-on: macos-latest  
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync ios
      
      - name: Build and Upload iOS
        run: |
          npx cap open ios
          # Configuration manuelle nécessaire dans Xcode
```

### **Mise à Jour Manuelle (Recommandé au début)**

#### **1. Développer dans Lovable**
- Fais tes modifications dans Lovable
- Tout se sync automatiquement vers GitHub

#### **2. Préparer la Release**
```bash
# Localement
git pull origin main
npm install
npm run build

# Incrémenter version dans package.json
npm version patch  # ou minor/major

# Sync mobile
npx cap sync
```

#### **3. Build & Deploy**

**Android:**
```bash
cd android
./gradlew bundleRelease

# Upload manuellement sur Google Play Console
# Fichier: android/app/build/outputs/bundle/release/app-release.aab
```

**iOS:**
```bash
npx cap open ios
# Dans Xcode: Archive → Distribute → App Store Connect
```

#### **4. Soumission Store**
- **Google Play:** Review automatique (2-3h)
- **App Store:** Review manuelle (24-48h)

---

## 📊 **Gestion des Versions**

### **Numérotation Sémantique**
- `1.0.0` → Version initiale
- `1.0.1` → Bug fixes
- `1.1.0` → Nouvelles fonctionnalités
- `2.0.0` → Changements majeurs

### **Types de Mises à Jour**
- **Critique:** Bugs de sécurité → Déploiement immédiat
- **Standard:** Nouvelles fonctionnalités → 1-2 semaines
- **Maintenance:** Améliorations UI → 1 mois

### **Tests Avant Release**
```bash
# Tests locaux
npm run test
npm run build

# Test sur émulateur
npx cap run android
npx cap run ios
```

## 🎯 **Bonnes Pratiques**

1. **Toujours tester sur émulateur avant deploy**
2. **Garder les certificats/keystores en sécurité**
3. **Documenter chaque release dans GitHub**
4. **Monitorer les crash reports après deploy**
5. **Préparer les screenshots pour chaque update majeure**