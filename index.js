/**
 * Tax-Efficient Decumulation Engine - index.js
 * Advanced Financial Planning Logic & Interactive Multi-Bucket Simulation
 * 2026 Progressive Tax Bracket Calculator & State Tax Database
 */

// Application State
const state = {
  assetsBrokerage: 100000,
  brokerageCostBasis: 60.0,
  assetsPreTax: 300000,
  assetsRoth: 100000,
  clientAge: 55,
  appreciationRate: 6.0,
  inflationRate: 2.5,
  horizonYears: 30,
  taxRateOrdinary: 22.0,
  taxRateCapitalGains: 15.0,
  strategy: 'amortized', // 'amortized' or 'preservation'
  filingStatus: 'mfj', // 'single' or 'mfj'
  stateResidence: 'Custom' // 'Custom' or State Abbreviation
};

// State Income Tax Database (2026 Models)
const STATE_TAX_DATA = {
  "AL": { name: "Alabama", type: "progressive", brackets: [{ limit: 1000, rate: 0.02 }, { limit: 3000, rate: 0.04 }, { limit: Infinity, rate: 0.05 }] },
  "AK": { name: "Alaska", type: "none" },
  "AZ": { name: "Arizona", type: "flat", rate: 0.025 },
  "AR": { name: "Arkansas", type: "progressive", brackets: [{ limit: 10000, rate: 0.02 }, { limit: 25000, rate: 0.03 }, { limit: Infinity, rate: 0.044 }] },
  "CA": { name: "California", type: "progressive", brackets: [
    { limit: 10412, rate: 0.01 }, { limit: 24684, rate: 0.02 }, { limit: 38959, rate: 0.04 },
    { limit: 54081, rate: 0.06 }, { limit: 68350, rate: 0.08 }, { limit: 349137, rate: 0.093 },
    { limit: 418961, rate: 0.103 }, { limit: 698271, rate: 0.113 }, { limit: 1000000, rate: 0.123 },
    { limit: Infinity, rate: 0.133 }
  ]},
  "CO": { name: "Colorado", type: "flat", rate: 0.044 },
  "CT": { name: "Connecticut", type: "progressive", brackets: [
    { limit: 10000, rate: 0.03 }, { limit: 50000, rate: 0.05 }, { limit: 100000, rate: 0.055 },
    { limit: 200000, rate: 0.06 }, { limit: 250000, rate: 0.065 }, { limit: 500000, rate: 0.069 },
    { limit: Infinity, rate: 0.0699 }
  ]},
  "DE": { name: "Delaware", type: "progressive", brackets: [
    { limit: 5000, rate: 0.022 }, { limit: 10000, rate: 0.039 }, { limit: 20000, rate: 0.048 },
    { limit: 25000, rate: 0.052 }, { limit: 60000, rate: 0.0555 }, { limit: Infinity, rate: 0.066 }
  ]},
  "DC": { name: "District of Columbia", type: "progressive", brackets: [
    { limit: 10000, rate: 0.04 }, { limit: 40000, rate: 0.06 }, { limit: 60000, rate: 0.065 },
    { limit: 250000, rate: 0.085 }, { limit: 500000, rate: 0.0925 }, { limit: 1000000, rate: 0.0975 },
    { limit: Infinity, rate: 0.1075 }
  ]},
  "FL": { name: "Florida", type: "none" },
  "GA": { name: "Georgia", type: "flat", rate: 0.0499 },
  "HI": { name: "Hawaii", type: "progressive", brackets: [
    { limit: 2400, rate: 0.014 }, { limit: 4800, rate: 0.032 }, { limit: 9600, rate: 0.055 },
    { limit: 14400, rate: 0.064 }, { limit: 19200, rate: 0.068 }, { limit: 24000, rate: 0.072 },
    { limit: 36000, rate: 0.076 }, { limit: 48000, rate: 0.0825 }, { limit: 150000, rate: 0.09 },
    { limit: 175000, rate: 0.10 }, { limit: 200000, rate: 0.105 }, { limit: Infinity, rate: 0.11 }
  ]},
  "ID": { name: "Idaho", type: "flat", rate: 0.053 },
  "IL": { name: "Illinois", type: "flat", rate: 0.0495 },
  "IN": { name: "Indiana", type: "flat", rate: 0.0295 },
  "IA": { name: "Iowa", type: "flat", rate: 0.038 },
  "KS": { name: "Kansas", type: "progressive", brackets: [{ limit: 30000, rate: 0.031 }, { limit: 60000, rate: 0.0525 }, { limit: Infinity, rate: 0.057 }] },
  "KY": { name: "Kentucky", type: "flat", rate: 0.035 },
  "LA": { name: "Louisiana", type: "flat", rate: 0.030 },
  "ME": { name: "Maine", type: "progressive", brackets: [{ limit: 48000, rate: 0.058 }, { limit: 114000, rate: 0.0675 }, { limit: Infinity, rate: 0.0715 }] },
  "MD": { name: "Maryland", type: "progressive", brackets: [
    { limit: 1000, rate: 0.02 }, { limit: 2000, rate: 0.03 }, { limit: 3000, rate: 0.04 },
    { limit: 100000, rate: 0.0475 }, { limit: 125000, rate: 0.05 }, { limit: 150000, rate: 0.0525 },
    { limit: 250000, rate: 0.055 }, { limit: Infinity, rate: 0.0575 }
  ]},
  "MA": { name: "Massachusetts", type: "flat", rate: 0.05 },
  "MI": { name: "Michigan", type: "flat", rate: 0.0425 },
  "MN": { name: "Minnesota", type: "progressive", brackets: [
    { limit: 30000, rate: 0.0535 }, { limit: 100000, rate: 0.068 }, { limit: 160000, rate: 0.0785 }, { limit: Infinity, rate: 0.0985 }
  ]},
  "MS": { name: "Mississippi", type: "flat", rate: 0.04 },
  "MO": { name: "Missouri", type: "progressive", brackets: [{ limit: 10000, rate: 0.02 }, { limit: Infinity, rate: 0.048 }] },
  "MT": { name: "Montana", type: "progressive", brackets: [{ limit: 20500, rate: 0.047 }, { limit: Infinity, rate: 0.059 }] },
  "NE": { name: "Nebraska", type: "progressive", brackets: [
    { limit: 4000, rate: 0.0246 }, { limit: 22000, rate: 0.0351 }, { limit: 35000, rate: 0.0501 }, { limit: Infinity, rate: 0.0584 }
  ]},
  "NV": { name: "Nevada", type: "none" },
  "NH": { name: "New Hampshire", type: "none" },
  "NJ": { name: "New Jersey", type: "progressive", brackets: [
    { limit: 20000, rate: 0.014 }, { limit: 35000, rate: 0.0175 }, { limit: 40000, rate: 0.035 },
    { limit: 75000, rate: 0.05525 }, { limit: 500000, rate: 0.0637 }, { limit: 1000000, rate: 0.0897 },
    { limit: Infinity, rate: 0.1075 }
  ]},
  "NM": { name: "New Mexico", type: "progressive", brackets: [
    { limit: 5500, rate: 0.017 }, { limit: 11000, rate: 0.032 }, { limit: 16000, rate: 0.047 }, { limit: Infinity, rate: 0.059 }
  ]},
  "NY": { name: "New York", type: "progressive", brackets: [
    { limit: 8500, rate: 0.04 }, { limit: 11700, rate: 0.045 }, { limit: 13900, rate: 0.0525 },
    { limit: 21400, rate: 0.0585 }, { limit: 80650, rate: 0.0625 }, { limit: 215400, rate: 0.0685 },
    { limit: 1077550, rate: 0.0965 }, { limit: 5000000, rate: 0.103 }, { limit: Infinity, rate: 0.109 }
  ]},
  "NC": { name: "North Carolina", type: "flat", rate: 0.0399 },
  "ND": { name: "North Dakota", type: "progressive", brackets: [{ limit: 44725, rate: 0.011 }, { limit: Infinity, rate: 0.025 }] },
  "OH": { name: "Ohio", type: "flat", rate: 0.0275 },
  "OK": { name: "Oklahoma", type: "progressive", brackets: [
    { limit: 1000, rate: 0.005 }, { limit: 2500, rate: 0.01 }, { limit: 3750, rate: 0.02 },
    { limit: 4900, rate: 0.03 }, { limit: 7200, rate: 0.04 }, { limit: Infinity, rate: 0.0475 }
  ]},
  "OR": { name: "Oregon", type: "progressive", brackets: [
    { limit: 4100, rate: 0.0475 }, { limit: 10250, rate: 0.0675 }, { limit: 125000, rate: 0.0875 }, { limit: Infinity, rate: 0.099 }
  ]},
  "PA": { name: "Pennsylvania", type: "flat", rate: 0.0307 },
  "RI": { name: "Rhode Island", type: "progressive", brackets: [
    { limit: 75300, rate: 0.0375 }, { limit: 171150, rate: 0.0475 }, { limit: Infinity, rate: 0.0599 }
  ]},
  "SC": { name: "South Carolina", type: "progressive", brackets: [{ limit: 3460, rate: 0.03 }, { limit: Infinity, rate: 0.07 }] },
  "SD": { name: "South Dakota", type: "none" },
  "TN": { name: "Tennessee", type: "none" },
  "TX": { name: "Texas", type: "none" },
  "UT": { name: "Utah", type: "flat", rate: 0.0445 },
  "VT": { name: "Vermont", type: "progressive", brackets: [
    { limit: 45000, rate: 0.0335 }, { limit: 110000, rate: 0.066 }, { limit: 220000, rate: 0.076 }, { limit: Infinity, rate: 0.0875 }
  ]},
  "VA": { name: "Virginia", type: "progressive", brackets: [
    { limit: 3000, rate: 0.02 }, { limit: 5000, rate: 0.03 }, { limit: 17000, rate: 0.05 }, { limit: Infinity, rate: 0.0575 }
  ]},
  "WA": { name: "Washington", type: "none" },
  "WV": { name: "West Virginia", type: "progressive", brackets: [
    { limit: 10000, rate: 0.03 }, { limit: 25000, rate: 0.04 }, { limit: 40000, rate: 0.045 },
    { limit: 60000, rate: 0.06 }, { limit: Infinity, rate: 0.065 }
  ]},
  "WI": { name: "Wisconsin", type: "progressive", brackets: [
    { limit: 14000, rate: 0.035 }, { limit: 28000, rate: 0.044 }, { limit: 315000, rate: 0.053 }, { limit: Infinity, rate: 0.0765 }
  ]},
  "WY": { name: "Wyoming", type: "none" }
};

