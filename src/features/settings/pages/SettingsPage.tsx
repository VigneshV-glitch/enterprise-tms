import React from 'react';
import { Settings, Database, Shield, Bell, Server, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';
import { PageHeader } from '../../../shell';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { isSupabaseConfigured } from '../../../lib/supabaseClient';

export const SettingsPage: React.FC = () => {
  const [logoError, setLogoError] = React.useState<string | null>(null);
  const [logoSuccess, setLogoSuccess] = React.useState<boolean>(false);
  const [currentLogo, setCurrentLogo] = React.useState<string | null>(() => localStorage.getItem('custom_app_logo'));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);
    setLogoSuccess(false);

    // Only PNG allowed
    if (file.type !== 'image/png' && !file.name.toLowerCase().endsWith('.png')) {
      setLogoError('Only PNG files are acceptable.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width >= 200 || img.height >= 200) {
          setLogoError(`Dimensions allowed: Less than 200x200. Uploaded dimensions: ${img.width}x${img.height}px.`);
          return;
        }

        // Save to localStorage
        localStorage.setItem('custom_app_logo', dataUrl);
        setCurrentLogo(dataUrl);
        setLogoSuccess(true);
        // Dispatch custom event to notify TopBar immediately
        window.dispatchEvent(new Event('logo-updated'));
      };
      img.onerror = () => {
        setLogoError('Failed to load image. Please verify it is a valid PNG.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    localStorage.removeItem('custom_app_logo');
    setCurrentLogo(null);
    setLogoError(null);
    setLogoSuccess(false);
    window.dispatchEvent(new Event('logo-updated'));
  };

  return (
    <div className="px-4 py-[2px] space-y-6">
      <PageHeader
        title="System Settings & Database Config"
        description="Configure Supabase cloud database credentials, API integrations, and security policies."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e2638] mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              Supabase Database Connection
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Connection Status</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isSupabaseConfigured
                      ? 'Connected to Supabase PostgreSQL Cluster'
                      : 'Running in Local Memory Repository Mode (Mock Mode)'}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {isSupabaseConfigured ? 'Live Supabase' : 'Memory Adapter'}
                </span>
              </div>

              <Input
                label="Supabase Project URL"
                placeholder="https://xyzcompany.supabase.co"
                defaultValue={import.meta.env.VITE_SUPABASE_URL || ''}
              />
              <Input
                label="Supabase Anon Key"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                defaultValue={import.meta.env.VITE_SUPABASE_ANON_KEY || ''}
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary">Save Configuration</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e2638] mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Custom Application Branding
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-slate-900 border border-slate-800 text-xs space-y-3">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-slate-850 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 ${!currentLogo ? 'rounded' : ''}`}>
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Current Custom Logo"
                        className="w-10 h-10 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Zap className="h-6 w-6 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-200">Current Navbar Logo Preview</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {currentLogo 
                        ? 'Using a custom uploaded PNG logo. It is automatically fitted into the 20x20px container.'
                        : 'Using the default Blue Bolt icon.'}
                    </p>
                    {currentLogo && (
                      <button
                        onClick={handleResetLogo}
                        className="text-rose-500 hover:text-rose-400 text-[11px] font-semibold underline block pt-1"
                      >
                        Reset to Default Icon
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Upload Custom PNG Logo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handleLogoUpload}
                    className="block w-full text-xs text-slate-400
                      file:mr-4 file:py-1.5 file:px-3
                      file:rounded-md file:border-0
                      file:text-xs file:font-semibold
                      file:bg-blue-600/10 file:text-blue-400
                      file:cursor-pointer hover:file:bg-blue-600/20
                      border border-slate-800 rounded-md bg-slate-900/50 p-1"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Requirements: Must be a **PNG image** with dimensions **less than 200x200 pixels**.
                </p>

                {logoError && (
                  <div className="p-2.5 rounded bg-rose-950/20 border border-rose-900/30 text-[11px] text-rose-400 font-medium">
                    {logoError}
                  </div>
                )}

                {logoSuccess && (
                  <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-[11px] text-emerald-400 font-medium">
                    Custom logo updated and synchronized successfully!
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e2638] mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-sky-400" />
              Enterprise Architecture
            </h3>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>• Clean Repository Pattern</p>
              <p>• Abstracted Service Layer</p>
              <p>• React 19 + TypeScript Strict</p>
              <p>• TanStack Table + Query</p>
              <p>• Supabase Dashboard UI Tokens</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
