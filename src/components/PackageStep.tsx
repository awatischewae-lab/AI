/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCheck, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  X, 
  Check, 
  Edit3, 
  Layers, 
  Clock, 
  Info,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { CropPackage, ContractDetails } from '../types';
import { CROP_PACKAGES } from '../mockData';

interface PackageStepProps {
  contract: ContractDetails;
  setContract: (contract: ContractDetails) => void;
  onContinue: () => void;
}

export default function PackageStep({
  contract,
  setContract,
  onContinue
}: PackageStepProps) {
  
  const [selectedId, setSelectedId] = useState<string>(contract.packageId || CROP_PACKAGES[0].id);
  const [typedSignName, setTypedSignName] = useState<string>(contract.signedName || '');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(contract.isSigned);
  const [signMethod, setSignMethod] = useState<'draw' | 'type'>('draw');
  const [signatureSaved, setSignatureSaved] = useState<boolean>(contract.isSigned);
  const [canvasCleared, setCanvasCleared] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  const selectedCrop = CROP_PACKAGES.find(p => p.id === selectedId) || CROP_PACKAGES[0];

  // Initialize canvas drawing behavior
  useEffect(() => {
    if (signMethod === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#374E39'; // Organic Forest deep organic green
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signMethod, selectedId]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setCanvasCleared(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasCleared(true);
    }
  };

  const submitContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    const signatureToSave = signMethod === 'type' ? typedSignName : 'ลายมือเขียนผ่านระบบอิเล็กทรอนิกส์';

    setContract({
      packageId: selectedId,
      signedName: signatureToSave,
      signedDate: new Date().toISOString().split('T')[0],
      isSigned: true,
      profitShareOwner: selectedCrop.profitShareOwner,
      profitSharePlatform: selectedCrop.profitSharePlatform
    });

    setSignatureSaved(true);
    
    // Smooth scroll to action card or timeout alert
    setTimeout(() => {
      onContinue();
    }, 1500);
  };

  const handleResetContract = () => {
    setContract({
      packageId: null,
      signedName: '',
      signedDate: '',
      isSigned: false,
      profitShareOwner: 0,
      profitSharePlatform: 0
    });
    setSignatureSaved(false);
    setAgreedTerms(false);
    setTypedSignName('');
    setTimeout(() => {
      clearCanvas();
    }, 100);
  };

  return (
    <div id="package-view" className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-left">
          <h1 className="text-2xl font-serif font-bold text-organic-forest tracking-tight italic">เลือกแพ็กเกจเพาะปลูก & ทำสัญญาอิเล็กทรอนิกส์</h1>
          <p className="text-xs text-stone-500 font-medium">สแกนตรวจสอบสัดส่วนการแบ่งกำไร (Profit Sharing) พร้อมลงนามเริ่มต้นโครงการทันที</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-serif font-bold bg-organic-sand border border-organic-clay text-organic-earth px-4.5 py-2 rounded-full self-start sm:self-center">
          <ShieldCheck className="h-3.5 w-3.5 text-organic-green" />
          <span>E-Signature มีผลตามพ.ร.บ.ธุรกรรมฯ 2569</span>
        </div>
      </div>

      {/* Grid: 3 Packages Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CROP_PACKAGES.map((crop) => {
          const isSelected = selectedId === crop.id;
          return (
            <div
              key={crop.id}
              onClick={() => {
                if (!signatureSaved) {
                  setSelectedId(crop.id);
                }
              }}
              id={`crop-card-${crop.id}`}
              className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                isSelected 
                  ? 'border-organic-green bg-[#F5F2EA] shadow-md scale-[1.01]' 
                  : signatureSaved 
                    ? 'border-organic-clay bg-[#FDFCF8] opacity-60 cursor-not-allowed'
                    : 'border-organic-clay bg-organic-cream hover:border-organic-green/45'
              }`}
            >
              <div className="space-y-4">
                {/* Image Placeholder with crop color */}
                <div className={`h-36 rounded-xl relative flex items-center justify-center overflow-hidden border ${
                  crop.id === 'melon_premium' ? 'bg-gradient-to-br from-organic-sand to-organic-cream border-organic-clay' :
                  crop.id === 'cherry_tomato' ? 'bg-gradient-to-br from-organic-sand to-[#FFF9F3] border-organic-clay' :
                  'bg-gradient-to-br from-organic-sand to-[#FFFDF9] border-organic-clay'
                }`}>
                  <div className="absolute inset-0 opacity-10 bg-grid-slate-900 pointer-events-none"></div>

                  {/* Draw beautiful botanical icons depending on crop */}
                  {crop.id === 'melon_premium' && (
                    <div className="text-center space-y-1 z-10">
                      <div className="h-14 w-14 rounded-full bg-organic-green text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">🍈</div>
                      <span className="text-[10px] font-mono font-bold bg-[#374E39] text-white px-2 py-0.5 rounded-full">GREENHOUSE IoT</span>
                    </div>
                  )}

                  {crop.id === 'cherry_tomato' && (
                    <div className="text-center space-y-1 z-10">
                      <div className="h-14 w-14 rounded-full bg-[#8C6D46] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">🍅</div>
                      <span className="text-[10px] font-mono font-bold bg-[#7A5C3E] text-white px-2 py-0.5 rounded-full">ORGANIC VEG</span>
                    </div>
                  )}

                  {crop.id === 'durian_monthong' && (
                    <div className="text-center space-y-1 z-10">
                      <div className="h-14 w-14 rounded-full bg-[#A28A5E] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">👑</div>
                      <span className="text-[10px] font-mono font-bold bg-organic-forest text-white px-2 py-0.5 rounded-full">GOLD ECONOMY</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-serif font-extrabold text-organic-earth uppercase tracking-wider">{crop.category}</span>
                  <h3 className="text-base font-serif font-bold text-organic-forest leading-tight italic">{crop.name}</h3>
                  <p className="text-xs text-stone-550 line-clamp-3 leading-relaxed">{crop.description}</p>
                </div>

                <div className="border-t border-organic-clay/60 pt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">เงินลงทุนเริ่มต้น / โรงเรือน</span>
                    <span className="font-extrabold text-organic-forest font-mono">฿{crop.capitalRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">ระยะเพาะปลูกผลผลิต</span>
                    <span className="font-extrabold text-organic-forest font-sans flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-organic-earth" /> {crop.durationDays} วัน
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">สัดส่วนส่วนแบ่งกำไรสุทธิ</span>
                    <span className="font-extrabold text-organic-green font-sans">
                      เจ้าของ {crop.profitShareOwner}% / แพลตฟอร์ม {crop.profitSharePlatform}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-organic-clay/40">
                    <span className="text-stone-500">คาดการณ์กำไรส่วนปันผล</span>
                    <span className="font-bold text-organic-green bg-organic-sand px-2.5 py-0.5 rounded-full text-[10px] border border-organic-clay">
                      ~{crop.expectedReturnMin}% - {crop.expectedReturnMax}% / รอบปี
                    </span>
                  </div>
                </div>
              </div>

              {/* Selection visual cue */}
              {isSelected ? (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-organic-green border border-white text-white flex items-center justify-center shadow">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Contract Sign E-Signature System */}
      <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-organic-clay">
          <FileCheck className="h-5 w-5 text-organic-green" />
          <h2 className="text-lg font-serif font-bold text-organic-forest">สัญญาจ้างบริหารจัดการฟาร์มอิเล็กทรอนิกส์ (Turnkey Farming Agreement)</h2>
        </div>

        {/* Contract Content Scroll Box */}
        <div className="bg-[#FDFCF8] border border-organic-clay rounded-2xl p-4 h-52 overflow-y-auto text-xs text-stone-600 leading-relaxed space-y-3 font-sans text-left">
          <p className="font-extrabold text-organic-forest text-center text-sm font-serif italic">สัญญาเป็นพันธมิตรผู้ดูแลและเพาะปลูกพืชเศรษฐกิจระดับพรีเมียม</p>
          <p className="font-bold text-organic-earth">ทำขึ้น ณ สำนักงาน บจก. integrated agribusiness (แพลตฟอร์มวิจัยและนวัตกรรมเกษตรยุคใหม่)</p>
          
          <p>
            โดยสัญญานี้ คู่สัญญาทั้งสองฝ่าย ตกลงเข้าร่วมเป็นหุ้นส่วนเพาะปลูกในโครงการ <strong>{selectedCrop.name}</strong> 
            โดยมีรายละเอียดและข้อผูกพันทางกฎหมายเกี่ยวกับกรรมสิทธิ์ ดิน แหล่งน้ำ และการแบ่งปันสัดส่วนกำไรดังนี้:
          </p>
          
          <p className="font-bold text-organic-earth">ข้อ 1. วัตถุประสงค์ของสัญญา</p>
          <p>
            ผู้ว่าจ้าง (เจ้าของที่ดินหรือผู้ลงทุนที่ได้รับการลงทะเบียนในระบบ) ยินยอมส่งมอบสิทธิ์ดูแลพื้นที่เพาะปลูกหรือจัดซื้อโรงเรือนปิดควบคุมอุณหภูมิความชื้น 
            เพื่อให้ทาง แพลตฟอร์ม integrated agribusiness และเกษตรกรในเครือข่าย นำต้นกล้า เมล็ดพันธุ์คุณภาพสูง และทีมวิชาการเข้าเพาะปลูก ตรวจสอบ ดำเนินระบบน้ำ/ปุ๋ยอัจฉริยะ 
            และตัดแต่งทรงผลผลิตให้เป็นไปตามมาตรฐานสูงสุด
          </p>

          <p className="font-bold text-organic-earth">ข้อ 2. สัดส่วนเงินปันผลและการรับประกันตลาดรับซื้อ (Market Guarantee)</p>
          <p>
            คู่สัญญาทั้งสองฝ่าย ตนสัญญาตกลงปันส่วนรายได้จากการจัดจำหน่ายผลผลิตจริงหลังจากหักต้นทุนค่าน้ำ ค่าไฟ ค่าปุ๋ยอินทรีย์ และค่าดำเนินการดูแล 
            โดยแบ่งส่วนให้กับ <strong>ผู้ใช้บริการ (เจ้าของที่ดิน / ผู้ลงทุน) ในอัตราร้อยละ {selectedCrop.profitShareOwner}%</strong> และ 
            <strong>แพลตฟอร์ม integrated agribusiness ในอัตราร้อยละ {selectedCrop.profitSharePlatform}%</strong> ของกำไรสุทธิทั้งหมด 
            โดย integrated agribusiness จะเป็นผู้ติดต่อแบรนด์พันธมิตรรับซื้อ (Gourmet Market, Lemon Farm, คู่ค้าส่งออกต่างประเทศ) เข้าขนส่งยกล็อตทันทีในสัปดาห์ที่เก็บเกี่ยวเสร็จสิ้น
          </p>

          <p className="font-bold text-organic-earth">ข้อ 3. เทคโนโลยีและความโปร่งใส (IoT & Real-time Sensors)</p>
          <p>
            ทาง integrated agribusiness สัญญาว่าจะติดตั้งเซนเซอร์ตรวจสอบความชื้น ความเป็นกรดด่างในดิน (Soil pH Meter), ระดับค่าปุ๋ยเคมีและอินทรีย์ (NPK Level), สัญญาณกล้อง CCTV 
            และอัปเดตรายงานบันทึกการดูแล (Farming Log) รายสัปดาห์ในโปรไฟล์แดชบอร์ดแก่ผู้ใช้บริการ เพื่อคงไว้ซึ่งความโปร่งใสในข้อมูลมากที่สุด
          </p>

          <p className="font-bold text-organic-earth">ข้อ 4. การคุ้มครองกรณีภัยพิบัติธรรมชาติตามมาตรฐานสากล</p>
          <p>
            เพื่อให้ผู้ลงทุนที่ไม่มีความรู้หรือเจ้าของที่ดินหมดกังวลเรื่องอุทกภัย วาตภัย หรือโรคระบาดพืชที่ไม่สามารถคาดเดาได้ ทางแพลตฟอร์มมีการประกันเสื่อมค่าอุปกรณ์โรงเรือน 
            และจัดเตรียมแปลงสำรองฉุกเฉินรับความรับผิดชอบ เพื่อการันตีว่าผู้ลงทุนจะไม่สูญเปล่าเงินลงทุนในรอบปี
          </p>
        </div>

        {/* Interactive E-Signature Pad */}
        {!signatureSaved ? (
          <form onSubmit={submitContract} className="space-y-4 text-left">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-organic-sand/65 p-4 border border-organic-clay rounded-2xl">
              <div className="space-y-1">
                <span className="text-xs font-bold text-organic-forest block">เลือกรูปแบบการเซ็นชื่ออิเล็กทรอนิกส์</span>
                <p className="text-[11px] text-stone-500">ท่านสามารถวาดผ่านเมาส์/หน้าจอสัมผัส หรือพิมพ์ชื่อด้วยตัวอักษรแบบราชการ</p>
              </div>
              <div className="flex bg-organic-cream rounded-xl p-1 border border-organic-clay">
                <button
                  type="button"
                  onClick={() => setSignMethod('draw')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                    signMethod === 'draw' ? 'bg-[#FDFCF8] text-organic-forest shadow-xs' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  วาดลายเซ็นมือ
                </button>
                <button
                  type="button"
                  onClick={() => setSignMethod('type')}
                  className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                    signMethod === 'type' ? 'bg-[#FDFCF8] text-organic-forest shadow-xs' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  พิมพ์ลงลายเซ็นชื่อ
                </button>
              </div>
            </div>

            {signMethod === 'draw' ? (
              /* Canvas Drawing Block */
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-stone-600">ลงลายมือชื่อในกรอบด้านล่าง (Draw Signature):</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[10px] font-bold text-organic-earth hover:text-rose-700 hover:bg-organic-cream px-2 py-1 rounded-lg border border-organic-clay transition-all cursor-pointer"
                  >
                    ลบเขียนใหม่
                  </button>
                </div>
                
                <div className="border border-organic-clay rounded-2xl bg-[#FDFCF8]/50 relative overflow-hidden h-40">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                  />
                  {canvasCleared && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-400 text-xs">
                      <span className="font-serif flex items-center bg-organic-cream/95 px-3 py-1.5 rounded-full shadow-xs border border-organic-clay">
                        <Edit3 className="h-3.5 w-3.5 mr-1.5 text-organic-earth" /> คลิกค้างแล้วขยับนิ้ว/เมาส์เพื่อลงลายเซ็น
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Typed Signature Block */
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">พิมพ์ชื่อ-นามสกุลจริงลงนาม:</label>
                <input 
                  type="text" 
                  required={signMethod === 'type'}
                  value={typedSignName}
                  onChange={(e) => setTypedSignName(e.target.value)}
                  placeholder="เช่น นายปรีชา ชาญการเกษตร"
                  className="w-full text-sm px-3.5 py-3 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans font-medium"
                />
                
                {typedSignName && (
                  <div className="p-4 bg-[#F5F2EA] border border-organic-clay rounded-2xl">
                    <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest block mb-1">E-SIGNATURE PREVIEW</p>
                    <p className="font-serif text-3xl font-extrabold text-organic-forest italic tracking-wide underline decoration-organic-earth/30 pt-2 pb-3">
                      {typedSignName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Checkbox confirmation & Action Button */}
            <div className="space-y-4 pt-3">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="h-4 w-4 text-organic-green border-organic-clay rounded focus:ring-organic-green mt-0.5 cursor-pointer"
                />
                <span className="text-xs text-stone-500 leading-relaxed text-left">
                  ข้าพเจ้ายินยอมผูกพันตามข้อตกลงและเงื่อนไขของสัญญาบริหารจัดการฟาร์ม integrated agribusiness ทุกประการ โดยยอมรับว่าข้อมูลสำรวจดิน/น้ำ และค่าปันส่วนกำไร {selectedCrop.profitShareOwner}% นี้เป็นความสัตย์จริง
                </span>
              </label>

              <button
                type="submit"
                id="btn-confirm-sign-contract"
                disabled={!agreedTerms || (signMethod === 'draw' && canvasCleared) || (signMethod === 'type' && !typedSignName)}
                className={`w-full py-3.5 rounded-xl text-sm font-bold font-sans cursor-pointer transition-all active:scale-98 shadow-md flex items-center justify-center space-x-2 ${
                  agreedTerms && ((signMethod === 'draw' && !canvasCleared) || (signMethod === 'type' && typedSignName))
                    ? 'bg-organic-green text-white hover:bg-organic-forest'
                    : 'bg-[#ECE9DF] text-stone-400 border border-organic-clay cursor-not-allowed'
                }`}
              >
                <FileCheck className="h-4.5 w-4.5" />
                <span>ลงนามสัญญาอิเล็กทรอนิกส์ร่วมโครงการ</span>
              </button>
            </div>

          </form>
        ) : (
          /* Signature Completed View */
          <div className="bg-organic-sand/85 border-2 border-organic-green/20 rounded-2xl p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-organic-cream flex items-center justify-center mx-auto text-organic-green shadow-xs border border-organic-clay">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            
            <div className="space-y-1.5 text-center">
              <p className="text-base font-serif font-bold text-organic-forest italic">เสร็จสิ้นขั้นตอนทำสัญญาอิเล็กทรอนิกส์แล้ว!</p>
              <p className="text-xs text-stone-550">
                ระบบได้บันทึกเอกสาร <strong>integrated-agribusiness-Contract-{selectedCrop.id.toUpperCase()}-01</strong> 
                ลงลายมือชื่อโดย <span className="font-bold text-organic-green">{contract.signedName}</span> เมื่อวันที่ {contract.signedDate} เรียบร้อยแล้ว
              </p>
            </div>

            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-[#FDFCF8] border border-organic-clay text-left">
                <span className="text-stone-400 block mb-0.5">พืชที่เลือกจ้าง</span>
                <span className="font-bold text-organic-forest font-serif italic">{selectedCrop.nameEn}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FDFCF8] border border-organic-clay text-left">
                <span className="text-stone-400 block mb-0.5">ส่วนแบ่งของท่าน</span>
                <span className="font-bold text-organic-green">{contract.profitShareOwner}% สุทธิ</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="btn-reset-contract"
                onClick={handleResetContract}
                className="text-[11px] font-bold text-organic-earth hover:text-rose-700 hover:bg-organic-cream text-center px-4 py-2 rounded-xl border border-organic-clay transition-all cursor-pointer w-full sm:w-auto"
              >
                ยกเลิกและร่างสัญญาใหม่
              </button>
              <button
                type="button"
                id="btn-goto-assessment"
                onClick={onContinue}
                className="bg-organic-green hover:bg-organic-forest text-white text-[11px] font-bold font-sans px-5 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs flex items-center justify-center w-full sm:w-auto"
              >
                <span>ขั้นตอนถัดไป (ตรวจสอบที่ดิน)</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
