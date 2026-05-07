// Kiosk locations across the campus(es). Each one is a physical board
// running this same app, identified by a unique ID for the backend.

export interface Kiosk {
  id: string;
  /** Short prefix shown next to the avatar. */
  short: string;
  nameAr: string;
  nameEn: string;
  buildingAr: string;
  buildingEn: string;
  /** Campus this kiosk belongs to. */
  campus: 'kau-jeddah' | 'kau-rabigh';
  /** True for the default kiosk on app boot. */
  default?: boolean;
}

export const KIOSKS: Kiosk[] = [
  {
    id: 'KAU-04-01',
    short: 'ك',
    nameAr: 'لوحة الحرم — مبنى ٤',
    nameEn: 'Campus Board — Bldg 4',
    buildingAr: 'مبنى شؤون الطلبة',
    buildingEn: 'Student Affairs Building',
    campus: 'kau-jeddah',
    default: true,
  },
  {
    id: 'KAU-02-01',
    short: 'ك',
    nameAr: 'لوحة الحرم — المكتبة',
    nameEn: 'Campus Board — Library',
    buildingAr: 'المدخل الرئيسي للمكتبة',
    buildingEn: 'Library main entrance',
    campus: 'kau-jeddah',
  },
  {
    id: 'KAU-01-01',
    short: 'ك',
    nameAr: 'لوحة الحرم — القبول',
    nameEn: 'Campus Board — Admissions',
    buildingAr: 'مبنى القبول والتسجيل',
    buildingEn: 'Admissions & Registration',
    campus: 'kau-jeddah',
  },
  {
    id: 'KAU-05-01',
    short: 'ك',
    nameAr: 'لوحة الحرم — الأنشطة',
    nameEn: 'Campus Board — Activities',
    buildingAr: 'مركز الأنشطة الطلابية',
    buildingEn: 'Student Activities Center',
    campus: 'kau-jeddah',
  },
  {
    id: 'KAU-MAIN',
    short: 'ك',
    nameAr: 'لوحة الحرم — البوابة الرئيسية',
    nameEn: 'Campus Board — Main Gate',
    buildingAr: 'البوابة الشرقية',
    buildingEn: 'East Gate',
    campus: 'kau-jeddah',
  },
  {
    id: 'KAU-RBG-01',
    short: 'ر',
    nameAr: 'لوحة فرع رابغ — الإدارة',
    nameEn: 'Rabigh Branch — Admin',
    buildingAr: 'مبنى الإدارة الرئيسي',
    buildingEn: 'Main administration building',
    campus: 'kau-rabigh',
  },
];

export const DEFAULT_KIOSK_ID = KIOSKS.find((k) => k.default)?.id ?? KIOSKS[0].id;

export function findKioskById(id: string): Kiosk | undefined {
  return KIOSKS.find((k) => k.id === id);
}
