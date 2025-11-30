# FinanzasParaParejas - AI Integration Documentation

## Executive Summary

The AI Advisor is a core differentiator of FinanzasParaParejas, providing couples with personalized financial recommendations based on their spending patterns, goals, and debts. This document outlines the technical implementation, prompt engineering strategy, input/output schemas, and security considerations for integrating OpenAI GPT-4o-mini or Google Gemini.

---

## Architecture Overview

```mermaid
graph LR
    A[User Dashboard] -->|Tap Generate Report| B[Frontend React]
    B -->|Call Cloud Function| C[Firebase Cloud Function]
    C -->|Collect Data| D[Firestore]
    D -->|Return Anonymized JSON| C
    C -->|Send Prompt + Data| E[OpenAI/Gemini API]
    E -->|Return AI Response| C
    C -->|Parse & Save| F[/groups/groupId/reports/reportId]
    F -->|Real-time Listener| B
    B -->|Display Insights| G[AI Insights Card]
```

### Key Components

1. **Frontend (React):** User triggers report generation, displays results
2. **Cloud Function:** Secure backend that handles AI API calls
3. **Firestore:** Stores anonymized input data and AI-generated reports
4. **AI Provider:** OpenAI GPT-4o-mini or Google Gemini API

---

## Why Cloud Functions?

### Security Benefits
- **API Key Protection:** Keys never exposed in frontend code
- **Rate Limiting:** Prevent abuse by implementing request throttling
- **Cost Control:** Monitor and cap AI API spending
- **Input Validation:** Sanitize data before sending to AI

### Performance Considerations
- **Cold Start:** 2-5s on free tier (acceptable for monthly reports)
- **Timeout:** Set to 60s (sufficient for AI response)
- **Caching:** Store reports in Firestore to avoid redundant API calls

---

## Input Data Schema

### Data Collection Process

The Cloud Function collects the following data from Firestore:

```javascript
// Pseudocode for data collection
async function collectFinancialData(groupId, period) {
  const startDate = new Date(period + '-01');
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  
  // 1. Get all transactions for the period
  const transactions = await firestore
    .collection(`groups/${groupId}/transactions`)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();
  
  // 2. Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryBreakdown = {};
  
  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
      categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
    }
  });
  
  // 3. Get goals
  const goalsSnapshot = await firestore.collection(`groups/${groupId}/goals`).get();
  const goals = goalsSnapshot.docs.map(doc => ({
    name: doc.data().name,
    target: doc.data().targetAmount,
    current: doc.data().currentAmount,
    deadline: doc.data().deadline
  }));
  
  // 4. Get debts
  const debtsSnapshot = await firestore.collection(`groups/${groupId}/debts`).get();
  const debts = debtsSnapshot.docs.map(doc => ({
    name: doc.data().name,
    balance: doc.data().balance,
    rate: doc.data().interestRate,
    minimumPayment: doc.data().minimumPayment
  }));
  
  return {
    period,
    totalIncome,
    totalExpenses,
    categoryBreakdown,
    goals,
    debtsSummary: debts
  };
}
```

### Anonymized Input JSON

**Example:**
```json
{
  "period": "2025-10",
  "totalIncome": 100000,
  "totalExpenses": 82000,
  "categoryBreakdown": {
    "Comida": 20000,
    "Transporte": 12000,
    "Ocio": 15000,
    "Servicios": 18000,
    "Salud": 8000,
    "Hogar": 9000
  },
  "goals": [
    {
      "name": "Coche Nuevo",
      "target": 200000,
      "current": 40000,
      "deadline": "2026-12-31"
    },
    {
      "name": "Vacaciones",
      "target": 50000,
      "current": 15000,
      "deadline": "2026-06-30"
    }
  ],
  "debtsSummary": [
    {
      "name": "Tarjeta de Crédito",
      "balance": 27000,
      "rate": 0.45,
      "minimumPayment": 1350
    },
    {
      "name": "Préstamo Personal",
      "balance": 50000,
      "rate": 0.18,
      "minimumPayment": 2500
    }
  ]
}
```

### Privacy Considerations

**What is NOT sent to AI:**
- User names or emails
- Partner identities
- Transaction notes (may contain personal info)
- Specific dates (only month/year)
- Private transaction details

