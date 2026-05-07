// Document request types and lifecycle states.

export type DocType =
  | 'graduation_cert'    // وثيقة تخرج
  | 'enrollment_letter'  // إثبات قيد
  | 'transcript'         // كشف درجات
  | 'good_standing'      // شهادة حسن سيرة
  | 'update_info';       // تعديل بيانات

export type DocStatus =
  | 'pending_verification'  // بانتظار التحقق من الهوية
  | 'in_review'             // قيد المراجعة
  | 'approved'              // موافق عليها، قيد الإصدار
  | 'ready_for_pickup'      // جاهزة للاستلام
  | 'delivered'             // تم الاستلام
  | 'rejected'              // مرفوض (رسوم متأخرة، إلخ)
  | 'cancelled';            // ألغى الطالب

export interface DocTypeMeta {
  id: DocType;
  nameAr: string;
  nameEn: string;
  /** Privacy tier per the spec. */
  tier: 'green' | 'yellow' | 'black';
  /** Estimated processing time. */
  etaDays: number;
  /** Standard fee in SAR (0 = free). */
  feeSAR: number;
  /** Pickup location, if physical. */
  pickup?: string;
  /** Required student status. */
  requires: ('enrolled' | 'graduated' | 'any')[];
}

export const DOC_TYPES: Record<DocType, DocTypeMeta> = {
  graduation_cert: {
    id: 'graduation_cert',
    nameAr: 'وثيقة تخرج',
    nameEn: 'Graduation Certificate',
    tier: 'black',
    etaDays: 5,
    feeSAR: 0,
    pickup: 'مبنى ٤ — شباك ٣',
    requires: ['graduated'],
  },
  enrollment_letter: {
    id: 'enrollment_letter',
    nameAr: 'إثبات قيد',
    nameEn: 'Enrollment Letter',
    tier: 'yellow',
    etaDays: 1,
    feeSAR: 0,
    pickup: 'إلكتروني — يصل بريدًا',
    requires: ['enrolled'],
  },
  transcript: {
    id: 'transcript',
    nameAr: 'كشف درجات',
    nameEn: 'Official Transcript',
    tier: 'black',
    etaDays: 3,
    feeSAR: 50,
    pickup: 'مبنى ٤ — شباك ٣',
    requires: ['any'],
  },
  good_standing: {
    id: 'good_standing',
    nameAr: 'شهادة حسن سيرة',
    nameEn: 'Good-Standing Certificate',
    tier: 'yellow',
    etaDays: 2,
    feeSAR: 0,
    pickup: 'إلكتروني — يصل بريدًا',
    requires: ['any'],
  },
  update_info: {
    id: 'update_info',
    nameAr: 'تعديل بيانات',
    nameEn: 'Update Personal Info',
    tier: 'yellow',
    etaDays: 1,
    feeSAR: 0,
    requires: ['any'],
  },
};

export interface DocumentRequest {
  id: string;
  type: DocType;
  studentNationalId: string;
  status: DocStatus;
  /** ISO date strings. */
  createdAt: string;
  updatedAt: string;
  /** Optional: rejection reason, pickup window, etc. */
  note?: string;
}

/** A small in-memory log of historical requests (for the demo). */
export const SAMPLE_REQUESTS: DocumentRequest[] = [
  {
    id: 'REQ-2025-0042',
    type: 'graduation_cert',
    studentNationalId: '1054321098',
    status: 'ready_for_pickup',
    createdAt: '2025-04-29T10:14:00+03:00',
    updatedAt: '2025-05-04T08:00:00+03:00',
    note: 'جاهزة للاستلام من مبنى ٤، شباك ٣، خلال أسبوع.',
  },
  {
    id: 'REQ-2025-0117',
    type: 'enrollment_letter',
    studentNationalId: '1087654321',
    status: 'delivered',
    createdAt: '2025-05-02T14:22:00+03:00',
    updatedAt: '2025-05-02T15:01:00+03:00',
  },
  {
    id: 'REQ-2025-0131',
    type: 'transcript',
    studentNationalId: '1076543210',
    status: 'rejected',
    createdAt: '2025-05-04T09:12:00+03:00',
    updatedAt: '2025-05-04T09:15:00+03:00',
    note: 'رسوم متأخرة: ١٬٨٥٠ ر.س. — يرجى السداد قبل إعادة الطلب.',
  },
];
