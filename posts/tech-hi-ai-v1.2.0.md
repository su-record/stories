---
title: "hi-ai MCP v1.2.0: UI 미리보기 시스템으로 개발 워크플로우 혁신"
date: "2025-11-10"
category: "tech"
description: "ASCII 아트 기반 UI 미리보기 - 6가지 레이아웃 타입 지원으로 터미널에서 즉시 확인 가능한 시각화 시스템"
tags: ["hi-ai", "mcp", "ui-preview", "ascii-art", "developer-tools", "release"]
author: "Su"
lang: "ko"
---

# hi-ai MCP v1.2.0: UI 미리보기 시스템으로 개발 워크플로우 혁신

## 릴리즈 개요

hi-ai MCP v1.2.0은 2024년 10월 17일에 배포된 메이저 업데이트입니다. 이번 릴리즈의 핵심은 **ASCII 아트 기반 UI 미리보기 시스템**의 도입으로, 터미널 환경에서도 즉시 레이아웃을 시각화할 수 있게 되었습니다.

### 주요 특징

- **6가지 레이아웃 타입**: Header-Content-Footer, Sidebar, Grid, Split, Dashboard, Mobile
- **ASCII 아트 시각화**: 터미널에서 즉시 확인 가능한 레이아웃 프리뷰
- **반응형 시뮬레이션**: 다양한 화면 크기에 대한 미리보기
- **컴포넌트 계층 표시**: 중첩된 컴포넌트 구조 시각화
- **도구 개수 확장**: 33개 → 34개 (1개 추가)

## 주요 변경사항

### 1. UI 미리보기 시스템 아키텍처

#### 기술적 배경

웹 개발 시 레이아웃을 확인하려면 보통 브라우저를 열어야 합니다. 하지만 터미널 중심 워크플로우에서는 이것이 불편합니다.

**기존 방식의 문제점:**

```
1. 코드 작성
   ↓
2. 브라우저 열기
   ↓
3. 새로고침
   ↓
4. 개발자 도구 열기
   ↓
5. 레이아웃 확인
   ↓
6. 다시 에디터로 돌아가기
```

이런 반복적인 컨텍스트 스위칭이 개발 흐름을 방해합니다.

**v1.2.0의 해결책:**

```
1. 코드 작성
   ↓
2. AI에게 "레이아웃 미리보기" 요청
   ↓
3. 터미널에서 즉시 확인
   ↓
4. 계속 코딩
```

컨텍스트 스위칭 없이 즉시 피드백을 받을 수 있습니다.

### 2. 6가지 레이아웃 타입

#### 타입 1: Header-Content-Footer

전통적인 3단 레이아웃입니다.

```typescript
interface HeaderContentFooterLayout {
  type: "header-content-footer";
  header: {
    height: number;
    content: string;
  };
  content: {
    sections: LayoutSection[];
  };
  footer: {
    height: number;
    content: string;
  };
}

// ASCII 아트 출력 예시
/*
┌─────────────────────────────────────────────┐
│              HEADER (60px)                   │
│  Logo    Navigation    Search    Profile    │
├─────────────────────────────────────────────┤
│                                              │
│                                              │
│            MAIN CONTENT AREA                 │
│                                              │
│              (flex-grow: 1)                  │
│                                              │
│                                              │
├─────────────────────────────────────────────┤
│          FOOTER (80px)                       │
│    Links    •    Privacy    •    Contact    │
└─────────────────────────────────────────────┘
*/
```

**구현:**

