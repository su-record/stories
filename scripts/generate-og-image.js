// Simple OG image generator using Node.js canvas
// Creates a 1200x630 PNG image for social media

const fs = require('fs');
const path = require('path');

// Create a simple HTML file that can be screenshot
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      position: relative;
      overflow: hidden;
    }
    .bg-pattern {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
    }
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 60px;
    }
    .emoji {
      font-size: 96px;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 72px;
      font-weight: 700;
      margin-bottom: 30px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .subtitle {
      font-size: 40px;
      font-weight: 400;
      margin-bottom: 20px;
      opacity: 0.95;
    }
    .description {
      font-size: 28px;
      font-weight: 300;
      opacity: 0.9;
      max-width: 900px;
    }
  </style>
</head>
<body>
  <div class="bg-pattern"></div>
  <div class="content">
    <div class="emoji">🤖💻</div>
    <h1>Fallingo Blog</h1>
    <div class="subtitle">AI-First 개발 이야기</div>
    <div class="description">기술을 몰라도 AI와 함께 앱을 만드는 여정</div>
  </div>
</body>
</html>
`;

// Save HTML template
const templatePath = path.join(__dirname, '../public/og-template.html');
fs.writeFileSync(templatePath, html);

console.log('✅ OG image HTML template generated at:', templatePath);
console.log('📸 To generate PNG:');
console.log('   1. Open og-template.html in browser');
console.log('   2. Take screenshot (1200x630)');
console.log('   3. Save as public/og-image.png');
console.log('');
console.log('Or use a screenshot tool like:');
console.log('   - https://www.screenshotmachine.com/');
console.log('   - https://www.browserframe.com/');
