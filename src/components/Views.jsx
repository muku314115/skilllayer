import React, { useState, useRef, useCallback } from 'react';
import {
  Search, Filter, Star, Copy, Check, X, Plus, TrendingUp, TrendingDown,
  Zap, Key, DollarSign, Activity, Users, ArrowUpRight, Download,
  ToggleLeft, ToggleRight, Edit2, Eye, AlertTriangle, CheckCircle,
  Clock, ChevronDown, ChevronUp, Flame, BarChart2, Globe, Code2, CreditCard
} from 'lucide-react';
import { CATEGORIES, TOP_CONSUMERS, generateUsageChart } from '../data/seed.js';

// ============================================================
// SHARED UTILITIES & CONSTANTS
// ============================================================

const PLATFORM_COLORS = {
  Claude: { bg: 'rgba(251,146,60,0.15)', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  ChatGPT: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Gemini: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  MCP: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', border: 'rgba(168,85,247,0.3)' }
};

const TIER_STYLES = {
  free: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af', label: 'Free' },
  starter: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', label: 'Starter' },
  pro: { bg: 'rgba(124,58,237,0.15)', text: '#a855f7', label: 'Pro' },
  enterprise: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', label: 'Enterprise' }
};

const STATUS_STYLES = {
  active: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', label: 'Active' },
  paused: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', label: 'Paused' },
  pending: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af', label: 'Pending' },
  revoked: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'Revoked' },
  completed: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', label: 'Completed' },
  processing: { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4', label: 'Processing' }
};

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPrice(skill) {
  if (skill.pricingModel === 'per_call') return `$${skill.pricePerCall}/call`;
  if (skill.pricingModel === 'subscription') return `$${skill.subscriptionMonthly}/mo`;
  if (skill.pricingModel === 'revenue_share') return `${skill.revenueSharePct}% rev share`;
  return 'Free';
}

function Badge({ style: extraStyle, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
      fontWeight: '600', whiteSpace: 'nowrap', ...extraStyle
    }}>
      {children}
    </span>
  );
}

function Card({ children, style: extraStyle, hoverable }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: '#1a1a1f',
        border: '1px solid #2a2a35',
        borderRadius: '12px',
        transition: 'all 0.2s',
        transform: hoverable && hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hoverable && hovered ? '0 8px 24px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        ...extraStyle
      }}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
    >
      {children}
    </div>
  );
}

