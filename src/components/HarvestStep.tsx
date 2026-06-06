/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck,
  Scale,
  Percent,
  Check,
  Zap
} from 'lucide-react';
import { HarvestQC, CropPackage } from '../types';
import { CROP_PACKAGES } from '../mockData';

interface HarvestStepProps {
  harvestQC: HarvestQC;
  setHarvestQC: (qc: HarvestQC) => void;
  currentStep: number;
  packageId: string | null;
  onContinue: () => void;
}

export default function HarvestStep({
  harvestQC,
  setHarvestQC,
  currentStep,
  packageId,
  onContinue
}: HarvestStepProps) {
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [qcStatusState, setQcStatusState] = useState<'Passed' | 'Pending'>(
    currentStep >= 3 ? 'Passed' : 'Pending'
  );

  const selectedCrop = CROP_PACKAGES.find(p => p.id === packageId) || CROP_PACKAGES[0];

  const triggerAuditScan = () => {
    setIsAuditing(true);
    setAuditProgress(10);
    
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setQcStatusState('Passed');
          setHarvestQC({
            ...harvestQC,
            status: 'harvested',
            qcStatus: 'Passed',
            averageWeightKg: parseFloat((1.5 + Math.random() * 0.3).toFixed(2)),
            brixSweetness: parseFloat((14.2 + Math.random() * 1.5).toFixed(1))
          });
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

    const gradeBreakdowns = [
    { grade: 'Grade A (ส่งออก/ห้างสรรพสินค้าพรีเมียม)', percent: harvestQC.gradeA_Percent, desc: 'ผลกลมสัมบูรณ์ ลายคมนูนชัด รสชาติหวานกรอบฉ่ำ 14+ Brix สำหรับตลาดยกห้างกลุ่มสุข', color: 'bg-organic-green' },
    { grade: 'Grade B (ซูเปอร์มาร์เก็ตทั่วไป)', percent: harvestQC.gradeB_Percent, desc: 'ทรงกลมสวย ลายตาข่ายระดับปานกลาง เนื้อแน่น หวานกลมกล่อม 12-13.5 Brix', color: 'bg-[#C68B59]' },
    { grade: 'Grade C (แปรรูปน้ำปั่น/ผลไม้ตัดแต่ง)', percent: harvestQC.gradeC_Percent, desc: 'ลายตาข่ายไม่หนาแน่น หรือทรงผลเบี้ยวเล็กน้อย รสชาติมาตรฐาน เข้าสู่โรงสลัดคราฟท์', color: 'bg-stone-400' }
  ];

  return (
    <div id="harvest-qc-view" className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-organic-forest tracking-tight italic">หน้าสรุปผลเก็บเกี่ยว & ตรวจสอบคุณภาพ (QC)</h1>
        <p className="text-xs text-stone-550 font-medium">สแกนตรวจสอบรสชาติ ความหวาน น้ำหนัก มาตรฐานความปลอดภัย GAP ก่อนคัดซื้อขึ้นห้าง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Automated scan simulator & Cert (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-6 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-organic-clay">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-organic-green" />
                <h2 className="text-base font-serif font-bold text-organic-forest">ระบบคัดเกรดอัจฉริยะประเมินสเป็ค (Laser Grade Evaluator)</h2>
              </div>
              
              <span className={`text-[10px] uppercase font-serif font-bold px-2.5 py-1 rounded-full border ${
                qcStatusState === 'Passed' 
                  ? 'bg-organic-sand text-organic-green border-organic-clay/35' 
                  : 'bg-[#FFF9F3] text-[#8C6D46] border-organic-clay/40'
              }`}>
                สแกน QC: {qcStatusState === 'Passed' ? 'ประเมินเสร็จสมบูรณ์' : 'รอดำเนินเก็บเกี่ยว'}
              </span>
            </div>

            {/* Interactive Scanner block */}
            <div className="bg-gradient-to-br from-organic-forest to-[#1E2E1F] border border-organic-clay/20 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] text-white">
              <div className="absolute inset-0 opacity-15 bg-grid-white pointer-events-none"></div>

              {isAuditing ? (
                /* Scanning state */
                <div className="space-y-4 z-10 w-full max-w-xs text-center">
                  <div className="relative inline-block mx-auto text-center">
                    <div className="h-16 w-16 mx-auto rounded-3xl bg-organic-sand/15 border-2 border-organic-sand flex items-center justify-center animate-spin text-2xl">
                      🍈
                    </div>
                    {/* Laser line effect */}
                    <div className="absolute left-0 right-0 h-0.5 bg-organic-sand shadow shadow-organic-sand animate-bounce top-1/2" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <p className="text-xs font-mono font-bold tracking-wider text-organic-sand animate-pulse">กำลังสแกนลูกมะเขือ/เมลอน (IoT Laser-QC)</p>
                    <p className="text-[10px] text-stone-300">สแกนตาข่ายลูกน้ำ, ดัชนีหักเห Brix หวาน... {auditProgress}%</p>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-organic-sand" style={{ width: `${auditProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              ) : qcStatusState === 'Passed' ? (
                /* Audit passed */
                <div className="space-y-3 z-10 text-center max-w-sm">
                  <div className="h-12 w-12 rounded-2xl bg-organic-green text-white flex items-center justify-center mx-auto text-xl shadow shadow-black/20">
                    🏆
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-sm font-serif font-bold text-organic-sand tracking-wide uppercase">QC AUDIT: COMPLETED</h3>
                    <p className="text-xs text-stone-300">ผลผลิตได้รับใบกำกับสินค้าเกษตรคุณภาพสูง ปลอดสารเคมีและสารกำจัดแมลงพาราควอต</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-2 text-left font-sans text-xs">
                    <div>
                      <span className="text-stone-305 block text-[10px]">น้ำหนักเฉลี่ยผล</span>
                      <span className="font-mono font-bold text-white">{harvestQC.averageWeightKg} กก. (ตรงสเป็ค A)</span>
                    </div>
                    <div>
                      <span className="text-stone-305 block text-[10px]">ความหวานผลผลทดสอบ</span>
                      <span className="font-serif font-bold text-organic-sand">{harvestQC.brixSweetness} Brix (ผ่านเก๊)</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pre-audit state, prompting to harvest first */
                <div className="space-y-4 z-10 text-center max-w-md">
                  <div className="h-14 w-14 rounded-full bg-white/10 text-organic-sand flex items-center justify-center mx-auto text-xl border border-white/10">
                    🚜
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-serif font-bold text-organic-sand">อยู่ระหว่างการเพาะเลี้ยงและขุนน้ำหนักพืช</h3>
                    <p className="text-xs text-[#ECE9DF] leading-relaxed">
                      เมื่อถึงวันกำหนดเก็บเกี่ยว ({harvestQC.harvstDate}) ผลจะคัดและจัดสรรเข้าตู้อบพลาสม่าเพื่อทดสอบรสชาติ คุณสามารถกดจองประเมินด้านล่างเพื่อทดสอบจำลองได้ทันที
                    </p>
                    <button
                      type="button"
                      id="btn-trigger-automated-qc"
                      onClick={triggerAuditScan}
                      className="bg-organic-sand hover:bg-organic-cream text-[#2C3E2D] text-xs font-serif font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md inline-flex items-center space-x-1.5 transition-all mt-2 active:scale-95 border border-organic-clay/20"
                    >
                      <Zap className="h-3.5 w-3.5 animate-pulse text-organic-green" />
                      <span>สั่งจำลองเก็บเกี่ยว & สแกนตรวจสอบคุณภาพปุ๋ยสากล</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Certification Block */}
            <div className="bg-[#FDFCF8] rounded-2xl p-4 border border-organic-clay flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="text-left">
                <p className="text-xs font-serif font-bold text-organic-forest block">ใบรับรองมาตรฐานเกษตรปลอดภัย GAP (Good Agricultural Practices)</p>
                <span className="text-[10px] text-[#8C6D46] font-mono">ทะเบียนกรมวิชาการเกษตร: {harvestQC.certificateNo} | สถานะความปลอดภัย: มีผลบังคับใช้</span>
              </div>
              <div className="h-14 w-14 bg-organic-cream rounded-3xl border-2 border-organic-green/30 flex items-center justify-center bg-white shadow-inner text-organic-green shrink-0 select-none">
                <span className="text-[10px] font-serif font-extrabold uppercase tracking-wide text-center leading-none">GAP<br/><span className="text-[8px] text-organic-green font-sans font-bold">APPROVED</span></span>
              </div>
            </div>

          </div>
          
        </div>

        {/* Right Column: Weight metrics chart, Grade percentage breakdown (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-5 text-left">
            <h3 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wide border-b border-organic-clay pb-2">สัดส่วนสรุปการคัดแยกเกรดผลผลิต (Grading Report)</h3>
            
            {/* Real Grade progress bars */}
            <div className="space-y-4">
              {gradeBreakdowns.map((g) => (
                <div key={g.grade} className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-organic-forest font-bold font-serif">{g.grade}</span>
                    <span className="font-mono font-bold text-stone-900">{g.percent}%</span>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="h-3 w-full bg-[#ECE9DF] rounded-full overflow-hidden border border-organic-clay/20 flex">
                    <div className={`h-full ${g.color} transition-all duration-1000`} style={{ width: `${g.percent}%` }}></div>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">{g.desc}</p>
                </div>
              ))}
            </div>

            {/* Total metrics summaries */}
            <div className="pt-4 border-t border-organic-clay/60 space-y-1.5 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-stone-450 font-serif">สัญญาร่วมปันกำไร</span>
                <span className="font-bold text-organic-forest">{selectedCrop.nameEn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-450 font-serif">ปริมาณน้ำหนักผลผลิตพรีเมียม</span>
                <span className="font-bold text-organic-forest">{harvestQC.totalYieldKg} กก. (1.45 ตัน)</span>
              </div>
              <div className="flex items-center justify-between font-serif">
                <span className="text-stone-450">มูลค่าตลาดรวมขั้นต้น</span>
                <span className="font-extrabold text-organic-green font-mono">฿380,000 (เฉลี่ย ฿262/กก.)</span>
              </div>
            </div>

            {/* Custom CTA to walletปันผล */}
            <div className="pt-2 text-center">
              <button
                type="button"
                id="btn-goto-wallet"
                disabled={qcStatusState !== 'Passed'}
                onClick={onContinue}
                className={`w-full py-3.5 rounded-xl text-xs font-bold font-serif cursor-pointer transition-all active:scale-98 shadow-xs flex items-center justify-center space-x-1.5 ${
                  qcStatusState === 'Passed'
                    ? 'bg-organic-green text-white hover:bg-organic-forest'
                    : 'bg-[#ECE9DF] text-stone-400 border border-organic-clay/40 cursor-not-allowed'
                }`}
              >
                <span>ขั้นตอนถัดไป (ตรวจสอบรายได้ & ถอนกำไรเข้าธนาคาร)</span>
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
