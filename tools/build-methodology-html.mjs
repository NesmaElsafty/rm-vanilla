import fs from 'fs';

const path = 'programs-methodology-details.html';
let html = fs.readFileSync(path, 'utf8');
const start = html.indexOf('<main id="main-content"');
const footer = html.indexOf('<footer class="footer-luxury"');
if (start < 0 || footer < 0) throw new Error('markers missing');

const main = `    <main id="main-content" class="page-main page-main--padded">
      <div class="slide-inner">
        <div data-program-methodology-root>
          <div class="program-methodology-page-inner" data-pm-found>
            <!-- 1. Hero -->
            <section class="program-methodology-hero" data-reveal>
              <div class="program-methodology-hero__atmosphere" aria-hidden="true">
                <span class="program-methodology-hero__glow program-methodology-hero__glow--media"></span>
                <span class="program-methodology-hero__glow program-methodology-hero__glow--copy"></span>
                <span class="program-methodology-hero__grid"></span>
              </div>
              <div class="program-methodology-hero__layout">
                <div class="program-methodology-hero__copy">
                  <p class="program-methodology-hero__eyebrow" data-pm-eyebrow></p>
                  <h1 class="program-methodology-hero__title" data-pm-title></h1>
                  <p class="program-methodology-hero__supporting" data-pm-supporting></p>
                  <div class="program-methodology-hero__description" data-pm-description></div>
                  <div class="program-methodology-hero__actions">
                    <a class="btn-luxury-primary program-methodology-hero__cta" data-pm-primary-cta href="index.html#contact">
                      <span data-pm-primary-cta-label></span>
                    </a>
                    <a class="btn-luxury-ghost program-methodology-hero__secondary" data-pm-secondary-cta href="#program-methodology-pain">
                      <span data-pm-secondary-cta-label></span>
                    </a>
                  </div>
                </div>
                <div class="program-methodology-hero__media">
                  <div class="program-methodology-hero__frame" aria-hidden="true"></div>
                  <figure class="program-methodology-hero__figure">
                    <img class="program-methodology-hero__image" data-pm-hero-image src="" alt="" width="800" height="1000" decoding="async">
                  </figure>
                </div>
              </div>
              <div class="program-methodology-hero__fade" aria-hidden="true"></div>
            </section>

            <!-- 2. Pain -->
            <section id="program-methodology-pain" class="program-methodology-pain" data-reveal>
              <div class="program-methodology-pain__inner">
                <h2 class="program-methodology-section-title" data-pm-pain-heading></h2>
                <p class="program-methodology-intro" data-pm-pain-intro></p>
                <ol class="program-methodology-pain__list" data-pm-pain-bullets></ol>
                <div class="program-methodology-pain__closing" data-pm-pain-closing></div>
              </div>
            </section>

            <!-- 3. Perspective / Why It Matters -->
            <section class="program-methodology-perspective" data-reveal>
              <div class="program-methodology-perspective__inner">
                <h2 class="program-methodology-section-title" data-pm-perspective-heading></h2>
                <div class="program-methodology-section-body" data-pm-perspective-body></div>
              </div>
            </section>

            <!-- 4. Promise / Transformation -->
            <section class="program-methodology-promise" data-reveal>
              <div class="program-methodology-promise__inner">
                <h2 class="program-methodology-section-title" data-pm-promise-heading></h2>
                <p class="program-methodology-lead" data-pm-promise-intro></p>
                <ol class="program-methodology-flows" data-pm-promise-flows></ol>
                <p class="program-methodology-simplified" data-pm-promise-simplified hidden></p>
                <div class="program-methodology-closing-block" data-pm-promise-closing></div>
              </div>
            </section>

            <!-- 5. Audience -->
            <section class="program-methodology-audience" data-reveal>
              <div class="program-methodology-audience__inner">
                <h2 class="program-methodology-section-title" data-pm-audience-heading></h2>
                <div class="program-methodology-audience__grid">
                  <div class="program-methodology-audience__for">
                    <p class="program-methodology-intro" data-pm-audience-intro></p>
                    <ul class="program-methodology-block-bullet-list" data-pm-audience-bullets></ul>
                  </div>
                  <div class="program-methodology-audience__not">
                    <h3 class="program-methodology-subheading" data-pm-not-for-heading></h3>
                    <p class="program-methodology-intro" data-pm-not-for-intro></p>
                    <ul class="program-methodology-block-bullet-list program-methodology-block-bullet-list--muted" data-pm-not-for-bullets></ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 6. Curriculum + powerful block -->
            <section class="program-methodology-curriculum" data-reveal>
              <div class="program-methodology-curriculum__header">
                <h2 class="program-methodology-section-title" data-pm-curriculum-heading></h2>
                <p class="program-methodology-curriculum__supporting" data-pm-curriculum-supporting hidden></p>
                <div class="program-methodology-curriculum__intro" data-pm-curriculum-intro></div>
              </div>
              <ol class="program-methodology-patterns" data-pm-curriculum-modules></ol>
              <aside class="program-methodology-powerful" data-pm-curriculum-powerful>
                <h3 class="program-methodology-powerful__heading" data-pm-powerful-heading></h3>
                <div class="program-methodology-powerful__intro" data-pm-powerful-intro></div>
                <ul class="program-methodology-block-bullet-list" data-pm-powerful-bullets></ul>
                <p class="program-methodology-simplified" data-pm-powerful-simplified hidden></p>
                <div class="program-methodology-closing-block" data-pm-powerful-closing></div>
              </aside>
            </section>

            <!-- 7. Differentiator -->
            <section class="program-methodology-differentiator" data-reveal>
              <div class="program-methodology-differentiator__inner">
                <h2 class="program-methodology-section-title" data-pm-differentiator-heading></h2>
                <p class="program-methodology-differentiator__supporting" data-pm-differentiator-supporting hidden></p>
                <h3 class="program-methodology-subheading" data-pm-differentiator-subheading hidden></h3>
                <div class="program-methodology-section-body" data-pm-differentiator-body></div>
              </div>
            </section>

            <!-- 8. What Is APG / methodology description -->
            <section class="program-methodology-what" data-pm-methodology-description data-reveal>
              <div class="program-methodology-what__inner">
                <h2 class="program-methodology-section-title" data-pm-what-heading></h2>
                <div class="program-methodology-section-body" data-pm-what-body></div>
              </div>
            </section>

            <!-- 9. Trainer -->
            <section class="program-methodology-trainer" data-reveal>
              <div class="program-methodology-trainer__inner">
                <h2 class="program-methodology-section-title" data-pm-trainer-heading></h2>
                <div class="program-methodology-section-body" data-pm-trainer-body></div>
              </div>
            </section>

            <!-- 10. Expected Results -->
            <section class="program-methodology-results" data-reveal>
              <div class="program-methodology-results__inner">
                <h2 class="program-methodology-section-title" data-pm-results-heading></h2>
                <p class="program-methodology-lead" data-pm-results-intro></p>
                <ul class="program-methodology-results__list" data-pm-results-bullets></ul>
              </div>
            </section>

            <!-- 11. FAQ -->
            <section class="program-methodology-faq" data-reveal>
              <div class="program-methodology-faq__inner">
                <h2 class="program-methodology-section-title" data-pm-faq-heading></h2>
                <div class="program-methodology-faq__list" data-pm-faq-items></div>
              </div>
            </section>

            <!-- 12. Final CTA -->
            <section class="program-methodology-final-cta" data-reveal>
              <div class="program-methodology-final-cta__atmosphere" aria-hidden="true"></div>
              <div class="program-methodology-final-cta__inner">
                <h2 class="program-methodology-final-cta__heading" data-pm-cta-heading></h2>
                <p class="program-methodology-final-cta__supporting" data-pm-cta-supporting hidden></p>
                <p class="program-methodology-intro" data-pm-cta-intro></p>
                <ul class="program-methodology-block-bullet-list program-methodology-block-bullet-list--cta" data-pm-cta-bullets></ul>
                <div class="program-methodology-final-cta__closing" data-pm-cta-closing></div>
                <div class="program-methodology-final-cta__actions">
                  <a class="btn-luxury-primary program-methodology-final-cta__button" data-pm-cta-button href="index.html#contact"></a>
                  <a class="btn-luxury-ghost program-methodology-final-cta__secondary" data-pm-cta-secondary href="index.html#contact" hidden></a>
                </div>
              </div>
            </section>
          </div>

          <section class="detail-not-found program-methodology-not-found" data-pm-not-found hidden role="status">
            <h1 class="keynote-display detail-not-found-title" data-pm-404-title>البرنامج غير موجود</h1>
            <p class="keynote-body detail-not-found-text" data-pm-404-body></p>
            <a class="detail-back program-detail-back" data-pm-404-back href="index.html#programs">
              <span data-pm-404-back-label>العودة إلى البرامج</span>
            </a>
          </section>
        </div>
      </div>
    </main>

`;

html = html.slice(0, start) + main + html.slice(footer);
html = html.replace(
  /program-detail\.html\?slug=apg/g,
  'programs-methodology-details.html?slug=apg',
);
html = html.replace(
  /programs-details\.html\?slug=apg/g,
  'programs-methodology-details.html?slug=apg',
);
fs.writeFileSync(path, html);
console.log('methodology HTML main replaced');