function Btn({ children, variant = 'primary', onClick, style: extraStyle, disabled }) {
  const [hovered, setHovered] = useState(false);
  const styles = {
    primary: {
      background: hovered ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: '#fff', border: 'none'
    },
    secondary: {
      background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
      color: '#f4f4f5', border: '1px solid #3a3a45'
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
      color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'
    },
    ghost: {
      background: 'transparent',
      color: '#a1a1aa', border: 'none'
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px', borderRadius: '8px', fontWeight: '600',
        fontSize: '13px', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
        ...styles[variant], ...extraStyle
      }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

// Sparkline: 7-bar mini chart
function Sparkline({ data, color = '#7c3aed', width = 56, height = 24 }) {
  if (!data || data.length === 0) return <svg width={width} height={height} />;
  const max = Math.max(...data, 1);
  const barW = Math.floor(width / data.length) - 1;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * height);
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={height - h}
            width={barW}
            height={h}
            rx={1}
            fill={color}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}

// CopyButton
function CopyBtn({ text, style: extraStyle }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : '#3a3a45'}`,
        borderRadius: '6px', padding: '5px 10px', color: copied ? '#10b981' : '#a1a1aa',
        cursor: 'pointer', fontSize: '12px', fontWeight: '600',
        display: 'inline-flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s',
        ...extraStyle
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// Modal wrapper
function Modal({ onClose, children, width = '560px' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#1a1a1f', border: '1px solid #2a2a35',
        borderRadius: '16px', width, maxWidth: '100%',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 24px', borderBottom: '1px solid #2a2a35'
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f4f4f5' }}>{title}</h2>
      <button onClick={onClose} style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid #3a3a45',
        borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#a1a1aa',
        display: 'flex', alignItems: 'center'
      }}><X size={14} /></button>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, style: extraStyle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...extraStyle }}>
      {label && <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: '#0d0d0f', border: '1px solid #3a3a45',
          borderRadius: '8px', padding: '10px 12px', color: '#f4f4f5',
          fontSize: '14px', outline: 'none', width: '100%',
          transition: 'border-color 0.15s'
        }}
        onFocus={e => e.target.style.borderColor = '#7c3aed'}
        onBlur={e => e.target.style.borderColor = '#3a3a45'}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, style: extraStyle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...extraStyle }}>
      {label && <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: '#0d0d0f', border: '1px solid #3a3a45',
          borderRadius: '8px', padding: '10px 12px', color: '#f4f4f5',
          fontSize: '14px', outline: 'none', width: '100%', cursor: 'pointer'
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ============================================================
// MARKETPLACE VIEW
// ============================================================

export function MarketplaceView({
  skills, allSkills, searchQuery, setSearchQuery,
  categoryFilter, setCategoryFilter,
  platformFilter, setPlatformFilter,
  sortBy, setSortBy, onInstall,
  showInstallModal, setShowInstallModal, selectedSkill
}) {
  const featuredSkills = allSkills.filter(s => s.rating >= 4.7).slice(0, 3);

  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#0d0d0f' }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px 0',
        borderBottom: '1px solid #1a1a1f',
        background: 'linear-gradient(180deg, #111116 0%, #0d0d0f 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>AI Skill Marketplace</h1>
            <p style={{ fontSize: '13px', color: '#a1a1aa' }}>{allSkills.length} skills available across Claude, ChatGPT, Gemini & MCP</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#a855f7', fontWeight: '600'
            }}>
              🔥 {allSkills.filter(s => s.surgeMultiplier > 1).length} skills surge pricing active
            </div>
          </div>
        </div>

        {/* Search + Filters Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search skills, tags, developers..."
              style={{
                width: '100%', background: '#1a1a1f', border: '1px solid #2a2a35',
                borderRadius: '10px', padding: '10px 12px 10px 36px',
                color: '#f4f4f5', fontSize: '13px', outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = '#2a2a35'}
            />
          </div>

          {/* Platform Filters */}
          {['All', 'Claude', 'ChatGPT', 'Gemini', 'MCP'].map(plat => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                background: platformFilter === plat ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                borderColor: platformFilter === plat ? 'rgba(124,58,237,0.5)' : '#2a2a35',
                color: platformFilter === plat ? '#a855f7' : '#a1a1aa'
              }}
            >{plat}</button>
          ))}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: '#1a1a1f', border: '1px solid #2a2a35', borderRadius: '8px',
              padding: '8px 12px', color: '#f4f4f5', fontSize: '12px', cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="mostUsed">Most Used</option>
            <option value="topRated">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '16px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                background: categoryFilter === cat ? 'rgba(6,182,212,0.15)' : 'transparent',
                borderColor: categoryFilter === cat ? 'rgba(6,182,212,0.4)' : '#2a2a35',
                color: categoryFilter === cat ? '#06b6d4' : '#a1a1aa'
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* Featured Row */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {featuredSkills.map(skill => (
              <div key={skill.id} style={{
                minWidth: '300px', background: 'linear-gradient(135deg, #1a1a2f 0%, #1a1a1f 100%)',
                border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px',
                padding: '18px', flexShrink: 0
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{skill.category}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', marginTop: '2px' }}>{skill.name}</h3>
                  </div>
                  <span style={{
                    background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '20px', padding: '3px 8px', fontSize: '11px', color: '#f59e0b', fontWeight: '700'
                  }}>⭐ {skill.rating}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '12px', lineHeight: '1.5' }}>{skill.description.slice(0, 80)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4' }}>{formatPrice(skill)}</span>
                  <Btn style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => onInstall(skill)}>Install</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
            Showing <strong style={{ color: '#f4f4f5' }}>{skills.length}</strong> skills
            {categoryFilter !== 'All' && <> in <strong style={{ color: '#a855f7' }}>{categoryFilter}</strong></>}
            {platformFilter !== 'All' && <> for <strong style={{ color: '#06b6d4' }}>{platformFilter}</strong></>}
          </span>
        </div>

        {/* Skill Grid */}
        {skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <Search size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No skills found</p>
            <p style={{ fontSize: '13px' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} onInstall={onInstall} />
            ))}
          </div>
        )}
      </div>

      {/* Install Modal */}
      {showInstallModal && selectedSkill && (
        <InstallModal skill={selectedSkill} onClose={() => setShowInstallModal(false)} />
      )}
    </div>
  );
}

function SkillCard({ skill, onInstall }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: '#1a1a1f', border: `1px solid ${hovered ? '#3a3a4f' : '#2a2a35'}`,
        borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column',
        gap: '12px', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'default'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: '#a855f7',
              background: 'rgba(124,58,237,0.12)', padding: '2px 7px', borderRadius: '4px',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{skill.category}</span>
            {skill.surgeMultiplier > 1 && (
              <span style={{
                fontSize: '10px', fontWeight: '700', color: '#ef4444',
                background: 'rgba(239,68,68,0.12)', padding: '2px 7px', borderRadius: '4px',
                border: '1px solid rgba(239,68,68,0.2)'
              }}>🔥 {skill.surgeMultiplier}x surge</span>
            )}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {skill.name}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, marginLeft: '8px' }}>
          <Star size={11} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b' }}>{skill.rating}</span>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>({skill.reviews})</span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.55', flex: 1 }}>
        {skill.description.slice(0, 90)}{skill.description.length > 90 ? '...' : ''}
      </p>

      {/* Developer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', fontWeight: '700', color: '#fff', flexShrink: 0
        }}>{skill.developerAvatar}</div>
        <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{skill.developer}</span>
      </div>

      {/* Platforms */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {skill.platforms.map(p => {
          const c = PLATFORM_COLORS[p] || { bg: '#1a1a1f', text: '#a1a1aa', border: '#3a3a45' };
          return (
            <span key={p} style={{
              fontSize: '10px', fontWeight: '700', padding: '2px 8px',
              borderRadius: '4px', background: c.bg, color: c.text, border: `1px solid ${c.border}`
            }}>{p}</span>
          );
        })}
      </div>

      {/* Stats + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4' }}>{formatPrice(skill)}</div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{formatNum(skill.totalCalls)} total calls</div>
        </div>
        <Btn style={{ padding: '7px 16px', fontSize: '12px' }} onClick={() => onInstall(skill)}>
          <Zap size={12} /> Install
        </Btn>
      </div>
    </div>
  );
}

function InstallModal({ skill, onClose }) {
  const [activeTab, setActiveTab] = useState('claude');
  const tabs = skill.platforms.map(p => ({ id: p.toLowerCase(), label: p }));
  if (tabs.length === 0) tabs.push({ id: 'mcp', label: 'MCP' });

  const snippets = {
    claude: `// Claude MCP Integration\n{\n  "tool": "${skill.name.toLowerCase().replace(/\s+/g, '_')}",\n  "api_key": "sk_live_YOUR_KEY_HERE",\n  "endpoint": "https://api.skilllayer.io/v1/invoke"\n}`,
    chatgpt: `// ChatGPT Plugin Manifest\n{\n  "function_name": "${skill.name.toLowerCase().replace(/\s+/g, '_')}",\n  "api_key": "sk_live_YOUR_KEY_HERE",\n  "openapi_url": "https://api.skilllayer.io/skills/${skill.id}/openapi.json"\n}`,
    gemini: `// Gemini Tool Integration\n{\n  "tool_id": "${skill.id}",\n  "api_key": "sk_live_YOUR_KEY_HERE",\n  "invoke_url": "https://api.skilllayer.io/v1/invoke/${skill.id}"\n}`,
    mcp: `// MCP Compatible\ncurl -X POST https://api.skilllayer.io/v1/invoke \\\n  -H "Authorization: Bearer sk_live_YOUR_KEY_HERE" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "skill_id": "${skill.id}", "input": {} }'`
  };

  const currentSnippet = snippets[activeTab] || snippets['mcp'] || '';

  return (
    <Modal onClose={onClose} width="580px">
      <ModalHeader title={`Install ${skill.name}`} onClose={onClose} />
      <div style={{ padding: '24px' }}>
        {/* Skill Info */}
        <div style={{
          background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '10px',
          padding: '16px', marginBottom: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', marginBottom: '4px' }}>{skill.name}</div>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>by {skill.developer}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#06b6d4' }}>{formatPrice(skill)}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{formatNum(skill.totalCalls)} calls</div>
          </div>
        </div>

        {/* Step 1: Get API Key */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff', flexShrink: 0
            }}>1</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5' }}>Your API Key</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '8px', padding: '10px 14px'
          }}>
            <Key size={13} color="#7c3aed" />
            <code style={{ flex: 1, fontSize: '13px', color: '#a855f7', fontFamily: 'monospace' }}>sk_live_9xKp2mNqR4tY8vBz</code>
            <CopyBtn text="sk_live_9xKp2mNqR4tY8vBz" />
          </div>
        </div>

        {/* Step 2: Integration Code */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff', flexShrink: 0
            }}>2</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5' }}>Integration Code</span>
          </div>

          {/* Platform tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                  cursor: 'pointer', border: '1px solid',
                  background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                  borderColor: activeTab === tab.id ? 'rgba(124,58,237,0.5)' : '#3a3a45',
                  color: activeTab === tab.id ? '#a855f7' : '#a1a1aa'
                }}
              >{tab.label}</button>
            ))}
          </div>

          <div style={{
            background: '#0a0a0d', border: '1px solid #2a2a35', borderRadius: '8px',
            padding: '14px', position: 'relative'
          }}>
            <pre style={{
              color: '#e2e8f0', fontSize: '12px', fontFamily: 'monospace',
              overflowX: 'auto', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.6'
            }}>{currentSnippet}</pre>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <CopyBtn text={currentSnippet} />
            </div>
          </div>
        </div>

        {/* Pricing reminder */}
        <div style={{
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start'
        }}>
          <DollarSign size={14} color="#a855f7" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '12px', color: '#c4b5fd', lineHeight: '1.5' }}>
            Billed at <strong>{formatPrice(skill)}</strong>. Usage metered automatically.
            Charges appear on your SkillLayer invoice. Set spend limits in API Keys tab.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={onClose}><Check size={13} /> Done — I'm integrated</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// DASHBOARD VIEW
