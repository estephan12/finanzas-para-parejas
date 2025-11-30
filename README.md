# FinanzasParaParejas - MVP Documentation Package

## 📋 Executive Summary

**FinanzasParaParejas** is a Progressive Web App (PWA) designed for couples to collaboratively manage shared finances, track savings goals, eliminate debt, and receive AI-powered financial insights. This documentation package contains all technical specifications, wireframes, user stories, and implementation plans needed to build a production-ready MVP in 8 weeks.

**Target Audience:** Young couples in Dominican Republic seeking to improve financial management together.

**Key Differentiators:**
- Real-time synchronized financial data between partners
- Privacy controls for individual transactions
- AI-powered monthly reports with actionable recommendations
- Debt elimination strategies (Avalanche/Snowball methods)
- Mobile-first PWA with offline capabilities

---

## 📦 Deliverables Overview

This package includes the following documents:

| Document | Location | Description |
|----------|----------|-------------|
| **Implementation Plan** | `implementation_plan.md` | Complete technical architecture, data models, security rules, and 4-sprint roadmap |
| **Wireframes** | `docs/wireframes.md` | ASCII mockups for 5 core screens with design system specifications |
| **User Stories** | `docs/user-stories.md` | 37 user stories across 10 epics with acceptance criteria and story points |
| **AI Integration** | `docs/ai-integration.md` | Detailed AI implementation guide with prompts, schemas, and Cloud Functions code |
| **Task Breakdown** | `task.md` | Sprint-by-sprint task checklist for MVP development |

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (mobile-first)
- **Charts:** Recharts for data visualization
- **PWA:** Vite PWA Plugin + Workbox

**Backend:**
- **Authentication:** Firebase Authentication (Email/Password + Google OAuth)
- **Database:** Cloud Firestore (NoSQL, real-time sync)
- **Functions:** Firebase Cloud Functions (Node.js)
- **Hosting:** Firebase Hosting

**AI:**
- **Primary:** OpenAI GPT-4o-mini
- **Alternative:** Google Gemini 1.5 Flash
- **Integration:** Secure Cloud Functions (API keys never exposed)

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     User Devices                        │
│  (Mobile Browser, Desktop Browser, PWA Installed)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Firebase Hosting (CDN)                     │
│  - Static Assets (HTML, CSS, JS)                        │
│  - Service Worker for Offline Support                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│ Firebase Auth    │    │  Cloud Firestore     │
│ - Email/Password │    │  - Users             │
│ - Google OAuth   │    │  - Groups            │
└──────────────────┘    │  - Transactions      │
                        │  - Goals             │
                        │  - Debts             │
                        │  - Reports           │
                        └──────────┬───────────┘
                                   │
                                   │ Real-time Sync
                                   ▼
                        ┌──────────────────────┐
                        │ Cloud Functions      │
                        │ - generateReport()   │
                        │ - calculateDebts()   │
                        └──────────┬───────────┘
                                   │
                                   │ API Call
                                   ▼
                        ┌──────────────────────┐
                        │ OpenAI / Gemini API  │
                        │ - GPT-4o-mini        │
                        └──────────────────────┘
