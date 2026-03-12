import React, { useState } from 'react';
import {
  LayoutGrid, BarChart2, Zap, Key, CreditCard,
  ChevronRight, Star, Shield, TrendingUp
} from 'lucide-react';
import { SKILLS, API_KEYS, PAYOUTS, DEVELOPER_PROFILE, CATEGORIES, generateUsageChart } from './data/seed.js';
import { MarketplaceView, DashboardView, MySkillsView, ApiKeysView, PayoutsView } from './components/Views.jsx';

const NAV_ITEMS = [
  { id: 'marketplace', label: 'Marketplace', icon: LayoutGrid },
  { id: 'dashboard', label: 'My Dashboard', icon: BarChart2 },
  { id: 'myskills', label: 'My Skills', icon: Zap },
  { id: 'apikeys', label: 'API Keys', icon: Key },
  { id: 'payouts', label: 'Payouts', icon: CreditCard },
];

const TIER_COLORS = { free: '#6b7280', starter: '#3b82f6', pro: '#7c3aed', enterprise: '#f59e0b' };

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [skills, setSkills] = useState(SKILLS);
  const [apiKeys, setApiKeys] = useState(API_KEYS);
  const [payouts] = useState(PAYOUTS);
  const [developerProfile] = useState(DEVELOPER_PROFILE);

  // Marketplace filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortBy, setSortBy] = useState('mostUsed');

  // Install modal
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Publish modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [publishForm, setPublishForm] = useState({
    name: '',
    description: '',
    category: 'Search',
    platforms: [],
    pricingModel: 'per_call',
    pricePerCall: '0.002',
    subscriptionMonthly: '29',
    revenueSharePct: '15',
    surgeEnabled: false,
    surgeMultiplier: '2.0',
    tiers: ['free', 'starter', 'pro', 'enterprise'],
    enterpriseLicensing: false
  });

  // Generate Key modal
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [keyForm, setKeyForm] = useState({ skillId: 'skill_001', tier: 'starter', callLimit: '10000', consumerName: '' });

  // Usage data for charts
  const [usageData] = useState(() => generateUsageChart('skill_001', 2800, 5.60));

  // Filtered skills for marketplace
  const filteredSkills = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchPlat = platformFilter === 'All' || s.platforms.includes(platformFilter);
    return matchSearch && matchCat && matchPlat;
  }).sort((a, b) => {
    if (sortBy === 'topRated') return b.rating - a.rating;
    if (sortBy === 'mostUsed') return b.totalCalls - a.totalCalls;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'priceLow') {
      const pa = a.pricePerCall || a.subscriptionMonthly || 0;
      const pb = b.pricePerCall || b.subscriptionMonthly || 0;
      return pa - pb;
    }
    return 0;
  });

  const mySkills = skills.filter(s => s.isMine);

  function handleInstall(skill) {
    setSelectedSkill(skill);
    setShowInstallModal(true);
  }

  function handlePublishSkill() {
    const newSkill = {
      id: `skill_${Date.now()}`,
      name: publishForm.name,
      description: publishForm.description,
      developer: developerProfile.name,
      developerId: developerProfile.id,
      developerAvatar: developerProfile.avatar,
      category: publishForm.category,
      platforms: publishForm.platforms,
      pricingModel: publishForm.pricingModel,
      pricePerCall: publishForm.pricingModel === 'per_call' ? parseFloat(publishForm.pricePerCall) : null,
      subscriptionMonthly: publishForm.pricingModel === 'subscription' ? parseFloat(publishForm.subscriptionMonthly) : null,
      revenueSharePct: publishForm.pricingModel === 'revenue_share' ? parseFloat(publishForm.revenueSharePct) : null,
      totalCalls: 0,
      callsThisMonth: 0,
      revenue: 0,
      revenueThisMonth: 0,
      rating: 0,
      reviews: 0,
      status: 'pending',
      tags: publishForm.category.toLowerCase().split(','),
      integrationSnippet: `// Integration\n{\n  "tool": "${publishForm.name.toLowerCase().replace(/\s+/g, '_')}",\n  "api_key": "sk_live_..."\n}`,
      surgeMultiplier: publishForm.surgeEnabled ? parseFloat(publishForm.surgeMultiplier) : 1.0,
      avgLatencyMs: 200,
      createdAt: new Date().toISOString().split('T')[0],
      isMine: true
    };
    setSkills(prev => [...prev, newSkill]);
    setShowPublishModal(false);
    setPublishStep(1);
    setPublishForm({
      name: '', description: '', category: 'Search', platforms: [],
      pricingModel: 'per_call', pricePerCall: '0.002', subscriptionMonthly: '29',
      revenueSharePct: '15', surgeEnabled: false, surgeMultiplier: '2.0',
      tiers: ['free', 'starter', 'pro', 'enterprise'], enterpriseLicensing: false
    });
    setActiveTab('myskills');
  }

  function handleToggleSkillStatus(skillId) {
    setSkills(prev => prev.map(s => {
      if (s.id !== skillId) return s;
      return { ...s, status: s.status === 'active' ? 'paused' : 'active' };
    }));
  }

  function handleGenerateKey() {
    const skill = skills.find(s => s.id === keyForm.skillId);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let keyStr = 'sk_live_';
    for (let i = 0; i < 16; i++) keyStr += chars[Math.floor(Math.random() * chars.length)];
    const newKey = {
      id: `key_${Date.now()}`,
      key: keyStr,
      skillId: keyForm.skillId,
      skillName: skill?.name || '',
      consumerId: `user_${Date.now()}`,
      consumerName: keyForm.consumerName || 'New Consumer',
      tier: keyForm.tier,
      callsUsed: 0,
      callsLimit: parseInt(keyForm.callLimit) || 10000,
      monthlySpend: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setApiKeys(prev => [...prev, newKey]);
    setShowGenerateKeyModal(false);
    setKeyForm({ skillId: 'skill_001', tier: 'starter', callLimit: '10000', consumerName: '' });
  }

  function handleRevokeKey(keyId) {
    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'revoked' } : k));
  }

  const s = {
    app: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#0d0d0f'
    },
    sidebar: {
      width: '220px',
      minWidth: '220px',
      background: '#111116',
      borderRight: '1px solid #2a2a35',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    },
    logo: {
      padding: '20px 20px 16px',
      borderBottom: '1px solid #2a2a35',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '16px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    nav: {
      flex: 1,
      padding: '12px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
      color: active ? '#a855f7' : '#a1a1aa',
      fontWeight: active ? '600' : '400',
      fontSize: '13.5px',
      transition: 'all 0.15s',
      border: active ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
      userSelect: 'none'
    }),
    profile: {
      padding: '16px',
      borderTop: '1px solid #2a2a35',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    avatar: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '700',
      color: '#fff',
      flexShrink: 0
    },
    main: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  };

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={s.logoText}>SkillLayer</span>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <div
                key={item.id}
                style={s.navItem(active)}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f4f4f5'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; } }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </div>
            );
          })}
        </nav>

        {/* Profile */}
        <div style={s.profile}>
          <div style={s.avatar}>{developerProfile.avatar}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {developerProfile.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{
                fontSize: '10px', fontWeight: '700', color: '#7c3aed',
                background: 'rgba(124,58,237,0.15)', padding: '1px 6px',
                borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>Pro</span>
              {developerProfile.stripeConnected && (
                <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Shield size={9} />
                  Stripe
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={s.main}>
        {activeTab === 'marketplace' && (
          <MarketplaceView
            skills={filteredSkills}
            allSkills={skills}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onInstall={handleInstall}
            showInstallModal={showInstallModal}
            setShowInstallModal={setShowInstallModal}
            selectedSkill={selectedSkill}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardView
            developerProfile={developerProfile}
            skills={skills}
            apiKeys={apiKeys}
            usageData={usageData}
            mySkills={mySkills}
            onToggleStatus={handleToggleSkillStatus}
          />
        )}
        {activeTab === 'myskills' && (
          <MySkillsView
            skills={mySkills}
            onToggleStatus={handleToggleSkillStatus}
            showPublishModal={showPublishModal}
            setShowPublishModal={setShowPublishModal}
            publishStep={publishStep}
            setPublishStep={setPublishStep}
            publishForm={publishForm}
            setPublishForm={setPublishForm}
            onPublish={handlePublishSkill}
          />
        )}
        {activeTab === 'apikeys' && (
          <ApiKeysView
            apiKeys={apiKeys}
            skills={skills}
            onRevoke={handleRevokeKey}
            showGenerateKeyModal={showGenerateKeyModal}
            setShowGenerateKeyModal={setShowGenerateKeyModal}
            keyForm={keyForm}
            setKeyForm={setKeyForm}
            onGenerateKey={handleGenerateKey}
          />
        )}
        {activeTab === 'payouts' && (
          <PayoutsView
            payouts={payouts}
            developerProfile={developerProfile}
          />
        )}
      </main>
    </div>
  );
}
