// ============================================================
// SkillLayer Seed Data
// ============================================================

export const DEVELOPER_PROFILE = {
  id: 'dev_001',
  name: 'Alex Chen',
  email: 'alex@devtools.ai',
  avatar: 'AC',
  totalRevenue: 18420.50,
  totalCalls: 4820300,
  activeSkills: 4,
  pendingPayout: 312.80,
  stripeConnected: true,
  tier: 'pro',
  joinedDate: '2024-06-01'
};

export const CATEGORIES = ['All', 'Search', 'Code', 'Finance', 'Media', 'Data', 'Productivity'];

export const SKILLS = [
  {
    id: 'skill_001',
    name: 'Web Search Pro',
    description: 'Real-time web search with ranked results, semantic relevance scoring, and source attribution. Indexes 10B+ pages updated hourly.',
    developer: 'Alex Chen',
    developerId: 'dev_001',
    developerAvatar: 'AC',
    category: 'Search',
    platforms: ['Claude', 'ChatGPT', 'Gemini'],
    pricingModel: 'per_call',
    pricePerCall: 0.002,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 1482930,
    callsThisMonth: 84210,
    revenue: 2965.86,
    revenueThisMonth: 168.42,
    rating: 4.8,
    reviews: 312,
    status: 'active',
    tags: ['search', 'web', 'realtime'],
    integrationSnippet: '// Claude MCP\n{\n  "tool": "web_search_pro",\n  "api_key": "sk_live_9xKp2mNqR4tY8vBz"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 320,
    createdAt: '2024-09-14',
    isMine: true
  },
  {
    id: 'skill_002',
    name: 'Code Executor',
    description: 'Sandboxed code execution for Python, JavaScript, Rust, and Go. Returns stdout, stderr, execution time, and memory usage.',
    developer: 'Alex Chen',
    developerId: 'dev_001',
    developerAvatar: 'AC',
    category: 'Code',
    platforms: ['Claude', 'ChatGPT'],
    pricingModel: 'per_call',
    pricePerCall: 0.005,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 892100,
    callsThisMonth: 41800,
    revenue: 4460.50,
    revenueThisMonth: 209.00,
    rating: 4.7,
    reviews: 198,
    status: 'active',
    tags: ['code', 'sandbox', 'execution'],
    integrationSnippet: '// ChatGPT Plugin\n{\n  "function": "code_executor",\n  "api_key": "sk_live_3nMp7qKjT9rF2wXy"\n}',
    surgeMultiplier: 2.4,
    avgLatencyMs: 890,
    createdAt: '2024-10-02',
    isMine: true
  },
  {
    id: 'skill_003',
    name: 'Financial Data Feed',
    description: 'Live stock quotes, forex rates, crypto prices, earnings data, and SEC filings. Sub-second latency with 99.9% uptime SLA.',
    developer: 'Priya Nair',
    developerId: 'dev_002',
    developerAvatar: 'PN',
    category: 'Finance',
    platforms: ['ChatGPT', 'Gemini'],
    pricingModel: 'subscription',
    pricePerCall: null,
    subscriptionMonthly: 29,
    revenueSharePct: null,
    totalCalls: 340200,
    callsThisMonth: 28900,
    revenue: 8700.00,
    revenueThisMonth: 1218.00,
    rating: 4.9,
    reviews: 441,
    status: 'active',
    tags: ['finance', 'stocks', 'crypto', 'live'],
    integrationSnippet: '// Gemini Tool\n{\n  "tool_id": "financial_data_feed",\n  "subscription_key": "sk_live_8tYb6nWsP1eH4aKm"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 140,
    createdAt: '2024-08-20',
    isMine: false
  },
  {
    id: 'skill_004',
    name: 'Image Analyzer',
    description: 'Deep vision analysis — object detection, text extraction (OCR), scene classification, face detection, and NSFW scoring.',
    developer: 'Marcus Webb',
    developerId: 'dev_003',
    developerAvatar: 'MW',
    category: 'Media',
    platforms: ['Claude', 'ChatGPT', 'Gemini'],
    pricingModel: 'per_call',
    pricePerCall: 0.008,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 210500,
    callsThisMonth: 18400,
    revenue: 1684.00,
    revenueThisMonth: 147.20,
    rating: 4.6,
    reviews: 127,
    status: 'active',
    tags: ['vision', 'ocr', 'image', 'detection'],
    integrationSnippet: '// Claude MCP\n{\n  "tool": "image_analyzer",\n  "api_key": "sk_live_7pLc5wRkN3xZ1mVq"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 560,
    createdAt: '2024-11-01',
    isMine: false
  },
  {
    id: 'skill_005',
    name: 'SQL Query Builder',
    description: 'Natural language to SQL with schema introspection, query optimization hints, and support for PostgreSQL, MySQL, SQLite, and BigQuery.',
    developer: 'Alex Chen',
    developerId: 'dev_001',
    developerAvatar: 'AC',
    category: 'Data',
    platforms: ['Claude', 'MCP'],
    pricingModel: 'per_call',
    pricePerCall: 0.003,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 178400,
    callsThisMonth: 12600,
    revenue: 535.20,
    revenueThisMonth: 37.80,
    rating: 4.5,
    reviews: 89,
    status: 'paused',
    tags: ['sql', 'database', 'nlp', 'query'],
    integrationSnippet: '// MCP Tool\n{\n  "tool": "sql_query_builder",\n  "api_key": "sk_live_2kHn8dFvQ5yT9bRw"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 210,
    createdAt: '2024-11-15',
    isMine: true
  },
  {
    id: 'skill_006',
    name: 'Email Drafter',
    description: 'AI-powered email composition with tone control, reply threading, CRM context injection, and A/B subject line variants.',
    developer: 'Sofia Ruiz',
    developerId: 'dev_004',
    developerAvatar: 'SR',
    category: 'Productivity',
    platforms: ['ChatGPT', 'Gemini'],
    pricingModel: 'revenue_share',
    pricePerCall: null,
    subscriptionMonthly: null,
    revenueSharePct: 15,
    totalCalls: 95300,
    callsThisMonth: 9800,
    revenue: 2180.00,
    revenueThisMonth: 220.00,
    rating: 4.4,
    reviews: 62,
    status: 'active',
    tags: ['email', 'productivity', 'crm'],
    integrationSnippet: '// ChatGPT Plugin\n{\n  "function": "email_drafter",\n  "api_key": "sk_live_6rEm9nJsB4uW7oXc"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 480,
    createdAt: '2024-12-01',
    isMine: false
  },
  {
    id: 'skill_007',
    name: 'Sentiment Analyzer',
    description: 'Multi-language sentiment classification with emotion detection, intensity scoring, and entity-level sentiment breakdown. 97.2% accuracy.',
    developer: 'Alex Chen',
    developerId: 'dev_001',
    developerAvatar: 'AC',
    category: 'Data',
    platforms: ['Claude', 'ChatGPT', 'Gemini', 'MCP'],
    pricingModel: 'per_call',
    pricePerCall: 0.001,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 2142800,
    callsThisMonth: 124300,
    revenue: 2142.80,
    revenueThisMonth: 124.30,
    rating: 4.9,
    reviews: 507,
    status: 'active',
    tags: ['nlp', 'sentiment', 'classification', 'multilingual'],
    integrationSnippet: '// All platforms\n{\n  "tool": "sentiment_analyzer",\n  "api_key": "sk_live_4vGp1nDkR7yH2tQs"\n}',
    surgeMultiplier: 1.8,
    avgLatencyMs: 95,
    createdAt: '2024-07-10',
    isMine: true
  },
  {
    id: 'skill_008',
    name: 'PDF Extractor',
    description: 'Structured data extraction from PDFs — tables, forms, invoices, contracts. Outputs clean JSON with page-level metadata and confidence scores.',
    developer: 'James Okoro',
    developerId: 'dev_005',
    developerAvatar: 'JO',
    category: 'Data',
    platforms: ['Claude', 'ChatGPT'],
    pricingModel: 'per_call',
    pricePerCall: 0.004,
    subscriptionMonthly: null,
    revenueSharePct: null,
    totalCalls: 430100,
    callsThisMonth: 31200,
    revenue: 1720.40,
    revenueThisMonth: 124.80,
    rating: 4.6,
    reviews: 183,
    status: 'active',
    tags: ['pdf', 'extraction', 'ocr', 'documents'],
    integrationSnippet: '// Claude MCP\n{\n  "tool": "pdf_extractor",\n  "api_key": "sk_live_5tNq3mWkF8xB6jYr"\n}',
    surgeMultiplier: 1.0,
    avgLatencyMs: 740,
    createdAt: '2024-10-22',
    isMine: false
  }
];