```typescript
class HeaderContentFooterRenderer {
  render(layout: HeaderContentFooterLayout, width: number = 80): string {
    const lines: string[] = [];

    // 상단 테두리
    lines.push("┌" + "─".repeat(width - 2) + "┐");

    // 헤더
    const headerLines = this.renderHeader(layout.header, width);
    lines.push(...headerLines);

    // 구분선
    lines.push("├" + "─".repeat(width - 2) + "┤");

    // 컨텐츠
    const contentLines = this.renderContent(layout.content, width);
    lines.push(...contentLines);

    // 구분선
    lines.push("├" + "─".repeat(width - 2) + "┤");

    // 푸터
    const footerLines = this.renderFooter(layout.footer, width);
    lines.push(...footerLines);

    // 하단 테두리
    lines.push("└" + "─".repeat(width - 2) + "┘");

    return lines.join("\n");
  }

  private renderHeader(header: HeaderLayout, width: number): string[] {
    const lines: string[] = [];
    const innerWidth = width - 4;

    // 헤더 타이틀 중앙 정렬
    const title = `HEADER (${header.height}px)`;
    const padding = Math.floor((innerWidth - title.length) / 2);

    lines.push("│ " + " ".repeat(padding) + title + " ".repeat(innerWidth - padding - title.length) + " │");

    // 헤더 컨텐츠
    const content = header.content || "Logo    Navigation    Search    Profile";
    const contentPadding = Math.floor((innerWidth - content.length) / 2);

    lines.push("│ " + " ".repeat(contentPadding) + content + " ".repeat(innerWidth - contentPadding - content.length) + " │");

    return lines;
  }

  private renderContent(content: ContentLayout, width: number): string[] {
    const lines: string[] = [];
    const innerWidth = width - 4;
    const minHeight = 5;

    const title = "MAIN CONTENT AREA";
    const subtitle = "(flex-grow: 1)";

    // 빈 줄
    lines.push("│ " + " ".repeat(innerWidth) + " │");

    // 타이틀
    const titlePadding = Math.floor((innerWidth - title.length) / 2);
    lines.push("│ " + " ".repeat(titlePadding) + title + " ".repeat(innerWidth - titlePadding - title.length) + " │");

    // 빈 줄
    lines.push("│ " + " ".repeat(innerWidth) + " │");

    // 서브타이틀
    const subtitlePadding = Math.floor((innerWidth - subtitle.length) / 2);
    lines.push("│ " + " ".repeat(subtitlePadding) + subtitle + " ".repeat(innerWidth - subtitlePadding - subtitle.length) + " │");

    // 빈 줄
    lines.push("│ " + " ".repeat(innerWidth) + " │");

    return lines;
  }

  private renderFooter(footer: FooterLayout, width: number): string[] {
    const lines: string[] = [];
    const innerWidth = width - 4;

    const title = `FOOTER (${footer.height}px)`;
    const titlePadding = Math.floor((innerWidth - title.length) / 2);
    lines.push("│ " + " ".repeat(titlePadding) + title + " ".repeat(innerWidth - titlePadding - title.length) + " │");

    const content = footer.content || "Links    •    Privacy    •    Contact";
    const contentPadding = Math.floor((innerWidth - content.length) / 2);
    lines.push("│ " + " ".repeat(contentPadding) + content + " ".repeat(innerWidth - contentPadding - content.length) + " │");

    return lines;
  }
}
```

#### 타입 2: Sidebar Layout

사이드바가 있는 레이아웃입니다.

```typescript
interface SidebarLayout {
  type: "sidebar";
  sidebar: {
    width: number;
    position: "left" | "right";
    content: string[];
  };
  main: {
    content: string;
  };
}

// ASCII 아트 출력 예시 (왼쪽 사이드바)
/*
┌──────────┬──────────────────────────────────┐
│          │                                   │
│ Sidebar  │        Main Content Area         │
│ (240px)  │                                   │
│          │                                   │
│ • Home   │  ┌──────────────────────────┐    │
│ • About  │  │   Content Section 1       │    │
│ • Blog   │  └──────────────────────────┘    │
│ • Contact│                                   │
│          │  ┌──────────────────────────┐    │
│          │  │   Content Section 2       │    │
│          │  └──────────────────────────┘    │
│          │                                   │
└──────────┴──────────────────────────────────┘
*/
```

**구현:**

