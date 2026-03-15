// @ts-check
const { test, expect } = require("@playwright/test");

const PAGE_URL = "file://" + require("path").resolve(__dirname, "../index.html");

test.describe("Bacheloroppgave section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("has two images in the bachelor gallery", async ({ page }) => {
    const images = page.locator("#bachelor .gallery-grid img");
    await expect(images).toHaveCount(2);
  });

  test("bachelor images use local sources", async ({ page }) => {
    const images = page.locator("#bachelor .gallery-grid img");
    const src1 = await images.nth(0).getAttribute("src");
    const src2 = await images.nth(1).getAttribute("src");
    expect(src1).toContain("IMG_3906.JPG");
    expect(src2).toContain("IMG_7509.jpeg");
  });

  test("first image has caption 'Den vakre naturen i Trøndelag'", async ({ page }) => {
    const caption = page.locator("#bachelor .gallery-grid figure:nth-child(1) figcaption");
    await expect(caption).toHaveText("Den vakre naturen i Trøndelag");
  });

  test("second image has caption 'Bratte fjellsider'", async ({ page }) => {
    const caption = page.locator("#bachelor .gallery-grid figure:nth-child(2) figcaption");
    await expect(caption).toHaveText("Bratte fjellsider");
  });
});

test.describe("Hero section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("has a background image using IMG_7173.JPG", async ({ page }) => {
    const bg = await page.locator("#hjem").evaluate((el) =>
      getComputedStyle(el).backgroundImage
    );
    expect(bg).toContain("IMG_7173.JPG");
  });

  test("has a dark overlay for readability", async ({ page }) => {
    const overlay = page.locator("#hjem .hero-overlay");
    await expect(overlay).toBeVisible();
  });

  test("has a Call to Action button that links to contact section", async ({ page }) => {
    const cta = page.locator("#hjem .cta-button");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText("Ta kontakt");
    await expect(cta).toHaveAttribute("href", "#kontakt");
  });

  test("CTA button text switches language", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator("#hjem .cta-button")).toHaveText("Get in touch");
    await page.click(".lang-toggle");
    await expect(page.locator("#hjem .cta-button")).toHaveText("Ta kontakt");
  });

  test("has a caption describing the hero image", async ({ page }) => {
    const caption = page.locator("#hjem .hero-caption");
    await expect(caption).toBeVisible();
    await expect(caption).toHaveText("På vei opp Galdhøgpiggen får man en fin utsikt over Visdalen, hvor fjellet Hellstuguhøe (2072 moh) markerer seg i midten av bildet.");
  });

  test("hero caption switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const caption = page.locator("#hjem .hero-caption");
    await expect(caption).toHaveText("On the way up Galdhøpiggen, one gets a nice view over Visdalen, where the mountain Hellstuguhøe (2072 m a.s.l.) stands out in the centre of the image.");
  });

  test("hero caption switches back to Norwegian", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click(".lang-toggle");
    const caption = page.locator("#hjem .hero-caption");
    await expect(caption).toHaveText("På vei opp Galdhøgpiggen får man en fin utsikt over Visdalen, hvor fjellet Hellstuguhøe (2072 moh) markerer seg i midten av bildet.");
  });

  test("hero caption has border styling consistent with other captions", async ({ page }) => {
    const caption = page.locator("#hjem .hero-caption");
    const border = await caption.evaluate((el) => getComputedStyle(el).border);
    expect(border).toContain("3px");
    expect(border).toContain("solid");
  });
});

