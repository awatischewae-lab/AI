/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  HelpCircle, 
  Settings, 
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  Award,
  Wallet,
  Activity,
  UserCheck
} from 'lucide-react';

import { AgriTurnkeyState, UserProfile, LandInfo, ContractDetails, LandAssessment, FarmingLog, HarvestQC, WalletTransaction } from './types';
import { INITIAL_STATE, CROP_PACKAGES } from './mockData';

// Subcomponents
import Sidebar from './components/Sidebar';
import RegistrationStep from './components/RegistrationStep';
import PackageStep from './components/PackageStep';
import AssessmentStep from './components/AssessmentStep';
import DashboardStep from './components/DashboardStep';
import HarvestStep from './components/HarvestStep';
import WalletStep from './components/WalletStep';

export default function App() {
  // Sync state with localStorage to give continuous experience
  const [appState, setAppState] = useState<AgriTurnkeyState>(() => {
    const saved = localStorage.getItem('agriturnkey_state_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const [currentTab, setCurrentTab] = useState<string>('profile');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notiList, setNotiList] = useState<string[]>([
    'คุณสมเกียรติ ยินดีต้อนรับเข้าสู่อ้อมอกครอบครัว AgriTurnkey ครับ!',
    'ระบบสำรวจสภาพดินอัตโนมัติ (pH: 6.4) ตรวจพบสารอาหารครบถ้วนตามเกณฑ์',
    'แผนการปลูกเมลอนรอบพิเศษถูกจองเข้าล็อกเรียบร้อย รอนัดหมายลงแปลงครับ'
  ]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('agriturnkey_state_v1', JSON.stringify(appState));
  }, [appState]);

  // State sub-setters for cleaner Prop Drilling avoiding large handlers
  const setProfile = (profile: UserProfile) => {
    setAppState(prev => ({ ...prev, profile }));
  };

  const setLand = (land: LandInfo) => {
    setAppState(prev => ({ ...prev, land }));
  };

  const setContract = (contract: ContractDetails) => {
    setAppState(prev => ({ 
      ...prev, 
      contract,
      currentStep: contract.isSigned ? 2 : prev.currentStep // Auto-progression logic when contract signed
    }));
  };

  const setAssessment = (assessment: LandAssessment) => {
    setAppState(prev => ({ ...prev, assessment }));
  };

  const setFarmingLogs = (updater: React.SetStateAction<FarmingLog[]> | FarmingLog[]) => {
    setAppState(prev => {
      const nextLogs = typeof updater === 'function' ? (updater as Function)(prev.farmingLogs) : updater;
      return { ...prev, farmingLogs: nextLogs };
    });
  };

  const setHarvestQC = (harvestQC: HarvestQC) => {
    setAppState(prev => ({ ...prev, harvestQC }));
  };

  const setWalletBalance = (walletBalance: number) => {
    setAppState(prev => ({ ...prev, walletBalance }));
  };

  const setTotalEarned = (totalEarned: number) => {
    setAppState(prev => ({ ...prev, totalEarned }));
  };

  const setTransactions = (updater: React.SetStateAction<WalletTransaction[]> | WalletTransaction[]) => {
    setAppState(prev => {
      const nextTx = typeof updater === 'function' ? (updater as Function)(prev.transactions) : updater;
      return { ...prev, transactions: nextTx };
    });
  };

  const setCurrentStep = (step: number) => {
    setAppState(prev => {
      let isHarvestReady = prev.harvestQC.status;
      let qcStatusVal = prev.harvestQC.qcStatus;
      
      // Auto-set child dependencies when currentStep changes
      if (step >= 3) {
        isHarvestReady = 'harvested';
        qcStatusVal = 'Passed';
      } else {
        isHarvestReady = 'pending';
        qcStatusVal = 'Pending';
      }

      return { 
        ...prev, 
        currentStep: step,
        harvestQC: {
          ...prev.harvestQC,
          status: isHarvestReady,
          qcStatus: qcStatusVal
        }
      };
    });
  };

  // Switch tabs conveniently
  const handleNextTab = (nextId: string) => {
    setCurrentTab(nextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notification clear simulation
  const handleClearNoti = () => {
    setNotiList([]);
    setShowNotifications(false);
  };

  const getSimulatorPhaseName = (stepNum: number) => {
    switch (stepNum) {
      case 1: return 'ประเมินสภาพที่ดิน & ทำสัญญา (Stage 1-2)';
      case 2: return 'กำลังดูแลและบันทึกรายงานฟาร์มสด (Stage 3)';
      case 3: return 'วัดผลผลิต & รายงาน QC (Stage 4-5)';
      case 4: return 'ขายผลผลิต & ปันแบ่งเงิน (Stage 6)';
      default: return 'ประเมินดิน';
    }
  };

  return (
    <div className="min-h-screen bg-organic-cream flex flex-col md:flex-row font-sans text-stone-800 antialiased overflow-x-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={appState.profile}
        currentStep={appState.currentStep}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        simulationPhase={getSimulatorPhaseName(appState.currentStep)}
      />

      {/* Main Panel Content Box */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Controls Bar */}
        <header className="hidden md:flex items-center justify-between bg-organic-cream border-b border-organic-clay px-8 py-4.5 sticky top-0 z-40">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500">ระบบบริหารงาน:</span>
            <span className="text-xs font-serif font-bold bg-organic-sand px-3 py-1 rounded-full border border-organic-clay text-organic-forest">
              {appState.profile.userType === 'landowner' ? 'เจ้าของที่ดิน (Landowner Module)' : 'นักลงทุน (Investor Module)'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Notification trigger bell */}
            <div className="relative">
              <button 
                id="btn-bell-notification"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-stone-500 hover:text-organic-forest rounded-full hover:bg-organic-sand transition-all relative cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {notiList.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-organic-earth ring-2 ring-organic-cream"></span>
                )}
              </button>

              {/* Notification dropdown overlay container */}
              {showNotifications && (
                <div id="noti-dropdown" className="absolute right-0 mt-2.5 w-80 bg-organic-cream border border-organic-clay rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left">
                  <div className="flex items-center justify-between pb-1 border-b border-organic-clay">
                    <span className="text-xs font-bold text-organic-forest font-serif">การแจ้งเตือนสด ({notiList.length})</span>
                    {notiList.length > 0 && (
                      <button onClick={handleClearNoti} className="text-[10px] font-bold text-organic-earth hover:text-organic-forest">ล้างทั้งหมด</button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {notiList.length > 0 ? (
                      notiList.map((n, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-organic-sand text-[11px] leading-normal text-stone-650 border border-organic-clay/20">
                          {n}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-stone-400 py-3 font-sans">ไม่มีรายการแจ้งเตือนใหม่ครับ</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 text-stone-400 hover:text-organic-forest rounded-full hover:bg-organic-sand transition-all cursor-not-allowed">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="h-8 border-r border-organic-clay"></div>
            
            {/* Simple external reference link */}
            <a 
              href="https://awatischewae.gmail.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-sans text-stone-500 hover:text-organic-green flex items-center space-x-1 transition-all"
            >
              <span>{appState.profile.email || 'ศูนย์สนับสนุน'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        {/* Inner page content container layout */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Main conditional rendering based on current selected tab */}
          {currentTab === 'profile' && (
            <RegistrationStep 
              profile={appState.profile}
              setProfile={setProfile}
              land={appState.land}
              setLand={setLand}
              onContinue={() => handleNextTab('contract')}
            />
          )}

          {currentTab === 'contract' && (
            <PackageStep 
              contract={appState.contract}
              setContract={setContract}
              onContinue={() => handleNextTab('assessment')}
            />
          )}

          {currentTab === 'assessment' && (
            <AssessmentStep 
              assessment={appState.assessment}
              setAssessment={setAssessment}
              land={appState.land}
              onContinue={() => handleNextTab('dashboard')}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardStep 
              currentStep={appState.currentStep}
              setCurrentStep={setCurrentStep}
              weeklyUpdates={appState.weeklyUpdates}
              farmingLogs={appState.farmingLogs}
              setFarmingLogs={setFarmingLogs}
              packageId={appState.contract.packageId}
            />
          )}

          {currentTab === 'harvest' && (
            <HarvestStep 
              harvestQC={appState.harvestQC}
              setHarvestQC={setHarvestQC}
              currentStep={appState.currentStep}
              packageId={appState.contract.packageId}
              onContinue={() => handleNextTab('wallet')}
            />
          )}

          {currentTab === 'wallet' && (
            <WalletStep 
              walletBalance={appState.walletBalance}
              setWalletBalance={setWalletBalance}
              totalEarned={appState.totalEarned}
              setTotalEarned={setTotalEarned}
              transactions={appState.transactions}
              setTransactions={setTransactions}
              profile={appState.profile}
              contract={appState.contract}
            />
          )}

        </div>

        {/* Global sticky footer feedback helper */}
        <footer className="bg-organic-sand border-t border-organic-clay py-4.5 px-8 text-center text-xs text-stone-500 font-sans mt-auto">
          <p>© 2026 AgriTurnkey International. นวัตกรรมเกษตรยุคใหม่ ยกระดับชีวิตผู้ร่วมอุดมการณ์และคนรักครอบครัว AgriTurnkey แบบยั่งยืน</p>
        </footer>

      </main>
    </div>
  );
}
