const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log("Installing browser binaries if needed...");
  
  const browser = await chromium.launch({ headless: true });
  
  const destDir = 'C:\\Users\\khuny\\Desktop\\Code\\team-10\\ch-6\\iamyeaung\\screenshots';
  if (!fs.existsSync(destDir)){
      fs.mkdirSync(destDir, { recursive: true });
  }

  const contexts = [
    { name: 'desktop', viewport: { width: 1280, height: 800 } },
    { name: 'mobile', viewport: { width: 390, height: 844 } }
  ];

  for (const ctx of contexts) {
    console.log(`Capturing for ${ctx.name}...`);
    const context = await browser.newContext({ viewport: ctx.viewport });
    const page = await context.newPage();

    // 1. Landing Page
    console.log("Capturing 01...");
    await page.goto('http://localhost:3000/en');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(destDir, `01-${ctx.name}.png`), fullPage: false });

    // 3. Admin Login Page
    console.log("Capturing 03...");
    await page.goto('http://localhost:3000/en/admin/login');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(destDir, `03-${ctx.name}.png`), fullPage: false });

    // Try to login for Dashboard (02.png) in Myanmar Language
    console.log("Attempting login for 02...");
    await page.goto('http://localhost:3000/mm/admin/login');
    try {
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'password');
        await page.click('button:has-text("ဝင်ရောက်မည်")'); 
    } catch (e) {
        try {
            await page.click('button[type="submit"]');
        } catch(e2) {}
    }
    await page.waitForTimeout(3000);
    
    console.log("Capturing 02...");
    await page.goto('http://localhost:3000/mm/admin');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(destDir, `02-${ctx.name}.png`), fullPage: false });

    await context.close();
  }

  await browser.close();
  console.log("Done!");
})();
