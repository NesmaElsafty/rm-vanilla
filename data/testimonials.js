export const TESTIMONIAL_ENTITY_LINKS = {
  'test-4': { relatedSlug: 'apg' },
  'test-5': { relatedSlug: 'apg' },
  'test-6': { relatedSlug: 'apg' },
  'test-7': { relatedSlug: 'apg' },
  'test-8': { relatedSlugs: ['i-am-female', 'apg', 'nlp'], showOnHome: true },
  'test-9': { relatedSlug: 'new-version-of-yourself' },
  'test-10': { relatedSlug: 'mottasel' },
  'test-11': { relatedSlug: 'apg' },
  'test-12': { relatedSlugs: ['i-am-female', 'apg'] },
  'test-13': { relatedSlug: 'mottasel' },
  'test-14': { showOnHome: true },
  'test-15': { showOnHome: true },
  'test-16': { relatedSlug: 'i-am-female' },
  'test-17': { relatedSlug: 'mottasel' },
  'test-18': { relatedSlug: 'you-first' },
  'test-19': { relatedSlug: 'self-confidence' },
  'test-20': { relatedSlug: 'emotional-management-secret' },
  'test-21': { relatedSlug: 'new-version-of-yourself' },
  'test-22': { relatedSlug: 'mottasel' },
  'test-23': { showOnHome: true },
};

