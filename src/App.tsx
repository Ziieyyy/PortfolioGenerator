import React, { useState, useEffect } from 'react'
import './App.css'
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Layout,
  LogOut,
  Mail,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  Check,
  CheckCircle,
  Eye,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  LayoutGrid,
  CreditCard,
  Settings,
  Shield,
  Bell,
  Inbox,
  AlertTriangle
} from 'lucide-react'
import { supabase } from './supabase'

// Custom SVG components for Github and Linkedin to prevent package version mismatches
const Github = ({ size = 20 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Types for Portfolio Data
interface ExperienceItem {
  id: string
  company: string
  role: string
  duration: string
  description: string
}

interface EducationItem {
  id: string
  institution: string
  degree: string
  duration: string
  description: string
}

interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string
  githubUrl: string
  liveUrl: string
}

interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
}

interface AwardItem {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

interface PortfolioData {
  name: string
  avatarUrl?: string
  title: string
  university: string
  degree: string
  graduationYear: string
  location: string
  bio: string
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  awards?: AwardItem[]
  contact: {
    email: string
    linkedin: string
    github: string
    phone?: string
    behance?: string
    dribbble?: string
    instagram?: string
    x?: string
    facebook?: string
    website?: string
  }
  industry?: string
}

const emptyPortfolio: PortfolioData = {
  name: '',
  avatarUrl: '',
  title: '',
  university: '',
  degree: '',
  graduationYear: '',
  location: '',
  bio: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  awards: [],
  contact: {
    email: '',
    linkedin: '',
    github: '',
    phone: '',
    behance: '',
    dribbble: '',
    instagram: '',
    x: '',
    facebook: '',
    website: ''
  },
  industry: 'Auto-Detect'
}

interface IndustryConfig {
  industry: string;
  projectsTitle: string;
  experienceTitle: string;
  skillsTitle: string;
  educationTitle: string;
  contactTitle: string;
  accentColor: string;
}

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  Developer: {
    industry: 'Developer',
    projectsTitle: 'Featured Projects',
    experienceTitle: 'Technical Experience',
    skillsTitle: 'Languages & Frameworks',
    educationTitle: 'Education & Academics',
    contactTitle: 'Get in Touch',
    accentColor: '#34D399' // Emerald
  },
  Designer: {
    industry: 'Designer',
    projectsTitle: 'Creative Showcase',
    experienceTitle: 'Design Experience',
    skillsTitle: 'Design Tools & Expertise',
    educationTitle: 'Education',
    contactTitle: 'Let\'s Collaborate',
    accentColor: '#F59E0B' // Amber
  },
  Photographer: {
    industry: 'Photographer',
    projectsTitle: 'Selected Galleries',
    experienceTitle: 'Professional Projects',
    skillsTitle: 'Equipment & Techniques',
    educationTitle: 'Education',
    contactTitle: 'Book a Shoot',
    accentColor: '#EC4899' // Pink
  },
  Researcher: {
    industry: 'Researcher',
    projectsTitle: 'Research Publications',
    experienceTitle: 'Academic & Research History',
    skillsTitle: 'Methodologies & Tools',
    educationTitle: 'Academic Background',
    contactTitle: 'Connect',
    accentColor: '#3B82F6' // Blue
  },
  Marketing: {
    industry: 'Marketing',
    projectsTitle: 'Campaigns & Case Studies',
    experienceTitle: 'Professional Experience',
    skillsTitle: 'Marketing Channels & Stack',
    educationTitle: 'Education',
    contactTitle: 'Work With Me',
    accentColor: '#EF4444' // Red
  },
  Consultant: {
    industry: 'Consultant',
    projectsTitle: 'Advisory Highlights',
    experienceTitle: 'Consulting History',
    skillsTitle: 'Core Capabilities',
    educationTitle: 'Education',
    contactTitle: 'Schedule Consultation',
    accentColor: '#8B5CF6' // Purple
  },
  Agency: {
    industry: 'Agency',
    projectsTitle: 'Case Studies',
    experienceTitle: 'Agency History',
    skillsTitle: 'Services & Offerings',
    educationTitle: 'Education',
    contactTitle: 'Partner With Us',
    accentColor: '#06B6D4' // Cyan
  },
  Business: {
    industry: 'Business',
    projectsTitle: 'Portfolio Highlights',
    experienceTitle: 'Professional Experience',
    skillsTitle: 'Leadership & Competencies',
    educationTitle: 'Education',
    contactTitle: 'Inquiries',
    accentColor: '#1E3A8A' // Deep Blue
  },
  Student: {
    industry: 'Student',
    projectsTitle: 'Academic Projects',
    experienceTitle: 'Internships & Projects',
    skillsTitle: 'Skills & Stack',
    educationTitle: 'Education',
    contactTitle: 'Contact Me',
    accentColor: '#9AB17A' // Sage
  }
};

const detectUserType = (data: PortfolioData): string => {
  if (data.industry && data.industry !== 'Auto-Detect') {
    return data.industry;
  }
  const text = `${data.title} ${data.bio} ${data.degree} ${data.university}`.toLowerCase();
  if (text.includes('developer') || text.includes('engineer') || text.includes('programmer') || text.includes('coding') || text.includes('software') || text.includes('computer science')) return 'Developer';
  if (text.includes('design') || text.includes('artist') || text.includes('creative') || text.includes('illustrator') || text.includes('ux') || text.includes('ui') || text.includes('graphic')) return 'Designer';
  if (text.includes('photographer') || text.includes('photography') || text.includes('video') || text.includes('photo')) return 'Photographer';
  if (text.includes('research') || text.includes('scientist') || text.includes('academic') || text.includes('phd') || text.includes('publication') || text.includes('journal')) return 'Researcher';
  if (text.includes('marketing') || text.includes('seo') || text.includes('social media') || text.includes('growth') || text.includes('advertising')) return 'Marketing';
  if (text.includes('consultant') || text.includes('consulting') || text.includes('advisor')) return 'Consultant';
  if (text.includes('agency') || text.includes('studio') || text.includes('firm')) return 'Agency';
  if (text.includes('business') || text.includes('manager') || text.includes('mba') || text.includes('finance') || text.includes('founder') || text.includes('startup') || text.includes('management')) return 'Business';
  if (text.includes('student') || text.includes('undergrad') || text.includes('university') || text.includes('college')) return 'Student';
  return 'Student'; // Default
};

const SocialIcon = ({ type, size = 18 }: { type: string; size?: number }) => {
  const t = type.toLowerCase();
  if (t === 'email') return <Mail size={size} />;
  if (t === 'linkedin') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    );
  }
  if (t === 'github') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    );
  }
  if (t === 'behance') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12H2m9-6H2m9 12H2M16 6h6v12h-6zM19 12v3"></path>
      </svg>
    );
  }
  if (t === 'dribbble') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.49-11.05 1-11.6 8.56"></path>
      </svg>
    );
  }
  if (t === 'instagram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (t === 'x') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
      </svg>
    );
  }
  if (t === 'facebook') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    );
  }
  if (t === 'website') {
    return <Globe size={size} />;
  }
  return <Globe size={size} />;
};

