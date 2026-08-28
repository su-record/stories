/**
 * About 페이지 지표 표기 포맷터.
 *
 * 숫자의 단일 진실원은 `src/data/about-metrics.json` 이고, 이 파일은
 * 그 원본 값을 카드 배지/본문 문구로 옮길 때의 표기 규칙만 담는다.
 * 표기는 결정론적이어야 한다 — 같은 입력이면 언제나 같은 문자열.
 */

/** 1234567 → "1,234,567" */
export function comma(n) {
  return Number(n).toLocaleString('en-US')
}

/** 218604 → "219K" (반올림, 측정 오차를 숨기지 않는 근사 표기) */
export function k(n) {
  return `${Math.round(Number(n) / 1000)}K`
}

/** 72137 → "72K+" (내림, "최소 이만큼"을 보장하는 표기) */
export function kFloor(n) {
  return `${Math.floor(Number(n) / 1000)}K+`
}

/** floorTo(1574, 10) → "1,570+" · floorTo(42093, 1000) → "42,000+" */
export function floorTo(n, step) {
  return `${comma(Math.floor(Number(n) / step) * step)}+`
}