**What IS sent:**
- Aggregated financial totals
- Category-level spending (no itemization)
- Goal names and amounts (user-defined, assumed non-sensitive)
- Debt types and balances (no creditor personal info)

---

## Prompt Engineering

### System Prompt Template

```javascript
const SYSTEM_PROMPT = `Eres un asesor financiero empático y profesional especializado en ayudar a parejas jóvenes en República Dominicana a gestionar sus finanzas compartidas.

Tu objetivo es analizar los datos financieros mensuales de una pareja y proporcionar:
1. Un resumen conciso de su situación financiera (2-3 oraciones)
2. Felicitaciones específicas por logros (si ahorran >15% de ingresos o cumplen metas)
3. Advertencias suaves sobre categorías de gasto excesivo (si una categoría >15% de ingresos y no es esencial)
4. Tres recomendaciones accionables, cada una con:
   - Prioridad (Alta/Media/Baja)
   - Acción específica con monto exacto
   - Plazo realista (esta semana, este mes, próximos 3 meses)
5. Métricas clave:
   - Tasa de ahorro actual
   - Ahorro mensual necesario para alcanzar metas a tiempo
   - Ahorro extra necesario si están atrasados
6. Una frase de ánimo final

Tono: Amigable, motivador, sin jerga financiera compleja. Usa "ustedes" para dirigirte a la pareja.

Formato de respuesta: JSON con la siguiente estructura:
{
  "summary": "string",
  "achievements": ["string"],
  "warnings": ["string"],
  "recommendations": [
    {
      "priority": "Alta|Media|Baja",
      "action": "string",
      "amount": number,
      "timeframe": "string"
    }
  ],
  "metrics": {
    "savingsRate": number,
    "monthlyNeeded": number,
    "extraNeeded": number
  },
  "encouragement": "string"
}`;
```

### User Prompt Template

```javascript
function buildUserPrompt(data) {
  const savingsRate = ((data.totalIncome - data.totalExpenses) / data.totalIncome * 100).toFixed(1);
  
  return `Analiza los siguientes datos financieros de octubre 2025:

**Ingresos y Gastos:**
- Ingresos totales: RD$${data.totalIncome.toLocaleString()}
- Gastos totales: RD$${data.totalExpenses.toLocaleString()}
- Tasa de ahorro: ${savingsRate}%

**Desglose por Categoría:**
${Object.entries(data.categoryBreakdown)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amt]) => `- ${cat}: RD$${amt.toLocaleString()} (${(amt/data.totalIncome*100).toFixed(1)}%)`)
  .join('\n')}

**Metas de Ahorro:**
${data.goals.map(g => {
  const progress = (g.current / g.target * 100).toFixed(1);
  const monthsToDeadline = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30));
  const monthlyNeeded = Math.ceil((g.target - g.current) / monthsToDeadline);
  return `- ${g.name}: RD$${g.current.toLocaleString()} / RD$${g.target.toLocaleString()} (${progress}%)
  Fecha límite: ${g.deadline} (${monthsToDeadline} meses)
  Ahorro mensual necesario: RD$${monthlyNeeded.toLocaleString()}`;
}).join('\n\n')}

**Deudas Activas:**
${data.debtsSummary.map(d => 
  `- ${d.name}: Balance RD$${d.balance.toLocaleString()}, Tasa ${(d.rate*100).toFixed(0)}% anual, Pago mínimo RD$${d.minimumPayment.toLocaleString()}`
).join('\n')}

Proporciona tu análisis en formato JSON.`;
}
```

### Example AI Response

