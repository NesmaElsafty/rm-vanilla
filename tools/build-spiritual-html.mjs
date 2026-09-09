import fs from 'fs';

const path = 'programs-spiritual-details.html';
let html = fs.readFileSync(path, 'utf8');

html = html
  .replace(
    /<title>[\s\S]*?<\/title>/,
    '<title>متصل | رحلة للعودة إلى الله | Dr. Rana Mosaad</title>',
  )
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="رحلة عودة نفكك فيها العوائق التي تقف بينك وبين تواصل عميق مع الله، فيهدأ دخلك وتحيأ بتسليم لله">',
  )
  .replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="متصل | رحلة للعودة إلى الله | Dr. Rana Mosaad">',
  )
  .replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="رحلة عودة نفكك فيها العوائق التي تقف بينك وبين تواصل عميق مع الله، فيهدأ دخلك وتحيأ بتسليم لله">',
  )
  .replace(
    /<link rel="canonical" href="[^"]*">/,
    '<link rel="canonical" href="programs-spiritual-details.html?slug=mottasel">',
  )
  .replace(
    'class="program-methodology-page"',
    'class="program-spiritual-page"',
  );

const start = html.indexOf('<main id="main-content"');
const footer = html.indexOf('<footer class="footer-luxury"');
if (start < 0 || footer < 0) throw new Error('markers missing');

