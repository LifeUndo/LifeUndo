const https = require('https');
const http = require('http');

// Список страниц для проверки
const pages = [
  'https://lifeundo.ru',
  'https://lifeundo.ru/privacy/',
  'https://lifeundo.ru/faq/',
  'https://lifeundo.ru/changelog/',
  'https://lifeundo.ru/support/',
  'https://lifeundo.ru/pricing/',
  'https://lifeundo.ru/fund/',
  'https://lifeundo.ru/en/',
  'https://lifeundo.ru/en/privacy/',
  'https://lifeundo.ru/en/faq/',
  'https://lifeundo.ru/en/changelog/',
  'https://lifeundo.ru/en/support/',
  'https://lifeundo.ru/en/pricing/',
  'https://lifeundo.ru/en/fund/'
];

function checkPage(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, { method: 'GET' }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const issues = [];
        
        // Проверяем статус код
        if (res.statusCode !== 200) {
          issues.push(`HTTP ${res.statusCode}`);
        }
        
        // Проверяем наличие основных элементов
        if (!data.includes('<!doctype html>') && !data.includes('<!DOCTYPE html>')) {
          issues.push('Missing DOCTYPE');
        }
        
        if (!data.includes('<html')) {
          issues.push('Missing <html> tag');
        }
        
        if (!data.includes('</html>')) {
          issues.push('Missing </html> tag');
        }
        
        // Проверяем футер
        if (!data.includes('footer-socials')) {
          issues.push('Missing footer-socials');
        }
        
        if (!data.includes('footer-badges')) {
          issues.push('Missing footer-badges');
        }
        
        if (!data.includes('footer-menu')) {
          issues.push('Missing footer-menu');
        }
        
        // Проверяем социальные иконки
        if (!data.includes('vk.png') || !data.includes('telegram.png') || !data.includes('youtube.png')) {
          issues.push('Missing social icons');
        }
        
        // Проверяем бейджи
        if (!data.includes('we_give_10.svg')) {
          issues.push('Missing "We give 10%" badge');
        }
        
        if (!data.includes('fk_badge_ru_v3.svg') && !data.includes('fk_badge_en_v3.svg')) {
          issues.push('Missing FreeKassa badge');
        }
        
        // Проверяем навигацию
        if (!data.includes('Главная') && !data.includes('Home')) {
          issues.push('Missing navigation links');
        }
        
        resolve({
          url,
          statusCode: res.statusCode,
          issues,
          success: issues.length === 0
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        statusCode: 0,
        issues: [`Connection error: ${error.message}`],
        success: false
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        statusCode: 0,
        issues: ['Timeout'],
        success: false
      });
    });
    
    req.end();
  });
}

async function checkAllPages() {
  console.log('🌐 Checking website pages for errors...\n');
  
  let totalIssues = 0;
  let successCount = 0;
  
  for (const page of pages) {
    const result = await checkPage(page);
    
    if (result.success) {
      console.log(`✅ ${result.url} - OK`);
      successCount++;
    } else {
      console.log(`❌ ${result.url} - Issues: ${result.issues.join(', ')}`);
      totalIssues += result.issues.length;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Successful pages: ${successCount}/${pages.length}`);
  console.log(`❌ Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 All pages are working correctly!');
  } else {
    console.log('\n⚠️  Some pages have issues that need attention.');
  }
}

// Запускаем проверку
checkAllPages().catch(console.error);



