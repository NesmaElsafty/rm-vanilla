/**
 * Richer Private Sessions detail schema (new template).
 * Existing data/sessions.js + seeders remain the source for session-detail.html.
 *
 * Locale notes:
 * - Arabic (ar) is owner source-of-truth for migrated sessions.
 * - English (en) mirrors the richer AR structure for the locale switcher.
 * - Missing locale falls back to Arabic.
 */

const PRIVATE_SESSIONS_DETAILS_AR = [
  {
    slug: 'clarity-inner-doubt-release',
    session_name: 'فك التشوش والشك الداخلي',
    transformation_title: 'من التشوش الداخلي إلى وضوح يطمئن قلبك',
    description: [
      'هل تشعر أن عقلك لا يتوقف عن التفكير؟',
      'كل قرار يحتاج مجهودًا، وكل خطوة يصاحبها تردد، وكل يوم يزداد التشوش أكثر.',
      'في هذه الجلسة نساعدك على فهم السبب الحقيقي وراء هذا الصراع الداخلي، حتى تنتقل من الحيرة والشك إلى وضوح أكبر، وطمأنينة تساعدك أن ترى الطريق بثقة واتزان.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الرحلة',
      intro:
        'تتكون هذه الرحلة من 4 جلسات فردية خاصه، نعمل فيها معًا على تفكيك جذور التشوش والشك، حتى تستعيد وضوحك الداخلي وثقتك بنفسك.',
      supporting: 'خلال الجلسات نعمل معًا على:',
      bullets: [
        'فهم الجذر الحقيقي للتشوش وليس أعراضه فقط.',
        'اكتشاف المعتقدات التي تربك قراراتك وتستهلك طاقتك.',
        'التمييز بين صوت الخوف وصوت الحقيقة.',
        'تهدئة الصراع الداخلي واستعادة الاتزان.',
        'بناء وضوح داخلي يساعدك على اتخاذ قرارات أكثر سلامًا وثقة.',
        'ربط الجانب النفسي بالجانب الروحي، حتى يصبح الوضوح نابعًا من اتصال أعمق بالله، وليس من محاولة السيطرة على كل شيء.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تفكر كثيرًا قبل أي قرار، ثم تعود للتردد من جديد.',
        'تغير رأيك باستمرار لأنك لا تثق بإحساسك.',
        'تعيش صراعًا داخليًا بين ما تريده وما تخشاه.',
        'تشعر أن عقلك لا يتوقف عن التفكير، حتى في أبسط الأمور.',
        'تبحث عن إجابة من كل شخص، لأنك فقدت الثقة بصوتك الداخلي.',
        'تشعر أن هناك ضبابًا يغطي حياتك، ولا تعرف من أين تبدأ.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الجلسات صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الجلسات صممت خصيصاً لك ولا تعدك بأن تختفي كل الأسئلة…',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: [
        'من التشوش إلى الوضوح.',
        'من التردد إلى اتخاذ القرار بهدوء.',
        'من الضوضاء الداخلية إلى السكينة',
      ],
      closing: [
        'بعد الجلسة ستشعر أن الصورة أصبحت أوضح…',
        'وتستطيع ان تتخذ قرار بسهوله.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن عقلك لا يتوقف عن التفكير.',
        'تعيش حيرة في قرار مصيري أو مرحلة انتقالية.',
        'فقدت الثقة بنفسك أو بإحساسك.',
        'تشعر أن الخوف هو من يقود اختياراتك.',
        'تبحث عن وضوح داخلي، لا مجرد نصيحة سريعة.',
        'ترغب في فهم نفسك بعمق، وإعادة بناء علاقتك بالله من مساحة أكثر سلامًا واتزانًا.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة الخروج من التشوش… والعودة إلى الوضوح',
      text: 'احجز جلسات تساعدك على ترتيب داخلك والوصول إلى نقطة أكثر هدوءًا وصدقًا.',
      button: 'احجز جلسات فكّ التشوش الآن',
    },
    booking: {
      target: 'clarity-inner-doubt-release',
    },
    /** Visual-only hints — never rewrite owner strings; spans/layout only. */
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['التشوش الداخلي', 'وضوح يطمئن قلبك'],
      journey_intro_emphasis: ['4 جلسات فردية خاصه'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [
        { from: 'التشوش', to: 'الوضوح.' },
        { from: 'التردد', to: 'اتخاذ القرار بهدوء.' },
        { from: 'الضوضاء الداخلية', to: 'السكينة' },
      ],
    },
  },
];

/** English richer records — structural translation of owner AR copy for locale switcher. */
const PRIVATE_SESSIONS_DETAILS_EN = [
  {
    slug: 'clarity-inner-doubt-release',
    session_name: 'Releasing Inner Confusion & Doubt',
    transformation_title: 'From inner confusion to clarity that eases your heart',
    description: [
      'Do you feel your mind never stops thinking?',
      'Every decision takes effort, every step comes with hesitation, and every day the confusion grows.',
      'In this session we help you understand the real cause behind this inner conflict, so you can move from confusion and doubt to greater clarity, and a calm that helps you see the path with confidence and balance.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Journey Details',
      intro:
        'This journey consists of 4 private one-on-one sessions, where we work together to dismantle the roots of confusion and doubt, so you can restore your inner clarity and self-trust.',
      supporting: 'During the sessions we work together on:',
      bullets: [
        'Understanding the real root of confusion—not only its symptoms.',
        'Discovering the beliefs that confuse your decisions and drain your energy.',
        'Distinguishing the voice of fear from the voice of truth.',
        'Calming the inner conflict and restoring balance.',
        'Building inner clarity that helps you make decisions with more peace and confidence.',
        'Connecting the psychological with the spiritual, so clarity comes from a deeper connection with God—not from trying to control everything.',
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Think a lot before any decision, then return to hesitation again.',
        'Change your mind constantly because you do not trust your feeling.',
        'Live an inner conflict between what you want and what you fear.',
        'Feel your mind never stops thinking, even about the simplest things.',
        'Seek an answer from every person, because you have lost trust in your inner voice.',
        'Feel there is a fog covering your life, and you do not know where to begin.',
      ],
      closing: 'If you found yourself in more than one point…\nThese sessions were designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'These sessions are designed specifically for you and do not promise that every question will disappear…',
        'But they help you move:',
      ],
      bullets: [
        'From confusion to clarity.',
        'From hesitation to deciding calmly.',
        'From inner noise to serenity',
      ],
      closing: [
        'After the session you will feel the picture has become clearer…',
        'And you can make a decision with ease.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You feel your mind never stops thinking.',
        'You are living confusion around a decisive choice or a transitional stage.',
        'You have lost trust in yourself or in your feeling.',
        'You feel fear is what leads your choices.',
        'You are looking for inner clarity—not just a quick piece of advice.',
        'You want to understand yourself deeply, and rebuild your relationship with God from a place of greater peace and balance.',
      ],
    },
    final_cta: {
      heading: 'Begin the journey out of confusion… and back to clarity',
      text: 'Book sessions that help you organize your inner world and reach a calmer, more honest place.',
      button: 'Book Releasing Confusion Sessions Now',
    },
    booking: {
      target: 'clarity-inner-doubt-release',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['inner confusion', 'clarity that eases your heart'],
      journey_intro_emphasis: ['4 private one-on-one sessions'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [
        { from: 'confusion', to: 'clarity.' },
        { from: 'hesitation', to: 'deciding calmly.' },
        { from: 'inner noise', to: 'serenity' },
      ],
    },
  },
];

const bySlug = {
  ar: Object.fromEntries(PRIVATE_SESSIONS_DETAILS_AR.map((item) => [item.slug, item])),
  en: Object.fromEntries(PRIVATE_SESSIONS_DETAILS_EN.map((item) => [item.slug, item])),
};

/** Slugs that use the new private-sessions-details template. */
export const PRIVATE_SESSION_NEW_TEMPLATE_SLUGS = new Set(
  PRIVATE_SESSIONS_DETAILS_AR.map((item) => item.slug),
);

export function usesPrivateSessionNewTemplate(slug) {
  return PRIVATE_SESSION_NEW_TEMPLATE_SLUGS.has(slug);
}

export function getPrivateSessionDetailPage(slug) {
  return usesPrivateSessionNewTemplate(slug)
    ? 'private-sessions-details.html'
    : 'session-detail.html';
}

export function getPrivateSessionDetailBySlug(slug, locale = 'ar') {
  if (!slug) return undefined;
  const resolved = locale === 'en' ? 'en' : 'ar';
  return bySlug[resolved][slug] ?? bySlug.ar[slug];
}

export function getPrivateSessionDetails(locale = 'ar') {
  const resolved = locale === 'en' ? 'en' : 'ar';
  return PRIVATE_SESSIONS_DETAILS_AR.map((arRecord) => {
    const enRecord = bySlug.en[arRecord.slug];
    if (resolved === 'en' && enRecord) return enRecord;
    return arRecord;
  });
}
