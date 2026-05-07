// Mock data for the BrightEdu × KAU Administrative Automation Dashboard.
// All names are fictional. Sensitive fields are masked at the source.

export type AiTier = 'green' | 'yellow' | 'red' | 'black';
export type RequestStatus =
  | 'new'
  | 'in_review'
  | 'waiting_approval'
  | 'waiting_student'
  | 'escalated'
  | 'completed'
  | 'rejected'
  | 'sla_risk'
  | 'sla_breached';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type Channel = 'kiosk' | 'mobile' | 'whatsapp' | 'web' | 'staff';

export type Role = 'staff' | 'supervisor' | 'dean';

export interface RequestRow {
  id: string;
  service: string;             // English service name
  serviceAr: string;
  tier: AiTier;
  status: RequestStatus;
  priority: Priority;
  channel: Channel;
  studentMaskedId: string;
  studentName?: string;
  studentNameEn?: string;
  college: string;
  collegeAr: string;
  assignedTo?: string;
  assignedToAr?: string;
  slaMinutesLeft: number;
  createdAt: string;
  updatedAt: string;
  aiSummaryAr: string;
  aiSummaryEn?: string;
  rules: { id: string; labelAr: string; labelEn?: string; passed: boolean }[];
  evidence?: { name: string; nameAr: string; type: string }[];
  audit: {
    actor: string;
    actorAr: string;
    actionAr: string;
    actionEn?: string;
    at: string;
    system?: boolean;
  }[];
  notificationPreviewAr: string;
  notificationPreviewEn?: string;
}

const now = new Date('2026-05-06T10:25:00');
const iso = (mLeft: number) => new Date(now.getTime() - (60 - mLeft) * 60_000).toISOString();

