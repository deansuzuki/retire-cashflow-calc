/**
 * Tax-Efficient Decumulation Engine - index.js
 * Advanced Financial Planning Logic & Interactive Multi-Bucket Simulation
 * 2026 Progressive Tax Bracket Calculator & State Tax Database
 */

// Application State
const state = {
  assetsBrokerage: 300000,
  brokerageCostBasis: 60.0,
  assetsPreTax: 500000,
  assetsRoth: 200000,
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

// UI Elements
const els = {
  brokerageText: document.getElementById('brokerage-text'),
  brokerageSlider: document.getElementById('brokerage-slider'),
  basisText: document.getElementById('basis-text'),
  basisSlider: document.getElementById('basis-slider'),
  btnBasisDefault: document.getElementById('btn-basis-default'),
  pretaxText: document.getElementById('pretax-text'),
  pretaxSlider: document.getElementById('pretax-slider'),
  rothText: document.getElementById('roth-text'),
  rothSlider: document.getElementById('roth-slider'),
  
  ageText: document.getElementById('age-text'),
  ageSlider: document.getElementById('age-slider'),
  yearsText: document.getElementById('years-text'),
  yearsSlider: document.getElementById('years-slider'),
  
  // Tax Selectors & Collapsible Container
  filingStatus: document.getElementById('filing-status'),
  stateResidence: document.getElementById('state-residence'),
  manualTaxContainer: document.getElementById('manual-tax-container'),
  
  taxOrdinaryText: document.getElementById('tax-ordinary-text'),
  taxOrdinarySlider: document.getElementById('tax-ordinary-slider'),
  taxCapgainsText: document.getElementById('tax-capgains-text'),
  taxCapgainsSlider: document.getElementById('tax-capgains-slider'),
  
  rateText: document.getElementById('rate-text'),
  rateSlider: document.getElementById('rate-slider'),
  inflationText: document.getElementById('inflation-text'),
  inflationSlider: document.getElementById('inflation-slider'),
  
  strategyAmortized: document.getElementById('strategy-amortized'),
  strategyPreservation: document.getElementById('strategy-preservation'),
  strategyDescText: document.getElementById('strategy-desc-text'),
  
  monthlyCashflowValue: document.getElementById('monthly-cashflow-value'),
  monthlyCashflowSubtext: document.getElementById('monthly-cashflow-subtext'),
  realCashflowBadge: document.getElementById('real-cashflow-badge'),
  totalWithdrawnValue: document.getElementById('total-withdrawn-value'),
  endingBalanceValue: document.getElementById('ending-balance-value'),
  endingBalanceSubtext: document.getElementById('ending-balance-subtext'),
  
  scenarioBaselineMetric: document.getElementById('scenario-baseline-metric'),
  scenarioBaselineBadge: document.getElementById('scenario-baseline-badge'),
  scenarioEarlybearMetric: document.getElementById('scenario-earlybear-metric'),
  scenarioEarlybearBadge: document.getElementById('scenario-earlybear-badge'),
  scenarioLatebearMetric: document.getElementById('scenario-latebear-metric'),
  scenarioLatebearBadge: document.getElementById('scenario-latebear-badge'),
  
  projectionsTableBody: document.getElementById('projections-table-body'),
  btnCopy: document.getElementById('btn-copy'),
  btnExport: document.getElementById('btn-export'),
  chartCanvas: document.getElementById('trajectory-chart')
};

// Global Chart Instance
let trajectoryChart = null;

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
    growthEarned: 0,
    netWithdrawn: 0,
    grossWithdrawn: 0,
    fedTax: 0,
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
        growthEarned: 0,
        netWithdrawn: 0,
        grossWithdrawn: 0,
        fedTax: 0,
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
      }
      else if (bucket === 'pretax' && balP > 0) {
        const draw = Math.min(balP, remainingNetNeeded);
        balP -= draw;
        remainingNetNeeded -= draw;
        yearOrdinaryGross += draw;
        currentYearData.netWithdrawn += draw;
      }
      else if (bucket === 'roth' && balR > 0) {
        const draw = Math.min(balR, remainingNetNeeded);
        balR -= draw;
        remainingNetNeeded -= draw;
        yearRothGross += draw;
        currentYearData.netWithdrawn += draw;
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
      const brokerageGains = yearBrokerageGross * (1 - state.brokerageCostBasis / 100);
      const taxBill = calculateTaxes(yearOrdinaryGross, brokerageGains, currentAge, state.filingStatus, state.stateResidence);
      
      let remainingTaxOwed = taxBill.totalTaxes;
      currentYearData.taxesPaid += taxBill.totalTaxes;
      currentYearData.fedTax += taxBill.fedTax;
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
      const brokerageGains = yearBrokerageGross * (1 - state.brokerageCostBasis / 100);
      const taxBill = calculateTaxes(yearOrdinaryGross, brokerageGains, currentAge, state.filingStatus, state.stateResidence);
      
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
    const ordGross = Math.max(0, y1.begPreTax - y1.endPreTax);
    const capGross = Math.max(0, y1.begBrokerage - y1.endBrokerage);
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
      <td style="color: ${row.fedTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.fedTax)}</td>
      <td style="color: ${row.stateTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.stateTax)}</td>
      <td style="color: ${row.niitTax > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.niitTax)}</td>
      <td style="color: ${row.penalty > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">${formatCurrency(row.penalty)}</td>
      <td style="color: ${taxesAndPenalties > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'}; font-weight: 600;">${formatCurrency(taxesAndPenalties)}</td>
    `;
    els.projectionsTableBody.appendChild(tr);
  });
  
  // Refresh Stacked Decumulation Area Chart
  renderChart(result.schedule);
}

// Render dynamic, multi-bucket stacked area chart using Chart.js
function renderChart(schedule) {
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
          fill: true,
          backgroundColor: brokerFill,
          tension: 0.1,
          stack: 'assets' // Enforce stacking
        },
        {
          label: 'Pre-Tax (IRA/401k) ($)',
          data: pretaxData,
          borderColor: '#f59e0b',
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointHoverRadius: 5,
          fill: true,
          backgroundColor: pretaxFill,
          tension: 0.1,
          stack: 'assets'
        },
        {
          label: 'Roth (Tax-Free) ($)',
          data: rothData,
          borderColor: '#10b981',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointHoverRadius: 6,
          fill: true,
          backgroundColor: rothFill,
          tension: 0.1,
          stack: 'assets'
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
  
  let csv = 'Year,Age,Brokerage Balance ($),Pre-Tax Balance ($),Roth Balance ($),Net Withdrawal ($),Gross Withdrawal ($),Federal Tax ($),State Tax ($),NIIT ($),Penalty ($),Total Tax and Penalties ($)\r\n';
  
  result.schedule.forEach(row => {
    const taxFees = row.taxesPaid;
    csv += `${row.year},${row.age},${row.endBrokerage.toFixed(2)},${row.endPreTax.toFixed(2)},${row.endRoth.toFixed(2)},${row.netWithdrawn.toFixed(2)},${row.grossWithdrawn.toFixed(2)},${row.fedTax.toFixed(2)},${row.stateTax.toFixed(2)},${row.niitTax.toFixed(2)},${row.penalty.toFixed(2)},${taxFees.toFixed(2)}\r\n`;
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

// Auto-run on load
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
