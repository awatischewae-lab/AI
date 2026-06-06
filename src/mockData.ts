/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CropPackage, AgriTurnkeyState } from './types';

export const CROP_PACKAGES: CropPackage[] = [
  {
    id: 'melon_premium',
    name: 'โรงเรือนเมลอนญี่ปุ่นเกรดเอ (Premium Japanese Melon Greenhouse)',
    nameEn: 'Premium Japanese Melon',
    category: 'พืชระยะสั้นราคาดี (High-Value Crop)',
    durationDays: 85,
    capitalRequired: 150000,
    expectedReturnMin: 18,
    expectedReturnMax: 24,
    profitShareOwner: 65,
    profitSharePlatform: 35,
    description: 'ปลูกเมลอนสายพันธุ์วิลเลียมส์ญี่ปุ่นในระบบปิดอัจฉริยะ (Smart Greenhouse) ควบคุมปุ๋ยและน้ำอัตโนมัติ การันตีเกรดพรีเมียมและรสชาติหวานฉ่ำขั้นต่ำ 14 Brix มีทีมวิชาการดูแลทุกวัน',
    features: [
      'โรงเรือนปิดควบคุมความปลอดภัยจากฝุ่น แมลง โรคพืช',
      'ระบบควบคุมน้ำดินอัจฉริยะผ่านเทคโนโลยี IoT',
      'เก็บผลผลิตได้เฉลี่ย 1.2 - 1.5 ตันต่อโรงเรือน',
      'มีพันธมิตรรับซื้อทันที: ห้างสรรพสินค้าชั้นนำ และแบรนด์ผลไม้ส่งออก',
      'สัดส่วนแบ่งกำไรสุทธิสูงถึง 65% ให้กับเจ้าของที่ดิน/ผู้ลงทุน'
    ],
    image: 'melon'
  },
  {
    id: 'cherry_tomato',
    name: 'มะเขือเทศเชอร์รี่สีทองไฮโดรโปนิกส์อินทรีย์ (Organic Golden Cherry Tomato)',
    nameEn: 'Golden Cherry Tomato',
    category: 'พืชสลัดเพื่อสุขภาพ (Superfood Organic)',
    durationDays: 70,
    capitalRequired: 120000,
    expectedReturnMin: 15,
    expectedReturnMax: 20,
    profitShareOwner: 60,
    profitSharePlatform: 40,
    description: 'ปลูกมะเขือเทศเชอร์รี่สีทองด้วยปุ๋ยอินทรีย์นาโนในระบบไฮโดรโปนิกส์ ควบคุมอาหารพืชรอบด้าน ให้ลูกดก รสชาติเปรี้ยวอมหวานพรีเมียม กรอบอร่อย ตลาดเพื่อสุขภาพต้องการตัวสูง',
    features: [
      'มาตรฐานรับรอง GAP และ Organic Thailand',
      'ใช้อุปกรณ์ IoT ควบคุมปริมาณแสงและอุณหภูมิ',
      'ระยะเวลาเก็บเกี่ยวสั้น คืนทุนได้ไวใน 70 วัน',
      'คู่ค้ารับซื้อหลัก: ซูเปอร์มาร์เก็ตออร์แกนิก Lemon Farm และร้านอาหารเพื่อสุขภาพ',
      'แบ่งกำไร 60% สำหรับนักลงทุน/เจ้าของที่ดิน'
    ],
    image: 'tomato'
  },
  {
    id: 'durian_monthong',
    name: 'สวนทุเรียนหมอนทองพรีเมียมอัจฉริยะ (Monthong Durian Smart Orchard)',
    nameEn: 'High-Value Monthong Durian',
    category: 'พืชผลเศรษฐกิจระยะยาว (Long-Term Fortune)',
    durationDays: 1460, // ~4 years to start bearing premium
    capitalRequired: 450000,
    expectedReturnMin: 35,
    expectedReturnMax: 50,
    profitShareOwner: 70,
    profitSharePlatform: 30,
    description: 'สำหรับที่ดินที่มีแผนทำสวนผลไม้พรีเมียมส่งไปจีน เราจะวางผังระบบน้ำอัจฉริยะ วัดความชื้น ดิน และใช้อากาศยานไร้คนขับ (Drone) ฉีดปุ๋ย บันทึกพฤติกรรมพืช 24 ชม.',
    features: [
      'ใช้เทคโนโลยีวิเคราะห์อากาศดินพืชด้วย AI เซนเซอร์',
      'เหมาะสำหรับเจ้าของที่ดินขนาดใหญ่ (3 ไร่ขึ้นไป) ที่ไม่มีเวลาดูแล',
      'ตลาดรับซื้อขนาดใหญ่: ล้งส่งออกจีนรายใหญ่และแพลตฟอร์มอีคอมเมิร์ซจีน',
      'แบ่งเปอร์เซ็นต์กำไรสูงสุดที่ 70% ให้กับเจ้าของที่ดิน',
      'การดูแลบำรุงระยะยาว ครอบคลุมการตัดแต่งกิ่ง ผสมเกสร และห่อผล'
    ],
    image: 'durian'
  }
];