```

---

## 📊 Data Model Summary

### Firestore Collections

1. **`/users/{userId}`** - User profiles and preferences
2. **`/groups/{groupId}`** - Financial groups (couples)
3. **`/groups/{groupId}/transactions/{txId}`** - Income/expense records
4. **`/groups/{groupId}/goals/{goalId}`** - Savings goals
5. **`/groups/{groupId}/debts/{debtId}`** - Debt tracking
6. **`/groups/{groupId}/budgets/{budgetId}`** - Monthly budgets by category
7. **`/groups/{groupId}/reports/{reportId}`** - AI-generated monthly reports

**Key Features:**
- Real-time synchronization via Firestore listeners
- Privacy controls: `private: true` flag on transactions
- Security rules: Only group members can read/write group data

See [`implementation_plan.md`](implementation_plan.md#component-3-data-models--firestore-schema) for complete schemas.

---

## 🎨 Design System

### Color Palette
- **Primary:** Purple (#8B5CF6) → Teal (#14B8A6) gradient
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Danger:** Red (#EF4444)

### Typography
- **Font:** Inter (Google Fonts)
- **Sizes:** 12px - 30px (responsive scaling)

### Components
- Glassmorphism cards with subtle shadows
- Animated progress bars
- Floating Action Button (FAB) for quick actions
- Bottom navigation (mobile)

See [`docs/wireframes.md`](docs/wireframes.md#design-system) for complete design tokens.

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** 18+ and npm
2. **Firebase CLI:** `npm install -g firebase-tools`
3. **Firebase Project:** Create at [console.firebase.google.com](https://console.firebase.google.com)
4. **OpenAI API Key** OR **Google Gemini API Key**

### Initial Setup

```bash
# 1. Clone repository (or create new project)
mkdir finanzas-para-parejas
cd finanzas-para-parejas

# 2. Initialize Vite + React project
npm create vite@latest . -- --template react
npm install

# 3. Install dependencies
npm install firebase tailwindcss postcss autoprefixer recharts
npm install -D vite-plugin-pwa workbox-window

# 4. Initialize Tailwind CSS
npx tailwindcss init -p

# 5. Initialize Firebase
firebase login
firebase init
# Select: Firestore, Functions, Hosting, Emulators

# 6. Install Cloud Functions dependencies
cd functions
npm install openai
# OR: npm install @google/generative-ai
cd ..

# 7. Set Firebase config
firebase functions:config:set openai.key="sk-YOUR-API-KEY"
# OR: firebase functions:config:set gemini.key="YOUR-GEMINI-KEY"
```

### Development Workflow

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start

# Terminal 2: Start Vite dev server
npm run dev

# App available at http://localhost:5173
# Firestore UI at http://localhost:4000
```

### Project Structure

```
finanzas-para-parejas/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons (192x192, 512x512)
├── src/
│   ├── components/            # React components
│   │   ├── TransactionForm.jsx
│   │   ├── AIInsightsCard.jsx
│   │   ├── GoalProgressBar.jsx
│   │   └── ...
│   ├── pages/                 # Route pages
│   │   ├── Dashboard.jsx
│   │   ├── Goals.jsx
│   │   ├── Debts.jsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTransactions.js
│   │   ├── useLatestReport.js
│   │   └── ...
│   ├── utils/                 # Utility functions
│   │   ├── debtStrategies.js
│   │   ├── goalCalculations.js
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── AuthContext.jsx
│   ├── config/
│   │   └── firebase.config.js # Firebase SDK init
│   ├── App.jsx
│   └── main.jsx
├── functions/
│   ├── src/
│   │   └── generateReport.js  # Cloud Function for AI
│   ├── package.json
│   └── index.js
├── firestore.rules            # Security rules
├── firebase.json              # Firebase config
├── vite.config.js             # Vite + PWA config
├── tailwind.config.js         # Tailwind config
└── docs/                      # Documentation
    ├── wireframes.md
    ├── user-stories.md
    └── ai-integration.md
```

---

## 📅 Sprint Roadmap (8 Weeks)

### Sprint 0: Infrastructure (Weeks 1-2)
**Goal:** Development environment ready, authentication working

**Key Deliverables:**
- ✅ Vite + React + Tailwind setup
- ✅ Firebase project configured
- ✅ Authentication flows (Email + Google OAuth)
- ✅ Group creation/join with invite codes
- ✅ PWA manifest and Service Worker

**Story Points:** 23

---

### Sprint 1: Core CRUD & Dashboard (Weeks 3-4)
**Goal:** Users can add transactions and see real-time updates

