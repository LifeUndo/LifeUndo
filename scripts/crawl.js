#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');

const START_URL = process.env.SITE_ORIGIN || 'https://getlifeundo.com';
const MAX_DEPTH = 10;
const MAX_PAGES = 100;

const seen = new Set();
const queue = [`${START_URL}/`, `${START_URL}/en/`, `${START_URL}/ru/`];
const broken = [];
const checked = new Set();

console.log('🔗 Starting link crawl...\n');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function extractLinks(html, baseUrl) {
  const links = [];
  
  // Extract href attributes
  const hrefMatches = html.matchAll(/href="([^"#]+)"/g);
  for (const match of hrefMatches) {
    try {
      const linkUrl = new URL(match[1], baseUrl).toString();
      if (linkUrl.startsWith(START_URL)) {
        links.push(linkUrl);
      }
    } catch (error) {
      // Skip invalid URLs
    }
  }
  
  // Extract src attributes (for images, scripts, etc.)
  const srcMatches = html.matchAll(/src="([^"#]+)"/g);
  for (const match of srcMatches) {
    try {
      const linkUrl = new URL(match[1], baseUrl).toString();
      if (linkUrl.startsWith(START_URL)) {
        links.push(linkUrl);
      }
    } catch (error) {
      // Skip invalid URLs
    }
  }
  
  return links;
}

async function crawl() {
  let depth = 0;
  
  while (queue.length > 0 && depth < MAX_DEPTH && checked.size < MAX_PAGES) {
    const currentQueue = [...queue];
    queue.length = 0;
    
    console.log(`📄 Checking depth ${depth + 1} (${currentQueue.length} pages)...`);
    
    for (const url of currentQueue) {
      if (seen.has(url) || checked.has(url)) {
        continue;
      }
      
      seen.add(url);
      checked.add(url);
      
      try {
        console.log(`  Checking: ${url}`);
        const response = await fetchPage(url);
        
        if (response.status >= 400) {
          broken.push([url, response.status]);
          console.log(`    ❌ ${response.status}`);
        } else {
          console.log(`    ✅ ${response.status}`);
          
          // Extract links for next depth
          const links = extractLinks(response.body, url);
          links.forEach(link => {
            if (!seen.has(link) && !checked.has(link)) {
              queue.push(link);
            }
          });
        }
      } catch (error) {
        broken.push([url, 'ERR']);
        console.log(`    ❌ ERR: ${error.message}`);
      }
      
      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    depth++;
  }
  
  console.log(`\n📊 Crawl complete:`);
  console.log(`  Total pages checked: ${checked.size}`);
  console.log(`  Broken links: ${broken.length}`);
  
  if (broken.length > 0) {
    console.log('\n❌ Broken links found:');
    broken.forEach(([url, status]) => {
      console.log(`  ${url} - ${status}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All links are working!');
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Crawl interrupted by user');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n💥 Unexpected error:', error.message);
  process.exit(1);
});

crawl().catch(error => {
  console.error('\n💥 Crawl failed:', error.message);
  process.exit(1);
});
