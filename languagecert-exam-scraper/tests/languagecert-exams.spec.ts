// spec: provided task plan
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { LanguageCertCataloguePage, type BlankResult, type ModuleResult } from '../pages/languagecert-catalogue.page';

type Environment = { baseUrl: string; localePath: string; cmsPathSegment?: string };
type TitledModule = ModuleResult & { title: 'price' | 'no-price' | 'zero' };
type TitledBlank = BlankResult & { title: 'blank' };
type ScrapeError = { examName: string; url: string; error: string };
const stable = <T extends { url: string }>(values: T[]) => [...values].sort((a, b) => a.url.localeCompare(b.url) || JSON.stringify(a).localeCompare(JSON.stringify(b)));
const writeJson = (file: string, value: unknown) => writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
// to-do: upgrade this to a better version
test.describe('LanguageCert exam catalogue scraper', () => {
  test('should categorize every LanguageCert exam module by price availability', async ({ page, context }) => {
    const projectRoot = path.resolve(__dirname, '..');
    const environments = JSON.parse(await readFile(path.join(projectRoot, 'config', 'environments.json'), 'utf8')) as Record<string, Environment>;
    const environmentName = process.env.LANGUAGECERT_ENV || 'production';
    const environment = environments[environmentName];
    expect(environment, `Unknown LANGUAGECERT_ENV: ${environmentName}`).toBeTruthy();
    const catalogue = new LanguageCertCataloguePage(page, environment);

    // 1. Navigate to https://www.languagecert.org/en.
    await catalogue.open();
    // 2. Hover over "Language tests" and collect every exam name and link from its dropdown.
    // 3. Hover over "UK & Australia Visa Tests" and collect every exam name and link from its dropdown.
    const exams = await catalogue.gatherExams();
    // 4. Deduplicate gathered exams and normalize links with the selected JSON environment.
    expect(exams.length, 'Expected exam links in the navigation menus').toBeGreaterThan(0);
    expect(new Set(exams.map(exam => `${exam.name.toLowerCase()}|${exam.url}`)).size).toBe(exams.length);

    const withPrice: TitledModule[] = [], noPrice: TitledModule[] = [], zeroPrice: TitledModule[] = [], blank: TitledBlank[] = [];
    const errors: ScrapeError[] = [];
    let processedExams = 0;
    const outputDirectory = path.resolve(projectRoot, process.env.LANGUAGECERT_OUTPUT_DIR || 'output');
    await mkdir(outputDirectory, { recursive: true });
    await writeJson(path.join(outputDirectory, 'gathered-exams.json'), stable(exams));
    const persistCategories = () => Promise.all([
      writeJson(path.join(outputDirectory, 'with-price.json'), stable(withPrice)),
      writeJson(path.join(outputDirectory, 'no-price.json'), stable(noPrice)),
      writeJson(path.join(outputDirectory, 'zero-price.json'), stable(zeroPrice)),
      writeJson(path.join(outputDirectory, 'blank.json'), stable(blank)),
      writeJson(path.join(outputDirectory, 'errors.json'), stable(errors)),
      writeJson(path.join(outputDirectory, 'progress.json'), {
        totalExams: exams.length,
        processedExams,
        failedExams: errors.length,
        remainingExams: exams.length - processedExams,
      }),
    ]);
    await persistCategories();
    // 5. Process small batches concurrently to avoid a slow fully-serial crawl.
    const batchSize = Math.max(1, Number(process.env.LANGUAGECERT_CONCURRENCY || 3));
    for (let start = 0; start < exams.length; start += batchSize) {
      const batch = exams.slice(start, start + batchSize);
      const batchResults = await Promise.all(batch.map(async exam => {
        const examPage = await context.newPage();
        try {
          const result = await test.step(`Scrape ${exam.name}`, () => new LanguageCertCataloguePage(examPage, environment).scrapeExam(exam));
          return { exam, result };
        } catch (error) {
          return { exam, error: error instanceof Error ? error.message : String(error) };
        } finally {
          await examPage.close().catch(() => undefined);
        }
      }));

      for (const outcome of batchResults) {
        processedExams += 1;
        if ('error' in outcome) {
          errors.push({ examName: outcome.exam.name, url: outcome.exam.url, error: outcome.error });
          continue;
        }
        if (outcome.result.blank) blank.push({ title: 'blank', ...outcome.result.blank });
        for (const module of outcome.result.modules) {
          const numericPrice = Number(module.price.replace(/[^\d.,-]/g, '').replace(',', '.'));
          if (!module.price) noPrice.push({ title: 'no-price', ...module });
          else if (Number.isFinite(numericPrice) && numericPrice === 0) zeroPrice.push({ title: 'zero', ...module });
          else withPrice.push({ title: 'price', ...module });
        }
      }
      // Checkpoint after every concurrent batch, including failed pages.
      await persistCategories();
    }

    // 8. Verify every gathered exam was processed and every result is represented exactly once.
    expect(processedExams).toBe(exams.length);
    expect(errors, `Some exam pages failed. See ${path.join(outputDirectory, 'errors.json')}`).toEqual([]);
    const categorized = [...withPrice, ...noPrice, ...zeroPrice, ...blank];
    expect(categorized.length).toBeGreaterThanOrEqual(exams.length);
    const keys = categorized.map(item => `${item.title}|${item.examName}|${item.url}|${'moduleName' in item ? item.moduleName : ''}|${'level' in item ? item.level : ''}|${'price' in item ? item.price : ''}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
