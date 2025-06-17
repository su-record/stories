import showdown from 'showdown';
import hljs from 'highlight.js';

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
  
  if (splitMdLength < 1) return md; // 원본 반환
  
  for (let i = 0; i < splitMdLength / 2; i++) {
    const index = i * 2;
    
    // last part
    if (index + 1 === splitMdLength) {
      highlightSplitMd.push(splitMd[splitMdLength - 1]);
      break;
    }
    
    const codeArea = splitMd[index + 1];
    const codeStartIndex = codeArea.indexOf('\n');
    const codeType = codeArea.substr(0, codeStartIndex).trim();
    const code = codeArea.substr(codeStartIndex).trim();
    
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
      // 언어를 인식하지 못하는 경우 원본 사용
      highlightSplitMd.push(splitMd[index] + '\n```' + codeArea);
    }
  }
  
  return highlightSplitMd.join('');
};

/***
 * @description md 파일을 html로 바꾸기
 */
export const mdToHtmlConverter = md => {
  // Showdown 설정 with 테이블 지원
  const converter = new showdown.Converter({
    tables: true,                    // 테이블 지원
    ghCompatibleHeaderId: true,      // GitHub 스타일 헤더 ID
    simpleLineBreaks: true,          // 단순 줄바꿈 지원
    strikethrough: true,             // 취소선 지원
    tasklists: true,                 // 체크리스트 지원
    ghCodeBlocks: true,              // GitHub 스타일 코드 블록
    tablesHeaderId: true,            // 테이블 헤더 ID
    parseImgDimensions: true,        // 이미지 크기 파싱
    simplifiedAutoLink: true,        // 자동 링크
    excludeTrailingPunctuationFromURLs: true,
    literalMidWordUnderscores: true, // 단어 중간 언더스코어 리터럴 처리
    emoji: true                      // 이모지 지원
  });
  
  // 코드 하이라이팅 적용 후 변환
  const highlightedMd = mdHighlighter(md);
  return converter.makeHtml(highlightedMd);
};

/***
 * @description random bg color
 */
export const gradientColor = (alpha, colorGenerator) =>
  `background: linear-gradient(${colorGenerator(alpha)}, ${colorGenerator(alpha)})`;

export const colorGenerator = (alpha = 1) => {
  const hex = new Array(6).fill('').reduce((acc) => {
    return acc + '0123456789abcdef'[Math.floor(Math.random() * 16)];
  }, '#');
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