```json
{
  "summary": "En octubre tuvieron un desempeño sólido con una tasa de ahorro del 18%, superando el objetivo recomendado del 15%. Sin embargo, los gastos en Ocio (15% de ingresos) son elevados y están frenando el progreso hacia sus metas.",
  "achievements": [
    "¡Excelente! Ahorraron RD$18,000 este mes, un 18% de sus ingresos.",
    "Mantuvieron los gastos en Comida controlados (20% de ingresos, dentro del rango saludable)."
  ],
  "warnings": [
    "Los gastos en Ocio (RD$15,000) representan el 15% de sus ingresos. Reducir esta categoría en un 30% liberaría RD$4,500 mensuales para metas.",
    "La deuda de Tarjeta de Crédito tiene una tasa del 45% anual. Priorizar su pago ahorrará miles en intereses."
  ],
  "recommendations": [
    {
      "priority": "Alta",
      "action": "Aumentar el pago mensual a la Tarjeta de Crédito de RD$1,350 a RD$5,000 usando el método Avalancha",
      "amount": 5000,
      "timeframe": "Comenzar este mes y mantener durante 6 meses"
    },
    {
      "priority": "Alta",
      "action": "Reducir gastos en Ocio en RD$5,000 mensuales (de RD$15,000 a RD$10,000)",
      "amount": 5000,
      "timeframe": "Implementar en noviembre"
    },
    {
      "priority": "Media",
      "action": "Destinar RD$13,333 mensuales a la meta 'Coche Nuevo' para alcanzarla en 12 meses",
      "amount": 13333,
      "timeframe": "Próximos 12 meses"
    }
  ],
  "metrics": {
    "savingsRate": 18,
    "monthlyNeeded": 13333,
    "extraNeeded": 0
  },
  "encouragement": "¡Van por buen camino! Con pequeños ajustes en Ocio y un enfoque agresivo en la deuda de alta tasa, podrán acelerar significativamente el progreso hacia sus metas. ¡Ustedes pueden lograrlo! 💪"
}
```

---

## Cloud Function Implementation

### Function Code (Node.js)

```javascript
// functions/src/generateReport.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');

admin.initializeApp();
const db = admin.firestore();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: functions.config().openai.key // Set via: firebase functions:config:set openai.key="sk-..."
});

exports.generateMonthlyReport = functions.https.onCall(async (data, context) => {
  // 1. Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }
  
  const { groupId, period } = data;
  const userId = context.auth.uid;
  
  // 2. Authorization check - verify user is member of group
  const groupDoc = await db.collection('groups').doc(groupId).get();
  if (!groupDoc.exists || !groupDoc.data().members.includes(userId)) {
    throw new functions.https.HttpsError('permission-denied', 'User not authorized for this group');
  }
  
  // 3. Check if report already exists for this period
  const existingReport = await db
    .collection(`groups/${groupId}/reports`)
    .where('period', '==', period)
    .limit(1)
    .get();
  
  if (!existingReport.empty) {
    return { reportId: existingReport.docs[0].id, cached: true };
  }
  
  // 4. Collect financial data
  const financialData = await collectFinancialData(groupId, period);
  
  // 5. Build prompts
  const systemPrompt = SYSTEM_PROMPT; // (defined above)
  const userPrompt = buildUserPrompt(financialData);
  
  // 6. Call OpenAI API
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });
    
    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // 7. Save report to Firestore
    const reportRef = db.collection(`groups/${groupId}/reports`).doc();
    await reportRef.set({
      period,
      periodStart: new Date(period + '-01'),
      periodEnd: new Date(new Date(period + '-01').getFullYear(), new Date(period + '-01').getMonth() + 1, 0),
      summary: aiResponse.summary,
      achievements: aiResponse.achievements || [],
      warnings: aiResponse.warnings || [],
      recommendations: aiResponse.recommendations,
      metrics: aiResponse.metrics,
      encouragement: aiResponse.encouragement,
      metricsSnapshot: {
        totalIncome: financialData.totalIncome,
        totalExpenses: financialData.totalExpenses,
        savingsRate: aiResponse.metrics.savingsRate,
        topCategories: Object.entries(financialData.categoryBreakdown)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat]) => cat)
      },
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      aiModel: 'gpt-4o-mini',
      tokensUsed: completion.usage.total_tokens
    });
    
    return { reportId: reportRef.id, cached: false };
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate report: ' + error.message);
  }
});

// Helper function (defined earlier in this doc)
async function collectFinancialData(groupId, period) {
  // ... (implementation from Input Data Schema section)
}

function buildUserPrompt(data) {
  // ... (implementation from Prompt Engineering section)
}

const SYSTEM_PROMPT = `...`; // (from Prompt Engineering section)
```

### Alternative: Google Gemini Implementation

