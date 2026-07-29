import { type Locator, type Page } from '@playwright/test';

export type ExamLink = { name: string; url: string };
export type ModuleResult = { examName: string; moduleName: string; level: string; price: string; url: string };
export type BlankResult = { examName: string; description: string; url: string };

type Environment = { baseUrl: string; localePath: string; cmsPathSegment?: string };

const PRICE_PATTERN = /(?:\u00a3|\u20ac|\$|GBP\s*|EUR\s*|USD\s*)\s*\d+(?:[.,]\d{1,2})?|\b\d+(?:[.,]\d{1,2})?\s*(?:GBP|EUR|USD)\b/i;

export class LanguageCertCataloguePage {
  private requestFilteringEnabled = false;

  constructor(private readonly page: Page, private readonly environment: Environment) {}

  private async enableRequestFiltering(): Promise<void> {
    if (!this.requestFilteringEnabled) {
      await this.page.route('**/*', async route => {
        const request = route.request();
        const resourceType = request.resourceType();
        const host = new URL(request.url()).hostname;
        const isHeavyAsset = ['image', 'media', 'font'].includes(resourceType);
        const isTracking = /google-analytics|googletagmanager|doubleclick|trustpilot/i.test(host);
        await (isHeavyAsset || isTracking ? route.abort() : route.continue());
      });
      this.requestFilteringEnabled = true;
    }
  }

  async open(): Promise<void> {
    await this.enableRequestFiltering();
    await this.page.goto(new URL(this.environment.localePath, this.environment.baseUrl).toString(), {
      waitUntil: 'domcontentloaded', timeout: 25_000,
    });
    await this.page.getByRole('button', { name: /deny|reject/i }).click({ timeout: 2_000 }).catch(() => undefined);
  }

  private normalizeUrl(href: string): string {
    const url = new URL(href, this.environment.baseUrl);
    const cms = this.environment.cmsPathSegment?.replace(/^\/+|\/+$/g, '');
    if (cms) url.pathname = url.pathname.replace(new RegExp(`^/${cms}(?=/)`, 'i'), '');
    url.hash = '';
    return url.toString();
  }

  private async visibleNavItem(name: RegExp): Promise<Locator> {
    const candidates = this.page.getByText(name, { exact: true });
    for (let index = 0; index < await candidates.count(); index += 1) {
      const item = candidates.nth(index);
      if (await item.isVisible()) return item;
    }
    throw new Error(`Navigation item not found: ${name}`);
  }

  async gatherExams(): Promise<ExamLink[]> {
    const collected: ExamLink[] = [];
    for (const menuName of [/^Language Tests$/i, /^UK & Australia Visa Tests$/i]) {
      const menu = await this.visibleNavItem(menuName);
      await menu.hover().catch(() => menu.click());
      const links = menu.locator('xpath=ancestor::li[1]').locator('a[href]');
      for (let index = 0; index < await links.count(); index += 1) {
        const link = links.nth(index);
        const href = await link.getAttribute('href');
        const name = (await link.innerText()).replace(/\s+/g, ' ').trim();
        if (href && name && /language-exams/i.test(href)) collected.push({ name, url: this.normalizeUrl(href) });
      }
    }
    // Preserve differently named menu exams even when they intentionally share one URL.
    return [...new Map(collected.map(exam => [`${exam.name.toLowerCase()}|${exam.url}`, exam])).values()]
      .sort((a, b) => a.name.localeCompare(b.name) || a.url.localeCompare(b.url));
  }

  async scrapeExam(exam: ExamLink): Promise<{ modules: ModuleResult[]; blank?: BlankResult }> {
    await this.enableRequestFiltering();
    this.page.setDefaultTimeout(5_000);
    await this.page.goto(exam.url, { waitUntil: 'domcontentloaded', timeout: 25_000 });
    const heading = await this.page.locator('h1').first().textContent({ timeout: 1_000 }).catch(() => null);
    const examName = (heading || exam.name).replace(/\s+/g, ' ').trim();

    // CSS-only candidates avoid slow broad Playwright :has-text queries on large pages.
    const rows = await this.page.locator([
      '[data-testid*="module"]', '.exam-module', '.product-card', '.exam-card', '.product-item',
      'main article', 'main .card', 'main [class*="exam-card"]', 'main [class*="product-card"]',
    ].join(',')).evaluateAll(elements => elements.map(element => {
      const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
      const heading = element.querySelector('h2,h3,h4,h5,.title,.name');
      const level = text.match(/\b(?:Pre-?A1|A1|A2|B1|B2|C1|C2)\b/i)?.[0] || '';
      const price = text.match(/(?:\u00a3|\u20ac|\$|GBP\s*|EUR\s*|USD\s*)\s*\d+(?:[.,]\d{1,2})?|\b\d+(?:[.,]\d{1,2})?\s*(?:GBP|EUR|USD)\b/i)?.[0] || '';
      return { moduleName: (heading?.textContent || text).replace(/\s+/g, ' ').trim(), level, price };
    }).filter(row => row.moduleName && (row.price || /module|written|spoken|listening|reading|writing|speaking/i.test(row.moduleName))));

    if (!rows.length) {
      const bodyText = (await this.page.locator('main').innerText({ timeout: 5_000 }).catch(() => '')) || '';
      const price = bodyText.match(PRICE_PATTERN)?.[0] || '';
      const included = bodyText.match(/What's included\s+([^\n]+)|Exam\s+([^\n]+)/i);
      const moduleName = (included?.[1] || included?.[2] || '').replace(/\s+/g, ' ').trim();
      const level = bodyText.match(/(?:Levels?|CEFR)\s*\n?\s*((?:Pre-?A1|A1|A2|B1|B2|C1)(?:\s*[-\u2013]\s*(?:A1|A2|B1|B2|C1))?)/i)?.[1] || '';
      if (moduleName || price) rows.push({ moduleName: moduleName || examName, level, price });
    }

    const unique = [...new Map(rows.map(row => [`${row.moduleName}|${row.level}|${row.price}`, row])).values()];
    if (unique.length) return { modules: unique.map(row => ({ examName, ...row, url: exam.url })) };
    const description = ((await this.page.locator('main p').first().textContent({ timeout: 5_000 }).catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    return { modules: [], blank: { examName, description, url: exam.url } };
  }
}