// UI Elements (Using ES6 dynamic getters to prevent early null evaluation prior to DOMContentLoaded)
const els = {
  get brokerageText() { return document.getElementById('brokerage-text'); },
  get brokerageSlider() { return document.getElementById('brokerage-slider'); },
  get basisText() { return document.getElementById('basis-text'); },
  get basisSlider() { return document.getElementById('basis-slider'); },
  get btnBasisDefault() { return document.getElementById('btn-basis-default'); },
  get pretaxText() { return document.getElementById('pretax-text'); },
  get pretaxSlider() { return document.getElementById('pretax-slider'); },
  get rothText() { return document.getElementById('roth-text'); },
  get rothSlider() { return document.getElementById('roth-slider'); },
  
  get ageText() { return document.getElementById('age-text'); },
  get ageSlider() { return document.getElementById('age-slider'); },
  get yearsText() { return document.getElementById('years-text'); },
  get yearsSlider() { return document.getElementById('years-slider'); },
  
  // Tax Selectors & Collapsible Container
  get filingStatus() { return document.getElementById('filing-status'); },
  get stateResidence() { return document.getElementById('state-residence'); },
  get manualTaxContainer() { return document.getElementById('manual-tax-container'); },
  
  get taxOrdinaryText() { return document.getElementById('tax-ordinary-text'); },
  get taxOrdinarySlider() { return document.getElementById('tax-ordinary-slider'); },
  get taxCapgainsText() { return document.getElementById('tax-capgains-text'); },
  get taxCapgainsSlider() { return document.getElementById('tax-capgains-slider'); },
  
  get rateText() { return document.getElementById('rate-text'); },
  get rateSlider() { return document.getElementById('rate-slider'); },
  get inflationText() { return document.getElementById('inflation-text'); },
  get inflationSlider() { return document.getElementById('inflation-slider'); },
  
  get strategyAmortized() { return document.getElementById('strategy-amortized'); },
  get strategyPreservation() { return document.getElementById('strategy-preservation'); },
  get strategyDescText() { return document.getElementById('strategy-desc-text'); },
  
  get monthlyCashflowValue() { return document.getElementById('monthly-cashflow-value'); },
  get monthlyCashflowSubtext() { return document.getElementById('monthly-cashflow-subtext'); },
  get realCashflowBadge() { return document.getElementById('real-cashflow-badge'); },
  get totalWithdrawnValue() { return document.getElementById('total-withdrawn-value'); },
  get endingBalanceValue() { return document.getElementById('ending-balance-value'); },
  get endingBalanceSubtext() { return document.getElementById('ending-balance-subtext'); },
  
  get scenarioBaselineMetric() { return document.getElementById('scenario-baseline-metric'); },
  get scenarioBaselineBadge() { return document.getElementById('scenario-baseline-badge'); },
  get scenarioEarlybearMetric() { return document.getElementById('scenario-earlybear-metric'); },
  get scenarioEarlybearBadge() { return document.getElementById('scenario-earlybear-badge'); },
  get scenarioLatebearMetric() { return document.getElementById('scenario-latebear-metric'); },
  get scenarioLatebearBadge() { return document.getElementById('scenario-latebear-badge'); },
  
  get projectionsTableBody() { return document.getElementById('projections-table-body'); },
  get btnCopy() { return document.getElementById('btn-copy'); },
  get btnExport() { return document.getElementById('btn-export'); },
  get chartCanvas() { return document.getElementById('trajectory-chart'); },
  get cashflowCanvas() { return document.getElementById('cashflow-chart'); }
};

// Global Chart Instances
let trajectoryChart = null;
let cashflowChart = null;

// Financial Math Helpers
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

const parseFormattedNumber = (str) => {
  return parseFloat(str.replace(/,/g, '')) || 0;
};

/**
 * Calculates progressive tax by mapping taxable income to graduated rate limits.
 */
function calculateProgressiveTax(income, brackets, doubleBrackets = false) {
  if (!brackets || brackets.length === 0) return 0;
  let tax = 0;
  let prevLimit = 0;
  for (let b of brackets) {
    const origLimit = b.limit;
    const limit = origLimit === Infinity ? Infinity : (doubleBrackets ? origLimit * 2 : origLimit);
    if (income > prevLimit) {
      const taxablePortion = Math.min(income - prevLimit, limit - prevLimit);
      tax += taxablePortion * b.rate;
      prevLimit = limit;
    } else {
      break;
    }
  }
  return tax;
}

/**
 * 2026 Comprehensive Income and Capital Gains Tax Calculator
 * Returns { federalOrdTax, stateTax, capitalGainsTax, penalty, totalTaxes }
 */
