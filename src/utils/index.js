import showdown from 'showdown';
import hljs from 'highlight.js';

/***
 * @description 엘리먼트 비교하여 조건에 맞는 tag 찾기
 * */
export const compareElement = (target, tag) => {
  if (target.tagName === tag) return target;
  return compareElement(target.parentNode, tag);
};

/***
 * @description code highlisgh
 * */
const highlighter = (code, codeType) =>
  hljs.highlight(code, { language: codeType }).value;

/***
 * @description md content highlisgh
 * */
const mdHighlighter = md => {
  const splitMd = md.split('\n```');
  const splitMdLength = splitMd.length;
  const highlightSplitMd = [];

  if (splitMdLength < 1) return;

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
    const highlightCode = codeType ? highlighter(code, codeType) : code;

    highlightSplitMd.push(splitMd[index] + '\n');
    highlightSplitMd.push(
      `<pre><code${codeType ? ` class="language-${codeType}"` : ''}>`,
    );
    highlightSplitMd.push(highlightCode);
    highlightSplitMd.push(`</code></pre>`);
  }

  return highlightSplitMd.join('');
};

/***
 * @description md 파일을 html로 바꾸기
 * */
export const mdToHtmlConverter = md => {
  const converter = new showdown.Converter();
  return converter.makeHtml(mdHighlighter(md));
};
