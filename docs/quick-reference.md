# FinanzasParaParejas - Quick Reference Guide

## 🚀 Quick Start Commands

### Development
```bash
# Start Firebase emulators + Vite dev server
npm run dev:all

# Or separately:
firebase emulators:start          # Terminal 1
npm run dev                       # Terminal 2
```

### Testing
```bash
npm run test:unit                 # Run unit tests
npm run test:e2e                  # Run E2E tests
npm run test:coverage             # Generate coverage report
```

### Deployment
```bash
npm run build                     # Build production bundle
firebase deploy                   # Deploy everything
firebase deploy --only hosting    # Deploy frontend only
firebase deploy --only functions  # Deploy Cloud Functions only
```

---

## 📁 File Structure Quick Reference

```
src/
├── components/          # Reusable UI components
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── AIInsightsCard.jsx
│   ├── GoalProgressBar.jsx
│   ├── SpendingTrendChart.jsx
│   └── CategoryPieChart.jsx
├── pages/              # Route pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── GroupSetup.jsx
│   ├── Dashboard.jsx
│   ├── Goals.jsx
│   └── Debts.jsx
├── hooks/              # Custom React hooks
│   ├── useTransactions.js
│   ├── useGoals.js
│   ├── useDebts.js
│   └── useLatestReport.js
├── utils/              # Utility functions
│   ├── debtStrategies.js
│   ├── goalCalculations.js
│   └── privacyFilters.js
├── contexts/           # React contexts
│   └── AuthContext.jsx
└── config/
    └── firebase.config.js
```

---

## 🔥 Firebase Quick Reference

### Initialize Firebase in Your App

```javascript
// src/config/firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
```

### Common Firestore Operations

```javascript
import { collection, addDoc, getDocs, query, where, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config/firebase.config';

// CREATE
const addTransaction = async (groupId, txData) => {
  const txRef = await addDoc(collection(db, `groups/${groupId}/transactions`), {
    ...txData,
    createdAt: new Date()
  });
  return txRef.id;
};

// READ (one-time)
const getTransactions = async (groupId) => {
  const q = query(collection(db, `groups/${groupId}/transactions`));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// READ (real-time listener)
const subscribeToTransactions = (groupId, callback) => {
  const q = query(collection(db, `groups/${groupId}/transactions`));
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(transactions);
  });
};

// UPDATE
const updateTransaction = async (groupId, txId, updates) => {
  const txRef = doc(db, `groups/${groupId}/transactions`, txId);
  await updateDoc(txRef, updates);
};

// DELETE
const deleteTransaction = async (groupId, txId) => {
  const txRef = doc(db, `groups/${groupId}/transactions`, txId);
  await deleteDoc(txRef);
};

// QUERY with WHERE
const getExpensesThisMonth = async (groupId) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const q = query(
    collection(db, `groups/${groupId}/transactions`),
    where('type', '==', 'expense'),
    where('date', '>=', startOfMonth)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Authentication

```javascript
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './config/firebase.config';

// Email/Password Registration
const register = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Email/Password Login
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Google OAuth
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Logout
const logout = async () => {
  await signOut(auth);
};
```

### Cloud Functions (Callable)

```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from './config/firebase.config';

const generateReport = async (groupId, period) => {
  const generateMonthlyReport = httpsCallable(functions, 'generateMonthlyReport');
  const result = await generateMonthlyReport({ groupId, period });
  return result.data; // { reportId: string, cached: boolean }
};
```

---

## 🎨 Tailwind CSS Quick Reference

### Common Utility Classes

```html
<!-- Layout -->
<div class="flex flex-col items-center justify-between">
<div class="grid grid-cols-2 gap-4">
<div class="container mx-auto px-4">

<!-- Spacing -->
<div class="p-4 m-2">          <!-- padding: 1rem, margin: 0.5rem -->
<div class="mt-8 mb-4">        <!-- margin-top: 2rem, margin-bottom: 1rem -->

<!-- Typography -->
<h1 class="text-3xl font-bold text-gray-900">
<p class="text-sm text-gray-600">