const main = `    <main id="main-content" class="page-main page-main--padded">
      <div class="slide-inner">
        <div data-program-spiritual-root>
          <div class="program-spiritual-page-inner" data-ps-found>
            <!-- 1. Hero -->
            <section class="program-spiritual-hero" data-reveal>
              <div class="program-spiritual-hero__atmosphere" aria-hidden="true">
                <span class="program-spiritual-hero__glow program-spiritual-hero__glow--media"></span>
                <span class="program-spiritual-hero__glow program-spiritual-hero__glow--copy"></span>
              </div>
              <div class="program-spiritual-hero__layout">
                <div class="program-spiritual-hero__copy">
                  <p class="program-spiritual-hero__eyebrow" data-ps-eyebrow></p>
                  <h1 class="program-spiritual-hero__title" data-ps-title></h1>
                  <p class="program-spiritual-hero__supporting" data-ps-supporting></p>
                  <p class="program-spiritual-hero__description" data-ps-description></p>
                  <ul class="program-spiritual-hero__lines" data-ps-supporting-lines></ul>
                  <p class="program-spiritual-hero__method" data-ps-method></p>
                  <div class="program-spiritual-hero__actions">
                    <a class="btn-luxury-primary program-spiritual-hero__cta" data-ps-primary-cta href="index.html#contact">
                      <span data-ps-primary-cta-label></span>
                    </a>
                    <a class="btn-luxury-ghost program-spiritual-hero__secondary" data-ps-secondary-cta href="#program-spiritual-summary">
                      <span data-ps-secondary-cta-label></span>
                    </a>
                  </div>
                </div>
                <div class="program-spiritual-hero__media">
                  <div class="program-spiritual-hero__frame" aria-hidden="true"></div>
                  <figure class="program-spiritual-hero__figure">
                    <img class="program-spiritual-hero__image" data-ps-hero-image src="" alt="" width="800" height="1000" decoding="async">
                  </figure>
                </div>
              </div>
            </section>

            <!-- 2. Journey Summary -->
            <section id="program-spiritual-summary" class="program-spiritual-summary" data-reveal>
              <div class="program-spiritual-summary__inner">
                <p class="program-spiritual-summary__brand" data-ps-summary-brand></p>
                <p class="program-spiritual-summary__duration" data-ps-summary-duration></p>
                <p class="program-spiritual-summary__stages" data-ps-summary-stages></p>
                <ul class="program-spiritual-summary__pairs" data-ps-summary-pairs></ul>
              </div>
            </section>

            <!-- 3. Pain -->
            <section class="program-spiritual-pain" data-reveal>
              <div class="program-spiritual-pain__inner">
                <h2 class="program-spiritual-section-title" data-ps-pain-heading></h2>
                <p class="program-spiritual-lead" data-ps-pain-supporting></p>
                <p class="program-spiritual-intro" data-ps-pain-intro></p>
                <ol class="program-spiritual-pain__list" data-ps-pain-blocks></ol>
              </div>
            </section>

            <!-- 4. Transformation -->
            <section class="program-spiritual-transformation" data-reveal>
              <div class="program-spiritual-transformation__inner">
                <div class="program-spiritual-transformation__opening" data-ps-transformation-opening></div>
                <p class="program-spiritual-intro" data-ps-transformation-intro></p>
                <ol class="program-spiritual-flows" data-ps-transformation-flows></ol>
              </div>
            </section>

            <!-- 5. Audience -->
            <section class="program-spiritual-audience" data-reveal>
              <div class="program-spiritual-audience__inner">
                <h2 class="program-spiritual-section-title" data-ps-audience-heading></h2>
                <p class="program-spiritual-intro" data-ps-audience-intro></p>
                <ul class="program-spiritual-audience__list" data-ps-audience-items></ul>
              </div>
            </section>

            <!-- 6. 3-Stage Journey -->
            <section class="program-spiritual-journey" data-reveal>
              <div class="program-spiritual-journey__header">
                <h2 class="program-spiritual-section-title" data-ps-journey-heading></h2>
                <p class="program-spiritual-intro" data-ps-journey-intro></p>
              </div>
              <ol class="program-spiritual-stages" data-ps-journey-stages></ol>
            </section>

            <!-- 7. Differentiator -->
            <section class="program-spiritual-diff" data-reveal>
              <div class="program-spiritual-diff__inner">
                <h2 class="program-spiritual-section-title" data-ps-differentiator-heading></h2>
                <p class="program-spiritual-intro" data-ps-differentiator-intro></p>
                <ul class="program-spiritual-diff__list" data-ps-differentiator-items></ul>
              </div>
            </section>

            <!-- 8. Trainer -->
            <section class="program-spiritual-trainer" data-reveal>
              <div class="program-spiritual-trainer__inner">
                <h2 class="program-spiritual-section-title" data-ps-trainer-heading></h2>
                <h3 class="program-spiritual-subheading" data-ps-trainer-subheading></h3>
                <div class="program-spiritual-trainer__paragraphs" data-ps-trainer-paragraphs></div>
                <ul class="program-spiritual-bullet-list" data-ps-trainer-bullets></ul>
              </div>
            </section>

            <!-- 9. FAQ -->
            <section class="program-spiritual-faq" data-reveal>
              <div class="program-spiritual-faq__inner">
                <h2 class="program-spiritual-section-title" data-ps-faq-heading></h2>
                <p class="program-spiritual-lead" data-ps-faq-supporting></p>
                <div class="program-spiritual-faq__list" data-ps-faq-items></div>
              </div>
            </section>

            <!-- 10. Final CTA -->
            <section class="program-spiritual-final-cta" data-reveal>
              <div class="program-spiritual-final-cta__atmosphere" aria-hidden="true"></div>
              <div class="program-spiritual-final-cta__inner">
                <p class="program-spiritual-final-cta__eyebrow" data-ps-cta-eyebrow></p>
                <h2 class="program-spiritual-final-cta__heading" data-ps-cta-heading></h2>
                <p class="program-spiritual-final-cta__supporting" data-ps-cta-supporting></p>
                <p class="program-spiritual-final-cta__body" data-ps-cta-body></p>
                <div class="program-spiritual-final-cta__actions">
                  <a class="btn-luxury-primary program-spiritual-final-cta__button" data-ps-cta-button href="index.html#contact"></a>
                  <a class="btn-luxury-ghost program-spiritual-final-cta__secondary" data-ps-cta-secondary href="#main-content"></a>
                </div>
              </div>
            </section>
          </div>

          <section class="detail-not-found program-spiritual-not-found" data-ps-not-found hidden role="status">
            <h1 class="keynote-display detail-not-found-title" data-ps-404-title>البرنامج غير موجود</h1>
            <p class="keynote-body detail-not-found-text" data-ps-404-body></p>
            <a class="detail-back program-detail-back" data-ps-404-back href="index.html#programs">
              <span data-ps-404-back-label>العودة إلى البرامج</span>
            </a>
          </section>
        </div>
      </div>
    </main>

`;

html = html.slice(0, start) + main + html.slice(footer);
html = html.replace(
  /program-detail\.html\?slug=mottasel/g,
  'programs-spiritual-details.html?slug=mottasel',
);
fs.writeFileSync(path, html);
console.log('spiritual HTML ready');
