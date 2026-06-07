/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Building2,
  Receipt,
  Download,
  Info,
  Check
} from 'lucide-react';
import { WalletTransaction, UserProfile, ContractDetails } from '../types';

interface WalletStepProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  totalEarned: number;
  setTotalEarned: (total: number) => void;
  transactions: WalletTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<WalletTransaction[]>>;
  profile: UserProfile;
  contract: ContractDetails;
}

export default function WalletStep({
  walletBalance,
  setWalletBalance,
  totalEarned,
  setTotalEarned,
  transactions,
  setTransactions,
  profile,
  contract
}: WalletStepProps) {
  
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [latestReceipt, setLatestReceipt] = useState<WalletTransaction | null>(null);

  // Profit Split Calculation based on package selected
  const totalGrossRevenue = 380000;
  const cultivationExpenses = 100000;
  const netProfit = totalGrossRevenue - cultivationExpenses;
  
  const ownerSharePercent = contract.profitShareOwner || 65;
  const platformSharePercent = contract.profitSharePlatform || 35;
  
  const ownerProfitShare = (netProfit * ownerSharePercent) / 100;
  const platformProfitShare = (netProfit * platformSharePercent) / 100;

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage('กรุณากรอกจำนวนเงินขั้นต่ำที่ต้องการถอนมากกว่า 0 บาท');
      setWithdrawStatus('error');
      return;
    }

    if (amountNum > walletBalance) {
      setErrorMessage('ยอดเงินเหลือในกระเป๋าของคุณไม่เพียงสำหรับการทำธุรกรรมนี้');
      setWithdrawStatus('error');
      return;
    }

    setWithdrawStatus('loading');

    setTimeout(() => {
      const remainingBalance = walletBalance - amountNum;
      setWalletBalance(remainingBalance);
      
      const newTx: WalletTransaction = {
        id: `tx_withdraw_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'withdrawal',
        amount: -amountNum,
        description: `ถอนเงินปันผลไปยัง บัญชีธนาคารคุณ ${profile.name} (${profile.bankName})`,
        status: 'success'
      };

      setTransactions(prev => [newTx, ...prev]);
      setLatestReceipt(newTx);
      setWithdrawStatus('success');
      setWithdrawAmount('');
    }, 1500);
  };

  const handleClaimCurrentHarvestShare = () => {
    // Add current owner profit share to the balance
    setWalletBalance(walletBalance + ownerProfitShare);
    setTotalEarned(totalEarned + ownerProfitShare);

    const newTx: WalletTransaction = {
      id: `tx_div_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'dividend',
      amount: ownerProfitShare,
      description: `เงินปันผลสุทธิพืชพรีเมียม (หักค่าใช้จ่ายคูณบริหาร-ผลผลิตเก๊สำเร็จ)`,
      status: 'success'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const alreadyClaimed = transactions.some(t => t.description.includes('เงินปันผลสุทธิพืชพรีเมียม'));

  return (
    <div id="wallet-profit-view" className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-organic-forest tracking-tight italic">การกระจายส่วนแบ่งกำไร & กระเป๋าเงินปันผล</h1>
        <p className="text-xs text-stone-550 font-medium">จัดการผลประกอบการ ตรวจพันธมิตรคู่ค้ารับซื้อ และถอนผลกำไรของท่านโอนตรงเข้าบัญชีธนาคารออนไลน์</p>
      </div>

      {/* Wallet balance highlight block & withdrawal form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Wallet Balance, Quick stats & Transfer Form (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Wallet Card */}
          <div className="bg-gradient-to-br from-organic-forest to-[#1E2E1F] border border-organic-clay/30 rounded-3xl p-6 text-white text-left relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10">
              <Wallet className="h-44 w-44 text-white" />
            </div>

            <div className="relative z-10 space-y-4">
              <div>
                <span className="text-xs font-mono font-semibold tracking-wider text-organic-sand uppercase opacity-90 block">ยอดรวมกระเป๋าเงินออนไลน์ (Wallet)</span>
                <p className="text-4xl font-mono font-extrabold pb-1">฿{walletBalance.toLocaleString()}</p>
                <div className="flex items-center space-x-4 text-xs opacity-85 pt-1 border-t border-white/10 mt-1">
                  <span>สะสมรับแล้วทั้งหมด: <strong>฿{totalEarned.toLocaleString()}</strong></span>
                  <span>บัตรผู้ดูแล: <strong>{profile.bankAccount}</strong></span>
                </div>
              </div>

              {/* In case they did not harvest/claim, let them trigger simulated payday right here */}
              {!alreadyClaimed && (
                <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
                  <span className="hidden sm:inline">มีเงินปันผลเมลอนรอบล่าสุดรอเคลมโอน <strong>(ยอด ฿{ownerProfitShare.toLocaleString()})</strong></span>
                  <span className="sm:hidden font-bold">ปันยอด ฿{ownerProfitShare.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={handleClaimCurrentHarvestShare}
                    className="bg-organic-sand text-[#2C3E2D] hover:bg-organic-cream hover:scale-[1.02] text-[11px] font-bold font-serif px-3.5 py-1.5 rounded-lg shrink-0 transition-transform cursor-pointer"
                  >
                    กดฝากโอนยอด
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Withdrawal Request Form Card */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-5 text-left">
            <div className="flex items-center space-x-2 pb-3 border-b border-organic-clay">
              <ArrowUpRight className="h-5 w-5 text-organic-green" />
              <h2 className="text-base font-serif font-bold text-organic-forest">ขอถอนเงินปันผลเข้าธนาคาร (Bank Transfer App-Withdrawal)</h2>
            </div>

            {withdrawStatus === 'success' && latestReceipt ? (
              /* Success alert Receipt modal simulated close */
              <div className="bg-organic-sand/65 border-2 border-organic-green/20 rounded-2xl p-5 text-center space-y-4">
                <div className="h-10 w-10 bg-organic-cream rounded-full border border-organic-clay flex items-center justify-center text-organic-green mx-auto shadow-xs">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-serif font-bold text-organic-forest italic text-center">โอนเงินออกเสร็จสิ้น!</p>
                  <p className="text-[11px] text-stone-550 text-center">ระบบกสิกรเกตเวย์โอนปันผลด่วนเข้ารูปแบบ บัญชี <strong>{profile.bankAccount}</strong> เรียบร้อยแล้ว</p>
                </div>
                
                {/* Embedded Receipt Slip representation */}
                <div className="bg-[#FDFCF8] rounded-2xl p-4 border border-organic-clay text-stone-600 max-w-sm mx-auto text-xs text-left space-y-3 font-mono">
                  <div className="flex justify-between border-b border-organic-clay pb-2 font-serif font-bold">
                    <span className="flex items-center text-organic-forest"><Receipt className="h-4 w-4 mr-1 text-organic-green" /> สลิปธนาคารอิเล็กทรอนิกส์</span>
                    <span className="text-organic-green text-[10px]">SUCCESS</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-400">ผู้รับโอน:</span>
                      <span className="text-organic-forest font-bold font-serif">{profile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">เลขบัญชีรับเงิน:</span>
                      <span className="text-stone-800">{profile.bankAccount} ({profile.bankName})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">จำนวนที่โอน:</span>
                      <span className="text-organic-green font-extrabold text-sm">฿{Math.abs(latestReceipt.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">เลขอ้างอิงสลิป:</span>
                      <span className="text-stone-500 text-[9px]">{latestReceipt.id}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setWithdrawStatus('idle')}
                    className="bg-organic-green hover:bg-organic-forest text-white text-xs font-bold font-sans px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    ทำรายการโอนเพิ่มอีกครั้ง
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                
                <div className="bg-[#FDFCF8] p-4 rounded-2xl border border-organic-clay flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 block mb-0.5">เงินปันผลที่ธนาคารผูกมัดไว้</span>
                    <span className="font-bold text-organic-forest font-serif">{profile.bankName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 block mb-0.5">เลขบัญชีปลายทาง</span>
                    <span className="font-mono font-bold text-stone-700">{profile.bankAccount}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 block">กรอกจำนวนเงินปันผลที่ประสงค์ถอนออก (บาท):</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="เช่น 50000"
                      className="w-full text-base font-mono font-extrabold pr-12 pl-3.5 py-3 rounded-xl border border-organic-clay bg-[#FDFCF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-organic-green/20 focus:border-organic-green"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                      <span className="text-xs font-bold text-stone-450 font-serif">บาท</span>
                    </div>
                  </div>
                </div>

                {withdrawStatus === 'error' && (
                  <p className="text-xs text-rose-600 font-bold flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 shrink-0 text-organic-earth" /> {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  id="btn-withdraw-profits"
                  disabled={withdrawStatus === 'loading'}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all active:scale-98 shadow-xs flex items-center justify-center space-x-1.5 ${
                    withdrawStatus === 'loading'
                      ? 'bg-[#ECE9DF] text-stone-500 cursor-wait border border-organic-clay'
                      : 'bg-[#374E39] text-white hover:bg-organic-forest'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  <span>{withdrawStatus === 'loading' ? 'คลาสเกตเวย์กำลังประมวลผลด่วน...' : 'อนุมัติถอนด่วนเข้าบัญชี'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

        {/* Right Side: Log of contract buyers / Sales breakdown (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Matching Partner Buyer Status */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-organic-clay">
              <Building className="h-4.5 w-4.5 text-organic-green" />
              <h3 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">พันธมิตรคู่ค้ารับซื้อจริงตามสัญญา (Buyer Agreement)</h3>
            </div>

            <p className="text-[11px] text-stone-550 leading-relaxed font-sans">
              ผลผลิตพรีเมียมจากโครงการเทิร์นคีย์นี้ ได้รับสัญญาจองซื้อประกันราคาขั้นต่ำเพื่อความปลอดภัยสูงสุดและเสถียรภาพรายได้ของผู้มีสัญญาร่วม:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-[#FDFCF8] rounded-xl border border-organic-clay text-xs flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-organic-forest">Siam Paragon / Gourmet Market</h4>
                  <span className="text-[10px] text-stone-400 block font-mono">สั่งซื้อ 1.1 ตัน (เกรดพรีเมียมสูงสุด)</span>
                </div>
                <span className="text-[9px] font-serif font-bold bg-organic-sand text-organic-green px-2.5 py-0.5 rounded border border-organic-clay/20">Matching</span>
              </div>
              <div className="p-3 bg-[#FDFCF8] rounded-xl border border-organic-clay text-xs flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-organic-forest">Lemon Farm ออร์แกนิกไทยแลนด์</h4>
                  <span className="text-[10px] text-stone-400 block font-mono">สั่งซื้อ 250 กิโลกรัม (เกรดรักสุขภาพ)</span>
                </div>
                <span className="text-[9px] font-serif font-bold bg-organic-sand text-organic-green px-2.5 py-0.5 rounded border border-organic-clay/20">Matching</span>
              </div>
            </div>
          </div>

          {/* Mathematical Profit split statement */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-organic-clay">
              <FileSpreadsheet className="h-4.5 w-4.5 text-organic-green" />
              <h3 className="text-sm font-serif font-bold text-organic-forest uppercase tracking-wider">บัญชีแจกแจงผลประกอบการ (Split ledger)</h3>
            </div>

            <div className="space-y-2.5 pt-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-450">มูลค่าขายผลผลิตยกกองสุทธิ:</span>
                <span className="font-mono font-bold text-stone-800">฿{totalGrossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-450">หักต้นทุนค่าปุ๋ย/การเกษตร:</span>
                <span className="font-mono font-medium text-rose-700">-฿{cultivationExpenses.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-organic-clay/50 my-1"></div>

              <div className="flex justify-between text-xs font-bold text-organic-forest">
                <span>กำไรบริสุทธิ์เพื่อประสานแบ่ง:</span>
                <span className="font-mono text-[#2C3E2D]">฿{netProfit.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-dashed border-[#E8E1D1] my-2"></div>

              <div className="flex justify-between text-[11px] bg-[#FDFCF8] p-3 rounded-2xl border border-organic-clay">
                <span className="text-stone-550 flex flex-col">
                  <strong>ส่วนผู้ร่วมทุน ({ownerSharePercent}%)</strong>
                  <span className="text-[9px] text-[#8C6D46] font-serif">คำนวณจากโควตาที่ท่านสนับสนุน</span>
                </span>
                <span className="font-mono font-extrabold text-organic-green text-right self-center">฿{ownerProfitShare.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-[11px] bg-[#FDFCF8] p-3 rounded-2xl border border-organic-clay">
                <span className="text-stone-550 flex flex-col">
                  <strong>ส่วนระบบ integrated agribusiness ({platformSharePercent}%)</strong>
                  <span className="text-[9px] text-[#7A5C3E] font-serif">ค่านายหน้าดูแลรักษาเซนเซอร์</span>
                </span>
                <span className="font-mono font-bold text-[#2C3E2D] text-right self-center">฿{platformProfitShare.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Ledger History List */}
          <div className="bg-organic-cream rounded-3xl border border-organic-clay p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-serif font-bold text-organic-earth uppercase tracking-wider block">ประวัติการทำกิจกรรมการเงิน (Wallet Ledger)</h3>
            
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-[#FDFCF8] rounded-2xl border border-organic-clay text-xs flex justify-between items-center text-left">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl shrink-0 border ${
                      tx.type === 'dividend' ? 'bg-organic-sand text-organic-green border-organic-green/20' : 'bg-[#FFF9F3] text-rose-700 border-organic-clay/20'
                    }`}>
                      {tx.type === 'dividend' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif font-bold text-[#2C3E2D] line-clamp-1 leading-tight">{tx.description}</p>
                      <span className="text-[9px] text-stone-400 font-mono">ID: {tx.id.substring(0, 15)} | {tx.date}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-extrabold text-right shrink-0 whitespace-nowrap pl-2 ${
                    tx.amount > 0 ? 'text-organic-green' : 'text-rose-700'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} บาท
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
