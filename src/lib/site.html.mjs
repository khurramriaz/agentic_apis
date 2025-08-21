import { PuppeteerCrawler, Configuration } from 'crawlee';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

export async function fetchHTML(url) {
    let htmlContent = '';

    // Prevent any storage on disk
    const config = new Configuration({
        persistStorage: false,  //  disables disk storage
    });

    const crawler = new PuppeteerCrawler({
        launchContext: {
            launcher: puppeteer,
            launchOptions: {
                headless: true,
                executablePath: '/usr/bin/google-chrome',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ],
            },
        },
        maxConcurrency: 1,
        requestHandlerTimeoutSecs: 60,

        async requestHandler({ page, request }) {
            await page.setViewport({
                width: 1280,
                height: 800,
            });

            await page.goto(request.url, {  waitUntil: 'networkidle0', timeout: 60000  });

            // Get fully rendered HTML after JS execution
            htmlContent = await page.content();
        }
    }, config);

    await crawler.run([url]);

    return htmlContent;
}



export function extractRSSContent(html, baseUrl = '') {
  const $ = cheerio.load(html);

  const headings = [];
  const spans = [];
  const paragraphs = [];
  const links = [];

  const seenHeadings = new Set();
  const seenSpans = new Set();
  const seenParagraphs = new Set();
  const seenLinks = new Set();

  // Headings
  $("h1, h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !seenHeadings.has(text)) {
      headings.push({ tag: el.tagName, text });
      seenHeadings.add(text);
    }
  });

  // Spans
  $("span").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !seenSpans.has(text)) {
      spans.push(text);
      seenSpans.add(text);
    }
  });

  // Paragraphs
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !seenParagraphs.has(text)) {
      paragraphs.push(text);
      seenParagraphs.add(text);
    }
  });

  // Links
  $("a[href]").each((_, el) => {
    let href = $(el).attr("href");
    const text = $(el).text().trim();
    if (href && !href.startsWith("http") && baseUrl) {
      try {
        href = new URL(href, baseUrl).href;
      } catch (e) {}
    }
    const key = `${text}|${href}`;
    if (text && href && !seenLinks.has(key)) {
      links.push({ text, href });
      seenLinks.add(key);
    }
  });

  return { 
    headings: JSON.stringify(headings), 
    spans, 
    paragraphs, 
    links: JSON.stringify(links) 
};
}
