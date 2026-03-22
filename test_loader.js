const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Throttle CPU and Network to capture the loader
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 100 * 1024,
    uploadThroughput: 100 * 1024,
    latency: 200,
  });
  
  await page.setViewport({ width: 1280, height: 800 });
  
  const url = 'file:///home/sassy/ps/VSCProjects/Kahani Resto/website/index.html';
  
  // Go to page but don't wait for network idle so we catch the loader
  page.goto(url);
  
  // Wait a short bit
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/home/sassy/ps/VSCProjects/Kahani Resto/loader1.png' });
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/sassy/ps/VSCProjects/Kahani Resto/loader2.png' });
  
  await browser.close();
})();
