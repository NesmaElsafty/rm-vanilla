/**
 * Rich Recorded Sessions detail schema (new audio-first template).
 * Legacy data/recorded-sessions.js + seeders remain for recorded-session-detail.html.
 *
 * Locale notes:
 * - Arabic (ar) is owner source-of-truth for migrated sessions.
 * - English (en) is reserved for future owner-approved rich copy.
 * - Missing locale falls back to Arabic.
 */

const RECORDED_SESSIONS_DETAILS_AR = [
  {
    slug: 'forgiveness',
    session_name: 'التسامح',
    transformation_title: 'من ثِقل الألم… إلى خفة التحرر',
    description: [
      'هل تشعر أن هناك شخصًا ما زال يعيش داخلك…',
      'رغم أنه خرج من حياتك منذ سنوات؟',
      'ربما لم يعد الألم في الموقف نفسه، بل في الأثر الذي تركه داخلك.',
      'هذه الجلسة الصوتية تساعدك على التحرر من المشاعر العالقة، حتى لا يبقى الماضي يقود حاضرك، وتبدأ في استعادة سلامك الداخلي خطوة بخطوة.',
    ],
    primary_cta: 'استثمر في الجلسة',
    about: {
      heading: 'عن الجلسة',
      intro:
        'جلسة صوتية تأملية تساعدك على فهم معنى التسامح الحقيقي، والتعامل مع المشاعر العالقة بطريقة أكثر وعيًا ورحمة، حتى تبدأ في تحرير قلبك من ثقل الماضي.',
      supporting: 'خلال الجلسة ستساعدك على:',
      bullets: [
        'التحرر من الغضب والمرارة واللوم.',
        'التخفف من الحمل العاطفي الذي تحمله منذ سنوات.',
        'استعادة شعور أكبر بالراحة والخفة.',
        'فتح مساحة داخل قلبك للسلام والقبول.',
      ],
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الجلسة لا تطلب منك أن تنسى ما حدث…',
        'ولا أن تبرر ما تعرضت له.',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: ['من حمل الألم… إلى تحريره', 'من الثقل الداخلي… إلى خفة القلب.'],
      closing: [
        'بعد انتهاء الجلسة، قد لا يتغير الماضي…',
        'لكن علاقتك به ستبدأ في التغير، وسيصبح قلبك أكثر قدرة على المضي قدمًا دون أن يحمل كل هذا الثقل.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن الماضي ما زال يؤثر على حياتك.',
        'تحمل مشاعر غضب أو خذلان لم تستطع تجاوزها.',
        'ترغب في تحرير قلبك من الألم العالق.',
        'تريد أن تعيش بخفة أكبر وسلام أعمق.',
        'تبحث عن جلسة تساعدك على البدء في رحلة التسامح مع نفسك ومع الآخرين.',
      ],
    },
    final_cta: {
      heading: 'امنح قلبك فرصة للتحرر',
      text: [
        'التسامح لا يغيّر الماضي…',
        'لكنه يغيّر الطريقة التي تعيش بها حاضرك.',
        'استمع إلى الجلسة، وابدأ رحلة التحرر من ثقل الألم، لتفتح مساحة أكبر للسلام داخل قلبك.',
      ],
      button: 'استثمر في جلسة التسامح الآن',
    },
    purchase: {
      target: 'forgiveness',
    },
    display: {
      eyebrow: 'جلسة صوتية',
      format_label: 'جلسة صوتية',
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_title_emphasis: ['ثِقل الألم…', 'خفة التحرر'],
      transformation_flow: [
        { from: 'حمل الألم…', to: 'تحريره' },
        { from: 'الثقل الداخلي…', to: 'خفة القلب.' },
      ],
    },
  },
  {
    slug: 'surrender-facing-challenges',
    session_name: 'التسليم عند مواجهة التحديات',
    transformation_title: 'من مقاومة الحياة… إلى الثقة في تدبير الله',
    description: [
      'هل تشعر أن قلبك مثقل بما يحدث حولك؟',
      'كلما واجهت تحديًا، دخلت في دائرة من القلق، والخوف، ومحاولة السيطرة على كل شيء، حتى فقدت هدوءك.',
      'هذه الجلسة التأملية تساعدك على الانتقال من مقاومة ما لا تستطيع تغييره، إلى التسليم الواعي لله، حتى تجد راحةً في قلبك، وثقةً في تدبيره، مهما كانت الظروف.',
    ],
    primary_cta: 'ابدأ الجلسة',
    about: {
      heading: 'عن الجلسة',
      intro:
        'جلسة صوتية تأملية تأخذك في رحلة هادئة نحو معنى التسليم الحقيقي، بعيدًا عن الاستسلام أو الضعف، لتتعلم كيف تبذل ما عليك، ثم تترك النتائج لله بقلب مطمئن.',
      bullets: [],
    },
    transformation: null,
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن القلق يسيطر عليك عند مواجهة أي تحدٍ.',
        'تجد صعوبة في تقبل ما لا تستطيع تغييره.',
        'تحمل هموم الحياة وحدك وتشعر بالإرهاق.',
        'تفكر كثيرًا في المستقبل وتخشى المجهول.',
        'ترغب في أن تعيش معنى التوكل والتسليم بشكل عملي، لا كمعلومة فقط.',
        'تبحث عن راحة حقيقية تنبع من الثقة بالله.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة التسليم',
      text: [
        'وتحول من التوتر والضغط الي السكينة والاطمئنان, وتسليم لله المدبر.',
        'استمع إلى الجلسة، واسمح لقلبك أن يهدأ، ويتعلم كيف يسير في الحياة مطمئنًا، وهو يعلم أن الله يدبر الأمر كله.',
      ],
      button: 'استثمر في الجلسة الآن',
    },
    purchase: {
      target: 'surrender-facing-challenges',
    },
    display: {
      eyebrow: 'جلسة صوتية',
      format_label: 'جلسة صوتية',
      transformation_title_emphasis: ['مقاومة الحياة…', 'الثقة في تدبير الله'],
    },
  },
  {
    slug: 'reconcile-with-yourself',
    session_name: 'تصالح مع ذاتك',
    transformation_title: 'من جلد الذات… إلى علاقة مليئة بالرحمة والقبول',
    description: [
      'هل تشعر أنك أصبحت أقسى على نفسك من أي شخص آخر؟',
      'تلوم نفسك على أخطائك، وتقارنها بالآخرين، وتحملها فوق طاقتها، حتى نسيت أن تنظر إليها بعين الرحمة.',
      'هذه الجلسة التأملية تساعدك على التوقف عن محاربة نفسك، وإعادة بناء علاقتك بها، لتراها كما أرادها الله… بقبول، ورحمة، واتزان.',
    ],
    primary_cta: 'ابدأ الجلسة',
    about: {
      heading: 'عن الجلسة',
      intro:
        'جلسة صوتية تأملية تمنحك مساحة هادئة لتلتقي بنفسك من جديد، بعيدًا عن الأحكام القاسية، واللوم المستمر، والمقارنات التي تستنزفك، حتى تبدأ في بناء علاقة أكثر حبًا ورحمة مع ذاتك.',
      bullets: [],
    },
    transformation: null,
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تلوم نفسك كثيرًا على أخطائك.',
        'تشعر أنك لا ترى إلا عيوبك.',
        'تجد صعوبة في تقبل نفسك كما أنت.',
        'ترغب في بناء علاقة أكثر هدوءًا وحبًا مع نفسك.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة التصالح',
      text: [
        'وتحول الي التعاطف مع ذاتك، والرحمه بها.',
        'لن تتغير حياتك عندما تصبح شخصًا آخر…',
        'بل عندما تتوقف عن رفض الشخص الذي أنت عليه اليوم، وتبدأ في احتضانه، والعمل على تطويره بمحبة ورحمة.',
        'استمع إلى الجلسة، وامنح نفسك فرصة لتبدأ علاقة جديدة مع ذاتك… علاقة تقوم على القبول، والرحمة، والسلام.',
      ],
      button: 'استثمر في الجلسة الآن',
    },
    purchase: {
      target: 'reconcile-with-yourself',
    },
    display: {
      eyebrow: 'جلسة صوتية',
      format_label: 'جلسة صوتية',
      transformation_title_emphasis: ['جلد الذات…', 'علاقة مليئة بالرحمة والقبول'],
    },
  },
];