<!-- Colors -->
<div class="bg-purple-500 text-white">
<div class="bg-gradient-to-r from-purple-500 to-teal-500">

<!-- Borders & Shadows -->
<div class="rounded-lg shadow-md border border-gray-200">

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3">
<div class="hidden md:block">    <!-- Show on medium+ screens -->

<!-- Hover & Focus -->
<button class="hover:bg-purple-600 focus:ring-2 focus:ring-purple-500">
```

### Custom Design Tokens (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#8B5CF6',
          teal: '#14B8A6',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
};
```

---

## 📊 Recharts Quick Reference

### Line Chart (Spending Trend)

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Oct', income: 100000, expenses: 82000 },
  { month: 'Nov', income: 105000, expenses: 85000 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip formatter={(value) => `RD$${value.toLocaleString()}`} />
    <Legend />
    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

### Pie Chart (Category Breakdown)

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Comida', value: 20000 },
  { name: 'Transporte', value: 12000 },
  { name: 'Ocio', value: 15000 },
  // ...
];

const COLORS = ['#8B5CF6', '#14B8A6', '#10B981', '#F59E0B', '#EF4444'];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value) => `RD$${value.toLocaleString()}`} />
  </PieChart>
</ResponsiveContainer>
```

---

## 🧮 Utility Functions Reference

### Debt Strategies

```javascript
// src/utils/debtStrategies.js

// Avalanche Method (Highest interest first)
export function calculateAvalanche(debts, monthlyPayment) {
  const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  const plan = [];
  let month = 0;
  let remaining = [...sorted];
  
  while (remaining.some(d => d.balance > 0)) {
    month++;
    let availablePayment = monthlyPayment;
    
    // Pay minimums on all debts
    remaining.forEach(debt => {
      const payment = Math.min(debt.minimumPayment, debt.balance);
      debt.balance -= payment;
      availablePayment -= payment;
    });
    
    // Apply extra to highest interest debt
    if (availablePayment > 0 && remaining.length > 0) {
      const target = remaining[0];
      const extraPayment = Math.min(availablePayment, target.balance);
      target.balance -= extraPayment;
    }
    
    // Remove paid-off debts
    remaining = remaining.filter(d => d.balance > 0);
    
    plan.push({ month, debts: JSON.parse(JSON.stringify(remaining)) });
  }
  
  return { plan, monthsToPayoff: month };
}

// Snowball Method (Smallest balance first)
export function calculateSnowball(debts, monthlyPayment) {
  const sorted = [...debts].sort((a, b) => a.balance - b.balance);
  // Similar logic to Avalanche but target smallest balance
  // ... (implementation similar to above)
}

// Calculate total interest paid
export function calculateTotalInterest(debts, plan) {
  let totalInterest = 0;
  plan.forEach(({ month, debts }) => {
    debts.forEach(debt => {
      const monthlyRate = debt.interestRate / 12;
      totalInterest += debt.balance * monthlyRate;
    });
  });
  return totalInterest;
}
```

### Goal Calculations

```javascript
// src/utils/goalCalculations.js

// Calculate months to reach goal
export function calculateMonthsToGoal(target, current, avgMonthlySavings) {
  if (avgMonthlySavings <= 0) return Infinity;
  if (current >= target) return 0;
  return Math.ceil((target - current) / avgMonthlySavings);
}

// Calculate required monthly savings
export function calculateRequiredMonthlySavings(target, current, monthsRemaining) {
  if (monthsRemaining <= 0) return Infinity;
  return Math.ceil((target - current) / monthsRemaining);
}

// Calculate progress percentage
export function calculateProgress(current, target) {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}
```

### Privacy Filters

```javascript
// src/utils/privacyFilters.js

// Filter transaction for display
export function filterTransaction(transaction, currentUserId) {
  if (transaction.private && transaction.paidBy !== currentUserId) {
    return {
      ...transaction,
      category: 'Privado',
      note: 'Transacción privada',
      // Amount remains visible
    };
  }
  return transaction;
}

