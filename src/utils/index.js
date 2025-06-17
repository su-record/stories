// src/utils/index.js
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';

// mermaid 초기화 (수정됨: const로 변경)
const mermaidConfig = {
  startOnLoad: true,
  theme: 'default',
};
mermaid.initialize(mermaidConfig);

// 코드 하이라이터
export const highlighter = (code, lang) => {
  const highlighted = hljs.highlight(code, { language: lang || 'plaintext' });
  return highlighted.value;
};

// UUID 생성 함수
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 날짜 포맷터
export const formatDate = date => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 스토리 미리보기 생성
export const generatePreview = (content, maxLength = 200) => {
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

// 마크다운 렌더러
export const renderMarkdown = (content, codeHighlighter = highlighter) => {
  const marked = window.marked;

  // 마크다운 옵션 설정
  marked.setOptions({
    highlight: function (code, lang) {
      return lang && hljs.getLanguage(lang) ? codeHighlighter(code, lang) : code;
    },
    breaks: true,
    gfm: true,
    tables: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  });

  // 마크다운 변환
  let html = marked.parse(content || '');

  // Mermaid 다이어그램 처리
  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  const mermaidMatches = [...html.matchAll(mermaidRegex)];

  mermaidMatches.forEach((match, index) => {
    const mermaidCode = match[1].trim();
    const mermaidId = `mermaid-${generateUUID()}`;
    const mermaidDiv = `<div class="mermaid" id="${mermaidId}">${mermaidCode}</div>`;
    html = html.replace(match[0], mermaidDiv);
  });

  return html;
};

// 로컬 스토리지 헬퍼
export const storage = {
  get: key => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  remove: key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// 스토리 필터링/검색 헬퍼
export const filterStories = (stories, filters) => {
  return stories.filter(story => {
    // 카테고리 필터
    if (filters.category && story.category !== filters.category) {
      return false;
    }

    // 검색어 필터
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        story.title.toLowerCase().includes(searchTerm) ||
        story.content.toLowerCase().includes(searchTerm) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // 태그 필터
    if (filters.tags && filters.tags.length > 0) {
      return filters.tags.some(tag => story.tags.includes(tag));
    }

    return true;
  });
};

// 스토리 정렬 헬퍼
export const sortStories = (stories, sortBy = 'createdAt', order = 'desc') => {
  return [...stories].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// 파일 크기 포맷터
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 유효성 검사 헬퍼
export const validators = {
  email: email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  url: url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: value => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },
};

// 디바운스 함수
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 스로틀 함수
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 딥 클론 함수
export const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 에러 핸들러
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  // 사용자에게 보여줄 메시지 반환
  if (error.response) {
    // 서버 응답 에러
    return error.response.data?.message || '서버 오류가 발생했습니다.';
  } else if (error.request) {
    // 네트워크 에러
    return '네트워크 연결을 확인해주세요.';
  } else {
    // 기타 에러
    return error.message || '알 수 없는 오류가 발생했습니다.';
  }
};
