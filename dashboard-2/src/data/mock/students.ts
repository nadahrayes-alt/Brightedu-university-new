// Mock student profiles. The kiosk never sees these — they live in
// "the backend" (mocked) and are only fetched after Nafath authentication
// on the user's phone.

export type AcademicStatus = 'enrolled' | 'graduated' | 'probation' | 'suspended';

export interface Student {
  /** Saudi national ID (10 digits). */
  nationalId: string;
  /** University ID. */
  universityId: string;
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
  college: string;
  major: string;
  level: number;
  gpa: number;
  status: AcademicStatus;
  /** Years registered. */
  enrolledYears: number;
  /** Eligible to receive these document types. */
  eligibleDocuments: string[];
  /** Outstanding fees in SAR (blocks document issuance if > 0). */
  outstandingFees: number;
  /** Academic warnings on file. */
  warnings: { reason: string; date: string }[];
}

export const STUDENTS: Student[] = [
  {
    nationalId: '1098765432',
    universityId: '2110007',
    nameAr: 'محمد عبدالله العتيبي',
    nameEn: 'Mohammed Abdullah Al-Otaibi',
    email: 'm.alotaibi@kau.edu.sa',
    phone: '+966 50 123 4567',
    college: 'كلية الحاسبات',
    major: 'علوم حاسب',
    level: 8,
    gpa: 4.62,
    status: 'graduated',
    enrolledYears: 4,
    eligibleDocuments: ['graduation_cert', 'enrollment_letter', 'transcript'],
    outstandingFees: 0,
    warnings: [],
  },
  {
    nationalId: '1087654321',
    universityId: '2210012',
    nameAr: 'سارة محمد القحطاني',
    nameEn: 'Sarah Mohammed Al-Qahtani',
    email: 's.alqahtani@kau.edu.sa',
    phone: '+966 55 987 6543',
    college: 'كلية الهندسة',
    major: 'هندسة كهربائية',
    level: 7,
    gpa: 4.31,
    status: 'enrolled',
    enrolledYears: 3,
    eligibleDocuments: ['enrollment_letter', 'transcript'],
    outstandingFees: 0,
    warnings: [],
  },
  {
    nationalId: '1076543210',
    universityId: '2310045',
    nameAr: 'أحمد ناصر الزهراني',
    nameEn: 'Ahmed Nasser Al-Zahrani',
    email: 'a.alzahrani@kau.edu.sa',
    phone: '+966 53 555 0123',
    college: 'كلية الإدارة',
    major: 'محاسبة',
    level: 4,
    gpa: 1.92,
    status: 'probation',
    enrolledYears: 2,
    eligibleDocuments: ['enrollment_letter'],
    outstandingFees: 1850,
    warnings: [
      { reason: 'انخفاض المعدل التراكمي تحت ٢٫٠', date: '٢٠٢٥-٠٣-١٢' },
    ],
  },
  {
    nationalId: '1054321098',
    universityId: '2010008',
    nameAr: 'ليلى عبدالرحمن الغامدي',
    nameEn: 'Layla Abdulrahman Al-Ghamdi',
    email: 'l.alghamdi@kau.edu.sa',
    phone: '+966 56 444 9876',
    college: 'كلية الآداب',
    major: 'لغة عربية',
    level: 8,
    gpa: 4.78,
    status: 'graduated',
    enrolledYears: 4,
    eligibleDocuments: ['graduation_cert', 'transcript', 'good_standing'],
    outstandingFees: 0,
    warnings: [],
  },
  {
    nationalId: '1065432109',
    universityId: '2410033',
    nameAr: 'فيصل خالد الدوسري',
    nameEn: 'Faisal Khaled Al-Dosari',
    email: 'f.aldosari@kau.edu.sa',
    phone: '+966 54 222 8765',
    college: 'كلية العلوم',
    major: 'فيزياء',
    level: 2,
    gpa: 3.18,
    status: 'enrolled',
    enrolledYears: 1,
    eligibleDocuments: ['enrollment_letter'],
    outstandingFees: 0,
    warnings: [],
  },
];

/** Find a student by national ID (the key Nafath returns after auth). */
export function findStudentByNationalId(id: string): Student | undefined {
  return STUDENTS.find((s) => s.nationalId === id);
}
