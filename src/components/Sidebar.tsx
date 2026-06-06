/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, 
  FileText, 
  Map, 
  Activity, 
  Award, 
  Wallet, 
  Leaf, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { UserType, UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile;
  currentStep: number; // 1-4
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  simulationPhase: string;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  profile,
  currentStep,
  isMobileOpen,
  setIsMobileOpen,
  simulationPhase
}: SidebarProps) {
  
  const menuItems = [
    {
      id: 'profile',
      label: 'ลงทะเบียน & ที่ดิน',
      labelEn: 'Profile & Land',
      icon: User,
      badge: null
    },
    {
      id: 'contract',
      label: 'แพ็กเกจ & สัญญาอีเมล',
      labelEn: 'Crops & E-Contract',
      icon: FileText,
      badge: currentStep === 1 ? 'รอดำเนินการ' : null
    },
    {
      id: 'assessment',
      label: 'การติดตาม & ตรวจดินน้ำ',
      labelEn: 'Land Assessment',
      icon: Map,
      badge: 'เสร็จสิ้น'
    },
    {
      id: 'dashboard',
      label: 'แดชบอร์ดฟาร์ม Real-time',
      labelEn: 'Smart Monitoring',
      icon: Activity,
      badge: 'สด'
    },
    {
      id: 'harvest',
      label: 'ผลเก็บเกี่ยว & ตรวจ QC',
      labelEn: 'Harvest & QC',
      icon: Award,
      badge: currentStep >= 3 ? 'พร้อม' : null
    },
    {
      id: 'wallet',
      label: 'ถอนเงิน & ส่วนแบ่งกำไร',
      labelEn: 'Wallet & Profits',
      icon: Wallet,
      badge: currentStep === 4 ? 'โอนแล้ว' : null
    },
  ];

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1: return { text: 'เตรียมดิน / ออกแบบ', color: 'bg-organic-earth/10 text-organic-earth border-organic-clay' };
      case 2: return { text: 'กำลังเพาะปลูกอัจฉริยะ', color: 'bg-organic-green/10 text-organic-forest border-organic-green/20 animate-pulse' };
      case 3: return { text: 'เก็บเกี่ยว & ตรวจผลผลิต', color: 'bg-organic-green/20 text-organic-forest border-organic-clay' };
      case 4: return { text: 'ปันผลกำไรสำเร็จ', color: 'bg-organic-forest text-organic-cream border-organic-forest' };
      default: return { text: 'ประเมินดินน้ำ', color: 'bg-stone-100 text-stone-850' };
    }
  };

  const currentStepInfo = getStepLabel(currentStep);

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden bg-organic-sand text-organic-forest p-4 flex items-center justify-between border-b border-organic-clay sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-organic-green" />
          <span className="font-serif font-bold text-lg tracking-tight italic">AgriTurnkey</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${currentStepInfo.color}`}>
            {currentStepInfo.text}
          </span>
          <button id="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-1 focus:outline-none">
            {isMobileOpen ? <X className="h-6 w-6 text-organic-forest" /> : <Menu className="h-6 w-6 text-organic-forest" />}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          id="mobile-backdrop"
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-45 md:relative w-72 bg-organic-sand border-r border-organic-clay flex flex-col justify-between transition-transform duration-300 transform md:transform-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isMobileOpen ? 'top-[61px] md:top-0' : 'top-0'}`}
      >
        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-6">
          {/* Brand Logo - Desktop */}
          <div className="hidden md:flex items-center space-x-3 px-2 mb-2">
            <div className="p-2 bg-organic-green/10 rounded-xl border border-organic-green/20">
              <Leaf className="h-7 w-7 text-organic-green" />
            </div>
            <div>
              <span className="font-serif font-extrabold text-2xl tracking-tight text-organic-forest block italic">AgriTurnkey</span>
              <span className="text-[10px] font-mono text-organic-earth tracking-wider uppercase font-semibold">Turnkey Farming Platform</span>
            </div>
          </div>

          <div className="hidden md:block border-t border-organic-clay/80 my-4"></div>

          {/* User Preview Node */}
          <div className="bg-organic-cream border border-organic-clay rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-organic-green flex items-center justify-center text-organic-cream font-bold font-sans">
                {profile.name ? profile.name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-organic-forest truncate">{profile.name || 'ไม่มีชื่อผู้ใช้งาน'}</p>
                <div className="flex items-center space-x-1.5">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${profile.userType === 'landowner' ? 'bg-organic-green' : 'bg-organic-earth'}`} />
                  <p className="text-[11px] text-stone-500 font-medium tracking-wide">
                    {profile.userType === 'landowner' ? 'เจ้าของที่ดินเปล่า' : 'นักลงทุนเพื่อเกษตร'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="space-y-1.5 pt-2 border-t border-organic-clay">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">สถานะโครงการ:</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${currentStepInfo.color}`}>
                  {currentStepInfo.text}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium font-sans">ระดับจำลอง (Phase):</span>
                <span className="text-organic-green font-mono text-[10px] font-bold bg-organic-green/10 px-2 py-0.5 rounded border border-organic-green/20">
                  {simulationPhase.replace('Stage', 'ระยะบ่มเพาะ')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1 pt-2">
            <span className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase text-organic-earth block mb-2">
              ฟังก์ชั่นระบบและบริการ
            </span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-organic-green text-organic-cream font-medium shadow-md shadow-organic-green/10'
                      : 'text-stone-600 hover:bg-organic-clay/45 hover:text-organic-forest'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-[18px] w-[18px] transition-transform group-hover:scale-105 ${isActive ? 'text-organic-cream' : 'text-stone-400 group-hover:text-organic-green'}`} />
                    <div className="leading-tight">
                      <p className="text-sm font-sans tracking-tight block font-semibold">{item.label}</p>
                      <p className={`text-[10px] font-mono tracking-wider ${isActive ? 'text-organic-light-green' : 'text-stone-400 group-hover:text-organic-earth'}`}>
                        {item.labelEn}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold tracking-wide ${
                      isActive 
                        ? 'bg-organic-forest text-organic-cream border border-organic-green/35' 
                        : 'bg-[#4F6D52]/10 text-organic-green border border-organic-clay'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info block */}
        <div className="p-4 bg-organic-clay/20 border-t border-organic-clay space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono">CONNECTION</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-organic-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-organic-green"></span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-500 font-sans">AgriTurnkey Console</span>
            <span className="text-[10px] text-organic-earth font-mono font-bold">v1.4.2</span>
          </div>
        </div>
      </aside>
    </>
  );
}
