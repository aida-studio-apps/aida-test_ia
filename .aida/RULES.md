# Conventions de code — Projet `express-fullstack-ai`

## 1) Principes généraux
- Rester simple et lisible : application mono-écran, pas de sur-architecture.
- TypeScript strict : **interdiction d’utiliser `any`**.
- Une responsabilité claire par fichier (UI, hook, route, service).

## 2) Nommage
- Composants React : **PascalCase** (`QuestionForm.tsx`).
- Hooks : préfixe `use` en **camelCase** (`useAiTest.ts`).
- Fonctions/variables : **camelCase**.
- Constantes globales : `UPPER_SNAKE_CASE`.
- Types/interfaces : **PascalCase** (`AskAiRequest`).

## 3) Exports
- Composants React : `export default`.
- Hooks, utilitaires, types : exports nommés.
- Éviter les exports multiples non liés dans un même fichier.

## 4) Organisation des imports
Ordre obligatoire :
1. `react`
2. Librairies tierces
3. Imports internes absolus/relatifs (components, hooks, utils)
4. Types

Séparer les groupes par une ligne vide.

## 5) Composants React
- Utiliser des **arrow functions**.
- Props typées explicitement.
- Pas de logique API directement dans les composants (passer par hook/service frontend).
- UI minimaliste avec Tailwind, sans CSS custom sauf nécessité.

## 6) Gestion d’état frontend
- État local via `useState` dans `useAiTest`.
- Validation de la question vide avant appel API.
- Réinitialiser les erreurs avant un nouvel envoi.
- Désactiver le bouton pendant chargement.

## 7) API & backend Express
- Routes dans `server/routes`, logique métier dans `server/services`.
- Validation d’entrée systématique dans la route.
- Réponses JSON cohérentes (`{ answer }` ou `{ error }`).
- Codes HTTP appropriés : 200, 400, 500.

## 8) Règles spécifiques IA (CRITIQUE)
- **Ne jamais hardcoder** clé API, endpoint, deployment.
- Lire la config uniquement via `process.env.AZURE_OPENAI_*` (déjà injecté).
- Utiliser le client préconfiguré `server/ai-client.ts`.
- Ne pas créer de fichier `.env`.
- En cas d’échec IA/réseau : propager/retourner une erreur HTTP propre, sans faux fallback de contenu.

## 9) Gestion d’erreurs
- Frontend : `try/catch` dans le hook d’appel API, message utilisateur clair.
- Backend : `try/catch` route/service, journaliser côté serveur si nécessaire, ne pas exposer de détails sensibles.

## 10) Qualité
- Fonctions courtes, lisibles, testables manuellement.
- Pas de code mort, pas de commentaires inutiles.
- Garder une cohérence de style sur tout le projet.
