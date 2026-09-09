/**
 * Rich Training Programs detail schema (master template).
 * Legacy data/programs.js + seeders remain for program-detail.html.
 *
 * Only migrated slugs use programs-details.html via getProgramDetailPage().
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 */

const PROGRAMS_DETAILS_AR = [
  {
    slug: 'nlp',
    seo: {
      title: 'NLP | البرمجة اللغوية العصبية | Dr. Rana Mosaad',
      description:
        'البرمجة اللغوية العصبية هي برنامج تدريبي عملي يساعدك على فهم كيف تفكر، كيف تصنع المعنى، كيف تتشكل استجاباتك ومشاعرك، وكيف يمكنك أن تعيد برمجة أنماطك الداخلية لتصل إلى تواصل أقوى، ثقة أكبر، ونتائج أوضح في حياتك وعملك.',
    },
    hero: {
      eyebrow: 'NLP | البرمجة اللغوية العصبية',
      title: 'افهم كيف يعمل عقلك… وتعلم كيف تعيد برمجته لصالحك',
      supporting_line: 'رحلة لفهم كيف يعمل عقلك… وكيف تغيّر أفكارك، مشاعرك، وسلوكك بوعي',
      description:
        'البرمجة اللغوية العصبية هي برنامج تدريبي عملي يساعدك على فهم كيف تفكر، كيف تصنع المعنى، كيف تتشكل استجاباتك ومشاعرك، وكيف يمكنك أن تعيد برمجة أنماطك الداخلية لتصل إلى تواصل أقوى، ثقة أكبر، ونتائج أوضح في حياتك وعملك.',
      primary_cta: 'احجز مكانك في البرنامج',
      secondary_cta: 'اكتشف البرنامج',
    },
    pain: {
      heading: 'هل هذا يشبه ما تعيشه؟',
      intro: 'ربما أنت:',
      bullets: [
        'تشعر أن أفكارك تكرر نفس الأنماط دون أن تعرف كيف توقفها',
        'تنفعل بسرعة أو تجد صعوبة في إدارة حالتك الداخلية',
        'تدخل في مواقف كان يمكنك التعامل معها أفضل لو كنت أكثر وعيًا بنفسك',
        'تشعر أحيانًا أنك تعرف ما تريد… لكنك لا تعرف كيف تجعل عقلك يساعدك عليه',
        'تجد صعوبة في التأثير، الإقناع، أو بناء تواصل قوي مع الآخرين',
        'تعيش بعض العادات أو الاستجابات التلقائية التي لم تعد تخدمك',
        'تريد أن تفهم كيف يعمل عقلك ولغتك ومشاعرك، حتى تقودها بدل أن تقودك هي',
      ],
      closing: [
        'وهنا المشكلة ليست فقط في الظروف…',
        'بل في الطريقة التي يعمل بها برنامجك الداخلي الآن.',
      ],
    },
    importance: {
      heading: 'لماذا NLP مهم؟',
      paragraphs: [
        'لأن كثيرًا من الناس يعيشون حياتهم بعقلٍ يعمل بشكل تلقائي…',
        'بمعتقدات قديمة، استجابات متكررة، وأنماط لم يختاروها بوعي.',
      ],
      loop: [
        'يفكرون بنفس الطريقة…',
        'فيشعرون بنفس الطريقة…',
        'فيتصرفون بنفس الطريقة…',
      ],
      loop_question: 'ثم يتساءلون: لماذا لا تتغير النتائج؟',
      bridge: ['NLP يفتح لك هذا العالم من الداخل.', 'يعلمك كيف:'],
      bullets: [
        'تفهم بنية خبرتك الداخلية',
        'تلاحظ كيف تصنع حالتك',
        'تغيّر ما لا يخدمك',
        'وتبني أنماطًا جديدة تدعمك في التواصل، الثقة، الإنجاز، والتغيير',
      ],
      simplified_label: 'بمعنى أبسط:',
      closing: [
        'إذا كنت تريد أن تغيّر حياتك…',
        'فأنت تحتاج أولًا أن تفهم كيف تعمل لغتك، أفكارك، وحالتك من الداخل.',
      ],
    },
    transformation: {
      heading: 'ماذا سيعطيك برنامج NLP؟',
      intro: 'هذا البرنامج يساعدك على أن تنتقل من:',
      flows: [
        { from: 'ردود الفعل التلقائية', to: 'الوعي والاختيار' },
        { from: 'التشتت الداخلي', to: 'وضوح التفكير' },
        { from: 'اللغة التي تضعفك', to: 'لغة تدعمك' },
        { from: 'الأنماط القديمة', to: 'استجابات جديدة أكثر فاعلية' },
        { from: 'التواصل العادي', to: 'تواصل أكثر تأثيرًا وفهمًا' },
        { from: 'القيادة الخارجية فقط', to: 'قيادة أعمق للذات والآخر' },
      ],
      simplified_label: 'بمعنى أبسط:',
      closing: [
        'ستفهم كيف يعمل عقلك…',
        'وستتعلم كيف تستخدمه لصالحك بدل أن تبقى أسيرًا لبرامجك القديمة.',
      ],
    },
    audience: {
      heading: 'لمن صُمم هذا البرنامج؟',
      intro: 'هذا البرنامج مناسب لك إذا كنت:',
      bullets: [
        'تريد أن تفهم نفسك والآخرين بصورة أعمق',
        'تريد أدوات عملية للتغيير الشخصي والتواصل والتأثير',
        'تعمل كمدرب، معالج، قائد، صاحب مشروع، أو محترف يتعامل مع الناس',
        'تريد تطوير مهاراتك في التواصل، الإقناع، وبناء rapport',
        'تريد أن تتعلم كيف تدير حالتك الداخلية بشكل أفضل',
        'تبحث عن منهج تطبيقي يساعدك على تغيير الأنماط لا مجرد فهمها',
        'تريد استخدام NLP مع نفسك أو مع عملائك بطريقة احترافية',
      ],
      not_for: {
        heading: 'لمن غير مناسب؟',
        intro: 'هذا البرنامج قد لا يكون مناسبًا لك إذا كنت:',
        bullets: [
          'تبحث فقط عن محتوى نظري دون تطبيق',
          'تريد نتائج بدون ممارسة أو تدريب',
          'لا ترغب في مراجعة أنماطك الحالية أو طرق تفكيرك',
          'تبحث عن تحفيز مؤقت أكثر من بناء مهارة حقيقية',
        ],
      },
    },
    curriculum: {
      heading: 'ماذا ستتعلم داخل برنامج NLP؟',
      modules: [
        {
          order: 1,
          heading: 'كيف يعمل العقل والخبرة الداخلية',
          body: 'ستفهم كيف يصنع الإنسان تجربته من الداخل:\nمن خلال الصور، الأصوات، الإحساس، واللغة.',
        },
        {
          order: 2,
          heading: 'إدارة الحالة الداخلية',
          body: 'ستتعلم كيف تؤثر حالتك على:',
          bullets: ['قراراتك', 'تواصلك', 'أدائك', 'وردود أفعالك'],
          closing: 'وكيف تغيّر هذه الحالة بوعي.',
        },
        {
          order: 3,
          heading: 'اللغة وتأثيرها على العقل',
          body: 'ستكتشف كيف تشكل الكلمات المعنى،\n\nوكيف يمكن للغة أن:',
          bullets: ['تقيدك', 'أو تحررك', 'تضعفك', 'أو تمنحك قوة وتأثيرًا أكبر'],
        },
        {
          order: 4,
          heading: 'بناء Rapport والتواصل المؤثر',
          body: 'ستتعلم كيف تبني اتصالًا أقوى مع الآخرين،\n\nوتفهم أساليبهم في التفكير والتواصل،\n\nوتتواصل معهم بمرونة وتأثير أكبر.',
        },
        {
          order: 5,
          heading: 'تغيير الأنماط الذهنية والسلوكية',
          body: 'ستتعلم كيف تكتشف الأنماط التي لا تخدمك،\n\nوكيف تبدأ في إعادة برمجتها بأنماط أكثر فاعلية.',
        },
        {
          order: 6,
          heading: 'المعتقدات والقيم',
          body: 'ستفهم كيف تؤثر معتقداتك وقيمك على اختياراتك،\n\nوكيف تغيّر ما يعطلك منها بطريقة ذكية وعملية.',
        },
        {
          order: 7,
          heading: 'Anchoring وState Management',
          body: 'ستتعلم كيف تربط حالاتك الداخلية بمحفزات معينة،\n\nوكيف تستدعي حالات مفيدة مثل:',
          bullets: ['الثقة', 'الهدوء', 'الحضور', 'التركيز'],
        },
        {
          order: 8,
          heading: 'Reframing',
          body: 'ستتعلم كيف تغيّر الإطار الذي ترى به الموقف،\n\nوبالتالي تغيّر معناه وتأثيره عليك.',
        },
        {
          order: 9,
          heading: 'Strategies',
          body: 'ستفهم كيف يبني العقل استراتيجياته الداخلية،\n\nمثل:',
          bullets: ['اتخاذ القرار', 'التحفيز', 'التسويف', 'التعلم', 'الإبداع'],
          closing: 'وستتعلم كيف تغيّر هذه الاستراتيجيات لصالحك.',
        },
        {
          order: 10,
          heading: 'Modeling Excellence',
          body: 'وهو من أعظم ما في NLP:\n\nأن تتعلم كيف تلاحظ بنية الامتياز عند الآخرين،\n\nثم تستخرجها وتستخدمها لتطوير نفسك.',
        },
      ],
    },
    differentiator: {
      heading: 'ما الذي يميز برنامج NLP؟',
      intro_before: 'لأن هذا البرنامج لا يكتفي بأن يقول لك:',
      quotes: ['“فكّر بشكل إيجابي”', '“كن أكثر ثقة”'],
      quote_connector: 'أو',
      intro_after: [
        'بل يعلمك كيف تتكوّن الحالة أصلًا',
        'وكيف تغيّر بنيتها من الداخل.',
      ],
      supporting_heading: 'ما الذي يميّزه؟',
      bullets: [
        'برنامج عملي وليس مجرد طرح نظري',
        'يساعدك على فهم العقل واللغة والسلوك في نفس الوقت',
        'يقدّم أدوات للتغيير الشخصي والتواصل والتأثير',
        'يفيدك على المستوى الشخصي والمهني',
        'يمكن استخدامه مع نفسك أو مع الآخرين',
        'يجمع بين الوعي، الممارسة، والتطبيق العملي',
      ],
    },
    results: {
      heading: 'ما النتائج المتوقعة بعد هذا البرنامج؟',
      intro: 'بعد هذه الرحلة، من المتوقع أن تلاحظ:',
      bullets: [
        'وعيًا أكبر بطريقة تفكيرك',
        'فهمًا أعمق لحالتك الداخلية',
        'قدرة أفضل على إدارة أفكارك ومشاعرك',
        'مهارة أعلى في التواصل والتأثير',
        'مرونة أكبر في التعامل مع المواقف المختلفة',
        'وعيًا أوضح بمعتقداتك وقيمك وأنماطك',
        'قدرة أعلى على التغيير بدل البقاء في التكرار',
        'أدوات عملية تستخدمها مع نفسك أو مع عملائك',
      ],
    },
    why_choose: {
      heading: 'لماذا يتعلم الناس NLP أصلًا؟',
      intro: 'لأنهم يريدون:',
      bullets: [
        'أن يفهموا أنفسهم أكثر',
        'أن يتواصلوا بشكل أفضل',
        'أن يغيروا الأنماط التي تعطلهم',
        'أن يؤثروا بوعي أكبر',
        'أن يستخدموا أدوات عملية في التدريب أو الكوتشنج أو القيادة أو الحياة',
      ],
      closing: [
        'NLP ليس مجرد معرفة عن العقل…',
        'بل طريقة عملية لتتعلم كيف تعمل مع عقلك بذكاء أكبر.',
      ],
    },
    trainer: {
      heading: 'من يقودك في هذه الرحلة؟',
      subheading: 'عن د. رنا مسعد',
      paragraphs: [
        'أنا د. رنا مسعد، وأقدّم هذا البرنامج كرحلة عملية تساعدك على أن تفهم كيف يعمل عالمك الداخلي، وكيف تعيد برمجة أنماطك الذهنية والعاطفية والسلوكية بوعي أكبر.',
        'هدفي ليس أن أعطيك مفاهيم فقط…',
        'بل أن أقدّم لك أدوات يمكنك أن تستخدمها:',
      ],
      bullets: ['مع نفسك', 'في حياتك', 'في عملك', 'ومع عملائك'],
      closing: ['حتى يتحول الفهم إلى تغيير…', 'والتغيير إلى نتائج حقيقية.'],
    },
    faq: {
      heading: 'الأسئلة الشائعة',
      items: [
        {
          question: 'هل NLP مناسب لي إذا كنت مبتدئًا؟',
          answer:
            'نعم، إذا تم تقديمه بشكل منظم وواضح، فهو مناسب جدًا للمبتدئ وللمحترف أيضًا.',
        },
        {
          question: 'هل البرنامج عملي أم نظري؟',
          answer:
            'NLP بطبيعته برنامج عملي جدًا، وقيمته الحقيقية تظهر في التطبيق لا في الفهم فقط.',
        },
        {
          question: 'هل يمكنني استخدامه مع العملاء؟',
          answer:
            'نعم، كثير من المدربين والكوتشز والقادة يستخدمون NLP كأداة قوية في التواصل والتغيير.',
        },
        {
          question: 'هل يفيدني فقط في العمل؟',
          answer_intro: 'لا، يفيدك في:',
          bullets: [
            'فهم نفسك',
            'علاقاتك',
            'تواصلك',
            'قراراتك',
            'وطريقة إدارتك لحالتك الداخلية',
          ],
        },
        {
          question: 'ما الفرق بينه وبين برامج التطوير العادية؟',
          answer:
            'أنه لا يكتفي بإعطائك نصائح أو تحفيز، بل يعطيك نموذجًا وأدوات عملية لفهم وتغيير البنية الداخلية للخبرة.',
        },
      ],
    },
    final_cta: {
      heading: 'ابدأ رحلة فهم وإعادة برمجة عالمك الداخلي الآن',
      intro: 'إذا كنت مستعدًا أن:',
      bullets: [
        'تفهم كيف يعمل عقلك',
        'تغيّر الأنماط التي لا تخدمك',
        'تطور تواصلك وتأثيرك',
        'وتبني أدوات عملية للتغيير في حياتك أو مع عملائك',
      ],
      closing: 'فربما يكون برنامج NLP هو الخطوة التي تحتاجها الآن.',
      button: 'احجز مكانك في البرنامج',
    },
    purchase: {
      target: 'nlp',
    },
    display: {
      flow_to: 'إلى',
      not_found_title: 'البرنامج غير موجود',
      not_found_body: 'البرنامج الذي تبحث عنه غير متاح.',
      not_found_back: 'العودة إلى البرامج',
    },
  },
];