const formatExternalUrl = (url: string) => {
  if (!url) return '';
  const clean = url.trim();
  if (/^https?:\/\//i.test(clean)) return clean;
  if (/^mailto:/i.test(clean)) return clean;
  if (/^tel:/i.test(clean)) return clean;
  return `https://${clean}`;
};

const calculateDurationString = (startStr: string, endStr: string) => {
  const parseDate = (str: string) => {
    if (!str) return null;
    const cleanStr = str.trim().toLowerCase();
    if (cleanStr.includes('present') || cleanStr.includes('current') || cleanStr.includes('now')) {
      return new Date();
    }
    const parts = cleanStr.split(/\s+/);
    if (parts.length === 1) {
      const yr = parseInt(parts[0]);
      if (isNaN(yr)) return null;
      return new Date(yr, 0, 1);
    }
    const monthStr = parts[0];
    const yearStr = parts[1];
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let monthIdx = months.findIndex(m => monthStr.startsWith(m));
    if (monthIdx === -1) {
      monthIdx = parseInt(monthStr) - 1;
    }
    const yearVal = parseInt(yearStr);
    if (monthIdx === -1 || isNaN(yearVal)) return null;
    return new Date(yearVal, monthIdx, 1);
  };

  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (!start || !end) return '';

  let diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (diffMonths < 0) diffMonths = 0;
  
  // Include start month in calculations (e.g. Jan 2024 to Jan 2024 is 1 month)
  diffMonths += 1;

  const yrs = Math.floor(diffMonths / 12);
  const mos = diffMonths % 12;

  const yrPart = yrs > 0 ? `${yrs} yr${yrs > 1 ? 's' : ''}` : '';
  const moPart = mos > 0 ? `${mos} mo${mos > 1 ? 's' : ''}` : '';
  
  return [yrPart, moPart].filter(Boolean).join(' ') || '1 mo';
};

interface PortfolioRendererProps {
  portfolioData: PortfolioData;
  activeTheme: string;
  isPreviewMode?: boolean;
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ portfolioData, activeTheme, isPreviewMode = false }) => {
  const industry = detectUserType(portfolioData);
  const indConfig = INDUSTRY_CONFIGS[industry] || INDUSTRY_CONFIGS.Student;

  const renderSocials = (contact: PortfolioData['contact'], colorClass: string = '', inlineStyle: React.CSSProperties = {}) => {
    const links = [
      { name: 'email', value: contact.email, label: 'Email', prefix: 'mailto:' },
      { name: 'phone', value: contact.phone, label: 'Phone', prefix: 'tel:' },
      { name: 'website', value: contact.website, label: 'Website', prefix: '' },
      { name: 'linkedin', value: contact.linkedin, label: 'LinkedIn', prefix: '' },
      { name: 'github', value: contact.github, label: 'GitHub', prefix: '' },
      { name: 'behance', value: contact.behance, label: 'Behance', prefix: '' },
      { name: 'dribbble', value: contact.dribbble, label: 'Dribbble', prefix: '' },
      { name: 'instagram', value: contact.instagram, label: 'Instagram', prefix: '' },
      { name: 'x', value: contact.x, label: 'X', prefix: '' },
      { name: 'facebook', value: contact.facebook, label: 'Facebook', prefix: '' }
    ];

    const activeLinks = links.filter(l => l.value && l.value.trim() !== '');
    if (activeLinks.length === 0) return null;

    return (
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', ...inlineStyle }}>
        {activeLinks.map(l => {
          let href = l.value!;
          if (l.name === 'email' && !href.startsWith('mailto:')) {
            href = 'mailto:' + href;
          } else if (l.name === 'phone' && !href.startsWith('tel:')) {
            href = 'tel:' + href;
          } else {
            href = formatExternalUrl(href);
          }
          return (
            <a 
              key={l.name} 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={colorClass}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.85rem', 
                fontWeight: 500, 
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255,255,255,0.6)',
                textDecoration: 'none', 
                transition: 'all 0.2s ease'
              }}
            >
              <SocialIcon type={l.name} size={14} />
              <span>{l.label}</span>
            </a>
          );
        })}
      </div>
    );
  };

  const renderSkills = (skills: string[], themeType: string) => {
    if (!skills || skills.length === 0) return null;

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
        {skills.map((s, i) => (
          <span 
            key={i} 
            style={{ 
              padding: '6px 12px', 
              background: themeType === 'modern' ? 'rgba(255,255,255,0.05)' : 'var(--primary-light)',
              color: themeType === 'modern' ? '#FFF' : indConfig.accentColor,
              border: '1px solid rgba(0,0,0,0.02)',
              borderRadius: '20px', 
              fontSize: '0.85rem', 
              fontWeight: 500 
            }}
          >
            {s}
          </span>
        ))}
      </div>
    );
  };

  const renderExperienceList = (experience: ExperienceItem[], themeType: string) => {
    if (!experience || experience.length === 0) return null;

    return (
      <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: `2px solid ${themeType === 'modern' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, margin: '20px 0 10px 8px' }}>
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: '30px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '-31px',
              top: '4px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: themeType === 'modern' ? '#34D399' : indConfig.accentColor,
              border: `3px solid ${themeType === 'modern' ? '#111827' : '#FFF'}`
            }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: themeType === 'modern' ? '#FFF' : '#1A1A1A' }}>
                {exp.role} <span style={{ fontWeight: 400, color: '#888', fontSize: '0.9rem' }}>at {exp.company}</span>
              </h4>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                {(() => {
                  const parts = exp.duration.split('-');
                  const durStr = parts.length === 2 ? calculateDurationString(parts[0], parts[1]) : '';
                  return durStr ? `${exp.duration} (${durStr})` : exp.duration;
                })()}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', marginTop: '6px', color: themeType === 'modern' ? '#9CA3AF' : '#555', lineHeight: '1.5' }}>
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderStats = (themeType: string) => {
    const stats = [
      { label: indConfig.projectsTitle, value: portfolioData.projects.length },
      { label: 'Experiences', value: portfolioData.experience.length },
      { label: 'Certifications', value: portfolioData.certifications.length },
      { label: 'Awards', value: portfolioData.awards?.length || 0 },
    ].filter(s => s.value > 0);

    if (stats.length === 0) return null;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        gap: '16px',
        margin: '30px 0',
        width: '100%'
      }} className="grid-responsive-stats">
        {stats.map((s, i) => (
          <div 
            key={i} 
            style={{
              background: themeType === 'modern' ? 'rgba(255,255,255,0.03)' : themeType === 'creative' ? '#FFF' : '#FFF',
              border: themeType === 'creative' ? '3px solid #3C2F2F' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: themeType === 'creative' ? '4px 4px 0px #3C2F2F' : '0 2px 8px rgba(0,0,0,0.02)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 800, 
              color: themeType === 'modern' ? '#34D399' : indConfig.accentColor,
              lineHeight: '1.2'
            }}>
              {s.value}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              color: themeType === 'modern' ? '#9CA3AF' : '#666',
              marginTop: '4px',
              letterSpacing: '0.05em'
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 1. MINIMAL THEME CONTENT
  const renderMinimal = () => (
    <div className="theme-preview-minimal" style={{ padding: isPreviewMode ? '20px 12px' : '40px 24px', background: '#FFF' }}>
      <div className="theme-hero" style={{ 
        padding: '40px 0', 
        borderBottom: '1px solid #ECECEC', 
        display: 'flex', 
        flexDirection: portfolioData.avatarUrl ? 'row' : 'column',
        alignItems: 'center', 
        gap: '32px',
        justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center',
        textAlign: portfolioData.avatarUrl ? 'left' : 'center'
      }}>
        {portfolioData.avatarUrl && (
          <div style={{ flexShrink: 0 }}>
            <img 
              src={portfolioData.avatarUrl} 
              alt={portfolioData.name} 
              style={{ 
                width: '130px', 
                height: '130px', 
                borderRadius: '16px', 
                objectFit: 'cover',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }} 
            />
          </div>
        )}
        <div style={{ flex: 1, maxWidth: '650px' }}>
          <h1 style={{ fontWeight: 700, fontSize: '2.4rem', color: '#111', lineHeight: '1.15' }}>
            {portfolioData.name || 'Your Name'}
          </h1>
          {portfolioData.title && (
            <p style={{ fontSize: '1.15rem', color: '#555', marginTop: '8px', fontWeight: 500 }}>
              {portfolioData.title}
            </p>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center', fontSize: '0.85rem', color: '#777', marginTop: '12px' }}>
            {portfolioData.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {portfolioData.location}
              </span>
            )}
            {portfolioData.location && portfolioData.university && <span>•</span>}
            {portfolioData.university && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={12} /> {portfolioData.university}
              </span>
            )}
          </div>
          {renderSocials(portfolioData.contact, '', { marginTop: '20px', justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center' })}
        </div>
      </div>

      {renderStats('minimal')}

      {portfolioData.bio && (
        <div id="about" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '14px' }}>
            About
          </div>
          <p style={{ fontSize: '1rem', color: '#333', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {portfolioData.bio}
          </p>
        </div>
      )}

      {portfolioData.skills && portfolioData.skills.length > 0 && (
        <div id="skills" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '14px' }}>
            {indConfig.skillsTitle}
          </div>
          {renderSkills(portfolioData.skills, 'minimal')}
        </div>
      )}

      {portfolioData.projects && portfolioData.projects.length > 0 && (
        <div id="projects" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '20px' }}>
            {indConfig.projectsTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {portfolioData.projects.map((proj) => (
              <div key={proj.id} style={{ borderBottom: '1px solid #F0F0F0', paddingBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1A1A1A' }}>{proj.name}</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.githubUrl && <a href={formatExternalUrl(proj.githubUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={14} /> Code</a>}
                    {proj.liveUrl && <a href={formatExternalUrl(proj.liveUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={14} /> Demo</a>}
                  </div>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#555', margin: '8px 0 12px 0', lineHeight: 1.6 }}>{proj.description}</p>
                {proj.technologies && (
                  <div style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                    Built with: <span style={{ color: '#444' }}>{proj.technologies}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {portfolioData.experience && portfolioData.experience.length > 0 && (
        <div id="experience" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '20px' }}>
            {indConfig.experienceTitle}
          </div>
          {renderExperienceList(portfolioData.experience, 'minimal')}
        </div>
      )}

      {portfolioData.education && portfolioData.education.length > 0 && (
        <div id="education" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '20px' }}>
            {indConfig.educationTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {portfolioData.education.map(edu => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{edu.degree}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#777' }}>{edu.duration}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#555', margin: '4px 0' }}>{edu.institution}</div>
                {edu.description && <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {portfolioData.certifications && portfolioData.certifications.length > 0 && (
        <div id="certifications" style={{ margin: '40px 0' }}>
          <div className="section-title" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: indConfig.accentColor, fontWeight: 700, marginBottom: '20px' }}>
            Certifications
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {portfolioData.certifications.map(cert => (
              <div key={cert.id} style={{ border: '1px solid #ECECEC', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{cert.name}</h4>
                <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '4px' }}>{cert.issuer}</div>
                <div style={{ fontSize: '0.78rem', color: '#999', marginTop: '2px' }}>Issued: {cert.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 2. PROFESSIONAL THEME CONTENT
  const renderProfessional = () => (
    <div className="theme-preview-professional" style={{ padding: isPreviewMode ? '24px 16px' : '48px 32px', background: '#F7FAFC' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ background: '#1A365D', color: '#FFF', padding: '40px', display: 'flex', flexDirection: portfolioData.avatarUrl ? 'row' : 'column', alignItems: 'center', gap: '32px' }}>
          {portfolioData.avatarUrl && (
            <img 
              src={portfolioData.avatarUrl} 
              alt={portfolioData.name} 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.2)', objectFit: 'cover' }} 
            />
          )}
          <div style={{ textAlign: portfolioData.avatarUrl ? 'left' : 'center', flex: 1 }}>
            <h1 style={{ color: '#FFF', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{portfolioData.name || 'Your Name'}</h1>
            <p style={{ color: '#90CDF4', fontSize: '1.2rem', margin: '8px 0 0 0', fontWeight: 500 }}>{portfolioData.title}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center', marginTop: '16px', fontSize: '0.85rem', color: '#E2E8F0' }}>
              {portfolioData.location && <span>{portfolioData.location}</span>}
              {portfolioData.university && <span>• {portfolioData.university}</span>}
            </div>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {renderStats('professional')}

          {portfolioData.bio && (
            <div id="about" style={{ marginBottom: '32px' }}>
              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', color: '#1A365D', fontWeight: 700 }}>Profile Summary</h3>
              <p style={{ fontSize: '0.95rem', color: '#4A5568', lineHeight: 1.7, marginTop: '12px' }}>{portfolioData.bio}</p>
            </div>
          )}

          {portfolioData.skills && portfolioData.skills.length > 0 && (
            <div id="skills" style={{ marginBottom: '32px' }}>
              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', color: '#1A365D', fontWeight: 700 }}>Key Competencies</h3>
              {renderSkills(portfolioData.skills, 'professional')}
            </div>
          )}

          {portfolioData.projects && portfolioData.projects.length > 0 && (
            <div id="projects" style={{ marginBottom: '32px' }}>
              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', color: '#1A365D', fontWeight: 700 }}>Project Case Studies</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
                {portfolioData.projects.map(proj => (
                  <div key={proj.id} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px', background: '#F8FAFC' }}>
                    <h4 style={{ color: '#2C5282', fontSize: '1.1rem', fontWeight: 700 }}>{proj.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#4A5568', margin: '8px 0', lineHeight: 1.5 }}>{proj.description}</p>
                    {proj.technologies && <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '12px' }}>Stack: {proj.technologies}</div>}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {proj.githubUrl && <a href={formatExternalUrl(proj.githubUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#3182CE', fontWeight: 600 }}>GitHub Code</a>}
                      {proj.liveUrl && <a href={formatExternalUrl(proj.liveUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#3182CE', fontWeight: 600 }}>Live URL</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portfolioData.experience && portfolioData.experience.length > 0 && (
            <div id="experience" style={{ marginBottom: '32px' }}>
              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', color: '#1A365D', fontWeight: 700 }}>Experience</h3>
              {renderExperienceList(portfolioData.experience, 'professional')}
            </div>
          )}

          {portfolioData.education && portfolioData.education.length > 0 && (
            <div id="education" style={{ marginBottom: '32px' }}>
              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '8px', color: '#1A365D', fontWeight: 700 }}>Education</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                {portfolioData.education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#2D3748' }}>
                      <span>{edu.degree}</span>
                      <span>{edu.duration}</span>
                    </div>
                    <div style={{ color: '#4A5568', fontSize: '0.9rem' }}>{edu.institution}</div>
                    {edu.description && <p style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 3. MODERN DARK THEME CONTENT
  const renderModern = () => (
    <div className="theme-preview-modern" style={{ padding: isPreviewMode ? '24px 16px' : '60px 40px', background: '#111827', color: '#F3F4F6' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: portfolioData.avatarUrl ? 'row' : 'column', alignItems: 'center', gap: '32px', marginBottom: '48px', textAlign: portfolioData.avatarUrl ? 'left' : 'center' }}>
          {portfolioData.avatarUrl && (
            <img 
              src={portfolioData.avatarUrl} 
              alt={portfolioData.name} 
              style={{ width: '140px', height: '140px', borderRadius: '24px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.1)', color: '#34D399', padding: '6px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', background: '#34D399', borderRadius: '50%' }}></span>
              OPEN TO OFFERS
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#FFF', margin: 0 }}>{portfolioData.name || 'Your Name'}</h1>
            <p style={{ fontSize: '1.25rem', color: '#9CA3AF', marginTop: '8px' }}>{portfolioData.title}</p>
            {renderSocials(portfolioData.contact, '', { marginTop: '20px', justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center' })}
          </div>
        </div>

        {renderStats('modern')}

        {portfolioData.bio && (
          <div id="about" style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Biography</h3>
            <p style={{ fontSize: '0.98rem', color: '#D1D5DB', lineHeight: 1.7 }}>{portfolioData.bio}</p>
          </div>
        )}

        {portfolioData.skills && portfolioData.skills.length > 0 && (
          <div id="skills" style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Tech Stack</h3>
            {renderSkills(portfolioData.skills, 'modern')}
          </div>
        )}

        {portfolioData.projects && portfolioData.projects.length > 0 && (
          <div id="projects" style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Featured Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {portfolioData.projects.map(proj => (
                <div key={proj.id} style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '12px', padding: '24px', transition: 'all 0.3s ease' }}>
                  <h4 style={{ color: '#FFF', fontSize: '1.1rem' }}>{proj.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: '12px 0', lineHeight: 1.6 }}>{proj.description}</p>
                  {proj.technologies && <div style={{ fontSize: '0.75rem', color: '#34D399', marginBottom: '16px' }}>{proj.technologies}</div>}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {proj.githubUrl && <a href={formatExternalUrl(proj.githubUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#FFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={12} /> Code</a>}
                    {proj.liveUrl && <a href={formatExternalUrl(proj.liveUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#34D399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={12} /> Live Link</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {portfolioData.experience && portfolioData.experience.length > 0 && (
          <div id="experience" style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Experience History</h3>
            {renderExperienceList(portfolioData.experience, 'modern')}
          </div>
        )}
      </div>
    </div>
  );

  // 4. CREATIVE DESIGNER THEME CONTENT
  const renderCreative = () => (
    <div className="theme-preview-creative" style={{ padding: isPreviewMode ? '24px 16px' : '80px 40px', background: '#FDF6EC', color: '#3C2F2F' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: portfolioData.avatarUrl ? 'row' : 'column', alignItems: 'center', gap: '40px', marginBottom: '60px' }}>
          {portfolioData.avatarUrl && (
            <img 
              src={portfolioData.avatarUrl} 
              alt={portfolioData.name} 
              className="blob-shape"
              style={{ width: '160px', height: '160px', objectFit: 'cover', border: '3px solid #3C2F2F', boxShadow: '4px 4px 0px #3C2F2F' }} 
            />
          )}
          <div style={{ flex: 1, textAlign: portfolioData.avatarUrl ? 'left' : 'center' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#C85A17', letterSpacing: '-0.02em', margin: 0 }}>{portfolioData.name || 'Your Name'}</h1>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#D97706', marginTop: '12px' }}>{portfolioData.title}</p>
            {renderSocials(portfolioData.contact, 'creative-btn', { marginTop: '20px', justifyContent: portfolioData.avatarUrl ? 'flex-start' : 'center' })}
          </div>
        </div>

        {renderStats('creative')}

        {portfolioData.bio && (
          <div id="about" style={{ marginBottom: '40px' }}>
            <h2 className="section-title">Hello there!</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, background: '#FFF', border: '3px solid #3C2F2F', boxShadow: '4px 4px 0 #3C2F2F', padding: '24px', borderRadius: '8px' }}>{portfolioData.bio}</p>
          </div>
        )}

        {portfolioData.skills && portfolioData.skills.length > 0 && (
          <div id="skills" style={{ marginBottom: '40px' }}>
            <h2 className="section-title">My Toolbox</h2>
            {renderSkills(portfolioData.skills, 'creative')}
          </div>
        )}

        {portfolioData.projects && portfolioData.projects.length > 0 && (
          <div id="projects" style={{ marginBottom: '40px' }}>
            <h2 className="section-title">Selected Works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {portfolioData.projects.map(proj => (
                <div key={proj.id} className="creative-card">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C85A17' }}>{proj.name}</h3>
                  <p style={{ fontSize: '0.95rem', margin: '12px 0', lineHeight: 1.6 }}>{proj.description}</p>
                  {proj.technologies && <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 600 }}>Built with: {proj.technologies}</div>}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    {proj.githubUrl && <a href={formatExternalUrl(proj.githubUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3C2F2F', textDecoration: 'underline' }}>Source Code</a>}
                    {proj.liveUrl && <a href={formatExternalUrl(proj.liveUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3C2F2F', textDecoration: 'underline' }}>Live Project</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  let themeContent = null;
  if (activeTheme === 'minimal') {
    themeContent = renderMinimal();
  } else if (activeTheme === 'professional') {
    themeContent = renderProfessional();
  } else if (activeTheme === 'modern') {
    themeContent = renderModern();
  } else if (activeTheme === 'creative') {
    themeContent = renderCreative();
  }

  if (!themeContent) return null;

  // Header & Footer styling based on theme
  const sections = [
    { id: 'about', label: 'About', show: !!portfolioData.bio },
    { id: 'skills', label: 'Skills', show: portfolioData.skills && portfolioData.skills.length > 0 },
    { id: 'projects', label: 'Projects', show: portfolioData.projects && portfolioData.projects.length > 0 },
    { id: 'experience', label: 'Experience', show: portfolioData.experience && portfolioData.experience.length > 0 },
    { id: 'education', label: 'Education', show: portfolioData.education && portfolioData.education.length > 0 },
    { id: 'certifications', label: 'Certifications', show: portfolioData.certifications && portfolioData.certifications.length > 0 }
  ].filter(s => s.show);

  let wrapperStyle: React.CSSProperties = {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    scrollBehavior: 'smooth',
    background: '#FFF',
    color: '#1A1A1A'
  };

  let headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #ECECEC',
    transition: 'all 0.3s ease'
  };

  let logoStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#1A1A1A',
    textDecoration: 'none',
    letterSpacing: '-0.02em'
  };

  let navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isActive ? 'var(--primary)' : '#555',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  });

  let ctaStyle: React.CSSProperties = {
    background: 'var(--primary)',
    color: '#FFF',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(154, 177, 122, 0.2)',
    transition: 'all 0.2s ease'
  };

  let footerStyle: React.CSSProperties = {
    background: '#FAF9F6',
    borderTop: '1px solid #ECECEC',
    padding: '40px 40px 32px',
    textAlign: 'center',
    color: '#666',
    fontSize: '0.88rem'
  };

  if (activeTheme === 'professional') {
    wrapperStyle = {
      ...wrapperStyle,
      background: '#F7FAFC',
      color: '#2D3748'
    };
    headerStyle = {
      ...headerStyle,
      background: 'rgba(26, 54, 93, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#FFF'
    };
    logoStyle = {
      ...logoStyle,
      color: '#FFF'
    };
    navLinkStyle = (isActive: boolean): React.CSSProperties => ({
      fontSize: '0.9rem',
      fontWeight: 600,
      color: isActive ? '#90CDF4' : '#E2E8F0',
      textDecoration: 'none',
      cursor: 'pointer'
    });
    ctaStyle = {
      background: '#3182CE',
      color: '#FFF',
      padding: '8px 20px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 700,
      textDecoration: 'none'
    };
    footerStyle = {
      background: '#1A365D',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '40px 40px 32px',
      textAlign: 'center',
      color: '#E2E8F0'
    };
  } else if (activeTheme === 'modern') {
    wrapperStyle = {
      ...wrapperStyle,
      background: '#111827',
      color: '#F3F4F6'
    };
    headerStyle = {
      ...headerStyle,
      background: 'rgba(17, 24, 39, 0.95)',
      borderBottom: '1px solid #374151',
      color: '#FFF'
    };
    logoStyle = {
      ...logoStyle,
      color: '#FFF'
    };
    navLinkStyle = (isActive: boolean): React.CSSProperties => ({
      fontSize: '0.9rem',
      fontWeight: 600,
      color: isActive ? '#34D399' : '#9CA3AF',
      textDecoration: 'none',
      cursor: 'pointer'
    });
    ctaStyle = {
      background: '#34D399',
      color: '#111827',
      padding: '8px 20px',
      borderRadius: '99px',
      fontSize: '0.85rem',
      fontWeight: 700,
      textDecoration: 'none'
    };
    footerStyle = {
      background: '#0B0F19',
      borderTop: '1px solid #374151',
      padding: '40px 40px 32px',
      textAlign: 'center',
      color: '#9CA3AF'
    };
  } else if (activeTheme === 'creative') {
    wrapperStyle = {
      ...wrapperStyle,
      background: '#FDF6EC',
      color: '#3C2F2F'
    };
    headerStyle = {
      ...headerStyle,
      background: '#FDF6EC',
      borderBottom: '3px solid #3C2F2F',
      color: '#3C2F2F'
    };
    logoStyle = {
      ...logoStyle,
      color: '#C85A17',
      fontWeight: 900
    };
    navLinkStyle = (isActive: boolean): React.CSSProperties => ({
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#3C2F2F',
      textDecoration: 'none',
      cursor: 'pointer'
    });
    ctaStyle = {
      background: '#D97706',
      color: '#FFF',
      padding: '8px 20px',
      border: '2px solid #3C2F2F',
      boxShadow: '3px 3px 0px #3C2F2F',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 800,
      textDecoration: 'none'
    };
    footerStyle = {
      background: '#FAF0E3',
      borderTop: '3px solid #3C2F2F',
      padding: '40px 40px 32px',
      textAlign: 'center',
      color: '#3C2F2F'
    };
  }

  return (
    <div style={wrapperStyle}>
      <header style={headerStyle}>
        <a href="#" style={logoStyle}>
          {portfolioData.name || 'Portfolio'}
        </a>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={navLinkStyle(false)}>
              {s.label}
            </a>
          ))}
          {portfolioData.contact.email && (
            <a href={`mailto:${portfolioData.contact.email}`} style={ctaStyle}>
              Hire Me
            </a>
          )}
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {themeContent}
      </main>

      <footer style={footerStyle}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
          {portfolioData.name || 'Portfolio'}
        </div>
        {portfolioData.title && (
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '16px' }}>
            {portfolioData.title}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          {renderSocials(portfolioData.contact, '', { justifyContent: 'center' })}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} {portfolioData.name || 'Portfolio'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  // Page Routing State
  const [currentPage, setCurrentPage] = useState<string>('landing') // 'landing' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email' | 'account-recovery' | 'onboarding' | 'dashboard' | 'editor' | 'billing' | 'settings' | 'admin' | 'checkout' | 'published'
  
  // Auth state
  const [session, setSession] = useState<any>(null)
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [userPlan, setUserPlan] = useState<string>('Free') // 'Free' | 'Pro' | 'Business'
  const [userType, setUserType] = useState<string>('Student')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [verificationSent, setVerificationSent] = useState<boolean>(false)
  const [recoveryAnswers, setRecoveryAnswers] = useState({ q1: '', q2: '' })
  const [adminUsers, setAdminUsers] = useState<any[]>([])

  // Onboarding Wizard State
  const [onboardingStep, setOnboardingStep] = useState<number>(2) // 2: Persona, 3: Basic, 4: Setup, 5: Publish Preview
  const [onboardingName, setOnboardingName] = useState<string>('')
  const [onboardingTitle, setOnboardingTitle] = useState<string>('')
  const [onboardingUniversity, setOnboardingUniversity] = useState<string>('')
  const [onboardingDegree, setOnboardingDegree] = useState<string>('')
  const [onboardingGradYear, setOnboardingGradYear] = useState<string>('2027')
  const [onboardingLocation, setOnboardingLocation] = useState<string>('')
  const [onboardingSkills, setOnboardingSkills] = useState<string>('')
  const [onboardingTheme, setOnboardingTheme] = useState<string>('minimal')
  const [uploadedResumeName, setUploadedResumeName] = useState<string>('')
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false)

  // Settings sub-tab state
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('profile')
  // Admin sub-tab state
  const [activeAdminTab, setActiveAdminTab] = useState<string>('users')

  // Custom Domain Name State
  const [customDomain, setCustomDomain] = useState<string>('')
  const [customDomainStatus, setCustomDomainStatus] = useState<string>('unconfigured')
  const [isVerifyingDomain, setIsVerifyingDomain] = useState<boolean>(false)

  // Portfolio Slug state
  const [portfolioSlug, setPortfolioSlug] = useState<string>('')
  const [slugAvailability, setSlugAvailability] = useState<'empty' | 'too-short' | 'checking' | 'available' | 'reserved' | 'profane' | 'duplicate'>('empty')
  const [slugError, setSlugError] = useState<string>('')
  const [portfolioStatus, setPortfolioStatus] = useState<'Draft' | 'Published'>('Draft')

  // Recent Activity Log
  const [recentActivities, setRecentActivities] = useState<Array<{ id: string; action: string; time: string; type: 'info' | 'success' | 'warning' }>>([])

  // Notifications State
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; type: string; time: string; read: boolean }>>([])
  const [showNotifications, setShowNotifications] = useState<boolean>(false)

  // Upgrade Trigger state
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false)
  const [upgradeTriggerText, setUpgradeTriggerText] = useState<string>('')

  // Checkout Flow State
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<string>('Pro')
  const [checkoutStep, setCheckoutStep] = useState<number>(1)
  const [billingInfo, setBillingInfo] = useState({ name: '', address: '', city: '', zip: '', country: 'Malaysia' })
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvc: '' })
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)

  // Loading & Error Fallbacks
  const [simulateLoading, setSimulateLoading] = useState<boolean>(false)
  const [simulateError, setSimulateError] = useState<boolean>(false)

  const [projectsLoadState, setProjectsLoadState] = useState<'loading' | 'empty' | 'populated' | 'error'>('empty')
  const [experienceLoadState, setExperienceLoadState] = useState<'loading' | 'empty' | 'populated' | 'error'>('empty')
  const [educationLoadState, setEducationLoadState] = useState<'loading' | 'empty' | 'populated' | 'error'>('empty')
  const [certificationsLoadState, setCertificationsLoadState] = useState<'loading' | 'empty' | 'populated' | 'error'>('empty')
  const [analyticsLoadState, setAnalyticsLoadState] = useState<'loading' | 'empty' | 'populated' | 'error'>('empty')

  // File Upload states
  const [uploadingFileType, setUploadingFileType] = useState<'avatar' | 'resume' | 'project' | 'cert' | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadError, setUploadError] = useState<string>('')

  // Rate Limiting Simulator
  const [requestCount, setRequestCount] = useState<number>(0)
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false)

  // Portfolio Data State
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(emptyPortfolio)
  const [activeTheme, setActiveTheme] = useState<string>('minimal')
  const [viewportMode, setViewportMode] = useState<string>('desktop')
  const [isPreviewExpanded, setIsPreviewExpanded] = useState<boolean>(false)

  // Analytics State
  const [analytics, setAnalytics] = useState({
    views: 0,
    uniqueVisitors: 0,
    downloads: 0,
    clicks: 0,
    topProjects: {} as Record<string, number>,
    sources: { Direct: 10, LinkedIn: 5, GitHub: 3, Search: 2 }
  })

  // Auth State Listener
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserLoggedIn(true);
        setUserEmail(session.user.email || '');
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        setUserLoggedIn(true);
        setUserEmail(session.user.email || '');
        fetchUserData(session.user.id);
      } else {
        setUserLoggedIn(false);
        setUserEmail('');
        setPortfolioData(emptyPortfolio);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Database Data for current user
  const fetchUserData = async (userId: string) => {
    if (!supabase) return;
    if (userId === '00000000-0000-0000-0000-000000000000') return;
    setSimulateLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // 2. Fetch Projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      // 3. Fetch Experience
      const { data: experience } = await supabase
        .from('experience')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      // 4. Fetch Education
      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      // 5. Fetch Skills
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      // 6. Fetch Certifications
      const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      // 6.5. Fetch Social Links
      const { data: socialLinks } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', userId);

      // 7. Fetch Portfolio Settings
      let { data: settings } = await supabase
        .from('portfolio_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!settings) {
        // Fallback create settings
        const cleanSlug = (userEmail || 'user').split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '') + '-' + userId.substring(0, 4);
        const { data: newSettings } = await supabase
          .from('portfolio_settings')
          .insert({
            user_id: userId,
            slug: cleanSlug,
            template: 'minimal',
            theme: 'minimal',
            is_public: false
          })
          .select()
          .single();
        settings = newSettings;
      }

      // 8. Fetch Subscription
      let { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!sub) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: 'Free',
            status: 'active'
          })
          .select()
          .single();
        sub = newSub;
      }

      // 9. Fetch Notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 11. Fetch Audit Logs
      const { data: audits } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Calculate analytics metrics
      let viewsCount = 0;
      let uniqueVisitorsCount = 0;
      if (settings) {
        const { data: analyticsRows } = await supabase
          .from('analytics')
          .select('*')
          .eq('portfolio_id', settings.id);
          
        if (analyticsRows) {
          viewsCount = analyticsRows.length;
          const uniqueIps = new Set(analyticsRows.map(r => r.visitor_ip_hash));
          uniqueVisitorsCount = uniqueIps.size;
        }
      }

      // Set State
      if (settings) {
        setPortfolioSlug(settings.slug);
        setActiveTheme(settings.template || 'minimal');
        setPortfolioStatus(settings.is_public ? 'Published' : 'Draft');
        setCustomDomain(settings.custom_domain || '');
        setCustomDomainStatus(settings.custom_domain ? 'verified' : 'unconfigured');
      }

      if (sub) {
        setUserPlan(sub.plan);
      }

      if (notifs) {
        setNotifications(notifs.map(n => ({
          id: n.id,
          title: n.title,
          type: n.type,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: n.read
        })));
      }

      if (audits) {
        setRecentActivities(audits.map(a => ({
          id: a.id,
          action: a.action,
          time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: a.action.includes('Delete') || a.action.includes('Cancel') ? 'warning' : 'info'
        })));
      }

      setAnalytics(prev => ({
        ...prev,
        views: viewsCount,
        uniqueVisitors: uniqueVisitorsCount,
        downloads: audits ? audits.filter(a => a.action === 'Download Resume').length : 0
      }));

      // Set Portfolio Data State
      setPortfolioData({
        name: profile?.full_name || '',
        avatarUrl: profile?.profile_image_url || '',
        title: profile?.title || '',
        university: profile?.university || '',
        degree: profile?.degree || '',
        graduationYear: profile?.graduation_year || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        skills: skills ? skills.map(s => s.name) : [],
        experience: experience ? experience.map(e => ({
          id: e.id,
          company: e.company,
          role: e.position,
          duration: `${e.start_date} - ${e.end_date}`,
          description: e.description || ''
        })) : [],
        education: education ? education.map(edu => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.program,
          duration: edu.graduation_year || '',
          description: edu.description || ''
        })) : [],
        projects: projects ? projects.map(p => ({
          id: p.id,
          name: p.title,
          description: p.description || '',
          technologies: p.thumbnail_url || '',
          githubUrl: p.github_url || '',
          liveUrl: p.project_url || ''
        })) : [],
        certifications: certifications ? certifications.map(c => ({
          id: c.id,
          name: c.title,
          issuer: c.issuer,
          date: c.issue_date || ''
        })) : [],
        contact: {
          email: profile?.email || '',
          phone: profile?.phone || '',
          website: profile?.website || '',
          linkedin: socialLinks?.find(s => s.platform.toLowerCase() === 'linkedin')?.url || '',
          github: socialLinks?.find(s => s.platform.toLowerCase() === 'github')?.url || '',
          behance: socialLinks?.find(s => s.platform.toLowerCase() === 'behance')?.url || '',
          dribbble: socialLinks?.find(s => s.platform.toLowerCase() === 'dribbble')?.url || '',
          instagram: socialLinks?.find(s => s.platform.toLowerCase() === 'instagram')?.url || '',
          x: socialLinks?.find(s => s.platform.toLowerCase() === 'x')?.url || '',
          facebook: socialLinks?.find(s => s.platform.toLowerCase() === 'facebook')?.url || ''
        }
      });

    } catch (err) {
      console.error(err);
      setSimulateError(true);
    } finally {
      setSimulateLoading(false);
    }
  };

  // Sync Load States with data
  useEffect(() => {
    if (simulateLoading) {
      setProjectsLoadState('loading');
      setExperienceLoadState('loading');
      setEducationLoadState('loading');
      setCertificationsLoadState('loading');
    } else if (simulateError) {
      setProjectsLoadState('error');
      setExperienceLoadState('error');
      setEducationLoadState('error');
      setCertificationsLoadState('error');
    } else {
      setProjectsLoadState(portfolioData.projects.length > 0 ? 'populated' : 'empty');
      setExperienceLoadState(portfolioData.experience.length > 0 ? 'populated' : 'empty');
      setEducationLoadState(portfolioData.education.length > 0 ? 'populated' : 'empty');
      setCertificationsLoadState(portfolioData.certifications.length > 0 ? 'populated' : 'empty');
    }
  }, [portfolioData, simulateLoading, simulateError]);

  // Routing and Hash Management
  useEffect(() => {
    const handleHashChange = async () => {
      if (window.location.hash.startsWith('#/p/')) {
        setCurrentPage('published');
        const hashParts = window.location.hash.split('/');
        const pubSlug = hashParts[hashParts.length - 1];
        
        setSimulateLoading(true);
        
        if (supabase) {
          try {
            // Fetch public settings
            const { data: settings } = await supabase
              .from('portfolio_settings')
              .select('*')
              .eq('slug', pubSlug)
              .eq('is_public', true)
              .maybeSingle();
              
            if (!settings) {
              showAlert('Portfolio not found or is private.', 'info');
              setCurrentPage('landing');
              setSimulateLoading(false);
              return;
            }

            const userId = settings.user_id;
            setActiveTheme(settings.template || 'minimal');

            // Fetch public profile contents
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();

            const { data: projects } = await supabase
              .from('projects')
              .select('*')
              .eq('user_id', userId);

            const { data: experience } = await supabase
              .from('experience')
              .select('*')
              .eq('user_id', userId);

            const { data: education } = await supabase
              .from('education')
              .select('*')
              .eq('user_id', userId);

            const { data: skills } = await supabase
              .from('skills')
              .select('*')
              .eq('user_id', userId);

            const { data: certifications } = await supabase
              .from('certifications')
              .select('*')
              .eq('user_id', userId);

            const { data: socialLinks } = await supabase
              .from('social_links')
              .select('*')
              .eq('user_id', userId);

            setPortfolioData({
              name: profile?.full_name || '',
              avatarUrl: profile?.profile_image_url || '',
              title: profile?.title || '',
              university: profile?.university || '',
              degree: profile?.degree || '',
              graduationYear: profile?.graduation_year || '',
              location: profile?.location || '',
              bio: profile?.bio || '',
              skills: skills ? skills.map(s => s.name) : [],
              experience: experience ? experience.map(e => ({
                id: e.id,
                company: e.company,
                role: e.position,
                duration: `${e.start_date} - ${e.end_date}`,
                description: e.description || ''
              })) : [],
              education: education ? education.map(edu => ({
                id: edu.id,
                institution: edu.institution,
                degree: edu.program,
                duration: edu.graduation_year || '',
                description: edu.description || ''
              })) : [],
              projects: projects ? projects.map(p => ({
                id: p.id,
                name: p.title,
                description: p.description || '',
                technologies: p.thumbnail_url || '',
                githubUrl: p.github_url || '',
                liveUrl: p.project_url || ''
              })) : [],
              certifications: certifications ? certifications.map(c => ({
                id: c.id,
                name: c.title,
                issuer: c.issuer,
                date: c.issue_date || ''
              })) : [],
              contact: {
                email: profile?.email || '',
                phone: profile?.phone || '',
                website: profile?.website || '',
                linkedin: socialLinks?.find(s => s.platform.toLowerCase() === 'linkedin')?.url || '',
                github: socialLinks?.find(s => s.platform.toLowerCase() === 'github')?.url || '',
                behance: socialLinks?.find(s => s.platform.toLowerCase() === 'behance')?.url || '',
                dribbble: socialLinks?.find(s => s.platform.toLowerCase() === 'dribbble')?.url || '',
                instagram: socialLinks?.find(s => s.platform.toLowerCase() === 'instagram')?.url || '',
                x: socialLinks?.find(s => s.platform.toLowerCase() === 'x')?.url || '',
                facebook: socialLinks?.find(s => s.platform.toLowerCase() === 'facebook')?.url || ''
              }
            });

            // Track analytics view
            const ipHash = 'anon-' + Math.random().toString(36).substring(2, 10);
            await supabase.from('analytics').insert({
              portfolio_id: settings.id,
              visitor_ip_hash: ipHash,
              country: 'Malaysia',
              device_type: window.innerWidth > 768 ? 'Desktop' : 'Mobile',
              referrer: document.referrer || 'Direct'
            });

          } catch (err) {
            console.error("Error fetching published portfolio:", err);
          } finally {
            setSimulateLoading(false);
          }
        }
      } else if (window.location.hash === '' && currentPage === 'published') {
        setCurrentPage('landing');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch admin list
  useEffect(() => {
    if (currentPage === 'admin' && userPlan === 'Business') {
      const fetchAdminData = async () => {
        if (!supabase) return;
        const { data: profiles } = await supabase.from('profiles').select('user_id, full_name, email');
        const { data: subs } = await supabase.from('subscriptions').select('user_id, plan, status');
        if (profiles && subs) {
          const list = profiles.map(p => {
            const s = subs.find(sub => sub.user_id === p.user_id);
            return {
              name: p.full_name || 'Anonymous',
              email: p.email || '',
              plan: s?.plan || 'Free',
              status: s?.status || 'active'
            };
          });
          setAdminUsers(list);
        }
      };
      fetchAdminData();
    }
  }, [currentPage, userPlan]);

  // AI Project Prompt Writer State
  const [aiProjectPrompt, setAiProjectPrompt] = useState<string>('')
  const [aiProjectOutput, setAiProjectOutput] = useState<string>('')
  const [isGeneratingProject, setIsGeneratingProject] = useState<boolean>(false)
  const [aiScore, setAiScore] = useState<number>(0)
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([
    'Configure profile name and title.',
    'Add your first project block.',
    'Upload a resume PDF to parse details.'
  ])
  const [isReviewingPortfolio, setIsReviewingPortfolio] = useState<boolean>(false)

  // Editor accordion open sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: true,
    education: false,
    experience: false,
    projects: false,
    skills: false,
    certifications: false,
    contact: false
  })

  // Alert State
  const [alertMsg, setAlertMsg] = useState<{ type: 'info' | 'success'; text: string } | null>(null)

  // Form states
  const [newExp, setNewExp] = useState<Omit<ExperienceItem, 'id'>>({ company: '', role: '', duration: '', description: '' })
  const [newEdu, setNewEdu] = useState<Omit<EducationItem, 'id'>>({ institution: '', degree: '', duration: '', description: '' })
  const [newProj, setNewProj] = useState<Omit<ProjectItem, 'id'>>({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' })
  const [newCert, setNewCert] = useState<Omit<CertificationItem, 'id'>>({ name: '', issuer: '', date: '' })

  const [editingExpId, setEditingExpId] = useState<string | null>(null)
  const [editingEduId, setEditingEduId] = useState<string | null>(null)
  const [editingProjId, setEditingProjId] = useState<string | null>(null)
  const [editingCertId, setEditingCertId] = useState<string | null>(null)

  // Experience duration helper states
  const [expStartMonth, setExpStartMonth] = useState<string>('Jan')
  const [expStartYear, setExpStartYear] = useState<string>(String(new Date().getFullYear()))
  const [expEndMonth, setExpEndMonth] = useState<string>('Jan')
  const [expEndYear, setExpEndYear] = useState<string>(String(new Date().getFullYear()))
  const [expIsCurrent, setExpIsCurrent] = useState<boolean>(false)

  // Education duration helper states
  const [eduStartMonth, setEduStartMonth] = useState<string>('Jan')
  const [eduStartYear, setEduStartYear] = useState<string>(String(new Date().getFullYear()))
  const [eduEndMonth, setEduEndMonth] = useState<string>('Jan')
  const [eduEndYear, setEduEndYear] = useState<string>(String(new Date().getFullYear()))
  const [eduIsCurrent, setEduIsCurrent] = useState<boolean>(false)

  const showAlert = (text: string, type: 'info' | 'success' = 'info') => {
    setAlertMsg({ type, text })
    setTimeout(() => {
      setAlertMsg(null)
    }, 4000)
  }

  const addNotification = async (title: string, type: string = 'info') => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title,
        type,
        read: false
      });
      fetchUserData(user.id);
    }
  }

  const logActivity = async (action: string, details: any = {}) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action,
        details
      });
    }
  }

  const checkRateLimit = (): boolean => {
    if (isRateLimited) {
      showAlert('Rate limit exceeded. Please wait 10 seconds.', 'info')
      return false
    }
    const nextCount = requestCount + 1
    setRequestCount(nextCount)
    if (nextCount >= 3) {
      setIsRateLimited(true)
      setTimeout(() => {
        setIsRateLimited(false)
        setRequestCount(0)
      }, 10000)
    }
    return true
  }

  // File Upload Handlers (Supabase Storage integration)
  const handleFileUpload = async (file: File, type: 'avatar' | 'resume' | 'project' | 'cert') => {
    setUploadingFileType(type)
    setUploadProgress(0)
    setUploadError('')

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setUploadingFileType(null);
      return;
    }

    // Validation
    if (type === 'resume') {
      if (file.type !== 'application/pdf') {
        setUploadError('Only PDF files are accepted.')
        setUploadingFileType(null)
        showAlert('Invalid type: PDF required.', 'info')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB.')
        setUploadingFileType(null)
        showAlert('File size exceeds 5MB limit.', 'info')
        return
      }
    } else {
      const allowed = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowed.includes(file.type)) {
        setUploadError('Only JPEG/PNG images are allowed.')
        setUploadingFileType(null)
        showAlert('Invalid type: JPEG or PNG required.', 'info')
        return
      }
      const limit = type === 'avatar' ? 2 : 3
      if (file.size > limit * 1024 * 1024) {
        setUploadError(`File size exceeds ${limit}MB.`)
        setUploadingFileType(null)
        showAlert(`File exceeds ${limit}MB limit.`, 'info')
        return
      }
    }

    try {
      const bucketName = (type === 'avatar' || type === 'project') ? 'public-portfolio' : 'private-portfolio';
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;

      setUploadProgress(30);

      // Perform upload
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      setUploadProgress(70);

      let fileUrl = '';
      if (bucketName === 'public-portfolio') {
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        fileUrl = publicUrl;
      } else {
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(fileName, 3600);
        if (signedError) throw signedError;
        fileUrl = signedData.signedUrl;
      }

      setUploadProgress(90);

      // Save references in database
      if (type === 'avatar') {
        await supabase.from('profiles').update({ profile_image_url: fileUrl }).eq('user_id', user.id);
        setPortfolioData(prev => ({ ...prev, avatarUrl: fileUrl }));
        showAlert('Profile picture updated.', 'success');
        await logActivity('Profile Picture Uploaded', { url: fileUrl });
      } else if (type === 'resume') {
        setUploadedResumeName(file.name);
        showAlert('Resume uploaded successfully.', 'success');
        await logActivity('Resume Uploaded', { name: file.name });
        handleParseResumeContents(file.name);
      }

      setUploadProgress(100);
      setTimeout(() => setUploadingFileType(null), 400);

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Upload failed');
      setUploadingFileType(null);
      showAlert('Upload failed: ' + (err.message || ''), 'info');
    }
  }

  // Parse Resume simulated extraction but connected to profile table
  const handleParseResumeContents = async (fileName: string) => {
    setIsParsingResume(true)
    setTimeout(async () => {
      const base = fileName.replace(/_resume|_cv|resume|cv|\.pdf/gi, '').replace(/[-_]/g, ' ').trim()
      const formattedName = base ? base.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Student User'
      
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase.from('profiles').update({
          full_name: formattedName,
          title: 'Software Engineer',
          university: 'University of Malaya',
          degree: 'Bachelor of Computer Science',
          graduation_year: '2027',
          location: 'Kuala Lumpur, Malaysia'
        }).eq('user_id', user.id);

        await supabase.from('skills').delete().eq('user_id', user.id);
        await supabase.from('skills').insert([
          { user_id: user.id, name: 'React', category: 'Technical' },
          { user_id: user.id, name: 'JavaScript', category: 'Technical' },
          { user_id: user.id, name: 'CSS', category: 'Technical' },
          { user_id: user.id, name: 'Git', category: 'Technical' }
        ]);

        fetchUserData(user.id);
      }

      setIsParsingResume(false)
      showAlert('Resume parsed! details populated.', 'success')
      await logActivity('Resume Parsed', { name: fileName });
    }, 1200)
  }

  const handleValidateSlug = async (slug: string) => {
    const val = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setPortfolioSlug(val)
    if (!val) {
      setSlugAvailability('empty')
      setSlugError('')
      return
    }
    if (val.length < 3) {
      setSlugAvailability('too-short')
      setSlugError('Slug must be at least 3 characters.')
      return
    }
    const reserved = ['admin', 'settings', 'billing', 'root', 'foliogo', 'support', 'help', 'api', 'login', 'register', 'preview', 'dashboard', 'editor', 'checkout', 'pricing']
    const profanity = ['shit', 'fuck', 'ass', 'bitch']
    
    if (reserved.includes(val)) {
      setSlugAvailability('reserved')
      setSlugError('This slug address is reserved.')
      return
    }
    if (profanity.some(word => val.includes(word))) {
      setSlugAvailability('profane')
      setSlugError('Slug contains blocked content.')
      return
    }
    
    // Check database uniqueness
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const { data } = await supabase
        .from('portfolio_settings')
        .select('id')
        .eq('slug', val)
        .neq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setSlugAvailability('duplicate')
        setSlugError('This URL is already taken.')
        return
      }
    }
    setSlugAvailability('available')
    setSlugError('')
  }

  // Pre-populate onboarding fields if portfolio data changes
  useEffect(() => {
    if (portfolioData.name) {
      setOnboardingName(portfolioData.name)
      setOnboardingTitle(portfolioData.title)
      setOnboardingUniversity(portfolioData.university)
      setOnboardingDegree(portfolioData.degree)
      setOnboardingGradYear(portfolioData.graduationYear)
      setOnboardingLocation(portfolioData.location)
      setOnboardingSkills(portfolioData.skills.join(', '))
    }
  }, [portfolioData])

  // Auth Handlers using Supabase Client
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail || !userPassword) return showAlert('Please fill in both fields.', 'info')
    if (userPassword.length < 6) return showAlert('Password must be at least 6 characters.', 'info')
    
    setSimulateLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword
    });

    if (error) {
      showAlert('Login failed: ' + error.message, 'info');
      setSimulateLoading(false);
    } else {
      showAlert('Logged in successfully!', 'success');
      if (data.user) {
        await logActivity('Login Activity', { event: 'Login successful' });
      }
      setCurrentPage('dashboard');
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail || !userPassword) return showAlert('Please fill in your details.', 'info')
    if (userPassword.length < 6) return showAlert('Password must be at least 6 characters.', 'info')
    
    setSimulateLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password: userPassword
    });

    if (error) {
      showAlert('Registration failed: ' + error.message, 'info');
      setSimulateLoading(false);
    } else {
      if (data.session) {
        showAlert('Registration successful! Let\'s setup onboarding.', 'success');
        setCurrentPage('onboarding');
      } else {
        setVerificationSent(true);
        setCurrentPage('verify-email');
        showAlert('Verification email sent.', 'success');
      }
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail) return showAlert('Please enter your email.', 'info')
    
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: window.location.origin + '#/reset-password'
    });
    if (error) {
      showAlert('Error: ' + error.message, 'info');
    } else {
      showAlert('Recovery email sent. Check your inbox.', 'success')
      setCurrentPage('login')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password: userPassword });
    if (error) {
      showAlert('Error: ' + error.message, 'info');
    } else {
      showAlert('Your password has been successfully reset.', 'success')
      setCurrentPage('login')
    }
  }

  const handleAccountRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recoveryAnswers.q1 || !recoveryAnswers.q2) {
      return showAlert('Please answer the security questions.', 'info')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: window.location.origin + '#/reset-password'
    });
    if (error) {
      showAlert('Recovery failed: ' + error.message, 'info');
    } else {
      showAlert('Security questions verified. Recovery email sent.', 'success')
      setCurrentPage('login')
    }
  }

  const handleOnboardingSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const updatedSkills = onboardingSkills.split(',').map(s => s.trim()).filter(Boolean)

    // Save profile metadata
    await supabase.from('profiles').update({
      full_name: onboardingName,
      title: onboardingTitle,
      university: onboardingUniversity,
      degree: onboardingDegree,
      graduation_year: onboardingGradYear,
      location: onboardingLocation
    }).eq('user_id', user.id);

    // Save skills
    await supabase.from('skills').delete().eq('user_id', user.id);
    if (updatedSkills.length > 0) {
      await supabase.from('skills').insert(updatedSkills.map(name => ({
        user_id: user.id,
        name,
        category: 'Technical'
      })));
    }

    // Save theme setting
    await supabase.from('portfolio_settings').update({
      template: onboardingTheme,
      theme: onboardingTheme
    }).eq('user_id', user.id);

    await fetchUserData(user.id);
    
    // Evaluate onboarding score
    let score = 30
    const recs = []
    if (onboardingName) score += 20
    else recs.push('Specify your full name.')
    if (onboardingTitle) score += 15
    else recs.push('Specify a professional title.')
    if (updatedSkills.length > 0) score += 15
    else recs.push('Add technical/soft skills.')
    
    recs.push('Add at least one project block.')
    recs.push('Upload a resume PDF to parse details.')
    setAiScore(score)
    setAiRecommendations(recs)

    showAlert('Profile setup complete! Welcome to your dashboard.', 'success')
    await addNotification('Onboarding steps completed.', 'success')
    await logActivity('Portfolio Publishing', { event: 'Onboarding completed' });
    setCurrentPage('dashboard')
  }

  // AI Project Description Generator (restricted by plan)
  const handleGenerateProjectDescription = () => {
    if (userPlan === 'Free') {
      triggerUpgradePrompt('Upgrade to Pro to unlock AI Project Writer.')
      return
    }
    if (!aiProjectPrompt) return showAlert('Please enter a short project summary.', 'info')
    if (!checkRateLimit()) return
    
    setIsGeneratingProject(true)
    setTimeout(async () => {
      let desc = ''
      if (aiProjectPrompt.toLowerCase().includes('voting')) {
        desc = 'Developed a Java-based voting management system utilizing Object-Oriented Programming principles for candidate registration, vote processing, and automated result generation.'
      } else if (aiProjectPrompt.toLowerCase().includes('loan')) {
        desc = 'Designed an interactive car loan estimation dashboard using React and TypeScript. Computes interest rates, monthly repayment cycles, and amortization charts.'
      } else {
        desc = `Developed a scalable solution for "${aiProjectPrompt}" utilizing modern architecture, optimized backend database querying, and responsive client layouts.`
      }
      setAiProjectOutput(desc)
      setIsGeneratingProject(false)
      showAlert('AI description generated!', 'success')
      await logActivity('Project Updates', { action: 'AI description generated', prompt: aiProjectPrompt });
    }, 1200)
  }

  // Run Portfolio Review Score
  const handleRunPortfolioReview = () => {
    if (userPlan === 'Free') {
      triggerUpgradePrompt('Upgrade to Pro to run AI portfolio scoring.')
      return
    }
    setIsReviewingPortfolio(true)
    setTimeout(async () => {
      let score = 20
      const recs = []
      if (portfolioData.name) score += 20
      else recs.push('Specify your full name.')
      if (portfolioData.title) score += 15
      else recs.push('Add a professional title.')
      if (portfolioData.bio) score += 15
      else recs.push('Write a short biography summary.')
      if (portfolioData.skills.length > 0) score += 10
      else recs.push('Add technical and soft skills.')
      if (portfolioData.projects.length > 0) score += 10
      else recs.push('Add at least one project.')
      if (portfolioData.experience.length > 0) score += 10
      else recs.push('Add relevant work experience.')

      setAiScore(score)
      setAiRecommendations(recs.length > 0 ? recs : ['All key sections present! Excellent job.'])
      setIsReviewingPortfolio(false)
      showAlert('Portfolio review completed.', 'success')
      await logActivity('Profile Updates', { action: 'AI portfolio scoring evaluated', score });
    }, 1000)
  }

  const triggerUpgradePrompt = (text: string) => {
    setUpgradeTriggerText(text)
    setShowUpgradeModal(true)
  }

  // Handle Checkout actions (updates subscription tier in DB)
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (checkoutStep === 1) {
      setCheckoutStep(2)
    } else if (checkoutStep === 2) {
      setCheckoutStep(3)
    } else if (checkoutStep === 3) {
      setCheckoutStep(4)
    } else {
      setIsProcessingPayment(true)
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        try {
          await supabase.from('subscriptions').update({
            plan: selectedCheckoutPlan,
            status: 'active',
            renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }).eq('user_id', user.id);

          await supabase.from('payments').insert({
            user_id: user.id,
            amount: selectedCheckoutPlan === 'Pro' ? 9.00 : 29.00,
            currency: 'USD',
            payment_status: 'paid',
            invoice_url: '#'
          });

          await logActivity('Subscription Changes', { plan: selectedCheckoutPlan });
          setUserPlan(selectedCheckoutPlan);
        } catch (err) {
          console.error(err);
        }
      }
      setIsProcessingPayment(false)
      setCheckoutStep(5)
      showAlert(`Subscription to ${selectedCheckoutPlan} Activated!`, 'success')
      await addNotification(`Subscription upgraded to ${selectedCheckoutPlan}.`, 'success')
    }
  }

  // Domain Verification (maps domain to portfolio settings in DB)
  const handleVerifyDomain = async () => {
    if (!customDomain) return showAlert('Please enter a domain name.', 'info')
    setIsVerifyingDomain(true)
    setTimeout(async () => {
      setIsVerifyingDomain(false)
      if (customDomain.includes('.')) {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await supabase.from('portfolio_settings').update({ custom_domain: customDomain }).eq('user_id', user.id);
          setCustomDomainStatus('verified')
          showAlert('Domain verified successfully!', 'success')
          await addNotification(`Custom domain ${customDomain} verified.`, 'success')
          await logActivity('Portfolio Publishing', { custom_domain: customDomain });
        }
      } else {
        showAlert('Verification failed: DNS CNAME record not found.', 'info')
      }
    }, 1500)
  }

  // Accordion Control
  const toggleAccordion = (sec: string) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }))
  }

  // CRUD Actions
  const handleAddExperience = async () => {
    if (!newExp.company || !newExp.role) return showAlert('Please fill in Company and Role.', 'info')
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const startD = `${expStartMonth} ${expStartYear}`;
      const endD = expIsCurrent ? 'Present' : `${expEndMonth} ${expEndYear}`;
      const durationStr = `${startD} - ${endD}`;

      if (editingExpId) {
        // Edit mode
        const { error } = await supabase.from('experience').update({
          company: newExp.company,
          position: newExp.role,
          start_date: startD,
          end_date: endD,
          description: newExp.description
        }).eq('id', editingExpId);

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          experience: prev.experience.map(item => item.id === editingExpId ? {
            id: editingExpId,
            company: newExp.company,
            role: newExp.role,
            duration: durationStr,
            description: newExp.description
          } : item)
        }));
        setEditingExpId(null);
        setNewExp({ company: '', role: '', duration: '', description: '' });
        showAlert('Experience item updated.', 'success');
        await logActivity('Experience Updated', { id: editingExpId, role: newExp.role });
      } else {
        // Add mode
        const { data, error } = await supabase.from('experience').insert({
          user_id: user.id,
          company: newExp.company,
          position: newExp.role,
          start_date: startD,
          end_date: endD,
          description: newExp.description
        }).select().single();

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          experience: [...prev.experience, {
            id: data.id,
            company: data.company,
            role: data.position,
            duration: durationStr,
            description: data.description || ''
          }]
        }));
        setNewExp({ company: '', role: '', duration: '', description: '' });
        showAlert('Experience item added.', 'success');
        await logActivity('Experience Added', { id: data.id, role: data.position });
      }
    }
  }

  const handleDeleteExperience = async (id: string) => {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) return showAlert(error.message, 'info');
    
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
    if (editingExpId === id) {
      setEditingExpId(null);
      setNewExp({ company: '', role: '', duration: '', description: '' });
    }
    showAlert('Experience item deleted.', 'info');
    await logActivity('Experience Deleted', { id });
  }

  const handleAddEducation = async () => {
    if (!newEdu.institution || !newEdu.degree) return showAlert('Please fill in Institution and Degree.', 'info')
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const startD = `${eduStartMonth} ${eduStartYear}`;
      const endD = eduIsCurrent ? 'Present' : `${eduEndMonth} ${eduEndYear}`;
      const durationStr = `${startD} - ${endD}`;

      if (editingEduId) {
        // Edit mode
        const { error } = await supabase.from('education').update({
          institution: newEdu.institution,
          program: newEdu.degree,
          graduation_year: durationStr,
          description: newEdu.description
        }).eq('id', editingEduId);

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          education: prev.education.map(item => item.id === editingEduId ? {
            id: editingEduId,
            institution: newEdu.institution,
            degree: newEdu.degree,
            duration: durationStr,
            description: newEdu.description
          } : item)
        }));
        setEditingEduId(null);
        setNewEdu({ institution: '', degree: '', duration: '', description: '' });
        showAlert('Education item updated.', 'success');
        await logActivity('Education Updated', { id: editingEduId });
      } else {
        // Add mode
        const { data, error } = await supabase.from('education').insert({
          user_id: user.id,
          institution: newEdu.institution,
          program: newEdu.degree,
          graduation_year: durationStr,
          cgpa: '',
          description: newEdu.description
        }).select().single();

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          education: [...prev.education, {
            id: data.id,
            institution: data.institution,
            degree: data.program,
            duration: durationStr,
            description: data.description || ''
          }]
        }));
        setNewEdu({ institution: '', degree: '', duration: '', description: '' });
        showAlert('Education item added.', 'success');
        await logActivity('Education Added', { id: data.id });
      }
    }
  }

  const handleDeleteEducation = async (id: string) => {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) return showAlert(error.message, 'info');

    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
    if (editingEduId === id) {
      setEditingEduId(null);
      setNewEdu({ institution: '', degree: '', duration: '', description: '' });
    }
    showAlert('Education item deleted.', 'info');
    await logActivity('Education Deleted', { id });
  }

  const handleAddProject = async () => {
    if (!newProj.name || !newProj.description) return showAlert('Please fill in Project Name and Description.', 'info')
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      if (editingProjId) {
        // Edit mode
        const { error } = await supabase.from('projects').update({
          title: newProj.name,
          description: newProj.description,
          thumbnail_url: newProj.technologies,
          github_url: newProj.githubUrl,
          project_url: newProj.liveUrl
        }).eq('id', editingProjId);

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          projects: prev.projects.map(item => item.id === editingProjId ? {
            id: editingProjId,
            name: newProj.name,
            description: newProj.description,
            technologies: newProj.technologies,
            githubUrl: newProj.githubUrl,
            liveUrl: newProj.liveUrl
          } : item)
        }));
        setEditingProjId(null);
        setNewProj({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
        setAiProjectPrompt('');
        setAiProjectOutput('');
        showAlert('Project updated.', 'success');
        await logActivity('Project Updates', { action: 'Project updated', id: editingProjId, name: newProj.name });
      } else {
        // Add mode
        const { data, error } = await supabase.from('projects').insert({
          user_id: user.id,
          title: newProj.name,
          description: newProj.description,
          thumbnail_url: newProj.technologies,
          github_url: newProj.githubUrl,
          project_url: newProj.liveUrl,
          featured: false
        }).select().single();

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          projects: [...prev.projects, {
            id: data.id,
            name: data.title,
            description: data.description || '',
            technologies: data.thumbnail_url || '',
            githubUrl: data.github_url || '',
            liveUrl: data.project_url || ''
          }]
        }));
        setNewProj({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
        setAiProjectPrompt('');
        setAiProjectOutput('');
        showAlert('Project item added.', 'success');
        await logActivity('Project Updates', { action: 'Project added', id: data.id, name: data.title });
      }
    }
  }

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return showAlert(error.message, 'info');

    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
    if (editingProjId === id) {
      setEditingProjId(null);
      setNewProj({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
    }
    showAlert('Project deleted.', 'info')
    await logActivity('Project Updates', { action: 'Project deleted', id });
  }

  const handleAddCertification = async () => {
    if (!newCert.name || !newCert.issuer) return showAlert('Please fill in Name and Issuer.', 'info')
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      if (editingCertId) {
        // Edit mode
        const { error } = await supabase.from('certifications').update({
          title: newCert.name,
          issuer: newCert.issuer,
          issue_date: newCert.date
        }).eq('id', editingCertId);

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          certifications: prev.certifications.map(item => item.id === editingCertId ? {
            id: editingCertId,
            name: newCert.name,
            issuer: newCert.issuer,
            date: newCert.date
          } : item)
        }));
        setEditingCertId(null);
        setNewCert({ name: '', issuer: '', date: '' });
        showAlert('Certification updated.', 'success');
        await logActivity('Certification Updated', { id: editingCertId });
      } else {
        // Add mode
        const { data, error } = await supabase.from('certifications').insert({
          user_id: user.id,
          title: newCert.name,
          issuer: newCert.issuer,
          issue_date: newCert.date,
          certificate_url: ''
        }).select().single();

        if (error) return showAlert(error.message, 'info');

        setPortfolioData(prev => ({
          ...prev,
          certifications: [...prev.certifications, {
            id: data.id,
            name: data.title,
            issuer: data.issuer,
            date: data.issue_date || ''
          }]
        }));
        setNewCert({ name: '', issuer: '', date: '' });
        showAlert('Certification added.', 'success');
        await logActivity('Certification Added', { id: data.id });
      }
    }
  }

  const handleDeleteCertification = async (id: string) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) return showAlert(error.message, 'info');

    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(item => item.id !== id)
    }));
    if (editingCertId === id) {
      setEditingCertId(null);
      setNewCert({ name: '', issuer: '', date: '' });
    }
    showAlert('Certification deleted.', 'info')
    await logActivity('Certification Deleted', { id });
  }

  const clearPortfolioData = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from('profiles').update({ bio: '', title: '', location: '' }).eq('user_id', user.id);
      await supabase.from('projects').delete().eq('user_id', user.id);
      await supabase.from('experience').delete().eq('user_id', user.id);
      await supabase.from('education').delete().eq('user_id', user.id);
      await supabase.from('skills').delete().eq('user_id', user.id);
      await supabase.from('certifications').delete().eq('user_id', user.id);
      await fetchUserData(user.id);
    }
    setAiScore(0)
    setAiRecommendations(['Configure profile name and title.', 'Add your first project block.'])
    showAlert('Portfolio data reset to empty states.', 'info')
  }

  const handleParseResume = () => {
    setUploadedResumeName('alex_chen_resume.pdf')
    handleParseResumeContents('alex_chen_resume.pdf')
  }

  const seedDemoData = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from('profiles').update({
        full_name: 'Alex Chen',
        title: 'Junior Software Engineer',
        university: 'University of Malaya',
        degree: 'Bachelor of Computer Science',
        graduation_year: '2027',
        location: 'Kuala Lumpur, Malaysia',
        bio: 'Passionate computer science student specializing in building high-performance web applications using React, TypeScript, and modern backend architectures.'
      }).eq('user_id', user.id);

      await supabase.from('skills').delete().eq('user_id', user.id);
      await supabase.from('skills').insert([
        { user_id: user.id, name: 'React', category: 'Technical' },
        { user_id: user.id, name: 'TypeScript', category: 'Technical' },
        { user_id: user.id, name: 'Node.js', category: 'Technical' },
        { user_id: user.id, name: 'Express', category: 'Technical' },
        { user_id: user.id, name: 'Supabase', category: 'Technical' },
        { user_id: user.id, name: 'PostgreSQL', category: 'Technical' }
      ]);

      await supabase.from('projects').delete().eq('user_id', user.id);
      await supabase.from('projects').insert([
        {
          user_id: user.id,
          title: 'BreedLink Platform',
          description: 'A React application for connecting animal breeders and pet seekers, featuring real-time chat and filtering.',
          thumbnail_url: 'React, Firebase, CSS',
          github_url: 'https://github.com/alexchen/breedlink',
          project_url: 'https://breedlinkss.vercel.app/splash'
        },
        {
          user_id: user.id,
          title: 'myEasyAssets',
          description: 'A cloud asset management tracker designed for students and small teams to audit hardware and digital assets.',
          thumbnail_url: 'TypeScript, React, Supabase',
          github_url: 'https://github.com/alexchen/myeasyassets',
          project_url: 'https://eassy-assets.vercel.app'
        }
      ]);

      await supabase.from('experience').delete().eq('user_id', user.id);
      await supabase.from('experience').insert({
        user_id: user.id,
        company: 'TechCorp Malaysia',
        position: 'Software Engineer Intern',
        start_date: 'Dec 2025',
        end_date: 'Present',
        description: 'Developed and maintained UI components for the core analytics dashboard using React and TailwindCSS.'
      });

      await supabase.from('education').delete().eq('user_id', user.id);
      await supabase.from('education').insert({
        user_id: user.id,
        institution: 'University of Malaya',
        program: 'Bachelor of Computer Science (Software Engineering)',
        graduation_year: '2024 - 2027',
        description: 'CGPA: 3.85/4.00. Focus on data structures, algorithms, and database systems.'
      });

      await supabase.from('certifications').delete().eq('user_id', user.id);
      await supabase.from('certifications').insert({
        user_id: user.id,
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issue_date: 'Jan 2026'
      });

      await fetchUserData(user.id);
      setAiScore(92);
      setAiRecommendations([
        'Add a link to your resume PDF.',
        'Provide more details about AWS Cloud Practitioner certification.'
      ]);
      showAlert('Loaded professional developer demo template.', 'success');
      await logActivity('Demo Data Seeded', { user: 'Alex Chen' });
    }
  }

  const validatePortfolioForPublish = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!portfolioData.name.trim()) {
      errors.push('Full Name is required.');
    }
    if (!portfolioData.contact.email.trim()) {
      errors.push('Contact email is required.');
    }
    const hasSections = 
      portfolioData.projects.length > 0 ||
      portfolioData.experience.length > 0 ||
      portfolioData.education.length > 0 ||
      portfolioData.certifications.length > 0;
      
    if (!hasSections) {
      errors.push('At least one content section (Projects, Experience, Education, or Certifications) must be present.');
    }
    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Publish / Toggles public status in settings table
  const handlePublishClick = async () => {
    const validation = validatePortfolioForPublish();
    if (!validation.valid) {
      showAlert('Publish validation failed! Add at least name, email, and one section.', 'info');
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const { error } = await supabase
        .from('portfolio_settings')
        .update({
          is_public: true,
          template: activeTheme,
          theme: activeTheme
        })
        .eq('user_id', user.id);

      if (error) {
        showAlert('Failed to publish: ' + error.message, 'info');
      } else {
        setPortfolioStatus('Published');
        showAlert('Portfolio published to the live web!', 'success');
        await addNotification('Portfolio published successfully.', 'success');
        await logActivity('Portfolio Publishing', { event: 'Published live', slug: portfolioSlug });
        window.location.hash = '#/p/' + portfolioSlug;
        setCurrentPage('published');
      }
    }
  };

  const handleSaveProfileSettings = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      if (portfolioData.avatarUrl && portfolioData.avatarUrl.trim() !== '') {
        const imgRegex = /\.(jpeg|jpg|gif|png|webp|svg|bmp)(\?.*)?$/i;
        if (!imgRegex.test(portfolioData.avatarUrl.trim())) {
          return showAlert('Profile picture must be a valid image URL (ending with jpeg, jpg, png, webp, etc.)', 'info');
        }
      }

      const { error } = await supabase.from('profiles').update({
        full_name: portfolioData.name,
        profile_image_url: portfolioData.avatarUrl,
        title: portfolioData.title,
        university: portfolioData.university,
        degree: portfolioData.degree,
        graduation_year: portfolioData.graduationYear,
        location: portfolioData.location,
        bio: portfolioData.bio,
        email: portfolioData.contact.email,
        phone: portfolioData.contact.phone,
        website: portfolioData.contact.website
      }).eq('user_id', user.id);

      if (error) {
        return showAlert('Failed to save profile: ' + error.message, 'info');
      }

      // Save social links
      const platforms = ['linkedin', 'github', 'behance', 'dribbble', 'instagram', 'x', 'facebook'];
      for (const platform of platforms) {
        let url = portfolioData.contact[platform as keyof PortfolioData['contact']] || '';
        url = url.trim();
        if (url !== '') {
          url = formatExternalUrl(url); // Ensure valid URL prefix
          const { data: existing } = await supabase
            .from('social_links')
            .select('id')
            .eq('user_id', user.id)
            .eq('platform', platform)
            .maybeSingle();

          if (existing) {
            await supabase.from('social_links').update({ url }).eq('id', existing.id);
          } else {
            await supabase.from('social_links').insert({ user_id: user.id, platform, url });
          }
        } else {
          await supabase.from('social_links').delete().eq('user_id', user.id).eq('platform', platform);
        }
      }

      showAlert('Profile updated successfully!', 'success');
      await logActivity('Profile Updates', { action: 'Updated settings metadata' });
    }
  }

  const handleSaveSlug = async () => {
    if (slugError) return;
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const { error } = await supabase.from('portfolio_settings').update({ slug: portfolioSlug }).eq('user_id', user.id);
      if (error) {
        showAlert('Failed to save slug: ' + error.message, 'info');
      } else {
        showAlert('Portfolio address updated successfully.', 'success');
        await logActivity('Portfolio Publishing', { slug: portfolioSlug });
      }
    }
  }

  const handleSaveSkills = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await supabase.from('skills').delete().eq('user_id', user.id);
      if (portfolioData.skills.length > 0) {
        await supabase.from('skills').insert(portfolioData.skills.map(name => ({
          user_id: user.id,
          name,
          category: 'Technical'
        })));
      }
      showAlert('Skills updated successfully!', 'success');
      await logActivity('Profile Updates', { action: 'Updated skills list' });
    }
  }

  return (
    <>
      {/* Alert banner */}
      {alertMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className={`alert-banner ${alertMsg.type === 'success' ? 'success' : 'info'}`}>
            <CheckCircle size={18} />
            <span>{alertMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Routing switcher */}
      {(() => {
        switch (currentPage) {
          case 'landing':
            return (
              <>
                {/* Navbar */}
                <header className="navbar">
                  <div className="container nav-container">
                    <div className="logo-container" onClick={() => setCurrentPage('landing')}>
                      <div className="logo-icon">F</div>
                      <span>FolioGo</span>
                    </div>
                    <nav className="nav-links">
                      <a href="#features" className="nav-link">Features</a>
                      <a href="#pricing" className="nav-link">Pricing</a>
                    </nav>
                    <div className="nav-actions">
                      <button className="btn btn-text" onClick={() => setCurrentPage('login')}>Sign In</button>
                      <button className="btn btn-primary" onClick={() => setCurrentPage('register')}>Start Free</button>
                    </div>
                  </div>
                </header>

                {/* Hero Section */}
                <section className="hero-sec">
                  <div className="container">
                    <div className="hero-badge">
                      <Sparkles size={16} />
                      <span>The professional SaaS portfolio engine for job seekers</span>
                    </div>
                    <h1 className="hero-title">
                      Showcase Your Skills With A <span>Dynamic Portfolio</span>
                    </h1>
                    <p className="hero-sub">
                      Build a production-grade portfolio, manage projects with AI description helpers, track views with analytics, and get hired faster.
                    </p>
                    <div className="hero-buttons">
                      <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('register')}>Start Free Now</button>
                    </div>
                  </div>
                </section>

                {/* Features Section */}
                <section id="features" className="features-sec">
                  <div className="container">
                    <div className="sec-header">
                      <h2 className="sec-title">Engineered For Professionals</h2>
                      <p>A production-ready environment that converts raw data into stunning portfolio websites.</p>
                    </div>
                    <div className="grid-3">
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <UploadCloud size={24} />
                        </div>
                        <h3 className="feature-title">Resume Parser</h3>
                        <p>Upload your CV PDF and watch as it automatically extracts skills and experience records.</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <Layout size={24} />
                        </div>
                        <h3 className="feature-title">Reflow Layouts</h3>
                        <p>Zero empty states. Sections rearrange dynamically depending on which fields you populate.</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <TrendingUp size={24} />
                        </div>
                        <h3 className="feature-title">Visitor Analytics</h3>
                        <p>Track visitor views, downloads, link clicks, and top pages in real-time.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="pricing-sec">
                  <div className="container">
                    <div className="sec-header">
                      <h2 className="sec-title">Plans Designed For Growth</h2>
                      <p>Start with our comprehensive Free plan, and upgrade to unlock advanced templates and customizations.</p>
                    </div>
                    <div className="grid-3">
                      <div className="pricing-card">
                        <div>
                          <h4 className="plan-name">Free</h4>
                          <div className="plan-price">$0<span>/month</span></div>
                          <ul className="plan-features" style={{ listStyle: 'none', padding: 0, marginTop: '20px', fontSize: '0.88rem', color: '#555', textAlign: 'left' }}>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> 1 Published Portfolio</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Basic Theme (Minimal)</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> subdomain address</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Basic Analytics</li>
                          </ul>
                        </div>
                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                          setUserPlan('Free');
                          setCurrentPage('register');
                        }}>Get Started</button>
                      </div>

                      <div className="pricing-card popular" style={{ border: '2px solid #9AB17A', position: 'relative' }}>
                        <div className="pricing-badge" style={{ position: 'absolute', top: '-12px', right: '20px', background: '#9AB17A', color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>Recommended</div>
                        <div>
                          <h4 className="plan-name">Pro</h4>
                          <div className="plan-price">$9<span>/month</span></div>
                          <ul className="plan-features" style={{ listStyle: 'none', padding: 0, marginTop: '20px', fontSize: '0.88rem', color: '#555', textAlign: 'left' }}>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Unlimited Projects</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> All Premium Templates</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> AI Content Tools</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> AI Resume Parser</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Advanced Analytics</li>
                          </ul>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                          setSelectedCheckoutPlan('Pro');
                          setCurrentPage('register');
                        }}>Upgrade to Pro</button>
                      </div>

                      <div className="pricing-card">
                        <div>
                          <h4 className="plan-name">Business</h4>
                          <div className="plan-price">$29<span>/month</span></div>
                          <ul className="plan-features" style={{ listStyle: 'none', padding: 0, marginTop: '20px', fontSize: '0.88rem', color: '#555', textAlign: 'left' }}>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Multiple Portfolios</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Custom Domain Support</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Custom Branding</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Client Management Portal</li>
                            <li style={{ marginBottom: '10px' }}><Check size={16} color="#9AB17A" style={{ marginRight: '8px' }} /> Priority Support</li>
                          </ul>
                        </div>
                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => {
                          setSelectedCheckoutPlan('Business');
                          setCurrentPage('register');
                        }}>Go Business</button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                  <div className="container">
                    <p className="footer-copy">© 2026 FolioGo™ SaaS Platform. Built for modern professionals.</p>
                  </div>
                </footer>
              </>
            )

          case 'login':
          case 'register':
            return (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '24px' }} onClick={() => setCurrentPage('landing')}>
                    <div className="logo-icon">F</div>
                    <span>FolioGo</span>
                  </div>
                  <div className="auth-header">
                    <h2 className="auth-title">
                      {currentPage === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="auth-subtitle">
                      {currentPage === 'login' 
                        ? 'Sign in to access your dashboard' 
                        : 'Start building your professional portfolio today'}
                    </p>
                  </div>

                  <form onSubmit={currentPage === 'login' ? handleLogin : handleRegister}>
                    {currentPage === 'register' && (
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Jane Doe" 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)} 
                          required 
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="jane.doe@example.com" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="••••••••" 
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required 
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                      {currentPage === 'login' ? 'Sign In' : 'Sign Up Free'}
                    </button>
                  </form>

                  {currentPage === 'login' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.82rem' }}>
                      <span className="auth-link" onClick={() => setCurrentPage('account-recovery')}>Recover via Questions</span>
                      <span className="auth-link" onClick={() => setCurrentPage('forgot-password')}>Forgot Password?</span>
                    </div>
                  )}

                  <div className="auth-divider">or continue with</div>

                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={async () => {
                    if (supabase) {
                      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
                      if (error) showAlert(error.message, 'info');
                    }
                  }}>
                    Continue with Google
                  </button>

                  <div className="auth-footer">
                    {currentPage === 'login' ? (
                      <>Don't have an account? <span className="auth-link" onClick={() => setCurrentPage('register')}>Register here</span></>
                    ) : (
                      <>Already have an account? <span className="auth-link" onClick={() => setCurrentPage('login')}>Sign In</span></>
                    )}
                  </div>
                </div>
              </div>
            )

          case 'forgot-password':
            return (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '24px' }} onClick={() => setCurrentPage('landing')}>
                    <div className="logo-icon">F</div>
                    <span>FolioGo</span>
                  </div>
                  <h2 className="auth-title">Forgot Password</h2>
                  <p className="auth-subtitle">Enter your email and we'll send you a password recovery link.</p>
                  <form onSubmit={handleForgotPassword}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="jane.doe@example.com" 
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Recovery Link</button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span className="auth-link" onClick={() => setCurrentPage('login')}>Back to Sign In</span>
                  </div>
                </div>
              </div>
            )

          case 'reset-password':
            return (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '24px' }} onClick={() => setCurrentPage('landing')}>
                    <div className="logo-icon">F</div>
                    <span>FolioGo</span>
                  </div>
                  <h2 className="auth-title">Reset Password</h2>
                  <p className="auth-subtitle">Choose a strong, secure new password for your account.</p>
                  <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Min 6 characters" 
                        value={userPassword} 
                        onChange={(e) => setUserPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Confirm password" 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Save New Password</button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span className="auth-link" onClick={() => setCurrentPage('login')}>Back to Sign In</span>
                  </div>
                </div>
              </div>
            )

          case 'account-recovery':
            return (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '24px' }} onClick={() => setCurrentPage('landing')}>
                    <div className="logo-icon">F</div>
                    <span>FolioGo</span>
                  </div>
                  <h2 className="auth-title">Account Recovery</h2>
                  <p className="auth-subtitle">Verify your identity via security questions.</p>
                  <form onSubmit={handleAccountRecovery}>
                    <div className="form-group">
                      <label className="form-label">Question 1: What was the name of your first elementary school?</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Your answer" 
                        value={recoveryAnswers.q1} 
                        onChange={(e) => setRecoveryAnswers({ ...recoveryAnswers, q1: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Question 2: What is your mother's maiden name?</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Your answer" 
                        value={recoveryAnswers.q2} 
                        onChange={(e) => setRecoveryAnswers({ ...recoveryAnswers, q2: e.target.value })} 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Verify & Proceed</button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span className="auth-link" onClick={() => setCurrentPage('login')}>Back to Sign In</span>
                  </div>
                </div>
              </div>
            )

          case 'verify-email':
            return (
              <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                  <Mail size={48} style={{ color: 'var(--primary)', margin: '0 auto 16px auto' }} />
                  <h2 className="auth-title">Verify Your Email</h2>
                  <p className="auth-subtitle">Confirm your registration code below.</p>
                  <div className="form-group" style={{ maxWidth: '200px', margin: '20px auto' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="123456" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem' }} 
                      maxLength={6}
                    />
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                    showAlert('Email Verified! Let\'s configure your onboarding profile.', 'success');
                    setCurrentPage('onboarding');
                    setOnboardingStep(2);
                  }}>Verify Email</button>
                </div>
              </div>
            )

          case 'onboarding':
            return (
              <div className="onboarding-page">
                <div className="onboarding-card">
                  <div className="onboarding-steps" style={{ marginBottom: '32px' }}>
                    <div className={`onboarding-step-dot ${onboardingStep >= 2 ? 'active' : ''}`}>1</div>
                    <div className={`onboarding-step-dot ${onboardingStep >= 3 ? 'active' : ''}`}>2</div>
                    <div className={`onboarding-step-dot ${onboardingStep >= 4 ? 'active' : ''}`}>3</div>
                    <div className={`onboarding-step-dot ${onboardingStep >= 5 ? 'active' : ''}`}>4</div>
                  </div>

                  {onboardingStep === 2 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', textAlign: 'center' }}>Select Professional Persona</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        {['Student', 'Professional', 'Freelancer', 'Agency', 'Business'].map(type => (
                          <div 
                            key={type} 
                            style={{
                              border: userType === type ? '2px solid #9AB17A' : '1px solid #ddd',
                              background: userType === type ? 'rgba(154, 177, 122, 0.05)' : '#FFF',
                              padding: '20px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              fontWeight: 600
                            }}
                            onClick={() => setUserType(type)}
                          >
                            <div>{type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Basic Details</h3>
                      
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Professional Title</label>
                        <input type="text" className="form-input" value={onboardingTitle} onChange={(e) => setOnboardingTitle(e.target.value)} />
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Institution / Company</label>
                          <input type="text" className="form-input" value={onboardingUniversity} onChange={(e) => setOnboardingUniversity(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input type="text" className="form-input" value={onboardingLocation} onChange={(e) => setOnboardingLocation(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {onboardingStep === 4 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Resume & Skills Setup</h3>
                      
                      <div className="upload-box" onClick={handleParseResume} style={{ marginBottom: '20px' }}>
                        <UploadCloud className="upload-icon" />
                        {isParsingResume ? (
                          <span>AI Resume Parser extracting details...</span>
                        ) : uploadedResumeName ? (
                          <div>
                            <h4 style={{ color: '#9AB17A' }}>{uploadedResumeName}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Resume parsed!</p>
                          </div>
                        ) : (
                          <div>
                            <h4>Click to Upload PDF Resume</h4>
                            <p style={{ fontSize: '0.8rem', color: '#777' }}>(Auto-extracts profile items)</p>
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Technical & Soft Skills (comma separated)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={onboardingSkills} 
                          onChange={(e) => setOnboardingSkills(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {onboardingStep === 5 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Choose Design Theme</h3>
                      
                      <div className="grid-2" style={{ gap: '16px' }}>
                        {[
                          { id: 'minimal', name: 'Minimal Student', premium: false },
                          { id: 'professional', name: 'Corporate Pro', premium: true },
                          { id: 'modern', name: 'Modern Dark', premium: true },
                          { id: 'creative', name: 'Creative Designer', premium: true }
                        ].map(t => (
                          <div 
                            key={t.id} 
                            style={{
                              border: onboardingTheme === t.id ? '2px solid #9AB17A' : '1px solid #ddd',
                              padding: '20px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              position: 'relative',
                              background: '#FFF'
                            }}
                            onClick={() => {
                              if (t.premium && userPlan === 'Free') {
                                triggerUpgradePrompt(`Upgrade to Pro to select ${t.name} theme.`);
                              } else {
                                setOnboardingTheme(t.id);
                              }
                            }}
                          >
                            <h4 style={{ margin: 0 }}>{t.name}</h4>
                            {t.premium && <span style={{ fontSize: '0.7rem', background: '#3B82F6', color: '#FFF', padding: '2px 6px', borderRadius: '4px', position: 'absolute', top: '8px', right: '8px' }}>PREMIUM</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="onboarding-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                    <button 
                      className="btn btn-secondary" 
                      disabled={onboardingStep === 2}
                      onClick={() => setOnboardingStep(prev => prev - 1)}
                    >
                      Back
                    </button>
                    {onboardingStep < 5 ? (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setOnboardingStep(prev => prev + 1)}
                      >
                        Next
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={handleOnboardingSubmit}
                      >
                        Finish & Build
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )

          case 'checkout':
            return (
              <div className="auth-page">
                <div className="auth-card" style={{ maxWidth: '480px' }}>
                  <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Complete Your Upgrade</h2>
                  
                  <div className="checkout-progress">
                    <div className={`checkout-progress-step ${checkoutStep >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`checkout-progress-step ${checkoutStep >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`checkout-progress-step ${checkoutStep >= 3 ? 'active' : ''}`}>3</div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit}>
                    {checkoutStep === 1 && (
                      <div>
                        <h3>Select Subscription Tier</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          <div 
                            style={{
                              border: selectedCheckoutPlan === 'Pro' ? '2px solid #9AB17A' : '1px solid #ddd',
                              padding: '16px',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedCheckoutPlan('Pro')}
                          >
                            <strong>Student Pro</strong> - $9/month
                            <p style={{ fontSize: '0.78rem', color: '#666', marginTop: '4px' }}>Unlocks premium templates, AI descriptions, and analytics.</p>
                          </div>
                          <div 
                            style={{
                              border: selectedCheckoutPlan === 'Business' ? '2px solid #9AB17A' : '1px solid #ddd',
                              padding: '16px',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedCheckoutPlan('Business')}
                          >
                            <strong>Business / Agency</strong> - $29/month
                            <p style={{ fontSize: '0.78rem', color: '#666', marginTop: '4px' }}>Unlocks custom domains, white labeling, and admin portal.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutStep === 2 && (
                      <div>
                        <h3>Billing Information</h3>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="form-label">Billing Name</label>
                          <input type="text" className="form-input" value={billingInfo.name} onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Street Address</label>
                          <input type="text" className="form-input" value={billingInfo.address} onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })} required />
                        </div>
                        <div className="grid-2">
                          <div className="form-group">
                            <label className="form-label">City</label>
                            <input type="text" className="form-input" value={billingInfo.city} onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Zip / Postal Code</label>
                            <input type="text" className="form-input" value={billingInfo.zip} onChange={(e) => setBillingInfo({ ...billingInfo, zip: e.target.value })} required />
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutStep === 3 && (
                      <div>
                        <h3>Secure Card Payment</h3>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <label className="form-label">Card Number</label>
                          <input type="text" className="form-input" placeholder="4242 4242 4242 4242" value={paymentInfo.cardNumber} onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })} required />
                        </div>
                        <div className="grid-2">
                          <div className="form-group">
                            <label className="form-label">Expiry (MM/YY)</label>
                            <input type="text" className="form-input" placeholder="12/28" value={paymentInfo.expiry} onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVC</label>
                            <input type="text" className="form-input" placeholder="123" value={paymentInfo.cvc} onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })} required />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#666', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #DDD', marginTop: '16px' }}>
                          <Shield size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>Transaction is securely encrypted. SSL active.</span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          if (checkoutStep === 1) setCurrentPage('billing');
                          else setCheckoutStep(prev => prev - 1);
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={isProcessingPayment}>
                        {isProcessingPayment ? (
                          <RefreshCw className="animate-spin" size={14} />
                        ) : checkoutStep < 3 ? (
                          'Continue'
                        ) : (
                          `Pay $${selectedCheckoutPlan === 'Pro' ? '9' : '29'}.00`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )

          case 'dashboard':
          case 'editor':
          case 'billing':
          case 'settings':
          case 'admin':
            return (
              <div className="dashboard-layout">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                  <div>
                    <div className="logo-container" onClick={() => setCurrentPage('landing')}>
                      <div className="logo-icon">F</div>
                      <span>FolioGo</span>
                    </div>

                    <div className="sidebar-menu">
                      <div 
                        className={`sidebar-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('dashboard')}
                      >
                        <LayoutGrid size={18} />
                        <span>Dashboard</span>
                      </div>
                      <div 
                        className={`sidebar-item ${currentPage === 'editor' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('editor')}
                      >
                        <Edit size={18} />
                        <span>Portfolio Editor</span>
                      </div>
                      <div 
                        className={`sidebar-item ${currentPage === 'billing' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('billing')}
                      >
                        <CreditCard size={18} />
                        <span>Billing & Plans</span>
                      </div>
                      <div 
                        className={`sidebar-item ${currentPage === 'settings' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('settings')}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </div>
                      {userPlan === 'Business' && (
                        <div 
                          className={`sidebar-item ${currentPage === 'admin' ? 'active' : ''}`}
                          onClick={() => setCurrentPage('admin')}
                        >
                          <Shield size={18} />
                          <span>Admin Board</span>
                        </div>
                      )}
                      <div 
                        className="sidebar-item"
                        onClick={() => {
                          setCurrentPage('preview');
                        }}
                      >
                        <Eye size={18} />
                        <span>Live Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="sidebar-user">
                    <div className="testimonial-avatar" style={{ background: '#9AB17A', color: '#fff', width: '36px', height: '36px' }}>
                      {portfolioData.name ? portfolioData.name.charAt(0) : 'U'}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {portfolioData.name || 'Anonymous User'}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>{userPlan} Plan</p>
                    </div>
                    <button 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E57373' }} 
                      onClick={async () => {
                        await supabase.auth.signOut();
                        showAlert('Logged out successfully.', 'info');
                        setCurrentPage('landing');
                      }}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                  <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h1 style={{ fontSize: '2rem', margin: 0, textTransform: 'capitalize' }}>
                        {currentPage === 'dashboard' ? 'Overview' : currentPage === 'editor' ? 'Portfolio Editor' : currentPage}
                      </h1>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {currentPage === 'dashboard' && 'Real-time performance and analytics summary.'}
                        {currentPage === 'editor' && 'Add experience, projects, or credentials. Changes auto-preview on the right.'}
                        {currentPage === 'billing' && 'Manage your active subscription billing settings.'}
                        {currentPage === 'settings' && 'Configure custom domains, safety limits, and profile metadata.'}
                        {currentPage === 'admin' && 'System status logs and global user control center.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {portfolioData.name === '' && (
                        <button className="btn btn-secondary btn-sm" onClick={seedDemoData}>
                          Load Demo Template
                        </button>
                      )}

                      {/* Notification Bell Dropdown */}
                      <div className="notification-container">
                        <button className="notification-bell-btn" onClick={() => setShowNotifications(!showNotifications)}>
                          <Bell size={20} />
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
                          )}
                        </button>
                        
                        {showNotifications && (
                          <div className="notification-dropdown">
                            <div className="notification-header">
                              <h4>Notifications</h4>
                              <button 
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer' }}
                                onClick={async () => {
                                  const user = (await supabase.auth.getUser()).data.user;
                                  if (user) {
                                    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
                                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                  }
                                  setShowNotifications(false);
                                }}
                              >
                                Mark all as read
                              </button>
                            </div>
                            <div className="notification-list">
                              {notifications.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>No new notifications</div>
                              ) : (
                                notifications.map(notif => (
                                  <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
                                    <div className="notification-item-icon">
                                      <CheckCircle size={14} color="#9AB17A" />
                                    </div>
                                    <div className="notification-item-content">
                                      <div>{notif.title}</div>
                                      <div className="notification-item-time">{notif.time}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {currentPage === 'editor' && (
                        <button className="btn btn-primary" onClick={handlePublishClick}>
                          Publish Portfolio
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. OVERVIEW PAGE */}
                  {currentPage === 'dashboard' && (
                    <>
                      {portfolioData.name === '' ? (
                        <div className="empty-state-box" style={{ padding: '40px 20px', background: '#FFF', border: '1px solid var(--border)' }}>
                          <Inbox size={40} className="empty-state-icon" />
                          <h3 className="empty-state-title" style={{ fontSize: '1.2rem' }}>Welcome to FolioGo™</h3>
                          <p className="empty-state-desc" style={{ maxWidth: '400px' }}>Your portfolio is blank. Complete onboarding quick actions to launch your live site:</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px', marginTop: '10px' }}>
                            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { setCurrentPage('editor'); setOpenSections({ about: true }); }}>
                              1. Fill in Profile Name & Summary
                            </button>
                            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { setCurrentPage('editor'); setOpenSections({ projects: true }); }}>
                              2. Add Your First Project
                            </button>
                            <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={handleParseResume}>
                              3. Upload & Parse CV PDF
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid-3" style={{ marginBottom: '32px' }}>
                            <div className="metric-card">
                              <div className="metric-info">
                                <span className="metric-label">Visitor Views</span>
                                <span className="metric-value">{analytics.views}</span>
                                <span className="metric-trend up">
                                  <TrendingUp size={12} />
                                  Real-time live traffic
                                </span>
                              </div>
                              <div className="metric-icon-box">
                                <Users size={20} />
                              </div>
                            </div>

                            <div className="metric-card">
                              <div className="metric-info">
                                <span className="metric-label">Unique Visitors</span>
                                <span className="metric-value">{analytics.uniqueVisitors}</span>
                                <span className="metric-trend up">
                                  <TrendingUp size={12} />
                                  Unique IP hashes
                                </span>
                              </div>
                              <div className="metric-icon-box">
                                <Globe size={20} />
                              </div>
                            </div>

                            <div className="metric-card">
                              <div className="metric-info">
                                <span className="metric-label">Resume Downloads</span>
                                <span className="metric-value">{analytics.downloads}</span>
                                <span className="metric-trend down" style={{ color: '#666' }}>
                                  Active downloads
                                </span>
                              </div>
                              <div className="metric-icon-box">
                                <FileText size={20} />
                              </div>
                            </div>
                          </div>

                          <div className="dashboard-grid">
                            <div className="chart-card">
                              <div className="card-header">
                                <h3 style={{ fontSize: '1.1rem' }}>Recruiter Traffic Trends</h3>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Weekly analytics</span>
                              </div>
                              <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0' }}>
                                {[
                                  { day: 'Mon', val: 12 },
                                  { day: 'Tue', val: 18 },
                                  { day: 'Wed', val: 15 },
                                  { day: 'Thu', val: 28 },
                                  { day: 'Fri', val: 32 },
                                  { day: 'Sat', val: 8 },
                                  { day: 'Sun', val: 29 }
                                ].map((d, i) => (
                                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                                    <div style={{ 
                                      width: '32px', 
                                      height: `${d.val * 5}px`, 
                                      background: i === 4 ? 'var(--primary)' : 'var(--secondary)', 
                                      borderRadius: '6px 6px 0 0'
                                    }}></div>
                                    <span style={{ fontSize: '0.75rem', color: '#666' }}>{d.day}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div className="progress-card">
                                <h4 className="progress-header">Portfolio Score</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                  <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{aiScore}%</span>
                                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Ready to share!</span>
                                </div>
                                <div className="progress-bar-bg">
                                  <div className="progress-bar-fill" style={{ width: `${aiScore}%` }}></div>
                                </div>
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  style={{ width: '100%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', marginTop: '14px' }}
                                  onClick={handleRunPortfolioReview}
                                  disabled={isReviewingPortfolio}
                                >
                                  {isReviewingPortfolio ? 'Analyzing...' : 'Re-Evaluate Quality'}
                                </button>
                                {aiRecommendations.length > 0 && (
                                  <div style={{ marginTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>AI Improvement Tips:</span>
                                    <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.78rem', color: '#FFF', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {aiRecommendations.map((rec, i) => (
                                        <li key={i}>{rec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="list-card" style={{ textAlign: 'left' }}>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Quick Actions</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { setCurrentPage('editor'); setOpenSections({ projects: true }); }}>
                                    <Plus size={14} /> Add Project
                                  </button>
                                  <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }} onClick={() => { setCurrentPage('editor'); setOpenSections({ certifications: true }); }}>
                                    <Award size={14} /> Add Certification
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* 2. EDITOR PAGE */}
                  {currentPage === 'editor' && (
                    <div className="builder-layout" style={isPreviewExpanded ? { gridTemplateColumns: '1fr' } : {}}>
                      {!isPreviewExpanded && (
                        <div className="editor-column">
                        
                        {/* Simulation Controls for testing empty/error states */}
                        <div style={{ display: 'flex', gap: '16px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={simulateLoading} onChange={(e) => setSimulateLoading(e.target.checked)} />
                            Simulate Loading State
                          </label>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
                            Simulate Error State
                          </label>
                        </div>

                        {/* About Me Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('about')}>
                            <span>Personal Details & Summary</span>
                            {openSections.about ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.about && (
                            <div className="editor-section-content">
                              {simulateLoading ? (
                                <div className="skeleton-card">
                                  <div className="skeleton-line long"></div>
                                  <div className="skeleton-line medium"></div>
                                  <div className="skeleton-line short"></div>
                                </div>
                              ) : simulateError ? (
                                <div style={{ color: '#EF4444', fontSize: '0.85rem', padding: '10px', background: 'rgba(239,68,68,0.05)', borderRadius: '6px' }}>
                                  <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                  Error retrieving profile details.
                                </div>
                              ) : (
                                <>
                                  <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input 
                                      type="text" 
                                      className="form-input" 
                                      value={portfolioData.name} 
                                      onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })} 
                                    />
                                  </div>
                                  <div className="form-group">
                                     <label className="form-label">Profile Picture</label>
                                     <div 
                                       style={{
                                         border: '2px dashed var(--border)',
                                         borderRadius: '8px',
                                         padding: '20px',
                                         textAlign: 'center',
                                         background: '#F8FAFC',
                                         cursor: 'pointer',
                                         position: 'relative',
                                         transition: 'all 0.2s ease',
                                         display: 'flex',
                                         flexDirection: 'column',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         minHeight: '140px',
                                         gap: '10px'
                                       }}
                                       onDragOver={(e) => {
                                         e.preventDefault();
                                         e.currentTarget.style.borderColor = 'var(--primary)';
                                         e.currentTarget.style.background = 'var(--primary-light)';
                                       }}
                                       onDragLeave={(e) => {
                                         e.preventDefault();
                                         e.currentTarget.style.borderColor = 'var(--border)';
                                         e.currentTarget.style.background = '#F8FAFC';
                                       }}
                                       onDrop={async (e) => {
                                         e.preventDefault();
                                         e.currentTarget.style.borderColor = 'var(--border)';
                                         e.currentTarget.style.background = '#F8FAFC';
                                         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                           const file = e.dataTransfer.files[0];
                                           const reader = new FileReader();
                                           reader.onloadend = () => {
                                             setPortfolioData(prev => ({ ...prev, avatarUrl: reader.result as string }));
                                           };
                                           reader.readAsDataURL(file);
                                           await handleFileUpload(file, 'avatar');
                                         }
                                       }}
                                       onClick={() => {
                                         const fileInput = document.getElementById('avatar-file-input');
                                         if (fileInput) fileInput.click();
                                       }}
                                     >
                                       <input 
                                         type="file" 
                                         id="avatar-file-input" 
                                         accept="image/png, image/jpeg, image/jpg" 
                                         style={{ display: 'none' }} 
                                         onChange={async (e) => {
                                           if (e.target.files && e.target.files[0]) {
                                             const file = e.target.files[0];
                                             const reader = new FileReader();
                                             reader.onloadend = () => {
                                               setPortfolioData(prev => ({ ...prev, avatarUrl: reader.result as string }));
                                             };
                                             reader.readAsDataURL(file);
                                             await handleFileUpload(file, 'avatar');
                                           }
                                         }}
                                       />
                                       {portfolioData.avatarUrl ? (
                                         <div style={{ position: 'relative', display: 'inline-block' }}>
                                           <img 
                                             src={portfolioData.avatarUrl} 
                                             alt="Avatar Preview" 
                                             style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
                                           />
                                           <button 
                                             type="button"
                                             style={{
                                               position: 'absolute',
                                               top: '-5px',
                                               right: '-5px',
                                               background: '#EF4444',
                                               color: '#FFF',
                                               border: 'none',
                                               borderRadius: '50%',
                                               width: '24px',
                                               height: '24px',
                                               display: 'flex',
                                               alignItems: 'center',
                                               justifyContent: 'center',
                                               cursor: 'pointer',
                                               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                             }}
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               setPortfolioData(prev => ({ ...prev, avatarUrl: '' }));
                                             }}
                                           >
                                             <Trash2 size={12} />
                                           </button>
                                         </div>
                                       ) : (
                                         <>
                                           <UploadCloud size={32} color="var(--primary)" />
                                           <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
                                             Drag & drop image here, or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span>
                                           </div>
                                           <div style={{ fontSize: '0.72rem', color: '#999' }}>
                                             Supports JPG, JPEG, PNG (max 2MB)
                                           </div>
                                         </>
                                       )}
                                     </div>
                                   </div>
                                  <div className="form-group">
                                    <label className="form-label">Professional Title</label>
                                    <input 
                                      type="text" 
                                      className="form-input" 
                                      value={portfolioData.title} 
                                      onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })} 
                                    />
                                  </div>
                                  <div className="grid-2">
                                    <div className="form-group">
                                      <label className="form-label">University / Company</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={portfolioData.university} 
                                        onChange={(e) => setPortfolioData({ ...portfolioData, university: e.target.value })} 
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">Location</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={portfolioData.location} 
                                        onChange={(e) => setPortfolioData({ ...portfolioData, location: e.target.value })} 
                                      />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Biography Summary</label>
                                    <textarea 
                                      className="form-textarea" 
                                      value={portfolioData.bio} 
                                      onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })} 
                                    />
                                  </div>
                                  <button className="btn btn-primary btn-sm" onClick={handleSaveProfileSettings}>Save Profile</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Experience Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('experience')}>
                            <span>Work Experience</span>
                            {openSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.experience && (
                            <div className="editor-section-content">
                              {simulateLoading ? (
                                <div className="skeleton-card"><div className="skeleton-line long"></div></div>
                              ) : simulateError ? (
                                <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>Unable to fetch experience modules.</div>
                              ) : (
                                <>
                                  {portfolioData.experience.length === 0 ? (
                                    <div className="empty-state-box">
                                      <BriefcaseIcon className="empty-state-icon" />
                                      <div className="empty-state-title">No experience records added yet</div>
                                      <div className="empty-state-desc">Showcase your past roles, internships, or freelance experience.</div>
                                    </div>
                                  ) : (
                                    portfolioData.experience.map((item) => (
                                      <div key={item.id} className="list-item-card" style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '8px' }}>
                                        <div>
                                          <strong>{item.role}</strong> at {item.company} ({item.duration})
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => {
                                              setEditingExpId(item.id);
                                              setNewExp({ company: item.company, role: item.role, duration: item.duration, description: item.description });
                                              const parts = item.duration.split('-');
                                              if (parts.length === 2) {
                                                const startParts = parts[0].trim().split(' ');
                                                const endParts = parts[1].trim().split(' ');
                                                if (startParts.length === 2) {
                                                  setExpStartMonth(startParts[0]);
                                                  setExpStartYear(startParts[1]);
                                                }
                                                if (parts[1].trim().toLowerCase() === 'present') {
                                                  setExpIsCurrent(true);
                                                } else if (endParts.length === 2) {
                                                  setExpIsCurrent(false);
                                                  setExpEndMonth(endParts[0]);
                                                  setExpEndYear(endParts[1]);
                                                }
                                              }
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                            onClick={() => handleDeleteExperience(item.id)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}

                                  <div style={{ background: '#FFF', border: '1px solid #DDD', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{editingExpId ? 'Edit Experience Role' : 'Add Experience Role'}</h4>
                                    <div className="grid-2">
                                      <div className="form-group">
                                        <label className="form-label">Company</label>
                                        <input type="text" className="form-input" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">Role</label>
                                        <input type="text" className="form-input" value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="grid-2">
                                      <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <select className="form-select" value={expStartMonth} onChange={(e) => setExpStartMonth(e.target.value)}>
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                              <option key={m} value={m}>{m}</option>
                                            ))}
                                          </select>
                                          <select className="form-select" value={expStartYear} onChange={(e) => setExpStartYear(e.target.value)}>
                                            {Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i)).map(y => (
                                              <option key={y} value={y}>{y}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                          {!expIsCurrent && (
                                            <>
                                              <select className="form-select" value={expEndMonth} onChange={(e) => setExpEndMonth(e.target.value)}>
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                  <option key={m} value={m}>{m}</option>
                                                ))}
                                              </select>
                                              <select className="form-select" value={expEndYear} onChange={(e) => setExpEndYear(e.target.value)}>
                                                {Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i)).map(y => (
                                                  <option key={y} value={y}>{y}</option>
                                                ))}
                                              </select>
                                            </>
                                          )}
                                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            <input type="checkbox" checked={expIsCurrent} onChange={(e) => setExpIsCurrent(e.target.checked)} />
                                            Present
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '12px' }}>
                                      <label className="form-label">Description</label>
                                      <textarea className="form-textarea" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className="btn btn-secondary btn-sm" onClick={handleAddExperience}>
                                        {editingExpId ? 'Update Role' : 'Add Role'}
                                      </button>
                                      {editingExpId && (
                                        <button className="btn btn-ghost btn-sm" onClick={() => {
                                          setEditingExpId(null);
                                          setNewExp({ company: '', role: '', duration: '', description: '' });
                                        }}>
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Education Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('education')}>
                            <span>Academic History & Education</span>
                            {openSections.education ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.education && (
                            <div className="editor-section-content">
                              {simulateLoading ? (
                                <div className="skeleton-card"><div className="skeleton-line long"></div></div>
                              ) : simulateError ? (
                                <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>Failed to retrieve education list.</div>
                              ) : (
                                <>
                                  {portfolioData.education.length === 0 ? (
                                    <div className="empty-state-box">
                                      <GraduationCap className="empty-state-icon" />
                                      <div className="empty-state-title">No education credentials added yet</div>
                                      <div className="empty-state-desc">Add schools, degrees, or bootcamp programs.</div>
                                    </div>
                                  ) : (
                                    portfolioData.education.map((item) => (
                                      <div key={item.id} className="list-item-card" style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '8px' }}>
                                        <div>
                                          <strong>{item.degree}</strong> at {item.institution} ({item.duration})
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => {
                                              setEditingEduId(item.id);
                                              setNewEdu({ institution: item.institution, degree: item.degree, duration: item.duration, description: item.description });
                                              const parts = item.duration.split('-');
                                              if (parts.length === 2) {
                                                const startParts = parts[0].trim().split(' ');
                                                const endParts = parts[1].trim().split(' ');
                                                if (startParts.length === 2) {
                                                  setEduStartMonth(startParts[0]);
                                                  setEduStartYear(startParts[1]);
                                                }
                                                if (parts[1].trim().toLowerCase() === 'present') {
                                                  setEduIsCurrent(true);
                                                } else if (endParts.length === 2) {
                                                  setEduIsCurrent(false);
                                                  setEduEndMonth(endParts[0]);
                                                  setEduEndYear(endParts[1]);
                                                }
                                              }
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                            onClick={() => handleDeleteEducation(item.id)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}

                                  <div style={{ background: '#FFF', border: '1px solid #DDD', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{editingEduId ? 'Edit Education' : 'Add Education'}</h4>
                                    <div className="grid-2">
                                      <div className="form-group">
                                        <label className="form-label">Institution</label>
                                        <input type="text" className="form-input" value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">Degree / Certificate</label>
                                        <input type="text" className="form-input" value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="grid-2">
                                      <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <select className="form-select" value={eduStartMonth} onChange={(e) => setEduStartMonth(e.target.value)}>
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                              <option key={m} value={m}>{m}</option>
                                            ))}
                                          </select>
                                          <select className="form-select" value={eduStartYear} onChange={(e) => setEduStartYear(e.target.value)}>
                                            {Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i)).map(y => (
                                              <option key={y} value={y}>{y}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">Graduation Date</label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                          {!eduIsCurrent && (
                                            <>
                                              <select className="form-select" value={eduEndMonth} onChange={(e) => setEduEndMonth(e.target.value)}>
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                  <option key={m} value={m}>{m}</option>
                                                ))}
                                              </select>
                                              <select className="form-select" value={eduEndYear} onChange={(e) => setEduEndYear(e.target.value)}>
                                                {Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i)).map(y => (
                                                  <option key={y} value={y}>{y}</option>
                                                ))}
                                              </select>
                                            </>
                                          )}
                                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            <input type="checkbox" checked={eduIsCurrent} onChange={(e) => setEduIsCurrent(e.target.checked)} />
                                            Present
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '12px' }}>
                                      <label className="form-label">Description (Optional)</label>
                                      <textarea className="form-textarea" value={newEdu.description} onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className="btn btn-secondary btn-sm" onClick={handleAddEducation}>
                                        {editingEduId ? 'Update Education' : 'Add Education'}
                                      </button>
                                      {editingEduId && (
                                        <button className="btn btn-ghost btn-sm" onClick={() => {
                                          setEditingEduId(null);
                                          setNewEdu({ institution: '', degree: '', duration: '', description: '' });
                                        }}>
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Projects Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('projects')}>
                            <span>Featured Projects</span>
                            {openSections.projects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.projects && (
                            <div className="editor-section-content">
                              {simulateLoading ? (
                                <div className="skeleton-card"><div className="skeleton-line long"></div></div>
                              ) : simulateError ? (
                                <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>Failed to retrieve projects list.</div>
                              ) : (
                                <>
                                  {portfolioData.projects.length === 0 ? (
                                    <div className="empty-state-box">
                                      <Layout className="empty-state-icon" />
                                      <div className="empty-state-title">No projects added yet</div>
                                      <div className="empty-state-desc">Add projects to demonstrate your practical technical credentials.</div>
                                    </div>
                                  ) : (
                                    portfolioData.projects.map((item) => (
                                      <div key={item.id} className="list-item-card" style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '8px' }}>
                                        <div>
                                          <strong>{item.name}</strong>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                            onClick={() => {
                                              setEditingProjId(item.id);
                                              setNewProj({ name: item.name, description: item.description, technologies: item.technologies, githubUrl: item.githubUrl, liveUrl: item.liveUrl });
                                            }}
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                            onClick={() => handleDeleteProject(item.id)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}

                                  <div style={{ background: '#FFF', border: '1px solid #DDD', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{editingProjId ? 'Edit Project Block' : 'Add Project Block'}</h4>
                                    
                                    {/* AI Writer Assistant */}
                                    <div style={{ background: 'rgba(154, 177, 122, 0.08)', padding: '14px', borderRadius: '6px', marginBottom: '16px', border: '1px solid rgba(154, 177, 122, 0.2)' }}>
                                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-hover)', display: 'block', marginBottom: '4px' }}>AI Writer Assistant</label>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                          type="text" 
                                          className="form-input" 
                                          style={{ margin: 0, fontSize: '0.8rem' }}
                                          placeholder="e.g. Car loan estimation app using React" 
                                          value={aiProjectPrompt} 
                                          onChange={(e) => setAiProjectPrompt(e.target.value)} 
                                        />
                                        <button 
                                          type="button" 
                                          className="btn btn-primary btn-sm"
                                          disabled={isGeneratingProject}
                                          onClick={handleGenerateProjectDescription}
                                        >
                                          {isGeneratingProject ? 'Generating...' : 'Writer'}
                                        </button>
                                      </div>
                                      {aiProjectOutput && (
                                        <div style={{ marginTop: '10px', background: '#FFF', padding: '8px', borderRadius: '4px', border: '1px solid #DDD', fontSize: '0.78rem' }}>
                                          <div>{aiProjectOutput}</div>
                                          <button 
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            style={{ marginTop: '6px', fontSize: '0.7rem', padding: '2px 8px' }}
                                            onClick={() => setNewProj({ ...newProj, description: aiProjectOutput })}
                                          >
                                            Use this description
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <div className="form-group">
                                      <label className="form-label">Project Name</label>
                                      <input type="text" className="form-input" value={newProj.name} onChange={(e) => setNewProj({ ...newProj, name: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">Description</label>
                                      <textarea className="form-textarea" value={newProj.description} onChange={(e) => setNewProj({ ...newProj, description: e.target.value })} />
                                    </div>
                                    <div className="grid-2">
                                      <div className="form-group">
                                        <label className="form-label">GitHub Repository URL</label>
                                        <input type="text" className="form-input" placeholder="https://github.com/..." value={newProj.githubUrl} onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">Live App URL</label>
                                        <input type="text" className="form-input" placeholder="https://..." value={newProj.liveUrl} onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">Technologies (comma separated)</label>
                                      <input type="text" className="form-input" placeholder="React, TypeScript, CSS" value={newProj.technologies} onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button className="btn btn-secondary btn-sm" onClick={handleAddProject}>
                                        {editingProjId ? 'Update Project' : 'Add Project'}
                                      </button>
                                      {editingProjId && (
                                        <button className="btn btn-ghost btn-sm" onClick={() => {
                                          setEditingProjId(null);
                                          setNewProj({ name: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
                                        }}>
                                          Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Skills Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('skills')}>
                            <span>Technical & Soft Skills</span>
                            {openSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.skills && (
                            <div className="editor-section-content">
                              <div className="form-group">
                                <label className="form-label">Enter Skills (comma separated)</label>
                                <textarea 
                                  className="form-textarea"
                                  placeholder="React, TypeScript, Supabase, Git"
                                  value={portfolioData.skills.join(', ')}
                                  onChange={(e) => setPortfolioData({
                                    ...portfolioData,
                                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                  })}
                                />
                              </div>
                              <button className="btn btn-primary btn-sm" onClick={handleSaveSkills}>Save Skills</button>
                            </div>
                          )}
                        </div>

                        {/* Certifications Section */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('certifications')}>
                            <span>Certifications</span>
                            {openSections.certifications ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.certifications && (
                            <div className="editor-section-content">
                              {portfolioData.certifications.length === 0 ? (
                                <div className="empty-state-box">
                                  <Award className="empty-state-icon" />
                                  <div className="empty-state-title">No credentials added yet</div>
                                  <div className="empty-state-desc">Add industrial badges, certificates, or courses completed.</div>
                                </div>
                              ) : (
                                portfolioData.certifications.map((item) => (
                                  <div key={item.id} className="list-item-card" style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '8px' }}>
                                    <div>
                                      <strong>{item.name}</strong> - {item.issuer} ({item.date})
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button 
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                        onClick={() => {
                                          setEditingCertId(item.id);
                                          setNewCert({ name: item.name, issuer: item.issuer, date: item.date });
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                        onClick={() => handleDeleteCertification(item.id)}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}

                              <div style={{ background: '#FFF', border: '1px solid #DDD', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{editingCertId ? 'Edit Certification' : 'Add Certification'}</h4>
                                <div className="form-group">
                                  <label className="form-label">Name</label>
                                  <input type="text" className="form-input" value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} />
                                </div>
                                <div className="grid-2">
                                  <div className="form-group">
                                    <label className="form-label">Issuer</label>
                                    <input type="text" className="form-input" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Issued Date</label>
                                    <input type="text" className="form-input" placeholder="e.g. Dec 2025" value={newCert.date} onChange={(e) => setNewCert({ ...newCert, date: e.target.value })} />
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button className="btn btn-secondary btn-sm" onClick={handleAddCertification}>
                                    {editingCertId ? 'Update Certification' : 'Add Certification'}
                                  </button>
                                  {editingCertId && (
                                    <button className="btn btn-ghost btn-sm" onClick={() => {
                                      setEditingCertId(null);
                                      setNewCert({ name: '', issuer: '', date: '' });
                                    }}>
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Contact Methods */}
                        <div className="editor-section">
                          <div className="editor-section-header" onClick={() => toggleAccordion('contact')}>
                            <span>Contact & Social Links</span>
                            {openSections.contact ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {openSections.contact && (
                            <div className="editor-section-content">
                              <div className="grid-2">
                                <div className="form-group">
                                  <label className="form-label">Email Address</label>
                                  <input 
                                    type="email" 
                                    className="form-input" 
                                    value={portfolioData.contact.email} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, email: e.target.value }
                                    })} 
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Phone Number</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    value={portfolioData.contact.phone || ''} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, phone: e.target.value }
                                    })} 
                                  />
                                </div>
                              </div>
                              <div className="grid-2">
                                <div className="form-group">
                                  <label className="form-label">Website URL</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="https://yourwebsite.com"
                                    value={portfolioData.contact.website || ''} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, website: e.target.value }
                                    })} 
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">LinkedIn Profile URL</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="https://linkedin.com/in/username"
                                    value={portfolioData.contact.linkedin || ''} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, linkedin: e.target.value }
                                    })} 
                                  />
                                </div>
                              </div>
                              <div className="grid-2">
                                <div className="form-group">
                                  <label className="form-label">GitHub Profile URL</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="https://github.com/username"
                                    value={portfolioData.contact.github || ''} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, github: e.target.value }
                                    })} 
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Behance Profile URL</label>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="https://behance.net/username"
                                    value={portfolioData.contact.behance || ''} 
                                    onChange={(e) => setPortfolioData({
                                      ...portfolioData,
                                      contact: { ...portfolioData.contact, behance: e.target.value }
                                    })} 
                                  />
                                </div>
                              </div>
                              <button className="btn btn-primary btn-sm" onClick={handleSaveProfileSettings}>Save Contact Info</button>
                            </div>
                          )}
                        </div>
                      </div>
                      )}

                      {/* Right Viewport Preview */}
                      <div className="preview-column">
                        <div className="preview-controls">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="viewport-btns">
                              <button className={`viewport-btn ${viewportMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewportMode('desktop')} title="Desktop View"><Monitor size={16} /></button>
                              <button className={`viewport-btn ${viewportMode === 'tablet' ? 'active' : ''}`} onClick={() => setViewportMode('tablet')} title="Tablet View"><Tablet size={16} /></button>
                              <button className={`viewport-btn ${viewportMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewportMode('mobile')} title="Mobile View"><Smartphone size={16} /></button>
                            </div>
                            
                            <button 
                              className={`btn ${isPreviewExpanded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                              onClick={() => {
                                setIsPreviewExpanded(!isPreviewExpanded);
                                if (!isPreviewExpanded) {
                                  setViewportMode('desktop');
                                }
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0, padding: '6px 12px' }}
                            >
                              <Layout size={14} />
                              {isPreviewExpanded ? 'Show Editor' : 'Full Page View'}
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>Theme:</span>
                            <select 
                              className="form-select" 
                              style={{ padding: '4px 24px 4px 12px', fontSize: '0.8rem', width: '130px', margin: 0 }}
                              value={activeTheme}
                              onChange={async (e) => {
                                const val = e.target.value;
                                if (val !== 'minimal' && userPlan === 'Free') {
                                  triggerUpgradePrompt(`Upgrade to Pro to use the ${val} template.`);
                                } else {
                                  setActiveTheme(val);
                                  const user = (await supabase.auth.getUser()).data.user;
                                  if (user) {
                                    await supabase.from('portfolio_settings').update({ template: val }).eq('user_id', user.id);
                                  }
                                }
                              }}
                            >
                              <option value="minimal">Minimal</option>
                              <option value="professional">Professional</option>
                              <option value="modern">Modern</option>
                              <option value="creative">Creative</option>
                            </select>
                          </div>
                        </div>

                        <div className={`preview-viewport ${viewportMode}`}>
                          <div className="preview-frame">
                            <PortfolioRenderer portfolioData={portfolioData} activeTheme={activeTheme} isPreviewMode={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. BILLING PAGE */}
                  {currentPage === 'billing' && (
                    <div style={{ maxWidth: '800px', background: '#FFF', padding: '32px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid #EEE', paddingBottom: '24px' }}>
                        <div>
                          <span className={`status-badge ${userPlan === 'Free' ? 'free' : userPlan === 'Pro' ? 'pro' : 'business'}`} style={{ textTransform: 'uppercase', marginBottom: '8px' }}>
                            {userPlan} Plan
                          </span>
                          <h2 style={{ margin: '4px 0 0 0' }}>Current Billing Settings</h2>
                          <p style={{ color: '#666', fontSize: '0.88rem', marginTop: '4px' }}>
                            {userPlan === 'Free' ? 'You are on the Free version. Upgrade to unlock full production modules.' : 'Next renewal date: July 16, 2026'}
                          </p>
                        </div>
                        {userPlan !== 'Business' && (
                          <button 
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedCheckoutPlan(userPlan === 'Free' ? 'Pro' : 'Business');
                              setCurrentPage('checkout');
                            }}
                          >
                            Upgrade Subscription
                          </button>
                        )}
                      </div>

                      {userPlan !== 'Free' && (
                        <div style={{ marginTop: '24px' }}>
                          <h3>Payment Method</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '8px' }}>
                            <CreditCard size={32} color="var(--primary)" />
                            <div style={{ flex: 1 }}>
                              <strong>Visa ending in 4242</strong>
                              <div style={{ fontSize: '0.78rem', color: '#666' }}>Expires 12/28</div>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={() => showAlert('Payment method edit modal opened.', 'info')}>Edit</button>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: '32px' }}>
                        <h3>Billing Invoice History</h3>
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userPlan === 'Free' ? (
                              <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#777' }}>No billing events found.</td>
                              </tr>
                            ) : (
                              <>
                                <tr>
                                  <td>Jun 15, 2026</td>
                                  <td>FolioGo™ Pro Plan Subscription</td>
                                  <td>$9.00</td>
                                  <td><span className="status-badge active">PAID</span></td>
                                  <td><span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => showAlert('Downloading Invoice PDF...', 'success')}>Download PDF</span></td>
                                </tr>
                                <tr>
                                  <td>May 15, 2026</td>
                                  <td>FolioGo™ Pro Plan Subscription</td>
                                  <td>$9.00</td>
                                  <td><span className="status-badge active">PAID</span></td>
                                  <td><span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => showAlert('Downloading Invoice PDF...', 'success')}>Download PDF</span></td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {userPlan !== 'Free' && (
                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #EEE' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel your premium subscription?')) {
                                const user = (await supabase.auth.getUser()).data.user;
                                if (user) {
                                  await supabase.from('subscriptions').update({ plan: 'Free', status: 'cancelled' }).eq('user_id', user.id);
                                  await logActivity('Subscription Changes', { plan: 'Free', cancelled: true });
                                  setUserPlan('Free');
                                }
                                showAlert('Subscription Cancelled.', 'info');
                              }
                            }}
                          >
                            Cancel Subscription
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. SETTINGS PAGE */}
                  {currentPage === 'settings' && (
                    <div className="settings-layout">
                      <div className="settings-subnav">
                        <button className={`settings-tab-btn ${activeSettingsTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('profile')}>Profile</button>
                        <button className={`settings-tab-btn ${activeSettingsTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('portfolio')}>Portfolio Slug</button>
                        <button className={`settings-tab-btn ${activeSettingsTab === 'domains' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('domains')}>Custom Domains</button>
                        <button className={`settings-tab-btn ${activeSettingsTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('danger')} style={{ color: '#EF4444' }}>Danger Zone</button>
                      </div>

                      <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        {activeSettingsTab === 'profile' && (
                          <div>
                            <h3>Profile Metadata Settings</h3>
                            <div className="form-group" style={{ marginTop: '16px' }}>
                              <label className="form-label">Display Name</label>
                              <input type="text" className="form-input" value={portfolioData.name} onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Professional Role</label>
                              <input type="text" className="form-input" value={portfolioData.title} onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })} />
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={handleSaveProfileSettings}>Save Profile Settings</button>
                          </div>
                        )}

                        {activeSettingsTab === 'portfolio' && (
                          <div>
                            <h3>Portfolio Slug Settings</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Generate a unique slug address mapping to foliogo.com/username.</p>
                            
                            <div className="form-group">
                              <label className="form-label">Custom Slug</label>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ background: '#F0F0F0', border: '1px solid #DDD', padding: '8px 12px', borderRight: 'none', borderRadius: '6px 0 0 6px', fontSize: '0.9rem' }}>foliogo.com/</span>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  style={{ margin: 0, borderRadius: '0 6px 6px 0' }}
                                  value={portfolioSlug} 
                                  onChange={(e) => handleValidateSlug(e.target.value)} 
                                />
                              </div>
                              {slugError && <span style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>{slugError}</span>}
                            </div>

                            <button className="btn btn-primary btn-sm" disabled={!!slugError} onClick={handleSaveSlug}>Save Slug Address</button>
                          </div>
                        )}

                        {activeSettingsTab === 'domains' && (
                          <div>
                            <h3>Custom Domain Mapping</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Map your personal website name directly to your published portfolio.</p>
                            
                            <div className="form-group">
                              <label className="form-label">Domain Name</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="jane-doe.com" 
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                              />
                            </div>

                            {customDomainStatus === 'verified' && (
                              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10B981', color: '#10B981', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '16px' }}>
                                DNS mapping successfully verified! Domain is live.
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  if (userPlan !== 'Business') {
                                    triggerUpgradePrompt('Upgrade to Business to use Custom Domains.');
                                  } else {
                                    handleVerifyDomain();
                                  }
                                }}
                              >
                                {isVerifyingDomain ? 'Verifying...' : 'Verify DNS Records'}
                              </button>
                            </div>

                            <div style={{ marginTop: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '0.8rem' }}>
                              <strong>DNS Settings:</strong>
                              <p style={{ margin: '8px 0 0 0' }}>Configure a CNAME record at your DNS provider pointing to: <code>cname.foliogo.com</code></p>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'danger' && (
                          <div className="danger-zone">
                            <h3>Danger Zone</h3>
                            <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '16px' }}>Once deleted, your account and all published portfolios are permanently removed.</p>
                            <button 
                              className="btn btn-primary" 
                              style={{ background: '#EF4444', borderColor: '#EF4444' }}
                              onClick={async () => {
                                if (window.confirm('Delete your account? This cannot be undone.')) {
                                  const user = (await supabase.auth.getUser()).data.user;
                                  if (user) {
                                    await supabase.from('profiles').delete().eq('user_id', user.id);
                                    await supabase.auth.signOut();
                                  }
                                  setPortfolioData(emptyPortfolio);
                                  setUserPlan('Free');
                                  setCurrentPage('landing');
                                  showAlert('Account deleted.', 'info');
                                }
                              }}
                            >
                              Delete Account Permanently
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 5. ADMIN PAGE */}
                  {currentPage === 'admin' && userPlan === 'Business' && (
                    <div>
                      <div className="admin-tabs">
                        <button className={`admin-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`} onClick={() => setActiveAdminTab('users')}>Users Management</button>
                        <button className={`admin-tab-btn ${activeAdminTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveAdminTab('subscriptions')}>Subscriptions</button>
                        <button className={`admin-tab-btn ${activeAdminTab === 'support' ? 'active' : ''}`} onClick={() => setActiveAdminTab('support')}>Tickets Queue</button>
                        <button className={`admin-tab-btn ${activeAdminTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveAdminTab('analytics')}>Performance Logs</button>
                      </div>

                      {activeAdminTab === 'users' && (
                        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <h3>Registered Platform Users (Database-Driven)</h3>
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Active Plan</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminUsers.length === 0 ? (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Loading platform users...</td>
                                </tr>
                              ) : (
                                adminUsers.map((u, index) => (
                                  <tr key={index}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`status-badge ${u.plan.toLowerCase()}`}>{u.plan}</span></td>
                                    <td><span className="status-badge active">{u.status}</span></td>
                                    <td><span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => showAlert('Edit user plan requested.', 'info')}>Edit Plan</span></td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {activeAdminTab === 'subscriptions' && (
                        <div className="admin-kpi-grid">
                          <div className="metric-card" style={{ background: '#FFF' }}>
                            <span className="metric-label">Monthly Recurring Revenue</span>
                            <span className="metric-value">$8,240</span>
                          </div>
                          <div className="metric-card" style={{ background: '#FFF' }}>
                            <span className="metric-label">Active Premium Subs</span>
                            <span className="metric-value">314</span>
                          </div>
                          <div className="metric-card" style={{ background: '#FFF' }}>
                            <span className="metric-label">Churn Rate</span>
                            <span className="metric-value">1.8%</span>
                          </div>
                        </div>
                      )}

                      {activeAdminTab === 'support' && (
                        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <h3>Open Support Tickets</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div style={{ border: '1px solid #EEE', padding: '16px', borderRadius: '6px' }}>
                              <strong>User: alex.chen@student.um.edu.my</strong>
                              <p style={{ margin: '8px 0' }}>"Unable to map my DNS configuration. Keeps saying record not found."</p>
                              <button className="btn btn-secondary btn-sm" onClick={() => showAlert('Response sent.', 'success')}>Reply Ticket</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeAdminTab === 'analytics' && (
                        <div className="admin-kpi-grid">
                          <div className="metric-card" style={{ background: '#FFF' }}>
                            <span className="metric-label">Server CPU Load</span>
                            <span className="metric-value">12.4%</span>
                          </div>
                          <div className="metric-card" style={{ background: '#FFF' }}>
                            <span className="metric-label">API Load Speed</span>
                            <span className="metric-value">42ms</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </main>
              </div>
            )

          case 'preview':
          case 'published':
            return (
              <div style={{ 
                background: activeTheme === 'modern' ? '#111827' : activeTheme === 'creative' ? '#FDF6EC' : activeTheme === 'professional' ? '#F7FAFC' : '#FFF', 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column' 
              }}>
                {currentPage === 'preview' && (
                  <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    background: '#FFF',
                    borderBottom: '1px solid #EEE',
                    padding: '12px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="logo-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>F</div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A' }}>FolioGo Portfolio View</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>Active Layout Theme:</span>
                      <select 
                        className="form-select" 
                        style={{ padding: '4px 24px 4px 12px', fontSize: '0.8rem', width: '130px', margin: 0 }}
                        value={activeTheme}
                        onChange={(e) => setActiveTheme(e.target.value)}
                      >
                        <option value="minimal">Minimal</option>
                        <option value="professional">Professional</option>
                        <option value="modern">Modern</option>
                        <option value="creative">Creative</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage('editor')}>
                        Back to Editor
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={async () => {
                        showAlert('Resume downloaded!', 'success');
                        await logActivity('Download Resume');
                      }}>
                        <FileText size={14} /> Download Resume PDF
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ flex: 1, width: '100%', minHeight: '100%' }}>
                  <PortfolioRenderer portfolioData={portfolioData} activeTheme={activeTheme} isPreviewMode={false} />
                </div>
              </div>
            )
        }
      })()}

      {/* Upgrade Prompt Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ background: '#FFF', padding: '32px', borderRadius: '8px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
            <h3>Premium Feature Locked</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px', lineHeight: 1.5 }}>
              {upgradeTriggerText || 'Upgrade your subscription tier to unlock premium layouts and custom capabilities.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowUpgradeModal(false)}>Close</button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedCheckoutPlan('Pro');
                  setCurrentPage('checkout');
                }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
