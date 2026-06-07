/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Map, 
  Calendar, 
  Clock, 
  Compass, 
  Activity, 
  Beaker, 
  Droplet, 
  UserCheck, 
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { LandAssessment, LandInfo } from '../types';

interface AssessmentStepProps {
  assessment: LandAssessment;
  setAssessment: (assessment: LandAssessment) => void;
  land: LandInfo;
  onContinue: () => void;
}

export default function AssessmentStep({
  assessment,
  setAssessment,
  land,
  onContinue
}: AssessmentStepProps) {
  
  const [bookDate, setBookDate] = useState<string>(assessment.bookedDate || '2026-06-15');
  const [bookTime, setBookTime] = useState<string>(assessment.bookedTime || '09:00');
  const [soilPH, setSoilPH] = useState<number>(assessment.soilPH || 6.4);
  const [bookingStatus, setBookingStatus] = useState<'none' | 'pending' | 'completed'>(assessment.status);
  
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('pending');
    setAssessment({
      ...assessment,
      bookedDate: bookDate,
      bookedTime: bookTime,
      status: 'pending'
    });
  };

  const handleSimulateAssessment = () => {
    setBookingStatus('completed');
    setAssessment({
      bookedDate: bookDate,
      bookedTime: bookTime,
      status: 'completed',
      soilPH: soilPH,
      npkNutrients: {
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'Medium'
      },
      waterAccess: `เชื่อมขนานแหล่งน้ำธรรมชาติจังหวัด ${land.province} ระยะทาง 200 เมตร มีระบบพุ่มน้ำค้ำชูพร้อมบ่อพักขุดเจาะความลึก 4.5 เมตร`,
      expertRecommendation: `ผลทดสอบพื้นที่ ${land.district} ${land.province} โดดเด่นความหนาแน่นสารอินทรีย์ ดินเป็นดินร่วนทรายมีกรดอ่อน pH ${soilPH} เหมาะสมมากกับ "เมลอนญี่ปุ่น" และ "มะเขือเทศสลัดพรีเมียม" อัตราผลผลิตรอดมาตรฐาน QC กว่า 88%`,
      assessedBy: 'ดร. นงนุช รักสะอาด (หัวหน้าทีมเกษตรวิชาการ integrated agribusiness)'
    });
  };

  const currentStatusDescription = () => {
    if (bookingStatus === 'none') return { text: 'ยังไม่ได้ทำการนัดหมาย', desc: 'กรุณาเลือกวัน-เพื่อส่งโดรนและทีมงานเข้าสำรวจแปลง', class: 'bg-[#FDFCF8] text-stone-700 border-organic-clay' };
    if (bookingStatus === 'pending') return { text: 'จองคิวนัดหมายแล้ว (รอดำเนินการ)', desc: 'ทีมผู้เชี่ยวชาญจะเข้าตรวจดิน ดินขาว น้ำ และสเก็ตช์ภาพฟาร์มตามเวลาที่จอง', class: 'bg-organic-sand text-organic-earth border-organic-clay' };
    return { text: 'ตรวจสองประเมินสำเร็จ (Passed)', desc: 'ข้อมูลดินปุ๋ยพร้อมใช้งานเพาะปลูกอย่างเต็มรูปแบบ', class: 'bg-[#F5F2EA] text-organic-green border-organic-green/40' };
  };

  const statusMeta = currentStatusDescription();

  return (
    <div id="assessment-view" className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-organic-forest tracking-tight italic">ระบบติดตามการลงพื้นที่ & รายงานตรวจดิน-น้ำ</h1>
        <p className="text-xs text-stone-500 font-medium">เก็บสถิติวิทยาการดินเชิงลึกเพื่อการันตีคุณภาพผลผลิตให้แก่ผู้นำเข้าและห้างสรรพสินค้า</p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Booking tool & status card (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-organic-clay">
              <Calendar className="h-5 w-5 text-organic-green" />
              <h2 className="text-base font-serif font-bold text-organic-forest">จองคิวนัดหมายตรวจที่ดินเปล่า</h2>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500">เลือกวันที่ประสงค์รับบริการ</label>
                <input 
                  type="date" 
                  value={bookDate} 
                  required
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500">ช่วงเวลาเข้าพื้นที่</label>
                <select 
                  value={bookTime} 
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                >
                  <option value="09:00">09:00 - 11:30 น. (ช่วงเช้าสภาพดินเปิด)</option>
                  <option value="13:30">13:30 - 16:00 น. (ช่วงบ่ายวัดพลังงานแสงอาทิตย์)</option>
                </select>
              </div>

              <button
                type="submit"
                id="btn-schedule-assessment"
                disabled={bookingStatus !== 'none'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all active:scale-98 shadow-xs flex items-center justify-center space-x-2 ${
                  bookingStatus === 'none'
                    ? 'bg-organic-green text-white hover:bg-organic-forest'
                    : 'bg-[#ECE9DF] text-stone-400 border border-organic-clay cursor-not-allowed'
                }`}
              >
                <span>ยืนยันการทำสัญญานัดหมายสำรวจ</span>
              </button>
            </form>

            {/* Current Status Tracker */}
            <div className={`p-4 rounded-xl border text-left space-y-1.5 ${statusMeta.class}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-extrabold uppercase tracking-widest text-organic-earth">สถานะนัดหมาย</span>
                <span className="text-[10px] font-mono tracking-wider">{bookDate} @ {bookTime} น.</span>
              </div>
              <p className="text-base font-serif font-bold leading-tight">{statusMeta.text}</p>
              <p className="text-xs opacity-90">{statusMeta.desc}</p>

              {bookingStatus === 'pending' && (
                <div className="pt-3 flex flex-col space-y-2">
                  <div className="border-t border-organic-clay/40 my-1"></div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-organic-earth tracking-wide block">จำลองระดับกรดด่างดิน (pH):</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="range" 
                        min="4.5" 
                        max="8.5" 
                        step="0.1" 
                        value={soilPH} 
                        onChange={(e) => setSoilPH(parseFloat(e.target.value))}
                        className="flex-1 accent-organic-green cursor-pointer h-1.5 bg-organic-sand rounded-lg"
                      />
                      <span className="text-xs font-mono font-bold bg-[#FDFCF8] px-2 py-0.5 rounded text-[#2C3E2D] border border-organic-clay">{soilPH}</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    id="btn-simulate-assessment-completion"
                    onClick={handleSimulateAssessment}
                    className="w-full bg-organic-green hover:bg-organic-forest text-white text-[11px] font-bold font-sans py-2.5 rounded-lg cursor-pointer transition-all shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <span>⚡ อนุมัติผลแลปตรวจสภาพดินน้ำ</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Right Side: Land Quality Scientific Report Card (7 columns) */}
        <div className="lg:col-span-7">
          {bookingStatus === 'completed' ? (
            <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-6 text-left">
              
              <div className="flex items-center justify-between pb-3 border-b border-organic-clay">
                <div className="flex items-center space-x-2">
                  <Beaker className="h-5 w-5 text-organic-green" />
                  <h2 className="text-base font-serif font-bold text-organic-forest">รายงานเคมีวิชาการ (Soil & Irrigation Analysis)</h2>
                </div>
                <div className="flex items-center space-x-1 text-[10px] px-2.5 py-0.5 rounded font-serif font-bold bg-[#F5F2EA] text-organic-green border border-organic-clay/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-organic-green" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Dial soil status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Dial ph */}
                <div className="bg-[#FDFCF8] rounded-xl p-4 border border-organic-clay space-y-3">
                  <span className="text-xs font-bold text-stone-500 flex items-center">
                    <Sliders className="h-3.5 w-3.5 mr-1 text-organic-green" /> กรดด่างดิน (Soil pH Dial)
                  </span>
                  
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-3xl font-mono font-extrabold text-[#2C3E2D]">{soilPH}</span>
                    <span className={`text-[11px] py-0.5 px-2.5 rounded-full font-bold ${
                      soilPH >= 6.0 && soilPH <= 7.0 
                        ? 'bg-organic-sand text-organic-green' 
                        : 'bg-[#FFF9F3] text-organic-earth'
                    }`}>
                      {soilPH >= 6.0 && soilPH <= 7.0 ? 'ดินด่างอ่อนปานกลาง (Optimal)' : 'กรดด่างสูง (Need Adjusting)'}
                    </span>
                  </div>

                  {/* Horizontal visual line for pH ranges */}
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-[#E5DCC6] relative overflow-visible">
                      <div className="absolute inset-y-0 left-[40%] right-[30%] bg-organic-green/45 rounded-sm" />
                      {/* indicator */}
                      <div 
                        className="absolute h-3.5 w-3.5 rounded-full bg-organic-forest border-2 border-white top-1/2 -translate-y-1/2 drop-shadow-sm"
                        style={{ left: `${Math.min(Math.max(((soilPH - 4) / 5) * 100, 5), 95)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-stone-400">
                      <span>กรดจัด (4.0)</span>
                      <span className="text-organic-green font-bold">เหมาะสม (6.5)</span>
                      <span>ด่างจัด (9.0)</span>
                    </div>
                  </div>
                </div>

                {/* NPK indicator */}
                <div className="bg-[#FDFCF8] rounded-xl p-4 border border-organic-clay space-y-2">
                  <span className="text-xs font-bold text-stone-500 flex items-center">
                    <Activity className="h-3.5 w-3.5 mr-1 text-organic-green" /> สารอาหารพืชหลัก N-P-K
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="bg-organic-cream p-2 rounded-lg border border-organic-clay">
                      <span className="text-[10px] text-stone-400 block font-mono">N (ไนโตรเจน)</span>
                      <span className="text-xs font-bold text-[#2C3E2D]">Medium</span>
                    </div>
                    <div className="bg-organic-cream p-2 rounded-lg border border-organic-clay">
                      <span className="text-[10px] text-stone-400 block font-mono">P (ฟอสฟอรัส)</span>
                      <span className="text-xs font-bold text-organic-green font-extrabold">High</span>
                    </div>
                    <div className="bg-organic-cream p-2 rounded-lg border border-organic-clay">
                      <span className="text-[10px] text-stone-400 block font-mono">K (โพแทสเซียม)</span>
                      <span className="text-xs font-bold text-[#2C3E2D]">Medium</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Water source description */}
              <div className="bg-[#FDFCF8] rounded-xl p-4 border border-organic-clay text-xs text-stone-600 space-y-1 flex items-start space-x-2.5">
                <Droplet className="h-5 w-5 text-organic-green shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-serif font-bold text-organic-forest">ระบบชลประทานและน้ำบำบัด:</p>
                  <p className="text-stone-550 leading-relaxed">{assessment.waterAccess}</p>
                </div>
              </div>

              {/* Suggestion Card */}
              <div className="bg-organic-sand/65 rounded-xl p-4.5 border border-organic-clay text-xs text-organic-forest space-y-2">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Compass className="h-4 w-4 text-organic-green" />
                  <span className="font-serif">ผลลัพธ์และคำแนะนำจากเกษตรกรวิชาการ</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-left font-sans">{assessment.expertRecommendation}</p>
              </div>

              {/* Inspector Card */}
              <div className="flex items-center space-x-3 pt-3.5 border-t border-organic-clay">
                <div className="h-9 w-9 rounded-full bg-organic-sand flex items-center justify-center text-organic-forest border border-organic-clay">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-400">ลงลายมือตรวจรับรองรายงาน</p>
                  <p className="text-xs font-bold text-[#2C3E2D] font-sans">{assessment.assessedBy}</p>
                </div>
              </div>

              {/* Proceed */}
              <button
                type="button"
                id="btn-goto-dashboard"
                onClick={onContinue}
                className="w-full bg-[#374E39] hover:bg-organic-forest text-white text-xs font-bold font-sans py-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-center space-x-1"
              >
                <span>ประเมินผ่านแล้ว! ไปยัง แดชบอร์ดติดตามฟาร์ม Real-time</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </button>

            </div>
          ) : (
            <div className="bg-[#FDFCF8] rounded-3xl border-2 border-dashed border-organic-clay/80 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-organic-cream flex items-center justify-center text-organic-earth border border-organic-clay/40">
                <Map className="h-7 w-7" />
              </div>
              <div className="max-w-md space-y-1.5">
                <p className="text-base font-serif font-bold text-organic-forest italic">รอยืนยันนัดหมายเพื่อจัดเตรียมรายงาน</p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  เมื่อคุณดำเนินการสมัครข้อมูลที่ดินเสร็จเรียบร้อย ให้กรอกวันเวลาที่ทางโดรนเก็บแลป integrated agribusiness เข้าตรวจสอบ จากนั้นกดปุ่ม "ยืนยันนัดหมาย" และจำลองการส่งรายงานตรวจสภาพสารอาหารดินได้ทันทีครับ
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