**Key Deliverables:**
- ✅ Transaction CRUD operations
- ✅ Real-time Firestore synchronization
- ✅ Dashboard with monthly summary
- ✅ Privacy controls for transactions
- ✅ Firestore security rules

**Story Points:** 36

---

### Sprint 2: Goals, Debts & Visualization (Weeks 5-6)
**Goal:** Users can track savings goals and manage debts

**Key Deliverables:**
- ✅ Goals CRUD with progress tracking
- ✅ Debt CRUD with Avalanche/Snowball strategies
- ✅ Recharts visualizations (trends, categories)
- ✅ Budget tracking by category
- ✅ Responsive charts for mobile

**Story Points:** 51

---

### Sprint 3: AI Integration & Testing (Weeks 7-8)
**Goal:** AI generates actionable insights, app is production-ready

**Key Deliverables:**
- ✅ Cloud Function for AI report generation
- ✅ OpenAI/Gemini API integration
- ✅ AI insights dashboard card
- ✅ Unit tests for critical functions
- ✅ E2E tests (Cypress/Playwright)
- ✅ Production deployment

**Story Points:** 41

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```bash
npm run test:unit
```
- Debt calculation functions (Avalanche, Snowball)
- Goal projection logic
- Privacy filtering
- **Coverage Target:** >80%

### Integration Tests (Firebase Emulators)
```bash
firebase emulators:start
npm run test:integration
```
- Multi-user transaction sync
- Firestore security rules validation
- Cloud Function execution

### E2E Tests (Cypress)
```bash
npm run test:e2e
```
- User registration → Group join → Add transaction
- Create goal → Add contribution → Verify progress
- Generate AI report → Verify recommendations

**Success Criteria:** >90% pass rate

---

## 🔒 Security Checklist

- [x] Firestore rules restrict access to group members only
- [x] API keys stored in Cloud Functions config (not in code)
- [x] Private transactions properly masked for partners
- [x] Input validation on all forms
- [x] HTTPS enforced on production
- [x] Authentication required for all protected routes
- [x] Rate limiting on Cloud Functions (1 report/group/day)
- [x] AI receives anonymized data only (no PII)