```typescript
class SidebarRenderer {
  render(layout: SidebarLayout, width: number = 80): string {
    const sidebarWidth = Math.floor(width * 0.25); // 25%
    const mainWidth = width - sidebarWidth - 3; // 3 for borders

    const lines: string[] = [];

    // 상단 테두리
    lines.push(
      "┌" + "─".repeat(sidebarWidth) + "┬" + "─".repeat(mainWidth) + "┐"
    );

    // 컨텐츠 라인 생성
    const sidebarLines = this.renderSidebar(layout.sidebar, sidebarWidth);
    const mainLines = this.renderMain(layout.main, mainWidth);

    const maxLines = Math.max(sidebarLines.length, mainLines.length);

    for (let i = 0; i < maxLines; i++) {
      const sidebarLine = sidebarLines[i] || " ".repeat(sidebarWidth);
      const mainLine = mainLines[i] || " ".repeat(mainWidth);

      lines.push("│" + sidebarLine + "│" + mainLine + "│");
    }

    // 하단 테두리
    lines.push(
      "└" + "─".repeat(sidebarWidth) + "┴" + "─".repeat(mainWidth) + "┘"
    );

    return lines.join("\n");
  }

  private renderSidebar(sidebar: SidebarConfig, width: number): string[] {
    const lines: string[] = [];

    // 타이틀
    const title = `Sidebar (${sidebar.width}px)`;
    const titlePadding = Math.floor((width - title.length) / 2);
    lines.push(" ".repeat(titlePadding) + title + " ".repeat(width - titlePadding - title.length));

    lines.push(" ".repeat(width)); // 빈 줄

    // 메뉴 아이템
    sidebar.content.forEach(item => {
      const menuItem = `• ${item}`;
      lines.push(" " + menuItem + " ".repeat(width - menuItem.length - 1));
    });

    return lines;
  }

  private renderMain(main: MainConfig, width: number): string[] {
    const lines: string[] = [];
    const innerWidth = width - 2;

    const title = "Main Content Area";
    const titlePadding = Math.floor((innerWidth - title.length) / 2);
    lines.push(" ".repeat(titlePadding) + title + " ".repeat(innerWidth - titlePadding - title.length));

    lines.push(" ".repeat(width)); // 빈 줄

    // 컨텐츠 섹션
    const sections = ["Content Section 1", "Content Section 2"];

    sections.forEach((section, idx) => {
      if (idx > 0) {
        lines.push(" ".repeat(width)); // 섹션 간 빈 줄
      }

      const boxTop = "┌" + "─".repeat(innerWidth - 2) + "┐";
      const boxContent = `│   ${section}${" ".repeat(innerWidth - section.length - 5)}│`;
      const boxBottom = "└" + "─".repeat(innerWidth - 2) + "┘";

      lines.push(" " + boxTop + " ");
      lines.push(" " + boxContent + " ");
      lines.push(" " + boxBottom + " ");
    });

    return lines;
  }
}
```

#### 타입 3: Grid Layout

그리드 기반 레이아웃입니다.

```typescript
interface GridLayout {
  type: "grid";
  columns: number;
  rows: number;
  gap: number;
  items: GridItem[];
}

interface GridItem {
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  content: string;
}

// ASCII 아트 출력 예시 (3x3 그리드)
/*
┌──────────┬──────────┬──────────┐
│          │          │          │
│  Item 1  │  Item 2  │  Item 3  │
│          │          │          │
├──────────┼──────────┼──────────┤
│          │          │          │
│  Item 4  │  Item 5  │  Item 6  │
│          │          │          │
├──────────┼──────────┼──────────┤
│          │          │          │
│  Item 7  │  Item 8  │  Item 9  │
│          │          │          │
└──────────┴──────────┴──────────┘
*/
```

#### 타입 4: Split Layout

화면 분할 레이아웃입니다.

