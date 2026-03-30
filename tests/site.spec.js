// @ts-check
const { test, expect } = require("@playwright/test");

const PAGE_URL = "file://" + require("path").resolve(__dirname, "../index.html");
const BACHELOR_URL = "file://" + require("path").resolve(__dirname, "../bacheloroppgave.html");
const STARSTEER_URL = "file://" + require("path").resolve(__dirname, "../starsteer.html");

test.describe("Bacheloroppgave section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BACHELOR_URL);
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

  test("hero caption has no border radius", async ({ page }) => {
    const caption = page.locator("#hjem .hero-caption");
    const borderRadius = await caption.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe("0px");
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
    await expect(page.locator("[data-i18n='nav.bachelor']")).toHaveText("Bacheloroppgave");
  });

  test("switches to English when toggle is clicked", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("[data-i18n='nav.home']")).toHaveText("Home");
    await expect(page.locator("[data-i18n='hero.title']")).toHaveText("Vetle Øyvind Larsen Lunde");
    await expect(page.locator("[data-i18n='nav.bachelor']")).toHaveText("Bachelor Thesis");
  });

  test("switches back to Norwegian when toggle is clicked twice", async ({ page }) => {
    await page.click(".lang-toggle");
    await page.click(".lang-toggle");
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(page.locator("[data-i18n='nav.home']")).toHaveText("Hjem");
    await expect(page.locator("[data-i18n='nav.bachelor']")).toHaveText("Bacheloroppgave");
  });

  test("updates page title on language switch", async ({ page }) => {
    await expect(page).toHaveTitle("Vetle – Geologi og Geofare");
    await page.click(".lang-toggle");
    await expect(page).toHaveTitle(/Geology and Geo-Hazards/);
  });

  test("updates image alt texts on language switch", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const img = page.locator("[data-i18n-alt='bachelor.img1.alt']");
    await expect(img).toHaveAttribute("alt", "Bacheloroppgave – feltarbeid bilde 1");
    await page.click(".lang-toggle");
    await expect(img).toHaveAttribute("alt", "Bachelor thesis – fieldwork photo 1");
  });

  test("bachelor page defaults to Norwegian and switches to English", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    await expect(page.locator("[data-i18n='bachelor.title']")).toHaveText("Bacheloroppgave");
    await page.click(".lang-toggle");
    await expect(page.locator("[data-i18n='bachelor.title']")).toHaveText("Bachelor Thesis");
    await expect(page.locator("[data-i18n='bachelor.caption1']")).toHaveText("The beautiful nature of Trøndelag");
    await expect(page.locator("[data-i18n='bachelor.caption2']")).toHaveText("Steep mountain sides");
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

  test("displays job history entries in Bakgrunn section", async ({ page }) => {
    const titles = page.locator('#bakgrunn h4.job-title');
    await expect(titles).toHaveCount(4);
    const job1Text = page.locator('#bakgrunn [data-i18n="about.job1.text"]');
    await expect(job1Text).toBeVisible();
    await expect(job1Text).toContainText("biostratigrafisk database");
    const job2Text = page.locator('#bakgrunn [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toBeVisible();
    await expect(job2Text).toContainText("Well Delivery");
  });

  test("displays ConocoPhillips text titles beside job entries", async ({ page }) => {
    const titles = page.locator('#bakgrunn h4.job-title');
    await expect(titles).toHaveCount(4);
    await expect(titles.nth(0)).toHaveText("ConocoPhillips");
    await expect(titles.nth(1)).toHaveText("ConocoPhillips");
    await expect(titles.nth(2)).toHaveText("Vaktsoldat – Akershus Festning");
    await expect(titles.nth(3)).toHaveText("Renovasjonen IKS");
  });

  test("timeline container is visible in Bakgrunn section", async ({ page }) => {
    const timeline = page.locator('#bakgrunn .timeline');
    await expect(timeline).toBeVisible();
    const entries = page.locator('#bakgrunn .timeline-entry');
    await expect(entries).toHaveCount(4);
  });

  test("timeline displays year range labels on the left", async ({ page }) => {
    const dates = page.locator('#bakgrunn .timeline-date');
    await expect(dates).toHaveCount(4);
    await expect(dates.nth(0)).toHaveText("2025");
    await expect(dates.nth(1)).toHaveText("2024");
    await expect(dates.nth(2)).toHaveText("2022–2023");
    await expect(dates.nth(3)).toHaveText("2021–2022");
  });

  test("timeline markers are visible", async ({ page }) => {
    const markers = page.locator('#bakgrunn .timeline-marker');
    await expect(markers).toHaveCount(4);
    await expect(markers.nth(0)).toBeVisible();
    await expect(markers.nth(1)).toBeVisible();
    await expect(markers.nth(2)).toBeVisible();
    await expect(markers.nth(3)).toBeVisible();
  });

  test("job history switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const job1Text = page.locator('#bakgrunn [data-i18n="about.job1.text"]');
    await expect(job1Text).toContainText("biostratigraphic database");
    const job2Text = page.locator('#bakgrunn [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toContainText("Well Delivery");
    await expect(job2Text).toContainText("Ekofisk field");
  });

  test("job2 text contains Ekofisk description", async ({ page }) => {
    const job2Text = page.locator('#bakgrunn [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toContainText("Ekofiskfeltet");
    await expect(job2Text).toContainText("StarSteer");
  });

  test("job0 text contains Akershus Festning description", async ({ page }) => {
    const job0Text = page.locator('#bakgrunn [data-i18n="about.job0.text"]');
    await expect(job0Text).toContainText("Akershus festning");
    await expect(job0Text).toContainText("vaktsoldat");
  });

  test("job0 switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const job0Text = page.locator('#bakgrunn [data-i18n="about.job0.text"]');
    await expect(job0Text).toContainText("Akershus Fortress");
    await expect(job0Text).toContainText("guard soldier");
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

test.describe("Contact section link buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("contact section has email, GitHub, and LinkedIn buttons", async ({ page }) => {
    const emailBtn = page.locator('.contact-link-btn[href^="mailto:"]');
    const githubBtn = page.locator('.contact-link-btn[href*="github.com"]');
    const linkedinBtn = page.locator('.contact-link-btn[href*="linkedin.com"]');
    await expect(emailBtn).toBeVisible();
    await expect(githubBtn).toBeVisible();
    await expect(linkedinBtn).toBeVisible();
  });

  test("email button has correct mailto link", async ({ page }) => {
    const emailBtn = page.locator('.contact-link-btn[href^="mailto:"]');
    await expect(emailBtn).toHaveAttribute("href", "mailto:vetleoyvind@yahoo.com");
  });

  test("GitHub button links to correct profile", async ({ page }) => {
    const githubBtn = page.locator('.contact-link-btn[href*="github.com"]');
    await expect(githubBtn).toHaveAttribute("href", "https://github.com/Lundev42");
  });

  test("LinkedIn button links to correct profile", async ({ page }) => {
    const linkedinBtn = page.locator('.contact-link-btn[href*="linkedin.com"]');
    await expect(linkedinBtn).toHaveAttribute("href", "https://www.linkedin.com/in/vetle-lunde-3844753b6/");
  });

  test("buttons have text labels", async ({ page }) => {
    await expect(page.locator('.contact-link-btn[href^="mailto:"]')).toContainText("E-post");
    await expect(page.locator('.contact-link-btn[href*="github.com"]')).toContainText("GitHub");
    await expect(page.locator('.contact-link-btn[href*="linkedin.com"]')).toContainText("LinkedIn");
  });

  test("button labels switch to English", async ({ page }) => {
    await page.click(".lang-toggle");
    await expect(page.locator('.contact-link-btn[href^="mailto:"]')).toContainText("Email");
    await expect(page.locator('.contact-link-btn[href*="github.com"]')).toContainText("GitHub");
    await expect(page.locator('.contact-link-btn[href*="linkedin.com"]')).toContainText("LinkedIn");
  });

  test("external links open in new tab", async ({ page }) => {
    const githubBtn = page.locator('.contact-link-btn[href*="github.com"]');
    const linkedinBtn = page.locator('.contact-link-btn[href*="linkedin.com"]');
    await expect(githubBtn).toHaveAttribute("target", "_blank");
    await expect(linkedinBtn).toHaveAttribute("target", "_blank");
  });

  test("external links have rel noopener noreferrer", async ({ page }) => {
    const githubBtn = page.locator('.contact-link-btn[href*="github.com"]');
    const linkedinBtn = page.locator('.contact-link-btn[href*="linkedin.com"]');
    await expect(githubBtn).toHaveAttribute("rel", "noopener noreferrer");
    await expect(linkedinBtn).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("buttons have aria-labels", async ({ page }) => {
    await expect(page.locator('.contact-link-btn[href^="mailto:"]')).toHaveAttribute("aria-label", "Send e-post");
    await expect(page.locator('.contact-link-btn[href*="github.com"]')).toHaveAttribute("aria-label", "GitHub");
    await expect(page.locator('.contact-link-btn[href*="linkedin.com"]')).toHaveAttribute("aria-label", "LinkedIn");
  });

  test("contact text is displayed on a single line", async ({ page }) => {
    const p = page.locator("#kontakt p");
    const style = await p.evaluate(el => getComputedStyle(el).whiteSpace);
    expect(style).toBe("nowrap");
  });

  test("email button has envelope icon", async ({ page }) => {
    const icon = page.locator('.contact-link-btn[href^="mailto:"] i.fa-envelope');
    await expect(icon).toBeAttached();
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  test("GitHub button has GitHub icon", async ({ page }) => {
    const icon = page.locator('.contact-link-btn[href*="github.com"] i.fa-github');
    await expect(icon).toBeAttached();
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  test("LinkedIn button has LinkedIn icon", async ({ page }) => {
    const icon = page.locator('.contact-link-btn[href*="linkedin.com"] i.fa-linkedin');
    await expect(icon).toBeAttached();
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  test("icons appear before text in buttons", async ({ page }) => {
    const emailBtn = page.locator('.contact-link-btn[href^="mailto:"]');
    const firstChild = emailBtn.locator('> :first-child');
    await expect(firstChild).toHaveClass(/fa-envelope/);
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

  test("bachelor nav link points to bacheloroppgave.html", async ({ page }) => {
    const bachelorLink = page.locator('nav a[href="bacheloroppgave.html"]');
    await expect(bachelorLink).toBeVisible();
    await expect(bachelorLink).toHaveAttribute("href", "bacheloroppgave.html");
  });

  test("clicking kontakt nav link highlights it", async ({ page }) => {
    await page.locator('nav a[href="#kontakt"]').click();
    await page.waitForTimeout(900);
    const kontaktLink = page.locator('nav a[href="#kontakt"]');
    await expect(kontaktLink).toHaveClass(/nav-active/);
  });

  test("only one nav link is active at a time", async ({ page }) => {
    const hrefs = ['#hjem', '#om-meg', '#bakgrunn', '#kontakt'];
    for (const href of hrefs) {
      await page.locator('nav a[href="' + href + '"]').click();
      await page.waitForTimeout(900);
      const activeLinks = page.locator('nav a.nav-active');
      await expect(activeLinks).toHaveCount(1);
    }
  });
});

test.describe("Multi-page navigation", () => {
  test("index.html bachelor nav link points to bacheloroppgave.html", async ({ page }) => {
    await page.goto(PAGE_URL);
    const link = page.locator('nav a[data-i18n="nav.bachelor"]');
    await expect(link).toHaveAttribute("href", "bacheloroppgave.html");
  });

  test("bacheloroppgave.html has nav links back to index.html", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    await expect(page.locator('nav a[data-i18n="nav.home"]')).toHaveAttribute("href", "index.html#hjem");
    await expect(page.locator('nav a[data-i18n="nav.about"]')).toHaveAttribute("href", "index.html#om-meg");
    await expect(page.locator('nav a[data-i18n="nav.background"]')).toHaveAttribute("href", "index.html#bakgrunn");
    await expect(page.locator('nav a[data-i18n="nav.contact"]')).toHaveAttribute("href", "index.html#kontakt");
  });

  test("bacheloroppgave.html bachelor link points to #bachelor", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    await expect(page.locator('nav a[data-i18n="nav.bachelor"]')).toHaveAttribute("href", "#bachelor");
  });
});

test.describe("Accordion component in Bakgrunn section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("accordion exists in the bakgrunn section", async ({ page }) => {
    const accordion = page.locator("#bakgrunn .accordion");
    await expect(accordion.first()).toBeVisible();
  });

  test("accordion is collapsed by default", async ({ page }) => {
    const details = page.locator("#bakgrunn details.accordion").first();
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("study subsection heading has correct Norwegian title", async ({ page }) => {
    const heading = page.locator('h3[data-i18n="background.study.title"]');
    await expect(heading).toHaveText("Faglig bakgrunn");
  });

  test("nested accordion contains course table with correct courses", async ({ page }) => {
    const nestedSummary = page.locator('summary[data-i18n="study.accordion.title"]');
    await nestedSummary.click();
    const table = page.locator("#bakgrunn .course-table");
    await expect(table).toBeVisible();
    const courseRows = page.locator("#bakgrunn .course-table tbody tr:not(.semester-row)");
    await expect(courseRows).toHaveCount(18);
    await expect(courseRows.first()).toContainText("MA414");
  });

  test("study subsection heading switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const heading = page.locator('h3[data-i18n="background.study.title"]');
    await expect(heading).toHaveText("Academic background");
  });

  test("nested accordion content switches to English", async ({ page }) => {
    await page.click(".lang-toggle");
    const nestedSummary = page.locator('summary[data-i18n="study.accordion.title"]');
    await nestedSummary.click();
    const firstCourse = page.locator("#bakgrunn .course-table tbody tr:not(.semester-row)").first();
    await expect(firstCourse).toContainText("MA414");
    await expect(firstCourse).toContainText("Mathematics for Natural Sciences");
  });
});

test.describe("Footer copyright", () => {
  test("footer shows '© 2026 Vetle Lunde' on index", async ({ page }) => {
    await page.goto(PAGE_URL);
    const footer = page.locator("footer");
    await expect(footer).toContainText("2026 Vetle Lunde");
  });

  test("footer shows '© 2026 Vetle Lunde' on bacheloroppgave", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const footer = page.locator("footer");
    await expect(footer).toContainText("2026 Vetle Lunde");
  });
});

test.describe("StarSteer link", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test("StarSteer text is a link to starsteer.html", async ({ page }) => {
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText("StarSteer");
  });

  test("StarSteer link opens in same tab (no target=_blank)", async ({ page }) => {
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    await expect(link).not.toHaveAttribute("target", "_blank");
    const target = await link.getAttribute("target");
    expect(target).toBeNull();
  });

  test("StarSteer link has no underline", async ({ page }) => {
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    const textDecoration = await link.evaluate(el => getComputedStyle(el).textDecorationLine);
    expect(textDecoration).toBe("none");
  });

  test("StarSteer link visited colour matches accent colour", async ({ page }) => {
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    // Verify the link color matches --accent (the :visited rule re-applies the accent colour)
    const { linkColor, accentColor } = await link.evaluate(el => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      // Create a temporary element to resolve the CSS variable to an rgb value
      const tmp = document.createElement("span");
      tmp.style.color = "var(--accent)";
      document.body.appendChild(tmp);
      const resolved = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      return { linkColor: getComputedStyle(el).color, accentColor: resolved };
    });
    expect(linkColor).toBe(accentColor);
  });

  test("StarSteer link is also present in English", async ({ page }) => {
    await page.click(".lang-toggle");
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText("StarSteer");
  });

  test("StarSteer link in English has no target=_blank", async ({ page }) => {
    await page.click(".lang-toggle");
    const link = page.locator('#bakgrunn [data-i18n-html="about.job2.text"] a[href="starsteer.html"]');
    await expect(link).not.toHaveAttribute("target", "_blank");
  });
});

test.describe("StarSteer page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STARSTEER_URL);
  });

  test("has a footer with '© 2026 Vetle Lunde'", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("2026 Vetle Lunde");
  });

  test("has nav links back to index.html", async ({ page }) => {
    await expect(page.locator('nav a[data-i18n="nav.home"]')).toHaveAttribute("href", "index.html#hjem");
  });

  test("contains StarSteer content", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toContainText("StarSteer");
  });
});