export const requests: RequestRow[] = [
  {
    id: 'REQ-1024',
    service: 'Official transcript',
    serviceAr: 'إصدار كشف درجات رسمي',
    tier: 'green',
    status: 'completed',
    priority: 'normal',
    channel: 'mobile',
    studentMaskedId: '٢٠٢١****٧٤٢',
    studentName: 'سارة الحربي',
    studentNameEn: 'Sara Al-Harbi',
    college: 'Computer & IS',
    collegeAr: 'الحاسبات وتقنية المعلومات',
    assignedTo: 'AI · Auto-issued',
    assignedToAr: 'النظام · إصدار تلقائي',
    slaMinutesLeft: 132,
    createdAt: iso(-12),
    updatedAt: iso(-9),
    aiSummaryAr:
      'طلب كشف درجات رسمي. اجتاز جميع شروط الإصدار الآلي. تم التوقيع الرقمي وإرسال الرابط إلى الطالبة.',
    aiSummaryEn:
      'Official transcript request. All automated-issuance rules passed. Digitally signed and a secure link was sent to the student.',
    rules: [
      { id: 'r1', labelAr: 'الطالبة منتظمة في الفصل الحالي', labelEn: 'Student enrolled this term',  passed: true },
      { id: 'r2', labelAr: 'لا توجد إيقافات أكاديمية',        labelEn: 'No academic holds',           passed: true },
      { id: 'r3', labelAr: 'لا توجد إيقافات مالية',           labelEn: 'No financial holds',          passed: true },
      { id: 'r4', labelAr: 'الطلب ضمن الحد الشهري المسموح',   labelEn: 'Within monthly issuance cap', passed: true },
    ],
    audit: [
      { actor: 'Mobile app',          actorAr: 'تطبيق الجوال',          actionAr: 'استلام الطلب',                          actionEn: 'Request received',                              at: iso(-12), system: true },
      { actor: 'AI engine',           actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'فحص الشروط — اجتيازها بالكامل',         actionEn: 'Rules check — all passed',                       at: iso(-11), system: true },
      { actor: 'Document service',    actorAr: 'خدمة الوثائق',          actionAr: 'إصدار وتوقيع رقمي',                     actionEn: 'Issued and digitally signed',                    at: iso(-10), system: true },
      { actor: 'Notify',              actorAr: 'الإشعارات',             actionAr: 'إرسال الرابط للطالبة عبر واتساب',        actionEn: 'Sent secure link to student via WhatsApp',       at: iso(-9),  system: true },
    ],
    notificationPreviewAr: 'مرحبًا، تم إصدار كشف درجاتك الرسمي. يمكنك تنزيله من الرابط الآمن خلال ٢٤ ساعة.',
    notificationPreviewEn: 'Hi, your official transcript has been issued. You can download it from the secure link within 24 hours.',
  },
  {
    id: 'REQ-1025',
    service: 'Graduation certificate',
    serviceAr: 'شهادة تخرّج',
    tier: 'yellow',
    status: 'waiting_approval',
    priority: 'high',
    channel: 'kiosk',
    studentMaskedId: '٢٠٢٠****١٠٣',
    studentName: 'عبدالله القحطاني',
    studentNameEn: 'Abdullah Al-Qahtani',
    college: 'Engineering',
    collegeAr: 'الهندسة',
    assignedTo: 'Munira Al-Otaibi',
    assignedToAr: 'منيرة العتيبي',
    slaMinutesLeft: 343,
    createdAt: iso(-43),
    updatedAt: iso(-6),
    aiSummaryAr:
      'الطالب طلب شهادة تخرج عبر شاشة الحرم وتابع البيانات الخاصة على جواله عبر QR. اكتملت بيانات الأهلية. يحتاج اعتماد الموظف قبل الإصدار.',
    aiSummaryEn:
      'Student requested a graduation certificate via the campus board, then continued the private flow on mobile via QR. Eligibility data is complete. Staff approval required before issuance.',
    rules: [
      { id: 'r1', labelAr: 'استكمل ١٤٤ ساعة معتمدة',         labelEn: 'Completed 144 credit hours',          passed: true  },
      { id: 'r2', labelAr: 'لا توجد إيقافات',                 labelEn: 'No holds',                            passed: true  },
      { id: 'r3', labelAr: 'تم سداد رسوم الخدمة',            labelEn: 'Service fee paid',                    passed: true  },
      { id: 'r4', labelAr: 'مطابقة بيانات الهوية الوطنية',    labelEn: 'National ID matched',                 passed: true  },
      { id: 'r5', labelAr: 'مراجعة شهادة الفصل النهائي',      labelEn: 'Final-term review attached',          passed: false },
    ],
    evidence: [
      { name: 'national_id.pdf',        nameAr: 'الهوية الوطنية.pdf',         type: 'pdf' },
      { name: 'final_term_review.pdf',  nameAr: 'مراجعة الفصل النهائي.pdf',   type: 'pdf' },
    ],
    audit: [
      { actor: 'Kiosk #3 — Building 4',  actorAr: 'شاشة الحرم #٣ — مبنى ٤',     actionAr: 'بدء الطلب من الشاشة العامة',          actionEn: 'Request started from public board',                       at: iso(-43), system: true },
      { actor: 'Mobile (QR handoff)',    actorAr: 'الجوال (انتقال عبر QR)',     actionAr: 'استكمال البيانات الخاصة',              actionEn: 'Private data completed via mobile',                       at: iso(-41), system: true },
      { actor: 'AI engine',              actorAr: 'محرّك الذكاء الاصطناعي',     actionAr: 'إعداد ملخص الطلب وفحص الشروط',          actionEn: 'AI prepared summary and ran eligibility checks',         at: iso(-40), system: true },
      { actor: 'Munira Al-Otaibi',       actorAr: 'منيرة العتيبي',              actionAr: 'فتح الطلب للمراجعة',                    actionEn: 'Opened request for review',                              at: iso(-6) },
    ],
    notificationPreviewAr: 'تم اعتماد طلب شهادة التخرج. سيصلك إشعار بإمكانية الاستلام الإلكتروني خلال ساعتين.',
    notificationPreviewEn: 'Your graduation certificate request has been approved. You will receive a digital pickup notification within two hours.',
  },
  {
    id: 'REQ-1026',
    service: 'Voice complaint intake',
    serviceAr: 'شكوى صوتية',
    tier: 'yellow',
    status: 'in_review',
    priority: 'high',
    channel: 'kiosk',
    studentMaskedId: '٢٠٢٢****٤٨٩',
    studentName: 'لمياء الزهراني',
    studentNameEn: 'Lamia Al-Zahrani',
    college: 'Sciences',
    collegeAr: 'العلوم',
    assignedTo: 'Khalid Al-Saif',
    assignedToAr: 'خالد السيف',
    slaMinutesLeft: 80,
    createdAt: iso(-22),
    updatedAt: iso(-3),
    aiSummaryAr:
      'الطالبة سجّلت شكوى صوتية حول تأخر إصدار وثيقة. صنّفها النظام: "خدمات وثائق — تأخر". مرفقات: نسخة نصية. يلزم مراجعة بشرية قبل الردّ.',
    aiSummaryEn:
      'Student filed a voice complaint about a delayed document. System category: "Document services — delay". Attachments: transcript. Human review needed before reply.',
    rules: [
      { id: 'r1', labelAr: 'تم تفريغ الصوت إلى نص',     labelEn: 'Voice transcribed to text',     passed: true  },
      { id: 'r2', labelAr: 'تصنيف الشكوى تلقائيًا',     labelEn: 'Complaint auto-classified',     passed: true  },
      { id: 'r3', labelAr: 'مراجعة الموظف للنبرة قبل الرد', labelEn: 'Staff review tone before reply', passed: false },
    ],
    evidence: [{ name: 'voice_2026-05-06.m4a', nameAr: 'تسجيل صوتي.m4a', type: 'audio' }],
    audit: [
      { actor: 'Kiosk #1 — Main', actorAr: 'شاشة الحرم #١ — البوابة', actionAr: 'استلام شكوى صوتية',         actionEn: 'Voice complaint received',         at: iso(-22), system: true },
      { actor: 'AI engine',       actorAr: 'محرّك الذكاء الاصطناعي',  actionAr: 'تفريغ الصوت وتصنيفه',       actionEn: 'Transcription and classification', at: iso(-21), system: true },
      { actor: 'Khalid Al-Saif',  actorAr: 'خالد السيف',              actionAr: 'تعيين الشكوى لنفسه',         actionEn: 'Assigned to self',                 at: iso(-12) },
    ],
    notificationPreviewAr: 'استلمنا شكواكِ ونعمل على متابعتها. سنوافيكِ بالتحديث خلال ٢٤ ساعة عمل.',
    notificationPreviewEn: 'We have received your complaint and are working on it. You will get an update within one business day.',
  },
  {
    id: 'REQ-1027',
    service: 'Academic support flag',
    serviceAr: 'متابعة دعم أكاديمي',
    tier: 'red',
    status: 'escalated',
    priority: 'urgent',
    channel: 'staff',
    studentMaskedId: '٢٠٢٣****٢٢١',
    college: 'Business',
    collegeAr: 'إدارة الأعمال',
    assignedTo: 'Advisor — Layla M.',
    assignedToAr: 'المرشدة الأكاديمية ليلى م.',
    slaMinutesLeft: -45,
    createdAt: iso(-180),
    updatedAt: iso(-30),
    aiSummaryAr:
      'إشارات على انخفاض تفاعل الطالبة في الفصل الحالي وتأخر متكرر في التسليم. اقتراح: تواصل مرشد أكاديمي. القرار النهائي بشري.',
    aiSummaryEn:
      'Signals indicate lower engagement and repeated late submissions this term. Suggestion: advisor outreach. Final decision is human.',
    rules: [
      { id: 'r1', labelAr: 'تطابق الأنماط مع نموذج الدعم', labelEn: 'Patterns match support model', passed: true  },
      { id: 'r2', labelAr: 'موافقة المرشد على المتابعة',    labelEn: 'Advisor consent to follow-up', passed: false },
    ],
    audit: [
      { actor: 'AI engine',         actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'كشف نمط — اقتراح متابعة دعم', actionEn: 'Pattern detected — follow-up suggested', at: iso(-180), system: true },
      { actor: 'Munira Al-Otaibi',  actorAr: 'منيرة العتيبي',          actionAr: 'تصعيد للمرشد الأكاديمي',     actionEn: 'Escalated to academic advisor',         at: iso(-150) },
    ],
    notificationPreviewAr: '— لا تُرسل رسائل تلقائية في الحالات الحساسة. يبدأها المرشد بنفسه —',
    notificationPreviewEn: '— No automated messages on sensitive cases. The advisor initiates outreach personally —',
  },
  {
    id: 'REQ-1028',
    service: 'GPA inquiry on kiosk',
    serviceAr: 'استفسار معدل عبر الشاشة',
    tier: 'black',
    status: 'completed',
    priority: 'low',
    channel: 'kiosk',
    studentMaskedId: '٢٠٢٢****٠٩١',
    college: 'Arts & Humanities',
    collegeAr: 'الآداب والعلوم الإنسانية',
    assignedTo: 'Privacy handoff',
    assignedToAr: 'تحويل خاص للجوال',
    slaMinutesLeft: 5,
    createdAt: iso(-8),
    updatedAt: iso(-7),
    aiSummaryAr:
      'استفسار عن معدل تراكمي عبر شاشة عامة — تصنيف: بيانات مقيّدة. تم تحويل الطالبة إلى قناة خاصة دون عرض أي بيانات على الشاشة.',
    aiSummaryEn:
      'GPA inquiry on a public board — classification: restricted. The student was redirected to a private channel; no data was displayed publicly.',
    rules: [
      { id: 'r1', labelAr: 'لا تُعرض البيانات الحساسة على الشاشة العامة', labelEn: 'No sensitive data on public board', passed: true },
      { id: 'r2', labelAr: 'تحويل آمن عبر QR',                          labelEn: 'Secure QR handoff',                 passed: true },
    ],
    audit: [
      { actor: 'Kiosk #2',  actorAr: 'شاشة الحرم #٢',           actionAr: 'استلام استفسار حساس',            actionEn: 'Sensitive inquiry received',                at: iso(-8), system: true },
      { actor: 'AI engine', actorAr: 'محرّك الذكاء الاصطناعي',   actionAr: 'رفض العرض العام — تحويل خاص',     actionEn: 'Public display refused — private handoff',  at: iso(-8), system: true },
      { actor: 'Mobile',    actorAr: 'الجوال',                  actionAr: 'تأكيد استلام المعلومة في القناة الخاصة', actionEn: 'Delivery confirmed in private channel', at: iso(-7), system: true },
    ],
    notificationPreviewAr: 'لحماية خصوصيتك، أرسلنا إجابة استفسارك إلى تطبيقك مباشرة.',
    notificationPreviewEn: 'To protect your privacy, we sent the answer to your app directly.',
  },
  {
    id: 'REQ-1029',
    service: 'Enrollment confirmation letter',
    serviceAr: 'خطاب تعريف بالقيد',
    tier: 'green',
    status: 'completed',
    priority: 'normal',
    channel: 'mobile',
    studentMaskedId: '٢٠٢١****٨٢٢',
    studentName: 'فهد الشمري',
    studentNameEn: 'Fahad Al-Shamri',
    college: 'Engineering',
    collegeAr: 'الهندسة',
    assignedTo: 'AI · Auto-issued',
    assignedToAr: 'النظام · إصدار تلقائي',
    slaMinutesLeft: 200,
    createdAt: iso(-30),
    updatedAt: iso(-29),
    aiSummaryAr: 'إصدار خطاب تعريف موجّه إلى جهة العمل. إصدار آلي بعد اجتياز الشروط.',
    aiSummaryEn: 'Enrollment letter addressed to an external party. Auto-issued after passing all rules.',
    rules: [
      { id: 'r1', labelAr: 'الطالب منتظم', labelEn: 'Student enrolled', passed: true },
      { id: 'r2', labelAr: 'لا إيقافات',   labelEn: 'No holds',          passed: true },
    ],
    audit: [
      { actor: 'Mobile',    actorAr: 'الجوال',                actionAr: 'استلام الطلب', actionEn: 'Request received', at: iso(-30), system: true },
      { actor: 'AI engine', actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'إصدار آلي',    actionEn: 'Auto issued',       at: iso(-29), system: true },
    ],
    notificationPreviewAr: 'تم إصدار خطاب التعريف. يمكنك تنزيله من تطبيقك.',
    notificationPreviewEn: 'Your enrollment letter has been issued. Download it from your app.',
  },
  {
    id: 'REQ-1030',
    service: 'Personal info update',
    serviceAr: 'تحديث بيانات شخصية',
    tier: 'yellow',
    status: 'waiting_approval',
    priority: 'normal',
    channel: 'web',
    studentMaskedId: '٢٠٢٠****٤٣٣',
    studentName: 'نورة الدوسري',
    studentNameEn: 'Noura Al-Dosari',
    college: 'Sciences',
    collegeAr: 'العلوم',
    assignedTo: 'Munira Al-Otaibi',
    assignedToAr: 'منيرة العتيبي',
    slaMinutesLeft: 720,
    createdAt: iso(-95),
    updatedAt: iso(-15),
    aiSummaryAr:
      'الطالبة طلبت تحديث رقم الجوال وعنوان السكن. مطابقة المرفقات تمت آليًا. ينتظر اعتماد الموظف.',
    aiSummaryEn:
      'Student requested phone and address update. Attachments verified automatically. Awaiting staff approval.',
    rules: [
      { id: 'r1', labelAr: 'مطابقة الهوية',          labelEn: 'ID matched',           passed: true },
      { id: 'r2', labelAr: 'مطابقة فاتورة السكن',    labelEn: 'Utility bill matched', passed: true },
    ],
    audit: [
      { actor: 'Web',       actorAr: 'الموقع',                actionAr: 'تقديم الطلب',     actionEn: 'Request submitted',  at: iso(-95), system: true },
      { actor: 'AI engine', actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'مطابقة المرفقات', actionEn: 'Attachments verified', at: iso(-94), system: true },
    ],
    notificationPreviewAr: 'تم اعتماد تحديث بياناتك بنجاح.',
    notificationPreviewEn: 'Your information update has been approved successfully.',
  },
  {
    id: 'REQ-1031',
    service: 'Academic appeal intake',
    serviceAr: 'تظلّم أكاديمي',
    tier: 'red',
    status: 'in_review',
    priority: 'urgent',
    channel: 'web',
    studentMaskedId: '٢٠٢٠****٧٧٠',
    college: 'Sharia & Law',
    collegeAr: 'الشريعة والأنظمة',
    assignedTo: 'Dean office',
    assignedToAr: 'مكتب العمادة',
    slaMinutesLeft: 60,
    createdAt: iso(-60),
    updatedAt: iso(-12),
    aiSummaryAr:
      'تظلّم أكاديمي مع مرفقات متعددة. لخّص النظام النقاط الأساسية ومراجع اللوائح المطابقة. القرار بشري بالكامل.',
    aiSummaryEn:
      'Academic appeal with multiple attachments. AI summarized the key points and matching policy references. Decision fully human.',
    rules: [
      { id: 'r1', labelAr: 'اكتمال المرفقات',         labelEn: 'Attachments complete',  passed: true  },
      { id: 'r2', labelAr: 'موافقة لجنة العمادة',     labelEn: "Dean's committee sign-off", passed: false },
    ],
    audit: [
      { actor: 'Web',       actorAr: 'الموقع',                actionAr: 'استلام التظلّم',          actionEn: 'Appeal received',                       at: iso(-60), system: true },
      { actor: 'AI engine', actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'تلخيص ومطابقة اللوائح', actionEn: 'Summary prepared and policies matched', at: iso(-58), system: true },
    ],
    notificationPreviewAr: '— لا تُرسل رسائل تلقائية. تبدأ اللجنة المراسلة الرسمية —',
    notificationPreviewEn: '— No automated messages. The committee initiates formal correspondence —',
  },
  {
    id: 'REQ-1032',
    service: 'Good standing certificate',
    serviceAr: 'شهادة حُسن سيرة',
    tier: 'green',
    status: 'completed',
    priority: 'normal',
    channel: 'whatsapp',
    studentMaskedId: '٢٠٢٢****٥٥٦',
    studentName: 'ريم العنزي',
    studentNameEn: 'Reem Al-Anzi',
    college: 'Computer & IS',
    collegeAr: 'الحاسبات وتقنية المعلومات',
    assignedTo: 'AI · Auto-issued',
    assignedToAr: 'النظام · إصدار تلقائي',
    slaMinutesLeft: 290,
    createdAt: iso(-50),
    updatedAt: iso(-49),
    aiSummaryAr: 'إصدار شهادة حُسن سيرة بعد اجتياز جميع الشروط آليًا.',
    aiSummaryEn: 'Good-standing certificate auto-issued after all checks passed.',
    rules: [{ id: 'r1', labelAr: 'لا توجد ملاحظات سلوكية', labelEn: 'No conduct flags', passed: true }],
    audit: [
      { actor: 'WhatsApp bot', actorAr: 'بوت واتساب',           actionAr: 'استلام الطلب', actionEn: 'Request received', at: iso(-50), system: true },
      { actor: 'AI engine',    actorAr: 'محرّك الذكاء الاصطناعي', actionAr: 'إصدار آلي',    actionEn: 'Auto issued',       at: iso(-49), system: true },
    ],
    notificationPreviewAr: 'تم إصدار شهادة حُسن السيرة. يمكنك تنزيلها من الرابط الآمن.',
    notificationPreviewEn: 'Your good-standing certificate has been issued. Download it from the secure link.',
  },
  {
    id: 'REQ-1033',
    service: 'Document correction',
    serviceAr: 'تصحيح وثيقة',
    tier: 'yellow',
    status: 'sla_risk',
    priority: 'high',
    channel: 'kiosk',
    studentMaskedId: '٢٠٢١****١١٤',
    studentName: 'ماجد الزهراني',
    studentNameEn: 'Majed Al-Zahrani',
    college: 'Medicine',
    collegeAr: 'الطب',
    assignedTo: 'Khalid Al-Saif',
    assignedToAr: 'خالد السيف',
    slaMinutesLeft: 18,
    createdAt: iso(-280),
    updatedAt: iso(-25),
    aiSummaryAr: 'طلب تصحيح اسم في وثيقة سابقة. تطابق الهوية الوطنية. ينتظر الاعتماد.',
    aiSummaryEn: 'Name-correction request on a prior document. National ID matched. Awaiting approval.',
    rules: [
      { id: 'r1', labelAr: 'إثبات الفرق بين الاسمين', labelEn: 'Proof of name difference', passed: true  },
      { id: 'r2', labelAr: 'موافقة المسؤول',          labelEn: 'Officer sign-off',          passed: false },
    ],
    audit: [
      { actor: 'Kiosk #4',       actorAr: 'شاشة الحرم #٤',           actionAr: 'استلام الطلب',         actionEn: 'Request received',     at: iso(-280), system: true },
      { actor: 'AI engine',      actorAr: 'محرّك الذكاء الاصطناعي',  actionAr: 'مطابقة الوثائق',        actionEn: 'Documents matched',    at: iso(-279), system: true },
      { actor: 'Khalid Al-Saif', actorAr: 'خالد السيف',              actionAr: 'استلام للمراجعة',       actionEn: 'Picked up for review', at: iso(-200) },
    ],
    notificationPreviewAr: 'تم تصحيح وثيقتك. يمكنك تنزيل النسخة المصححة من تطبيقك.',
    notificationPreviewEn: 'Your document has been corrected. Download the updated copy from your app.',
  },
  {
    id: 'REQ-1034',
    service: 'Transcript request',
    serviceAr: 'كشف درجات',
    tier: 'green',
    status: 'in_review',
    priority: 'normal',
    channel: 'mobile',
    studentMaskedId: '٢٠٢٠****٣٠٢',
    studentName: 'ليان الغامدي',
    studentNameEn: 'Layan Al-Ghamdi',
    college: 'Pharmacy',
    collegeAr: 'الصيدلة',
    assignedTo: 'AI · Auto-issued',
    assignedToAr: 'النظام · إصدار تلقائي',
    slaMinutesLeft: 90,
    createdAt: iso(-4),
    updatedAt: iso(-2),
    aiSummaryAr: 'كشف درجات — قيد الإصدار الآلي.',
    aiSummaryEn: 'Transcript — auto-issuance in progress.',
    rules: [{ id: 'r1', labelAr: 'لا إيقافات', labelEn: 'No holds', passed: true }],
    audit: [
      { actor: 'Mobile', actorAr: 'الجوال', actionAr: 'استلام الطلب', actionEn: 'Request received', at: iso(-4), system: true },
    ],
    notificationPreviewAr: 'تم استلام طلبك. سيصلك إشعار خلال دقائق.',
    notificationPreviewEn: 'Your request has been received. You will get a notification within minutes.',
  },
  {
    id: 'REQ-1035',
    service: 'Advisor appointment',
    serviceAr: 'موعد مع مرشد أكاديمي',
    tier: 'green',
    status: 'completed',
    priority: 'normal',
    channel: 'mobile',
    studentMaskedId: '٢٠٢٢****٦٦٧',
    studentName: 'عمر بن جابر',
    studentNameEn: 'Omar bin Jaber',
    college: 'Engineering',
    collegeAr: 'الهندسة',
    assignedTo: 'AI · Scheduler',
    assignedToAr: 'النظام · جدولة آلية',
    slaMinutesLeft: 400,
    createdAt: iso(-65),
    updatedAt: iso(-64),
    aiSummaryAr: 'حجز موعد مع مرشد أكاديمي خلال يومين.',
    aiSummaryEn: 'Booked an advisor appointment within two days.',
    rules: [{ id: 'r1', labelAr: 'توفر فترة متاحة', labelEn: 'Open slot available', passed: true }],
    audit: [
      { actor: 'Mobile',    actorAr: 'الجوال',     actionAr: 'استلام الطلب', actionEn: 'Request received', at: iso(-65), system: true },
      { actor: 'Scheduler', actorAr: 'المُجدول',   actionAr: 'تثبيت الموعد',  actionEn: 'Slot booked',       at: iso(-64), system: true },
    ],
    notificationPreviewAr: 'تم حجز موعدك مع المرشد. التفاصيل في تطبيقك.',
    notificationPreviewEn: 'Your advisor appointment is booked. Details in your app.',
  },
];