const PROGRAMS_DETAILS_EN = [
  {
    slug: 'nlp',
    seo: {
      title: 'NLP | Neuro-Linguistic Programming | Dr. Rana Mosaad',
      description:
        'Neuro-Linguistic Programming is a practical training program that helps you understand how you think, how you create meaning, how your responses and emotions are formed, and how you can reprogram your internal patterns to achieve stronger communication, greater confidence, and clearer results in your life and work.',
    },
    hero: {
      eyebrow: 'NLP | Neuro-Linguistic Programming',
      title: 'Understand how your mind works… and learn how to reprogram it in your favor',
      supporting_line:
        'A journey to understand how your mind works… and how to consciously change your thoughts, emotions, and behavior',
      description:
        'Neuro-Linguistic Programming is a practical training program that helps you understand how you think, how you create meaning, how your responses and emotions are formed, and how you can reprogram your internal patterns to achieve stronger communication, greater confidence, and clearer results in your life and work.',
      primary_cta: 'Reserve Your Spot in the Program',
      secondary_cta: 'Explore the Program',
    },
    pain: {
      heading: "Does This Sound Like What You're Experiencing?",
      intro: 'Perhaps you:',
      bullets: [
        'Your thoughts keep repeating the same patterns, and you do not know how to stop them.',
        'You react quickly or find it difficult to manage your internal state.',
        'You find yourself in situations you could have handled better if you had been more aware of yourself.',
        'Sometimes you know what you want… but you do not know how to get your mind to support you in reaching it.',
        'You find it difficult to influence, persuade, or build strong communication with others.',
        'You experience habits or automatic responses that no longer serve you.',
        'You want to understand how your mind, language, and emotions work so you can lead them instead of being led by them.',
      ],
      closing: [
        'And here, the problem is not only in the circumstances…',
        'It is also in the way your internal programming is working right now.',
      ],
    },
    importance: {
      heading: 'Why Is NLP Important?',
      paragraphs: [
        'Because many people live their lives with a mind that operates automatically…',
        'Through old beliefs, repeated responses, and patterns they never consciously chose.',
      ],
      loop: [
        'They think in the same way…',
        'So they feel in the same way…',
        'They act in the same way…',
      ],
      loop_question: "Then they wonder: why aren't the results changing?",
      bridge: ['NLP opens this inner world for you.', 'It teaches you how to:'],
      bullets: [
        'Understand the structure of your internal experience.',
        'Notice how you create your internal state.',
        'Change what no longer serves you.',
        'Build new patterns that support you in communication, confidence, achievement, and change.',
      ],
      simplified_label: 'Put simply:',
      closing: [
        'If you want to change your life…',
        'You first need to understand how your language, thoughts, and internal state work from within.',
      ],
    },
    transformation: {
      heading: 'What Will the NLP Program Give You?',
      intro: 'This program helps you move from:',
      flows: [
        { from: 'automatic reactions', to: 'awareness and choice' },
        { from: 'inner distraction', to: 'clarity of thought' },
        { from: 'language that weakens you', to: 'language that supports you' },
        { from: 'old patterns', to: 'new, more effective responses' },
        {
          from: 'ordinary communication',
          to: 'more influential and understanding communication',
        },
        {
          from: 'external leadership alone',
          to: 'deeper leadership of yourself and others',
        },
      ],
      simplified_label: 'Put simply:',
      closing: [
        'You will understand how your mind works…',
        'And you will learn how to use it in your favor instead of remaining trapped by your old programming.',
      ],
    },
    audience: {
      heading: 'Who Is This Program Designed For?',
      intro: 'This program is right for you if you:',
      bullets: [
        'Want to understand yourself and others more deeply.',
        'Want practical tools for personal change, communication, and influence.',
        'Work as a trainer, therapist, leader, business owner, or professional who works with people.',
        'Want to develop your skills in communication, persuasion, and building rapport.',
        'Want to learn how to manage your internal state more effectively.',
        'Are looking for an applied methodology that helps you change patterns rather than simply understand them.',
        'Want to use NLP with yourself or with your clients professionally.',
      ],
      not_for: {
        heading: 'Who Is This Program Not For?',
        intro: 'This program may not be right for you if you:',
        bullets: [
          'Are only looking for theoretical content without application.',
          'Want results without practice or training.',
          'Are unwilling to examine your current patterns or ways of thinking.',
          'Are looking for temporary motivation rather than building a real skill.',
        ],
      },
    },
    curriculum: {
      heading: "What You'll Learn Inside the NLP Program",
      modules: [
        {
          order: 1,
          heading: 'How the Mind and Internal Experience Work',
          body: 'You will understand how people create their experience internally:\nthrough images, sounds, sensations, and language.',
        },
        {
          order: 2,
          heading: 'Managing Your Internal State',
          body: 'You will learn how your internal state affects:',
          bullets: [
            'Your decisions',
            'Your communication',
            'Your performance',
            'Your reactions',
          ],
          closing: 'And how to consciously change that state.',
        },
        {
          order: 3,
          heading: 'Language and Its Influence on the Mind',
          body: 'You will discover how words shape meaning,\n\nand how language can:',
          bullets: [
            'Limit you',
            'Or free you',
            'Weaken you',
            'Or give you greater strength and influence',
          ],
        },
        {
          order: 4,
          heading: 'Building Rapport and Influential Communication',
          body: 'You will learn how to build a stronger connection with others,\n\nunderstand their ways of thinking and communicating,\n\nand communicate with them with greater flexibility and influence.',
        },
        {
          order: 5,
          heading: 'Changing Mental and Behavioral Patterns',
          body: 'You will learn how to identify patterns that no longer serve you,\n\nand how to begin reprogramming them into more effective patterns.',
        },
        {
          order: 6,
          heading: 'Beliefs and Values',
          body: 'You will understand how your beliefs and values affect your choices,\n\nand how to change the ones that hold you back in an intelligent and practical way.',
        },
        {
          order: 7,
          heading: 'Anchoring & State Management',
          body: 'You will learn how to connect internal states with specific triggers,\n\nand how to access useful states such as:',
          bullets: ['Confidence', 'Calm', 'Presence', 'Focus'],
        },
        {
          order: 8,
          heading: 'Reframing',
          body: 'You will learn how to change the frame through which you see a situation,\n\nand therefore change its meaning and its effect on you.',
        },
        {
          order: 9,
          heading: 'Strategies',
          body: 'You will understand how the mind builds its internal strategies,\n\nsuch as:',
          bullets: [
            'Decision-making',
            'Motivation',
            'Procrastination',
            'Learning',
            'Creativity',
          ],
          closing: 'And you will learn how to change these strategies in your favor.',
        },
        {
          order: 10,
          heading: 'Modeling Excellence',
          body: 'One of the most powerful aspects of NLP:\n\nlearning how to notice the structure of excellence in others,\n\nthen extract it and use it to develop yourself.',
        },
      ],
    },
    differentiator: {
      heading: 'What Makes the NLP Program Different?',
      intro_before: 'Because this program does not simply tell you:',
      quotes: ['“Think positively”', '“Be more confident”'],
      quote_connector: 'or',
      intro_after: [
        'Instead, it teaches you how the state is formed in the first place',
        'and how to change its structure from within.',
      ],
      supporting_heading: 'What makes it different?',
      bullets: [
        'A practical program, not simply theoretical content.',
        'It helps you understand mind, language, and behavior together.',
        'It provides tools for personal change, communication, and influence.',
        'It benefits you personally and professionally.',
        'It can be used with yourself or with others.',
        'It combines awareness, practice, and practical application.',
      ],
    },
    results: {
      heading: 'What Results Can You Expect After This Program?',
      intro: 'After this journey, you can expect to notice:',
      bullets: [
        'Greater awareness of the way you think.',
        'A deeper understanding of your internal state.',
        'A better ability to manage your thoughts and emotions.',
        'Stronger communication and influence skills.',
        'Greater flexibility in dealing with different situations.',
        'Clearer awareness of your beliefs, values, and patterns.',
        'A greater ability to create change instead of remaining in repetition.',
        'Practical tools you can use with yourself or with your clients.',
      ],
    },
    why_choose: {
      heading: 'Why Do People Learn NLP in the First Place?',
      intro: 'Because they want to:',
      bullets: [
        'Understand themselves more deeply.',
        'Communicate more effectively.',
        'Change the patterns that hold them back.',
        'Influence with greater awareness.',
        'Use practical tools in training, coaching, leadership, or life.',
      ],
      closing: [
        'NLP is not simply knowledge about the mind…',
        'It is a practical way to learn how to work with your mind more intelligently.',
      ],
    },
    trainer: {
      heading: 'Who Guides You on This Journey?',
      subheading: 'About Dr. Rana Mosaad',
      paragraphs: [
        'I am Dr. Rana Mosaad, and I present this program as a practical journey that helps you understand how your inner world works and how to reprogram your mental, emotional, and behavioral patterns with greater awareness.',
        'My goal is not simply to give you concepts…',
        'But to give you tools you can use:',
      ],
      bullets: ['With yourself', 'In your life', 'In your work', 'With your clients'],
      closing: [
        'So understanding turns into change…',
        'And change turns into real results.',
      ],
    },
    faq: {
      heading: 'Frequently Asked Questions',
      items: [
        {
          question: 'Is NLP suitable for me if I am a beginner?',
          answer:
            'Yes. When it is presented in a clear and structured way, it is highly suitable for beginners as well as professionals.',
        },
        {
          question: 'Is the program practical or theoretical?',
          answer:
            'NLP is highly practical by nature, and its real value appears in application, not only in understanding.',
        },
        {
          question: 'Can I use it with clients?',
          answer:
            'Yes. Many trainers, coaches, and leaders use NLP as a powerful tool for communication and change.',
        },
        {
          question: 'Will it only benefit me at work?',
          answer_intro: 'No. It can benefit you in:',
          bullets: [
            'Understanding yourself',
            'Your relationships',
            'Your communication',
            'Your decisions',
            'The way you manage your internal state',
          ],
        },
        {
          question: 'How is it different from ordinary personal development programs?',
          answer:
            'It does not simply give you advice or motivation. It gives you a model and practical tools for understanding and changing the internal structure of experience.',
        },
      ],
    },
    final_cta: {
      heading:
        'Start Your Journey of Understanding and Reprogramming Your Inner World Now',
      intro: 'If you are ready to:',
      bullets: [
        'Understand how your mind works.',
        'Change the patterns that no longer serve you.',
        'Develop your communication and influence.',
        'Build practical tools for change in your own life or with your clients.',
      ],
      closing: 'Then the NLP program may be the step you need right now.',
      button: 'Reserve Your Spot in the Program',
    },
    purchase: {
      target: 'nlp',
    },
    display: {
      flow_to: 'to',
      not_found_title: 'Program not found',
      not_found_body: 'The program you are looking for is not available.',
      not_found_back: 'Back to programs',
    },
  },
];