test.describe("Accessibility improvements", () => {
  test("nav has aria-label on index page", async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator("nav")).toHaveAttribute("aria-label", "Hovednavigasjon");
  });

  test("nav has aria-label on bacheloroppgave page", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    await expect(page.locator("nav")).toHaveAttribute("aria-label", "Hovednavigasjon");
  });

  test("nav has aria-label on starsteer page", async ({ page }) => {
    await page.goto(STARSTEER_URL);
    await expect(page.locator("nav")).toHaveAttribute("aria-label", "Hovednavigasjon");
  });

  test("nav aria-label switches to English", async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.click(".lang-toggle");
    await expect(page.locator("nav")).toHaveAttribute("aria-label", "Main navigation");
  });

  test("below-the-fold images have loading=lazy on index", async ({ page }) => {
    await page.goto(PAGE_URL);
    const aboutImg = page.locator('#om-meg img[src="IMG_8394.jpeg"]');
    await expect(aboutImg).toHaveAttribute("loading", "lazy");
    const studyImg = page.locator('img[src*="FalkeblikkAS"]');
    await expect(studyImg).toHaveAttribute("loading", "lazy");
  });

  test("gallery images have loading=lazy on bacheloroppgave", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const imgs = page.locator("#bachelor .gallery-grid img");
    await expect(imgs.nth(0)).toHaveAttribute("loading", "lazy");
    await expect(imgs.nth(1)).toHaveAttribute("loading", "lazy");
  });

  test("images have width and height attributes on index", async ({ page }) => {
    await page.goto(PAGE_URL);
    const hvlImg = page.locator('img[src*="FalkeblikkAS"]');
    await expect(hvlImg).toHaveAttribute("width");
    await expect(hvlImg).toHaveAttribute("height");
  });

  test("images have width and height attributes on bacheloroppgave", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const imgs = page.locator("#bachelor .gallery-grid img");
    await expect(imgs.nth(0)).toHaveAttribute("width");
    await expect(imgs.nth(0)).toHaveAttribute("height");
  });

  test("bacheloroppgave page has an h1 element", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("starsteer page has an h1 element", async ({ page }) => {
    await page.goto(STARSTEER_URL);
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("SEO improvements", () => {
  test("index has canonical URL", async ({ page }) => {
    await page.goto(PAGE_URL);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://Lundev42.github.io/vetle-lunde-site/");
  });

  test("bacheloroppgave has correct canonical URL", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://Lundev42.github.io/vetle-lunde-site/bacheloroppgave.html");
  });

  test("starsteer has correct canonical URL", async ({ page }) => {
    await page.goto(STARSTEER_URL);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://Lundev42.github.io/vetle-lunde-site/starsteer.html");
  });

  test("bacheloroppgave has correct og:url", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", "https://Lundev42.github.io/vetle-lunde-site/bacheloroppgave.html");
  });

  test("all pages have og:image meta tag", async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    await page.goto(BACHELOR_URL);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    await page.goto(STARSTEER_URL);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });
});