// ----------------- KPIs -----------------
export const overviewKpis = {
  totalToday: 1248,
  completedToday: 932,
  pending: 216,
  slaAtRisk: 38,
  avgCompletionMin: 18,
  automationRate: 64,
  hoursSaved: 126,
  supportAlerts: 42,
};

// 12 hours of request volume
export const requestVolume = [
  { h: '07:00', requests: 22, automated: 15 },
  { h: '08:00', requests: 64, automated: 40 },
  { h: '09:00', requests: 124, automated: 82 },
  { h: '10:00', requests: 208, automated: 142 },
  { h: '11:00', requests: 192, automated: 128 },
  { h: '12:00', requests: 158, automated: 100 },
  { h: '13:00', requests: 110, automated: 70 },
  { h: '14:00', requests: 178, automated: 122 },
  { h: '15:00', requests: 152, automated: 96 },
  { h: '16:00', requests: 88, automated: 54 },
  { h: '17:00', requests: 44, automated: 22 },
  { h: '18:00', requests: 18, automated: 9 },
];

export const topServices = [
  { nameAr: 'كشف درجات',      nameEn: 'Transcript',           count: 412, automation: 92 },
  { nameAr: 'خطاب تعريف',      nameEn: 'Enrollment letter',    count: 286, automation: 88 },
  { nameAr: 'شهادة حُسن سيرة',  nameEn: 'Good-standing cert.',  count: 198, automation: 81 },
  { nameAr: 'تحديث بيانات',     nameEn: 'Info update',          count: 142, automation: 60 },
  { nameAr: 'شهادة تخرّج',      nameEn: 'Graduation cert.',     count: 96,  automation: 22 },
  { nameAr: 'تظلّم أكاديمي',    nameEn: 'Appeal intake',        count: 38,  automation: 0 },
];

