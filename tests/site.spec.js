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

test.describe("About section – background subheading", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("displays 'Min bakgrunn' subheading in Om meg section", async ({ page }) => {
    const heading = page.locator("#om-meg h3");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Min bakgrunn");
  });

  test("subheading switches to 'My background' in English", async ({ page }) => {
    await page.click(".lang-toggle");
    const heading = page.locator("#om-meg h3");
    await expect(heading).toHaveText("My background");
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
    await expect(page.locator("#contact-open-btn")).toHaveText("Contact Us");
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

  test("success message shows 'Send ny melding' button after submission", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-success")).toBeVisible();
    const newBtn = page.locator("#contact-new-btn");
    await expect(newBtn).toBeVisible();
    await expect(newBtn).toHaveText("Send ny melding");
  });

  test("'Send ny melding' button text switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-new-btn")).toHaveText("Send Another Message");
  });

  test("clicking 'Send ny melding' resets form and hides success message", async ({ page }) => {
    await page.click("#contact-open-btn");
    await page.fill("#contact-name", "Test User");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-subject", "Test Subject");
    await page.fill("#contact-message", "Hello there!");
    await page.click("#contact-privacy");
    await page.click(".form-submit");
    await expect(page.locator("#contact-success")).toBeVisible();
    await expect(page.locator("#contact-form")).toBeHidden();
    // Click the send-another button
    await page.click("#contact-new-btn");
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(page.locator("#contact-success")).toBeHidden();
    // Form fields should be cleared
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-email")).toHaveValue("");
    await expect(page.locator("#contact-subject")).toHaveValue("");
    await expect(page.locator("#contact-message")).toHaveValue("");
    await expect(page.locator("#contact-privacy")).not.toBeChecked();
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
