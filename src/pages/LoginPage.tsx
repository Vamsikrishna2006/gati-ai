import React, { useState } from 'react';
import { User } from '../types';
import { SAMPLE_USERS } from '../data/mockData';
import { Layers, ShieldCheck, ArrowRight, CheckCircle2, KeyRound, Lock, Sparkles, Building2, Shield, Smartphone } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState<'sso' | 'personas'>('sso');
  const [selectedUser, setSelectedUser] = useState<User>(SAMPLE_USERS[0]);
  const [govEmail, setGovEmail] = useState('commissioner.morth@gov.in');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('789012');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedUser);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Indian Tricolour Ribbon */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />

      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-blue-400/30">
            <Layers className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white">Gati<span className="text-blue-400">AI</span></span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                भारत सरकार | GOI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              PM Gati Shakti National Master Plan • Officer Portal
            </p>
          </div>
        </div>

        <button
          onClick={onBackToLanding}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-[#0c121d] px-3.5 py-1.5 rounded-full border border-slate-800"
        >
          ← Back to Overview
        </button>
      </header>

      {/* Main Login Card Container */}
      <div className="w-full max-w-lg mx-auto bg-[#0c121d] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto relative z-10">
        {/* Card Header Band */}
        <div className="p-6 bg-[#080b12] border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-600/20 text-blue-300 border border-blue-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> NIC Parichay Single Sign-On (SSO)
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Authorized Officer Login</h2>
          <p className="text-xs text-slate-400 mt-1">
            GatiAI Infrastructure Master Planning & Decision Workbench
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 bg-[#080b12]/80 border-b border-slate-800 text-xs font-bold p-1 gap-1">
          <button
            onClick={() => setActiveTab('sso')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sso'
                ? 'bg-[#0c121d] text-blue-400 border border-slate-700/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4 text-blue-400" /> NIC Gov SSO ID
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personas'
                ? 'bg-[#0c121d] text-emerald-400 border border-slate-700/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> Quick Persona Login
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'sso' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Gov / NIC Email Address</span>
                  <span className="text-[10px] text-amber-400 font-mono">@gov.in or @nic.in</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={govEmail}
                    onChange={(e) => setGovEmail(e.target.value)}
                    required
                    className="w-full bg-[#080b12] border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors pl-9"
                    placeholder="officer@morth.gov.in"
                  />
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              {!otpSent ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" /> Send Mobile OTP via NIC Gateway
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 animate-fadeIn">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <span>OTP sent to linked +91 98*****123</span>
                    <span className="font-mono text-[10px] text-emerald-400">Valid 10m</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                      className="w-full bg-[#080b12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-center font-mono text-base font-extrabold tracking-widest text-emerald-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                  >
                    Verify & Authenticate <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Hackathon Fast-Track Button */}
              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#080b12] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Direct One-Click Judge Access (Bypass)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Select Pre-Authorized Officer Persona
              </div>

              <div className="space-y-2.5">
                {SAMPLE_USERS.map((usr) => {
                  const isSelected = usr.id === selectedUser.id;
                  return (
                    <div
                      key={usr.id}
                      onClick={() => setSelectedUser(usr)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/30'
                          : 'bg-[#080b12] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={usr.avatar} alt={usr.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800" />
                        <div>
                          <div className="font-bold text-xs text-white">{usr.name}</div>
                          <div className="text-[10px] text-slate-400">{usr.department}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
              >
                Launch Master Planning Workbench <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Card Footer Security Badge */}
        <div className="p-3 bg-[#080b12] border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured under IT Act 2000 • Level-3 Encrypted GIS Data Corridor Access</span>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto py-4 text-center text-[11px] text-slate-500">
        <p>National Informatics Centre (NIC) • Ministry of Electronics & IT • PM Gati Shakti NMP</p>
      </footer>
    </div>
  );
};
