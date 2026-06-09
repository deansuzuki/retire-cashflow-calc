# Tax-Efficient Decumulation Engine: Implementation Plan & Architecture

This master document details the architecture, design decisions, and components of the **Dean Antigravity Experiment** (formerly the retirement portfolio decumulation calculator). It acts as a comprehensive reference for both past implementations and ongoing optimization.

---

## 🏛️ System Architecture Overview

The application is a high-performance, single-page client-side web application built with a modern frontend architecture:
*   **Structure & Semantics**: [index.html](file:///Users/deansuzuki/Documents/retire-cashflow-calc/index.html)
*   **Styling & Design System**: [index.css](file:///Users/deansuzuki/Documents/retire-cashflow-calc/index.css) (CSS custom properties, glassmorphism, dynamic flex/grid, full responsive design)
*   **Financial Engine & Chart Logic**: [index.js](file:///Users/deansuzuki/Documents/retire-cashflow-calc/index.js) (Tax modeling, progressive bracket engine, bisection decumulation solver, Chart.js integrations)
*   **Containerization & Deployment**: [Dockerfile](file:///Users/deansuzuki/Documents/retire-cashflow-calc/Dockerfile) & [nginx.conf](file:///Users/deansuzuki/Documents/retire-cashflow-calc/nginx.conf) (Containerized serving via Nginx on Google Cloud Run)

```mermaid
graph TD
    A["User Inputs (Age, Assets, Rates, State)"] -->|Event Listeners| B["State Object (state)"]
    B -->|State Trigger| C["Bisection Solver (findMaxMonthlyCashflow)"]
    C -->|Simulates Years| D["Tax Progressive Engine (computeTaxBill)"]
    D -->|Iterative Feedback loop (Tax-on-Tax)| C
    C -->|Results Schedule| E["Dynamic Rendering Engine"]
    E -->|Renders| F["Annual Ledger Table"]
    E -->|Plots| G["Line Chart (Account Balances)"]
    E -->|Plots| H["Symmetric Bar Chart (Sources vs Uses)"]
```

---

## 🧮 1. Dynamic Financial & Progressive Tax Engine

The core solver uses a mathematical bisection (binary search) algorithm to optimize the maximum sustainable monthly cashflow without depleting assets prematurely.

### Progressive Tax Bracket Database
*   **Federal Ordinary Brackets (2026 Models)**: Fully implements progressive thresholds for **Single** and **Married Filing Jointly (MFJ)**, incorporating standard deductions ($16,100 / $32,200).
*   **Federal Capital Gains & NIIT**: Applies 0%/15%/20% capital gains brackets aligned with standard taxable income. Calculates **Net Investment Income Tax (NIIT)** of 3.8% for income above $200k (Single) / $250k (MFJ).
*   **State Tax Engine**: Features a database of state-specific taxes, classifying states as:
    *   *None* (e.g., Texas, Florida, Nevada, Alaska)
    *   *Flat* (e.g., Colorado: 4.4%, Illinois: 4.95%)
    *   *Progressive Brackets* (e.g., California, New York)
*   **Early Withdrawal Penalty**: Evaluates client age month-by-month, applying a 10% IRS penalty on Pre-Tax (IRA/401k) distributions taken before age 59.5.

### Circular "Tax-on-Tax" Gross-Up Solver
Because taxes are paid out of withdrawn assets, taking additional funds to cover the tax bill generates extra taxable income. The engine resolves this circular reference through an iterative feedback loop:
1.  Compute net withdrawal needed.
2.  Estimate tax bill based on withdrawals.
3.  Add tax to net withdrawal to get a new candidate gross withdrawal.
4.  Re-calculate tax and iterate (capped at 15 cycles) until convergence ($\Delta < \$0.10$).

---

## 🎨 2. UI & Premium Aesthetics

The interface is styled using customized CSS variables, avoiding heavy frameworks to maintain extreme client-side rendering speed:
*   **Palette**: Dark mode aesthetic utilizing a tailored slate/indigo background (`#0f172a`), HSL glow metrics, and color-coded indicator elements:
    *   **Brokerage**: Silver/Slate (`#94a3b8`)
    *   **Pre-Tax**: Amber/Gold (`#f59e0b`)
    *   **Roth**: Emerald Green (`#10b981`)
*   **Glassmorphic Accents**: Subtle gradients, translucent panels (`backdrop-filter: blur`), and micro-interactions (hover translations and scaling on inputs and buttons).

---

## 📈 3. Data Visualization & Charts

Two separate high-performance **Chart.js** charts are rendered dynamically in real-time as state inputs update:

### A. Trajectory Balances Line Chart ("Multi-Bucket Decumulation Sequence")
*   **Type**: Multi-series line chart.
*   **Behavior**: Non-stacked. Shows the **absolute ending balances** for the Brokerage, Pre-Tax, and Roth accounts year-by-year.
*   **Fix**: Standardized from a stacked area layout to an absolute balance layout to prevent misleading cumulative curves.

### B. Annual Cashflow Stacked Bar Chart ("Annual Gross Cashflow & Account Draws")
*   **Type**: Symmetric dual-stack bar chart.
*   **Aesthetic Balance**: Features side-by-side columns representing the self-balancing **Sources vs. Uses** concept:
    *   **Left Bar (Sources Stack)**: Brokerage Draw, Pre-Tax Draw, Roth Draw.
    *   **Right Bar (Uses Stack)**: Net Spending, Fed Income Tax, Fed CapGains Tax, State Tax, NIIT, Penalty.
    *   *Result*: Both columns are mathematically equal in height (`Gross Draws = Net Spending + Taxes + Penalties`), validating solver balance.

---

## ☁️ 4. Containerization & Production Deployment

The project is packaged and optimized to run on **Google Cloud Run** inside an automated workflow:
1.  **Docker Multi-Stage Build**:
    *   *Stage 1*: Node Alpine container installs dependencies (`vite`) and runs `npm run build` to generate compressed static outputs.
    *   *Stage 2*: Nginx Alpine container copies the `/app/dist` files and serves them via standard port `8080` with optimized gzip compression.
2.  **Continuous Deployment Pipeline**:
    *   Monitors pushes to the GitHub repository `main` branch.
    *   Triggers automated Cloud Build tasks.
    *   Deploys fresh, immutable revisions to the Cloud Run service URL.

---

## 📝 5. Recently Completed Implementations

Here is a summary of the recently executed and completed adjustments:
*   **[COMPLETED] Title Rename**: Updated the branding title from `"CFP Professional Suite"` to `"Dean Antigravity Experiment"` in both the header element and the HTML `<title>` meta tags.
*   **[COMPLETED] UI Label Simplification**: Renamed the form label from `"Client Current Age"` to `"Current Age"` for improved text scannability.
*   **[COMPLETED] Starting Assets Recalibration**: Adjusted default scenario values:
    *   *Pre-Tax Assets*: `$300,000` (from `$500,000`)
    *   *Roth Assets*: `$100,000` (from `$200,000`)
    *   *Brokerage Assets*: `$100,000` (from `$300,000`)
*   **[COMPLETED] Trajectory Stacking Bug**: Patched the dataset stacking behavior, enabling correct individual plotting of account values (e.g., displaying exact Roth balance curve instead of the cumulative total of all accounts).