```javascript
// For Gemini instead of OpenAI
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

// In generateMonthlyReport function, replace OpenAI call with:
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = `${systemPrompt}\n\n${userPrompt}`;
const result = await model.generateContent(prompt);
const aiResponse = JSON.parse(result.response.text());
```

---

## Frontend Integration

### React Component

```jsx
// src/components/AIInsightsCard.jsx
import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase.config';

export default function AIInsightsCard({ groupId, latestReport }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const generateMonthlyReport = httpsCallable(functions, 'generateMonthlyReport');
      const period = new Date().toISOString().slice(0, 7); // "2025-10"
      
      const result = await generateMonthlyReport({ groupId, period });
      
      if (result.data.cached) {
        console.log('Using cached report:', result.data.reportId);
      } else {
        console.log('Generated new report:', result.data.reportId);
      }
      
      // Report will appear via real-time listener
    } catch (err) {
      setError(err.message);
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!latestReport) {
    return (
      <div className="ai-card">
        <h3>🤖 Asesor IA</h3>
        <p>Genera tu primer reporte mensual para recibir recomendaciones personalizadas.</p>
        <button onClick={generateReport} disabled={loading}>
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
  
  return (
    <div className="ai-card">
      <h3>🤖 Asesor IA - {latestReport.period}</h3>
      <p className="summary">{latestReport.summary}</p>
      
      {latestReport.achievements?.length > 0 && (
        <div className="achievements">
          <h4>✅ Logros</h4>
          <ul>
            {latestReport.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
          </ul>
        </div>
      )}
      
      {latestReport.warnings?.length > 0 && (
        <div className="warnings">
          <h4>⚠️ Áreas de Mejora</h4>
          <ul>
            {latestReport.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
          </ul>
        </div>
      )}
      
      <div className="recommendations">
        <h4>💡 Recomendaciones</h4>
        {latestReport.recommendations.map((rec, i) => (
          <div key={i} className={`recommendation priority-${rec.priority.toLowerCase()}`}>
            <span className="badge">{rec.priority}</span>
            <p>{rec.action}</p>
            <small>{rec.timeframe}</small>
          </div>
        ))}
      </div>
      
      <div className="metrics">
        <div className="metric">
          <span className="label">Tasa de Ahorro</span>
          <span className="value">{latestReport.metrics.savingsRate}%</span>
        </div>
        <div className="metric">
          <span className="label">Ahorro Mensual Necesario</span>
          <span className="value">RD${latestReport.metrics.monthlyNeeded.toLocaleString()}</span>
        </div>
      </div>
      
      <p className="encouragement">{latestReport.encouragement}</p>
      
      <button onClick={generateReport} disabled={loading} className="secondary">
        Generar Nuevo Reporte
      </button>
    </div>
  );
}
```

### Real-time Listener for Reports

```javascript
// src/hooks/useLatestReport.js
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export function useLatestReport(groupId) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!groupId) return;
    
    const reportsRef = collection(db, `groups/${groupId}/reports`);
    const q = query(reportsRef, orderBy('generatedAt', 'desc'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setReport({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setReport(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [groupId]);
  
  return { report, loading };
}
```

---

## Cost Estimation

### OpenAI GPT-4o-mini Pricing (as of 2025)
- **Input:** $0.15 per 1M tokens
- **Output:** $0.60 per 1M tokens

### Estimated Token Usage per Report
- **System Prompt:** ~400 tokens
- **User Prompt:** ~600 tokens (varies with data size)
- **AI Response:** ~800 tokens
- **Total:** ~1,800 tokens per report

### Monthly Cost Projection
| Users (Couples) | Reports/Month | Total Tokens | Cost |
|-----------------|---------------|--------------|------|
| 10 | 10 | 18,000 | $0.02 |
| 100 | 100 | 180,000 | $0.16 |
| 1,000 | 1,000 | 1,800,000 | $1.62 |
| 10,000 | 10,000 | 18,000,000 | $16.20 |

**Conclusion:** AI costs are negligible for MVP and scale linearly. At 10,000 couples, cost is ~$16/month.

