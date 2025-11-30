# FinanzasParaParejas - Wireframes & UX Design

## Overview
Mobile-first wireframes for 5 core screens of the FinanzasParaParejas PWA. Design follows modern, vibrant aesthetics with purple/teal color scheme and glassmorphism effects.

---

## 1. Login Screen

### Layout (Mobile - 375x667px)

```
┌─────────────────────────────────────┐
│                                     │
│         💑 FinanzasParaParejas      │
│         Gestión financiera en       │
│              pareja                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📧 Correo electrónico       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔒 Contraseña               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Iniciar Sesión           │   │
│  │  (Gradient Purple→Teal)     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ────────── o ──────────           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔵 Continuar con Google     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ¿No tienes cuenta? Regístrate     │
│                                     │
└─────────────────────────────────────┘
```

### Design Elements
- **Header:** App logo with couple icon, gradient text
- **Inputs:** Rounded corners (12px), subtle shadow, icon prefixes
- **Primary Button:** Vibrant gradient (purple #8B5CF6 → teal #14B8A6), white text, hover lift effect
- **OAuth Button:** White background, Google logo, border
- **Link:** Teal color, underline on hover

### Interactions
- Email validation on blur
- Password strength indicator
- "Forgot password?" link below password field
- Loading spinner on button during authentication
- Error messages appear below respective fields

---

## 2. Dashboard

### Layout (Mobile - 375x667px)

```
┌─────────────────────────────────────┐
│ Dashboard        👤👤  ⚙️           │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Ingresos    │ │ Gastos      │   │
│ │ RD$100,000  │ │ RD$82,000   │   │
│ │ ↗️ +5%      │ │ ↘️ -3%      │   │
│ └─────────────┘ └─────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 🤖 Asesor IA                │   │
│ │ ✓ Reducir Ocio en 10%       │   │
│ │ ✓ Ahorrar RD$5K extra       │   │
│ │ ✓ Pagar deuda alta primero  │   │
│ │ [Ver Reporte Completo]      │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  Tendencia (6 meses)        │   │
│ │  ╱╲                          │   │
│ │ ╱  ╲  ╱╲                     │   │
│ │      ╲╱  ╲                   │   │
│ └─────────────────────────────┘   │
│                                     │
│ Transacciones Recientes             │
│ ┌─────────────────────────────┐   │
│ │ 🍔 Comida      -RD$1,200    │   │
│ │ Hoy, 14:30                  │   │
│ └─────────────────────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ 🔒 Privada     -RD$500      │   │
│ │ Ayer                        │   │
│ └─────────────────────────────┘   │
│                                     │
│         ┌───┐                       │
│         │ + │ (FAB)                 │
│         └───┘                       │
│                                     │
├─────────────────────────────────────┤
│ 🏠  🎯  💳  👤                      │
└─────────────────────────────────────┘
```

### Design Elements
- **Header:** Title + partner avatars (overlapping circles) + settings icon
- **Summary Cards:** Glassmorphism effect, gradient borders, trend arrows
- **AI Card:** Robot icon, checkmark bullets, subtle glow effect
- **Chart:** Recharts line chart, gradient fill under line
- **Transaction Items:** Category icon, amount (red for expense, green for income), timestamp
- **FAB:** Floating Action Button (purple gradient, shadow, pulse animation)
- **Bottom Nav:** 4 icons (Dashboard, Goals, Debts, Profile), active state highlighted

### Interactions
- Pull-to-refresh for data sync
- Swipe transaction items for edit/delete
- Tap AI card to expand full report
- FAB opens transaction form modal
- Chart interactive (tap data point for details)

---

## 3. Add Transaction Modal

### Layout (Modal Overlay)

```
┌─────────────────────────────────────┐
│ Nueva Transacción            ✕     │
├─────────────────────────────────────┤
│                                     │
│  Tipo                               │
│  ┌──────────┐ ┌──────────┐         │
│  │ Ingreso  │ │ Gasto ✓  │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  Categoría                          │
│  ┌─────────────────────────────┐   │
│  │ 🍔 Comida            ▼      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Monto                              │
│  ┌─────────────────────────────┐   │
│  │ RD$ 1,200.00                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Fecha                              │
│  ┌─────────────────────────────┐   │
│  │ 📅 28/11/2025               │   │
│  └─────────────────────────────┘   │
│                                     │
│  🔒 Transacción Privada    ○       │
│                                     │
│  Notas (opcional)                   │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │       Guardar               │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Design Elements
- **Modal:** Slides up from bottom, rounded top corners, backdrop blur
- **Type Toggle:** Segmented control (green for income, red for expense)
- **Category Dropdown:** Icon + label, custom dropdown with search
- **Amount Input:** Large font, auto-format with commas, currency prefix
- **Date Picker:** Native date picker or custom calendar
- **Privacy Toggle:** iOS-style switch, lock icon, tooltip explanation
- **Notes:** Multi-line textarea, character counter (max 200)
- **Save Button:** Full-width, gradient, disabled state if invalid

### Interactions
- Type toggle changes color scheme
- Category dropdown shows recent + all categories
- Amount input validates numeric only
- Privacy toggle shows info tooltip on first use
- Save button shows loading spinner
- Success: Modal closes with slide-down animation + toast notification

---

## 4. Goals Screen

### Layout (Mobile - 375x667px)

```
┌─────────────────────────────────────┐
│ ← Metas de Ahorro          + Nueva │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 🚗 Coche Nuevo              │   │
│ │ RD$40,000 / RD$200,000      │   │
│ │ ████░░░░░░░░░░░░░░ 20%      │   │
│ │                             │   │
│ │ 📊 12 meses restantes       │   │
│ │ 💰 RD$13,333/mes necesario  │   │
│ │                             │   │
│ │ Contribuciones:             │   │
│ │ 👤 Tú: RD$25,000            │   │
│ │ 👤 Pareja: RD$15,000        │   │
│ │                             │   │
│ │ [Agregar Contribución]      │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 🏖️ Vacaciones               │   │
│ │ RD$15,000 / RD$50,000       │   │
│ │ ██████░░░░░░░░░░░░ 30%      │   │
│ │                             │   │
│ │ 📊 7 meses restantes        │   │
│ │ 💰 RD$5,000/mes necesario   │   │
│ │                             │   │
│ │ [Agregar Contribución]      │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 💍 Anillo Compromiso        │   │
│ │ RD$8,000 / RD$30,000        │   │
│ │ █████░░░░░░░░░░░░░ 27%      │   │
│ │                             │   │
│ │ 📊 11 meses restantes       │   │
│ │ 💰 RD$2,000/mes necesario   │   │
│ │                             │   │
│ │ [Agregar Contribución]      │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Design Elements
- **Header:** Back button, title, "+" button to create goal
- **Goal Cards:** Gradient border (changes color based on progress), shadow
- **Progress Bar:** Animated gradient fill, percentage label
- **Metrics:** Icon + label format, small font
- **Contributors:** Avatar circles + amounts, shows individual contributions
- **Action Button:** Outline style, teal color
- **Empty State:** Illustration + "Crea tu primera meta" if no goals

### Interactions
- Tap card to expand details view
- Swipe card left for edit/delete options
- Progress bar animates on load
- "+" button opens goal creation form
- "Agregar Contribución" opens amount input modal
- Pull-to-refresh updates all goals

---

## 5. Debts Screen

### Layout (Mobile - 375x667px)

```
┌─────────────────────────────────────┐
│ ← Gestión de Deudas        + Nueva │
├─────────────────────────────────────┤
│                                     │
│ Estrategia de Pago                  │
│ ┌──────────┐ ┌──────────┐          │
│ │Avalancha✓│ │Bola Nieve│          │
│ └──────────┘ └──────────┘          │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 💳 Tarjeta de Crédito       │   │
│ │ Balance: RD$27,000          │   │
│ │ Tasa: 45% anual 🔴          │   │
│ │ Pago mínimo: RD$1,350       │   │
│ │                             │   │
│ │ Plan de Pago (Avalancha):   │   │
│ │ ┌─────────────────────┐     │   │
│ │ │ Dic 2025  RD$5,000  │     │   │
│ │ │ Ene 2026  RD$5,000  │     │   │
│ │ │ Feb 2026  RD$5,000  │     │   │
│ │ │ Mar 2026  RD$5,000  │     │   │
│ │ │ Abr 2026  RD$5,000  │     │   │
│ │ │ May 2026  RD$2,000  │     │   │
│ │ └─────────────────────┘     │   │
│ │                             │   │
│ │ Interés total: RD$1,890     │   │
│ │ Fecha pago final: May 2026  │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 🏦 Préstamo Personal        │   │
│ │ Balance: RD$50,000          │   │
│ │ Tasa: 18% anual 🟡          │   │
│ │ Pago mínimo: RD$2,500       │   │
│ │                             │   │
│ │ [Ver Plan de Pago]          │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ 💡 Ahorro con Avalancha     │   │
│ │ vs Bola de Nieve:           │   │
│ │ RD$3,450 menos en intereses │   │
│ │ 4 meses más rápido          │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Design Elements
- **Header:** Back button, title, "+" to add debt
- **Strategy Toggle:** Segmented control, active state highlighted
- **Debt Cards:** Color-coded by interest rate (red >30%, yellow 15-30%, green <15%)
- **Payment Plan:** Collapsible timeline, month + amount rows
- **Comparison Card:** Info icon, green background, savings highlighted
- **Interest Indicator:** Emoji + color coding for urgency
- **Empty State:** "Agrega tus deudas para crear un plan" if none

### Interactions
- Strategy toggle recalculates all payment plans
- Tap debt card to expand payment plan
- Swipe card for edit/delete
- Comparison card toggles between strategies
- "Ver Plan de Pago" expands timeline
- Visual animation when switching strategies

---

## Design System

### Colors
```css
--primary-purple: #8B5CF6
--primary-teal: #14B8A6
--gradient-primary: linear-gradient(135deg, #8B5CF6, #14B8A6)

--success-green: #10B981
--warning-yellow: #F59E0B
--danger-red: #EF4444

--bg-light: #F9FAFB
--bg-dark: #111827
--card-bg: rgba(255, 255, 255, 0.8) /* Glassmorphism */

--text-primary: #111827
--text-secondary: #6B7280
--text-light: #9CA3AF
```

### Typography
```css
--font-family: 'Inter', -apple-system, sans-serif

--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 30px

--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3)
```

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance
- **Color Contrast:** All text meets 4.5:1 ratio minimum
- **Focus States:** Visible keyboard focus indicators (2px outline)
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Form Labels:** All inputs have associated labels
- **Error Messages:** Clear, descriptive, announced to screen readers

### Responsive Breakpoints
```css
/* Mobile First */
--mobile: 320px - 767px
--tablet: 768px - 1023px
--desktop: 1024px+

/* Key adjustments */
- Mobile: Single column, full-width cards
- Tablet: 2-column grid for cards, side navigation
- Desktop: 3-column grid, persistent sidebar
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | <1.5s | Critical for perceived performance |
| Time to Interactive | <3s | On 3G network |
| Largest Contentful Paint | <2.5s | Main content visible |
| Cumulative Layout Shift | <0.1 | Minimal layout shifts |
| First Input Delay | <100ms | Responsive interactions |

### Optimization Strategies
- Lazy load charts and images
- Code splitting by route
- Service Worker caching for static assets
- Optimize images (WebP format, responsive sizes)
- Minimize JavaScript bundle (<200KB gzipped)
- Use CSS animations over JavaScript where possible

---

## User Flow Diagrams

### First-Time User Flow
```
1. Landing Page
   ↓
2. Register (Email + Password)
   ↓
3. Create Profile (Name, Photo)
   ↓
4. Group Setup Choice
   ├─→ Create New Group → Generate Invite Code → Share with Partner
   └─→ Join Existing Group → Enter Invite Code → Validate
   ↓
5. Dashboard (Empty State)
   ↓
6. Onboarding Tour (Optional)
   ├─→ Add First Transaction
   ├─→ Create First Goal
   └─→ Learn About AI Insights
   ↓
7. Active Dashboard
```

### Monthly Report Generation Flow
```
1. Dashboard (End of Month)
   ↓
2. "Generate Report" Button Appears
   ↓
3. User Taps Button
   ↓
4. Loading State (10s max)
   ├─→ Collecting Data
   ├─→ Analyzing Patterns
   └─→ Generating Recommendations
   ↓
5. AI Insights Card Appears
   ├─→ Summary Text
   ├─→ 3 Recommendations
   └─→ Key Metrics
   ↓
6. User Can Expand for Full Report
   ↓
7. Full Report Modal
   ├─→ Detailed Analysis
   ├─→ Charts & Graphs
   ├─→ Action Plan
   └─→ Share/Export Options
```

---

## Next Steps

1. **Validate Wireframes:** Review with stakeholders and potential users
2. **Create High-Fidelity Mockups:** Use Figma for detailed designs
3. **Build Component Library:** Implement reusable React components
4. **Conduct Usability Testing:** Test with 5-10 couples for feedback
5. **Iterate Based on Feedback:** Refine UX based on user testing results