const RECORDED_SESSIONS_DETAILS_EN = [];

const bySlug = {
  ar: Object.fromEntries(RECORDED_SESSIONS_DETAILS_AR.map((item) => [item.slug, item])),
  en: Object.fromEntries(RECORDED_SESSIONS_DETAILS_EN.map((item) => [item.slug, item])),
};

/** Slugs that use the new recorded-sessions-details template. */
export const RECORDED_SESSION_NEW_TEMPLATE_SLUGS = new Set(
  RECORDED_SESSIONS_DETAILS_AR.map((item) => item.slug),
);

export function usesRecordedSessionNewTemplate(slug) {
  return RECORDED_SESSION_NEW_TEMPLATE_SLUGS.has(slug);
}

export function getRecordedSessionDetailPage(slug) {
  return usesRecordedSessionNewTemplate(slug)
    ? 'recorded-sessions-details.html'
    : 'recorded-session-detail.html';
}

export function getRecordedSessionDetailBySlug(slug, locale = 'ar') {
  if (!slug) return undefined;
  const resolved = locale === 'en' ? 'en' : 'ar';
  return bySlug[resolved][slug] ?? bySlug.ar[slug];
}

export function getRecordedSessionDetails(locale = 'ar') {
  const resolved = locale === 'en' ? 'en' : 'ar';
  return RECORDED_SESSIONS_DETAILS_AR.map((arRecord) => {
    const enRecord = bySlug.en[arRecord.slug];
    if (resolved === 'en' && enRecord) return enRecord;
    return arRecord;
  });
}