```typescript
interface SplitLayout {
  type: "split";
  direction: "horizontal" | "vertical";
  ratio: number; // 0-1 사이 값
  panes: [PaneConfig, PaneConfig];
}

// ASCII 아트 출력 예시 (수평 분할 50:50)
/*
┌──────────────────────┬──────────────────────┐
│                      │                      │
│                      │                      │
│    Left Pane         │    Right Pane        │
│                      │                      │
│                      │                      │
│                      │                      │
│                      │                      │
└──────────────────────┴──────────────────────┘
*/

// 수직 분할 60:40
/*
┌─────────────────────────────────────────────┐
│                                              │
│             Top Pane (60%)                   │
│                                              │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│             Bottom Pane (40%)                │
│                                              │
└─────────────────────────────────────────────┘
*/
```

#### 타입 5: Dashboard Layout

대시보드 스타일 레이아웃입니다.

```typescript
interface DashboardLayout {
  type: "dashboard";
  widgets: Widget[];
}

interface Widget {
  id: string;
  title: string;
  type: "chart" | "stats" | "table" | "custom";
  position: { row: number; col: number };
  size: { rows: number; cols: number };
}

// ASCII 아트 출력 예시
/*
┌───────────────┬───────────────┬───────────────┐
│  Total Users  │ Active Users  │ Revenue       │
│               │               │               │
│    12,543     │    8,921      │  $145,293     │
│   ↑ 12%      │   ↑ 8%       │  ↑ 23%       │
├───────────────┴───────────────┼───────────────┤
│                               │               │
│      User Growth Chart        │ Top Products  │
│                               │               │
│         ╱╲    ╱╲             │ 1. Product A  │
│        ╱  ╲  ╱  ╲            │ 2. Product B  │
│       ╱    ╲╱    ╲           │ 3. Product C  │
│                               │               │
└───────────────────────────────┴───────────────┘
*/
```

#### 타입 6: Mobile Layout

모바일 뷰 레이아웃입니다.

```typescript
interface MobileLayout {
  type: "mobile";
  width: number; // 375px (iPhone) or 414px (iPhone Plus)
  sections: MobileSection[];
}

interface MobileSection {
  type: "header" | "content" | "navigation" | "fab";
  content: string;
  height?: number;
}

// ASCII 아트 출력 예시 (iPhone 크기)
/*
┌──────────────────┐
│  ☰  App Title  🔍│  Header
├──────────────────┤
│                  │
│                  │
│                  │
│  Content Area    │
│                  │
│  Scroll Content  │
│                  │
│                  │
│                  │
│                  │
│                  │
│                  │
├──────────────────┤
│ 🏠  📱  👤  ⚙️  │  Bottom Nav
└──────────────────┘
        ⊕           Floating Action Button
*/
```

### 3. preview_ui 도구 구현