function calculateTaxes(ordinaryGross, brokerageGains, age, filingStatus, stateCode) {
  const isMFJ = filingStatus === 'mfj';
  
  let fedOrdTax = 0;
  let fedCapGainsTax = 0;
  let stateTax = 0;
  let niitTax = 0;
  const penalty = (age < 59.5) ? (ordinaryGross * 0.10) : 0;

  if (stateCode === 'Custom') {
    fedOrdTax = ordinaryGross * (state.taxRateOrdinary / 100);
    fedCapGainsTax = brokerageGains * (state.taxRateCapitalGains / 100);
    stateTax = 0;
    niitTax = 0;
  } else {
    // 1. Federal Standard Deduction (2026)
    const fedStandardDeduction = isMFJ ? 32200 : 16100;
    const federalTaxableOrd = Math.max(0, ordinaryGross - fedStandardDeduction);
    
    // 2. Federal Ordinary Income Progressive Brackets (2026)
    const fedBrackets = isMFJ ? [
      { limit: 24800, rate: 0.10 },
      { limit: 100800, rate: 0.12 },
      { limit: 211400, rate: 0.22 },
      { limit: 403550, rate: 0.24 },
      { limit: 512450, rate: 0.32 },
      { limit: 768700, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ] : [
      { limit: 12400, rate: 0.10 },
      { limit: 50400, rate: 0.12 },
      { limit: 105700, rate: 0.22 },
      { limit: 201775, rate: 0.24 },
      { limit: 256225, rate: 0.32 },
      { limit: 640600, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ];
    
    fedOrdTax = calculateProgressiveTax(federalTaxableOrd, fedBrackets, false);
    
    // 3. State Income Tax (2026 Database)
    const config = STATE_TAX_DATA[stateCode];
    if (config && config.type !== 'none') {
      const stateDeduction = isMFJ ? 10000 : 5000;
      const stateTaxable = Math.max(0, ordinaryGross - stateDeduction);
      
      if (config.type === 'flat') {
        stateTax = stateTaxable * config.rate;
      } else if (config.type === 'progressive') {
        stateTax = calculateProgressiveTax(stateTaxable, config.brackets, isMFJ);
      }
    }
    
    // 4. Federal Stacked Long-Term Capital Gains Tax (2026)
    const capGainsBrackets = isMFJ ? [
      { limit: 98900, rate: 0.00 },
      { limit: 613700, rate: 0.15 },
      { limit: Infinity, rate: 0.20 }
    ] : [
      { limit: 49450, rate: 0.00 },
      { limit: 545500, rate: 0.15 },
      { limit: Infinity, rate: 0.20 }
    ];
    
    let remainingGains = brokerageGains;
    const basisIncome = federalTaxableOrd; // Stacking starting threshold
    
    for (let b of capGainsBrackets) {
      if (remainingGains <= 0) break;
      const limit = b.limit;
      
      if (basisIncome + (brokerageGains - remainingGains) < limit) {
        const spaceInBracket = limit - (basisIncome + (brokerageGains - remainingGains));
        const gainsInBracket = Math.min(remainingGains, spaceInBracket);
        fedCapGainsTax += gainsInBracket * b.rate;
        remainingGains -= gainsInBracket;
      }
    }
    if (remainingGains > 0) {
      fedCapGainsTax += remainingGains * 0.20;
    }
    
    // 5. Net Investment Income Tax (NIIT) of 3.8%
    const niitThreshold = isMFJ ? 250000 : 200000;
    const magi = ordinaryGross + brokerageGains;
    if (magi > niitThreshold) {
      const subjectToNiit = Math.min(brokerageGains, magi - niitThreshold);
      niitTax = subjectToNiit * 0.038;
    }
  }
  
  const totalTaxes = fedOrdTax + fedCapGainsTax + stateTax + niitTax + penalty;
  
  return {
    fedOrdTax: fedOrdTax,
    fedCapGainsTax: fedCapGainsTax,
    fedTax: fedOrdTax + fedCapGainsTax,
    stateTax: stateTax,
    niitTax: niitTax,
    penalty: penalty,
    totalTaxes: totalTaxes
  };
}

/**
 * Simulates month-by-month decumulation across the three buckets (Brokerage, Pre-Tax, Roth).
 * Integrates an Annual Tax Accrual & Settle model to dynamically compute 2026 progressive taxes at year-ends.
 */
function runPortfolioSimulation(startingNetMonthly, isPreservation = false) {
  const M = state.horizonYears * 12;
  const r_m = (state.appreciationRate / 100) / 12;
  const i_y = state.inflationRate / 100;
  
  let balB = state.assetsBrokerage;
  let balP = state.assetsPreTax;
  let balR = state.assetsRoth;
  
  let depletedMonth = null;
  let annualSchedule = [];
  
  // Annual withdrawal accumulators for progressive tax evaluation
  let yearOrdinaryGross = 0;
  let yearBrokerageGross = 0;
  let yearRothGross = 0;
  
  // Initialize first year aggregation data
  let currentYearData = {
    year: 1,
    age: state.clientAge,
    begBrokerage: balB,
    begPreTax: balP,
    begRoth: balR,
    drawBrokerage: 0,
    drawPreTax: 0,
    drawRoth: 0,
    growthEarned: 0,
    netWithdrawn: 0,
    grossWithdrawn: 0,
    fedTax: 0,
    fedOrdTax: 0,
    fedCapGainsTax: 0,
    stateTax: 0,
    niitTax: 0,
    penalty: 0,
    taxesPaid: 0,
    endBrokerage: 0,
    endPreTax: 0,
    endRoth: 0
  };
  
  for (let m = 1; m <= M; m++) {
    const yearIndex = Math.floor((m - 1) / 12);
    const currentYear = yearIndex + 1;
    const currentAge = state.clientAge + yearIndex;
    
    // If transitioning to a new year, push previous year's aggregated data
    if (currentYear > currentYearData.year) {
      currentYearData.endBrokerage = balB;
      currentYearData.endPreTax = balP;
      currentYearData.endRoth = balR;
      annualSchedule.push(currentYearData);
      
      currentYearData = {
        year: currentYear,
        age: currentAge,
        begBrokerage: balB,
        begPreTax: balP,
        begRoth: balR,
        drawBrokerage: 0,
        drawPreTax: 0,
        drawRoth: 0,
        growthEarned: 0,
        netWithdrawn: 0,
        grossWithdrawn: 0,
        fedTax: 0,
        fedOrdTax: 0,
        fedCapGainsTax: 0,
        stateTax: 0,
        niitTax: 0,
        penalty: 0,
        taxesPaid: 0,
        endBrokerage: 0,
        endPreTax: 0,
        endRoth: 0
      };
    }
    
    // 1. Calculate monthly growth on active balances
    const growthB = balB * r_m;
    const growthP = balP * r_m;
    const growthR = balR * r_m;
    
    balB += growthB;
    balP += growthP;
    balR += growthR;
    
    currentYearData.growthEarned += (growthB + growthP + growthR);
    
    // 2. Determine target net withdrawal for this month (indexed to inflation if amortized)
    const targetNet = isPreservation
      ? startingNetMonthly
      : startingNetMonthly * Math.pow(1 + i_y, yearIndex);
    
    let remainingNetNeeded = targetNet;
    
    // 3. Tax-Efficient Withdrawal Order:
    // Before 59.5: Brokerage -> Roth -> Pre-Tax
    // At/After 59.5: Brokerage -> Pre-Tax -> Roth
    let sequence = [];
    if (currentAge < 59.5) {
      sequence = ['brokerage', 'roth', 'pretax'];
    } else {
      sequence = ['brokerage', 'pretax', 'roth'];
    }
    
    for (let bucket of sequence) {
      if (remainingNetNeeded <= 0) break;
      
      if (bucket === 'brokerage' && balB > 0) {
        const draw = Math.min(balB, remainingNetNeeded);
        balB -= draw;
        remainingNetNeeded -= draw;
        yearBrokerageGross += draw;
        currentYearData.netWithdrawn += draw;
        currentYearData.drawBrokerage += draw;
      }
      else if (bucket === 'pretax' && balP > 0) {
        const draw = Math.min(balP, remainingNetNeeded);
        balP -= draw;
        remainingNetNeeded -= draw;
        yearOrdinaryGross += draw;
        currentYearData.netWithdrawn += draw;
        currentYearData.drawPreTax += draw;
      }
      else if (bucket === 'roth' && balR > 0) {
        const draw = Math.min(balR, remainingNetNeeded);
        balR -= draw;
        remainingNetNeeded -= draw;
        yearRothGross += draw;
        currentYearData.netWithdrawn += draw;
        currentYearData.drawRoth += draw;
      }
    }
    
    // Track if portfolio failed to fulfill withdrawal in this month
    if (remainingNetNeeded > 0.01 && depletedMonth === null) {
      depletedMonth = m;
    }
    
    // 4. Annual Progressive Tax Settlement (At Month 12, 24, 36... or final simulation month)
    const isYearEnd = (m % 12 === 0);
    const isFinalMonth = (m === M);
    
    if (isYearEnd || isFinalMonth) {
      const baseBrokerageGains = yearBrokerageGross * (1 - state.brokerageCostBasis / 100);
      
      let taxBill = null;
      let lastTotalTaxes = 0;
      
      // Temporary variables for convergence
      let tempDrawB = 0;
      let tempDrawP = 0;
      let tempDrawR = 0;
      
      // Iterate to solve the "tax on tax" / "gross-up" feedback loop where withdrawals
      // to pay taxes from Pre-Tax/Brokerage increase taxable ordinary income & capital gains.
      for (let iter = 0; iter < 15; iter++) {
        const currentOrdGross = yearOrdinaryGross + tempDrawP;
        const currentCapGains = baseBrokerageGains + tempDrawB * (1 - state.brokerageCostBasis / 100);
        
        taxBill = calculateTaxes(currentOrdGross, currentCapGains, currentAge, state.filingStatus, state.stateResidence);
        
        if (Math.abs(taxBill.totalTaxes - lastTotalTaxes) < 0.1) {
          break;
        }
        
        lastTotalTaxes = taxBill.totalTaxes;
        
        let remainingTaxOwed = taxBill.totalTaxes;
        let testBalB = balB;
        let testBalP = balP;
        let testBalR = balR;
        
        tempDrawB = 0;
        tempDrawP = 0;
        tempDrawR = 0;
        
        for (let bucket of sequence) {
          if (remainingTaxOwed <= 0) break;
          
          if (bucket === 'brokerage' && testBalB > 0) {
            const draw = Math.min(testBalB, remainingTaxOwed);
            testBalB -= draw;
            remainingTaxOwed -= draw;
            tempDrawB += draw;
          }
          else if (bucket === 'pretax' && testBalP > 0) {
            const draw = Math.min(testBalP, remainingTaxOwed);
            testBalP -= draw;
            remainingTaxOwed -= draw;
            tempDrawP += draw;
          }
          else if (bucket === 'roth' && testBalR > 0) {
            const draw = Math.min(testBalR, remainingTaxOwed);
            testBalR -= draw;
            remainingTaxOwed -= draw;
            tempDrawR += draw;
          }
        }
      }
      
      let remainingTaxOwed = taxBill.totalTaxes;
      currentYearData.taxesPaid += taxBill.totalTaxes;
      currentYearData.fedTax += taxBill.fedTax;
      currentYearData.fedOrdTax += taxBill.fedOrdTax;
      currentYearData.fedCapGainsTax += taxBill.fedCapGainsTax;
      currentYearData.stateTax += taxBill.stateTax;
      currentYearData.niitTax += taxBill.niitTax;
      currentYearData.penalty += taxBill.penalty;
      
      // Withdraw total tax bill from buckets using the standard sequence
      for (let bucket of sequence) {
        if (remainingTaxOwed <= 0) break;
        
        if (bucket === 'brokerage' && balB > 0) {
          const draw = Math.min(balB, remainingTaxOwed);
          balB -= draw;
          remainingTaxOwed -= draw;
          currentYearData.drawBrokerage += draw;
        }
        else if (bucket === 'pretax' && balP > 0) {
          const draw = Math.min(balP, remainingTaxOwed);
          balP -= draw;
          remainingTaxOwed -= draw;
          currentYearData.drawPreTax += draw;
        }
        else if (bucket === 'roth' && balR > 0) {
          const draw = Math.min(balR, remainingTaxOwed);
          balR -= draw;
          remainingTaxOwed -= draw;
          currentYearData.drawRoth += draw;
        }
      }
      
      // Record if depleted during tax payment
      if (remainingTaxOwed > 0.01 && depletedMonth === null) {
        depletedMonth = m;
      }
      
      currentYearData.grossWithdrawn = currentYearData.netWithdrawn + currentYearData.taxesPaid;
      
      // Reset annual withdrawal accumulators for next year
      yearOrdinaryGross = 0;
      yearBrokerageGross = 0;
      yearRothGross = 0;
    }
  }
  
  // Record ending balances of the final year
  currentYearData.endBrokerage = balB;
  currentYearData.endPreTax = balP;
  currentYearData.endRoth = balR;
  annualSchedule.push(currentYearData);
  
  const endingCombinedBalance = balB + balP + balR;
  const startingCombinedBalance = state.assetsBrokerage + state.assetsPreTax + state.assetsRoth;
  
  return {
    depletedMonth: depletedMonth,
    depletedYear: depletedMonth !== null ? Math.floor((depletedMonth - 1) / 12) + 1 : null,
    endingBalance: endingCombinedBalance,
    startingBalance: startingCombinedBalance,
    schedule: annualSchedule
  };
}

/**
 * Universal Bisection Solver
 * Numerically solves for the exact Net Monthly Cashflow that achieves the strategy goal:
 * - Amortized: Combined portfolios decumulate to exactly $0 ending balance.
 * - Capital Preservation: Portfolio ending balance equals exactly the starting combined principal.
 */
function solveSustainableNetMonthly() {
  let L = 0;
  const totalAssets = state.assetsBrokerage + state.assetsPreTax + state.assetsRoth;
  let U = totalAssets * 0.5;
  
  const isPreservation = state.strategy === 'preservation';
  
  for (let i = 0; i < 35; i++) {
    const mid = (L + U) / 2;
    const sim = runPortfolioSimulation(mid, isPreservation);
    
    if (isPreservation) {
      if (sim.endingBalance < sim.startingBalance || sim.depletedMonth !== null) {
        U = mid;
      } else {
        L = mid;
      }
    } else {
      if (sim.depletedMonth !== null) {
        U = mid;
      } else {
        L = mid;
      }
    }
  }
  
  return L;
}

/**
 * Stress tests the decumulation sequence under volatility scenarios (Sequence Risk)
 */
function simulateVolatilityScenario(startingNetMonthly, scenarioType) {
  const M = state.horizonYears * 12;
  const base_rm = (state.appreciationRate / 100) / 12;
  const bear_rm = (-5.0 / 100) / 12;
  const i_y = state.inflationRate / 100;
  
  let balB = state.assetsBrokerage;
  let balP = state.assetsPreTax;
  let balR = state.assetsRoth;
  
  let depletedMonth = null;
  
  let yearOrdinaryGross = 0;
  let yearBrokerageGross = 0;
  
  for (let m = 1; m <= M; m++) {
    const yearIndex = Math.floor((m - 1) / 12);
    const currentYear = yearIndex + 1;
    const currentAge = state.clientAge + yearIndex;
    
    let rm = base_rm;
    if (scenarioType === 'early-bear' && currentYear <= 3) {
      rm = bear_rm;
    } else if (scenarioType === 'late-bear' && currentYear > state.horizonYears - 3) {
      rm = bear_rm;
    }
    
    balB += balB * rm;
    balP += balP * rm;
    balR += balR * rm;
    
    const targetNet = state.strategy === 'preservation'
      ? startingNetMonthly
      : startingNetMonthly * Math.pow(1 + i_y, yearIndex);
      
    let remainingNetNeeded = targetNet;
    
    let sequence = [];
    if (currentAge < 59.5) {
      sequence = ['brokerage', 'roth', 'pretax'];
    } else {
      sequence = ['brokerage', 'pretax', 'roth'];
    }
    
    for (let bucket of sequence) {
      if (remainingNetNeeded <= 0) break;
      
      if (bucket === 'brokerage' && balB > 0) {
        const draw = Math.min(balB, remainingNetNeeded);
        balB -= draw;
        remainingNetNeeded -= draw;
        yearBrokerageGross += draw;
      }
      else if (bucket === 'pretax' && balP > 0) {
        const draw = Math.min(balP, remainingNetNeeded);
        balP -= draw;
        remainingNetNeeded -= draw;
        yearOrdinaryGross += draw;
      }
      else if (bucket === 'roth' && balR > 0) {
        const draw = Math.min(balR, remainingNetNeeded);
        balR -= draw;
        remainingNetNeeded -= draw;
      }
    }
    
    if (remainingNetNeeded > 0.01 && depletedMonth === null) {
      depletedMonth = m;
      break;
    }
    
    const isYearEnd = (m % 12 === 0);
    const isFinalMonth = (m === M);
    
    if (isYearEnd || isFinalMonth) {
      const baseBrokerageGains = yearBrokerageGross * (1 - state.brokerageCostBasis / 100);
      
      let taxBill = null;
      let lastTotalTaxes = 0;
      
      // Temporary variables for convergence
      let tempDrawB = 0;
      let tempDrawP = 0;
      let tempDrawR = 0;
      
      // Iterate to solve the "tax on tax" feedback loop for volatility scenario
      for (let iter = 0; iter < 15; iter++) {
        const currentOrdGross = yearOrdinaryGross + tempDrawP;
        const currentCapGains = baseBrokerageGains + tempDrawB * (1 - state.brokerageCostBasis / 100);
        
        taxBill = calculateTaxes(currentOrdGross, currentCapGains, currentAge, state.filingStatus, state.stateResidence);
        
        if (Math.abs(taxBill.totalTaxes - lastTotalTaxes) < 0.1) {
          break;
        }
        
        lastTotalTaxes = taxBill.totalTaxes;
        
        let remainingTaxOwed = taxBill.totalTaxes;
        let testBalB = balB;
        let testBalP = balP;
        let testBalR = balR;
        
        tempDrawB = 0;
        tempDrawP = 0;
        tempDrawR = 0;
        
        for (let bucket of sequence) {
          if (remainingTaxOwed <= 0) break;
          
          if (bucket === 'brokerage' && testBalB > 0) {
            const draw = Math.min(testBalB, remainingTaxOwed);
            testBalB -= draw;
            remainingTaxOwed -= draw;
            tempDrawB += draw;
          }
          else if (bucket === 'pretax' && testBalP > 0) {
            const draw = Math.min(testBalP, remainingTaxOwed);
            testBalP -= draw;
            remainingTaxOwed -= draw;
            tempDrawP += draw;
          }
          else if (bucket === 'roth' && testBalR > 0) {
            const draw = Math.min(testBalR, remainingTaxOwed);
            testBalR -= draw;
            remainingTaxOwed -= draw;
            tempDrawR += draw;
          }
        }
      }
      
      let remainingTaxOwed = taxBill.totalTaxes;
      
      for (let bucket of sequence) {
        if (remainingTaxOwed <= 0) break;
        
        if (bucket === 'brokerage' && balB > 0) {
          const draw = Math.min(balB, remainingTaxOwed);
          balB -= draw;
          remainingTaxOwed -= draw;
        }
        else if (bucket === 'pretax' && balP > 0) {
          const draw = Math.min(balP, remainingTaxOwed);
          balP -= draw;
          remainingTaxOwed -= draw;
        }
        else if (bucket === 'roth' && balR > 0) {
          const draw = Math.min(balR, remainingTaxOwed);
          balR -= draw;
          remainingTaxOwed -= draw;
        }
      }
      
      if (remainingTaxOwed > 0.01 && depletedMonth === null) {
        depletedMonth = m;
        break;
      }
      
      yearOrdinaryGross = 0;
      yearBrokerageGross = 0;
    }
  }
  
  if (depletedMonth !== null) {
    return {
      survived: false,
      year: Math.floor((depletedMonth - 1) / 12) + 1
    };
  }
  
  return {
    survived: true,
    year: state.horizonYears
  };
}

// Update the full Dean Antigravity Experiment interactive dashboard
function updateDashboard() {
  const solvedNetMonthly = solveSustainableNetMonthly();
  const isPreservation = state.strategy === 'preservation';
  const result = runPortfolioSimulation(solvedNetMonthly, isPreservation);
  
  let totalNetDistributed = 0;
  result.schedule.forEach(row => {
    totalNetDistributed += row.netWithdrawn;
  });
  
  const endingCombinedBalance = result.endingBalance;
  
  // Update Metric Display Cards
  els.monthlyCashflowValue.textContent = formatCurrency(solvedNetMonthly);
  els.totalWithdrawnValue.textContent = formatCurrency(totalNetDistributed);
  els.endingBalanceValue.textContent = formatCurrency(endingCombinedBalance);
  els.endingBalanceSubtext.textContent = `Combined portfolio at Year ${state.horizonYears}`;
  
  if (state.strategy === 'amortized') {
    els.monthlyCashflowSubtext.textContent = `Adjusts to ${formatCurrency(solvedNetMonthly * (1 + state.inflationRate/100))} in Year 2`;
    els.realCashflowBadge.style.display = 'inline-flex';
    els.realCashflowBadge.textContent = `Net Purchasing Power Maintained`;
    els.realCashflowBadge.style.background = 'var(--accent-emerald-glow)';
    els.realCashflowBadge.style.color = 'var(--accent-emerald)';
  } else {
    els.monthlyCashflowSubtext.textContent = `Fixed nominal cashflow. Erodes with inflation.`;
    els.realCashflowBadge.style.display = 'inline-flex';
    els.realCashflowBadge.textContent = `Net Purchasing Power Decays`;
    els.realCashflowBadge.style.background = 'var(--accent-rose-glow)';
    els.realCashflowBadge.style.color = 'var(--accent-rose)';
  }
  
  // Calculate Year 1 effective tax rates to sync back into manual rate inputs for summaries
  if (state.stateResidence !== 'Custom' && result.schedule.length > 0) {
    const y1 = result.schedule[0];
    const ordGross = y1.drawPreTax;
    const capGross = y1.drawBrokerage;
    const capGains = capGross * (1 - state.brokerageCostBasis / 100);
    
    const taxBill = calculateTaxes(ordGross, capGains, state.clientAge, state.filingStatus, state.stateResidence);
    const effOrd = ordGross > 0 ? ((taxBill.fedOrdTax + taxBill.stateTax) / ordGross) * 100 : 0;
    const effCap = capGains > 0 ? ((taxBill.fedCapGainsTax + taxBill.niitTax) / capGains) * 100 : 0;
    
    state.taxRateOrdinary = Math.round(effOrd);
    state.taxRateCapitalGains = Math.round(effCap);
    
    els.taxOrdinaryText.value = effOrd.toFixed(1);
    els.taxOrdinarySlider.value = Math.round(effOrd);
    els.taxCapgainsText.value = effCap.toFixed(1);
    els.taxCapgainsSlider.value = Math.round(effCap);
  }
  
  // Update Volatility Sequence of Returns Stress-testing cards
  const simBaseline = simulateVolatilityScenario(solvedNetMonthly, 'baseline');
  const simEarlyBear = simulateVolatilityScenario(solvedNetMonthly, 'early-bear');
  const simLateBear = simulateVolatilityScenario(solvedNetMonthly, 'late-bear');
  
  // Baseline Card
  if (simBaseline.survived) {
    els.scenarioBaselineMetric.textContent = `Portfolio lasts ${state.horizonYears} yrs`;
    els.scenarioBaselineBadge.textContent = "Steady Plan";
    els.scenarioBaselineBadge.className = "scenario-badge success";
  } else {
    els.scenarioBaselineMetric.textContent = `Depleted in Year ${simBaseline.year}`;
    els.scenarioBaselineBadge.textContent = "High Volatility Fail";
    els.scenarioBaselineBadge.className = "scenario-badge danger";
  }
  
  // Early Bear Card
  if (simEarlyBear.survived) {
    els.scenarioEarlybearMetric.textContent = `Portfolio lasts ${state.horizonYears} yrs`;
    els.scenarioEarlybearBadge.textContent = "Resilient Plan";
    els.scenarioEarlybearBadge.className = "scenario-badge success";
  } else {
    els.scenarioEarlybearMetric.textContent = `Depleted in Year ${simEarlyBear.year}`;
    els.scenarioEarlybearBadge.textContent = "Severe Timing Risk";
    els.scenarioEarlybearBadge.className = "scenario-badge danger";
    
    if (state.strategy === 'preservation') {
      els.scenarioEarlybearMetric.textContent = `Principal Erodes Fast`;
      els.scenarioEarlybearBadge.textContent = "Severe Decay";
      els.scenarioEarlybearBadge.className = "scenario-badge danger";
    }
  }
  
  // Late Bear Card
  if (simLateBear.survived) {
    els.scenarioLatebearMetric.textContent = `Portfolio lasts ${state.horizonYears} yrs`;
    els.scenarioLatebearBadge.textContent = "Low Risk";
    els.scenarioLatebearBadge.className = "scenario-badge warning";
  } else {
    els.scenarioLatebearMetric.textContent = `Depleted in Year ${simLateBear.year}`;
    els.scenarioLatebearBadge.textContent = "Late Stage Fail";
    els.scenarioLatebearBadge.className = "scenario-badge danger";
  }
  
  // Populate Year-by-Year Schedule Table
  els.projectionsTableBody.innerHTML = '';
  result.schedule.forEach(row => {
    const tr = document.createElement('tr');
    const taxesAndPenalties = row.taxesPaid;
    
    tr.innerHTML = `
      <td>Age ${row.age} (Yr ${row.year})</td>
      <td>${formatCurrency(row.endBrokerage)}</td>
      <td>${formatCurrency(row.endPreTax)}</td>
      <td>${formatCurrency(row.endRoth)}</td>
      <td style="color: var(--accent-emerald); font-weight: 600;">${formatCurrency(row.netWithdrawn)}</td>
      <td>${formatCurrency(row.grossWithdrawn)}</td>
      <td style="color: var(--accent-silver); font-weight: 500;">${formatCurrency(row.drawBrokerage)}</td>
      <td style="color: var(--accent-gold); font-weight: 500;">${formatCurrency(row.drawPreTax)}</td>
      <td style="color: var(--accent-emerald); font-weight: 500;">${formatCurrency(row.drawRoth)}</td>
      <td style="color: ${row.fedOrdTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.fedOrdTax)}</td>
      <td style="color: ${row.fedCapGainsTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.fedCapGainsTax)}</td>
      <td style="color: ${row.stateTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.stateTax)}</td>
      <td style="color: ${row.niitTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.niitTax)}</td>
      <td style="color: ${row.penalty > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.penalty)}</td>
      <td style="color: ${taxesAndPenalties > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'}; font-weight: 600;">${formatCurrency(taxesAndPenalties)}</td>
    `;
    els.projectionsTableBody.appendChild(tr);
  });
  
  // Refresh Stacked Decumulation Area Chart
  renderChart(result.schedule);
  renderCashflowChart(result.schedule);
}

// Render dynamic, multi-bucket stacked area chart using Chart.js
function renderChart(schedule) {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded yet. Skipping trajectory chart rendering.");
    const container = els.chartCanvas?.parentElement;
    if (container && !container.querySelector('.chart-fallback-msg')) {
      const fallback = document.createElement('div');
      fallback.className = 'chart-fallback-msg';
      fallback.style.position = 'absolute';
      fallback.style.inset = '0';
      fallback.style.display = 'flex';
      fallback.style.flexDirection = 'column';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.color = 'var(--text-secondary)';
      fallback.style.fontSize = '0.9rem';
      fallback.style.background = 'var(--bg-surface-elevated)';
      fallback.style.borderRadius = '12px';
      fallback.style.border = '1px dashed var(--border-color)';
      fallback.style.padding = '1.5rem';
      fallback.style.textAlign = 'center';
      fallback.style.gap = '0.5rem';
      fallback.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent-indigo)" style="opacity: 0.8;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-7.5-6.5h-2v3c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1zm4.5 1h-2v1.5h2c.55 0 1 .45 1 1s-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
        <span>Chart.js did not load. Please check your network or refresh the page.</span>
      `;
      container.appendChild(fallback);
    }
    return;
  }

  // Remove fallback message if Chart.js is successfully loaded
  const container = els.chartCanvas?.parentElement;
  if (container) {
    const fallback = container.querySelector('.chart-fallback-msg');
    if (fallback) {
      fallback.remove();
    }
  }

  const xLabels = schedule.map(row => `Age ${row.age} (Yr ${row.year})`);
  
  // Extract individual balances for stacked-area mapping
  const brokerageData = schedule.map(row => row.endBrokerage);
  const pretaxData = schedule.map(row => row.endPreTax);
  const rothData = schedule.map(row => row.endRoth);
  
  if (trajectoryChart) {
    trajectoryChart.destroy();
  }
  
  const ctx = els.chartCanvas.getContext('2d');
  
  // Custom theme area fills
  const brokerFill = ctx.createLinearGradient(0, 0, 0, 350);
  brokerFill.addColorStop(0, 'rgba(148, 163, 184, 0.25)'); // Silver
  brokerFill.addColorStop(1, 'rgba(148, 163, 184, 0.05)');
  
  const pretaxFill = ctx.createLinearGradient(0, 0, 0, 350);
  pretaxFill.addColorStop(0, 'rgba(245, 158, 11, 0.25)');  // Gold/Amber
  pretaxFill.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
  
  const rothFill = ctx.createLinearGradient(0, 0, 0, 350);
  rothFill.addColorStop(0, 'rgba(16, 185, 129, 0.25)');  // Emerald
  rothFill.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
  
  trajectoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xLabels,
      datasets: [
        {
          label: 'Brokerage (Taxable) ($)',
          data: brokerageData,
          borderColor: '#94a3b8',
          borderWidth: 2,
          pointBackgroundColor: '#94a3b8',
          pointHoverRadius: 5,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Pre-Tax (IRA/401k) ($)',
          data: pretaxData,
          borderColor: '#f59e0b',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointHoverRadius: 5,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Roth (Tax-Free) ($)',
          data: rothData,
          borderColor: '#10b981',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointHoverRadius: 6,
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#f8fafc',
            font: { family: 'Inter', size: 10, weight: '600' },
            boxWidth: 12
          }
        },
        tooltip: {
          padding: 12,
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          titleFont: { family: 'Outfit', size: 13, weight: '700' },
          bodyColor: '#e2e8f0',
          bodyFont: { family: 'Inter', size: 12 },
          borderColor: '#334155',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label = label.split(' ($)')[0] + ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.25)', drawBorder: false },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
        },
        y: {
          stacked: false,
          grid: { color: 'rgba(51, 65, 85, 0.35)', drawBorder: false },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 10 },
            callback: function(value) {
              if (value >= 1e6) {
                return '$' + (value / 1e6).toFixed(1) + 'M';
              } else if (value >= 1e3) {
                return '$' + (value / 1e3).toFixed(0) + 'k';
              }
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

// Render dynamic stacked bar chart of annual net cashflow vs tax drag
function renderCashflowChart(schedule) {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js is not loaded yet. Skipping cashflow chart rendering.");
    const container = els.cashflowCanvas?.parentElement;
    if (container && !container.querySelector('.chart-fallback-msg')) {
      const fallback = document.createElement('div');
      fallback.className = 'chart-fallback-msg';
      fallback.style.position = 'absolute';
      fallback.style.inset = '0';
      fallback.style.display = 'flex';
      fallback.style.flexDirection = 'column';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.color = 'var(--text-secondary)';
      fallback.style.fontSize = '0.9rem';
      fallback.style.background = 'var(--bg-surface-elevated)';
      fallback.style.borderRadius = '12px';
      fallback.style.border = '1px dashed var(--border-color)';
      fallback.style.padding = '1.5rem';
      fallback.style.textAlign = 'center';
      fallback.style.gap = '0.5rem';
      fallback.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent-indigo)" style="opacity: 0.8;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-7.5-6.5h-2v3c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1zm4.5 1h-2v1.5h2c.55 0 1 .45 1 1s-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
        <span>Chart.js did not load. Please check your network or refresh the page.</span>
      `;
      container.appendChild(fallback);
    }
    return;
  }

  // Remove fallback message if Chart.js is successfully loaded
  const container = els.cashflowCanvas?.parentElement;
  if (container) {
    const fallback = container.querySelector('.chart-fallback-msg');
    if (fallback) {
      fallback.remove();
    }
  }

  const xLabels = schedule.map(row => `Age ${row.age} (Yr ${row.year})`);
  
  const brokerageDrawData = schedule.map(row => row.drawBrokerage);
  const pretaxDrawData = schedule.map(row => row.drawPreTax);
  const rothDrawData = schedule.map(row => row.drawRoth);
  const netSpendingData = schedule.map(row => row.netWithdrawn);
  const fedOrdTaxData = schedule.map(row => row.fedOrdTax);
  const fedCapGainsTaxData = schedule.map(row => row.fedCapGainsTax);
  const stateTaxData = schedule.map(row => row.stateTax);
  const niitTaxData = schedule.map(row => row.niitTax);
  const penaltyData = schedule.map(row => row.penalty);
  
  if (cashflowChart) {
    cashflowChart.destroy();
  }
  
  const ctx = els.cashflowCanvas.getContext('2d');
  
  const brokerageFill = ctx.createLinearGradient(0, 0, 0, 350);
  brokerageFill.addColorStop(0, 'rgba(148, 163, 184, 0.85)'); // Silver
  brokerageFill.addColorStop(1, 'rgba(148, 163, 184, 0.3)');
  
  const pretaxFill = ctx.createLinearGradient(0, 0, 0, 350);
  pretaxFill.addColorStop(0, 'rgba(245, 158, 11, 0.85)');  // Gold
  pretaxFill.addColorStop(1, 'rgba(245, 158, 11, 0.3)');
  
  const rothFill = ctx.createLinearGradient(0, 0, 0, 350);
  rothFill.addColorStop(0, 'rgba(16, 185, 129, 0.85)');  // Emerald
  rothFill.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

  const netSpendingFill = ctx.createLinearGradient(0, 0, 0, 350);
  netSpendingFill.addColorStop(0, 'rgba(20, 184, 166, 0.85)'); // Teal
  netSpendingFill.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

  const fedOrdFill = ctx.createLinearGradient(0, 0, 0, 350);
  fedOrdFill.addColorStop(0, 'rgba(244, 63, 94, 0.85)'); // Rose
  fedOrdFill.addColorStop(1, 'rgba(244, 63, 94, 0.3)');

  const fedCapGainsFill = ctx.createLinearGradient(0, 0, 0, 350);
  fedCapGainsFill.addColorStop(0, 'rgba(168, 85, 247, 0.85)'); // Purple
  fedCapGainsFill.addColorStop(1, 'rgba(168, 85, 247, 0.3)');

  const stateTaxFill = ctx.createLinearGradient(0, 0, 0, 350);
  stateTaxFill.addColorStop(0, 'rgba(99, 102, 241, 0.85)'); // Indigo
  stateTaxFill.addColorStop(1, 'rgba(99, 102, 241, 0.3)');

  const niitTaxFill = ctx.createLinearGradient(0, 0, 0, 350);
  niitTaxFill.addColorStop(0, 'rgba(236, 72, 153, 0.85)'); // Pink
  niitTaxFill.addColorStop(1, 'rgba(236, 72, 153, 0.3)');

  const penaltyFill = ctx.createLinearGradient(0, 0, 0, 350);
  penaltyFill.addColorStop(0, 'rgba(249, 115, 22, 0.85)'); // Orange
  penaltyFill.addColorStop(1, 'rgba(249, 115, 22, 0.3)');
  
  cashflowChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xLabels,
      datasets: [
        // Sources Stack
        {
          label: 'Brokerage Draw ($)',
          data: brokerageDrawData,
          backgroundColor: brokerageFill,
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'sources'
        },
        {
          label: 'Pre-Tax Draw ($)',
          data: pretaxDrawData,
          backgroundColor: pretaxFill,
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'sources'
        },
        {
          label: 'Roth Draw ($)',
          data: rothDrawData,
          backgroundColor: rothFill,
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'sources'
        },
        // Uses Stack
        {
          label: 'Net Spending ($)',
          data: netSpendingData,
          backgroundColor: netSpendingFill,
          borderColor: '#14b8a6',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        },
        {
          label: 'Fed Income Tax ($)',
          data: fedOrdTaxData,
          backgroundColor: fedOrdFill,
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        },
        {
          label: 'Fed CapGains Tax ($)',
          data: fedCapGainsTaxData,
          backgroundColor: fedCapGainsFill,
          borderColor: '#a855f7',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        },
        {
          label: 'State Tax ($)',
          data: stateTaxData,
          backgroundColor: stateTaxFill,
          borderColor: '#6366f1',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        },
        {
          label: 'NIIT ($)',
          data: niitTaxData,
          backgroundColor: niitTaxFill,
          borderColor: '#ec4899',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        },
        {
          label: 'Penalty ($)',
          data: penaltyData,
          backgroundColor: penaltyFill,
          borderColor: '#f97316',
          borderWidth: 1.5,
          borderRadius: 4,
          stack: 'uses'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#f8fafc',
            font: { family: 'Inter', size: 10, weight: '600' },
            boxWidth: 12
          }
        },
        tooltip: {
          padding: 12,
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          titleFont: { family: 'Outfit', size: 13, weight: '700' },
          bodyColor: '#e2e8f0',
          bodyFont: { family: 'Inter', size: 12 },
          borderColor: '#334155',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label = label.split(' ($)')[0] + ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { color: 'rgba(51, 65, 85, 0.25)', drawBorder: false },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
        },
        y: {
          stacked: true,
          grid: { color: 'rgba(51, 65, 85, 0.35)', drawBorder: false },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 10 },
            callback: function(value) {
              if (value >= 1e6) {
                return '$' + (value / 1e6).toFixed(1) + 'M';
              } else if (value >= 1e3) {
                return '$' + (value / 1e3).toFixed(0) + 'k';
              }
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

// Data Export Utilities
function convertToCSV() {
  const solvedNetMonthly = solveSustainableNetMonthly();
  const isPreservation = state.strategy === 'preservation';
  const result = runPortfolioSimulation(solvedNetMonthly, isPreservation);
  
  let csv = 'Year,Age,Brokerage Balance ($),Pre-Tax Balance ($),Roth Balance ($),Net Withdrawal ($),Gross Withdrawal ($),Brokerage Draw ($),Pre-Tax Draw ($),Roth Draw ($),Federal Income Tax ($),Federal CapGains Tax ($),State Tax ($),NIIT ($),Penalty ($),Total Tax and Penalties ($)\r\n';
  
  result.schedule.forEach(row => {
    const taxFees = row.taxesPaid;
    csv += `${row.year},${row.age},${row.endBrokerage.toFixed(2)},${row.endPreTax.toFixed(2)},${row.endRoth.toFixed(2)},${row.netWithdrawn.toFixed(2)},${row.grossWithdrawn.toFixed(2)},${row.drawBrokerage.toFixed(2)},${row.drawPreTax.toFixed(2)},${row.drawRoth.toFixed(2)},${row.fedOrdTax.toFixed(2)},${row.fedCapGainsTax.toFixed(2)},${row.stateTax.toFixed(2)},${row.niitTax.toFixed(2)},${row.penalty.toFixed(2)},${taxFees.toFixed(2)}\r\n`;
  });
  
  return csv;
}

function handleCopyCSV() {
  const csv = convertToCSV();
  navigator.clipboard.writeText(csv).then(() => {
    const originalText = els.btnCopy.innerHTML;
    els.btnCopy.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      Copied!
    `;
    els.btnCopy.style.borderColor = 'var(--accent-emerald)';
    els.btnCopy.style.color = 'var(--accent-emerald)';
    
    setTimeout(() => {
      els.btnCopy.innerHTML = originalText;
      els.btnCopy.style.borderColor = '';
      els.btnCopy.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy CSV: ', err);
  });
}

function handleDownloadCSV() {
  const csv = convertToCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Dean_Antigravity_Experiment_${state.strategy}_${state.horizonYears}yrs.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Synchronize Dual Input Controllers (Slider & Text field)
function setupInputSync(textEl, sliderEl, stateKey, isCurrency = false) {
  textEl.addEventListener('input', (e) => {
    let rawVal = e.target.value;
    let numericVal = isCurrency ? parseFormattedNumber(rawVal) : parseFloat(rawVal);
    
    if (isNaN(numericVal)) numericVal = 0;
    
    state[stateKey] = numericVal;
    sliderEl.value = numericVal;
    updateDashboard();
  });
  
  textEl.addEventListener('blur', (e) => {
    let numericVal = isCurrency ? parseFormattedNumber(e.target.value) : parseFloat(e.target.value);
    const min = parseFloat(sliderEl.min);
    const max = parseFloat(sliderEl.max);
    
    if (isNaN(numericVal) || numericVal < min) numericVal = min;
    if (numericVal > max) numericVal = max;
    
    state[stateKey] = numericVal;
    sliderEl.value = numericVal;
    
    if (isCurrency) {
      textEl.value = new Intl.NumberFormat('en-US').format(numericVal);
    } else {
      textEl.value = numericVal;
    }
    
    updateDashboard();
  });

  sliderEl.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    state[stateKey] = val;
    
    if (isCurrency) {
      textEl.value = new Intl.NumberFormat('en-US').format(val);
    } else {
      textEl.value = val;
    }
    
    updateDashboard();
  });
}

// Strategy switcher binding
function setupStrategySwitcher() {
  const btns = [els.strategyAmortized, els.strategyPreservation];
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const strategy = btn.getAttribute('data-strategy');
      state.strategy = strategy;
      
      if (strategy === 'amortized') {
        els.strategyDescText.innerHTML = `
          <strong>Amortized Strategy:</strong> Solves for a constant, inflation-adjusted <strong>Net Monthly Cashflow</strong>. It automatically handles tax-efficient ordering (liquidating Brokerage, Pre-Tax, and Roth in sequence) and factors in the 10% Pre-Tax penalty before age 59.5, leaving exactly $0 combined at Year ${state.horizonYears}.
        `;
      } else {
        els.strategyDescText.innerHTML = `
          <strong>Capital Preservation:</strong> Only distributes portfolio growth/appreciation each month while keeping the nominal starting principal ($${new Intl.NumberFormat('en-US').format(state.assetsBrokerage + state.assetsPreTax + state.assetsRoth)}) 100% intact. Fixed nominal cashflow decays in real purchasing power over time.
        `;
      }
      
      updateDashboard();
    });
  });
}

function toggleManualTaxVisibility() {
  if (state.stateResidence === 'Custom') {
    els.manualTaxContainer.style.display = 'flex';
  } else {
    els.manualTaxContainer.style.display = 'none';
  }
}

// Initialize Application Bindings
function init() {
  setupInputSync(els.brokerageText, els.brokerageSlider, 'assetsBrokerage', true);
  setupInputSync(els.basisText, els.basisSlider, 'brokerageCostBasis', false);
  setupInputSync(els.pretaxText, els.pretaxSlider, 'assetsPreTax', true);
  setupInputSync(els.rothText, els.rothSlider, 'assetsRoth', true);
  
  setupInputSync(els.ageText, els.ageSlider, 'clientAge', false);
  setupInputSync(els.yearsText, els.yearsSlider, 'horizonYears', false);
  
  setupInputSync(els.taxOrdinaryText, els.taxOrdinarySlider, 'taxRateOrdinary', false);
  setupInputSync(els.taxCapgainsText, els.taxCapgainsSlider, 'taxRateCapitalGains', false);
  
  setupInputSync(els.rateText, els.rateSlider, 'appreciationRate', false);
  setupInputSync(els.inflationText, els.inflationSlider, 'inflationRate', false);
  
  // Toggle visibility of manual sliders
  toggleManualTaxVisibility();
  
  // Binding Tax Selectors
  els.filingStatus.addEventListener('change', (e) => {
    state.filingStatus = e.target.value;
    updateDashboard();
  });
  
  els.stateResidence.addEventListener('change', (e) => {
    state.stateResidence = e.target.value;
    toggleManualTaxVisibility();
    updateDashboard();
  });
  
  setupStrategySwitcher();
  
  els.btnCopy.addEventListener('click', handleCopyCSV);
  els.btnExport.addEventListener('click', handleDownloadCSV);
  
  // Cost Basis Default reset button
  els.btnBasisDefault.addEventListener('click', () => {
    state.brokerageCostBasis = 60.0;
    els.basisText.value = 60;
    els.basisSlider.value = 60;
    updateDashboard();
  });
  
  updateDashboard();
}

// Robust Auto-run lifecycle to prevent double init() execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