test.describe("i18n language switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("page defaults to Norwegian Bokmål", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(page.locator("[data-i18n='nav.home']")).toHaveText("Hjem");
    await expect(page.locator("[data-i18n='hero.title']")).toHaveText("Vetle Øyvind Larsen Lunde");
    await expect(page.locator("[data-i18n='bachelor.title']")).toHaveText("Bacheloroppgaven min");
  });

  test("switches to English when toggle is clicked", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("[data-i18n='nav.home']")).toHaveText("Home");
    await expect(page.locator("[data-i18n='hero.title']")).toHaveText("Vetle Øyvind Larsen Lunde");
    await expect(page.locator("[data-i18n='bachelor.title']")).toHaveText("My Bachelor Thesis");
    await expect(page.locator("[data-i18n='bachelor.caption1']")).toHaveText("The beautiful nature of Trøndelag");
    await expect(page.locator("[data-i18n='bachelor.caption2']")).toHaveText("Steep mountain sides");
  });

  test("switches back to Norwegian when toggle is clicked twice", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click(".lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(page.locator("[data-i18n='nav.home']")).toHaveText("Hjem");
    await expect(page.locator("[data-i18n='bachelor.caption1']")).toHaveText("Den vakre naturen i Trøndelag");
  });

  test("updates page title on language switch", async ({ page }) => {
    await expect(page).toHaveTitle("Vetle – Geologi og Geofare");
    await page.click(".lang-toggle");
    await expect(page).toHaveTitle(/Geology and Geo-Hazards/);
  });

  test("updates image alt texts on language switch", async ({ page }) => {
    const img = page.locator("[data-i18n-alt='bachelor.img1.alt']");
    await expect(img).toHaveAttribute("alt", "Bacheloroppgave – feltarbeid bilde 1");
    await page.click(".lang-toggle");
    await expect(img).toHaveAttribute("alt", "Bachelor thesis – fieldwork photo 1");
  });

  test("language toggle button shows correct label", async ({ page }) => {
    await expect(page.locator(".lang-toggle")).toHaveText("EN");
    await page.click(".lang-toggle");
    await expect(page.locator(".lang-toggle")).toHaveText("NO");
  });
});

test.describe("About section – content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("displays updated about text in Om meg section", async ({ page }) => {
    const text = page.locator('#om-meg [data-i18n="about.text"]');
    await expect(text).toBeVisible();
    await expect(text).toContainText("Hei, mitt navn er Vetle!");
  });

  test("about text switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const text = page.locator('#om-meg [data-i18n="about.text"]');
    await expect(text).toContainText("Hi, my name is Vetle!");
  });

  test("displays background subheader in Om meg section", async ({ page }) => {
    const heading = page.locator('#om-meg h3[data-i18n="about.background.title"]');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Min bakgrunn");
  });

  test("background subheader switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const heading = page.locator('#om-meg h3[data-i18n="about.background.title"]');
    await expect(heading).toHaveText("My background");
  });

  test("displays job history entries in Om meg section", async ({ page }) => {
    const job1Title = page.locator('#om-meg h4[data-i18n="about.job1.title"]');
    await expect(job1Title).toBeVisible();
    await expect(job1Title).toContainText("ConocoPhillips 2023");
    const job1Text = page.locator('#om-meg [data-i18n="about.job1.text"]');
    await expect(job1Text).toBeVisible();
    await expect(job1Text).toContainText("biostratigrafisk database");
    const job2Title = page.locator('#om-meg h4[data-i18n="about.job2.title"]');
    await expect(job2Title).toBeVisible();
    const job2Text = page.locator('#om-meg [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toBeVisible();
    await expect(job2Text).toContainText("Well Delivery");
  });

  test("timeline container is visible in Om meg section", async ({ page }) => {
    const timeline = page.locator('#om-meg .timeline');
    await expect(timeline).toBeVisible();
    const entries = page.locator('#om-meg .timeline-entry');
    await expect(entries).toHaveCount(2);
  });

  test("timeline displays year ranges", async ({ page }) => {
    const dates = page.locator('#om-meg .timeline-date');
    await expect(dates.nth(0)).toHaveText("2024–2025");
    await expect(dates.nth(1)).toHaveText("2023–2024");
  });

  test("timeline markers are visible", async ({ page }) => {
    const markers = page.locator('#om-meg .timeline-marker');
    await expect(markers).toHaveCount(2);
    await expect(markers.nth(0)).toBeVisible();
    await expect(markers.nth(1)).toBeVisible();
  });

  test("job history switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const job1Text = page.locator('#om-meg [data-i18n="about.job1.text"]');
    await expect(job1Text).toContainText("biostratigraphic database");
    const job2Text = page.locator('#om-meg [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toContainText("Well Delivery");
    await expect(job2Text).toContainText("Ekofisk field");
  });

  test("job2 text contains Ekofisk description", async ({ page }) => {
    const job2Text = page.locator('#om-meg [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toContainText("Ekofiskfeltet");
    await expect(job2Text).toContainText("StarSteer");
  });
});

