const https = require('https');

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
    const req = https.request(url, { method: 'GET' }, (res) => {
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
        
        // Проверяем футер - более детально
        if (!data.includes('footer-socials') && !data.includes('social-links')) {
          issues.push('Missing social icons container');
        }
        
        if (!data.includes('footer-badges')) {
          issues.push('Missing footer-badges');
        }
        
        if (!data.includes('footer-menu') && !data.includes('class="links"')) {
          issues.push('Missing navigation container');
        }
        
        // Проверяем социальные иконки
        const socialIcons = ['vk.png', 'telegram.png', 'youtube.png', 'reddit.svg', 'x.svg', 'vc.svg', 'habr.svg', 'dzen.png'];
        const hasSocialIcons = socialIcons.some(icon => data.includes(icon));
        if (!hasSocialIcons) {
          issues.push('Missing social media icons');
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
        
        // Проверяем RU/EN переключатели
        if (url.includes('/en/')) {
          if (!data.includes('href="/') && !data.includes('RU')) {
            issues.push('Missing RU language link');
          }
        } else {
          if (!data.includes('href="/en/') && !data.includes('EN')) {
            issues.push('Missing EN language link');
          }
        }
        
        resolve({
          url,
          statusCode: res.statusCode,
          issues,
          success: issues.length === 0,
          contentLength: data.length
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        statusCode: 0,
        issues: [`Connection error: ${error.message}`],
        success: false,
        contentLength: 0
      });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({
        url,
        statusCode: 0,
        issues: ['Timeout (15s)'],
        success: false,
        contentLength: 0
      });
    });
    
    req.end();
  });
}

async function checkAllPages() {
  console.log('🌐 Detailed website check...\n');
  
  let totalIssues = 0;
  let successCount = 0;
  const results = [];
  
  for (const page of pages) {
    const result = await checkPage(page);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.url} - OK (${result.contentLength} bytes)`);
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
    console.log('\n⚠️  Issues found:');
    results.forEach(result => {
      if (!result.success) {
        console.log(`\n🔍 ${result.url}:`);
        result.issues.forEach(issue => {
          console.log(`   • ${issue}`);
        });
      }
    });
  }
  
  return results;
}

// Запускаем проверку
checkAllPages().catch(console.error);