export const testimonials = [
  {
    id: 'test-8',
    image: 'assets/images/testimonials/hajar-ait-nasser.png',
    rating: 5,
    name: { ar: 'هاجر ايت ناصر', en: 'Hajar Ait Nasser' },
    role: { ar: 'مهندسة ومدربة · المغرب', en: 'Engineer & Trainer · Morocco' },
    content: {
      ar: 'خضت مع رنا دورات كثيرة: أنا أنثى، ديتوكس، APG وحاليا NLP وكذلك حصص كوتشينغ شخصية. الجميل في رنا هي سلاسة الشرح وعمق التعبير الذي يوصل الفكرة والمفهوم بوضوح وعمق. قدرة رنا على الاتصال خطيرة وهي تعطي حسب ما أنت تحتاجه بالضبط كأنها تفهمك على طول ماذا تريد وماذا تحتاج وهذه سمة نادرة عند الكثير من الكوتشز. في الجلسات بتحس رنا بتخاطب الروح مباشرة دون واسطات وهذا ما يجعل الأثر مضاعف. كل التوفيق لكِ يا أحلى كوتش ومرشد.',
      en: "I have taken many courses with Rana: I Am Female, Detox, APG, and currently NLP, as well as private coaching sessions. What is beautiful about Rana is the smoothness of her explanation and the depth of expression that conveys ideas and concepts with clarity and depth. Rana's ability to connect is remarkable — she gives you exactly what you need, as if she instantly understands what you want and what you need, and that is a rare quality among many coaches. In sessions, you feel Rana speaks directly to the soul without intermediaries, and that is what multiplies the impact. All the best to you, the most wonderful coach and guide.",
    },
    programTaken: { ar: 'أنا أنثى، APG، NLP', en: 'I Am Female, APG, NLP' },
    showOnHome: true,
  },
  {
    id: 'test-9',
    image: 'assets/images/testimonials/wissam-sami-mohamed.png',
    rating: 5,
    name: { ar: 'وسام سامى محمد', en: 'Wissam Sami Mohamed' },
    role: {
      ar: 'مصر، القاهرة',
      en: 'Cairo, Egypt',
    },
    content: {
      ar: 'برنامج يعيد صياغة <span class="text-gold-gradient">صورتك الذهنية اللاوعية</span> عن نفسك إلى صورة مضيئة وأكثر إشراقًا مما يغذّي <span class="text-gold-gradient">شعور الثقة بالنفس والطمأنينة</span> تجاه القادم، ويساعدك على اجتذاب فرص أفضل وعلاقات أرقى وأكثر وعيًا تناسب مساحة الاستقبال الخاصة بنسختك المنشودة.',
      en: 'A program that reshapes your <span class="text-gold-gradient">unconscious mental image of yourself</span> into a brighter, more radiant one — which nourishes <span class="text-gold-gradient">self-confidence and peace</span> toward what is coming, and helps you attract better opportunities and more conscious, refined relationships that match the receptivity of the version of you that you seek.',
    },
    programTaken: { ar: 'النسخة الجديدة من نفسك', en: 'The New Version of Yourself' },
    showOnHome: false,
  },
  {
    id: 'test-10',
    image: 'assets/images/testimonials/wissam-sami-mohamed.png',
    rating: 5,
    name: { ar: 'وسام سامى محمد', en: 'Wissam Sami Mohamed' },
    role: {
      ar: 'مدير عام مساعد بالهيئة المصرية العامة للبترول · مصر، القاهرة',
      en: 'Assistant General Manager, Egyptian General Petroleum Authority · Cairo, Egypt',
    },
    content: {
      ar: 'هو برنامج لإعادة الاتصال مع المصدر، وإلقاء الضوء على المفاهيم المغلوطة وتنقيح الأفكار والمعتقدات المعيقة والمقيدة في طريق الاتصال بالله، وتصحيح الصورة الذهنية عن الإله وإعادة تفسير بعض النصوص الدينية من القرآن وكتب التراث والموروثات بشكل واعٍ.',
      en: 'A program for reconnecting with the Source — shedding light on distorted concepts, refining limiting beliefs that block connection with God, correcting the mental image of the Divine, and reinterpreting selected religious texts from the Quran, heritage literature, and traditions with awareness.',
    },
    programTaken: { ar: 'متصل', en: 'Mottasel' },
    showOnHome: false,
  },
  {
    id: 'test-11',
    image: 'assets/images/testimonials/wissam-sami-mohamed.png',
    rating: 5,
    name: { ar: 'وسام سامى محمد', en: 'Wissam Sami Mohamed' },
    role: {
      ar: 'مدير عام مساعد بالهيئة المصرية العامة للبترول · مصر، القاهرة',
      en: 'Assistant General Manager, Egyptian General Petroleum Authority · Cairo, Egypt',
    },
    content: {
      ar: 'هو برنامج لا غنى عنه لأي مدرب متخصص في مجال الكوتشينج، ويعد من أهم مزايا البرنامج هو سهولة التطبيق مع النتائج الواضحة والسريعة المذهلة، كما يمنحك أدوات متنوعة تشمل تقريبًا جميع المجالات التي يعاني منها العملاء واستخدام الأداة المناسبة لكل حالة من البرنامج.',
      en: 'An indispensable program for any coach specializing in coaching. One of its greatest strengths is how easy it is to apply, with clear and remarkably fast results. It gives you diverse tools that cover nearly every area clients struggle with, so you can choose the right tool for each case from the program.',
    },
    programTaken: { ar: 'APG', en: 'APG' },
    showOnHome: false,
  },
  {
    id: 'test-12',
    image: 'assets/images/testimonials/bashayer-karim.png',
    rating: 5,
    name: { ar: 'بشائر كريم', en: 'Bashaer Kareem' },
    role: {
      ar: 'العراق',
      en: 'Iraq',
    },
    content: {
      ar: 'أخذت تقريبًا أكثر من كورس مع دكتورة رنا ومن أبرزها أنا أنثى وبرنامج APG. كان تأثيرهم على حياتي عظيم؛ عرفت أتعامل مع مشاعري وأديرها، قدرت <span class="text-gold-gradient">أستعيد ملكيتي لنفسي وقيادة ذاتي</span>، عرفت <span class="text-gold-gradient">إمكانياتي وقيمتي كإنسان</span>. ودكتورة رنا من أكثر المدربين اللي أثق بيهم وبمعلوماتهم؛ حقيقية وصادقة بطرح المعلومة وأسلوبها سهل ومنظم. أشكر نفسي إني اخترت تكون مدربتي وأتطور من خلال ما تقدمه.',
      en: 'I took more than one course with Dr. Rana, most notably I Am Woman and the APG program. Their impact on my life was immense; I learned how to work with my emotions and manage them, I <span class="text-gold-gradient">reclaimed ownership of myself and self-leadership</span>, and I came to know my <span class="text-gold-gradient">potential and my worth as a human being</span>. Dr. Rana is one of the trainers I trust most, in who she is and in her knowledge; she is genuine and honest in how she shares, and her style is clear and organized. I thank myself for choosing her as my coach and for growing through what she offers.',
    },
    programTaken: { ar: 'أنا أنثى، APG', en: 'I Am Female, APG' },
    showOnHome: false,
  },
  {
    id: 'test-13',
    image: 'assets/images/programs/program-mottasel.png',
    rating: 5,
    name: { ar: 'سلمي الشعراوي', en: 'Salma El-Shaarawi' },
    role: { ar: 'صاحبة بزنس للأكل الصحي · مصر', en: 'Healthy Food Business Owner · Egypt' },
    content: {
      ar: 'أخذت برنامج متصل... متصل هو بوابة للاتصال بالله، لأنه اشتغل معايا على تصحيح مفاهيم مغلوطة كتير. برنامج رائع جداً 🙏',
      en: 'I took the Mottasel program... Mottasel is a gateway to connection with Allah, because it worked with me on correcting so many distorted concepts. A truly wonderful program 🙏',
    },
    programTaken: { ar: 'متصل', en: 'Mottasel' },
    showOnHome: false,
  },
  {
    id: 'test-14',
    image: 'assets/images/floating/motmain-icon.png',
    rating: 5,
    name: { ar: 'سلمي الشعراوي', en: 'Salma El-Shaarawi' },
    role: { ar: 'صاحبة بزنس للأكل الصحي · مصر', en: 'Healthy Food Business Owner · Egypt' },
    content: {
      ar: 'مطمئن هو جروب مجاني... بس رحلتي علمتني أن المجاني ده فيه كنوز وده اللي بيحصل في مطمئن 💖',
      en: 'Motmain is a free group... but my journey taught me that what is free can hold treasures, and that is exactly what happens in Motmain 💖',
    },
    programTaken: { ar: 'مطمئن', en: 'Motmain' },
    showOnHome: true,
  },
  {
    id: 'test-15',
    image: 'assets/images/testimonials/mervat-galal.png',
    rating: 5,
    name: { ar: 'ميرفت جلال', en: 'Mervat Galal' },
    role: { ar: 'ربة منزل', en: 'Homemaker' },
    content: {
      ar: 'درست مع د. رنا كورس أنا أنثى وكورس الثقة بالنفس وبرنامج ديتوكس وبرنامج متصل ومبادرة مطمئن كل جمعة. د. رنا من أكثر المدربين المؤثرين فعلاً؛ كل كورس ترك <span class="text-gold-gradient">بصمات قوية في حياتي</span> وغيّرني ولله الحمد <span class="text-gold-gradient">تغييراً جذرياً</span>. شكراً لعطائك وخبرتك وتنظيمك وسلاسة أسلوبك وصدقك في كل كلمة، شكراً من القلب ❤️ ❤️',
      en: 'I studied with Dr. Rana the I Am Woman course, the self-confidence course, the Detox program, the Connected program, and the Mutma\'en Friday initiative. Dr. Rana is truly one of the most impactful trainers; every course left a <span class="text-gold-gradient">strong mark on my life</span> and, thank God, changed me at the <span class="text-gold-gradient">root</span>. Thank you for your giving, your expertise, your organization, the ease of your style, and your honesty in every word — thank you from the heart ❤️ ❤️',
    },
    programTaken: {
      ar: 'أنا أنثى، الثقة بالنفس، ديتوكس، متصل، مطمئن',
      en: 'I Am Female, Self-Confidence, Detox, Mottasel, Motmain',
    },
    showOnHome: true,
  },
  {
    id: 'test-16',
    image: 'assets/images/testimonials/afnan-mohamed.png',
    rating: 5,
    name: { ar: 'أفنان محمد', en: 'Afnan Mohamed' },
    role: { ar: 'سيلز · مصر', en: 'Sales · Egypt' },
    content: {
      ar: 'برنامج أنا أنثى، نسخته الأولى، وبالنسبة لي كانت <span class="text-gold-gradient">نقلة في التواصل مع نفسي</span> ومع أنوثتي واتحاد الذكورة جوايا والتوازن ما بينهم 😍',
      en: 'The I Am Woman program, its first edition — for me it was a <span class="text-gold-gradient">shift in how I communicate with myself</span>, with my femininity, and with the masculine within me, and the balance between them 😍',
    },
    programTaken: { ar: 'أنا أنثى', en: 'I Am Female' },
    showOnHome: false,
  },
  {
    id: 'test-17',
    image: 'assets/images/testimonials/afnan-mohamed.png',
    rating: 5,
    name: { ar: 'أفنان محمد', en: 'Afnan Mohamed' },
    role: { ar: 'سيلز · 28 سنة · من مصر', en: 'Sales · 28 · Egypt' },
    content: {
      ar: 'برنامج متصل وده كان الشفاء ليا، وكان ليه دور فعال حقيقي في تغيير معتقداتي وتقوية عضلة التسليم لله عندي.',
      en: 'The Mottasel program was healing for me. It played a real, active role in changing my beliefs and strengthening my surrender to Allah.',
    },
    programTaken: { ar: 'متصل', en: 'Mottasel' },
    showOnHome: false,
  },
  {
    id: 'test-18',
    image: 'assets/images/testimonials/afnan-mohamed.png',
    rating: 5,
    name: { ar: 'أفنان محمد', en: 'Afnan Mohamed' },
    role: { ar: 'سيلز · 28 سنة · من مصر', en: 'Sales · 28 · Egypt' },
    content: {
      ar: 'ورشة أنت أولًا، ودي كانت من أجمل الورش اللي فيها تعبير عن الذات وتظبيط الحدود بالنسبة لي.',
      en: 'The You First workshop was one of the most beautiful workshops for self-expression and setting boundaries, for me.',
    },
    programTaken: { ar: 'أنت أولًا', en: 'You First' },
    showOnHome: false,
  },
  {
    id: 'test-19',
    image: 'assets/images/testimonials/afnan-mohamed.png',
    rating: 5,
    name: { ar: 'أفنان محمد', en: 'Afnan Mohamed' },
    role: { ar: 'سيلز · 28 سنة · من مصر', en: 'Sales · 28 · Egypt' },
    content: {
      ar: 'ميني كورس الثقة بالنفس، وده أول معرفة لي بمعنى القوى الذاتية وإزاي مفاتيحي تكون في إيدي.',
      en: 'The self-confidence mini course was my first introduction to what personal power really means — and how the keys can be in my own hands.',
    },
    programTaken: { ar: 'كورس الثقة بالنفس', en: 'Self-Confidence Course' },
    showOnHome: false,
  },
  {
    id: 'test-20',
    image: 'assets/images/testimonials/afnan-mohamed.png',
    rating: 5,
    name: { ar: 'أفنان محمد', en: 'Afnan Mohamed' },
    role: { ar: 'سيلز · 28 سنة · من مصر', en: 'Sales · 28 · Egypt' },
    content: {
      ar: 'ورشة المشاعر كان لها عمق كبير، واكتشفت إن الشعور ده رسول جاي برسالة، ودوري إني أستقبلها وأسيبه يمشي، وإزاي عقلي مليان صور مبنية ممكن متكنش أصلاً حقيقية.',
      en: 'The emotions workshop had great depth. I discovered that a feeling is a messenger carrying a message — my role is to receive it and let it pass. I also saw how my mind can be full of constructed images that may not even be real.',
    },
    programTaken: { ar: 'سر إدارة المشاعر', en: 'The Secret of Emotional Management' },
    showOnHome: false,
  },
  {
    id: 'test-21',
    image: 'assets/images/testimonials/fadia-bdour.png',
    rating: 5,
    name: { ar: 'فاديا بدور', en: 'Fadia Bdour' },
    role: { ar: 'محامية · سوريا', en: 'Lawyer · Syria' },
    content: {
      ar: 'أخذت كورس النسخة الجديدة من نفسك، وهو عرّفني إني أكون مسؤولة مسؤولية كاملة عن أفكاري ومشاعري وردود أفعالي، وكمان أحدد النسخة الجديدة مني بوضوح وتركيز من خلال تحديد أنا فين حالياً.',
      en: 'I took The New Version of Yourself course. It taught me to take full responsibility for my thoughts, emotions, and reactions — and to define my new self with clarity and focus by understanding where I am right now.',
    },
    programTaken: { ar: 'النسخة الجديدة من نفسك', en: 'The New Version of Yourself' },
    showOnHome: false,
  },
  {
    id: 'test-22',
    image: 'assets/images/testimonials/fadia-bdour.png',
    rating: 5,
    name: { ar: 'فاديا بدور', en: 'Fadia Bdour' },
    role: { ar: 'محامية · سوريا', en: 'Lawyer · Syria' },
    content: {
      ar: 'كمان أخذت كورس متصل، تحس فيه قرب من نفسك أكثر وتسمع فيه صوت روحك أكثر، وتلمس من خلال ذلك لحظة اتصال وقرب من خالق الوجود أكثر وأكثر.',
      en: 'I also took the Mottasel course. You feel closer to yourself, hear the voice of your soul more clearly, and through that touch moments of connection and nearness to the Creator of existence — more and more.',
    },
    programTaken: { ar: 'متصل', en: 'Mottasel' },
    showOnHome: false,
  },
  {
    id: 'test-23',
    image: 'assets/images/testimonials/fadia-bdour.png',
    rating: 5,
    name: { ar: 'فاديا بدور', en: 'Fadia Bdour' },
    role: { ar: 'محامية · سوريا', en: 'Lawyer · Syria' },
    content: {
      ar: 'مبادرة مطمئن المجانية رااااائعة وفيها صدق من القلب كعادة الدكتورة رنا 💚💚💚',
      en: 'The free Motmain initiative is wonderful — full of heartfelt sincerity, as is always the case with Dr. Rana 💚💚💚',
    },
    programTaken: { ar: 'مطمئن', en: 'Motmain' },
    showOnHome: true,
  },
  {
    id: 'test-4',
    image: 'assets/images/testimonials/apg-feedback-rana-1.png',
    rating: 5,
    name: { ar: 'مشاركة من برنامج APG', en: 'APG Program Participant' },
    role: { ar: 'متدربة في APG', en: 'APG Trainee' },
    content: {
      ar: 'رحلتي مع دكتوره رنا كانت نقطة تحول… تعلمت أسمع لنفسي، أوقف صوت الخوف، وأرجع لنسختي المتوازنة اللي فيها أنوثة وصدق ونور. الكورس فتحلي باب جديد لأكون أقرب لنفسي… وأهدى… وأقوى. فعلا بجد فرق معيه جدا بحبك يا رنا',
      en: 'My journey with Dr. Rana was a turning point. I learned to listen to myself, silence fear, and return to my balanced self with femininity, truth, and light. This course opened a new door for me to feel closer to myself, calmer, and stronger. It truly made a huge difference.',
    },
    programTaken: { ar: 'APG', en: 'APG' },
    showOnHome: false,
  },
  {
    id: 'test-5',
    image: 'assets/images/testimonials/apg-feedback-rana-2.png',
    rating: 5,
    name: { ar: 'مشاركة من برنامج APG', en: 'APG Program Participant' },
    role: { ar: 'متدربة في APG', en: 'APG Trainee' },
    content: {
      ar: 'انا كل مرة اقف مبهورة أمام طريقة عمل الدكتورة رنا وإلي تُمررها إلينا من خلال الأدوات والتطبيقات التي بنعمل عليها: بساطة، عمق، سهولة، تطور.. تسترجع ملكية أفكارك ومشاعرك وسلوكياتك.. تِطَلّع المعتقدات العميقة التي تشتغل في الخفاء وتمكنا من اكتشاف نسخ مننا، ما كنا نظن انها اصلا موجودة فينا من قوة، وعزيمة وقدرات هائلة، تزيد تَمَيٌز في نقط القوة، وتضعف من الاشياء التي تعيق تطورك... تحس مباشرة بعد التطبيق بقفزة نوعية وبسرعة والجميل انه كل دا يتم بطريقة سلسة وممتعة. شكرا جزيلا دكتورة رنا لسخاء عطائك وعلى كل مجهوداتك 🤍',
      en: "Every time I am amazed by Dr. Rana's method and how she delivers it through the tools and applications we practice: simplicity, depth, ease, and growth. You regain ownership of your thoughts, feelings, and behaviors. It reveals deep beliefs working in the background and helps us discover versions of ourselves we never thought existed - full of strength, determination, and huge capabilities. It amplifies your strengths and weakens what blocks your growth. You feel an immediate qualitative leap after applying it, and the beautiful part is that all of this happens in a smooth and enjoyable way. Thank you so much, Dr. Rana, for your generous giving and all your efforts.",
    },
    programTaken: { ar: 'APG', en: 'APG' },
    showOnHome: false,
  },
  {
    id: 'test-6',
    image: 'assets/images/testimonials/apg-feedback-rana-3.png',
    rating: 5,
    name: { ar: 'مشاركة من برنامج APG', en: 'APG Program Participant' },
    role: { ar: 'متدربة في APG', en: 'APG Trainee' },
    content: {
      ar: 'كورس عظيم وعميق ومعلوماته ثريه. ساعدني أكون القائد والمتحكم في أفكاري وعرفت كيف اتعامل مع مشاعري وساعدني اغير عادات ومعتقدات غيرني انا شخصيًا صرت انسانه متزنه أعرف اوازن مشاعري ردود افعالي. طبعًا دكتورة رنا طريقة تقديمها للمعلومه وكيف تبسطها وتجعلها أسهل وتسهل علينا التطبيق من خلال تنظيمها في الطرح ومنهجية التطبيق ومتابعتها لينا. شكرًا وممتنه من قلبي لدكتورة رنا',
      en: "A great and deeply enriching course. It helped me become the leader of my thoughts, understand how to deal with my emotions, and change habits and beliefs that transformed me personally. I became more balanced and better able to regulate my emotions and reactions. Dr. Rana's way of presenting information is clear and simple, making application much easier through organized delivery, practical methodology, and continuous follow-up. I am truly grateful from my heart.",
    },
    programTaken: { ar: 'APG', en: 'APG' },
    showOnHome: false,
  },
  {
    id: 'test-7',
    image: 'assets/images/testimonials/apg-feedback-rana-4.png',
    rating: 5,
    name: { ar: 'مشاركة من برنامج APG', en: 'APG Program Participant' },
    role: { ar: 'متدربة في APG', en: 'APG Trainee' },
    content: {
      ar: 'تعلمنا بكورس كيف نغير معتقداتنا السلبيه الى ايجابيه بسهوله وبطرق شتى، وبتغير مشاعرنا وسلوكياتنا وتغير الافكار والسيطره عليها. لانه الدكتوره رنا وروحها الجميل تعطينا المعلومات من تطبيقها وتجاربها لهذه الطرق فتأثير المعلومه وتطبيقها سهله. بتصير تستنى المحاضره بفارغ الصبر من جمال المحاضره وبتخلص بسرعه. اتعلمنا نمسك الريموت حتى في المشاعر والافكار والسلوكيات لهذا اسمه فن قيادة الذات فكانت هذه الفكره من قبل مستحيل بعد هذة الدوره لا توجد مستحيل. فعند فهمنا نفسنا انه نحن المسؤولين عن حياتنا وكل هذه التغيرتنبع من نفسنا من الداخل نستطيع تغيرها لا احد يستطيع السيطره علينا. فهذه الدوره غيرت من حياتي الى افضل نسخه',
      en: 'In this course, we learned how to change negative beliefs into positive ones in simple and multiple ways, and how to shift our feelings, behaviors, thoughts, and control them. Dr. Rana, with her beautiful spirit, teaches from real application and experience, so the impact of the knowledge and applying it becomes easy. You find yourself waiting eagerly for each lecture because of how valuable and enjoyable it is. We learned to hold the remote even over emotions, thoughts, and behaviors - that is why it is called the art of self-leadership. What once felt impossible no longer feels impossible after this course. When we understand ourselves, we realize we are responsible for our lives, and these changes come from within. This course changed my life to a better version.',
    },
    programTaken: { ar: 'APG', en: 'APG' },
    showOnHome: false,
  },
];

