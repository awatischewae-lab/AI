/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Thermometer, 
  Droplet, 
  ChevronUp, 
  Sparkles, 
  User, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Check,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';
import { WeeklyUpdate, FarmingLog, CropPackage } from '../types';
import { CROP_PACKAGES } from '../mockData';

interface DashboardStepProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  weeklyUpdates: WeeklyUpdate[];
  farmingLogs: FarmingLog[];
  setFarmingLogs: React.Dispatch<React.SetStateAction<FarmingLog[]>>;
  packageId: string | null;
}

export default function DashboardStep({
  currentStep,
  setCurrentStep,
  weeklyUpdates,
  farmingLogs,
  setFarmingLogs,
  packageId
}: DashboardStepProps) {
  
  const [logActivity, setLogActivity] = useState<string>('');
  const [logCategory, setLogCategory] = useState<'water' | 'fertilizer' | 'qc' | 'general'>('general');
  const [activeWeekTab, setActiveWeekTab] = useState<number>(Math.min(currentStep * 2 - 1, 4));

  // Live fluctuating sensor states (simulate telemetry)
  const [temp, setTemp] = useState<number>(29.8);
  const [moisture, setMoisture] = useState<number>(61.2);
  const [waterPH, setWaterPH] = useState<number>(6.2);
  
  useEffect(() => {
    const timer = setInterval(() => {
      // Small realistic fluctuations
      setTemp(prev => parseFloat((prev + (Math.random() - 0.5) * 0.4).toFixed(1)));
      setMoisture(prev => parseFloat(Math.min(Math.max((prev + (Math.random() - 0.5) * 0.8), 55), 68).toFixed(1)));
      setWaterPH(prev => parseFloat(Math.min(Math.max((prev + (Math.random() - 0.5) * 0.05), 5.8), 6.6).toFixed(2)));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const selectedCrop = CROP_PACKAGES.find(p => p.id === packageId) || CROP_PACKAGES[0];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActivity.trim()) return;

    const newLog: FarmingLog = {
      id: `log_custom_${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      activity: logActivity,
      category: logCategory,
      notes: 'บันทึกตามคำสั่งเร่งด่วนสั่งการของผู้ถือสัญญาร่วมทุน',
      operator: 'ทีมงาน integrated agribusiness ประจำสวน'
    };

    setFarmingLogs(prev => [newLog, ...prev]);
    setLogActivity('');
  };

  const cycleSteps = [
    { num: 1, label: 'เตรียมดิน / สำรวจ', desc: 'ดินแห้ง ปรับแต่งสภาพโรงเรือนอัจฉริยะ', activeColor: 'bg-amber-500 text-white' },
    { num: 2, label: 'เพาะปลูกอัจฉริยะ', desc: 'ให้น้ำหยดปุ๋ยนาโน ระบบ IoT ดูแล', activeColor: 'bg-emerald-600 text-white' },
    { num: 3, label: 'เก็บเกี่ยว & ตรวจ QC', desc: 'ตัดคัดขนาด ชั่งน้ำหนัก วัดความหวาน', activeColor: 'bg-sky-600 text-white' },
    { num: 4, label: 'ส่วนแบ่งกำไร / ถอน', desc: 'ส่งตรงห้างสุรุ่ยปันปอน บัญชีปันผล', activeColor: 'bg-purple-600 text-white' }
  ];

  // Specific high quality illustration representation depending on chosen tab
  const getWeekImageUrl = (weekNum: number) => {
    switch (weekNum) {
      case 1: return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600';
      case 2: return 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600';
      case 3: return 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600';
      case 4: return 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600';
      default: return 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600';
    }
  };

  return (
    <div id="monitoring-dashboard-view" className="space-y-6">
      
      {/* Simulation phase shortcut */}
      <div className="bg-[#2C3E2D] border border-organic-clay/20 text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-organic-sand/15 rounded-xl text-organic-sand">
            <Zap className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-organic-sand block animate-pulse">SIMULATION SIMULATOR CONTROL</span>
            <p className="text-xs text-stone-200">จำลองการเติบโต เปลี่ยนระยะเวลาของพืชเพื่อตรวจสอบฟีเจอร์รายงาน QC และเมนูกระเป๋าเงินได้ทันที</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {cycleSteps.map((step) => {
            const isCurrent = currentStep === step.num;
            return (
              <button
                key={step.num}
                id={`simulate-btn-step-${step.num}`}
                onClick={() => {
                  setCurrentStep(step.num);
                  setActiveWeekTab(Math.min(step.num * 1.25, 4));
                }}
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-serif font-bold transition-all ${
                  isCurrent 
                    ? 'bg-organic-sand text-[#2C3E2D] border-organic-clay/50 shadow-xs' 
                    : 'bg-[#1E2E1F] hover:bg-[#253926] text-organic-cream/80 border-organic-clay/10'
                }`}
              >
                เฟส {step.num}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Cultivation Process Progress Timeline */}
      <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
        <div className="flex items-center space-x-2">
          <Layers className="h-4.5 w-4.5 text-organic-green" />
          <h2 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">ผังวงจรกระบวนการเทิร์นคีย์ฟาร์ม (Cycle Timeline)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cycleSteps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <div 
                key={s.num} 
                className={`p-3.5 rounded-xl border relative overflow-hidden transition-all ${
                  isCurrent 
                    ? 'border-[#7B9E7D] ring-2 ring-organic-green/10 bg-white px-4' 
                    : isCompleted 
                      ? 'border-organic-clay/40 bg-organic-sand/25' 
                      : 'border-organic-clay/20 bg-white/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isCurrent ? 'bg-organic-green text-white' : isCompleted ? 'bg-organic-clay/50 text-[#5C4D32]' : 'bg-organic-cream border border-organic-clay/20 text-stone-400'
                  }`}>
                    ขั้นตอนที่ {s.num}
                  </span>
                  {isCompleted && (
                    <Check className="h-4 w-4 text-organic-green stroke-[3]" />
                  )}
                  {isCurrent && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-organic-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-organic-green"></span>
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-serif font-bold text-[#2C3E2D] truncate">{s.label}</h3>
                <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main dashboard core elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Video stream/Timeline, Air and soil monitoring (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Real-time Telemetry Sensors (Gauges) */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-organic-clay">
              <div className="flex items-center space-x-2">
                <Activity className="h-4.5 w-4.5 text-organic-green" />
                <h2 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">เซนเซอร์ตรวจวัดฟาร์มอัจฉริยะแบบสด (Live IoT Telemetry)</h2>
              </div>
              <span className="text-[10px] bg-[#FFF2F0] text-rose-800 border border-rose-200/50 font-mono font-bold px-2.5 py-0.5 rounded-full animate-pulse flex items-center">
                ● Live Streaming
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Temp gauge */}
              <div className="bg-[#FDFCF8] rounded-2xl p-3.5 border border-organic-clay space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-500">
                  <span className="text-orange-500">🌡️</span>
                  <span className="text-[11px] font-serif font-bold text-organic-earth">อุณหภูมิอากาศ</span>
                </div>
                <p className="text-2xl font-mono font-extrabold text-organic-forest">{temp} °C</p>
                <div className="h-1 bg-organic-clay/20 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#C68B59]" style={{ width: `${(temp / 45) * 100}%` }}></div>
                </div>
                <span className="text-[9px] text-stone-400 font-medium font-sans">ค่าควบคุมกลาง: 28-32 °C</span>
              </div>

              {/* Humidity gauge */}
              <div className="bg-[#FDFCF8] rounded-2xl p-3.5 border border-organic-clay space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-500">
                  <span className="text-emerald-500">💧</span>
                  <span className="text-[11px] font-serif font-bold text-organic-earth">ความชื้นในดิน</span>
                </div>
                <p className="text-2xl font-mono font-extrabold text-[#2C3E2D]">{moisture}%</p>
                <div className="h-1 bg-organic-clay/20 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-organic-green" style={{ width: `${moisture}%` }}></div>
                </div>
                <span className="text-[9px] text-stone-400 font-medium font-sans">ค่าควบคุมกลาง: 55%-65%</span>
              </div>

              {/* Water pH gauge */}
              <div className="bg-[#FDFCF8] rounded-2xl p-3.5 border border-organic-clay space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-500">
                  <span className="text-emerald-500">●</span>
                  <span className="text-[11px] font-serif font-bold text-organic-earth">ค่ากรดด่างในน้ำหยด</span>
                </div>
                <p className="text-2xl font-mono font-extrabold text-organic-green">{waterPH}</p>
                <div className="h-1 bg-organic-clay/20 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#7B9E7D]" style={{ width: `${(waterPH / 14) * 100}%` }}></div>
                </div>
                <span className="text-[9px] text-stone-400 font-medium font-sans">ค่าเพื่อการดูดซึมดีสุด: 6.2</span>
              </div>

              {/* Plant height meter */}
              <div className="bg-[#FDFCF8] rounded-2xl p-3.5 border border-organic-clay space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-500">
                  <span className="text-[#8C6D46]">🌿</span>
                  <span className="text-[11px] font-serif font-bold text-organic-earth">ความสูงทรงค้าง</span>
                </div>
                <p className="text-2xl font-mono font-extrabold text-[#2C3E2D]">
                  {currentStep === 1 ? '12' : currentStep === 2 ? '135' : '150'} ซม.
                </p>
                <div className="h-1 bg-organic-clay/20 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-organic-green" style={{ width: `${currentStep === 1 ? 10 : currentStep === 2 ? 80 : 100}%` }}></div>
                </div>
                <span className="text-[9px] text-stone-400 font-medium font-sans">ระยะออกตาข่ายผล</span>
              </div>

            </div>
          </div>

          {/* High resolution Weekly photo update diary */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-organic-clay pb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4.5 w-4.5 text-organic-green" />
                <h2 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">บันทึกรูปภาพและวิศวกรรมเพาะปลูกรายสัปดาห์ (Weekly Feed)</h2>
              </div>
              <div className="flex space-x-1 justify-start">
                {[1, 2, 3, 4].map((wk) => (
                  <button
                    key={wk}
                    id={`btn-week-tab-${wk}`}
                    onClick={() => setActiveWeekTab(wk)}
                    className={`text-[10px] font-serif font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                      activeWeekTab === wk 
                        ? 'bg-organic-green text-white' 
                        : 'bg-organic-sand text-[#5C4D32] hover:bg-organic-cream border border-organic-clay/35'
                    }`}
                  >
                    สัปดาห์ {wk}
                  </button>
                ))}
              </div>
            </div>

            {/* Render selected weekly diary details */}
            {weeklyUpdates.find(u => u.week === activeWeekTab) ? (
              (() => {
                const update = weeklyUpdates.find(u => u.week === activeWeekTab)!;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-organic-clay/40 shadow-xs">
                      <img 
                        src={getWeekImageUrl(update.week)}
                        alt={update.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-bold font-mono text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm shadow border border-white/10">
                        DATE METADATA: {update.date}
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-2.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] uppercase font-serif font-bold tracking-wider text-organic-green bg-organic-sand/50 px-2.5 py-0.5 rounded-full border border-organic-clay/35">สัปดาห์ที่ {update.week}</span>
                        <div className="border border-organic-clay py-0.5 px-2.5 rounded-xl font-mono text-[9px] font-bold text-[#8C6D46] bg-[#FDFCF8] shadow-xs">🌡️ {update.temperature}°C | 💧 {update.soilMoisture}%</div>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-organic-forest italic">{update.title}</h3>
                      <p className="text-xs text-stone-550 leading-relaxed font-sans">{update.description}</p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center font-serif">สัปดาห์นี้ยังไม่มีการบันทึกภาพ เนื่องจากพืชเพิ่งเริ่มเตรียมดิน</p>
            )}

          </div>

          {/* Farming Operations Diary logs (Table style lists) */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-organic-clay">
              <div className="flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5 text-organic-green" />
                <h2 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">บันทึกขั้นตอนสืบเสาะดูแลแบบบันทึก (Farming Action Log)</h2>
              </div>
              <span className="text-[10px] text-stone-500 font-medium">แสดงล่าสุด 4 รายการ</span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {farmingLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-[#FDFCF8] text-xs rounded-2xl flex items-start justify-between border border-organic-clay shadow-xs">
                  <div className="space-y-1.5 flex-1 min-w-0 pr-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        log.category === 'water' ? 'bg-organic-sand text-organic-green border-organic-green/20' :
                        log.category === 'fertilizer' ? 'bg-[#FCF5E3] text-[#8C6D46] border-[#ECDDBA]' :
                        log.category === 'growth' ? 'bg-organic-sand/65 text-organic-green border-organic-clay/20' :
                        'bg-[#ECE9DF] text-stone-700 border-organic-clay/10'
                      }`}>
                        {log.category}
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">{log.date}</span>
                    </div>
                    <p className="font-serif font-bold text-organic-forest">{log.activity}</p>
                    <p className="text-stone-400 leading-tight block truncate text-[11px]">หมายเหตุ: {log.notes}</p>
                  </div>
                  <div className="text-right text-[10px] font-sans font-medium text-stone-400 shrink-0">
                    <span className="text-organic-forest font-bold block font-serif">{log.operator}</span>
                    <span>ผู้บันทึก</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Demand Form input */}
            <form onSubmit={handleAddLog} className="pt-3 border-t border-organic-clay flex flex-col sm:flex-row gap-3">
              <select
                value={logCategory}
                onChange={(e: any) => setLogCategory(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none"
              >
                <option value="general">ทั่วไป/ตรวจสอบ</option>
                <option value="water">คำสั่งรดน้ำ</option>
                <option value="fertilizer">ปรับแต่งปุ๋ยแร่ธาตุ</option>
              </select>
              
              <input 
                type="text"
                required
                value={logActivity}
                onChange={(e) => setLogActivity(e.target.value)}
                placeholder="พิมพ์คำสั่งหรือกิจกรรมเพิ่มเติม เช่น สั่งพ่นสารไล่แมล่งออแกนิคตอนเย็น..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              />

              <button
                type="submit"
                id="btn-add-farm-instruction"
                className="bg-organic-green hover:bg-organic-forest text-white font-bold text-xs font-serif px-4 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-xs flex items-center justify-center space-x-1 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>บันทึกส่งแปลง</span>
              </button>
            </form>

          </div>

        </div>

        {/* Right column: Expert Farm Partner Profile Bubble, Weather (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Farm Manager Chat Bubble */}
          <div className="bg-gradient-to-br from-organic-forest to-[#1A261B] border border-organic-clay/35 p-6 rounded-3xl shadow-sm text-white text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5">
              <Sparkles className="h-44 w-44 text-organic-sand" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="h-11 w-11 rounded-3xl bg-[#1E2E1F] border-2 border-organic-clay overflow-hidden shrink-0 flex items-center justify-center text-xl">
                  🍈
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-organic-sand font-sans">สมชาติ รักษาสกุล</h3>
                  <p className="text-[10px] text-organic-sand/85 font-mono tracking-wider">ผู้จัดการฟาร์มประจำแปลงสระบุรี</p>
                </div>
              </div>

              {/* Message */}
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs leading-relaxed space-y-2 text-stone-100">
                <p>
                  "สวัสดีครับคุณผู้ร่วมทุน ตอนนี้ต้นเมลอนอัจฉริยะกำลังผลิดอกสร้างลาย Netting ที่สมบูรณ์แบบมากครับ 
                  อัตราความหวานสะสมวัดจากเซนเซอร์แสงและสารสะสมของพืชพุ่งสูงเป็นที่น่าพอใจ"
                </p>
                <p className="text-organic-sand font-bold font-serif italic">
                  "คาดว่ารอบเก็บเกี่ยว {weeklyUpdates.length} สัปดาห์นี้จะคัดเกรดพรีเมียม A ทะลุเป้าที่ 88% ได้อย่างแน่นอน นอนใจได้เลยครับ!"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-300">
                <span className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-organic-sand mr-1.5"></span> เชื่อมสายตรง IoT
                </span>
                <span className="font-mono">อัปเดตเมื่อ: วันนี้ 08:30 น.</span>
              </div>
            </div>
          </div>

          {/* Quick Stats: Estimated earnings list */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm text-left space-y-4">
            <h3 className="text-xs font-serif font-bold text-organic-earth uppercase tracking-wider block">สถิติค่าสัมประสิทธิ์โครงการ</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#FDFCF8] rounded-xl border border-organic-clay flex items-center justify-between text-xs">
                <span className="text-stone-450 font-serif">สายพืชร่วมแบ่ง</span>
                <span className="font-bold text-organic-forest">{selectedCrop.nameEn}</span>
              </div>
              <div className="p-3 bg-[#FDFCF8] rounded-xl border border-organic-clay flex items-center justify-between text-xs">
                <span className="text-stone-450 flex items-center font-serif">
                  ประมาณการผลผลิต
                </span>
                <span className="font-bold text-organic-forest">1,450 กิโลกรัม (1.45 ตัน)</span>
              </div>
              <div className="p-3 bg-[#FDFCF8] rounded-xl border border-organic-clay flex items-center justify-between text-xs">
                <span className="text-stone-450 font-serif">เกณฑ์รับซื้อส่งมอบ</span>
                <span className="font-bold text-organic-green">Gourmet Market / Lemon Farm</span>
              </div>
              <div className="p-3 bg-organic-sand/50 hover:bg-organic-sand/70 rounded-2xl border border-organic-clay flex items-center justify-between text-xs transition-colors shadow-xs">
                <span className="text-organic-forest font-serif font-bold">ส่วนแบ่งคาดการณ์ (บาท)</span>
                <span className="font-mono font-extrabold text-organic-green text-sm">฿147,000 - ฿182,000</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