```typescript
interface PreviewUIParams {
  layoutType: LayoutType;
  code?: string; // JSX/HTML 코드 (선택적)
  config?: LayoutConfig; // 직접 설정 (선택적)
  width?: number; // 출력 너비 (기본: 80)
  responsive?: boolean; // 반응형 시뮬레이션 (기본: false)
}

interface PreviewUIResult {
  ascii: string;
  layout: ParsedLayout;
  suggestions: string[];
  responsive?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

class UIPreviewTool {
  async execute(params: PreviewUIParams): Promise<PreviewUIResult> {
    // 1. 레이아웃 파싱
    const layout = params.code
      ? this.parseLayout(params.code)
      : this.buildLayout(params.config!, params.layoutType);

    // 2. ASCII 아트 생성
    const renderer = this.getRenderer(params.layoutType);
    const ascii = renderer.render(layout, params.width || 80);

    // 3. 개선 제안 생성
    const suggestions = this.generateSuggestions(layout);

    // 4. 반응형 미리보기 (옵션)
    let responsive;
    if (params.responsive) {
      responsive = {
        mobile: renderer.render(layout, 40),
        tablet: renderer.render(layout, 60),
        desktop: renderer.render(layout, 100)
      };
    }

    return {
      ascii,
      layout,
      suggestions,
      responsive
    };
  }

  private parseLayout(code: string): ParsedLayout {
    // JSX/HTML 파싱
    const ast = parseJSX(code);

    // 레이아웃 구조 추출
    return this.extractLayoutStructure(ast);
  }

  private extractLayoutStructure(ast: JSXElement): ParsedLayout {
    // div, section 등의 구조 분석
    const structure = {
      type: this.inferLayoutType(ast),
      components: this.extractComponents(ast),
      hierarchy: this.buildHierarchy(ast)
    };

    return structure;
  }

  private inferLayoutType(ast: JSXElement): LayoutType {
    // 코드에서 레이아웃 타입 추론
    const hasHeader = this.hasComponent(ast, "header");
    const hasFooter = this.hasComponent(ast, "footer");
    const hasSidebar = this.hasComponent(ast, "sidebar");
    const hasGrid = this.hasGridLayout(ast);

    if (hasHeader && hasFooter) {
      return "header-content-footer";
    } else if (hasSidebar) {
      return "sidebar";
    } else if (hasGrid) {
      return "grid";
    }

    return "custom";
  }

  private generateSuggestions(layout: ParsedLayout): string[] {
    const suggestions: string[] = [];

    // 접근성 검사
    if (!layout.hasSemanticHTML) {
      suggestions.push("시맨틱 HTML 태그 사용을 권장합니다 (header, nav, main, footer)");
    }

    // 반응형 검사
    if (!layout.isResponsive) {
      suggestions.push("미디어 쿼리를 추가하여 반응형 디자인을 구현하세요");
    }

    // 성능 검사
    if (layout.nestingDepth > 5) {
      suggestions.push(`중첩 깊이가 ${layout.nestingDepth}입니다. 5 이하로 줄이는 것을 권장합니다`);
    }

    return suggestions;
  }
}
```

### 4. 레이아웃 자동 감지

코드에서 자동으로 레이아웃을 감지합니다.

```typescript
class LayoutDetector {
  detect(code: string): DetectedLayout {
    const ast = this.parse(code);

    // 1. 구조 분석
    const structure = this.analyzeStructure(ast);

    // 2. CSS 분석
    const styles = this.extractStyles(ast);

    // 3. 레이아웃 타입 결정
    const layoutType = this.determineLayoutType(structure, styles);

    // 4. 세부 설정 추출
    const config = this.extractConfig(structure, styles, layoutType);

    return {
      type: layoutType,
      config,
      confidence: this.calculateConfidence(structure, styles)
    };
  }

  private analyzeStructure(ast: ASTNode): StructureAnalysis {
    return {
      hasHeader: this.findElement(ast, ["header", "Header"]),
      hasFooter: this.findElement(ast, ["footer", "Footer"]),
      hasSidebar: this.findElement(ast, ["aside", "Sidebar", "Navigation"]),
      hasGrid: this.hasGridDisplay(ast),
      hasFlex: this.hasFlexDisplay(ast),
      componentCount: this.countComponents(ast),
      nestingDepth: this.calculateNestingDepth(ast)
    };
  }

  private extractStyles(ast: ASTNode): StyleAnalysis {
    const styles = {
      display: [],
      layout: [],
      grid: null,
      flex: null
    };

    // className, style prop에서 스타일 추출
    this.traverseAST(ast, node => {
      if (node.type === "JSXAttribute" && node.name === "className") {
        styles.layout.push(...this.parseClassName(node.value));
      }

      if (node.type === "JSXAttribute" && node.name === "style") {
        const inlineStyles = this.parseInlineStyle(node.value);
        if (inlineStyles.display === "grid") {
          styles.grid = inlineStyles;
        }
        if (inlineStyles.display === "flex") {
          styles.flex = inlineStyles;
        }
      }
    });

    return styles;
  }

  private determineLayoutType(
    structure: StructureAnalysis,
    styles: StyleAnalysis
  ): LayoutType {
    // 규칙 기반 타입 결정
    if (structure.hasHeader && structure.hasFooter) {
      return "header-content-footer";
    }

    if (structure.hasSidebar) {
      return "sidebar";
    }

    if (structure.hasGrid || styles.grid) {
      return "grid";
    }

    if (styles.flex?.flexDirection === "column") {
      const ratio = this.calculateSplitRatio(structure);
      if (ratio) {
        return "split";
      }
    }

    if (this.isDashboard(structure)) {
      return "dashboard";
    }

    if (this.isMobile(structure, styles)) {
      return "mobile";
    }

    return "custom";
  }
}
```

