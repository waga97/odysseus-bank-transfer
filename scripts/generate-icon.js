const fs = require('fs');
const path = require('path');

// Globe icon SVG path (from Feather icons - same as used in the app)
const globeSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Black background -->
  <rect width="1024" height="1024" fill="#1a1a1a"/>

  <!-- Globe icon centered and scaled -->
  <g transform="translate(256, 256) scale(21.33)">
    <!-- Circle -->
    <circle cx="12" cy="12" r="10" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Horizontal line -->
    <line x1="2" y1="12" x2="22" y2="12" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Ellipse (globe curve) -->
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Adaptive icon foreground (just the globe, no background - Android uses backgroundColor)
const adaptiveSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Transparent background for adaptive icon -->
  <rect width="1024" height="1024" fill="transparent"/>

  <!-- Globe icon centered with padding for safe zone -->
  <g transform="translate(312, 312) scale(16.67)">
    <!-- Circle -->
    <circle cx="12" cy="12" r="10" fill="none" stroke="#f5a623" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Horizontal line -->
    <line x1="2" y1="12" x2="22" y2="12" stroke="#f5a623" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Ellipse (globe curve) -->
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="#f5a623" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Favicon (smaller, simpler)
const faviconSvg = `
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#1a1a1a"/>
  <g transform="translate(8, 8) scale(1.33)">
    <circle cx="12" cy="12" r="10" fill="none" stroke="#f5a623" stroke-width="2"/>
    <line x1="2" y1="12" x2="22" y2="12" stroke="#f5a623" stroke-width="2"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="#f5a623" stroke-width="2"/>
  </g>
</svg>
`;

// Save SVG files
const assetsDir = path.join(__dirname, '..', 'assets', 'images');

fs.writeFileSync(path.join(assetsDir, 'icon.svg'), globeSvg.trim());
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveSvg.trim());
fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), faviconSvg.trim());

console.log('SVG icons generated in assets/images/');
console.log('');
console.log('To convert to PNG, you can use one of these methods:');
console.log('');
console.log('1. Online: https://svgtopng.com/ (upload and set size to 1024x1024)');
console.log('2. Using sharp: npm install sharp && node -e "require(\'sharp\')(\'assets/images/icon.svg\').resize(1024).png().toFile(\'assets/images/icon.png\')"');
console.log('3. Using Inkscape: inkscape -w 1024 -h 1024 assets/images/icon.svg -o assets/images/icon.png');
console.log('');
console.log('Required sizes:');
console.log('- icon.png: 1024x1024');
console.log('- adaptive-icon.png: 1024x1024');
console.log('- favicon.png: 48x48');