test.describe("Norwegian Bokmål content", () => {
  test("all text is in Bokmål (not Nynorsk)", async ({ page }) => {
    await page.goto(PAGE_URL);
    const html = await page.content();
    // These Nynorsk words should NOT be present in the rendered HTML
    // (excluding proper nouns like "Høgskulen på Vestlandet")
    expect(html).not.toContain("Bacheloroppgåva");
    expect(html).not.toContain("korleis");
    expect(html).not.toContain("lausmassar");
    expect(html).not.toContain("Ikkje");
  });
});

test.describe("SEO and accessibility must-haves", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("has a meta description tag", async ({ page }) => {
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /Vetle/);
  });

  test("has Open Graph meta tags", async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Vetle/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /vetle-lunde-site/);
  });

  test("has a theme-color meta tag", async ({ page }) => {
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0f1117");
  });

  test("has a skip-to-content link targeting main content", async ({ page }) => {
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toHaveAttribute("href", "#hovedinnhold");
    await expect(skipLink).toHaveText("Hopp til hovedinnhold");
    await expect(page.locator("#hovedinnhold")).toHaveCount(1);
  });

  test("skip-to-content link text switches language", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator(".skip-link")).toHaveText("Skip to main content");
  });

  test("meta description updates on language switch", async ({ page }) => {
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /geologistudent/);
    await page.click(".lang-toggle");
    await expect(desc).toHaveAttribute("content", /geology student/);
  });
});

