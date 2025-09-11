# 📋 Checklist Déploiement Stores - Coton Noir

## ✅ **AVANT LA PREMIÈRE PUBLICATION**

### Configuration Initiale
- [ ] Compte Google Play Developer créé (25$ one-time)
- [ ] Compte Apple Developer créé (99$/an)
- [ ] Repository GitHub connecté à Lovable
- [ ] Certificats iOS créés (via Xcode)
- [ ] Keystore Android généré et sécurisé

### Assets Requis
- [ ] Icône app 1024x1024 (fond uni, sans transparence)
- [ ] Screenshots iPhone (6.7", 6.5", 5.5") - 3 minimum
- [ ] Screenshots iPad (12.9") - 3 minimum  
- [ ] Screenshots Android Phone - 3 minimum
- [ ] Screenshots Android Tablet - 3 minimum
- [ ] Textes marketing préparés (voir metadata.md)

### Configuration App
- [ ] Capacitor config modifié pour production (sans server URL)
- [ ] Bundle ID configuré: app.lovable.5ed19065694d47c6867b6f2d53a8ed43
- [ ] Permissions déclarées (caméra, stockage)
- [ ] Politique de confidentialité URL prête
- [ ] Version initiale: 1.0.0

---

## 🚀 **PROCESSUS DE MISE À JOUR**

### Avant Chaque Release
- [ ] Tests complets sur émulateurs Android & iOS
- [ ] Build réussi: `npm run build`
- [ ] Vérification des nouvelles fonctionnalités
- [ ] Logs d'erreur vérifiés (pas de crashes)

### Type de Mise à Jour
- [ ] **Patch (1.0.x)**: Bug fixes uniquement
- [ ] **Minor (1.x.0)**: Nouvelles fonctionnalités
- [ ] **Major (x.0.0)**: Changements majeurs UI/UX

### Déploiement Android
- [ ] `./scripts/update-app.sh patch` exécuté
- [ ] APK/AAB généré sans erreur
- [ ] Upload sur Google Play Console
- [ ] Tests internes passés
- [ ] Release en production activée

### Déploiement iOS  
- [ ] Xcode ouvert: `npx cap open ios`
- [ ] Archive créé (Product → Archive)
- [ ] Upload vers App Store Connect
- [ ] Métadonnées mises à jour si nécessaire
- [ ] Soumission pour review

### Après Publication
- [ ] Version visible sur les stores (24-48h iOS, 2-3h Android)
- [ ] Tests de téléchargement depuis les stores
- [ ] Monitoring crash reports première semaine
- [ ] Feedback utilisateurs surveillé

---

## 🔄 **WORKFLOW MISE À JOUR SIMPLIFIÉ**

### Développement dans Lovable
1. **Faire les modifications** dans l'éditeur Lovable
2. **Test** dans la preview Lovable
3. **Auto-sync** vers GitHub (automatique)

### Release
1. **Localement**: `git pull && ./scripts/update-app.sh patch`
2. **Android**: Upload AAB sur Google Play Console  
3. **iOS**: Archive dans Xcode → App Store Connect
4. **Attendre**: Validation stores (2-48h)

---

## 🚨 **URGENCE - HOTFIX**

### Bug Critique Détecté
1. **Fix immédiat** dans Lovable
2. **Version patch**: `./scripts/update-app.sh patch` 
3. **Upload prioritaire** sur les deux stores
4. **Contact support stores** si nécessaire pour accélérer

---

## 📞 **CONTACTS & LIENS**

- **Google Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com  
- **Supabase Dashboard**: https://app.supabase.com
- **Repository GitHub**: [Sera créé après export]

## 🎯 **MÉTRIQUES DE SUCCÈS**

### KPIs à Surveiller
- **Téléchargements** première semaine
- **Note moyenne** stores (>4.0 cible)
- **Crash rate** (<1% cible)  
- **Retention J1** (>40% cible)
- **Reviews positives** (>80% cible)

---

## ⚠️ **POINTS D'ATTENTION**

- ⏰ **iOS Review**: Peut prendre 24-48h, planifier en conséquence
- 🔐 **Certificats**: Sauvegarder keystores/certificats en lieu sûr  
- 📱 **Tests**: Toujours tester sur vrais devices avant release
- 🌍 **Rollout**: Considérer release graduelle (10% → 50% → 100%)
- 💰 **Budget**: Prévoir coûts développeur Apple (99$/an) + Google (25$ one-time)