function resolveTestimonialLink(t) {
  const mapped = TESTIMONIAL_ENTITY_LINKS[t.id] || {};
  return {
    relatedSlug: t.relatedSlug ?? mapped.relatedSlug,
    relatedSlugs: t.relatedSlugs ?? mapped.relatedSlugs,
    showOnHome: t.showOnHome ?? mapped.showOnHome === true,
  };
}

export function localizeTestimonial(t, locale) {
  const loc = locale === 'en' ? 'en' : 'ar';
  const link = resolveTestimonialLink(t);
  return {
    id: t.id,
    image: t.image,
    rating: t.rating,
    name: t.name[loc] || t.name.ar,
    role: t.role[loc] || t.role.ar,
    content: t.content[loc] || t.content.ar,
    programTaken: t.programTaken[loc] || t.programTaken.ar,
    showOnHome: link.showOnHome,
    relatedSlug: link.relatedSlug,
    relatedSlugs: link.relatedSlugs,
  };
}

export function getHomepageTestimonials(locale) {
  // Homepage shows the full transformation-stories set (showOnHome is retained in data for other uses).
  return testimonials.map((t) => localizeTestimonial(t, locale));
}

export function getTestimonialsForSlug(slug, locale) {
  return testimonials
    .filter((t) => {
      const link = resolveTestimonialLink(t);
      return link.relatedSlug === slug || (link.relatedSlugs && link.relatedSlugs.includes(slug));
    })
    .map((t) => localizeTestimonial(t, locale));
}