export const channelMix = [
  { name: 'Kiosk',    nameAr: 'الشاشة',   value: 1820, color: '#2F5BFF' },
  { name: 'Mobile',   nameAr: 'الجوال',   value: 1340, color: '#007C8A' },
  { name: 'WhatsApp', nameAr: 'واتساب',   value: 880,  color: '#5D4FBE' },
  { name: 'Web',      nameAr: 'الموقع',   value: 510,  color: '#64A2D9' },
  { name: 'Staff',    nameAr: 'موظف',     value: 220,  color: '#94A3B8' },
];

export const automationDonut = [
  { name: 'fullyAutomated', nameAr: 'أتمتة كاملة',     nameEn: 'Fully automated',  value: 64, color: '#16A34A' },
  { name: 'staffApproved',  nameAr: 'باعتماد الموظف',  nameEn: 'Staff approved',   value: 28, color: '#2F5BFF' },
  { name: 'human',          nameAr: 'قرار بشري',       nameEn: 'Human decision',   value: 8,  color: '#5D4FBE' },
];

export const slaCompliance = { compliant: 91.4, atRisk: 6.2, breached: 2.4 };

export const peakHeat = (() => {
  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const daysEn = ['Sun',   'Mon',     'Tue',      'Wed',       'Thu'];
  const hours  = ['08', '09', '10', '11', '12', '13', '14', '15', '16'];
  const data: { day: string; hour: string; v: number }[] = [];
  daysAr.forEach((d, di) => {
    hours.forEach((h, hi) => {
      const peak = (hi >= 2 && hi <= 4) || (hi >= 6 && hi <= 7);
      const base = peak ? 60 : 25;
      data.push({ day: d, hour: h, v: Math.max(4, base + ((di * 7 + hi * 13) % 35) - 10) });
    });
  });
  return { daysAr, daysEn, hours, data };
})();

