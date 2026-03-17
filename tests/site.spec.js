// @ts-check
const { test, expect } = require("@playwright/test");

const PAGE_URL = "file://" + require("path").resolve(__dirname, "../index.html");
const BACHELOR_URL = "file://" + require("path").resolve(__dirname, "../bacheloroppgave.html");

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
    const job1Title = page.locator('#bakgrunn h4[data-i18n="about.job1.title"]');
    await expect(job1Title).toBeVisible();
    await expect(job1Title).toContainText("ConocoPhillips 2023");
    const job1Text = page.locator('#bakgrunn [data-i18n="about.job1.text"]');
    await expect(job1Text).toBeVisible();
    await expect(job1Text).toContainText("biostratigrafisk database");
    const job2Title = page.locator('#bakgrunn h4[data-i18n="about.job2.title"]');
    await expect(job2Title).toBeVisible();
    const job2Text = page.locator('#bakgrunn [data-i18n-html="about.job2.text"]');
    await expect(job2Text).toBeVisible();
    await expect(job2Text).toContainText("Well Delivery");
  });

  test("timeline container is visible in Bakgrunn section", async ({ page }) => {
    const timeline = page.locator('#bakgrunn .timeline');
    await expect(timeline).toBeVisible();
    const entries = page.locator('#bakgrunn .timeline-entry');
    await expect(entries).toHaveCount(2);
  });

  test("timeline displays year ranges", async ({ page }) => {
    const dates = page.locator('#bakgrunn .timeline-date');
    await expect(dates.nth(0)).toHaveText("2024–2025");
    await expect(dates.nth(1)).toHaveText("2023–2024");
  });

  test("timeline markers are visible", async ({ page }) => {
    const markers = page.locator('#bakgrunn .timeline-marker');
    await expect(markers).toHaveCount(2);
    await expect(markers.nth(0)).toBeVisible();
    await expect(markers.nth(1)).toBeVisible();
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