test.describe('Motion design (impeccable skill)', function () {
  test('CSS motion tokens are defined in :root', async function ({ page }) {
    await page.goto(PAGE_URL);
    var easeOutQuart = await page.evaluate(function () {
      return getComputedStyle(document.documentElement).getPropertyValue('--ease-out-quart').trim();
    });
    expect(easeOutQuart).toBe('cubic-bezier(0.25, 1, 0.5, 1)');
    var easeOutExpo = await page.evaluate(function () {
      return getComputedStyle(document.documentElement).getPropertyValue('--ease-out-expo').trim();
    });
    expect(easeOutExpo).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
  });

  test('about sub-gallery contains three clickable figures', async function ({ page }) {
    await page.goto(PAGE_URL);
    var figures = page.locator('.about-sub-gallery .gallery-thumb');
    var count = await figures.count();
    expect(count).toBe(3);
  });

  test('interactive elements have active pressed states', async function ({ page }) {
    await page.goto(PAGE_URL);
    var hasActiveRule = await page.evaluate(function () {
      var sheets = document.styleSheets;
      for (var s = 0; s < sheets.length; s++) {
        try {
          var rules = sheets[s].cssRules;
          for (var r = 0; r < rules.length; r++) {
            if (rules[r].selectorText && rules[r].selectorText.indexOf('.contact-link-btn:active') !== -1) {
              return true;
            }
          }
        } catch (e) {}
      }
      return false;
    });
    expect(hasActiveRule).toBe(true);
  });

  test('images have hover lift transform', async function ({ page }) {
    await page.goto(PAGE_URL);
    var hasHoverRule = await page.evaluate(function () {
      var sheets = document.styleSheets;
      for (var s = 0; s < sheets.length; s++) {
        try {
          var rules = sheets[s].cssRules;
          for (var r = 0; r < rules.length; r++) {
            if (rules[r].selectorText && rules[r].selectorText.indexOf('.media-col img:hover') !== -1) {
              return true;
            }
          }
        } catch (e) {}
      }
      return false;
    });
    expect(hasHoverRule).toBe(true);
  });

  test('prefers-reduced-motion is respected', async function ({ page }) {
    await page.goto(PAGE_URL);
    var hasReducedMotion = await page.evaluate(function () {
      var sheets = document.styleSheets;
      for (var s = 0; s < sheets.length; s++) {
        try {
          var rules = sheets[s].cssRules;
          for (var r = 0; r < rules.length; r++) {
            if (rules[r].conditionText && rules[r].conditionText.indexOf('prefers-reduced-motion') !== -1) {
              return true;
            }
          }
        } catch (e) {}
      }
      return false;
    });
    expect(hasReducedMotion).toBe(true);
  });
});