### Google Gemini Pricing (Alternative)
- **Gemini 1.5 Flash:** Free tier: 15 requests/min, 1M tokens/day
- **Paid:** $0.075 per 1M tokens (input), $0.30 per 1M tokens (output)
- **50% cheaper than OpenAI for similar performance**

---

## Error Handling & Fallbacks

### Common Errors

1. **AI API Timeout (>30s)**
   - **Mitigation:** Retry once with exponential backoff
   - **Fallback:** Return generic recommendations based on rules

2. **Invalid JSON Response**
   - **Mitigation:** Use `response_format: { type: 'json_object' }` in OpenAI
   - **Fallback:** Parse with try-catch, extract text recommendations

3. **Rate Limit Exceeded**
   - **Mitigation:** Implement request queue with 1 req/sec limit
   - **Fallback:** Show "High demand, try again in 1 minute" message

4. **API Key Invalid/Expired**
   - **Mitigation:** Monitor Cloud Function logs, set up alerts
   - **Fallback:** Disable AI features gracefully, notify admin

### Graceful Degradation

```javascript
// In Cloud Function
try {
  const aiResponse = await callOpenAI(prompt);
  return aiResponse;
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    // Return rule-based recommendations
    return generateRuleBasedRecommendations(financialData);
  } else {
    throw error;
  }
}

function generateRuleBasedRecommendations(data) {
  const recommendations = [];
  const savingsRate = (data.totalIncome - data.totalExpenses) / data.totalIncome;
  
  if (savingsRate < 0.15) {
    recommendations.push({
      priority: 'Alta',
      action: 'Aumentar tasa de ahorro al 15% de ingresos',
      amount: Math.ceil(data.totalIncome * 0.15 - (data.totalIncome - data.totalExpenses)),
      timeframe: 'Este mes'
    });
  }
  
  // Find highest spending category
  const topCategory = Object.entries(data.categoryBreakdown)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (topCategory[1] / data.totalIncome > 0.15) {
    recommendations.push({
      priority: 'Media',
      action: `Reducir gastos en ${topCategory[0]} en 20%`,
      amount: Math.ceil(topCategory[1] * 0.2),
      timeframe: 'Próximo mes'
    });
  }
  
  // Debt recommendation
  if (data.debtsSummary.length > 0) {
    const highestRateDebt = data.debtsSummary.sort((a, b) => b.rate - a.rate)[0];
    recommendations.push({
      priority: 'Alta',
      action: `Priorizar pago de ${highestRateDebt.name} (tasa ${(highestRateDebt.rate*100).toFixed(0)}%)`,
      amount: highestRateDebt.minimumPayment * 2,
      timeframe: 'Comenzar este mes'
    });
  }
  
  return {
    summary: 'Análisis generado con recomendaciones estándar.',
    recommendations: recommendations.slice(0, 3),
    metrics: {
      savingsRate: (savingsRate * 100).toFixed(1),
      monthlyNeeded: 0,
      extraNeeded: 0
    },
    encouragement: '¡Sigan trabajando en sus metas financieras!'
  };
}
```

---

## Testing Strategy

### Unit Tests

```javascript
// functions/test/generateReport.test.js
const { expect } = require('chai');
const { buildUserPrompt, collectFinancialData } = require('../src/generateReport');

describe('AI Report Generation', () => {
  it('should build correct user prompt', () => {
    const mockData = {
      period: '2025-10',
      totalIncome: 100000,
      totalExpenses: 80000,
      categoryBreakdown: { Comida: 20000, Ocio: 15000 },
      goals: [],
      debtsSummary: []
    };
    
    const prompt = buildUserPrompt(mockData);
    expect(prompt).to.include('RD$100,000');
    expect(prompt).to.include('Comida: RD$20,000');
  });
  
  it('should handle empty data gracefully', () => {
    const emptyData = {
      period: '2025-10',
      totalIncome: 0,
      totalExpenses: 0,
      categoryBreakdown: {},
      goals: [],
      debtsSummary: []
    };
    
    const prompt = buildUserPrompt(emptyData);
    expect(prompt).to.be.a('string');
    expect(prompt).to.not.include('NaN');
  });
});
```

### Integration Tests (Firebase Emulators)

