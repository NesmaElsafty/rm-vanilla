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
      session_count: 4,
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
  {
    slug: 'restore-confidence-self-worth',
    session_name: 'استعادة الثقة والقيمة الذاتية',
    transformation_title: 'من الشك في نفسك… إلى الشعور بقيمتك الحقيقية',
    image: 'assets/images/sessions/session-restore-confidence.png',
    description: [
      'هل تشعر أن قيمتك أصبحت مرتبطة برأي الآخرين؟',
      'تشك في نفسك، وتنتظر التقدير من الخارج، وتشعر أن ثقتك تهتز مع كل نقد أو رفض أو مقارنة.',
      'في هذه الرحلة، نعمل معًا على استعادة ثقتك بنفسك من جذورها، حتى تتوقف عن البحث عن قيمتك في الآخرين، وتبدأ في رؤيتها من الداخل، وتعيش بثبات، وهدوء، واتزان.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الرحلة',
      session_count: 4,
      intro:
        'تتكون هذه الرحلة من 4 جلسات فردية متتابعة، نعمل فيها معًا على إعادة بناء ثقتك بنفسك، واستعادة قيمتك الحقيقية بعيدًا عن المقارنات، أو الرفض، أو الاحتياج الدائم لإثبات نفسك.',
      supporting: 'خلال الجلسات نعمل معًا على:',
      bullets: [
        'اكتشاف الجذور الحقيقية لضعف الثقة بالنفس.',
        'فهم كيف تشكلت صورتك عن نفسك عبر التجارب الماضية.',
        'التحرر من المعتقدات التي تجعلك تشعر بأنك “لست كافيًا”.',
        'إعادة بناء احترامك لذاتك من الداخل.',
        'التوقف عن ربط قيمتك برأي الآخرين أو قبولهم.',
        'بناء علاقة أكثر رحمة وثقة بنفسك، تنعكس على قراراتك، وعلاقاتك، وحياتك.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تشك في نفسك حتى بعد نجاحاتك.',
        'تحتاج دائمًا إلى التقدير أو التأكيد من الآخرين.',
        'تخاف من الرفض أو الانتقاد أكثر مما ينبغي.',
        'تقارن نفسك بالآخرين باستمرار.',
        'تشعر أن قيمتك تزيد أو تقل حسب إنجازاتك أو آراء الناس.',
        'تجد صعوبة في وضع حدود أو التعبير عن احتياجاتك.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الرحلة صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الرحلة لا تعدك بأن تختفي كل لحظات الشك…',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: [
        'من الشك في نفسك إلى الثقة بها.',
        'من البحث عن القبول إلى الشعور بقيمتك.',
        'من الخوف من الرفض إلى التعبير عن نفسك بثقة.',
      ],
      closing: [
        'بعد انتهاء الرحلة، ستشعر أن قيمتك لم تعد مرتبطة بما يقوله الآخرون عنك، بل أصبحت تنبع من معرفة أعمق بنفسك، ومن علاقة أكثر اتزانًا مع الله ومع ذاتك.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن ثقتك بنفسك تهتز بسهولة.',
        'تعتمد كثيرًا على رأي الآخرين في تقييم نفسك.',
        'تجد صعوبة في قول “لا” أو وضع حدود صحية.',
        'تعاني من المقارنة المستمرة أو الشعور بالنقص.',
        'ترغب في بناء ثقة حقيقية تنبع من الداخل، لا من الإنجازات أو الإعجاب الخارجي.',
        'تريد أن تعيش بإحساس أعمق بقيمتك، واتزان أكبر في علاقتك بنفسك وبالله.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة استعادة قيمتك',
      text: [
        'قيمتك ليست شيئًا تحتاج إلى إثباته…',
        'بل حقيقة ربما ابتعدت عنها وسط تجارب الحياة.',
        'ابدأ رحلتك الآن، واستعد ثقتك بنفسك، لتعيش بحرية، واتزان، وسلام أعمق.',
      ],
      button: 'احجز رحلة استعادة الثقة والقيمة الذاتية',
    },
    booking: {
      target: 'restore-confidence-self-worth',
    },
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['الشك في نفسك…', 'الشعور بقيمتك الحقيقية'],
      journey_intro_emphasis: ['4 جلسات فردية متتابعة'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [
        { from: 'الشك في نفسك', to: 'الثقة بها.' },
        { from: 'البحث عن القبول', to: 'الشعور بقيمتك.' },
        { from: 'الخوف من الرفض', to: 'التعبير عن نفسك بثقة.' },
      ],
    },
  },
  {
    slug: 'emotional-need-attachment-release',
    session_name: 'التحرر من الاحتياج العاطفي والتعلّق',
    transformation_title: 'من التعلّق بالناس… إلى الامتلاء من الداخل',
    image: 'assets/images/sessions/session-emotional-attachment.png',
    description: [
      'هل تشعر أن سعادتك أصبحت مرتبطة بشخص آخر؟',
      'تخاف من الفقد، وتبحث باستمرار عن الاهتمام، ويؤلمك التجاهل أو الرفض أكثر مما ينبغي، حتى أصبحت علاقاتك تستنزف قلبك بدل أن تمنحه السلام.',
      'في هذه الرحلة، نعمل معًا على فهم الجذر الحقيقي للاحتياج العاطفي، حتى تتحرر من التعلّق، وتبني شعورًا أعمق بالأمان والامتلاء، وتعيش علاقات أكثر صحة واتزانًا.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الرحلة',
      session_count: 6,
      intro:
        'تتكون هذه الرحلة من 6 جلسات فردية متتابعة، نعمل فيها معًا على تفكيك جذور الاحتياج العاطفي والتعلّق، حتى تستعيد حريتك الداخلية، وتبني علاقات تقوم على الحب لا الاحتياج.',
      supporting: 'خلال الجلسات نعمل معًا على:',
      bullets: [
        'فهم الأسباب الحقيقية وراء الاحتياج العاطفي والتعلّق.',
        'اكتشاف الجروح القديمة التي تؤثر على علاقاتك اليوم.',
        'التحرر من الخوف من الفقد أو الرفض.',
        'إعادة بناء الشعور بالأمان من الداخل.',
        'تعلم كيف تحب دون أن تفقد نفسك.',
        'تقوية اتصالك بالله، ليصبح مصدر الأمان والامتلاء الحقيقي في حياتك.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تخاف كثيرًا من أن يبتعد عنك من تحب.',
        'تبحث باستمرار عن الاهتمام أو التقدير من الآخرين.',
        'تتأثر نفسيًا إذا تأخر أحد في الرد أو تغيّر أسلوبه معك.',
        'تجد صعوبة في إنهاء علاقة تؤذيك.',
        'تشعر أن قيمتك ترتبط بوجود شخص معين في حياتك.',
        'تعطي أكثر مما تستطيع خوفًا من خسارة الآخرين.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الرحلة صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الرحلة لا تعدك بأن تتوقف عن حب الناس…',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: [
        'من الاحتياج إلى الامتلاء.',
        'من التعلّق إلى الحرية الداخلية.',
        'من الخوف من الفقد إلى الشعور بالأمان.',
        'من البحث عن قيمتك في الآخرين إلى معرفتها من الداخل.',
      ],
      closing: [
        'بعد انتهاء الرحلة، ستشعر أن علاقاتك أصبحت أكثر هدوءًا واتزانًا، لأنك لم تعد تبحث عمن يملأ فراغك، بل أصبحت تدخل العلاقات بقلب ممتلئ، يعرف أن مصدر أمانه الأول هو الله.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن مزاجك يتغير بحسب اهتمام الآخرين بك.',
        'تعاني من التعلّق العاطفي أو الخوف من الفقد.',
        'تجد صعوبة في وضع حدود صحية داخل العلاقات.',
        'تستنزف نفسك لإرضاء الآخرين خوفًا من خسارتهم.',
        'ترغب في بناء علاقات تقوم على الحب، لا الاحتياج.',
        'تريد أن تشعر بالامتلاء والأمان، وأن يكون اتصالك بالله هو المصدر الحقيقي لطمأنينتك.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة التحرر',
      text: [
        'أجمل العلاقات لا تبدأ عندما تجد الشخص المناسب…',
        'بل عندما تصبح أنت أكثر امتلاءً، وأكثر اتزانًا، وأكثر حبا لذاتك.',
        'ابدأ رحلتك الآن، وتحرر من الاحتياج العاطفي، لتعيش علاقات أكثر صحة، وقلبًا أكثر سلامًا.',
      ],
      button: 'احجز رحلة التحرر من الاحتياج العاطفي والتعلّق',
    },
    booking: {
      target: 'emotional-need-attachment-release',
    },
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['التعلّق بالناس…', 'الامتلاء من الداخل'],
      journey_intro_emphasis: ['6 جلسات فردية متتابعة'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [
        { from: 'الاحتياج', to: 'الامتلاء.' },
        { from: 'التعلّق', to: 'الحرية الداخلية.' },
        { from: 'الخوف من الفقد', to: 'الشعور بالأمان.' },
        { from: 'البحث عن قيمتك في الآخرين', to: 'معرفتها من الداخل.' },
      ],
    },
  },
  {
    slug: 'return-to-god-inner-peace',
    session_name: 'إصلاح العلاقة مع الله والعودة إليه',
    transformation_title: 'من البعد والصراع… إلى علاقة أقرب بالله',
    image: 'assets/images/sessions/session-return-to-god.png',
    description: [
      'هل تشعر أن هناك مسافة بينك وبين الله…',
      'رغم أنك تصلي، وتدعو، وتحاول أن تقترب؟',
      'ربما تحمل داخلك مشاعر لم تستطع الاعتراف بها يومًا…',
      'غضبًا من أقدار الله…',
      'أو لومًا داخليًا…',
      'أو شعورًا دائمًا بالذنب والتقصير…',
      'أو حتى إحساسًا بأنك لم تعد تعرف كيف تعود إليه.',
      'في هذه الرحلة، نرافقك في مساحة آمنة، لتفهم ما يقف بينك وبين الله، وتبدأ في إصلاح هذه العلاقة بصدق ووعي، حتى تعود إليه بقلب أقرب، وإيمان أعمق، وثقة أكبر.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الرحلة',
      session_count: 4,
      intro:
        'تتكون هذه الرحلة من 4 جلسات فردية متتابعة، نعمل فيها معًا على فهم وإزالة العوائق النفسية والروحية التي أثرت على علاقتك بالله، حتى تعود إليه بقلب أكثر صدقًا، وقربًا، واطمئنانًا.',
      supporting: 'خلال الجلسات نعمل معًا على:',
      bullets: [
        'فهم الصورة التي تكونت لديك عن الله عبر تجارب حياتك.',
        'التعامل مع الغضب من أقدار الله بطريقة واعية وآمنة.',
        'تفكيك مشاعر اللوم أو القسوة تجاه الله التي قد تتكون نتيجة الألم أو الفقد.',
        'التحرر من الشعور المستمر بالذنب أو التقصير الذي يمنعك من العودة إليه.',
        'إعادة بناء العلاقة مع الله على أساس الحب، والثقة، والقرب.',
        'استعادة الشعور بمعية الله في تفاصيل حياتك اليومية.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تصلي، لكنك لا تشعر بالقرب من الله.',
        'تحمل داخلك غضبًا من بعض أقدار الله، ولا تعرف كيف تتعامل معه.',
        'تشعر بالذنب أو التقصير مهما حاولت.',
        'تخجل من الاعتراف بما يدور داخلك تجاه الله.',
        'تمر بابتلاء جعلك تتساءل: لماذا حدث هذا لي؟',
        'تشتاق إلى علاقة أعمق بالله، لكنك لا تعرف كيف تبدأ من جديد.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الرحلة صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الرحلة لا تعدك بأن تختفي كل الأسئلة…',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: [
        'من البعد إلى القرب من الله.',
        'من الغضب على الأقدار إلى فهمها والتصالح معها.',
        'من الخوف من الله إلى الأنس به.',
        'من علاقة قائمة على الواجب فقط… إلى علاقة تقوم على الحب، والثقة، والاتصال.',
      ],
      closing: [
        'بعد انتهاء الرحلة، ستشعر أن علاقتك بالله أصبحت أكثر صدقًا وعمقًا، وأنك لم تعد تخاف من الاقتراب منه، بل تجد فيه ملاذك وأمانك، حتى في أصعب لحظات حياتك.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'تشعر أن علاقتك بالله أصبحت بعيدة أو متعبة.',
        'تحمل داخلك غضبًا من بعض أقدار الله، ولا تعرف كيف تتعامل معه.',
        'تعيش شعورًا دائمًا بالذنب أو التقصير.',
        'مررت بابتلاء أو فقد أثر على علاقتك بالله.',
        'تريد أن تعود إلى الله، لكنك تشعر أن هناك شيئًا يمنعك.',
        'تبحث عن علاقة مع الله تقوم على الحب، والثقة، والقرب، لا على الخوف فقط.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة العودة',
      text: [
        'مهما طالت المسافة…',
        'يبقى باب الله مفتوحًا.',
        'ابدأ رحلتك الآن، ودعنا نسير معًا خطوة بخطوة نحو إصلاح علاقتك بالله، والعودة إليه بقلب أكثر صدقًا وطمأنينة.',
      ],
      button: 'احجز رحلة إصلاح العلاقة مع الله والعودة إليه',
    },
    booking: {
      target: 'return-to-god-inner-peace',
    },
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['البعد والصراع…', 'علاقة أقرب بالله'],
      journey_intro_emphasis: ['4 جلسات فردية متتابعة'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [
        { from: 'البعد', to: 'القرب من الله.' },
        { from: 'الغضب على الأقدار', to: 'فهمها والتصالح معها.' },
        { from: 'الخوف من الله', to: 'الأنس به.' },
        { from: 'علاقة قائمة على الواجب فقط…', to: 'علاقة تقوم على الحب، والثقة، والاتصال.' },
      ],
    },
  },
  {
    slug: 'private-journey-1-to-1',
    session_name: 'جلسة الإرشاد الخاصة 1:1 مع د. رنا مسعد',
    transformation_title: 'مساحة آمنة… لنفهم ما تعيشه، ونرسم طريقك نحو التحول',
    image: 'assets/images/sessions/session-private-journey.png',
    description: [
      'أحيانًا لا نحتاج برنامجًا كاملًا…',
      'ولا نحتاج إجابات جاهزة.',
      'كل ما نحتاجه هو شخص يرى الصورة كاملة، يساعدنا على فهم ما يحدث بداخلنا، ويمنحنا مساحة آمنة لنبدأ من النقطة التي نقف عندها الآن.',
      'هذه رحلة فردية مخصصة مع د. رنا مسعد، صُممت لتناسب احتياجك أنت، مهما كانت المرحلة التي تمر بها، لنكتشف معًا الجذر الحقيقي لما تعيشه، ونضع خطوات واضحة تناسب رحلتك الخاصة.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الجلسة',
      session_count: 1,
      badge_label: 'جلسة خاصة 1:1',
      intro:
        'هذه رحلة فردية مخصصة تتكون من جلسة خاصة (1:1) مع د. رنا مسعد، يتم تصميمها بالكامل وفق احتياجك الشخصي، بعيدًا عن أي قالب أو مسار ثابت.',
      supporting: 'خلال الجلسة نعمل معًا على:',
      bullets: [
        'فهم التحدي الحقيقي الذي تمر به، وليس فقط ما يظهر على السطح.',
        'الوصول إلى الجذر النفسي أو العاطفي أو الروحي للمشكلة.',
        'اكتشاف الأنماط التي قد تكون تعيق تقدمك.',
        'تقديم رؤية أعمق تساعدك على فهم نفسك بوضوح.',
        'وضع خطوات عملية تناسب مرحلتك الحالية.',
        'مساعدتك على اتخاذ القرار الأنسب لاستكمال رحلتك، سواء من خلال تطبيق ما خرجت به من الجلسة أو الانضمام إلى أحد البرامج إذا كان مناسبًا لك.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تمر بمرحلة لا تعرف كيف تتعامل معها.',
        'تشعر أن لديك أكثر من تحدٍ في الوقت نفسه.',
        'لا تعرف من أين تبدأ رحلة التغيير.',
        'تحتاج إلى من يساعدك على رؤية الصورة بوضوح.',
        'ترغب في مساحة آمنة تتحدث فيها بحرية وخصوصية.',
        'تبحث عن توجيه شخصي يناسب قصتك، لا نصائح عامة.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الجلسة صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الجلسة لا تعدك بأن كل شيء سيتغير في ساعة واحدة…',
        'لكنها تمنحك فرصة للتوقف، ورؤية ما يحدث داخلك بوضوح، وفهم الخطوة التالية في رحلتك.',
      ],
      bullets: [],
      closing: [
        'بعد الجلسة، ستخرج برؤية أوضح، واتجاه أكثر وضوحًا، وخطة تناسب احتياجك الحقيقي، بدلًا من الاستمرار في الدوران داخل نفس الدائرة.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'لا تعرف أي رحلة أو برنامج هو الأنسب لك.',
        'تمر بمرحلة انتقالية أو قرار مهم.',
        'ترغب في فهم أعمق لما تعيشه.',
        'تحتاج إلى جلسة فردية بسرية وخصوصية كاملة.',
        'تبحث عن توجيه شخصي يناسب ظروفك واحتياجاتك.',
        'تريد أن تبدأ رحلة التغيير من المكان الصحيح.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلتك الخاصة',
      text: [
        'أحيانًا… تكون جلسة واحدة صادقة، في الوقت المناسب، بداية لتحول كبير.',
        'إذا شعرت أن الوقت قد حان لتمنح نفسك هذه المساحة، فهذه الرحلة خُلقت من أجلك.',
      ],
      button: 'احجز رحلتك الخاصة مع د. رنا مسعد',
    },
    booking: {
      target: 'private-journey-1-to-1',
    },
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['مساحة آمنة…', 'التحول'],
      journey_intro_emphasis: ['جلسة خاصة (1:1)'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [],
    },
  },
  {
    slug: 'healing-roots-old-wounds',
    session_name: 'شفاء الصدمات والجروح القديمة',
    transformation_title: 'من سجن الماضي… إلى حرية الحاضر',
    image: 'assets/images/sessions/session-healing-roots.png',
    description: [
      'هل تشعر أن هناك ألمًا قديمًا ما زال يؤثر على حياتك حتى اليوم؟',
      'ربما مرّت سنوات على بعض المواقف… لكن أثرها ما زال حاضرًا في مشاعرك، وعلاقاتك، وثقتك بنفسك، وطريقتك في رؤية الحياة.',
      'في هذه الرحلة، نعمل معًا على فهم الجذور التي صنعت هذا الألم، حتى تتحرر من تأثيرها، وتبدأ في عيش حاضرك بخفة، ووعي، واتزان.',
    ],
    details_button: 'اعرف تفاصيل الجلسة',
    journey: {
      heading: 'تفاصيل الرحلة',
      session_count: 4,
      intro:
        'تتكون هذه الرحلة من 4 جلسات فردية متتابعة، نعمل فيها معًا على الوصول إلى الجذور العاطفية القديمة، وفهم تأثيرها على حياتك اليوم، ثم البدء في رحلة شفائها والتحرر منها.',
      supporting: 'خلال الجلسات نعمل معًا على:',
      bullets: [
        'اكتشاف الصدمات والجروح القديمة التي ما زالت تؤثر على حياتك.',
        'فهم كيف شكّلت تجارب الماضي أفكارك ومشاعرك وسلوكك اليوم.',
        'التعامل مع جروح الرفض، والإهمال، والخذلان، والفقد، وغيرها من التجارب المؤلمة.',
        'إعادة بناء علاقتك بنفسك بعد سنوات من حمل هذا الألم.',
        'استعادة شعورك بالأمان والقدرة على العيش في الحاضر دون أن يقودك الماضي.',
      ],
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما تشعر أنك…',
      bullets: [
        'تعيد نفس الأنماط في علاقاتك دون أن تعرف السبب.',
        'تتأثر بمواقف بسيطة وكأنها أكبر من حجمها.',
        'تجد صعوبة في الثقة بالآخرين أو بنفسك.',
        'تشعر أن بعض ذكريات الماضي ما زالت تؤلمك حتى اليوم.',
        'تحمل داخلك مشاعر لم تستطع التعبير عنها أو تجاوزها.',
        'تشعر أن الماضي ما زال يقود جزءًا كبيرًا من حياتك.',
      ],
      closing: 'إذا وجدت نفسك في أكثر من نقطة…\nفهذه الرحلة صُممت من أجلك.',
    },
    transformation: {
      heading: 'التحول الواضح والنتيجة المتوقعة',
      intro: [
        'هذه الرحلة لا تمحو الماضي…',
        'لكنها تساعدك أن تنتقل:',
      ],
      bullets: [
        'من أسر الجروح القديمة إلى التحرر منها.',
        'من حمل الألم إلى فهمه والتعافي منه.',
        'من تكرار نفس الأنماط إلى صناعة اختيارات أكثر وعيًا.',
        'من العيش بردود أفعال الماضي إلى الحضور الكامل في حياتك اليوم.',
      ],
      closing: [
        'بعد انتهاء الرحلة، ستشعر أن الماضي لم يعد يتحكم في قراراتك أو علاقاتك كما كان، وأن لديك مساحة أكبر للعيش بخفة، وثقة، وسلام مع نفسك.',
      ],
    },
    fit: {
      heading: 'مناسبة لك إذا…',
      bullets: [
        'مررت بتجارب مؤلمة وتشعر أن أثرها ما زال مستمرًا.',
        'تعاني من جروح قديمة تؤثر على علاقاتك أو ثقتك بنفسك.',
        'تكرر نفس المشكلات أو الأنماط في حياتك.',
        'تجد صعوبة في تجاوز أحداث من الماضي.',
        'ترغب في التحرر من الحمل العاطفي الذي تحمله منذ سنوات.',
        'تريد أن تبدأ حياة جديدة دون أن يبقى الماضي هو من يقودها.',
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة الشفاء',
      text: [
        'أنت لست ما حدث لك…',
        'ولست مضطرًا أن تبقى أسيرًا لجراح الأمس.',
        'ابدأ رحلتك الآن، ودعنا نعمل معًا على شفاء الجذور، حتى تعيش حاضرك بحرية، ووعي، واتزان.',
      ],
      button: 'احجز رحلة شفاء الجذور والجروح القديمة',
    },
    booking: {
      target: 'healing-roots-old-wounds',
    },
    display: {
      eyebrow: 'جلسة خاصة',
      transformation_title_emphasis: ['سجن الماضي…', 'حرية الحاضر'],
      journey_intro_emphasis: ['4 جلسات فردية متتابعة'],
      flow_prefix: 'من',
      flow_connector: 'إلى',
      transformation_flow: [
        { from: 'أسر الجروح القديمة', to: 'التحرر منها.' },
        { from: 'حمل الألم', to: 'فهمه والتعافي منه.' },
        { from: 'تكرار نفس الأنماط', to: 'صناعة اختيارات أكثر وعيًا.' },
        { from: 'العيش بردود أفعال الماضي', to: 'الحضور الكامل في حياتك اليوم.' },
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
      session_count: 4,
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
  {
    slug: 'restore-confidence-self-worth',
    session_name: 'Rebuilding Self-Confidence and Self-Worth',
    transformation_title: 'From doubting yourself… to recognizing your true worth',
    image: 'assets/images/sessions/session-restore-confidence.png',
    description: [
      "Do you feel that your worth has become tied to other people's opinions?",
      'You doubt yourself, wait for validation from the outside, and feel your confidence shake with every criticism, rejection, or comparison.',
      'In this journey, we work together to rebuild your self-confidence from its roots, so you can stop searching for your worth in others, begin to see it within yourself, and live with greater steadiness, calm, and balance.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Journey Details',
      session_count: 4,
      intro:
        'This journey consists of 4 consecutive private one-on-one sessions, where we work together to rebuild your confidence in yourself and restore your true sense of worth away from comparison, rejection, and the constant need to prove yourself.',
      supporting: 'During the sessions we work together on:',
      bullets: [
        'Discovering the real roots of low self-confidence.',
        'Understanding how your self-image was shaped by past experiences.',
        'Releasing the beliefs that make you feel that you are “not enough.”',
        'Rebuilding self-respect from within.',
        "Stopping the habit of tying your worth to other people's opinions or acceptance.",
        'Building a more compassionate and trusting relationship with yourself that reflects in your decisions, relationships, and life.',
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Doubt yourself even after your successes.',
        'Constantly need validation or reassurance from others.',
        'Fear rejection or criticism more than you would like.',
        'Continuously compare yourself with others.',
        "Feel that your worth rises or falls depending on your achievements or other people's opinions.",
        'Find it difficult to set boundaries or express your needs.',
      ],
      closing: 'If you found yourself in more than one point…\nThis journey was designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This journey does not promise that every moment of self-doubt will disappear…',
        'But it helps you move:',
      ],
      bullets: [
        'From doubting yourself to trusting yourself.',
        'From seeking acceptance to recognizing your worth.',
        'From fearing rejection to expressing yourself with confidence.',
      ],
      closing: [
        'By the end of the journey, you will feel that your worth is no longer tied to what others say about you, but comes from a deeper understanding of yourself and a more balanced relationship with God and with yourself.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'Your confidence in yourself is easily shaken.',
        "You rely heavily on other people's opinions to evaluate yourself.",
        'You find it difficult to say “no” or set healthy boundaries.',
        'You struggle with constant comparison or feelings of inadequacy.',
        'You want to build genuine confidence that comes from within, rather than from achievements or external admiration.',
        'You want to live with a deeper sense of your worth and greater balance in your relationship with yourself and with God.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey of Reclaiming Your Worth',
      text: [
        'Your worth is not something you need to prove…',
        "It is a truth you may have drifted away from through life's experiences.",
        'Begin your journey now, rebuild your confidence, and live with greater freedom, balance, and deeper peace.',
      ],
      button: 'Book the Self-Confidence and Self-Worth Journey',
    },
    booking: {
      target: 'restore-confidence-self-worth',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['doubting yourself…', 'recognizing your true worth'],
      journey_intro_emphasis: ['4 private one-on-one sessions'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [
        { from: 'doubting yourself', to: 'trusting yourself.' },
        { from: 'seeking acceptance', to: 'recognizing your worth.' },
        { from: 'fearing rejection', to: 'expressing yourself with confidence.' },
      ],
    },
  },
  {
    slug: 'emotional-need-attachment-release',
    session_name: 'Releasing Emotional Neediness and Attachment',
    transformation_title: 'From attachment to others… to inner fullness',
    image: 'assets/images/sessions/session-emotional-attachment.png',
    description: [
      'Do you feel that your happiness has become tied to another person?',
      'You fear losing them, constantly seek attention, and feel deeply hurt by being ignored or rejected, until your relationships begin to drain your heart instead of bringing it peace.',
      'In this journey, we work together to understand the true root of emotional neediness, so you can release attachment, build a deeper sense of security and inner fullness, and experience healthier, more balanced relationships.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Journey Details',
      session_count: 6,
      intro:
        'This journey consists of 6 consecutive private one-on-one sessions, where we work together to untangle the roots of emotional neediness and attachment, so you can regain your inner freedom and build relationships based on love rather than need.',
      supporting: 'During the sessions we work together on:',
      bullets: [
        'Understanding the real reasons behind emotional neediness and attachment.',
        'Discovering the old wounds that continue to affect your relationships today.',
        'Releasing the fear of loss or rejection.',
        'Rebuilding a sense of security from within.',
        'Learning how to love without losing yourself.',
        'Strengthening your connection with God, so He becomes the true source of security and fullness in your life.',
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Fear deeply that someone you love may leave you.',
        'Constantly seek attention or validation from others.',
        'Feel emotionally affected when someone takes too long to reply or changes the way they treat you.',
        'Find it difficult to leave a relationship that is hurting you.',
        'Feel that your worth is tied to having a particular person in your life.',
        'Give more than you can afford emotionally because you are afraid of losing others.',
      ],
      closing: 'If you found yourself in more than one point…\nThis journey was designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This journey does not promise that you will stop loving people…',
        'But it helps you move:',
      ],
      bullets: [
        'From neediness to inner fullness.',
        'From attachment to inner freedom.',
        'From fear of loss to a sense of security.',
        'From searching for your worth in others to recognizing it within yourself.',
      ],
      closing: [
        'By the end of the journey, you will feel that your relationships have become calmer and more balanced, because you are no longer looking for someone to fill an emptiness within you. Instead, you enter relationships with a fuller heart that knows its first source of security is God.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'Your mood changes depending on how much attention others give you.',
        'You struggle with emotional attachment or fear of loss.',
        'You find it difficult to set healthy boundaries in relationships.',
        'You exhaust yourself trying to please others because you are afraid of losing them.',
        'You want to build relationships based on love rather than need.',
        'You want to feel fuller and more secure, with your connection to God becoming the true source of your peace.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey to Freedom',
      text: [
        'The most beautiful relationships do not begin when you find the right person…',
        'They begin when you become more fulfilled, more balanced, and more loving toward yourself.',
        'Begin your journey now, release emotional neediness, and experience healthier relationships and a more peaceful heart.',
      ],
      button: 'Book the Emotional Neediness and Attachment Release Journey',
    },
    booking: {
      target: 'emotional-need-attachment-release',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['attachment to others…', 'inner fullness'],
      journey_intro_emphasis: ['6 private one-on-one sessions'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [
        { from: 'neediness', to: 'inner fullness.' },
        { from: 'attachment', to: 'inner freedom.' },
        { from: 'fear of loss', to: 'a sense of security.' },
        { from: 'searching for your worth in others', to: 'recognizing it within yourself.' },
      ],
    },
  },
  {
    slug: 'return-to-god-inner-peace',
    session_name: 'Repairing Your Relationship with God and Returning to Him',
    transformation_title: 'From distance and inner conflict… to a closer relationship with God',
    image: 'assets/images/sessions/session-return-to-god.png',
    description: [
      'Do you feel there is a distance between you and God…',
      'Even though you pray, call upon Him, and try to draw closer?',
      'Perhaps you carry feelings inside that you have never been able to admit…',
      'Anger about what God has decreed…',
      'Or inner blame…',
      'Or a constant feeling of guilt and falling short…',
      'Or even the feeling that you no longer know how to return to Him.',
      'In this journey, we walk with you in a safe space to understand what stands between you and God, and begin repairing this relationship with honesty and awareness, so you can return to Him with a closer heart, deeper faith, and greater trust.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Journey Details',
      session_count: 4,
      intro:
        'This journey consists of 4 consecutive private one-on-one sessions, where we work together to understand and remove the psychological and spiritual barriers that have affected your relationship with God, so you can return to Him with greater honesty, closeness, and reassurance.',
      supporting: 'During the sessions we work together on:',
      bullets: [
        'Understanding the image of God that has formed within you through your life experiences.',
        'Working through anger about what God has decreed in a conscious and safe way.',
        'Untangling feelings of blame or harshness toward God that may have developed through pain or loss.',
        'Releasing the constant guilt or sense of falling short that prevents you from returning to Him.',
        'Rebuilding your relationship with God on a foundation of love, trust, and closeness.',
        "Restoring the sense of God's presence with you in the details of your daily life.",
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Pray, yet do not feel close to God.',
        'Carry anger about some of what God has decreed and do not know how to deal with it.',
        'Feel guilty or inadequate no matter how hard you try.',
        'Feel ashamed to admit what is happening inside you toward God.',
        'Have gone through a trial that made you ask: Why did this happen to me?',
        'Long for a deeper relationship with God but do not know how to begin again.',
      ],
      closing: 'If you found yourself in more than one point…\nThis journey was designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This journey does not promise that every question will disappear…',
        'But it helps you move:',
      ],
      bullets: [
        'From distance to closeness with God.',
        'From anger about what has been decreed to understanding and making peace with it.',
        'From fear of God to finding comfort in His presence.',
        'From a relationship based only on obligation… to one built on love, trust, and connection.',
      ],
      closing: [
        'By the end of the journey, you will feel that your relationship with God has become more honest and deeper, and that you no longer fear drawing close to Him, but find in Him your refuge and security, even through the hardest moments of your life.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'Your relationship with God feels distant or difficult.',
        'You carry anger about some of what God has decreed and do not know how to work through it.',
        'You live with a constant sense of guilt or falling short.',
        'You have gone through a trial or loss that affected your relationship with God.',
        'You want to return to God but feel that something is holding you back.',
        'You are seeking a relationship with God built on love, trust, and closeness rather than fear alone.',
      ],
    },
    final_cta: {
      heading: 'Begin the Journey Back',
      text: [
        'No matter how long the distance has been…',
        "God's door remains open.",
        'Begin your journey now, and let us walk together step by step toward repairing your relationship with God and returning to Him with a more honest and peaceful heart.',
      ],
      button: 'Book the Journey to Repair Your Relationship with God and Return to Him',
    },
    booking: {
      target: 'return-to-god-inner-peace',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['distance and inner conflict…', 'a closer relationship with God'],
      journey_intro_emphasis: ['4 private one-on-one sessions'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [
        { from: 'distance', to: 'closeness with God.' },
        { from: 'anger about what has been decreed', to: 'understanding and making peace with it.' },
        { from: 'fear of God', to: 'finding comfort in His presence.' },
        { from: 'a relationship based only on obligation…', to: 'one built on love, trust, and connection.' },
      ],
    },
  },
  {
    slug: 'private-journey-1-to-1',
    session_name: 'Private 1:1 Guidance Session with Dr. Rana Mosaad',
    transformation_title:
      'A safe space… to understand what you are going through and map your path toward transformation',
    image: 'assets/images/sessions/session-private-journey.png',
    description: [
      'Sometimes we do not need a complete program…',
      'And we do not need ready-made answers.',
      'Sometimes all we need is someone who can see the whole picture, help us understand what is happening inside us, and give us a safe space to begin exactly where we are.',
      'This is a personalized one-on-one journey with Dr. Rana Mosaad, designed around your individual needs, whatever stage you are going through, so together we can discover the true root of what you are experiencing and define clear steps for your unique journey.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Session Details',
      session_count: 1,
      badge_label: 'Private 1:1 Session',
      intro:
        'This is a personalized journey consisting of one private 1:1 session with Dr. Rana Mosaad, designed entirely around your individual needs rather than a fixed template or predefined path.',
      supporting: 'During the session we work together on:',
      bullets: [
        'Understanding the real challenge you are going through, not only what appears on the surface.',
        'Reaching the psychological, emotional, or spiritual root of the issue.',
        'Discovering the patterns that may be holding back your progress.',
        'Offering a deeper perspective that helps you understand yourself more clearly.',
        'Defining practical steps that suit your current stage.',
        'Helping you choose the most appropriate next step for your journey, whether that means applying what you gained from the session or joining one of the programs if it is right for you.',
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Are going through a stage you do not know how to handle.',
        'Are facing several challenges at the same time.',
        'Do not know where to begin your journey of change.',
        'Need someone to help you see the bigger picture clearly.',
        'Want a safe and completely private space where you can speak freely.',
        'Are looking for personal guidance that fits your story rather than general advice.',
      ],
      closing: 'If you found yourself in more than one point…\nThis session was designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This session does not promise that everything will change in a single hour…',
        'But it gives you an opportunity to pause, clearly see what is happening inside you, and understand the next step in your journey.',
      ],
      bullets: [],
      closing: [
        'After the session, you will leave with greater clarity, a clearer direction, and a plan that fits your real needs instead of continuing to go around in the same circle.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You do not know which journey or program is right for you.',
        'You are going through a transitional stage or facing an important decision.',
        'You want a deeper understanding of what you are experiencing.',
        'You need an individual session with complete privacy and confidentiality.',
        'You are looking for personal guidance suited to your circumstances and needs.',
        'You want to begin your journey of change from the right place.',
      ],
    },
    final_cta: {
      heading: 'Begin Your Personal Journey',
      text: [
        'Sometimes… one honest session at the right time can become the beginning of a major transformation.',
        'If you feel that the time has come to give yourself this space, this journey was created for you.',
      ],
      button: 'Book Your Private Journey with Dr. Rana Mosaad',
    },
    booking: {
      target: 'private-journey-1-to-1',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['A safe space…', 'transformation'],
      journey_intro_emphasis: ['1 private 1:1 session'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [],
    },
  },
  {
    slug: 'healing-roots-old-wounds',
    session_name: 'Healing Trauma and Old Wounds',
    transformation_title: 'From being imprisoned by the past… to freedom in the present',
    image: 'assets/images/sessions/session-healing-roots.png',
    description: [
      'Do you feel there is an old pain that is still affecting your life today?',
      'Years may have passed since certain experiences… yet their impact is still present in your emotions, relationships, self-confidence, and the way you see life.',
      'In this journey, we work together to understand the roots that created this pain, so you can release their hold and begin living your present with greater lightness, awareness, and balance.',
    ],
    details_button: 'Learn Session Details',
    journey: {
      heading: 'Journey Details',
      session_count: 4,
      intro:
        'This journey consists of 4 consecutive private one-on-one sessions, where we work together to reach old emotional roots, understand how they affect your life today, and begin the process of healing and releasing them.',
      supporting: 'During the sessions we work together on:',
      bullets: [
        'Discovering the trauma and old wounds that are still affecting your life.',
        'Understanding how past experiences shaped your thoughts, emotions, and behavior today.',
        'Working with wounds of rejection, neglect, disappointment, loss, and other painful experiences.',
        'Rebuilding your relationship with yourself after years of carrying this pain.',
        'Restoring your sense of safety and your ability to live in the present without being led by the past.',
      ],
    },
    pain: {
      heading: 'Does this sound like what you are living?',
      intro: 'You may feel that you…',
      bullets: [
        'Repeat the same patterns in your relationships without understanding why.',
        'React strongly to situations that seem small on the surface.',
        'Find it difficult to trust others or yourself.',
        'Feel that some memories from the past still hurt you today.',
        'Carry emotions inside that you have never been able to express or move beyond.',
        'Feel that the past is still directing a large part of your life.',
      ],
      closing: 'If you found yourself in more than one point…\nThis journey was designed for you.',
    },
    transformation: {
      heading: 'The Clear Transformation and Expected Result',
      intro: [
        'This journey does not erase the past…',
        'But it helps you move:',
      ],
      bullets: [
        'From being trapped by old wounds to being released from them.',
        'From carrying pain to understanding it and healing from it.',
        'From repeating the same patterns to making more conscious choices.',
        'From living through reactions shaped by the past to being fully present in your life today.',
      ],
      closing: [
        'By the end of the journey, you will feel that the past no longer controls your decisions or relationships the way it once did, and that you have more space to live with lightness, confidence, and peace with yourself.',
      ],
    },
    fit: {
      heading: 'Right for you if…',
      bullets: [
        'You have been through painful experiences and still feel their impact.',
        'You carry old wounds that affect your relationships or confidence in yourself.',
        'You keep repeating the same problems or patterns in your life.',
        'You find it difficult to move beyond events from the past.',
        'You want to release the emotional weight you have carried for years.',
        'You want to begin a new life without allowing the past to continue leading it.',
      ],
    },
    final_cta: {
      heading: 'Begin the Healing Journey',
      text: [
        'You are not what happened to you…',
        "And you do not have to remain a prisoner of yesterday's wounds.",
        'Begin your journey now, and let us work together to heal the roots, so you can live your present with freedom, awareness, and balance.',
      ],
      button: 'Book the Journey to Heal Old Roots and Wounds',
    },
    booking: {
      target: 'healing-roots-old-wounds',
    },
    display: {
      eyebrow: 'Private Session',
      transformation_title_emphasis: ['being imprisoned by the past…', 'freedom in the present'],
      journey_intro_emphasis: ['4 private one-on-one sessions'],
      flow_prefix: 'From',
      flow_connector: 'to',
      transformation_flow: [
        { from: 'being trapped by old wounds', to: 'being released from them.' },
        { from: 'carrying pain', to: 'understanding it and healing from it.' },
        { from: 'repeating the same patterns', to: 'making more conscious choices.' },
        {
          from: 'living through reactions shaped by the past',
          to: 'being fully present in your life today.',
        },
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