/* ── CSS Fix Tests ── */

test.describe("Profile image dark-mode shadow (Fix 1)", () => {
  test("dark mode uses light shadow", async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    const figure = page.locator("#om-meg .media-col figure");
    const shadow = await figure.evaluate(el => getComputedStyle(el).boxShadow);
    // Dark mode default: light rgba(255,255,255,0.08) shadow
    expect(shadow).toContain("255");
  });

  test("light mode uses dark shadow", async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
    const figure = page.locator("#om-meg .media-col figure");
    const shadow = await figure.evaluate(el => getComputedStyle(el).boxShadow);
    // Light mode: dark rgba(0,0,0,0.25) shadow
    expect(shadow).not.toContain("255");
  });
});

test.describe("Navigation active highlighting in light mode (Fix 2)", () => {
  function hasLightNavActiveRule() {
    var sheets = document.styleSheets;
    for (var s = 0; s < sheets.length; s++) {
      try {
        var rules = sheets[s].cssRules;
        for (var r = 0; r < rules.length; r++) {
          if (rules[r].selectorText &&
              rules[r].selectorText.indexOf('[data-theme="light"] nav a.nav-active') !== -1) {
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  }

  test("index.html has light-mode nav-active rule", async ({ page }) => {
    await page.goto(PAGE_URL);
    const hasRule = await page.evaluate(hasLightNavActiveRule);
    expect(hasRule).toBe(true);
  });

  test("bacheloroppgave.html has light-mode nav-active rule", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const hasRule = await page.evaluate(hasLightNavActiveRule);
    expect(hasRule).toBe(true);
  });
});

test.describe("Navigation bar vertical centering (Fix 3)", () => {
  test("index.html nav ul has align-items center", async ({ page }) => {
    await page.goto(PAGE_URL);
    const alignItems = await page.locator("nav ul").evaluate(el => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("center");
  });

  test("bacheloroppgave.html nav ul has align-items center", async ({ page }) => {
    await page.goto(BACHELOR_URL);
    const alignItems = await page.locator("nav ul").evaluate(el => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("center");
  });

  test("starsteer.html nav ul has align-items center", async ({ page }) => {
    await page.goto(STARSTEER_URL);
    const alignItems = await page.locator("nav ul").evaluate(el => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("center");
  });
});

test.describe("Gallery caption fade on hover (Fix 4)", () => {
  test("caption is hidden by default", async ({ page }) => {
    await page.goto(PAGE_URL);
    const caption = page.locator(".about-sub-gallery .gallery-thumb figcaption").first();
    const opacity = await caption.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe("0");
  });

  test("caption becomes visible on hover", async ({ page }) => {
    await page.goto(PAGE_URL);
    const thumb = page.locator(".about-sub-gallery .gallery-thumb").first();
    await thumb.hover();
    const caption = thumb.locator("figcaption");
    await expect(caption).toHaveCSS("opacity", "1");
  });
});
