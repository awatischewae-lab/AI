/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Upload, 
  Layers, 
  FileCheck, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  HelpCircle,
  Briefcase,
  Sparkles,
  Search,
  Leaf
} from 'lucide-react';
import { UserProfile, LandInfo, UserType } from '../types';

interface RegistrationStepProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  land: LandInfo;
  setLand: (land: LandInfo) => void;
  onContinue: () => void;
}

export default function RegistrationStep({
  profile,
  setProfile,
  land,
  setLand,
  onContinue
}: RegistrationStepProps) {
  
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [landData, setLandData] = useState<LandInfo>({ ...land });
  const [isSaved, setIsSaved] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Preset images just in case they want a nice demo plot preset
  const LAND_PRESETS = [
    {
      id: 'pre_saraburi',
      title: 'แปลงแก่งคอย สระบุรี (ดินร่วนปนทรายใกล้แหล่งน้ำ)',
      province: 'สระบุรี',
      district: 'แก่งคอย',
      size: '5 ไร่ 2 งาน 40 ตร.ว.',
      coords: '14.5862, 101.0028',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'pre_ratchaburi',
      title: 'แปลงสวนผึ้ง ราชบุรี (ที่ราบสูงลมโกรก อากาศดี)',
      province: 'ราชบุรี',
      district: 'สวนผึ้ง',
      size: '8 ไร่ 0 งาน 0 ตร.ว.',
      coords: '13.5414, 99.3364',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'pre_chumphon',
      title: 'แปลงหลังสวน ชุมพร (ดินแดนผลไม้ทองคำ ฝนแปดแดดสี่)',
      province: 'ชุมพร',
      district: 'หลังสวน',
      size: '12 ไร่ 1 งาน 20 ตร.ว.',
      coords: '9.9532, 99.0837',
      image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleLandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let typedValue: any = value;
    if (name.startsWith('size')) {
      typedValue = value === '' ? 0 : parseInt(value, 10);
    }
    setLandData(prev => ({ ...prev, [name]: typedValue }));
    setIsSaved(false);
  };

  const selectUserType = (type: UserType) => {
    setFormData(prev => ({ ...prev, userType: type }));
    setIsSaved(false);
  };

  // Mock upload logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create mockup preview URL
      const file = e.dataTransfer.files[0];
      const mockUrl = URL.createObjectURL(file);
      setLandData(prev => ({ ...prev, photoUrl: mockUrl }));
    }
  };

  const handleSelectPreset = (preset: typeof LAND_PRESETS[0]) => {
    setLandData({
      sizeRai: parseInt(preset.size.split(' ')[0]),
      sizeNgan: parseInt(preset.size.split(' ')[2]),
      sizeSqWah: parseInt(preset.size.split(' ')[4]),
      province: preset.province,
      district: preset.district,
      coordinates: preset.coords,
      titleDeedNo: `โฉนดพิกัดทดลอง (${preset.id})`,
      photoUrl: preset.image
    });
  };

  const saveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setLand(landData);
    setIsSaved(true);
    
    // Auto timeout for feedback
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div id="registration-view" className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-organic-forest via-[#374E39] to-organic-forest border border-organic-clay/20 rounded-3xl p-6 sm:p-8 text-organic-cream relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-15">
          <Leaf className="h-64 w-64 text-organic-light-green rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-organic-light-green/10 border border-organic-light-green/30 px-3 py-1 rounded-full text-xs text-organic-light-green font-semibold uppercase tracking-wide">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Turnkey Farming Solution</span>
          </div>
          <h1 className="text-2xl sm:text-4.5xl font-bold font-serif leading-tight text-[#F9F7F1] tracking-tight italic">
            แก้ปัญหายอดฮิตคนอยากทําเกษตรแต่ <span className="text-organic-light-green underline decoration-wavy decoration-organic-earth/35">ขาดความรู้ / ไม่มีเวลา</span>
          </h1>
          <p className="text-[#DFDCCF] text-sm sm:text-base leading-relaxed">
            integrated agribusiness คือผู้ช่วยมืออาชีพ คู่อาสาเปลี่ยนทรัพยากรว่างเปล่าเป็นรายรับ 
            บริหารจัดการฟาร์มด้วยเทคโนโลยี IoT และ AI ตรวจดิน ดูสภาพน้ำ ปลูกพืชพรีเมียม 
            พร้อมสัญญารับซื้อปันผลแบบแชร์กำไร โปร่งใส ตรวจสอบความคืบหน้าได้ตลอด 24 ชั่วโมง
          </p>
        </div>
      </div>

      {/* Choose User Type Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Card Type: Landowner */}
        <div 
          id="btn-select-landowner"
          onClick={() => selectUserType('landowner')}
          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start space-x-4 ${
            formData.userType === 'landowner' 
              ? 'border-organic-green bg-organic-sand shadow-sm translate-y-[-1px]' 
              : 'border-organic-clay bg-organic-cream hover:border-organic-green/40 hover:shadow-xs'
          }`}
        >
          <div className={`p-3 rounded-xl ${formData.userType === 'landowner' ? 'bg-organic-green text-organic-cream' : 'bg-organic-clay/40 text-stone-550'}`}>
            <MapPin className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-left flex-1">
            <p className="text-base font-serif font-bold text-organic-forest italic">ฉันมีที่ดินเปล่า แต่ "ไม่มีเวลาดูแล"</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              เหมาะสำหรับท่านที่มีโฉนดเปล่า ทิ้งร้าง เสียโอกาสสร้างรายได้ หรือเกรงกลัวภาษีที่ดิน ต้องการเปลี่ยนพฤติกรรมพืชมาเพาะปลูกพืชเศรษฐกิจราคาดี โดยมีทีมวิศวกรดูแลให้ครบวงจร
            </p>
            <span className="inline-block pt-1.5 text-xs text-organic-earth font-bold font-sans">
              * รับปันผล 60% - 70% จากผลผลิตจริง
            </span>
          </div>
        </div>

        {/* Profile Card Type: Investor */}
        <div 
          id="btn-select-investor"
          onClick={() => selectUserType('investor')}
          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start space-x-4 ${
            formData.userType === 'investor'
              ? 'border-organic-green bg-organic-sand shadow-sm translate-y-[-1px]' 
              : 'border-organic-clay bg-organic-cream hover:border-organic-green/40 hover:shadow-xs'
          }`}
        >
          <div className={`p-3 rounded-xl ${formData.userType === 'investor' ? 'bg-organic-green text-organic-cream' : 'bg-organic-clay/40 text-stone-550'}`}>
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-left flex-1">
            <p className="text-base font-serif font-bold text-organic-forest italic">ฉันอยากทำเกษตรเป็นรายได้คู่ แต่ "ไม่มีความรู้"</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              เหมาะสำหรับพนักงานประจำหรือนักลงทุนเกษตรยุคใหม่ ไม่มีที่ดิน ไม่มีทักษะปลูก แต่อยากสนับสนุนเงินทุนเพื่อเช่า/ร่วมหุ้นแปลงในระเบียบปิดอัจฉริยะ ของเกษตรกรในเครือข่ายเรา
            </p>
            <span className="inline-block pt-1.5 text-xs text-organic-earth font-bold font-sans">
              * ทางเลือกรับปันผลเฉลี่ย 15% - 24% ต่อปี
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={saveAll} className="space-y-6">
        
        {/* Registration form detail section */}
        <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-organic-clay">
            <User className="h-5 w-5 text-organic-green" />
            <h2 className="text-lg font-serif font-bold text-organic-forest">ข้อมูลผู้สมัครสมาชิก & บัญชีปันผล</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-stone-500">ชื่อ - นามสกุลจริง (ไทย/อังกฤษ)</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name} 
                onChange={handleProfileChange}
                placeholder="เช่น นายปรีชา ชาญการเกษตร"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              />
            </div>
            
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-stone-500">เบอร์โทรศัพท์ติดต่อ</label>
              <input 
                type="tel" 
                name="phone" 
                required
                value={formData.phone} 
                onChange={handleProfileChange}
                placeholder="เช่น 081-XXXXXXX"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-stone-500">อีเมลลงทะเบียน</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email} 
                onChange={handleProfileChange}
                placeholder="เช่น preecha.c@example.com"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-stone-500">ธนาคารสำหรับรับเงินปันผล</label>
              <select 
                name="bankName"
                value={formData.bankName}
                onChange={handleProfileChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              >
                <option value="ธนาคารกสิกรไทย (KBank)">ธนาคารกสิกรไทย (KBank)</option>
                <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB)</option>
                <option value="ธนาคารกรุงเทพ (BBL)">ธนาคารกรุงเทพ (BBL)</option>
                <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)">ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2 text-left">
              <label className="text-xs font-bold text-stone-500">หมายเลขบัญชีธนาคาร</label>
              <input 
                type="text" 
                name="bankAccount" 
                required
                value={formData.bankAccount} 
                onChange={handleProfileChange}
                placeholder="เช่น 123-4-56789-0"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section changes dramatically based on landowners vs investors */}
        {formData.userType === 'landowner' ? (
          /* LANDOWNER MODE: Land Details input */
          <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-organic-clay">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-organic-green" />
                <h2 className="text-lg font-serif font-bold text-organic-forest">รายละเอียดที่ดินว่างเปล่าของท่าน</h2>
              </div>
              <span className="text-xs text-organic-green font-serif font-semibold bg-organic-sand px-3 py-1 rounded-full border border-organic-clay">
                พร้อมตรวจสอบเพื่อจัดแพ็กเกจ
              </span>
            </div>

            {/* Selector presets */}
            <div className="space-y-4 text-left">
              <p className="text-xs font-bold text-stone-500 flex items-center">
                <span>เลือกใช้ข้อมูลที่ดินตัวอย่างในการทดสอบระบบ (Presets):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LAND_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="text-left p-3.5 rounded-xl border border-dashed border-organic-clay hover:border-organic-green hover:bg-organic-sand/50 text-xs transition-all space-y-1 block cursor-pointer"
                  >
                    <p className="font-bold text-organic-forest truncate font-serif italic">{p.title}</p>
                    <p className="text-organic-earth font-mono text-[10px]">พิกัด: {p.coords}</p>
                    <p className="text-stone-550">ขนาด: {p.size}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-500">จังหวัดที่ตั้งที่ดิน</label>
                <input 
                  type="text" 
                  name="province" 
                  required
                  value={landData.province} 
                  onChange={handleLandChange}
                  placeholder="เช่น สระบุรี, ราชบุรี"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-500">อำเภอ/เขต</label>
                <input 
                  type="text" 
                  name="district" 
                  required
                  value={landData.district} 
                  onChange={handleLandChange}
                  placeholder="เช่น แก่งคอย, สวนผึ้ง"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-stone-500">เลขที่ระวางโฉนดที่ดิน (ฉ.โฉนด)</label>
                <input 
                  type="text" 
                  name="titleDeedNo" 
                  required
                  value={landData.titleDeedNo} 
                  onChange={handleLandChange}
                  placeholder="เช่น โฉนดเลขที่ 5042-II"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                />
              </div>
            </div>

            {/* Land Size fields */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-stone-500 block">ขนาดพื้นที่ในโฉนดที่ดิน</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <input 
                    type="number" 
                    name="sizeRai" 
                    min="0"
                    value={landData.sizeRai || ''} 
                    onChange={handleLandChange}
                    className="w-full text-sm pr-10 pl-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green text-right font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-stone-400 font-bold">ไร่</span>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="number" 
                    name="sizeNgan" 
                    min="0"
                    max="3"
                    value={landData.sizeNgan || ''} 
                    onChange={handleLandChange}
                    className="w-full text-sm pr-10 pl-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green text-right font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-stone-400 font-bold">งาน</span>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="number" 
                    name="sizeSqWah" 
                    min="0"
                    max="99"
                    value={landData.sizeSqWah || ''} 
                    onChange={handleLandChange}
                    className="w-full text-sm pr-12 pl-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green text-right font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-stone-400 font-bold">ตร.ว.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500">พิกัดทางภูมิศาสตร์ GSP (ละติจูด, ลองจิจูด)</label>
                <input 
                  type="text" 
                  name="coordinates" 
                  required
                  value={landData.coordinates} 
                  onChange={handleLandChange}
                  placeholder="เช่น 14.5862, 101.0028"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-organic-clay bg-organic-sand/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green font-sans"
                />
              </div>

              {/* Photo upload field simulating Drag and Drop */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500">รูปภาพที่ดินเปล่าปัจจุบัน (สแกนแบบสุ่มหรือภาพถ่ายจริง)</label>
                
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                    dragActive 
                      ? 'border-organic-green bg-organic-sand/55' 
                      : landData.photoUrl 
                        ? 'border-organic-green/45 bg-organic-sand/10' 
                        : 'border-organic-clay hover:border-organic-green bg-[#FDFCF8]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('hidden-file-input')?.click()}
                >
                  <input 
                    id="hidden-file-input"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLandData(prev => ({ ...prev, photoUrl: URL.createObjectURL(e.target.files![0]) }));
                      }
                    }}
                  />
                  
                  {landData.photoUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={landData.photoUrl} 
                        alt="Land Preview" 
                        referrerPolicy="no-referrer"
                        className="h-32 object-cover rounded-xl mx-auto shadow-sm border border-organic-clay"
                      />
                      <p className="text-xs text-organic-green font-bold">✓ อัปโหลดสำเร็จแล้ว คุณสามารถคลิกเพื่อเลือกภาพใหม่</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-organic-sand text-organic-earth transition-transform hover:scale-105">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-organic-forest font-serif italic">ลากและวางรูปภาพที่ดินเปล่าของคุณที่นี่</p>
                        <p className="text-xs text-stone-500">หรือคลิกปุ่มเพื่อเลือกจากคลังภาพในเครื่อง (รองรับ .png, .jpg, .jpeg)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* INVESTOR MODE: Browse Empty Lands in Network */
          <div className="bg-organic-cream rounded-3xl border border-organic-clay shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-organic-clay">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-organic-earth" />
                <h2 className="text-lg font-serif font-bold text-organic-forest">เลือกแปลงที่ดินเปล่าของเครือข่าย เพื่อสนับสนุนการลงทุน</h2>
              </div>
              <span className="text-xs text-organic-green font-serif font-semibold bg-organic-sand px-3 py-1 rounded-full border border-organic-clay">
                พร้อมเปิดให้จองผู้จัดการทำฟาร์ม
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed text-left">
              ในฐานะ <span className="font-bold text-organic-forest">นักลงทุนที่ไม่มีข้อจำกัดเรือนดิน</span> แพลตฟอร์มของเราได้คัดสรรที่ดินรกร้างของชาวเกษตรกรที่มีโฉนดถูกต้อง แต่ไม่มีที่พึ่งด้านวิทยาการและเงินทุน ท่านสามารถเลือกสปอนเซอร์แปลงเหล่านั้นเพื่อดำเนินการสร้างระบบ Smart Greenhouse ได้ทันที:
            </p>

            <div className="space-y-3">
              {LAND_PRESETS.map((p) => {
                const isSelected = landData.province === p.province && landData.district === p.district;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 text-left ${
                      isSelected
                        ? 'border-organic-green bg-[#F5F2EA] shadow-md'
                        : 'border-organic-clay bg-organic-sand/10 hover:bg-organic-sand/40'
                    }`}
                  >
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full sm:w-28 h-20 object-cover rounded-lg border border-organic-clay"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-serif font-bold text-organic-forest truncate italic">{p.title}</h3>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-serif font-bold py-0.5 px-2 rounded-full bg-organic-green text-white font-sans shrink-0">
                            มีผลสำรองเลือกแล้ว
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 font-sans">พิกัดทาง GPS: {p.coords} | โฉนดตรวจสอบโดยสำนักงานกรมที่ดินแล้ว</p>
                      <div className="flex items-center space-x-4 text-xs font-medium text-stone-500 pt-1">
                        <span className="flex items-center text-organic-forest font-bold font-mono">
                          <MapPin className="h-3 w-3 mr-1 text-organic-earth" /> {p.district}, {p.province}
                        </span>
                        <span>ขนาดพื้นที่ใช้จริง: {p.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-organic-sand/85 rounded-2xl p-4 border border-organic-clay flex items-start space-x-3 text-xs text-organic-forest leading-relaxed text-left">
              <CheckCircle2 className="h-4.5 w-4.5 text-organic-green shrink-0 mt-0.5" />
              <div>
                <p className="font-serif font-bold italic">นวัตกรรมประสานประโยชน์ (Win-Win Integration)</p>
                <p className="text-stone-550 mt-1">ผู้ลงทุนได้รับส่วนแบ่งกำไรสุทธิจากการจัดขายผลผลผลิต และชาวบ้านเจ้าของที่ดินตัวจริงจะได้รับค่าสนับสนุนค่าธรรมเนียมเช่าทางอ้อม และได้รับความพึ่งพาทีมงานท้องถิ่นให้มีงานทำในระยะยาว</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-organic-sand/85 rounded-3xl p-4.5 border border-organic-clay gap-3">
          <div className="text-left">
            {isSaved ? (
              <p className="text-organic-green font-serif font-bold text-xs flex items-center italic">
                <CheckCircle2 className="h-4.5 w-4.5 mr-1.5" /> บันทึกและปรับปรุงข้อมูลโปรไฟล์บน Cloud สำเร็จแล้ว
              </p>
            ) : (
              <p className="text-stone-500 text-xs font-sans">
                * กรุณากดบันทึกก่อนเดินทางไปยังขั้นตอนถัดไปเพื่อผลลัพธ์ที่ถูกต้องยั่งยืน
              </p>
            )}
          </div>
          <div className="flex space-x-2.5 w-full sm:w-auto">
            <button
              id="btn-save-profile"
              type="submit"
              className="flex-1 sm:flex-none bg-organic-earth hover:bg-organic-earth/95 text-white text-xs font-bold font-sans px-5 py-3 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              แก้ไขและบันทึกข้อมูล
            </button>
            <button
              type="button"
              id="btn-goto-packages"
              onClick={() => {
                // save first
                setProfile(formData);
                setLand(landData);
                onContinue();
              }}
              className="flex-1 sm:flex-none bg-organic-green hover:bg-organic-forest text-white text-xs font-bold font-sans px-6 py-3 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs flex items-center justify-center space-x-1"
            >
              <span>ขั้นตอนถัดไป</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