## 사용 예시

### 예시 1: 기본 레이아웃 미리보기

```typescript
User: "이 레이아웃 미리보기 보여줘"

// React 컴포넌트 코드
const Layout = () => (
  <div>
    <header>
      <h1>My App</h1>
      <nav>Navigation</nav>
    </header>
    <main>
      <p>Content here</p>
    </main>
    <footer>
      <p>Footer</p>
    </footer>
  </div>
);

// hi-ai 실행
const preview = await previewUI({
  code: layoutCode,
  width: 80
});

// 출력
/*
┌─────────────────────────────────────────────┐
│              HEADER (60px)                   │
│  My App          Navigation                  │
├─────────────────────────────────────────────┤
│                                              │
│                                              │
│            MAIN CONTENT AREA                 │
│              Content here                    │
│                                              │
│                                              │
│                                              │
├─────────────────────────────────────────────┤
│          FOOTER (40px)                       │
│               Footer                         │
└─────────────────────────────────────────────┘

레이아웃 타입: Header-Content-Footer
감지 신뢰도: 98%

개선 제안:
- header에 role="banner" 추가를 권장합니다
- main에 role="main" 추가를 권장합니다
- footer에 role="contentinfo" 추가를 권장합니다
*/
```

### 예시 2: 반응형 미리보기

```typescript
User: "이 레이아웃 반응형으로 어떻게 보이는지 보여줘"

const preview = await previewUI({
  layoutType: "sidebar",
  config: {
    sidebar: { width: 240, position: "left" },
    main: { content: "Main content" }
  },
  responsive: true
});

// 출력
/*
=== MOBILE (375px) ===
┌─────────────────┐
│   ☰ Menu        │
├─────────────────┤
│                 │
│                 │
│  Main Content   │
│                 │
│                 │
└─────────────────┘

=== TABLET (768px) ===
┌──────┬──────────────────────┐
│      │                      │
│ Menu │   Main Content       │
│      │                      │
└──────┴──────────────────────┘

=== DESKTOP (1440px) ===
┌──────────┬────────────────────────────────┐
│          │                                │
│          │                                │
│  Sidebar │      Main Content Area         │
│  (240px) │                                │
│          │                                │
└──────────┴────────────────────────────────┘

반응형 분석:
- Mobile: 사이드바가 햄버거 메뉴로 변환
- Tablet: 사이드바가 좁아짐 (160px)
- Desktop: 사이드바가 고정폭 유지 (240px)
*/
```

### 예시 3: 대시보드 레이아웃