test.describe("Contact form modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("contact section has a 'Ta kontakt' button", async ({ page }) => {
    const btn = page.locator("#contact-open-btn");
    await expect(btn).toBeVisible();
    await expect(btn).toHaveText("Ta kontakt");
  });

  test("contact button text switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator("#contact-open-btn")).toHaveText("Contact me");
  });

  test("modal is hidden by default", async ({ page }) => {
    const modal = page.locator("#contact-modal");
    await expect(modal).toBeHidden();
  });

  test("clicking contact button opens the modal", async ({ page }) => {
    await page.click("#contact-open-btn");
    const modal = page.locator("#contact-modal");
    await expect(modal).toBeVisible();
  });

  test("modal has a title 'Kontaktskjema'", async ({ page }) => {
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-modal-title")).toHaveText("Kontaktskjema");
  });

  test("modal title switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-modal-title")).toHaveText("Contact Form");
  });

  test("close button closes the modal", async ({ page }) => {
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-modal")).toBeVisible();
    await page.click("#contact-close-btn");
    await expect(page.locator("#contact-modal")).toBeHidden();
  });

  test("Escape key closes the modal", async ({ page }) => {
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-modal")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#contact-modal")).toBeHidden();
  });

  test("clicking overlay closes the modal", async ({ page }) => {
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-modal")).toBeVisible();
    // Click the overlay (top-left corner, outside modal-content)
    await page.locator("#contact-modal").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#contact-modal")).toBeHidden();
  });

  test("form has all required fields", async ({ page }) => {
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator("#contact-subject")).toBeVisible();
    await expect(page.locator("#contact-message")).toBeVisible();
    await expect(page.locator("#contact-privacy")).toBeVisible();
  });

  test("form labels switch to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click("#contact-open-btn");
    await expect(page.locator('label[for="contact-name"]')).toHaveText("Name");
    await expect(page.locator('label[for="contact-email"]')).toHaveText("Email");
    await expect(page.locator('label[for="contact-subject"]')).toHaveText("Subject");
    await expect(page.locator('label[for="contact-message"]')).toHaveText("Message");
  });

  test("placeholders switch to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click("#contact-open-btn");
    await expect(page.locator("#contact-name")).toHaveAttribute("placeholder", "Your name");
    await expect(page.locator("#contact-email")).toHaveAttribute("placeholder", "your@email.com");
  });

  test("shows error for invalid email on submit", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "invalid-email");
    await page.fill("#contact-subject", "Test");
    await page.fill("#contact-message", "Hello");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-error")).toBeVisible();
  });

  test("honeypot field is not accessible to users", async ({ page }) => {
    await page.click("#contact-open-btn");
    const honeypot = page.locator('input[name="_gotcha"]');
    await expect(honeypot).toHaveAttribute("aria-hidden", "true");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(honeypot).toHaveClass("honeypot");
  });

  test("submit with valid data shows success message (file:// fallback)", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    // Expected: Fetch fails on file:// protocol, catch handler simulates success for local preview
    await expect(page.locator("#contact-success")).toBeVisible();
  });

  test("modal has correct ARIA attributes", async ({ page }) => {
    const modal = page.locator("#contact-modal");
    await expect(modal).toHaveAttribute("role", "dialog");
    await expect(modal).toHaveAttribute("aria-modal", "true");
    await expect(modal).toHaveAttribute("aria-labelledby", "contact-modal-title");
  });

  test("success message has no 'Send ny melding' button after submission", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-success")).toBeVisible();
    await expect(page.locator("#contact-new-btn")).toHaveCount(0);
  });

  test("reopening modal after submission shows fresh form", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-success")).toBeVisible();
    // Close and reopen the modal
    await page.click("#contact-close-btn");
    await page.click("#contact-open-btn");
    // Should show the form, not the success message
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(page.locator("#contact-success")).toBeHidden();
    await expect(page.locator("#contact-name")).toHaveValue("");
  });
});

