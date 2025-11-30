# FinanzasParaParejas - User Stories Backlog

## Epic 1: Authentication & User Management

### US-1.1: User Registration
**As a** new user  
**I want to** create an account with email and password  
**So that** I can access the app securely

**Acceptance Criteria:**
- [ ] User can enter email, password, and confirm password
- [ ] Password must be at least 8 characters with 1 uppercase, 1 number
- [ ] Email validation prevents invalid formats
- [ ] User receives email verification link
- [ ] Account is created in Firebase Auth and Firestore `/users/{userId}`
- [ ] Error messages display for duplicate emails or weak passwords

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 0

---

### US-1.2: Google OAuth Login
**As a** user  
**I want to** sign in with my Google account  
**So that** I don't have to remember another password

**Acceptance Criteria:**
- [ ] "Continue with Google" button triggers OAuth flow
- [ ] User is redirected to Google consent screen
- [ ] Successful auth creates user document in Firestore
- [ ] User profile photo and name auto-populated from Google
- [ ] Existing users can link Google account to email account

**Priority:** P1 (Should Have)  
**Story Points:** 3  
**Sprint:** Sprint 0

---

### US-1.3: Password Reset
**As a** user who forgot my password  
**I want to** reset it via email  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot Password?" link on login page
- [ ] User enters email address
- [ ] Firebase sends password reset email
- [ ] Email contains secure reset link (expires in 1 hour)
- [ ] User can set new password and login

**Priority:** P2 (Nice to Have)  
**Story Points:** 2  
**Sprint:** Sprint 1

---

## Epic 2: Group Management & Partner Linking

### US-2.1: Create Financial Group
**As a** logged-in user  
**I want to** create a new financial group  
**So that** I can invite my partner to share finances

**Acceptance Criteria:**
- [ ] User clicks "Create New Group" button
- [ ] System generates unique 6-digit invite code
- [ ] Group document created in `/groups/{groupId}` with user as first member
- [ ] Invite code displayed with copy-to-clipboard button
- [ ] User can share code via WhatsApp, email, or SMS

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 0

---

### US-2.2: Join Existing Group
**As a** user with an invite code  
**I want to** join my partner's financial group  
**So that** we can manage finances together

**Acceptance Criteria:**
- [ ] User clicks "Join Existing Group"
- [ ] Input field accepts 6-digit code
- [ ] System validates code exists and is active
- [ ] User is added to `members` array in group document
- [ ] Error message if code is invalid or group already has 2 members
- [ ] Success: User redirected to shared dashboard

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 0

---

### US-2.3: Leave Group
**As a** group member  
**I want to** leave the financial group  
**So that** I can stop sharing data with my partner

**Acceptance Criteria:**
- [ ] "Leave Group" option in settings (requires confirmation)
- [ ] User removed from `members` array
- [ ] User's private transactions remain but are inaccessible to ex-partner
- [ ] User can create new group or join another
- [ ] If last member leaves, group is soft-deleted (archived)

**Priority:** P2 (Nice to Have)  
**Story Points:** 3  
**Sprint:** Post-MVP

---

## Epic 3: Transaction Management

### US-3.1: Add Income Transaction
**As a** group member  
**I want to** record an income transaction  
**So that** we can track our total earnings

**Acceptance Criteria:**
- [ ] User taps "+" FAB button
- [ ] Modal opens with "Income" type selected
- [ ] User enters amount, category (Salary, Freelance, Other), date
- [ ] Optional: Add note (max 200 characters)
- [ ] Transaction saved to `/groups/{groupId}/transactions/{txId}`
- [ ] Both partners see update in real-time (<2s)
- [ ] Dashboard totals update automatically

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 1

---

### US-3.2: Add Expense Transaction
**As a** group member  
**I want to** record an expense  
**So that** we can track where our money goes

**Acceptance Criteria:**
- [ ] User selects "Expense" type in transaction form
- [ ] Category dropdown shows: Comida, Transporte, Ocio, Salud, Hogar, Servicios, Otros
- [ ] User can add custom category
- [ ] Amount input validates numeric values only
- [ ] Date defaults to today but can be changed
- [ ] Transaction appears in recent transactions list immediately

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 1

