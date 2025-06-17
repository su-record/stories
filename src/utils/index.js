import showdown from 'showdown';
import hljs from 'highlight.js';
import mermaid from 'mermaid';

// Mermaid 초기화
if (typeof window !== 'undefined') {
  mermaid = require('mermaid');
  mermaid.initialize({ 
    startOnLoad: false,
    theme: 'default'
  });
}

/***
 * @description 엘리먼트 비교하여 조건에 맞는 tag 찾기
 */
export const compareElement = (target, tag) => {
  if (target.tagName === tag) return target;
  return compareElement(target.parentNode, tag);
};

/***
 * @description code highlight
 */
const highlighter = (code, codeType) =>
  hljs.highlight(code, { language: codeType }).value;

/***
 * @description md content highlight
 */
const mdHighlighter = md => {
  const splitMd = md.split('\n```');
  const splitMdLength = splitMd.length;
  const highlightSplitMd = [];
  let mermaidId = 0; // Mermaid ID 카운터
  
  if (splitMdLength < 1) return md;
  
  for (let i = 0; i < splitMdLength / 2; i++) {
    const index = i * 2;
    
    if (index + 1 === splitMdLength) {
      highlightSplitMd.push(splitMd[splitMdLength - 1]);
      break;
    }
    
    const codeArea = splitMd[index + 1];
    const codeStartIndex = codeArea.indexOf('\n');
    const codeType = codeArea.substr(0, codeStartIndex).trim();
    const code = codeArea.substr(codeStartIndex).trim();
    
    // Mermaid 처리 추가
    if (codeType === 'mermaid' && mermaid) {  // mermaid 체크 추가
      highlightSplitMd.push(splitMd[index] + '\n');
      highlightSplitMd.push(
        `<div class="mermaid" id="mermaid-${mermaidId++}">${code}</div>`
      );
    } else {
      // 기존 코드 하이라이팅
      try {
        const highlightCode = codeType && hljs.getLanguage(codeType) 
          ? highlighter(code, codeType) 
          : code;
          
        highlightSplitMd.push(splitMd[index] + '\n');
        highlightSplitMd.push(
          `<pre><code${codeType ? ` class="language-${codeType}"` : ''}>`,
        );
        highlightSplitMd.push(highlightCode);
        highlightSplitMd.push(`</code></pre>`);
      } catch (error) {
        highlightSplitMd.push(splitMd[index] + '\n```' + codeArea);
      }
    }
  }
  
  return highlightSplitMd.join('');
};

/***
 * @description md 파일을 html로 바꾸기
 */
export const mdToHtmlConverter = md => {
  const converter = new showdown.Converter({
    tables: true,
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
    strikethrough: true,
    tasklists: true,
    ghCodeBlocks: true,
    tablesHeaderId: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    literalMidWordUnderscores: true,
    emoji: true
  });
  
  const highlightedMd = mdHighlighter(md);
  const html = converter.makeHtml(highlightedMd);
  
  // Mermaid 렌더링 (DOM에 추가된 후)
  setTimeout(() => {
    mermaid.init();
  }, 0);
  
  return html;
};

// 기존 함수들은 그대로...
export const gradientColor = (alpha, colorGenerator) =>
  `background: linear-gradient(${colorGenerator(alpha)}, ${colorGenerator(alpha)})`;

export const colorGenerator = (alpha = 1) => {
  const hex = new Array(6).fill('').reduce((acc) => {
    return acc + '0123456789abcdef'[Math.floor(Math.random() * 16)];
  }, '#');
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