// ============================================================

export function DashboardView({ developerProfile, skills, apiKeys, usageData, mySkills, onToggleStatus }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const activeKeyCount = apiKeys.filter(k => k.status === 'active').length;

  // Build SVG area chart
  const chartData = usageData;
  const chartW = 680;
  const chartH = 180;
  const padL = 50; const padR = 16; const padT = 12; const padB = 32;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const maxRev = Math.max(...chartData.map(d => d.revenue), 1);
  const maxCalls = Math.max(...chartData.map(d => d.calls), 1);

  const toX = (i) => padL + (i / (chartData.length - 1)) * innerW;
  const toY = (v) => padT + innerH - (v / maxRev) * innerH;

  const polyPoints = chartData.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(' ');
  const fillPoints = [
    `${padL},${padT + innerH}`,
    ...chartData.map((d, i) => `${toX(i)},${toY(d.revenue)}`),
    `${padL + innerW},${padT + innerH}`
  ].join(' ');

  // X-axis labels: show every 5 days
  const xLabels = chartData.filter((_, i) => i % 5 === 0 || i === chartData.length - 1);

  // Y-axis labels
  const ySteps = [0, 0.25, 0.5, 0.75, 1.0];

  const kpis = [
    {
      label: 'Total Revenue', value: formatMoney(developerProfile.totalRevenue),
      sub: '+12.4% vs last month', subColor: '#10b981', icon: DollarSign, iconColor: '#10b981',
      iconBg: 'rgba(16,185,129,0.12)'
    },
    {
      label: 'Calls This Month', value: formatNum(mySkills.reduce((s, k) => s + k.callsThisMonth, 0)),
      sub: 'Across all skills', subColor: '#a1a1aa', icon: Activity, iconColor: '#06b6d4',
      iconBg: 'rgba(6,182,212,0.12)'
    },
    {
      label: 'Active API Keys', value: activeKeyCount.toString(),
      sub: `${apiKeys.length} total keys`, subColor: '#a1a1aa', icon: Key, iconColor: '#a855f7',
      iconBg: 'rgba(124,58,237,0.12)'
    },
    {
      label: 'Pending Payout', value: formatMoney(developerProfile.pendingPayout),
      sub: 'Pays out Dec 31', subColor: '#f59e0b', icon: CreditCard, iconColor: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.12)'
    }
  ];

  // Per-skill sparklines (last 7 days synthetic)
  function getSparkline(skillId) {
    const d = generateUsageChart(skillId, 1000, 2.0);
    return d.slice(-7).map(x => x.calls);
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '28px 32px', background: '#0d0d0f' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>My Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Real-time revenue, usage, and performance for your published skills.</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} hoverable style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={16} color={kpi.iconColor} />
                </div>
                <ArrowUpRight size={14} color="#3a3a45" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>{kpi.label}</div>
              <div style={{ fontSize: '11px', color: kpi.subColor, fontWeight: '600' }}>{kpi.sub}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '20px' }}>
        {/* Revenue Area Chart */}
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>Revenue (30 days)</h3>
              <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Daily revenue across Web Search Pro</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                {formatMoney(chartData.reduce((s, d) => s + d.revenue, 0))}
              </div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>30-day total</div>
            </div>
          </div>

          {/* SVG Chart */}
          <div style={{ position: 'relative', width: '100%' }}>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {ySteps.map(step => {
                const y = padT + innerH - step * innerH;
                return (
                  <g key={step}>
                    <line x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="#2a2a35" strokeWidth="1" />
                    <text x={padL - 6} y={y + 4} textAnchor="end" fill="#4a4a5a" fontSize="9">
                      ${(step * maxRev).toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {xLabels.map((d, i) => {
                const idx = chartData.indexOf(d);
                const x = toX(idx);
                const label = d.date.slice(5); // MM-DD
                return (
                  <text key={i} x={x} y={chartH - 6} textAnchor="middle" fill="#4a4a5a" fontSize="9">{label}</text>
                );
              })}

              {/* Fill area */}
              <polygon points={fillPoints} fill="url(#revenueGrad)" />

              {/* Line */}
              <polyline points={polyPoints} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* Hover dots */}
              {chartData.map((d, i) => (
                <circle
                  key={i}
                  cx={toX(i)}
                  cy={toY(d.revenue)}
                  r={hoveredPoint === i ? 5 : 3}
                  fill={hoveredPoint === i ? '#06b6d4' : '#0d0d0f'}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.1s' }}
                  onMouseEnter={() => setHoveredPoint(i)}
                />
              ))}

              {/* Tooltip */}
              {hoveredPoint !== null && (() => {
                const d = chartData[hoveredPoint];
                const x = toX(hoveredPoint);
                const y = toY(d.revenue);
                const bx = Math.min(x - 40, chartW - 120);
                const by = Math.max(y - 58, 4);
                return (
                  <g>
                    <rect x={bx} y={by} width={110} height={50} rx={6} fill="#1a1a2f" stroke="#3a3a5a" strokeWidth="1" />
                    <text x={bx + 8} y={by + 16} fill="#a1a1aa" fontSize="9">{d.date}</text>
                    <text x={bx + 8} y={by + 30} fill="#06b6d4" fontSize="11" fontWeight="bold">{formatMoney(d.revenue)}</text>
                    <text x={bx + 8} y={by + 43} fill="#a1a1aa" fontSize="9">{formatNum(d.calls)} calls</text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </Card>

        {/* Top Consumers */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5', marginBottom: '4px' }}>Top Consumers</h3>
          <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '16px' }}>By spend this month</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TOP_CONSUMERS.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', width: '14px', textAlign: 'right', fontWeight: '700' }}>{i + 1}</span>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: `hsl(${i * 60 + 220}, 60%, 50%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0
                }}>{c.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: '700', padding: '1px 5px', borderRadius: '3px',
                      background: TIER_STYLES[c.tier]?.bg, color: TIER_STYLES[c.tier]?.text
                    }}>{TIER_STYLES[c.tier]?.label}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{formatNum(c.calls)} calls</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{formatMoney(c.spend)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Skills Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #2a2a35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>My Skills Performance</h3>
            <p style={{ fontSize: '12px', color: '#a1a1aa' }}>30-day metrics for your published skills</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a35' }}>
                {['Skill Name', 'Calls (30d)', 'Revenue (30d)', 'Avg Latency', '7-day trend', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mySkills.map((skill, i) => (
                <tr key={skill.id} style={{
                  borderBottom: i < mySkills.length - 1 ? '1px solid #1e1e28' : 'none',
                  transition: 'background 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5' }}>{skill.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{skill.category}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5' }}>{formatNum(skill.callsThisMonth)}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>{formatMoney(skill.revenueThisMonth)}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#a1a1aa' }}>{skill.avgLatencyMs}ms</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Sparkline data={getSparkline(skill.id)} color="#7c3aed" width={56} height={22} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => onToggleStatus(skill.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                        cursor: 'pointer', border: '1px solid',
                        background: STATUS_STYLES[skill.status]?.bg || 'transparent',
                        borderColor: STATUS_STYLES[skill.status]?.text || '#3a3a45',
                        color: STATUS_STYLES[skill.status]?.text || '#a1a1aa'
                      }}
                    >
                      {skill.status === 'active' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {STATUS_STYLES[skill.status]?.label || skill.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// MY SKILLS VIEW
// ============================================================

export function MySkillsView({
  skills, onToggleStatus,
  showPublishModal, setShowPublishModal,
  publishStep, setPublishStep,
  publishForm, setPublishForm,
  onPublish
}) {
  const allPlatforms = ['Claude', 'ChatGPT', 'Gemini', 'MCP'];

  function togglePlatform(p) {
    setPublishForm(f => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter(x => x !== p)
        : [...f.platforms, p]
    }));
  }

  function getSparkline(skillId) {
    const d = generateUsageChart(skillId, 1000, 2.0);
    return d.slice(-7).map(x => x.calls);
  }

  const stepLabels = ['Basic Info', 'Pricing', 'Advanced', 'Review'];

  const canProceed = () => {
    if (publishStep === 1) return publishForm.name.trim().length > 2 && publishForm.description.trim().length > 10 && publishForm.platforms.length > 0;
    if (publishStep === 2) return true;
    if (publishStep === 3) return true;
    return true;
  };

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '28px 32px', background: '#0d0d0f' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>My Skills</h1>
          <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Manage, monitor, and publish your AI skills to the marketplace.</p>
        </div>
        <Btn onClick={() => setShowPublishModal(true)}>
          <Plus size={14} /> Publish New Skill
        </Btn>
      </div>

      {/* Skills List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {skills.map(skill => (
          <Card key={skill.id} hoverable style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Main info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5' }}>{skill.name}</h3>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px',
                    background: STATUS_STYLES[skill.status]?.bg, color: STATUS_STYLES[skill.status]?.text
                  }}>{STATUS_STYLES[skill.status]?.label}</span>
                  {skill.surgeMultiplier > 1 && (
                    <span style={{
                      fontSize: '10px', fontWeight: '700', color: '#ef4444',
                      background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '20px',
                      border: '1px solid rgba(239,68,68,0.2)'
                    }}>🔥 {skill.surgeMultiplier}x surge</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5', marginBottom: '10px', maxWidth: '480px' }}>
                  {skill.description.slice(0, 120)}{skill.description.length > 120 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {skill.platforms.map(p => {
                    const c = PLATFORM_COLORS[p];
                    return (
                      <span key={p} style={{
                        fontSize: '10px', fontWeight: '600', padding: '2px 7px',
                        borderRadius: '4px', background: c.bg, color: c.text, border: `1px solid ${c.border}`
                      }}>{p}</span>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#f4f4f5' }}>{formatNum(skill.callsThisMonth)}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>Calls/mo</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{formatMoney(skill.revenueThisMonth)}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>Rev/mo</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4', marginBottom: '4px' }}>7d trend</div>
                  <Sparkline data={getSparkline(skill.id)} color="#06b6d4" width={56} height={22} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>{formatPrice(skill)}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>Price</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                <Btn variant="secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <Edit2 size={11} /> Edit
                </Btn>
                <button
                  onClick={() => onToggleStatus(skill.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', border: '1px solid #3a3a45',
                    background: 'rgba(255,255,255,0.04)', color: '#a1a1aa'
                  }}
                >
                  {skill.status === 'active' ? <ToggleRight size={12} color="#10b981" /> : <ToggleLeft size={12} />}
                  {skill.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <Btn variant="ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <Eye size={11} /> Analytics
                </Btn>
              </div>
            </div>
          </Card>
        ))}

        {skills.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: '#1a1a1f', border: '1px dashed #3a3a45', borderRadius: '12px'
          }}>
            <Zap size={40} style={{ margin: '0 auto 16px', opacity: 0.3, color: '#7c3aed' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#a1a1aa', marginBottom: '8px' }}>No skills published yet</p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Publish your first AI skill and start earning.</p>
            <Btn onClick={() => setShowPublishModal(true)}><Plus size={13} /> Publish First Skill</Btn>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <Modal onClose={() => { setShowPublishModal(false); setPublishStep(1); }} width="600px">
          <ModalHeader
            title={`Publish New Skill — Step ${publishStep} of 4: ${stepLabels[publishStep - 1]}`}
            onClose={() => { setShowPublishModal(false); setPublishStep(1); }}
          />

          {/* Step progress */}
          <div style={{ padding: '16px 24px 0', display: 'flex', gap: '6px' }}>
            {stepLabels.map((label, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                  height: '3px', borderRadius: '2px',
                  background: i < publishStep ? '#7c3aed' : i === publishStep - 1 ? '#a855f7' : '#2a2a35'
                }} />
                <span style={{ fontSize: '10px', color: i < publishStep ? '#a855f7' : '#6b7280', fontWeight: '600' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Step 1: Basic Info */}
            {publishStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input label="Skill Name" value={publishForm.name} onChange={v => setPublishForm(f => ({ ...f, name: v }))} placeholder="e.g. Web Search Pro" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                  <textarea
                    value={publishForm.description}
                    onChange={e => setPublishForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe what your skill does, its use cases, and key features..."
                    rows={3}
                    style={{
                      background: '#0d0d0f', border: '1px solid #3a3a45', borderRadius: '8px',
                      padding: '10px 12px', color: '#f4f4f5', fontSize: '14px', resize: 'vertical',
                      outline: 'none', lineHeight: '1.5'
                    }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = '#3a3a45'}
                  />
                </div>
                <Select
                  label="Category"
                  value={publishForm.category}
                  onChange={v => setPublishForm(f => ({ ...f, category: v }))}
                  options={CATEGORIES.filter(c => c !== 'All').map(c => ({ value: c, label: c }))}
                />
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Platforms</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {allPlatforms.map(p => {
                      const selected = publishForm.platforms.includes(p);
                      const c = PLATFORM_COLORS[p];
                      return (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                            cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                            background: selected ? c.bg : 'transparent',
                            borderColor: selected ? c.border : '#3a3a45',
                            color: selected ? c.text : '#a1a1aa'
                          }}
                        >
                          {selected && <Check size={10} style={{ marginRight: '4px' }} />}
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  {publishForm.platforms.length === 0 && (
                    <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>Select at least one platform</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {publishStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>Pricing Model</label>
                  {[
                    { value: 'per_call', label: 'Per Call', desc: 'Charge a fixed amount per API invocation' },
                    { value: 'subscription', label: 'Monthly Subscription', desc: 'Flat monthly fee with unlimited or capped calls' },
                    { value: 'revenue_share', label: 'Revenue Share', desc: 'Take a % of revenue generated by AI agents using your skill' }
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '12px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
                      border: '1px solid',
                      background: publishForm.pricingModel === opt.value ? 'rgba(124,58,237,0.1)' : '#0d0d0f',
                      borderColor: publishForm.pricingModel === opt.value ? 'rgba(124,58,237,0.4)' : '#3a3a45'
                    }}>
                      <input
                        type="radio" name="pricing" value={opt.value}
                        checked={publishForm.pricingModel === opt.value}
                        onChange={() => setPublishForm(f => ({ ...f, pricingModel: opt.value }))}
                        style={{ marginTop: '2px', accentColor: '#7c3aed' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {publishForm.pricingModel === 'per_call' && (
                  <Input label="Price Per Call (USD)" type="number" value={publishForm.pricePerCall}
                    onChange={v => setPublishForm(f => ({ ...f, pricePerCall: v }))} placeholder="0.002" />
                )}
                {publishForm.pricingModel === 'subscription' && (
                  <Input label="Monthly Price (USD)" type="number" value={publishForm.subscriptionMonthly}
                    onChange={v => setPublishForm(f => ({ ...f, subscriptionMonthly: v }))} placeholder="29" />
                )}
                {publishForm.pricingModel === 'revenue_share' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Share %: <strong style={{ color: '#a855f7' }}>{publishForm.revenueSharePct}%</strong></label>
                    <input type="range" min="5" max="40" value={publishForm.revenueSharePct}
                      onChange={e => setPublishForm(f => ({ ...f, revenueSharePct: e.target.value }))}
                      style={{ accentColor: '#7c3aed', width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                      <span>5% (competitive)</span><span>40% (premium)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Advanced */}
            {publishStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Surge Pricing */}
                <div style={{ background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>🔥 Surge Pricing</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Automatically increase price during high demand periods</div>
                    </div>
                    <button
                      onClick={() => setPublishForm(f => ({ ...f, surgeEnabled: !f.surgeEnabled }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {publishForm.surgeEnabled
                        ? <ToggleRight size={28} color="#7c3aed" />
                        : <ToggleLeft size={28} color="#6b7280" />
                      }
                    </button>
                  </div>
                  {publishForm.surgeEnabled && (
                    <Input label="Max Surge Multiplier" type="number" value={publishForm.surgeMultiplier}
                      onChange={v => setPublishForm(f => ({ ...f, surgeMultiplier: v }))} placeholder="2.0" />
                  )}
                </div>

                {/* Tier Access */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>Tier Access</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['free', 'starter', 'pro', 'enterprise'].map(tier => {
                      const s = TIER_STYLES[tier];
                      const selected = publishForm.tiers.includes(tier);
                      return (
                        <button
                          key={tier}
                          onClick={() => setPublishForm(f => ({
                            ...f,
                            tiers: f.tiers.includes(tier) ? f.tiers.filter(t => t !== tier) : [...f.tiers, tier]
                          }))}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                            background: selected ? s.bg : 'transparent',
                            borderColor: selected ? s.text : '#3a3a45',
                            color: selected ? s.text : '#6b7280'
                          }}
                        >{s.label}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Enterprise Licensing */}
                <div style={{ background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>🏢 Enterprise Licensing</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Allow companies to white-label or resell your skill in bundles</div>
                    </div>
                    <button
                      onClick={() => setPublishForm(f => ({ ...f, enterpriseLicensing: !f.enterpriseLicensing }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {publishForm.enterpriseLicensing
                        ? <ToggleRight size={28} color="#f59e0b" />
                        : <ToggleLeft size={28} color="#6b7280" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {publishStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '10px', padding: '18px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', marginBottom: '14px' }}>{publishForm.name || 'Untitled Skill'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Category', value: publishForm.category },
                      { label: 'Platforms', value: publishForm.platforms.join(', ') || 'None' },
                      { label: 'Pricing', value:
                        publishForm.pricingModel === 'per_call' ? `$${publishForm.pricePerCall}/call` :
                        publishForm.pricingModel === 'subscription' ? `$${publishForm.subscriptionMonthly}/mo` :
                        `${publishForm.revenueSharePct}% rev share`
                      },
                      { label: 'Surge Pricing', value: publishForm.surgeEnabled ? `✅ Up to ${publishForm.surgeMultiplier}x` : '❌ Disabled' },
                      { label: 'Tiers', value: publishForm.tiers.join(', ') },
                      { label: 'Enterprise', value: publishForm.enterpriseLicensing ? '✅ Enabled' : '❌ Disabled' }
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', color: '#f4f4f5', fontWeight: '600' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  {publishForm.description && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2a2a35' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Description</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5' }}>{publishForm.description}</div>
                    </div>
                  )}
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#6ee7b7', lineHeight: '1.5'
                }}>
                  ✅ Your skill will go live in the marketplace immediately after publishing. SkillLayer handles authentication, metering, billing, and payouts automatically.
                </div>
              </div>
            )}

            {/* Step navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Btn
                variant="secondary"
                onClick={() => publishStep > 1 ? setPublishStep(s => s - 1) : setShowPublishModal(false)}
              >
                {publishStep > 1 ? 'Back' : 'Cancel'}
              </Btn>
              {publishStep < 4 ? (
                <Btn onClick={() => setPublishStep(s => s + 1)} disabled={!canProceed()}>
                  Continue <ChevronDown size={13} style={{ transform: 'rotate(-90deg)' }} />
                </Btn>
              ) : (
                <Btn onClick={onPublish}>
                  <Zap size={13} /> Publish Skill
                </Btn>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// API KEYS VIEW
// ============================================================

export function ApiKeysView({
  apiKeys, skills, onRevoke,
  showGenerateKeyModal, setShowGenerateKeyModal,
  keyForm, setKeyForm, onGenerateKey
}) {
  const [copiedId, setCopiedId] = useState(null);

  function handleCopyKey(key, id) {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function maskKey(key) {
    if (!key || key.length < 12) return key;
    return key.slice(0, 12) + '...' + key.slice(-4);
  }

  const activeKeys = apiKeys.filter(k => k.status === 'active').length;
  const totalSpend = apiKeys.filter(k => k.status === 'active').reduce((s, k) => s + k.monthlySpend, 0);
  const totalCalls = apiKeys.filter(k => k.status === 'active').reduce((s, k) => s + k.callsUsed, 0);

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '28px 32px', background: '#0d0d0f' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>API Keys</h1>
          <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Manage access keys issued to your skill consumers.</p>
        </div>
        <Btn onClick={() => setShowGenerateKeyModal(true)}>
          <Plus size={14} /> Generate New Key
        </Btn>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Active Keys', value: activeKeys.toString(), icon: Key, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
          { label: 'Total Monthly Spend', value: formatMoney(totalSpend), icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
          { label: 'Total Calls Used', value: formatNum(totalCalls), icon: Activity, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' }
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}><Icon size={18} color={stat.color} /></div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#f4f4f5' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px' }}>{stat.label}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Keys Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a35' }}>
                {['API Key', 'Skill', 'Consumer', 'Tier', 'Usage', 'Spend', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', color: '#6b7280', textTransform: 'uppercase',
                    letterSpacing: '0.05em', whiteSpace: 'nowrap', background: '#111116'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key, i) => {
                const pct = Math.min(100, (key.callsUsed / key.callsLimit) * 100);
                const isRevoked = key.status === 'revoked';
                const tierS = TIER_STYLES[key.tier] || TIER_STYLES.free;
                return (
                  <tr
                    key={key.id}
                    style={{
                      borderBottom: i < apiKeys.length - 1 ? '1px solid #1e1e28' : 'none',
                      opacity: isRevoked ? 0.5 : 1,
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => !isRevoked && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <code style={{ fontSize: '12px', color: '#a855f7', fontFamily: 'monospace', background: 'rgba(168,85,247,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                          {maskKey(key.key)}
                        </code>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', color: '#f4f4f5', fontWeight: '600' }}>{key.skillName}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{key.consumerName}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                        borderRadius: '4px', background: tierS.bg, color: tierS.text
                      }}>{tierS.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px', minWidth: '140px' }}>
                      <div style={{ marginBottom: '4px', fontSize: '11px', color: '#a1a1aa' }}>
                        {formatNum(key.callsUsed)} / {formatNum(key.callsLimit)}
                      </div>
                      <div style={{ height: '4px', background: '#2a2a35', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: '2px', transition: 'width 0.3s',
                          width: `${pct}%`,
                          background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#7c3aed'
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{formatMoney(key.monthlySpend)}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                        background: STATUS_STYLES[key.status]?.bg || 'transparent',
                        color: STATUS_STYLES[key.status]?.text || '#a1a1aa'
                      }}>{STATUS_STYLES[key.status]?.label || key.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {!isRevoked && (
                          <>
                            <button
                              onClick={() => handleCopyKey(key.key, key.id)}
                              style={{
                                padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                                cursor: 'pointer', border: '1px solid #3a3a45',
                                background: copiedId === key.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                                color: copiedId === key.id ? '#10b981' : '#a1a1aa', display: 'flex', alignItems: 'center', gap: '3px'
                              }}
                            >
                              {copiedId === key.id ? <Check size={10} /> : <Copy size={10} />}
                            </button>
                            <button
                              onClick={() => onRevoke(key.id)}
                              style={{
                                padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                                cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)',
                                background: 'rgba(239,68,68,0.08)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '3px'
                              }}
                            >
                              <X size={10} /> Revoke
                            </button>
                          </>
                        )}
                        {isRevoked && (
                          <span style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Revoked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Key Modal */}
      {showGenerateKeyModal && (
        <Modal onClose={() => setShowGenerateKeyModal(false)} width="440px">
          <ModalHeader title="Generate New API Key" onClose={() => setShowGenerateKeyModal(false)} />
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Select
              label="Skill"
              value={keyForm.skillId}
              onChange={v => setKeyForm(f => ({ ...f, skillId: v }))}
              options={skills.filter(s => s.isMine).map(s => ({ value: s.id, label: s.name }))}
            />
            <Input
              label="Consumer Name"
              value={keyForm.consumerName}
              onChange={v => setKeyForm(f => ({ ...f, consumerName: v }))}
              placeholder="e.g. Acme Corp"
            />
            <Select
              label="Tier"
              value={keyForm.tier}
              onChange={v => setKeyForm(f => ({ ...f, tier: v }))}
              options={[
                { value: 'free', label: 'Free' },
                { value: 'starter', label: 'Starter' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise' }
              ]}
            />
            <Input
              label="Call Limit"
              type="number"
              value={keyForm.callLimit}
              onChange={v => setKeyForm(f => ({ ...f, callLimit: v }))}
              placeholder="10000"
            />
            <div style={{
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#c4b5fd'
            }}>
              🔑 A unique API key will be generated and can be shared with the consumer. SkillLayer automatically meters usage and bills accordingly.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setShowGenerateKeyModal(false)}>Cancel</Btn>
              <Btn onClick={onGenerateKey} disabled={!keyForm.consumerName.trim()}>
                <Key size={13} /> Generate Key
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// PAYOUTS VIEW
// ============================================================

export function PayoutsView({ payouts, developerProfile }) {
  const [scheduleMode, setScheduleMode] = useState('monthly');

  const totalPaid = payouts.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '28px 32px', background: '#0d0d0f' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f4f4f5', marginBottom: '4px' }}>Payouts</h1>
          <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Automated revenue payouts via Stripe Connect.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            display: 'flex', background: '#1a1a1f', border: '1px solid #2a2a35',
            borderRadius: '8px', padding: '3px'
          }}>
            {['weekly', 'monthly'].map(mode => (
              <button
                key={mode}
                onClick={() => setScheduleMode(mode)}
                style={{
                  padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: scheduleMode === mode ? 'rgba(124,58,237,0.25)' : 'transparent',
                  color: scheduleMode === mode ? '#a855f7' : '#a1a1aa',
                  textTransform: 'capitalize'
                }}
              >{mode}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          {
            label: 'Total Earned', value: formatMoney(developerProfile.totalRevenue),
            icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.12)'
          },
          {
            label: 'Total Paid Out', value: formatMoney(totalPaid),
            icon: CheckCircle, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'
          },
          {
            label: 'Pending Balance', value: formatMoney(pending),
            icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'
          },
          {
            label: 'Stripe Status', value: developerProfile.stripeConnected ? 'Connected' : 'Not Connected',
            icon: CreditCard,
            color: developerProfile.stripeConnected ? '#10b981' : '#ef4444',
            bg: developerProfile.stripeConnected ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
          }
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hoverable style={{ padding: '18px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
              }}><Icon size={16} color={stat.color} /></div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: stat.label === 'Stripe Status' ? stat.color : '#f4f4f5', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Schedule Banner */}
      <div style={{
        background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <CreditCard size={16} color="#a855f7" />
        <span style={{ fontSize: '13px', color: '#c4b5fd' }}>
          Payout schedule set to <strong style={{ color: '#a855f7' }}>{scheduleMode}</strong>.
          Next payout: <strong style={{ color: '#f4f4f5' }}>
            {scheduleMode === 'weekly' ? 'Sunday, Jan 5, 2025' : 'January 31, 2025'}
          </strong>
          {' '}— estimated <strong style={{ color: '#10b981' }}>{formatMoney(pending)}</strong>
        </span>
      </div>

      {/* Payouts Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a35' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5' }}>Payout History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a35' }}>
                {['Period', 'Amount', 'Method', 'Status', 'Date', 'Receipt'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', color: '#6b7280', textTransform: 'uppercase',
                    letterSpacing: '0.05em', background: '#111116'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout, i) => (
                <tr
                  key={payout.id}
                  style={{
                    borderBottom: i < payouts.length - 1 ? '1px solid #1e1e28' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#f4f4f5' }}>{payout.period}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>{formatMoney(payout.amount)}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{payout.method}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                      background: STATUS_STYLES[payout.status]?.bg || 'transparent',
                      color: STATUS_STYLES[payout.status]?.text || '#a1a1aa'
                    }}>{STATUS_STYLES[payout.status]?.label || payout.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#a1a1aa' }}>
                      {payout.processedAt || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {payout.status === 'completed' ? (
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                        cursor: 'pointer', border: '1px solid #3a3a45',
                        background: 'rgba(255,255,255,0.04)', color: '#a1a1aa'
                      }}>
                        <Download size={10} /> PDF
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
