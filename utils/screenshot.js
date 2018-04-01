'use strict';

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const sites = process.argv.slice(2);

(async () => {

    const date = new Date(Date.now()).toISOString();

    // gotten from the chrome I used when writing this
    const ua_chrome_windows = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36";
    const desktop1440 = {
        name: 'Desktop 1440p',
        userAgent: ua_chrome_windows,
        viewport: {
            width: 2560,
            height: 1440,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            isLandscape: true
        }
    };
    const desktop1080 = {
        name: 'Desktop 1080p',
        userAgent: ua_chrome_windows,
        viewport: {
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: true,
            isLandscape: true
        }
    };

    const chosenDevices = [desktop1440, desktop1080, devices['Nexus 5X'], devices['iPad landscape']];

    let browser;
    let page;

    const init = async () => {
        if (browser) await browser.close;
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        page = await browser.newPage();
    };

    await init();

    for (const site of sites) {
        console.log('trying ' + site);
        for (const device of chosenDevices) {

            await page.emulate(device);

            // TODO: use a saner way of sanitizing the url for file system use
            const pathToImage = '' + date + '_' + device.name + '_' + site.split('/').join('-');
            const url = 'http://' + site;

            const recover = async (err) => {
                console.log(err);
                await init();
                await page.emulate(device);
            };

            const screenshot = async () => {
                await page.screenshot({path: pathToImage + '.png', fullPage: false});
                await page.screenshot({path: pathToImage + '_fullpage.png', fullPage: true});
                console.log('done ' + device.name);
            };

            try {
                // networkidle0 waits until 0 network requests are open for a continuous 500ms
                await page.goto(url, {timeout: 30000, waitUntil: "networkidle0"});
                await screenshot();
            } catch (err) {
                try {
                    await recover(err);
                    // networkidle2 waits until at most 2 network requests are open for a continuous 500ms
                    // useful for those websites that keep one or two open at all time, like infinite scrollers
                    await page.goto(url, {timeout: 30000, waitUntil: "networkidle2"});
                    await screenshot();
                } catch (err2) {
                    // if none of this works, simply fail this request
                    await recover(err2);
                    continue;
                }
            }
        }
    }

    if (browser) await browser.close;
})();
