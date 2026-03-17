const fs = require('fs');
const path = require('path');

// Map URL prefix → type
function inferType(href) {
  if (href.startsWith('/neighborhoods/')) return 'neighborhood';
  if (href.startsWith('/events/')) return 'event';
  if (href.startsWith('/places/')) return 'place';
  if (href.startsWith('/best-of/')) return 'best-of';
  if (href.startsWith('/news/')) return 'news';
  if (href.startsWith('/local/')) return 'local';
  if (href.startsWith('/eat-drink/')) return 'eat-drink';
  if (href.startsWith('/guides/')) return 'guide';
  if (href.startsWith('/services/')) return 'service';
  if (href.startsWith('/market-reports/')) return 'market';
  if (href.startsWith('/compare/')) return 'comparison';
  return 'guide';
}

function inferSlug(href, type) {
  const prefixes = {
    neighborhood: '/neighborhoods/',
    event: '/events/',
    place: '/places/',
    'best-of': '/best-of/',
    news: '/news/',
    local: '/local/',
    'eat-drink': '/eat-drink/',
    guide: '/guides/',
    service: '/services/',
    market: '/market-reports/',
    comparison: '/compare/',
  };
  const prefix = prefixes[type] || '/';
  return href.replace(prefix, '');
}

function fixRelated(related) {
  if (!Array.isArray(related)) return related;
  return related.map(r => {
    // Already in new format
    if (r.title && r.slug && r.type) return r;
    // In old format { label, href }
    if (r.label && r.href) {
      const type = inferType(r.href);
      const slug = inferSlug(r.href, type);
      return { title: r.label, slug, type };
    }
    return r;
  });
}

function processDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let count = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    if (content.related && Array.isArray(content.related)) {
      const fixed = fixRelated(content.related);
      if (JSON.stringify(fixed) !== JSON.stringify(content.related)) {
        content.related = fixed;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
      console.log(`Fixed: ${file}`);
      count++;
    }
  }
  return count;
}

const contentDir = path.join(__dirname, '..', 'content');
let total = 0;

for (const subdir of ['places', 'best-of', 'eat-drink', 'news', 'local', 'events', 'neighborhoods']) {
  const dir = path.join(contentDir, subdir);
  if (fs.existsSync(dir)) {
    const n = processDir(dir);
    console.log(`${subdir}: fixed ${n} files`);
    total += n;
  }
}

console.log(`\nTotal files fixed: ${total}`);