export const API_KEYS = [
  {
    id: 'key_001',
    key: 'sk_live_9xKp2mNqR4tY8vBz',
    skillId: 'skill_001',
    skillName: 'Web Search Pro',
    consumerId: 'user_enterprise_01',
    consumerName: 'Acme Corp',
    tier: 'enterprise',
    callsUsed: 48200,
    callsLimit: 100000,
    monthlySpend: 96.40,
    status: 'active',
    createdAt: '2024-10-01'
  },
  {
    id: 'key_002',
    key: 'sk_live_3nMp7qKjT9rF2wXy',
    skillId: 'skill_002',
    skillName: 'Code Executor',
    consumerId: 'user_pro_01',
    consumerName: 'DevBot Inc',
    tier: 'pro',
    callsUsed: 12400,
    callsLimit: 50000,
    monthlySpend: 62.00,
    status: 'active',
    createdAt: '2024-10-15'
  },
  {
    id: 'key_003',
    key: 'sk_live_7pLc5wRkN3xZ1mVq',
    skillId: 'skill_007',
    skillName: 'Sentiment Analyzer',
    consumerId: 'user_starter_01',
    consumerName: 'NLP Labs',
    tier: 'starter',
    callsUsed: 8900,
    callsLimit: 20000,
    monthlySpend: 8.90,
    status: 'active',
    createdAt: '2024-11-01'
  },
  {
    id: 'key_004',
    key: 'sk_live_2kHn8dFvQ5yT9bRw',
    skillId: 'skill_001',
    skillName: 'Web Search Pro',
    consumerId: 'user_free_01',
    consumerName: 'Indie Hacker Co',
    tier: 'free',
    callsUsed: 980,
    callsLimit: 1000,
    monthlySpend: 1.96,
    status: 'active',
    createdAt: '2024-11-20'
  },
  {
    id: 'key_005',
    key: 'sk_live_6rEm9nJsB4uW7oXc',
    skillId: 'skill_007',
    skillName: 'Sentiment Analyzer',
    consumerId: 'user_enterprise_02',
    consumerName: 'TechGiant LLC',
    tier: 'enterprise',
    callsUsed: 92000,
    callsLimit: 500000,
    monthlySpend: 92.00,
    status: 'active',
    createdAt: '2024-09-05'
  },
  {
    id: 'key_006',
    key: 'sk_live_4vGp1nDkR7yH2tQs',
    skillId: 'skill_002',
    skillName: 'Code Executor',
    consumerId: 'user_pro_02',
    consumerName: 'AutoCode AI',
    tier: 'pro',
    callsUsed: 29400,
    callsLimit: 50000,
    monthlySpend: 147.00,
    status: 'revoked',
    createdAt: '2024-10-10'
  }
];

