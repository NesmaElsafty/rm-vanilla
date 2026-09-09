import fs from 'fs';

const path = 'programs-practical-details.html';
let html = fs.readFileSync(path, 'utf8');

html = html
  .replace(
    /<title>[\s\S]*?<\/title>/,
    '<title>كورس الثقة بالنفس | Dr. Rana Mosaad</title>',
  )
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="٥ خطوات للتحرر من الشك الداخلي، والوصول للثقة بالنفس.">',
  )
  .replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="كورس الثقة بالنفس | Dr. Rana Mosaad">',
  )
  .replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="٥ خطوات للتحرر من الشك الداخلي، والوصول للثقة بالنفس.">',
  )
  .replace(
    /<link rel="canonical" href="[^"]*">/,
    '<link rel="canonical" href="programs-practical-details.html?slug=self-confidence">',
  )
  .replace('class="program-spiritual-page"', 'class="program-practical-page"');

const start = html.indexOf('<main id="main-content"');
const footer = html.indexOf('<footer class="footer-luxury"');
if (start < 0 || footer < 0) throw new Error('markers missing');

const main = `    <main id="main-content" class="page-main page-main--padded">
      <div class="slide-inner">
        <div data-program-practical-root>
          <div class="program-practical-page-inner" data-ppc-found>
            <!-- 1. Hero -->
            <section class="program-practical-hero" data-reveal>
              <div class="program-practical-hero__atmosphere" aria-hidden="true">
                <span class="program-practical-hero__glow program-practical-hero__glow--media"></span>
                <span class="program-practical-hero__glow program-practical-hero__glow--copy"></span>
              </div>
              <div class="program-practical-hero__layout">
                <div class="program-practical-hero__copy">
                  <h1 class="program-practical-hero__title" data-ppc-title></h1>
                  <p class="program-practical-hero__supporting" data-ppc-supporting></p>
                  <div class="program-practical-hero__description" data-ppc-description></div>
                  <div class="program-practical-hero__actions">
                    <a class="btn-luxury-primary program-practical-hero__cta" data-ppc-primary-cta href="index.html#contact">
                      <span data-ppc-primary-cta-label></span>
                    </a>
                  </div>
                </div>
                <div class="program-practical-hero__media">
                  <div class="program-practical-hero__frame" aria-hidden="true"></div>
                  <figure class="program-practical-hero__figure">
                    <img class="program-practical-hero__image" data-ppc-hero-image src="" alt="" width="800" height="1000" decoding="async">
                  </figure>
                </div>
              </div>
            </section>

            <!-- 2. Pain -->
            <section id="program-practical-pain" class="program-practical-pain" data-reveal>
              <div class="program-practical-pain__inner">
                <h2 class="program-practical-section-title" data-ppc-pain-heading></h2>
                <p class="program-practical-intro" data-ppc-pain-intro></p>
                <ol class="program-practical-pain__list" data-ppc-pain-bullets></ol>
                <div class="program-practical-pain__closing" data-ppc-pain-closing></div>
              </div>
            </section>

            <!-- 3. Why It Matters -->
            <section class="program-practical-importance" data-reveal>
              <div class="program-practical-importance__inner">
                <h2 class="program-practical-section-title" data-ppc-importance-heading></h2>
                <p class="program-practical-intro" data-ppc-importance-opening></p>
                <ul class="program-practical-bullet-list program-practical-bullet-list--muted" data-ppc-importance-misconceptions></ul>
                <p class="program-practical-lead" data-ppc-importance-bridge></p>
                <p class="program-practical-label" data-ppc-importance-truth-label></p>
                <ul class="program-practical-bullet-list" data-ppc-importance-truth></ul>
                <div class="program-practical-importance__closing" data-ppc-importance-closing></div>
              </div>
            </section>

            <!-- 4. Transformation -->
            <section class="program-practical-transformation" data-reveal>
              <div class="program-practical-transformation__inner">
                <p class="program-practical-intro" data-ppc-transformation-intro></p>
                <ol class="program-practical-flows" data-ppc-transformation-flows></ol>
                <p class="program-practical-closing" data-ppc-transformation-closing></p>
              </div>
            </section>

            <!-- 5. Curriculum -->
            <section class="program-practical-curriculum" data-reveal>
              <div class="program-practical-curriculum__header">
                <h2 class="program-practical-section-title" data-ppc-curriculum-heading></h2>
              </div>
              <ol class="program-practical-steps" data-ppc-curriculum-steps></ol>
            </section>

            <!-- 6. Audience -->
            <section class="program-practical-audience" data-reveal>
              <div class="program-practical-audience__inner">
                <h2 class="program-practical-section-title" data-ppc-audience-heading></h2>
                <div class="program-practical-audience__grid">
                  <div class="program-practical-audience__for">
                    <p class="program-practical-intro" data-ppc-audience-intro></p>
                    <ul class="program-practical-bullet-list" data-ppc-audience-bullets></ul>
                  </div>
                  <div class="program-practical-audience__not">
                    <h3 class="program-practical-subheading" data-ppc-not-for-heading></h3>
                    <p class="program-practical-intro" data-ppc-not-for-intro></p>
                    <ul class="program-practical-bullet-list program-practical-bullet-list--muted" data-ppc-not-for-bullets></ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 7. Results -->
            <section class="program-practical-results" data-reveal>
              <div class="program-practical-results__inner">
                <h2 class="program-practical-section-title" data-ppc-results-heading></h2>
                <p class="program-practical-intro" data-ppc-results-intro></p>
                <ul class="program-practical-results__list" data-ppc-results-bullets></ul>
              </div>
            </section>

            <!-- 8. Delivery -->
            <section class="program-practical-delivery" data-reveal>
              <div class="program-practical-delivery__inner">
                <h2 class="program-practical-section-title" data-ppc-delivery-heading></h2>
                <ul class="program-practical-delivery__list" data-ppc-delivery-items></ul>
              </div>
            </section>

            <!-- 9. Trainer -->
            <section class="program-practical-trainer" data-reveal>
              <div class="program-practical-trainer__inner">
                <h2 class="program-practical-section-title" data-ppc-trainer-heading></h2>
                <h3 class="program-practical-subheading" data-ppc-trainer-subheading></h3>
                <div class="program-practical-trainer__paragraphs" data-ppc-trainer-paragraphs></div>
              </div>
            </section>

            <!-- 10. FAQ -->
            <section class="program-practical-faq" data-reveal>
              <div class="program-practical-faq__inner">
                <h2 class="program-practical-section-title" data-ppc-faq-heading></h2>
                <div class="program-practical-faq__list" data-ppc-faq-items></div>
              </div>
            </section>

            <!-- 11. Main Final CTA -->
            <section class="program-practical-final-cta" data-reveal>
              <div class="program-practical-final-cta__atmosphere" aria-hidden="true"></div>
              <div class="program-practical-final-cta__inner">
                <h2 class="program-practical-final-cta__heading" data-ppc-cta-heading></h2>
                <p class="program-practical-intro" data-ppc-cta-intro></p>
                <ul class="program-practical-bullet-list program-practical-bullet-list--cta" data-ppc-cta-bullets></ul>
                <p class="program-practical-closing" data-ppc-cta-closing></p>
                <a class="btn-luxury-primary program-practical-final-cta__button" data-ppc-cta-button href="index.html#contact"></a>
              </div>
            </section>

            <!-- 12. Compact Closing CTA -->
            <section class="program-practical-closing-cta" data-ppc-closing-cta data-reveal>
              <div class="program-practical-closing-cta__inner">
                <h2 class="program-practical-closing-cta__heading" data-ppc-closing-heading></h2>
                <a class="btn-luxury-primary program-practical-closing-cta__button" data-ppc-closing-button href="index.html#contact"></a>
              </div>
            </section>
          </div>

          <section class="detail-not-found program-practical-not-found" data-ppc-not-found hidden role="status">
            <h1 class="keynote-display detail-not-found-title" data-ppc-404-title>البرنامج غير موجود</h1>
            <p class="keynote-body detail-not-found-text" data-ppc-404-body></p>
            <a class="detail-back program-detail-back" data-ppc-404-back href="index.html#programs">
              <span data-ppc-404-back-label>العودة إلى البرامج</span>
            </a>
          </section>
        </div>
      </div>
    </main>

`;

html = html.slice(0, start) + main + html.slice(footer);
html = html.replaceAll(
  'program-detail.html?slug=self-confidence',
  'programs-practical-details.html?slug=self-confidence',
);
fs.writeFileSync(path, html);
console.log('practical HTML ready');