---

### US-3.3: Private Transaction
**As a** user  
**I want to** mark a transaction as private  
**So that** my partner sees the amount but not the details

**Acceptance Criteria:**
- [ ] Privacy toggle switch in transaction form
- [ ] When enabled, `private: true` saved to Firestore
- [ ] Partner sees "Transacción privada — Monto: RD$X" instead of category/note
- [ ] Transaction creator can always see full details
- [ ] Private transactions included in total calculations
- [ ] Tooltip explains privacy feature on first use

**Priority:** P1 (Should Have)  
**Story Points:** 3  
**Sprint:** Sprint 1

---

### US-3.4: Edit Transaction
**As a** transaction creator  
**I want to** edit a transaction I added  
**So that** I can correct mistakes

**Acceptance Criteria:**
- [ ] Swipe left on transaction item reveals "Edit" button
- [ ] Tapping opens pre-filled transaction form
- [ ] User can modify any field (amount, category, date, privacy)
- [ ] "Update" button saves changes
- [ ] Firestore document updated with `updatedAt` timestamp
- [ ] Partner sees updated transaction in real-time

**Priority:** P1 (Should Have)  
**Story Points:** 3  
**Sprint:** Sprint 1

---

### US-3.5: Delete Transaction
**As a** transaction creator  
**I want to** delete a transaction  
**So that** I can remove duplicates or errors

**Acceptance Criteria:**
- [ ] Swipe left reveals "Delete" button (red)
- [ ] Confirmation dialog: "¿Eliminar esta transacción?"
- [ ] User confirms → Document deleted from Firestore
- [ ] Transaction removed from both users' views
- [ ] Dashboard totals recalculate automatically
- [ ] Undo option appears for 5 seconds (toast notification)

**Priority:** P1 (Should Have)  
**Story Points:** 2  
**Sprint:** Sprint 1

---

### US-3.6: Filter Transactions
**As a** user  
**I want to** filter transactions by date, category, or type  
**So that** I can analyze specific spending patterns

**Acceptance Criteria:**
- [ ] Filter button opens filter panel
- [ ] Date range picker (This Month, Last Month, Custom Range)
- [ ] Category multi-select checkboxes
- [ ] Type filter (Income, Expense, All)
- [ ] "Apply Filters" updates transaction list
- [ ] Filter count badge shows active filters
- [ ] "Clear All" resets to default view

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

## Epic 4: Dashboard & Visualizations

### US-4.1: View Monthly Summary
**As a** user  
**I want to** see total income and expenses for the current month  
**So that** I know our financial status at a glance

**Acceptance Criteria:**
- [ ] Dashboard displays two summary cards: "Ingresos" and "Gastos"
- [ ] Amounts calculated from current month's transactions
- [ ] Percentage change vs previous month shown with arrow (↗️ or ↘️)
- [ ] Green for positive trends, red for negative
- [ ] Tapping card shows detailed breakdown

**Priority:** P0 (Must Have)  
**Story Points:** 3  
**Sprint:** Sprint 1

---

### US-4.2: Spending Trend Chart
**As a** user  
**I want to** see a chart of income vs expenses over the last 6 months  
**So that** I can identify spending patterns

**Acceptance Criteria:**
- [ ] Line chart displays on dashboard below summary cards
- [ ] X-axis: Last 6 months (labels: "Oct", "Nov", etc.)
- [ ] Y-axis: Amount in RD$
- [ ] Two lines: Income (green) and Expenses (red)
- [ ] Gradient fill under lines for visual appeal
- [ ] Responsive: Scales to mobile screen width
- [ ] Interactive: Tap data point to see exact values