export const INITIAL_STATE: AgriTurnkeyState = {
  profile: {
    name: 'สมเกียรติ มั่นคงวิจิตร',
    phone: '081-234-5678',
    email: 'somkiat.m@activemail.com',
    userType: 'landowner',
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    bankAccount: '123-4-56789-0'
  },
  land: {
    sizeRai: 5,
    sizeNgan: 2,
    sizeSqWah: 40,
    province: 'สระบุรี',
    district: 'แก่งคอย',
    coordinates: '14.5862, 101.0028',
    titleDeedNo: 'โฉนดพิกัด 5042-II (98371)',
    photoUrl: ''
  },
  contract: {
    packageId: 'melon_premium',
    signedName: 'สมเกียรติ มั่นคงวิจิตร',
    signedDate: '2026-05-01',
    isSigned: true,
    profitShareOwner: 65,
    profitSharePlatform: 35
  },
  assessment: {
    bookedDate: '2026-05-05',
    bookedTime: '10:30',
    status: 'completed',
    soilPH: 6.4,
    npkNutrients: {
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium'
    },
    waterAccess: 'พร้อมใช้งานลำตะคองตอนล่างระยะทาง 150 เมตร มีบ่อน้ำสำรองในแปลง',
    expertRecommendation: 'ดินมีสมบัติทางกายภาพระบายน้ำได้ดี มีความอุดมสมบูรณ์ปานกลาง เหมาะสมอย่างยิ่งกับการทำโรงเรือนเมลอนญี่ปุ่นแบบควบคุมน้ำหยดและดินพรีเมียม จะช่วยเร่งหวานได้เหนือกว่าพืชประเภทอื่นๆ',
    assessedBy: 'ดร. นงนุช รักสะอาด (หัวหน้าทีมเกษตรวิชาการ AgriTurnkey)'
  },
  currentStep: 2, // 2: เพาะปลูก (Planting / Cultivation)
  weeklyUpdates: [
    {
      week: 1,
      date: '2026-05-15',
      image: 'week1',
      title: 'เตรียมแปลง ติดตั้งระบบ IoT และเริ่มย้ายต้นกล้า',
      description: 'ทีมเกษตรกรในพื้นที่ทำการฆ่าเชื้อวัสดุปลูก ปรับปรุงค่าดินตามคำแนะนำ และทำการย้ายกล้าเมลอน William พันธ์ุส่งออกญี่ปุ่น ลงในถุงปลูกระบบปิดเสร็จสิ้น 1,200 ถุง ระบบตรวจวัดความชื้นส่งสัญญาณปกติ',
      temperature: 30.5,
      soilMoisture: 65,
      heightCm: 12
    },
    {
      week: 2,
      date: '2026-05-22',
      image: 'week2',
      title: 'การพันยอดขึ้นลวด และเด็ดยอดแขนง',
      description: 'ต้นเมลอนอายุ 15 วัน ย่างก้าวสู่ช่วงโตเต็มที่ ทีมงานทำการพันยอดจับแต่งเชือกลวด พร้อมจัดระเบียบต้น เด็ดใบแขนงด้านล่างออกทั้งหมดเพื่อให้ต้นลำเลียงน้ำและสารอาหารไปหล่อเลี้ยงลำยอดหลักได้อย่างมีประสิทธิภาพที่สุด',
      temperature: 29.8,
      soilMoisture: 60,
      heightCm: 45
    },
    {
      week: 3,
      date: '2026-05-29',
      image: 'week3',
      title: 'ผสมเกสรดอกและคัดเลือกผลพรีเมียมที่ดีที่สุด',
      description: 'ต้นเมลอนออกดอกสมบูรณ์ ทีมงานเกษตรใช้พู่กันช่วยผสมเกสรในช่วงเวลาแดดอ่อน และหลังได้รับการผสมได้ทำการตรวจสอบ คัดเลือกจนเหลือเพียง "ผลที่สวยสมมาตรที่สุดเพียง 1 ผลต่อ 1 ต้น" เพื่อมุ่งเน้นความหวานสูงสุด',
      temperature: 31.2,
      soilMoisture: 58,
      heightCm: 90
    },
    {
      week: 4,
      date: '2026-06-05',
      image: 'week4',
      title: 'การแขวนลูกและเริ่มสร้างลายตาข่ายนูนเด่น',
      description: 'ผลเมลอนมีขนาดเท่าไข่ห่าน ทีมเกษตรกรทำการใช้เชือกค้ำแขวนน้ำหนักผลไว้กับคานบน เพื่อลดการห้อยหักของกิ่ง และขณะนี้สกินผลเริ่มปริแตกสร้างลายร่างแห (Netting) สีขาวนูนคมชัด ควบคุมปุ๋ยสะสมอินทรีย์สม่ำเสมอ',
      temperature: 29.4,
      soilMoisture: 62,
      heightCm: 135
    }
  ],
  farmingLogs: [
    {
      id: 'log_1',
      date: '2026-06-05 08:00',
      activity: 'การแขวนเชือกพยุงเมลอน 1,200 ผล',
      category: 'growth',
      notes: 'แขวนผลเมลอนเสร็จเรียบร้อยทุกลูก ป้องกันการรับน้ำหนักใบ ช่วยให้ผลเจริญเติบโตกลมสวยงาม',
      operator: 'สมชาติ (ผู้ดูแลฟาร์มประจำพื้นที่แก่งคอย)'
    },
    {
      id: 'log_2',
      date: '2026-06-04 15:30',
      activity: 'พ่นสารอินทรีย์สะเดาชีวภาพระวังเพลี้ยไฟ',
      category: 'general',
      notes: 'ฉีดพ่นละอองบางที่ช่องลมทางเข้าและนอกโรงเรือน เพื่อป้องกันแมลงภายนอก เป็นสารสกัดจากธรรมชาติ 100%',
      operator: 'สมชาติ (ผู้ดูแลฟาร์มประจำพื้นที่แก่งคอย)'
    },
    {
      id: 'log_3',
      date: '2026-06-02 09:00',
      activity: 'ปรับปริมาณปุ๋ยโพแทสเซียมเร่งสร้างเนื้อหวาน',
      category: 'fertilizer',
      notes: 'ปรับสูตรอาหารผ่านแทงค์ควบคุมน้ำป้อนอัตโนมัติตามที่วิศวกรวิชาการออกแบบ วัดระดับ EC ในน้ำสม่ำเสมอ',
      operator: 'ระบบควบคุมฟาร์มอัจฉริยะ AgriTurnkey AI'
    },
    {
      id: 'log_4',
      date: '2026-05-31 16:00',
      activity: 'ตรวจสอบระบายล้างระบบน้ำหยดป้องกันอุดตัน',
      category: 'water',
      notes: 'ค่าแรงดันสมบูรณ์ หัวจ่ายน้ำหยดทำงานครบถ้วนทุกถุงความชื้นดินคงที่ 60%',
      operator: 'ทีมช่างเทคนิคย่อยสระบุรี'
    }
  ],
  harvestQC: {
    harvstDate: '2026-06-25',
    status: 'pending',
    totalYieldKg: 1450,
    gradeA_Percent: 88,
    gradeB_Percent: 9,
    gradeC_Percent: 3,
    averageWeightKg: 1.65,
    brixSweetness: 14.8,
    qcStatus: 'Pending',
    certificateNo: 'GAP-TH-2026-77836'
  },
  walletBalance: 247000,
  totalEarned: 678000,
  transactions: [
    {
      id: 'tx_1',
      date: '2026-04-15',
      type: 'withdrawal',
      amount: -120000,
      description: 'ถอนเงินกำไรไปยัง ธนาคารกสิกรไทย (บัญชีคุณสมเกียรติ)',
      status: 'success'
    },
    {
      id: 'tx_2',
      date: '2026-04-10',
      type: 'dividend',
      amount: 348000,
      description: 'เงินปันผลรอบเก็บเกี่ยวผักออร์แกนิกโรงเรือนชั่วคราว พื้นที่โซน A สระบุรี (หัก 40% แพลตฟอร์มแล้ว)',
      status: 'success'
    },
    {
      id: 'tx_3',
      date: '2026-01-20',
      type: 'dividend',
      amount: 450000,
      description: 'เงินปันผลรอบเก็บเกี่ยวข้าวโพดหวานคาร์บอนต่ำ โซน B (ส่วนผู้ลงทุนปันผลเรียบร้อย)',
      status: 'success'
    }
  ]
};
