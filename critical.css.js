const path = require('path');
const chalk = require('chalk');
const distAssetFolder = './dist/assets/';
const distSnippetFolder = './dist/snippets';
const fs = require('fs');
const CleanCSS = require('clean-css');
const puppeteer = require('puppeteer');
const penthouse = require('penthouse');
const read = require('read-yaml');
const config = read.sync('./config.yml');
const theme = config[process.env.ENV_THEMEKIT];
const { critical, criticalViewports } = require("./package.json");

const criticalInlineCss = {};

// const createPupeteerBrowser = () => {
//   const browserPromise = puppeteer.launch({
//     ignoreHTTPSErrors: true,
//     defaultViewport: {
//       width: 320,
//       height: 480
//     }
//   }).then( async browser => {
//     page = await browser.newPage();
//     await page.goto(`https://${theme.store}/password`)
//     await page.type('#password', theme.gatekey);
//     await page.click('button[type="submit"]');
//     await page.close();
//     return browser;
//   });
//   return browserPromise;
// }

// Optimize combined and deduped css rules
const cleanUpCSS = (css) => new CleanCSS({
    rebase: false,
    level: {
      1: {
        all: true,
      },
      2: {
        all: false,
        removeDuplicateFontRules: true,
        removeDuplicateMediaBlocks: true,
        removeDuplicateRules: true,
        removeEmpty: true,
        mergeMedia: true,
      },
    }
  }).minify(css).styles;

let requestList = fs.readdirSync(distAssetFolder).map(file => {
  if (file.includes('latori-theme.') && file.includes('.css')) {
    const templateName = file.replace('latori-theme.','').replace('.css','');
    const criticalSettings = critical.find(setting => setting.template === templateName);
    if (criticalSettings) {
      return {
        baseName: templateName,
        url: criticalSettings.url,
        path: path.resolve(distAssetFolder, file)
      };
    }
  }
}).filter(Boolean);

// Dimensions need to be sorted from small to wide. Otherwise the order gets corrupted
const viewports = criticalViewports.slice().sort((a, b) => (a.width || 0) - (b.width || 0));
// update requestlist to resolve sequential requests to prevent rejection of requests by Shopify
const tempRequestList = [...requestList];
requestList = [];

tempRequestList.forEach(requestEntry => {
  viewports.forEach(viewport => {
    requestList.push({
      baseName: requestEntry.baseName,
      url: requestEntry.url,
      path: requestEntry.path,
      viewport: {
        width: viewport.width,
        height: viewport.height
      }
    })
  });
});

return new Promise((resolve,reject) => {

  const callPenthouseRecursive = async (requestList) => {

    const request = requestList.shift();

    let protected_key = '';
    let protected_bt = '';

    if (theme.config && theme.config.protected_key && theme.config.protected_key != '') {
      protected_key = `?key=${theme.config.protected_key}`;
    }

    if (theme.config && theme.config.protected_bt && theme.config.protected_bt != '') {
      protected_key = `?_bt=${theme.config.protected_bt}`;
    }

    const penthouseOptions = {
      url: `https://${theme.store}${request.url}${protected_key}${protected_bt}`,
      css: request.path,
      width: request.viewport.width,
      height: request.viewport.height,
      renderWaitTime: 2000
    };

    // if (theme.protected) {
    //   penthouseOptions.puppeteer = { getBrowser: () => createPupeteerBrowser() };
    // }
    console.log(chalk.magenta(`now fetching for template "${request.baseName}" on ${request.url} with viewport width ${request.viewport.width} and height ${request.viewport.height}`));
    await penthouse(penthouseOptions).then(criticalCss => {
      console.log('⌙ Done ✅');
      if (criticalCss != '') {
        if (!criticalInlineCss[request.baseName]) {
          criticalInlineCss[request.baseName] = criticalCss;
        } else {
          criticalInlineCss[request.baseName] = criticalInlineCss[request.baseName] + criticalCss;
        }
      }
      if (requestList.length !== 0) {
        callPenthouseRecursive(requestList)
      } else {
        resolve();
      }
    }).catch(err => console.log(err))
  }

  callPenthouseRecursive(requestList);

}).then(
  () => {
    
    if (Object.keys(criticalInlineCss).length) {
      console.log(chalk.green(`writing critical styles for:`));
      let criticalInline = '<style>';
      Object.keys(criticalInlineCss).forEach((key, i) => {
        console.log(chalk.green(`- ${key}`));
        if (key === 'main') {
          criticalInline += `${cleanUpCSS(criticalInlineCss[key])}`;
        } else {
          criticalInline += `{% if template.name == '${key}' %}${cleanUpCSS(criticalInlineCss[key])}{% endif %}`;
        }
      });
      criticalInline += '</style>';
      console.log('⌙ Done ✅');
      console.log(chalk.cyan(`✨ updating snippet "critical-style.liquid"`));
      fs.writeFile(`${distSnippetFolder}/critical-style.liquid`, criticalInline, (err) => {
        if (err) throw err;
        console.log('⌙ Done ✅');
        console.log('Now uploading to Shopify...');
        process.exit();
      });
    } else {
      console.log('✅ Finished task. No critical styles to export.');
      process.exit();
    }
  }
).catch(err => console.log(err));