const bySlug = {
  ar: Object.fromEntries(PROGRAMS_DETAILS_AR.map((item) => [item.slug, item])),
  en: Object.fromEntries(PROGRAMS_DETAILS_EN.map((item) => [item.slug, item])),
};

/** Slugs that use the new rich programs-details template. */
export const PROGRAM_NEW_TEMPLATE_SLUGS = new Set(
  PROGRAMS_DETAILS_AR.map((item) => item.slug),
);

export function usesRichProgramTemplate(slug) {
  return PROGRAM_NEW_TEMPLATE_SLUGS.has(slug);
}

/** Alias kept for call-site clarity. */
export function usesProgramNewTemplate(slug) {
  return usesRichProgramTemplate(slug);
}

export function getProgramDetailPage(slug) {
  return usesRichProgramTemplate(slug)
    ? 'programs-details.html'
    : 'program-detail.html';
}

export function getProgramDetailBySlug(slug, locale = 'ar') {
  if (!slug) return undefined;
  const resolved = locale === 'en' ? 'en' : 'ar';
  return bySlug[resolved][slug] ?? bySlug.ar[slug];
}

export function getProgramDetails(locale = 'ar') {
  const resolved = locale === 'en' ? 'en' : 'ar';
  return PROGRAMS_DETAILS_AR.map((arRecord) => {
    const enRecord = bySlug.en[arRecord.slug];
    if (resolved === 'en' && enRecord) return enRecord;
    return arRecord;
  });
}
