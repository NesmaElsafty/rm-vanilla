import fs from 'fs';

const transformPath =
  'd:/Projects/rana/ranamosaad-vanilla/programs-transformation-details.html';
const outPath =
  'd:/Projects/rana/ranamosaad-vanilla/programs-feminine-details.html';

let html = fs.readFileSync(transformPath, 'utf8');

html = html
  .replace(
    /النسخة الجديدة من نفسك \| Dr\. Rana Mosaad/g,
    'أنا انثي | Dr. Rana Mosaad',
  )
  .replace(
    /content="النسخة الجديدة من نفسك هو برنامج تحولي[^"]*"/g,
    'content="رحلة عودة الي فطرتك الأنثوية السليمة في ٦٠ يوم"',
  )
  .replace(
    /programs-transformation-details\.html\?slug=new-version-of-yourself/g,
    'programs-feminine-details.html?slug=ana-ontha',
  )
  .replace(/class="program-transform-page"/g, 'class="program-feminine-page"')
  .replace(
    /href="programs-transformation-details\.html\?slug=ana-ontha"/g,
    'href="programs-feminine-details.html?slug=ana-ontha"',
  );

const mainStart = html.indexOf('<main id="main-content"');
const footerStart = html.indexOf('<footer class="footer-luxury"');

const mainAndPopup = `<main id="main-content" class="page-main page-main--padded">
      <div class="slide-inner">
        <div data-program-feminine-root>
          <div class="program-feminine-page-inner" data-pf-found>
            <!-- 1. Hero -->
            <section class="program-feminine-hero" data-reveal>
              <div class="program-feminine-hero__atmosphere" aria-hidden="true">
                <span class="program-feminine-hero__glow program-feminine-hero__glow--media"></span>
                <span class="program-feminine-hero__glow program-feminine-hero__glow--copy"></span>
                <span class="program-feminine-hero__grid"></span>
              </div>
              <div class="program-feminine-hero__layout">
                <div class="program-feminine-hero__copy">
                  <h1 class="program-feminine-hero__title" data-pf-title></h1>
                  <p class="program-feminine-hero__supporting" data-pf-supporting></p>
                  <div class="program-feminine-hero__actions">
                    <a class="btn-luxury-primary program-feminine-hero__cta" data-pf-primary-cta href="index.html#contact">
                      <span data-pf-primary-cta-label></span>
                    </a>
                  </div>
                </div>
                <div class="program-feminine-hero__media">
                  <div class="program-feminine-hero__frame" aria-hidden="true"></div>
                  <figure class="program-feminine-hero__figure">
                    <img
                      class="program-feminine-hero__image"
                      data-pf-hero-image
                      src=""
                      alt=""
                      width="800"
                      height="1000"
                      decoding="async"
                    >
                  </figure>
                </div>
              </div>
              <div class="program-feminine-hero__fade" aria-hidden="true"></div>
            </section>

            <!-- 2. Pain / Recognition -->
            <section id="program-feminine-pain" class="program-feminine-pain" data-reveal>
              <div class="program-feminine-pain__inner">
                <h2 class="program-feminine-section-title" data-pf-pain-heading></h2>
                <p class="program-feminine-intro" data-pf-pain-intro></p>
                <ul class="program-feminine-bullet-list program-feminine-pain__list" data-pf-pain-bullets></ul>
              </div>
            </section>

            <!-- 3. Why This Program Matters -->
            <section class="program-feminine-importance" data-reveal>
              <div class="program-feminine-importance__inner">
                <p class="program-feminine-section-label" data-pf-importance-label></p>
                <h2 class="program-feminine-section-title" data-pf-importance-heading></h2>
                <div class="program-feminine-importance__prose" data-pf-importance-paragraphs></div>
                <ul class="program-feminine-pill-list" data-pf-importance-bullets></ul>
                <div class="program-feminine-importance__prose program-feminine-importance__action-intro" data-pf-importance-action-intro></div>
                <ul class="program-feminine-bullet-list program-feminine-importance__action-items" data-pf-importance-action-items></ul>
              </div>
            </section>

            <!-- 4. Transformation -->
            <section class="program-feminine-flows-section" data-reveal>
              <div class="program-feminine-flows-section__inner">
                <h2 class="program-feminine-section-title" data-pf-transformation-heading></h2>
                <p class="program-feminine-lead" data-pf-transformation-intro></p>
                <ol class="program-feminine-flows" data-pf-transformation-flows></ol>
              </div>
            </section>

            <!-- 5. Audience -->
            <section class="program-feminine-audience" data-reveal>
              <div class="program-feminine-audience__inner">
                <h2 class="program-feminine-section-title" data-pf-audience-heading></h2>
                <div class="program-feminine-audience__grid">
                  <div class="program-feminine-audience__for">
                    <p class="program-feminine-intro" data-pf-audience-intro></p>
                    <ul class="program-feminine-bullet-list" data-pf-audience-bullets></ul>
                  </div>
                  <div class="program-feminine-audience__not">
                    <h3 class="program-feminine-subheading" data-pf-not-for-heading></h3>
                    <p class="program-feminine-intro" data-pf-not-for-intro></p>
                    <ul class="program-feminine-bullet-list program-feminine-bullet-list--muted" data-pf-not-for-bullets></ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 6. Healing Pillars -->
            <section class="program-feminine-pillars" data-reveal>
              <div class="program-feminine-pillars__header">
                <h2 class="program-feminine-section-title" data-pf-pillars-heading></h2>
              </div>
              <ol class="program-feminine-pillars__list" data-pf-pillars-items></ol>
            </section>

            <!-- 7. Differentiator -->
            <section class="program-feminine-differentiator" data-reveal>
              <div class="program-feminine-differentiator__inner">
                <div class="program-feminine-differentiator__why">
                  <h2 class="program-feminine-section-title" data-pf-differentiator-heading></h2>
                  <div class="program-feminine-differentiator__prose" data-pf-differentiator-paragraphs></div>
                </div>
                <div class="program-feminine-differentiator__features">
                  <h3 class="program-feminine-subheading" data-pf-differentiator-subheading></h3>
                  <ul class="program-feminine-feature-list" data-pf-differentiator-features></ul>
                </div>
              </div>
            </section>

            <!-- 8. Trainer -->
            <section class="program-feminine-trainer" data-reveal>
              <div class="program-feminine-trainer__inner">
                <h2 class="program-feminine-section-title" data-pf-trainer-heading></h2>
                <h3 class="program-feminine-subheading" data-pf-trainer-subheading></h3>
                <div class="program-feminine-trainer__prose" data-pf-trainer-paragraphs></div>
              </div>
            </section>

            <!-- 9. Final CTA -->
            <section class="program-feminine-final-cta" data-pf-final-cta data-reveal>
              <div class="program-feminine-final-cta__atmosphere" aria-hidden="true"></div>
              <div class="program-feminine-final-cta__inner">
                <h2 class="program-feminine-final-cta__heading" data-pf-cta-heading></h2>
                <a class="btn-luxury-primary program-feminine-final-cta__button" data-pf-cta-button href="index.html#contact"></a>
              </div>
            </section>
          </div>

          <section class="detail-not-found program-feminine-not-found" data-pf-not-found hidden role="status">
            <h1 class="keynote-display detail-not-found-title" data-pf-404-title>البرنامج غير موجود</h1>
            <p class="keynote-body detail-not-found-text" data-pf-404-body></p>
            <a class="detail-back program-detail-back" data-pf-404-back href="index.html#programs">
              <span data-pf-404-back-label>العودة إلى البرامج</span>
            </a>
          </section>
        </div>
      </div>
    </main>

    <!-- Structure popup (outside normal section flow) -->
    <div class="program-feminine-popup" data-pf-popup hidden>
      <div class="program-feminine-popup__backdrop" data-pf-popup-backdrop></div>
      <div
        class="program-feminine-popup__dialog glass-slide"
        role="dialog"
        aria-modal="true"
        aria-label="Notice"
        tabindex="-1"
        data-pf-popup-dialog
      >
        <button type="button" class="program-feminine-popup__close" data-pf-popup-close aria-label="Close">×</button>
        <p class="program-feminine-popup__message" data-pf-popup-message></p>
      </div>
    </div>

    `;

html = html.slice(0, mainStart) + mainAndPopup + html.slice(footerStart);
fs.writeFileSync(outPath, html);
console.log('Wrote', outPath);
