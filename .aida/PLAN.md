# Plan d’implémentation — Application de test simple IA

## 1. Stack technique
- **Template choisi : `express-fullstack-ai`**
- **Justification :**
  - L’application a un frontend React (saisie + affichage réponse).
  - Elle doit appeler un service IA côté serveur (bonne pratique sécurité, clé non exposée au client).
  - Le template inclut déjà l’intégration Azure OpenAI côté backend (`server/ai-client.ts`) et des routes d’exemple.
  - Aucun besoin de base de données ni de persistance : test simple en session.

### Dépendances supplémentaires à installer
Aucune dépendance additionnelle strictement nécessaire pour le périmètre MVP.

> Optionnel (si amélioration UX ultérieure) :
- `react-hot-toast` pour notifications utilisateur.

---

## 2. Arborescence des fichiers
Structure basée **strictement** sur le template `express-fullstack-ai`.

```text
/workspace/
├── src/
│   ├── components/
│   │   ├── QuestionForm.tsx
│   │   ├── ResponsePanel.tsx
│   │   └── ErrorMessage.tsx
│   ├── hooks/
│   │   └── useAiTest.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── index.ts
│   ├── ai-client.ts
│   ├── routes/
│   │   └── ai-test.ts
│   └── services/
│       └── ai-test-service.ts
├── package.json
└── index.html
```

### Fichiers à créer/modifier (fonctionnel)
- `src/types/index.ts` : types frontend (payload requête/réponse, état UI).
- `src/hooks/useAiTest.ts` : hook de gestion d’état (question, loading, erreur, réponse) et appel API.
- `src/components/QuestionForm.tsx` : textarea/input + bouton envoyer + validation basique.
- `src/components/ResponsePanel.tsx` : affichage lisible de la réponse IA.
- `src/components/ErrorMessage.tsx` : affichage du message d’erreur (question vide / erreur API).
- `src/App.tsx` : assemblage de l’écran unique minimal.
- `server/routes/ai-test.ts` : endpoint REST dédié au test IA.
- `server/services/ai-test-service.ts` : logique d’appel au client IA préconfiguré.
- `server/index.ts` : enregistrement de la route `/api/ai-test`.

---

## 3. Modèles de données (TypeScript)

```ts
interface AskAiRequest {
  question: string;
}

interface AskAiResponse {
  answer: string;
}

interface ApiErrorResponse {
  error: string;
}

interface AiTestState {
  question: string;
  answer: string;
  error: string;
  isLoading: boolean;
}
```

Aucun modèle BD (pas de persistance).

---

## 4. Architecture des composants
- **`App` (parent)**
  - Orchestre l’écran unique.
  - Consomme `useAiTest`.
  - Passe props aux composants enfants.
- **`QuestionForm`**
  - Props : `question`, `isLoading`, `onQuestionChange`, `onSubmit`.
  - Rôle : saisie et envoi.
- **`ErrorMessage`**
  - Props : `message`.
  - Rôle : afficher les erreurs de validation ou backend.
- **`ResponsePanel`**
  - Props : `answer`, `isLoading`.
  - Rôle : afficher état d’attente puis réponse.

Flux : `QuestionForm` → `useAiTest.submitQuestion()` → `POST /api/ai-test` → retour `answer` → `ResponsePanel`.

---

## 5. Gestion d’état
- **Local state via `useState`** dans `useAiTest` :
  - `question`
  - `answer`
  - `error`
  - `isLoading`
- Validation côté client avant requête :
  - `question.trim().length === 0` => erreur “Veuillez saisir une question avant l’envoi.”
- Pas de Context API (application mono-écran très simple).
- Pas de stockage local (pas nécessaire pour le besoin).

---

## 6. Routing
### Frontend
- Aucune route complexe requise (écran unique).

### Backend
- `POST /api/ai-test`

---

## 7. API Design (backend)

### `POST /api/ai-test`
- **Body**
```json
{
  "question": "Bonjour, peux-tu me répondre ?"
}
```
- **Validation**
  - `question` requis, string non vide après trim.
- **200 OK**
```json
{
  "answer": "...réponse du modèle..."
}
```
- **400 Bad Request**
```json
{
  "error": "Veuillez saisir une question avant l’envoi."
}
```
- **500+**
```json
{
  "error": "Erreur lors de l’appel au service IA."
}
```

---

## 8. Parties complexes et solutions
1. **Validation question vide**
   - Double validation : frontend (UX immédiate) + backend (robustesse).
2. **Envois successifs**
   - Réinitialiser `error` avant chaque envoi.
   - Mettre à jour `answer` à chaque succès pour refléter la dernière question.
   - Désactiver le bouton pendant `isLoading` pour éviter double-submit involontaire.
3. **Appel IA sécurisé**
   - Utiliser exclusivement `server/ai-client.ts` et variables d’environnement injectées.
   - Ne jamais exposer de clé au frontend.
4. **Gestion d’erreurs réseau/IA**
   - Côté serveur : laisser remonter l’erreur technique, mapper en erreur HTTP propre.
   - Côté client : afficher message clair et permettre un nouvel essai.

---

## 9. Dépendances à installer
Aucune obligatoire au-delà du template scaffoldé.

Optionnel :
```bash
npm install react-hot-toast
```

---

## 10. Ordre d’implémentation
1. `src/types/index.ts` (contrats de données partagés frontend).
2. `server/services/ai-test-service.ts` (logique d’appel IA).
3. `server/routes/ai-test.ts` (validation + endpoint REST).
4. `server/index.ts` (brancher la route `/api/ai-test`).
5. `src/hooks/useAiTest.ts` (state + appel API).
6. `src/components/QuestionForm.tsx`.
7. `src/components/ErrorMessage.tsx`.
8. `src/components/ResponsePanel.tsx`.
9. `src/App.tsx` (assemblage final écran unique).
10. Vérifications manuelles des 3 scénarios : question simple, question vide, envois successifs.

---

## Couverture des scénarios de test du cahier des charges
- **Envoi d’une question simple** : formulaire + endpoint affichent la réponse.
- **Question vide** : blocage en frontend + garde-fou backend avec message explicite.
- **Envois successifs** : cycle saisie/envoi/réponse reproductible sans blocage, état correctement réinitialisé.
