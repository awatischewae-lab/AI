/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'landowner' | 'investor';

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  userType: UserType;
  bankName: string;
  bankAccount: string;
}

export interface LandInfo {
  sizeRai: number;
  sizeNgan: number;
  sizeSqWah: number;
  province: string;
  district: string;
  coordinates: string;
  titleDeedNo: string; // โฉนดเลขที่
  photoUrl: string;
}

export interface CropPackage {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  durationDays: number;
  capitalRequired: number; // Baht
  expectedReturnMin: number; // % or absolute Baht
  expectedReturnMax: number;
  profitShareOwner: number; // e.g., 60
  profitSharePlatform: number; // e.g., 40
  description: string;
  features: string[];
  image: string;
}

export interface ContractDetails {
  packageId: string | null;
  signedName: string;
  signedDate: string;
  isSigned: boolean;
  profitShareOwner: number;
  profitSharePlatform: number;
}

export interface LandAssessment {
  bookedDate: string;
  bookedTime: string;
  status: 'none' | 'pending' | 'completed';
  soilPH: number;
  npkNutrients: {
    nitrogen: 'High' | 'Medium' | 'Low';
    phosphorus: 'High' | 'Medium' | 'Low';
    potassium: 'High' | 'Medium' | 'Low';
  };
  waterAccess: string;
  expertRecommendation: string;
  assessedBy: string;
}

export interface WeeklyUpdate {
  week: number;
  date: string;
  image: string;
  title: string;
  description: string;
  temperature: number;
  soilMoisture: number;
  heightCm: number;
}

export interface FarmingLog {
  id: string;
  date: string;
  activity: string;
  category: 'water' | 'fertilizer' | 'qc' | 'general' | 'growth';
  notes: string;
  operator: string;
}

export interface HarvestQC {
  harvstDate: string;
  status: 'harvested' | 'pending';
  totalYieldKg: number;
  gradeA_Percent: number;
  gradeB_Percent: number;
  gradeC_Percent: number;
  averageWeightKg: number;
  brixSweetness: number; // sweetness index
  qcStatus: 'Passed' | 'Pending';
  certificateNo: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'dividend' | 'withdrawal';
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

export interface AgriTurnkeyState {
  profile: UserProfile;
  land: LandInfo;
  contract: ContractDetails;
  assessment: LandAssessment;
  currentStep: number; // 1: Soil Prep, 2: Planting, 3: Harvesting, 4: Profit Sharing
  weeklyUpdates: WeeklyUpdate[];
  farmingLogs: FarmingLog[];
  harvestQC: HarvestQC;
  walletBalance: number;
  totalEarned: number;
  transactions: WalletTransaction[];
}