// ----------------- Student Support -----------------
export interface SupportCase {
  id: string;
  studentMaskedId: string;
  collegeAr: string;
  collegeEn: string;
  signalKey: 'engagement' | 'absence' | 'late' | 'sudden';
  trendDir: 'down' | 'flat' | 'up';
  suggestedActionAr: string;
  suggestedActionEn: string;
  advisorAr: string;
  advisorEn: string;
  status: 'open' | 'reviewed' | 'scheduled' | 'closed';
  weeks: number[];
}

export const supportKpis = {
  needsFollowUp: 42,
  advisorReviewsPending: 18,
  followUpsCompleted: 27,
  referralsSuggested: 9,
};

export const supportCases: SupportCase[] = [
  { id: 'SUP-204', studentMaskedId: '٢٠٢٢****٧٧٢', collegeAr: 'الهندسة',                    collegeEn: 'Engineering',           signalKey: 'engagement', trendDir: 'down', suggestedActionAr: 'محادثة دعم من المرشد الأكاديمي',         suggestedActionEn: 'Supportive conversation with advisor',     advisorAr: 'ليلى م.', advisorEn: 'Layla M.', status: 'open',      weeks: [82, 78, 70, 60, 52, 44] },
  { id: 'SUP-205', studentMaskedId: '٢٠٢١****٣٣١', collegeAr: 'الآداب والعلوم الإنسانية',    collegeEn: 'Arts & Humanities',     signalKey: 'absence',    trendDir: 'down', suggestedActionAr: 'تواصل أولي + إحالة لمركز الإرشاد',       suggestedActionEn: 'Initial outreach + counseling referral',   advisorAr: 'سعد ح.',  advisorEn: 'Saad H.',  status: 'reviewed',  weeks: [90, 88, 80, 72, 60, 50] },
  { id: 'SUP-206', studentMaskedId: '٢٠٢٣****٢٢١', collegeAr: 'إدارة الأعمال',              collegeEn: 'Business',              signalKey: 'late',       trendDir: 'flat', suggestedActionAr: 'دعم تنظيم الوقت — ورشة',               suggestedActionEn: 'Time management workshop',                 advisorAr: 'منى ع.',  advisorEn: 'Mona A.',  status: 'scheduled', weeks: [70, 70, 68, 65, 65, 64] },
  { id: 'SUP-207', studentMaskedId: '٢٠٢٢****٠٩١', collegeAr: 'العلوم',                     collegeEn: 'Sciences',              signalKey: 'sudden',     trendDir: 'down', suggestedActionAr: 'مقابلة مرشد + احتمال إحالة لخدمات الطلاب', suggestedActionEn: 'Advisor meeting + possible referral',    advisorAr: 'ليلى م.', advisorEn: 'Layla M.', status: 'open',      weeks: [85, 84, 82, 70, 55, 40] },
  { id: 'SUP-208', studentMaskedId: '٢٠٢٠****٤٠٠', collegeAr: 'الصيدلة',                    collegeEn: 'Pharmacy',              signalKey: 'engagement', trendDir: 'flat', suggestedActionAr: 'رسالة دعم لطيفة + متابعة بعد أسبوعين',   suggestedActionEn: 'Gentle support note + 2-week follow-up',   advisorAr: 'سعد ح.',  advisorEn: 'Saad H.',  status: 'open',      weeks: [75, 74, 72, 70, 68, 66] },
  { id: 'SUP-209', studentMaskedId: '٢٠٢١****٩١٥', collegeAr: 'الطب',                       collegeEn: 'Medicine',              signalKey: 'late',       trendDir: 'down', suggestedActionAr: 'موعد فردي مع المرشدة الأكاديمية',        suggestedActionEn: '1:1 advisor meeting',                       advisorAr: 'ليلى م.', advisorEn: 'Layla M.', status: 'open',      weeks: [80, 78, 74, 66, 60, 52] },
];