// Filter list of transactions
export function filterTransactions(transactions, currentUserId) {
  return transactions.map(tx => filterTransaction(tx, currentUserId));
}
```

---

## 🎯 Custom React Hooks

### useTransactions

```javascript
// src/hooks/useTransactions.js
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export function useTransactions(groupId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!groupId) return;
    
    const q = query(collection(db, `groups/${groupId}/transactions`));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [groupId]);
  
  const addTransaction = async (txData) => {
    const txRef = await addDoc(collection(db, `groups/${groupId}/transactions`), txData);
    return txRef.id;
  };
  
  const updateTransaction = async (txId, updates) => {
    const txRef = doc(db, `groups/${groupId}/transactions`, txId);
    await updateDoc(txRef, updates);
  };
  
  const deleteTransaction = async (txId) => {
    const txRef = doc(db, `groups/${groupId}/transactions`, txId);
    await deleteDoc(txRef);
  };
  
  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction };
}
```

### useAuth

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return { user, loading };
}
```

---

## 🧪 Testing Quick Reference

### Unit Test Example (Vitest)

```javascript
// src/utils/__tests__/goalCalculations.test.js
import { describe, it, expect } from 'vitest';
import { calculateMonthsToGoal, calculateProgress } from '../goalCalculations';

describe('Goal Calculations', () => {
  it('calculates months to goal correctly', () => {
    expect(calculateMonthsToGoal(100000, 40000, 10000)).toBe(6);
    expect(calculateMonthsToGoal(100000, 100000, 10000)).toBe(0);
    expect(calculateMonthsToGoal(100000, 40000, 0)).toBe(Infinity);
  });
  
  it('calculates progress percentage', () => {
    expect(calculateProgress(50000, 100000)).toBe(50);
    expect(calculateProgress(100000, 100000)).toBe(100);
    expect(calculateProgress(150000, 100000)).toBe(100); // Capped at 100%
  });
});
```

### E2E Test Example (Cypress)

```javascript
// cypress/e2e/transaction-flow.cy.js
describe('Transaction Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
  
  it('should add a transaction and see it on dashboard', () => {
    // Click FAB button
    cy.get('[data-testid="add-transaction-fab"]').click();
    
    // Fill form
    cy.get('[data-testid="transaction-type-expense"]').click();
    cy.get('[data-testid="category-select"]').select('Comida');
    cy.get('[data-testid="amount-input"]').type('1200');
    cy.get('[data-testid="save-button"]').click();
    
    // Verify transaction appears
    cy.get('[data-testid="transaction-list"]').should('contain', 'Comida');
    cy.get('[data-testid="transaction-list"]').should('contain', 'RD$1,200');
    
    // Verify dashboard totals updated
    cy.get('[data-testid="total-expenses"]').should('not.contain', 'RD$0');
  });
});
```

---

## 🔧 Environment Variables

Create `.env` file in project root:

```bash
# Firebase Config
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional: Analytics
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Add `.env` to `.gitignore`!

---

## 📱 PWA Configuration

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FinanzasParaParejas',
        short_name: 'Finanzas',
        description: 'Gestión financiera para parejas',
        theme_color: '#8B5CF6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 🐛 Common Error Solutions

### Error: "Permission denied" in Firestore
**Solution:** Check Firestore rules. Ensure user is authenticated and member of group.

### Error: "Module not found: firebase/app"
**Solution:** `npm install firebase`

### Error: Cloud Function timeout
**Solution:** Increase timeout in `firebase.json`:
```json
{
  "functions": {
    "timeout": "60s"
  }
}
```

### Error: PWA not installing
**Solution:** 
1. Ensure HTTPS (localhost is OK)
2. Check manifest.json has all required fields
3. Clear browser cache and service workers

### Error: "Cannot read property 'uid' of null"
**Solution:** User not authenticated. Wrap component in auth check:
```javascript
if (!user) return <Navigate to="/login" />;
```

---

## 📞 Support & Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Recharts:** https://recharts.org
- **Vitest:** https://vitest.dev
- **Cypress:** https://www.cypress.io

---

**Last Updated:** 2025-11-28  
**Version:** 1.0.0