// Generate 30-day usage data for a skill with realistic values
export function generateUsageChart(skillId, baseCalls = 2000, baseRevenue = 4.0) {
  const results = [];
  const now = new Date('2024-12-31');
  let seed = skillId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pseudoRandom = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(seed) / 0xffffffff;
  };
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDrop = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.65 : 1.0;
    const trend = 1 + (29 - i) * 0.008;
    const noise = 0.7 + pseudoRandom() * 0.6;
    const calls = Math.round(baseCalls * weekendDrop * trend * noise);
    const revenue = parseFloat((calls * (baseRevenue / baseCalls)).toFixed(2));
    results.push({
      date: date.toISOString().split('T')[0],
      calls,
      revenue,
      uniqueConsumers: Math.round(calls / (40 + pseudoRandom() * 40))
    });
  }
  return results;
}

export const USAGE_EVENTS = [
  ...generateUsageChart('skill_001', 2800, 5.60),
];

export const PAYOUTS = [
  {
    id: 'payout_001',
    developerId: 'dev_001',
    amount: 1840.20,
    period: 'November 2024',
    status: 'completed',
    method: 'Stripe',
    processedAt: '2024-12-01'
  },
  {
    id: 'payout_002',
    developerId: 'dev_001',
    amount: 2104.75,
    period: 'October 2024',
    status: 'completed',
    method: 'Stripe',
    processedAt: '2024-11-01'
  },
  {
    id: 'payout_003',
    developerId: 'dev_001',
    amount: 1923.40,
    period: 'September 2024',
    status: 'completed',
    method: 'Stripe',
    processedAt: '2024-10-01'
  },
  {
    id: 'payout_004',
    developerId: 'dev_001',
    amount: 1680.00,
    period: 'August 2024',
    status: 'completed',
    method: 'Stripe',
    processedAt: '2024-09-01'
  },
  {
    id: 'payout_005',
    developerId: 'dev_001',
    amount: 312.80,
    period: 'December 2024',
    status: 'pending',
    method: 'Stripe',
    processedAt: null
  }
];

export const TOP_CONSUMERS = [
  { id: 'user_enterprise_01', name: 'Acme Corp', avatar: 'AC', tier: 'enterprise', calls: 48200, spend: 268.40 },
  { id: 'user_enterprise_02', name: 'TechGiant LLC', avatar: 'TG', tier: 'enterprise', calls: 92000, spend: 92.00 },
  { id: 'user_pro_01', name: 'DevBot Inc', avatar: 'DB', tier: 'pro', calls: 12400, spend: 62.00 },
  { id: 'user_pro_02', name: 'AutoCode AI', avatar: 'AA', tier: 'pro', calls: 29400, spend: 147.00 },
  { id: 'user_starter_01', name: 'NLP Labs', avatar: 'NL', tier: 'starter', calls: 8900, spend: 8.90 }
];