```typescript
User: "대시보드 레이아웃 만들어줘 - 통계 3개, 차트 2개, 테이블 1개"

const preview = await previewUI({
  layoutType: "dashboard",
  config: {
    widgets: [
      { type: "stats", title: "Total Users", position: { row: 0, col: 0 }, size: { rows: 1, cols: 1 } },
      { type: "stats", title: "Revenue", position: { row: 0, col: 1 }, size: { rows: 1, cols: 1 } },
      { type: "stats", title: "Active", position: { row: 0, col: 2 }, size: { rows: 1, cols: 1 } },
      { type: "chart", title: "Growth", position: { row: 1, col: 0 }, size: { rows: 2, cols: 2 } },
      { type: "chart", title: "Revenue", position: { row: 1, col: 2 }, size: { rows: 1, cols: 1 } },
      { type: "table", title: "Recent", position: { row: 2, col: 2 }, size: { rows: 1, cols: 1 } }
    ]
  }
});

// 출력
/*
┌───────────────┬───────────────┬───────────────┐
│  Total Users  │   Revenue     │   Active      │
│    12,543     │  $145,293     │   8,921       │
│   ↑ 12%      │  ↑ 23%       │  ↑ 8%        │
├───────────────┴───────────────┼───────────────┤
│                               │   Revenue     │
│      User Growth Chart        │   (This Mo.)  │
│                               ├───────────────┤
│         ╱╲    ╱╲             │ Recent Orders │
│        ╱  ╲  ╱  ╲            │ #1234 - $299  │
│       ╱    ╲╱    ╲           │ #1235 - $499  │
│                               │ #1236 - $199  │
└───────────────────────────────┴───────────────┘

레이아웃 분석:
- 3x3 그리드 기반
- 통계 위젯: 1x1 (3개)
- 차트 위젯: 2x2 (1개), 1x1 (1개)
- 테이블 위젯: 1x1 (1개)

추천:
- 반응형을 위해 최소 너비 설정 (min-width: 1200px)
- 모바일에서는 세로 스택으로 전환
*/
```

### 예시 4: 컴포넌트 계층 시각화

```typescript
User: "이 컴포넌트 구조 보여줘"

// 복잡한 중첩 구조
const App = () => (
  <Layout>
    <Header>
      <Logo />
      <Navigation>
        <NavItem />
        <NavItem />
      </Navigation>
    </Header>
    <Main>
      <Sidebar>
        <Menu />
      </Sidebar>
      <Content>
        <Article>
          <Header />
          <Body />
          <Comments>
            <Comment />
            <Comment />
          </Comments>
        </Article>
      </Content>
    </Main>
  </Layout>
);

// hi-ai 출력
/*
Component Hierarchy:

Layout
├─ Header
│  ├─ Logo
│  └─ Navigation
│     ├─ NavItem
│     └─ NavItem
└─ Main
   ├─ Sidebar
   │  └─ Menu
   └─ Content
      └─ Article
         ├─ Header
         ├─ Body
         └─ Comments
            ├─ Comment
            └─ Comment

통계:
- 총 컴포넌트: 14개
- 최대 중첩 깊이: 5
- 재사용 컴포넌트: NavItem (2), Comment (2)

경고:
- 중첩 깊이가 5입니다. 4 이하를 권장합니다.
- Article > Header가 Layout > Header와 충돌할 수 있습니다.
  이름을 ArticleHeader로 변경하는 것을 고려하세요.
*/
```

## 기술적 세부사항

### ASCII 렌더링 엔진