test.describe("Theme toggle (dark/light mode)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(PAGE_URL);
  });

  test("theme toggle button is visible in nav", async ({ page }) => {
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-label", /./);
  });

  test("defaults to dark theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("shows moon icon in dark mode", async ({ page }) => {
    const moon = page.locator("#theme-toggle .theme-icon-moon");
    const sun = page.locator("#theme-toggle .theme-icon-sun");
    await expect(moon).toBeVisible();
    await expect(sun).toBeHidden();
  });

  test("clicking toggle switches to light theme", async ({ page }) => {
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("shows sun icon in light mode", async ({ page }) => {
    await page.click("#theme-toggle");
    const moon = page.locator("#theme-toggle .theme-icon-moon");
    const sun = page.locator("#theme-toggle .theme-icon-sun");
    await expect(sun).toBeVisible();
    await expect(moon).toBeHidden();
  });

  test("clicking toggle twice returns to dark theme", async ({ page }) => {
    await page.click("#theme-toggle");
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme preference persists in localStorage", async ({ page }) => {
    await page.click("#theme-toggle");
    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("light");
  });

  test("saved light theme is restored on reload", async ({ page }) => {
    await page.click("#theme-toggle");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("aria-label updates when switching themes", async ({ page }) => {
    const toggle = page.locator("#theme-toggle");
    const darkLabel = await toggle.getAttribute("aria-label");
    await page.click("#theme-toggle");
    const lightLabel = await toggle.getAttribute("aria-label");
    expect(darkLabel).not.toBe(lightLabel);
  });

  test("theme toggle works alongside language toggle", async ({ page }) => {
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.click(".lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("respects prefers-color-scheme light when no saved preference", async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(PAGE_URL);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test.describe("Navigation active highlighting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("clicking bachelor nav link highlights it and not kontakt", async ({ page }) => {
    // Scroll to kontakt first so it becomes active
    await page.locator('nav a[href="#kontakt"]').click();
    await page.waitForTimeout(900);

    // Now click bachelor
    await page.locator('nav a[href="#bachelor"]').click();
    await page.waitForTimeout(900);

    const bachelorLink = page.locator('nav a[href="#bachelor"]');
    const kontaktLink = page.locator('nav a[href="#kontakt"]');
    await expect(bachelorLink).toHaveClass(/nav-active/);
    await expect(kontaktLink).not.toHaveClass(/nav-active/);
  });

  test("clicking kontakt nav link highlights it and not bachelor", async ({ page }) => {
    // Scroll to bachelor first
    await page.locator('nav a[href="#bachelor"]').click();
    await page.waitForTimeout(900);

    // Now click kontakt
    await page.locator('nav a[href="#kontakt"]').click();
    await page.waitForTimeout(900);

    const bachelorLink = page.locator('nav a[href="#bachelor"]');
    const kontaktLink = page.locator('nav a[href="#kontakt"]');
    await expect(kontaktLink).toHaveClass(/nav-active/);
    await expect(bachelorLink).not.toHaveClass(/nav-active/);
  });

  test("only one nav link is active at a time", async ({ page }) => {
    const hrefs = ['#hjem', '#om-meg', '#studiet', '#bachelor', '#kontakt'];
    for (const href of hrefs) {
      await page.locator('nav a[href="' + href + '"]').click();
      await page.waitForTimeout(900);
      const activeLinks = page.locator('nav a.nav-active');
      await expect(activeLinks).toHaveCount(1);
    }
  });
});

test.describe("Accordion component in Studiet section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("accordion exists in the studiet section", async ({ page }) => {
    const accordion = page.locator("#studiet .accordion");
    await expect(accordion).toBeVisible();
  });

  test("accordion is collapsed by default", async ({ page }) => {
    const details = page.locator("#studiet details.accordion");
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("accordion summary has correct Norwegian title", async ({ page }) => {
    const summary = page.locator("#studiet .accordion summary");
    await expect(summary).toHaveText("Oppnådd faglig kompetanse");
  });

  test("accordion expands when clicked", async ({ page }) => {
    const summary = page.locator("#studiet .accordion summary");
    await summary.click();
    const details = page.locator("#studiet details.accordion");
    await expect(details).toHaveAttribute("open", "");
    const content = page.locator("#studiet .accordion-content");
    await expect(content).toBeVisible();
  });

  test("accordion collapses when clicked again", async ({ page }) => {
    const summary = page.locator("#studiet .accordion summary");
    await summary.click();
    await expect(page.locator("#studiet details.accordion")).toHaveAttribute("open", "");
    await summary.click();
    await expect(page.locator("#studiet details.accordion")).not.toHaveAttribute("open", "");
  });

  test("accordion contains course table with correct courses", async ({ page }) => {
    const summary = page.locator("#studiet .accordion summary");
    await summary.click();
    const table = page.locator("#studiet .accordion-content .course-table");
    await expect(table).toBeVisible();
    const courseRows = page.locator("#studiet .accordion-content .course-table tbody tr:not(.semester-row)");
    await expect(courseRows).toHaveCount(18);
    await expect(courseRows.first()).toContainText("MA414");
  });

  test("accordion title switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const summary = page.locator("#studiet .accordion summary");
    await expect(summary).toHaveText("Achieved Academic Competence");
  });

  test("accordion content switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const summary = page.locator("#studiet .accordion summary");
    await summary.click();
    const firstCourse = page.locator("#studiet .accordion-content .course-table tbody tr:not(.semester-row)").first();
    await expect(firstCourse).toContainText("MA414");
    await expect(firstCourse).toContainText("Mathematics for Natural Sciences");
  });
});
