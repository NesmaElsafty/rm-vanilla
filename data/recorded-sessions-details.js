/**
 * Rich Recorded Sessions detail schema (new audio-first template).
 * Legacy data/recorded-sessions.js + seeders remain for recorded-session-detail.html.
 *
 * Locale notes:
 * - Arabic (ar) remains owner source-of-truth for migrated sessions.
 * - English (en) uses owner-approved rich translations when present.
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
  {
    slug: 'future-self-meeting',
    session_name: 'لقاء مع نسختك المستقبلية',
    transformation_title: 'من ضباب الحاضر… إلى وضوح الرؤية والاتجاه',
    description: [
      'هذه الجلسة التأملية تأخذك في رحلة عميقة، لتلتقي بالنسخة التي تتمنى أن تصبحها، وتعود منها برؤية أوضح، وأمل أكبر، وخطوة تبدأ بها من اليوم.',
    ],
    primary_cta: 'ابدأ الجلسة',
    about: {
      heading: 'عن الجلسة',
      intro:
        'جلسة صوتية تأملية تساعدك على الاتصال برؤيتك المستقبلية، واستحضار النسخة الأكثر وعيًا، وثقة، واتزانًا من نفسك، حتى ترى طريقك بوضوح، وتبدأ في التحرك نحوه بخطوات عملية.',
      supporting: 'خلال هذه الجلسة ستساعدك على:',
      bullets: [
        'رؤية الصورة التي تريد أن تصبح عليها بوضوح.',
        'اكتشاف الصفات والقيم التي تريد أن تبني عليها حياتك.',
        'التخلص من التشوش الذي يمنعك من رؤية مستقبلك.',
        'تقوية إحساسك بالأمل والاتجاه.',
        'بناء دافع داخلي نابع من رسالتك، لا من المقارنة بالآخرين.',
        'العودة إلى حاضرك بخطوة واضحة تقربك من النسخة التي تطمح إليها.',
      ],
    },
    transformation: null,
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أنك فقدت اتجاهك أو شغفك.',
        'تمر بمرحلة انتقالية ولا تعرف من أين تبدأ.',
        'تريد أن ترى مستقبلك بصورة أكثر وضوحًا.',
        'تشعر أن لديك إمكانيات لم تستثمرها بعد.',
        'ترغب في بناء حياة أكثر اتزانًا، ووعيًا، واتصالًا بالله.',
        'تبحث عن رؤية تمنحك الأمل وتساعدك على التحرك بثقة.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة اللقاء',
      text: [
        'كل تغيير كبير يبدأ بصورة واضحة…',
        'وعندما ترى بوضوح من تريد أن تصبح، تصبح الخطوة التالية أسهل.',
        'استمع إلى الجلسة، والتقِ بالنسخة التي تتمنى أن تكونها، ثم عد إلى حاضرك وأنت تحمل وضوحًا، وأملًا، واتجاهًا جديدًا.',
      ],
      button: 'استثمر في الجلسة الآن',
    },
    purchase: {
      target: 'future-self-meeting',
    },
    display: {
      eyebrow: 'جلسة صوتية',
      format_label: 'جلسة صوتية',
      transformation_title_emphasis: ['ضباب الحاضر…', 'وضوح الرؤية والاتجاه'],
    },
  },
];

const RECORDED_SESSIONS_DETAILS_EN = [
  {
    slug: 'forgiveness',
    session_name: 'Forgiveness',
    transformation_title: 'From the weight of pain… to the lightness of release',
    description: [
      'Do you feel that someone is still living inside you…',
      'Even though they left your life years ago?',
      'Perhaps the pain is no longer in the situation itself, but in the mark it left within you.',
      'This audio session helps you release the emotions that are still trapped inside, so the past no longer leads your present and you can begin restoring your inner peace, step by step.',
    ],
    primary_cta: 'Invest in the Session',
    about: {
      heading: 'About the Session',
      intro:
        'A reflective audio session that helps you understand the true meaning of forgiveness and work with unresolved emotions with greater awareness and compassion, so you can begin freeing your heart from the weight of the past.',
      supporting: 'During the session, it will help you:',
      bullets: [
        'Release anger, bitterness, and blame.',
        'Lighten the emotional burden you have carried for years.',
        'Restore a greater sense of ease and lightness.',
        'Create more space in your heart for peace and acceptance.',
      ],
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This session does not ask you to forget what happened…',
        'Nor does it ask you to justify what you went through.',
        'But it helps you move:',
      ],
      bullets: [
        'From carrying the pain… to releasing it',
        'From inner heaviness… to a lighter heart.',
      ],
      closing: [
        'After the session, the past may not change…',
        'But your relationship with it can begin to change, and your heart can become more able to move forward without carrying all of that weight.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You feel that the past is still affecting your life.',
        'You carry anger or hurt that you have not been able to move beyond.',
        'You want to free your heart from unresolved pain.',
        'You want to live with greater lightness and deeper peace.',
        'You are looking for a session that can help you begin a journey of forgiveness toward yourself and others.',
      ],
    },
    final_cta: {
      heading: 'Give Your Heart a Chance to Be Free',
      text: [
        'Forgiveness does not change the past…',
        'But it changes the way you live your present.',
        'Listen to the session and begin releasing the weight of pain, creating more space for peace within your heart.',
      ],
      button: 'Invest in the Forgiveness Session Now',
    },
    purchase: {
      target: 'forgiveness',
    },
    display: {
      eyebrow: 'Audio Session',
      format_label: 'Audio Session',
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_title_emphasis: ['weight of pain…', 'lightness of release'],
      transformation_flow: [
        { from: 'carrying the pain…', to: 'releasing it' },
        { from: 'inner heaviness…', to: 'a lighter heart.' },
      ],
    },
  },
  {
    slug: 'surrender-facing-challenges',
    session_name: 'Surrender When Facing Challenges',
    transformation_title: "From resisting life… to trusting God's plan",
    description: [
      'Do you feel that your heart is weighed down by what is happening around you?',
      'Whenever you face a challenge, you enter a cycle of anxiety, fear, and trying to control everything, until you lose your calm.',
      'This reflective session helps you move from resisting what you cannot change to consciously surrendering to God, so you can find rest in your heart and trust in His plan, whatever the circumstances.',
    ],
    primary_cta: 'Start the Session',
    about: {
      heading: 'About the Session',
      intro:
        'A reflective audio session that takes you on a calm journey toward the true meaning of surrender—not as giving up or weakness, but as learning to do what is yours to do and then leave the outcome to God with a peaceful heart.',
      bullets: [],
    },
    transformation: null,
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'Anxiety takes over whenever you face a challenge.',
        'You find it difficult to accept what you cannot change.',
        "You carry life's worries alone and feel exhausted.",
        'You think constantly about the future and fear the unknown.',
        'You want to live the meaning of trust and surrender in a practical way, not only understand it as an idea.',
        'You are looking for genuine rest that comes from trusting God.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey of Surrender',
      text: [
        'Move from tension and pressure toward serenity, reassurance, and surrender to God, the One who is in control.',
        'Listen to the session and allow your heart to become still, learning how to move through life with peace, knowing that God is taking care of it all.',
      ],
      button: 'Invest in the Session Now',
    },
    purchase: {
      target: 'surrender-facing-challenges',
    },
    display: {
      eyebrow: 'Audio Session',
      format_label: 'Audio Session',
      transformation_title_emphasis: ['resisting life…', "trusting God's plan"],
    },
  },
  {
    slug: 'reconcile-with-yourself',
    session_name: 'Reconcile with Yourself',
    transformation_title:
      'From self-criticism… to a relationship filled with compassion and acceptance',
    description: [
      'Do you feel that you have become harder on yourself than anyone else?',
      'You blame yourself for your mistakes, compare yourself with others, and demand more from yourself than you can carry, until you forget to look at yourself with compassion.',
      'This reflective session helps you stop fighting yourself and begin rebuilding your relationship with who you are, so you can see yourself as God intended… with acceptance, compassion, and balance.',
    ],
    primary_cta: 'Start the Session',
    about: {
      heading: 'About the Session',
      intro:
        'A reflective audio session that gives you a calm space to meet yourself again, away from harsh judgment, constant blame, and comparisons that drain you, so you can begin building a more loving and compassionate relationship with yourself.',
      bullets: [],
    },
    transformation: null,
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You blame yourself often for your mistakes.',
        'You feel that all you can see are your flaws.',
        'You find it difficult to accept yourself as you are.',
        'You want to build a calmer and more loving relationship with yourself.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey of Reconciliation',
      text: [
        'Move toward greater self-compassion and treating yourself with mercy.',
        'Your life will not change when you become someone else…',
        'It begins to change when you stop rejecting who you are today, start embracing yourself, and work on your growth with love and compassion.',
        'Listen to the session and give yourself the chance to begin a new relationship with yourself… one built on acceptance, compassion, and peace.',
      ],
      button: 'Invest in the Session Now',
    },
    purchase: {
      target: 'reconcile-with-yourself',
    },
    display: {
      eyebrow: 'Audio Session',
      format_label: 'Audio Session',
      transformation_title_emphasis: [
        'self-criticism…',
        'a relationship filled with compassion and acceptance',
      ],
    },
  },
  {
    slug: 'future-self-meeting',
    session_name: 'Meeting Your Future Self',
    transformation_title: 'From the fog of the present… to clarity of vision and direction',
    description: [
      'This reflective session takes you on a deep inner journey to meet the version of yourself you hope to become, then return with a clearer vision, greater hope, and one step you can begin taking today.',
    ],
    primary_cta: 'Start the Session',
    about: {
      heading: 'About the Session',
      intro:
        'A reflective audio session that helps you connect with your vision for the future and bring to mind a more aware, confident, and balanced version of yourself, so you can see your path more clearly and begin moving toward it through practical steps.',
      supporting: 'During this session, it will help you:',
      bullets: [
        'Clearly see the person you want to become.',
        'Discover the qualities and values you want to build your life around.',
        'Release the confusion that keeps you from seeing your future clearly.',
        'Strengthen your sense of hope and direction.',
        'Build inner motivation that comes from your purpose rather than comparing yourself with others.',
        'Return to the present with one clear step that brings you closer to the version of yourself you aspire to become.',
      ],
    },
    transformation: null,
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You feel that you have lost your direction or passion.',
        'You are going through a transitional stage and do not know where to begin.',
        'You want to see your future more clearly.',
        'You feel that you have potential you have not yet fully used.',
        'You want to build a life with greater balance, awareness, and connection with God.',
        'You are looking for a vision that gives you hope and helps you move forward with confidence.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey of Meeting Your Future Self',
      text: [
        'Every meaningful change begins with a clear picture…',
        'And when you can clearly see who you want to become, the next step becomes easier.',
        'Listen to the session, meet the version of yourself you hope to become, then return to your present carrying greater clarity, hope, and a renewed sense of direction.',
      ],
      button: 'Invest in the Session Now',
    },
    purchase: {
      target: 'future-self-meeting',
    },
    display: {
      eyebrow: 'Audio Session',
      format_label: 'Audio Session',
      transformation_title_emphasis: [
        'fog of the present…',
        'clarity of vision and direction',
      ],
    },
  },
];

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