**Priority:** P1 (Should Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

### US-4.3: Category Breakdown Pie Chart
**As a** user  
**I want to** see a pie chart of expenses by category  
**So that** I know where most money is spent

**Acceptance Criteria:**
- [ ] Pie chart shows top 5 expense categories
- [ ] Each slice labeled with category name and percentage
- [ ] Color-coded slices (consistent colors per category)
- [ ] "Others" slice for remaining categories
- [ ] Tapping slice filters transactions to that category
- [ ] Chart updates when date range changes

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

## Epic 5: Savings Goals

### US-5.1: Create Savings Goal
**As a** couple  
**I want to** create a savings goal with a target amount and deadline  
**So that** we can work towards a shared objective

**Acceptance Criteria:**
- [ ] User taps "+" on Goals screen
- [ ] Form fields: Goal name, target amount, deadline (date picker), optional emoji
- [ ] Validation: Target > 0, deadline in future
- [ ] Goal saved to `/groups/{groupId}/goals/{goalId}`
- [ ] Initial `currentAmount: 0`
- [ ] Goal card appears on Goals screen with 0% progress

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

### US-5.2: Add Contribution to Goal
**As a** group member  
**I want to** add money to a savings goal  
**So that** we can track progress towards our target

**Acceptance Criteria:**
- [ ] "Agregar Contribución" button on goal card
- [ ] Modal prompts for amount
- [ ] Amount added to `currentAmount` in Firestore
- [ ] Contribution tracked per user in `contributors` map
- [ ] Progress bar updates with animation
- [ ] Percentage recalculated: `(current / target) * 100`
- [ ] Both partners see update in real-time

**Priority:** P0 (Must Have)  
**Story Points:** 3  
**Sprint:** Sprint 2

---

### US-5.3: Goal Progress Projection
**As a** user  
**I want to** see how many months until we reach our goal  
**So that** I can plan our savings strategy

**Acceptance Criteria:**
- [ ] System calculates average monthly savings from past 3 months
- [ ] Formula: `monthsRemaining = ceil((target - current) / avgMonthlySavings)`
- [ ] Display: "X meses restantes" on goal card
- [ ] If avgMonthlySavings = 0, show "Agrega contribuciones para ver proyección"
- [ ] If current >= target, show "¡Meta alcanzada! 🎉"
- [ ] Projection updates when new contributions added

**Priority:** P1 (Should Have)  
**Story Points:** 3  
**Sprint:** Sprint 2

---

### US-5.4: Edit Goal
**As a** user  
**I want to** edit a goal's target or deadline  
**So that** I can adjust to changing circumstances

**Acceptance Criteria:**
- [ ] Tap goal card → "Edit" button in expanded view
- [ ] Pre-filled form with current values
- [ ] User can modify name, target, deadline
- [ ] Cannot reduce target below current amount
- [ ] Changes saved to Firestore
- [ ] Progress percentage recalculates

**Priority:** P2 (Nice to Have)  
**Story Points:** 2  
**Sprint:** Post-MVP

---

### US-5.5: Delete Goal
**As a** user  
**I want to** delete a completed or abandoned goal  
**So that** it doesn't clutter my goals list

**Acceptance Criteria:**
- [ ] "Delete Goal" option in expanded view (requires confirmation)
- [ ] Confirmation dialog warns if goal has contributions
- [ ] User confirms → Goal document deleted
- [ ] Contributions data archived (not lost)
- [ ] Goal removed from both users' views

**Priority:** P2 (Nice to Have)  
**Story Points:** 2  
**Sprint:** Post-MVP

---

## Epic 6: Debt Management

### US-6.1: Add Debt
**As a** user  
**I want to** record a debt with balance and interest rate  
**So that** we can create a payoff plan

**Acceptance Criteria:**
- [ ] User taps "+" on Debts screen
- [ ] Form fields: Debt name, creditor, initial amount, current balance, interest rate (%), minimum payment, due date
- [ ] Validation: Balance > 0, rate >= 0
- [ ] Debt saved to `/groups/{groupId}/debts/{debtId}`
- [ ] Debt card appears with color-coded interest indicator (red >30%, yellow 15-30%, green <15%)

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

### US-6.2: Avalanche Debt Strategy
**As a** user  
**I want to** see a payment plan using the Avalanche method (highest interest first)  
**So that** I can minimize total interest paid

**Acceptance Criteria:**
- [ ] User selects "Avalancha" strategy toggle
- [ ] System sorts debts by interest rate (descending)
- [ ] Generates payment plan: Pay minimums on all, extra to highest rate
- [ ] Timeline shows month-by-month payments until all debts cleared
- [ ] Displays total interest paid and payoff date
- [ ] Plan updates when debts added/removed or strategy changed

**Priority:** P1 (Should Have)  
**Story Points:** 8  
**Sprint:** Sprint 2

---

### US-6.3: Snowball Debt Strategy
**As a** user  
**I want to** see a payment plan using the Snowball method (smallest balance first)  
**So that** I can get quick wins by eliminating debts faster

**Acceptance Criteria:**
- [ ] User selects "Bola de Nieve" strategy toggle
- [ ] System sorts debts by balance (ascending)
- [ ] Generates payment plan: Pay minimums on all, extra to smallest balance
- [ ] Timeline shows month-by-month payments
- [ ] Displays total interest paid and payoff date
- [ ] Comparison card shows difference vs Avalanche (interest savings, time difference)

**Priority:** P1 (Should Have)  
**Story Points:** 8  
**Sprint:** Sprint 2

---

### US-6.4: Record Debt Payment
**As a** user  
**I want to** record a payment towards a debt  
**So that** the balance updates and plan adjusts

**Acceptance Criteria:**
- [ ] "Registrar Pago" button on debt card
- [ ] User enters payment amount and date
- [ ] Balance reduced: `newBalance = currentBalance - payment`
- [ ] Payment history stored in subcollection `/debts/{debtId}/payments`
- [ ] Payment plan recalculates with new balance
- [ ] If balance reaches 0, debt marked as "Paid Off" with celebration animation

**Priority:** P1 (Should Have)  
**Story Points:** 5  
**Sprint:** Sprint 2

---

### US-6.5: Debt Interest Calculator
**As a** user  
**I want to** see how much interest I'll pay over time  
**So that** I understand the cost of my debt

**Acceptance Criteria:**
- [ ] Expanded debt view shows "Interest Calculator"
- [ ] User can adjust monthly payment amount (slider or input)
- [ ] System calculates:
  - Total interest paid
  - Payoff date
  - Interest savings vs minimum payments
- [ ] Visual chart shows balance declining over time
- [ ] Comparison: "Paying RD$X extra per month saves RD$Y in interest"

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Post-MVP

---

## Epic 7: AI-Powered Insights

### US-7.1: Generate Monthly Report
**As a** user at the end of the month  
**I want to** generate an AI-powered financial report  
**So that** I get personalized recommendations

**Acceptance Criteria:**
- [ ] "Generate Report" button appears on dashboard on last day of month
- [ ] User taps button → Loading state (max 10s)
- [ ] Cloud Function collects anonymized data:
  - Total income/expenses
  - Category breakdown
  - Goals progress
  - Debts summary
- [ ] Function calls OpenAI/Gemini API with system prompt
- [ ] AI response parsed and saved to `/groups/{groupId}/reports/{reportId}`
- [ ] Report card appears on dashboard with summary

**Priority:** P0 (Must Have)  
**Story Points:** 8  
**Sprint:** Sprint 3

---

### US-7.2: View AI Recommendations
**As a** user  
**I want to** see 3 actionable recommendations from the AI  
**So that** I know what to improve

**Acceptance Criteria:**
- [ ] AI Insights card shows:
  - Summary text (2-3 sentences)
  - 3 recommendations with priority badges (High/Medium/Low)
  - Each recommendation includes specific amount and timeframe
- [ ] Example: "Reducir gastos en Ocio en RD$5,000 este mes"
- [ ] Tapping card expands to full report view
- [ ] Recommendations stored in Firestore for history

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 3

---

### US-7.3: AI Metrics Dashboard
**As a** user  
**I want to** see key financial metrics calculated by AI  
**So that** I understand my financial health

**Acceptance Criteria:**
- [ ] Metrics displayed in report:
  - Savings rate: `(income - expenses) / income * 100`
  - Months to goal (average across all goals)
  - Debt-to-income ratio
  - Top spending category
- [ ] Visual indicators (icons, colors) for good/bad metrics
- [ ] Trend arrows showing improvement/decline vs last month

**Priority:** P1 (Should Have)  
**Story Points:** 5  
**Sprint:** Sprint 3

---

### US-7.4: Report History
**As a** user  
**I want to** view past monthly reports  
**So that** I can track progress over time

**Acceptance Criteria:**
- [ ] "Report History" link in AI card
- [ ] List view shows all past reports (newest first)
- [ ] Each item shows: Month, summary snippet, key metric
- [ ] Tapping opens full report in modal
- [ ] Reports stored indefinitely in Firestore

**Priority:** P2 (Nice to Have)  
**Story Points:** 3  
**Sprint:** Post-MVP

---

## Epic 8: Settings & Preferences

### US-8.1: Change Currency
**As a** user  
**I want to** change the default currency  
**So that** amounts display in my preferred format

**Acceptance Criteria:**
- [ ] Settings page has "Currency" dropdown
- [ ] Options: DOP (RD$), USD ($), EUR (€), etc.
- [ ] Selection saved to `/groups/{groupId}/currency`
- [ ] All amounts throughout app update to new currency symbol
- [ ] Note: No automatic conversion (manual entry required)

**Priority:** P2 (Nice to Have)  
**Story Points:** 3  
**Sprint:** Post-MVP

---

### US-8.2: Notification Preferences
**As a** user  
**I want to** control which notifications I receive  
**So that** I'm not overwhelmed

**Acceptance Criteria:**
- [ ] Settings page has notification toggles:
  - Transaction added by partner
  - Goal milestone reached (25%, 50%, 75%, 100%)
  - Budget threshold exceeded (80%, 100%)
  - Monthly report ready
- [ ] Preferences saved to `/users/{userId}/preferences/notifications`
- [ ] Push notifications sent via Firebase Cloud Messaging (if enabled)

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Post-MVP

---

### US-8.3: Export Data
**As a** user  
**I want to** export my financial data as CSV  
**So that** I can analyze it in Excel or backup

**Acceptance Criteria:**
- [ ] "Export Data" button in settings
- [ ] User selects date range and data type (Transactions, Goals, Debts, All)
- [ ] System generates CSV file
- [ ] File downloads to device
- [ ] CSV includes all relevant fields (date, category, amount, etc.)

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Post-MVP

---

## Epic 9: Testing & Quality Assurance

### US-9.1: Unit Tests for Calculations
**As a** developer  
**I want to** have unit tests for critical calculation functions  
**So that** financial logic is always correct

**Acceptance Criteria:**
- [ ] Tests for `calculateMonthsToGoal()` - edge cases: 0, negative, huge numbers
- [ ] Tests for `calculateAvalanche()` and `calculateSnowball()` - multiple debts
- [ ] Tests for `calculateSavingsRate()` - division by zero handling
- [ ] Tests for privacy filtering - correct masking logic
- [ ] All tests pass with >80% code coverage

**Priority:** P0 (Must Have)  
**Story Points:** 5  
**Sprint:** Sprint 3

---

### US-9.2: E2E Tests for Critical Flows
**As a** developer  
**I want to** have E2E tests for user journeys  
**So that** regressions are caught before deployment

**Acceptance Criteria:**
- [ ] Test: Register → Create Group → Invite Partner → Join Group
- [ ] Test: Add Transaction → Verify Dashboard Update (<2s)
- [ ] Test: Create Goal → Add Contribution → Check Progress Bar
- [ ] Test: Add Debt → Select Strategy → Verify Payment Plan
- [ ] Test: Generate AI Report → Verify Recommendations Display
- [ ] All tests run in CI/CD pipeline (GitHub Actions or Firebase)

**Priority:** P0 (Must Have)  
**Story Points:** 8  
**Sprint:** Sprint 3

---

## Epic 10: Performance & PWA

### US-10.1: PWA Installation
**As a** mobile user  
**I want to** install the app on my home screen  
**So that** it feels like a native app

**Acceptance Criteria:**
- [ ] PWA manifest configured with name, icons, theme colors
- [ ] Service Worker registered for offline support
- [ ] "Add to Home Screen" prompt appears after 2 visits
- [ ] Installed app opens in standalone mode (no browser UI)
- [ ] App icon appears on home screen

**Priority:** P1 (Should Have)  
**Story Points:** 5  
**Sprint:** Sprint 0

---

### US-10.2: Offline Support
**As a** user with poor connectivity  
**I want to** view cached data when offline  
**So that** I can still use the app

**Acceptance Criteria:**
- [ ] Service Worker caches static assets (HTML, CSS, JS, images)
- [ ] Firestore persistence enabled (local cache)
- [ ] User can view dashboard and transactions offline
- [ ] "You're offline" banner appears when no connection
- [ ] Changes sync automatically when connection restored

**Priority:** P2 (Nice to Have)  
**Story Points:** 5  
**Sprint:** Sprint 3

---

### US-10.3: Performance Optimization
**As a** user  
**I want to** the app to load quickly  
**So that** I don't wait

**Acceptance Criteria:**
- [ ] Lighthouse Performance score >85
- [ ] Time to Interactive <3s on 3G network
- [ ] Code splitting by route (lazy loading)
- [ ] Images optimized (WebP, responsive sizes)
- [ ] JavaScript bundle <200KB gzipped
- [ ] Recharts loaded only when dashboard visible

**Priority:** P1 (Should Have)  
**Story Points:** 5  
**Sprint:** Sprint 3

---

## Summary Statistics

| Epic | Total Stories | Total Story Points |
|------|---------------|-------------------|
| 1. Authentication | 3 | 10 |
| 2. Group Management | 3 | 13 |
| 3. Transactions | 6 | 23 |
| 4. Dashboard | 3 | 13 |
| 5. Savings Goals | 5 | 15 |
| 6. Debt Management | 5 | 28 |
| 7. AI Insights | 4 | 21 |
| 8. Settings | 3 | 13 |
| 9. Testing | 2 | 13 |
| 10. PWA | 3 | 15 |
| **TOTAL** | **37** | **164** |

## Sprint Allocation

### Sprint 0 (Weeks 1-2): 23 points
- US-1.1, US-1.2 (Authentication)
- US-2.1, US-2.2 (Group Management)
- US-10.1 (PWA Setup)

### Sprint 1 (Weeks 3-4): 36 points
- US-1.3 (Password Reset)
- US-3.1, US-3.2, US-3.3, US-3.4, US-3.5 (Transactions)
- US-4.1 (Dashboard Summary)

### Sprint 2 (Weeks 5-6): 51 points
- US-3.6 (Transaction Filters)
- US-4.2, US-4.3 (Charts)
- US-5.1, US-5.2, US-5.3 (Goals)
- US-6.1, US-6.2, US-6.3, US-6.4 (Debts)

### Sprint 3 (Weeks 7-8): 41 points
- US-7.1, US-7.2, US-7.3 (AI Insights)
- US-9.1, US-9.2 (Testing)
- US-10.2, US-10.3 (Performance)

### Post-MVP: 13 points
- US-2.3, US-5.4, US-5.5, US-6.5, US-7.4, US-8.1, US-8.2, US-8.3

---

## Definition of Done

A user story is considered "Done" when:
- [ ] Code implemented and peer-reviewed
- [ ] Unit tests written and passing
- [ ] Integration tested in Firebase emulators
- [ ] Acceptance criteria verified
- [ ] Responsive design tested on mobile (320px, 375px, 414px)
- [ ] Accessibility checked (keyboard navigation, screen reader)
- [ ] Firestore security rules updated if needed
- [ ] Documentation updated (if API changes)
- [ ] Deployed to staging environment
- [ ] Product owner approval

---

## Prioritization Framework

**P0 (Must Have):** Core functionality required for MVP launch  
**P1 (Should Have):** Important features that enhance UX significantly  
**P2 (Nice to Have):** Features that can be added post-MVP

**Story Points Scale:**
- 1-2: Simple, well-understood task (<4 hours)
- 3-5: Moderate complexity (4-8 hours)
- 8: Complex, requires research or multiple components (1-2 days)
- 13+: Epic-level, should be broken down further
