// روابط خارجية لمصادر أسئلة وزارية سابقة — جُمعت من بحث ويب (راجع المحادثة).
// **مو محتوى SmartFlow** — روابط لمواقع خارجية غير رسمية، وضع الحقوق غير مؤكَّد
// (راجع السؤال المفتوح Q-7 بـ SmartFlow-SRS-v1.md). الطالب يتصفحها ويقرر بنفسه.
export interface MinistryLink {
  title: string
  source: string
  url: string
}

export interface MinistryLinkGroup {
  gradeKey: string // مفتاح i18n لاسم المرحلة
  links: MinistryLink[]
}

export const MINISTRY_LINK_GROUPS: MinistryLinkGroup[] = [
  {
    gradeKey: 'ministryBank.grade6Secondary',
    links: [
      {
        title: 'أسئلة اللغة العربية الوزارية 2014 (علمي وأدبي)',
        source: 'التعليم لأجل العراق',
        url: 'https://education4iq.blogspot.com/2014/06/2014_1449.html',
      },
      {
        title: 'أرشيف الأسئلة الوزارية 2013–2023 (كل المواد)',
        source: 'ملازمنا',
        url: 'https://mlazemna.com/allqus/',
      },
      {
        title: 'نسخ الأسئلة الوزارية مع الحلول',
        source: 'iraqedu.net',
        url: 'https://iraqedu.net/%D9%86%D8%B3%D8%AE-%D8%A7%D9%84%D8%A7%D8%B3%D8%A6%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B2%D8%A7%D8%B1%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%84/',
      },
    ],
  },
  {
    gradeKey: 'ministryBank.grade3Intermediate',
    links: [
      {
        title: 'المجموعة الكاملة للأسئلة الوزارية — فيزياء ورياضيات',
        source: 'مدونة أبو عبدالله',
        url: 'http://tahaab111.blogspot.com/p/blog-page_29.html',
      },
      {
        title: 'نماذج الأسئلة الوزارية 2014–2015–2016',
        source: 'منتديات درر العراق',
        url: 'https://www.dorar-aliraq.net/threads/621705',
      },
    ],
  },
  {
    gradeKey: 'ministryBank.grade6Primary',
    links: [
      {
        title: 'ملزمة الأسئلة الوزارية لكل المواد (2006–2018)',
        source: 'طلاب العراق',
        url: 'https://www.haltaelam.com/2020/12/exam6.html',
      },
    ],
  },
]