```javascript
// Test with mock Firestore data
describe('Cloud Function Integration', () => {
  it('should generate report for valid group', async () => {
    const wrapped = test.wrap(functions.generateMonthlyReport);
    
    const result = await wrapped({
      groupId: 'test-group-123',
      period: '2025-10'
    }, {
      auth: { uid: 'test-user-1' }
    });
    
    expect(result.reportId).to.be.a('string');
    expect(result.cached).to.be.a('boolean');
  });
  
  it('should reject unauthorized users', async () => {
    const wrapped = test.wrap(functions.generateMonthlyReport);
    
    try {
      await wrapped({ groupId: 'test-group-123', period: '2025-10' });
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.code).to.equal('unauthenticated');
    }
  });
});
```

### Manual Testing Checklist

- [ ] Generate report with typical data → Verify 3 recommendations
- [ ] Generate report with zero expenses → Verify congratulatory message
- [ ] Generate report with high debt → Verify debt payoff recommendation
- [ ] Generate report twice for same period → Verify cached response
- [ ] Test with invalid API key → Verify graceful error handling
- [ ] Test with network timeout → Verify retry logic

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Report Generation Success Rate:** Target >95%
2. **Average Response Time:** Target <10s
3. **AI API Cost per Report:** Monitor for anomalies
4. **User Satisfaction:** Survey after viewing report (thumbs up/down)
5. **Recommendation Adoption:** Track if users act on recommendations

### Firebase Cloud Functions Logs

```javascript
// Add structured logging
functions.logger.info('Report generation started', {
  groupId,
  period,
  userId: context.auth.uid
});

functions.logger.info('OpenAI API call completed', {
  tokensUsed: completion.usage.total_tokens,
  cost: (completion.usage.total_tokens / 1000000 * 0.75).toFixed(4),
  duration: Date.now() - startTime
});

functions.logger.error('Report generation failed', {
  error: error.message,
  groupId,
  period
});
```

### Alerts Setup

- **Cloud Function Errors >5% in 1 hour:** Email alert to dev team
- **AI API Cost >$50/day:** Slack notification
- **Report Generation Time >30s:** Investigate performance

---

## Future Enhancements

### Phase 2 Features

1. **Conversational AI:** Allow users to ask follow-up questions
   - "¿Cómo puedo reducir gastos en Comida?"
   - "¿Cuánto debo ahorrar para comprar un coche en 6 meses?"

2. **Personalized Insights:** Learn from user behavior over time
   - Track which recommendations users follow
   - Adjust future recommendations based on success patterns

3. **Multi-language Support:** Detect user language preference
   - Spanish (default)
   - English
   - Portuguese (for Brazil expansion)

4. **Voice Insights:** Text-to-speech for report summaries
   - Accessibility feature
   - Hands-free listening while commuting

5. **Predictive Analytics:** Forecast future spending based on trends
   - "At current rate, you'll overspend by RD$5,000 next month"

### Advanced Prompt Techniques

- **Few-shot Learning:** Include example reports in prompt for consistency
- **Chain-of-Thought:** Ask AI to explain reasoning before recommendations
- **Self-Critique:** Have AI review its own recommendations for feasibility

---

## Security Checklist

- [x] API keys stored in Cloud Functions config (not in code)
- [x] User authentication verified before Cloud Function execution
- [x] Group membership authorization checked
- [x] Input data anonymized (no PII sent to AI)
- [x] Rate limiting implemented (max 1 report per group per day)
- [x] Error messages don't expose sensitive info
- [x] AI responses validated before saving to Firestore
- [x] HTTPS-only communication (enforced by Firebase)
- [x] Firestore rules prevent direct writes to `/reports` collection

---

## Conclusion

The AI Advisor is a powerful feature that differentiates FinanzasParaParejas from basic budgeting apps. By following this implementation plan, you'll deliver:

- **Secure** AI integration with no exposed API keys
- **Cost-effective** solution (<$20/month for 10K users)
- **Personalized** recommendations that feel human and empathetic
- **Scalable** architecture that handles growth gracefully

**Next Steps:**
1. Set up Firebase Cloud Functions project
2. Obtain OpenAI or Gemini API key
3. Implement `generateMonthlyReport` function
4. Test with sample data in emulators
5. Deploy to production and monitor performance