// ----------------- Top Students -----------------
export interface TopStudent {
  id: string;
  maskedId: string;
  collegeAr: string;
  collegeEn: string;
  excellence: number;
  activityHours: number;
  volunteeringHours: number;
  rewardEligible: boolean;
  status: 'pending_review' | 'approved' | 'message_drafted' | 'sent';
}

export const topStudentsKpis = {
  identified: 500,
  candidates: 86,
  pendingApprovals: 24,
  messagesDrafted: 120,
  campaignsSent: 3,
};

const collegesAr = ['الهندسة', 'الحاسبات وتقنية المعلومات', 'العلوم', 'الآداب والعلوم الإنسانية', 'إدارة الأعمال', 'الطب', 'الصيدلة', 'الشريعة والأنظمة'];
const collegesEn = ['Engineering', 'Computer & IS', 'Sciences', 'Arts & Humanities', 'Business', 'Medicine', 'Pharmacy', 'Sharia & Law'];

export const topStudents: TopStudent[] = Array.from({ length: 12 }).map((_, i) => {
  const statuses: TopStudent['status'][] = ['pending_review', 'approved', 'message_drafted', 'sent'];
  const idx = i % collegesAr.length;
  return {
    id: `TS-${1100 + i}`,
    maskedId: `٢٠٢${(i % 4)}****${100 + i * 7}`.slice(0, 12),
    collegeAr: collegesAr[idx],
    collegeEn: collegesEn[idx],
    excellence: 92 + ((i * 3) % 8),
    activityHours: 40 + ((i * 11) % 60),
    volunteeringHours: 12 + ((i * 5) % 30),
    rewardEligible: i % 3 !== 1,
    status: statuses[i % statuses.length],
  };
});