See [`implementation_plan.md`](implementation_plan.md#user-review-required) for detailed security considerations.

---

## 💰 Cost Estimation (Monthly)

### Firebase (Free Tier Limits)
- **Firestore:** 50K reads/day, 20K writes/day (sufficient for 100-200 couples)
- **Cloud Functions:** 2M invocations/month
- **Hosting:** 10GB storage, 360MB/day transfer
- **Authentication:** Unlimited

**Paid Tier (if exceeded):**
- Firestore: $0.06 per 100K reads, $0.18 per 100K writes
- Functions: $0.40 per 1M invocations
- **Estimated for 1,000 couples:** ~$10-15/month

### AI Costs (OpenAI GPT-4o-mini)
- **Per Report:** ~1,800 tokens = $0.0016
- **1,000 reports/month:** ~$1.62
- **10,000 reports/month:** ~$16.20

**Total MVP Cost (1,000 couples):** ~$12-17/month

---

## 📈 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Authentication Success Rate | 100% | E2E tests |
| Transaction Sync Latency | <2s | Real-time monitoring |
| AI Report Quality | >80% useful | User feedback survey |
| Goal Tracking Accuracy | 100% | Unit test coverage |
| PWA Install Rate | >30% | Analytics tracking |
| Mobile Performance (TTI) | <3s | Lighthouse audit |
| Test Coverage | >80% | Vitest coverage report |
| E2E Test Pass Rate | >90% | Cypress dashboard |

---

## 🛠️ Deployment

### Production Deployment

```bash
# 1. Build production bundle
npm run build

# 2. Deploy to Firebase
firebase deploy

# This deploys:
# - Hosting (static files)
# - Firestore rules
# - Cloud Functions
```

### Continuous Deployment (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

---

## 📚 Additional Resources

### Documentation Files

1. **[Implementation Plan](implementation_plan.md)** - Complete technical specification
   - Architecture details
   - Data models and Firestore schemas
   - Security rules
   - Component breakdown
   - Verification plan

2. **[Wireframes](docs/wireframes.md)** - UX/UI design
   - 5 core screen mockups
   - Design system (colors, typography, spacing)
   - Accessibility guidelines
   - User flow diagrams

3. **[User Stories](docs/user-stories.md)** - Product backlog
   - 37 user stories across 10 epics
   - Acceptance criteria
   - Story points and sprint allocation
   - Definition of Done

4. **[AI Integration](docs/ai-integration.md)** - AI implementation guide
   - Prompt engineering strategies
   - Input/output schemas
   - Cloud Functions code
   - Cost analysis
   - Error handling

### External Links

- **Firebase Documentation:** https://firebase.google.com/docs
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Recharts:** https://recharts.org
- **OpenAI API:** https://platform.openai.com/docs
- **Vite PWA Plugin:** https://vite-pwa-org.netlify.app

---

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch:** `git checkout -b feature/transaction-filters`
2. **Implement Feature:** Follow user story acceptance criteria
3. **Write Tests:** Unit + integration tests
4. **Run Linter:** `npm run lint`
5. **Submit PR:** Include screenshots/videos for UI changes
6. **Code Review:** Minimum 1 approval required
7. **Merge to Main:** Triggers CI/CD deployment

### Code Style

- **JavaScript:** ESLint with Airbnb config
- **React:** Functional components with hooks
- **CSS:** Tailwind utility classes (avoid custom CSS)
- **Naming:** camelCase for variables, PascalCase for components

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Firebase emulators won't start  
**Solution:** Check if ports 4000, 5001, 8080, 9099 are available. Kill conflicting processes.

**Issue:** Firestore permission denied  
**Solution:** Verify security rules in `firestore.rules`. Check user is authenticated and member of group.

**Issue:** Cloud Function timeout  
**Solution:** Increase timeout in `firebase.json`: `"timeout": "60s"`

**Issue:** PWA not installing  
**Solution:** Ensure HTTPS (localhost is OK). Check manifest.json has all required fields. Clear browser cache.

**Issue:** AI report generation fails  
**Solution:** Verify API key is set: `firebase functions:config:get`. Check Cloud Function logs: `firebase functions:log`

---

## 📞 Support

For questions or issues:
- **Technical Questions:** Review documentation in `docs/` folder
- **Bug Reports:** Create GitHub issue with reproduction steps
- **Feature Requests:** Submit user story with acceptance criteria

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 🎯 Next Steps

### Immediate Actions (Week 1)

1. ✅ Review all documentation
2. ⬜ Set up Firebase project
3. ⬜ Obtain OpenAI or Gemini API key
4. ⬜ Initialize Vite + React project
5. ⬜ Configure Tailwind CSS
6. ⬜ Implement authentication flows

### Post-MVP Features (Phase 2)

- **Recurring Transactions:** Automated monthly bills/income
- **Multi-currency Support:** Exchange rate integration
- **Export Functionality:** CSV/PDF reports
- **Push Notifications:** Budget alerts, goal milestones
- **Shared Shopping Lists:** Collaborative expense planning
- **Investment Tracking:** Portfolio management
- **Bill Splitting:** Itemized expense division

---

## ✅ Verification Checklist

Before considering MVP complete:

- [ ] All Sprint 0-3 user stories completed
- [ ] Unit tests passing with >80% coverage
- [ ] E2E tests passing with >90% success rate
- [ ] Lighthouse Performance score >85
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Security rules tested and validated
- [ ] AI report generation working end-to-end
- [ ] PWA installable on mobile devices
- [ ] Production deployment successful
- [ ] User documentation created

---

**Last Updated:** 2025-11-28  
**Version:** 1.0.0  
**Status:** Planning Complete, Ready for Development