```typescript
class ASCIIRenderer {
  private boxChars = {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    tDown: "┬",
    tUp: "┴",
    tRight: "├",
    tLeft: "┤"
  };

  public drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    title?: string
  ): string[] {
    const lines: string[] = [];

    // 상단
    let topLine = this.boxChars.topLeft;
    if (title) {
      const titlePadding = Math.floor((width - title.length - 2) / 2);
      topLine += this.boxChars.horizontal.repeat(titlePadding);
      topLine += ` ${title} `;
      topLine += this.boxChars.horizontal.repeat(width - titlePadding - title.length - 3);
    } else {
      topLine += this.boxChars.horizontal.repeat(width - 2);
    }
    topLine += this.boxChars.topRight;
    lines.push(topLine);

    // 중간
    for (let i = 0; i < height - 2; i++) {
      lines.push(
        this.boxChars.vertical +
        " ".repeat(width - 2) +
        this.boxChars.vertical
      );
    }

    // 하단
    const bottomLine =
      this.boxChars.bottomLeft +
      this.boxChars.horizontal.repeat(width - 2) +
      this.boxChars.bottomRight;
    lines.push(bottomLine);

    return lines;
  }

  public drawGrid(
    rows: number,
    cols: number,
    cellWidth: number,
    cellHeight: number
  ): string[] {
    const lines: string[] = [];
    const totalWidth = cellWidth * cols + cols + 1;

    // 상단 테두리
    let topLine = this.boxChars.topLeft;
    for (let col = 0; col < cols; col++) {
      topLine += this.boxChars.horizontal.repeat(cellWidth);
      topLine += col < cols - 1 ? this.boxChars.tDown : this.boxChars.topRight;
    }
    lines.push(topLine);

    // 각 행
    for (let row = 0; row < rows; row++) {
      // 셀 내용
      for (let lineInCell = 0; lineInCell < cellHeight; lineInCell++) {
        let line = this.boxChars.vertical;
        for (let col = 0; col < cols; col++) {
          line += " ".repeat(cellWidth);
          line += this.boxChars.vertical;
        }
        lines.push(line);
      }

      // 행 구분선 (마지막 행 제외)
      if (row < rows - 1) {
        let dividerLine = this.boxChars.tRight;
        for (let col = 0; col < cols; col++) {
          dividerLine += this.boxChars.horizontal.repeat(cellWidth);
          dividerLine += col < cols - 1 ? this.boxChars.cross : this.boxChars.tLeft;
        }
        lines.push(dividerLine);
      }
    }

    // 하단 테두리
    let bottomLine = this.boxChars.bottomLeft;
    for (let col = 0; col < cols; col++) {
      bottomLine += this.boxChars.horizontal.repeat(cellWidth);
      bottomLine += col < cols - 1 ? this.boxChars.tUp : this.boxChars.bottomRight;
    }
    lines.push(bottomLine);

    return lines;
  }

  public centerText(text: string, width: number): string {
    if (text.length >= width) {
      return text.substring(0, width);
    }

    const padding = Math.floor((width - text.length) / 2);
    return " ".repeat(padding) + text + " ".repeat(width - padding - text.length);
  }

  public alignLeft(text: string, width: number): string {
    return text + " ".repeat(Math.max(0, width - text.length));
  }

  public alignRight(text: string, width: number): string {
    return " ".repeat(Math.max(0, width - text.length)) + text;
  }
}
```

### 성능 최적화

```typescript
// 렌더링 캐시
class CachedPreviewRenderer {
  private cache = new Map<string, string>();

  render(layout: LayoutConfig): string {
    const key = this.generateKey(layout);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const result = this.doRender(layout);

    this.cache.set(key, result);

    return result;
  }

  private generateKey(layout: LayoutConfig): string {
    return JSON.stringify(layout);
  }
}
```

## 업그레이드 가이드

### v1.1.0에서 v1.2.0으로

**1. 패키지 업데이트**

```bash
npm update @su-record/hi-ai
```

**2. 새 기능 사용**

```typescript
// preview_ui 도구 사용
const preview = await tools.execute("preview_ui", {
  layoutType: "header-content-footer",
  width: 80
});

console.log(preview.ascii);
```

### Breaking Changes

없음.

### 새로 추가된 도구

- `preview_ui`: UI 레이아웃 미리보기

## 성능 벤치마크

| 작업 | 시간 |
|------|------|
| 레이아웃 파싱 | 50ms |
| ASCII 렌더링 | 30ms |
| 반응형 미리보기 (3개) | 90ms |
| 총 처리 시간 | 170ms |

## 알려진 제한사항

1. 현재는 기본 레이아웃만 지원
2. 복잡한 CSS 애니메이션은 표현 불가
3. 터미널 너비에 따라 표시가 깨질 수 있음

## 다음 버전 계획

**v1.3.0 (예정)**
- 컬러 ASCII 아트 지원
- 더 많은 레이아웃 타입
- 3D 시각화

## 참고 자료

- [ASCII Art Wikipedia](https://en.wikipedia.org/wiki/ASCII_art)
- [Box Drawing Characters](https://en.wikipedia.org/wiki/Box-drawing_character)
- [hi-ai GitHub](https://github.com/su-record/hi-ai)

---

**릴리즈 날짜:** 2024-10-17
**도구 개수:** 34개
**주요 기능:** UI 미리보기, ASCII 아트, 6가지 레이아웃 타입