export const topByCollege = collegesAr.map((ar, i) => ({
  collegeAr: ar,
  collegeEn: collegesEn[i],
  count: [78, 71, 64, 60, 52, 49, 41, 35][i],
}));

// ----------------- Alerts -----------------
export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  relatedRequest?: string;
  ownerAr: string;
  ownerEn: string;
  openedMinAgo: number;
  suggestedActionAr: string;
  suggestedActionEn: string;
}

export const alerts: Alert[] = [
  { id: 'ALT-77', severity: 'critical', titleAr: 'تجاوز SLA — تظلّم أكاديمي', titleEn: 'SLA breached — academic appeal', detailAr: 'الطلب REQ-1031 تجاوز المدة المحددة بـ ٤٥ دقيقة.', detailEn: 'Request REQ-1031 exceeded SLA by 45 minutes.', relatedRequest: 'REQ-1031', ownerAr: 'مكتب العمادة',    ownerEn: 'Dean office',     openedMinAgo: 45,           suggestedActionAr: 'إعادة الإسناد + إخطار المشرف', suggestedActionEn: 'Reassign + notify supervisor' },
  { id: 'ALT-78', severity: 'warning',  titleAr: 'تأخر شهادة تخرّج',          titleEn: 'Graduation cert. delayed',         detailAr: 'REQ-1025 ينتظر اعتماد الموظف منذ ٤٠ دقيقة.',     detailEn: 'REQ-1025 awaiting staff approval for 40 minutes.', relatedRequest: 'REQ-1025', ownerAr: 'منيرة العتيبي',    ownerEn: 'Munira Al-Otaibi', openedMinAgo: 40,           suggestedActionAr: 'مراجعة الطلب الآن',           suggestedActionEn: 'Review the request now' },
  { id: 'ALT-79', severity: 'warning',  titleAr: 'شكوى تنتظر المراجعة',       titleEn: 'Complaint awaiting review',         detailAr: 'شكوى صوتية REQ-1026 تنتظر المراجعة.',           detailEn: 'Voice complaint REQ-1026 is awaiting review.',     relatedRequest: 'REQ-1026', ownerAr: 'خالد السيف',       ownerEn: 'Khalid Al-Saif',  openedMinAgo: 22,           suggestedActionAr: 'فتح الشكوى',                   suggestedActionEn: 'Open the complaint' },
  { id: 'ALT-80', severity: 'warning',  titleAr: 'متابعة دعم متأخرة',         titleEn: 'Support follow-up overdue',         detailAr: 'حالة دعم SUP-204 تنتظر اتصال المرشد منذ يومين.', detailEn: 'Support case SUP-204 has been waiting for advisor contact for 2 days.',           ownerAr: 'ليلى م.',         ownerEn: 'Layla M.',        openedMinAgo: 60 * 24 * 2,  suggestedActionAr: 'جدولة اتصال خلال اليوم',       suggestedActionEn: 'Schedule outreach today' },
  { id: 'ALT-81', severity: 'info',     titleAr: 'عدم توازن في عبء الموظفين', titleEn: 'Workload imbalance detected',        detailAr: 'موظف يعمل على ١٤ طلبًا بينما متوسط الفريق ٦.', detailEn: 'One staff member is on 14 active requests while the team average is 6.',                     ownerAr: 'المشرف العام',     ownerEn: 'Supervisor',      openedMinAgo: 18,           suggestedActionAr: 'إعادة توزيع ٣ طلبات',          suggestedActionEn: 'Redistribute 3 requests' },
];

