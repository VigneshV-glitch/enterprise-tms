/**
 * Enterprise TMS Design System Tokens
 * Strictly styled to match Supabase Dashboard UI quality & principles.
 */

export const DESIGN_TOKENS = {
  colors: {
    dark: {
      bg: {
        canvas: '#0A0A0A',
        sidebar: '#111111',
        topbar: '#121212',
        cards: '#171717',
        elevated: '#1D1D1D',
        tableHeader: '#1A1A1A',
        hover: '#242424',
        selected: '#2E2E2E',
      },
      border: {
        primary: '#303030',
        divider: '#3A3A3A',
        focus: '#2196F3',
      },
      text: {
        primary: '#FAFAFA',
        secondary: '#D4D4D4',
        muted: '#A3A3A3',
        disabled: '#737373',
      },
    },
    light: {
      bg: {
        canvas: '#F5F7FA',
        sidebar: '#FFFFFF',
        topbar: '#FFFFFF',
        pageContent: '#F5F7FA',
        secondaryPanel: '#FCFCFD',
        drawer: '#FFFFFF',
        modal: '#FFFFFF',
        cards: '#FFFFFF',
        secondaryCard: '#FCFCFD',
        elevated: '#FFFFFF',
        cardHover: '#FAFBFC',
        selectedCard: '#F0F9F6',
        disabledSurface: '#F8FAFC',
        tableHeader: '#F8FAFC',
        hover: '#F1F5F9',
        selected: '#E8EEF6',
      },
      border: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        divider: '#E8EDF3',
        input: '#D5DEE8',
        hover: '#94A3B8',
        focus: '#2196F3',
      },
      text: {
        primaryHeading: '#0F172A',
        secondaryHeading: '#1E293B',
        body: '#334155',
        secondaryText: '#475569',
        mutedText: '#64748B',
        placeholder: '#94A3B8',
        disabled: '#CBD5E1',
      },
    },
    brand: {
      default: '#2196F3',
      hover: '#1E88E5',
      pressed: '#1565C0',
      subtle: 'rgba(33, 150, 243, 0.1)',
      border: 'rgba(33, 150, 243, 0.25)',
    },
    status: {
      active: { bg: 'bg-[#E3F2FD] dark:bg-blue-500/10', text: 'text-[#1976D2] dark:text-blue-400', border: 'border-[#90CAF9] dark:border-blue-500/20' },
      available: { bg: 'bg-[#E3F2FD] dark:bg-blue-500/10', text: 'text-[#1976D2] dark:text-blue-400', border: 'border-[#90CAF9] dark:border-blue-500/20' },
      assigned: { bg: 'bg-[#EFF6FF] dark:bg-blue-500/10', text: 'text-[#1D4ED8] dark:text-blue-400', border: 'border-[#BFDBFE] dark:border-blue-500/20' },
      loading: { bg: 'bg-[#FFFBEB] dark:bg-amber-500/10', text: 'text-[#B45309] dark:text-amber-400', border: 'border-[#FCD34D] dark:border-amber-500/20' },
      unloading: { bg: 'bg-[#FFF7ED] dark:bg-orange-500/10', text: 'text-[#C2410C] dark:text-orange-400', border: 'border-[#FDBA74] dark:border-orange-500/20' },
      in_transit: { bg: 'bg-[#F0F9FF] dark:bg-sky-500/10', text: 'text-[#0369A1] dark:text-sky-400', border: 'border-[#BAE6FD] dark:border-sky-500/20' },
      delayed: { bg: 'bg-[#FEF2F2] dark:bg-rose-500/10', text: 'text-[#DC2626] dark:text-rose-400', border: 'border-[#FECACA] dark:border-rose-500/20' },
      maintenance: { bg: 'bg-[#FAF5FF] dark:bg-purple-500/10', text: 'text-[#7E22CE] dark:text-purple-400', border: 'border-[#D8B4FE] dark:border-purple-500/20' },
      completed: { bg: 'bg-[#E3F2FD] dark:bg-blue-500/10', text: 'text-[#1976D2] dark:text-blue-400', border: 'border-[#90CAF9] dark:border-blue-500/20' },
      draft: { bg: 'bg-[#F8FAFC] dark:bg-slate-500/10', text: 'text-[#64748B] dark:text-slate-400', border: 'border-[#CBD5E1] dark:border-slate-500/20' },
      pending: { bg: 'bg-[#FFFBEB] dark:bg-amber-500/10', text: 'text-[#B45309] dark:text-amber-400', border: 'border-[#FCD34D] dark:border-amber-500/20' },
      cancelled: { bg: 'bg-[#FEF2F2] dark:bg-rose-500/10', text: 'text-[#DC2626] dark:text-rose-400', border: 'border-[#FECACA] dark:border-rose-500/20' },
    },
    charts: {
      gridLines: '#E5E7EB',
      axisText: '#64748B',
      tooltipBg: '#FFFFFF',
      tooltipBorder: '#E5E7EB',
      data: {
        primary: '#2196F3',
        secondary: '#2563EB',
        warning: '#F59E0B',
        critical: '#DC2626',
        neutral: '#94A3B8',
      },
    },
  },
} as const;