// ----------------- Staff Workload -----------------
export interface StaffRow {
  id: string;
  nameAr: string;
  nameEn: string;
  role: 'reviewer' | 'advisor' | 'documents' | 'complaints';
  active: number;
  completedToday: number;
  avgHandlingMin: number;
  overdue: number;
  available: boolean;
  capacity: number;
}

export const staff: StaffRow[] = [
  { id: 'S-01', nameAr: 'منيرة العتيبي', nameEn: 'Munira Al-Otaibi', role: 'reviewer',   active: 14, completedToday: 22, avgHandlingMin: 14, overdue: 2, available: true,  capacity: 92 },
  { id: 'S-02', nameAr: 'خالد السيف',    nameEn: 'Khalid Al-Saif',   role: 'complaints', active: 6,  completedToday: 11, avgHandlingMin: 21, overdue: 1, available: true,  capacity: 64 },
  { id: 'S-03', nameAr: 'سعد الحربي',    nameEn: 'Saad Al-Harbi',    role: 'documents',  active: 7,  completedToday: 19, avgHandlingMin: 9,  overdue: 0, available: true,  capacity: 58 },
  { id: 'S-04', nameAr: 'ليلى م.',       nameEn: 'Layla M.',         role: 'advisor',    active: 9,  completedToday: 8,  avgHandlingMin: 28, overdue: 1, available: false, capacity: 78 },
  { id: 'S-05', nameAr: 'منى ع.',        nameEn: 'Mona A.',          role: 'advisor',    active: 5,  completedToday: 6,  avgHandlingMin: 30, overdue: 0, available: true,  capacity: 42 },
  { id: 'S-06', nameAr: 'فهد ال.',       nameEn: 'Fahad L.',         role: 'reviewer',   active: 3,  completedToday: 14, avgHandlingMin: 12, overdue: 0, available: true,  capacity: 28 },
];

// ----------------- Service analytics extras -----------------
export const docVolume = [
  { dAr: 'الأحد',    dEn: 'Sun', certs: 412, qr: 980 },
  { dAr: 'الإثنين',  dEn: 'Mon', certs: 540, qr: 1240 },
  { dAr: 'الثلاثاء', dEn: 'Tue', certs: 480, qr: 1100 },
  { dAr: 'الأربعاء', dEn: 'Wed', certs: 612, qr: 1410 },
  { dAr: 'الخميس',   dEn: 'Thu', certs: 522, qr: 1330 },
];

export const automationOverWeeks = [
  { wAr: 'أ١', wEn: 'W1', rate: 38 },
  { wAr: 'أ٢', wEn: 'W2', rate: 44 },
  { wAr: 'أ٣', wEn: 'W3', rate: 49 },
  { wAr: 'أ٤', wEn: 'W4', rate: 53 },
  { wAr: 'أ٥', wEn: 'W5', rate: 58 },
  { wAr: 'أ٦', wEn: 'W6', rate: 61 },
  { wAr: 'أ٧', wEn: 'W7', rate: 64 },
];
