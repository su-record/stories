---
title: "hi-ai MCP v1.1.0: 시맨틱 코드 분석으로 코드 이해도 향상"
date: "2025-11-10"
category: "tech"
description: "find_symbol, find_references 도구 추가 - 코드 탐색과 리팩토링을 위한 시맨틱 분석 기능 강화"
tags: ["hi-ai", "mcp", "semantic-analysis", "code-navigation", "typescript", "release"]
author: "Su"
lang: "ko"
---

# hi-ai MCP v1.1.0: 시맨틱 코드 분석으로 코드 이해도 향상

## 릴리즈 개요

hi-ai MCP v1.1.0은 2024년 8월 13일에 배포된 메이저 업데이트입니다. 이번 릴리즈의 핵심은 **시맨틱 코드 분석(Semantic Code Analysis) 시스템**의 도입으로, 단순한 문법 분석을 넘어 코드의 의미와 관계를 이해하는 수준으로 발전했습니다.

### 주요 특징

- **시맨틱 심볼 탐색**: `find_symbol` 도구로 정의, 참조, 타입 정보 추적
- **참조 분석**: `find_references` 도구로 심볼 사용처 전체 검색
- **브라우저 유틸리티 개선**: 웹 페이지 분석 성능 30% 향상
- **도구 개수 확장**: 31개 → 33개 (2개 추가)
- **코드 이해도 향상**: 리팩토링 및 영향도 분석 지원

## 주요 변경사항

### 1. 시맨틱 코드 분석 시스템

기존 AST 기반 분석에 시맨틱 레이어를 추가하여 코드의 의미를 이해할 수 있게 되었습니다.

#### 기술적 배경: AST vs 시맨틱 분석

**AST 분석 (v1.0.x):**

```typescript
// 구문 구조만 파악
const sourceFile = project.createSourceFile("temp.ts", code);
const functions = sourceFile.getFunctions(); // 함수 선언 찾기

// 한계:
// - "어디서 정의되었나?"는 알 수 있음
// - "어디서 사용되나?"는 알 수 없음
// - "타입이 무엇인가?"는 부분적으로만 알 수 있음
// - "다른 코드와 어떤 관계인가?"는 알 수 없음
```

**시맨틱 분석 (v1.1.0):**

```typescript
// 의미와 관계까지 파악
const program = project.createProgram();
const typeChecker = program.getTypeChecker();

// 심볼 정의 찾기
const symbol = typeChecker.getSymbolAtLocation(node);
const declarations = symbol?.getDeclarations();

// 모든 참조 찾기
const references = node.findReferencesAsNodes();

// 타입 정보 추출
const type = typeChecker.getTypeAtLocation(node);
const typeString = typeChecker.typeToString(type);

// 가능해진 것:
// - 심볼이 어디서 정의되고 어디서 사용되는지 추적
// - 정확한 타입 정보 파악
// - 리팩토링 영향 범위 분석
// - 의존성 그래프 구축
```

### 2. find_symbol 도구

심볼(변수, 함수, 클래스 등)의 정의와 타입 정보를 찾습니다.

#### 구현 상세

```typescript
interface SymbolInfo {
  name: string;
  kind: SymbolKind;
  type: string;
  location: Location;
  declarations: Declaration[];
  documentation?: string;
  accessibility?: "public" | "private" | "protected";
  isExported: boolean;
  isAsync?: boolean;
  isReadonly?: boolean;
}

enum SymbolKind {
  Variable = "variable",
  Function = "function",
  Class = "class",
  Interface = "interface",
  Type = "type",
  Enum = "enum",
  Method = "method",
  Property = "property",
  Parameter = "parameter"
}

class SymbolFinder {
  private project: Project;
  private typeChecker: TypeChecker;

  constructor(code: string) {
    this.project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = this.project.createSourceFile("temp.ts", code);
    this.typeChecker = this.project.getProgram().getTypeChecker();
  }

  public findSymbol(name: string): SymbolInfo | null {
    const sourceFile = this.project.getSourceFiles()[0];

    // 모든 노드를 순회하며 심볼 찾기
    let foundSymbol: Symbol | undefined;
    let foundNode: Node | undefined;

    sourceFile.forEachDescendant(node => {
      const symbol = this.typeChecker.getSymbolAtLocation(node);

      if (symbol && this.getSymbolName(symbol) === name) {
        foundSymbol = symbol;
        foundNode = node;
        return true; // 순회 중단
      }
    });

    if (!foundSymbol || !foundNode) {
      return null;
    }

    return this.buildSymbolInfo(foundSymbol, foundNode);
  }

  private buildSymbolInfo(symbol: Symbol, node: Node): SymbolInfo {
    const declarations = symbol.getDeclarations() || [];
    const type = this.typeChecker.getTypeAtLocation(node);
    const typeString = this.typeChecker.typeToString(type);

    return {
      name: this.getSymbolName(symbol),
      kind: this.getSymbolKind(symbol),
      type: typeString,
      location: this.getLocation(node),
      declarations: declarations.map(d => this.getDeclarationInfo(d)),
      documentation: this.getDocumentation(symbol),
      accessibility: this.getAccessibility(symbol),
      isExported: this.isExported(symbol),
      isAsync: this.isAsync(node),
      isReadonly: this.isReadonly(symbol)
    };
  }

  private getSymbolKind(symbol: Symbol): SymbolKind {
    const flags = symbol.getFlags();

    if (flags & SymbolFlags.Class) return SymbolKind.Class;
    if (flags & SymbolFlags.Interface) return SymbolKind.Interface;
    if (flags & SymbolFlags.TypeAlias) return SymbolKind.Type;
    if (flags & SymbolFlags.Enum) return SymbolKind.Enum;
    if (flags & SymbolFlags.Function) return SymbolKind.Function;
    if (flags & SymbolFlags.Method) return SymbolKind.Method;
    if (flags & SymbolFlags.Property) return SymbolKind.Property;
    if (flags & SymbolFlags.Variable) return SymbolKind.Variable;
    if (flags & SymbolFlags.ValueModule) return SymbolKind.Parameter;

    return SymbolKind.Variable;
  }

  private getDocumentation(symbol: Symbol): string | undefined {
    const docs = symbol.getDocumentationComment(this.typeChecker);
    if (docs && docs.length > 0) {
      return docs.map(d => d.text).join("\n");
    }
    return undefined;
  }

  private isExported(symbol: Symbol): boolean {
    const declarations = symbol.getDeclarations() || [];
    return declarations.some(d => {
      const modifiers = d.getModifiers?.() || [];
      return modifiers.some(m => m.kind === SyntaxKind.ExportKeyword);
    });
  }
}
```

#### 사용 예시

```typescript
// 사용자 입력
User: "UserService 클래스 정의 찾아줘"

// hi-ai 실행
const symbolInfo = await findSymbol("UserService");

// 결과
{
  name: "UserService",
  kind: "class",
  type: "UserService",
  location: {
    file: "src/services/UserService.ts",
    line: 15,
    column: 14
  },
  declarations: [
    {
      kind: "class",
      file: "src/services/UserService.ts",
      range: { start: 15, end: 145 }
    }
  ],
  documentation: "사용자 관리를 위한 서비스 클래스",
  accessibility: "public",
  isExported: true
}
```

### 3. find_references 도구

특정 심볼이 사용되는 모든 위치를 찾습니다.

#### 구현 상세

```typescript
interface Reference {
  location: Location;
  isDefinition: boolean;
  isWriteAccess: boolean;
  context: string; // 주변 코드 컨텍스트
}

interface FindReferencesResult {
  symbol: string;
  totalReferences: number;
  definition: Reference;
  usages: Reference[];
  summary: {
    reads: number;
    writes: number;
    files: string[];
  };
}

class ReferenceFinder {
  private project: Project;

  constructor(code: string, additionalFiles?: Record<string, string>) {
    this.project = new Project({ useInMemoryFileSystem: true });

    // 메인 파일 추가
    this.project.createSourceFile("main.ts", code);

    // 추가 파일들 (의존성)
    if (additionalFiles) {
      Object.entries(additionalFiles).forEach(([fileName, content]) => {
        this.project.createSourceFile(fileName, content);
      });
    }
  }

  public findReferences(symbolName: string): FindReferencesResult | null {
    const sourceFile = this.project.getSourceFile("main.ts");
    if (!sourceFile) return null;

    // 심볼 노드 찾기
    let targetNode: Node | undefined;
    sourceFile.forEachDescendant(node => {
      if (Node.isIdentifier(node) && node.getText() === symbolName) {
        targetNode = node;
        return true;
      }
    });

    if (!targetNode) return null;

    // 모든 참조 찾기
    const referencedSymbols = targetNode.findReferencesAsNodes();

    const references: Reference[] = referencedSymbols.map(refNode => {
      return {
        location: this.getLocation(refNode),
        isDefinition: this.isDefinition(refNode),
        isWriteAccess: this.isWriteAccess(refNode),
        context: this.getContext(refNode)
      };
    });

    // 정의와 사용처 분리
    const definition = references.find(ref => ref.isDefinition);
    const usages = references.filter(ref => !ref.isDefinition);

    // 통계 계산
    const summary = {
      reads: usages.filter(u => !u.isWriteAccess).length,
      writes: usages.filter(u => u.isWriteAccess).length,
      files: [...new Set(usages.map(u => u.location.file))]
    };

    return {
      symbol: symbolName,
      totalReferences: references.length,
      definition: definition!,
      usages,
      summary
    };
  }

  private isDefinition(node: Node): boolean {
    const parent = node.getParent();

    // 변수 선언
    if (Node.isVariableDeclaration(parent)) {
      return parent.getNameNode() === node;
    }

    // 함수 선언
    if (Node.isFunctionDeclaration(parent)) {
      return parent.getNameNode() === node;
    }

    // 클래스 선언
    if (Node.isClassDeclaration(parent)) {
      return parent.getNameNode() === node;
    }

    // 파라미터
    if (Node.isParameterDeclaration(parent)) {
      return parent.getNameNode() === node;
    }

    return false;
  }

  private isWriteAccess(node: Node): boolean {
    const parent = node.getParent();

    // 할당문의 좌변
    if (Node.isBinaryExpression(parent)) {
      return parent.getLeft() === node &&
             parent.getOperatorToken().kind === SyntaxKind.EqualsToken;
    }

    // 증감 연산자
    if (Node.isPrefixUnaryExpression(parent) || Node.isPostfixUnaryExpression(parent)) {
      const operator = parent.getOperator();
      return operator === SyntaxKind.PlusPlusToken ||
             operator === SyntaxKind.MinusMinusToken;
    }

    return false;
  }

  private getContext(node: Node, lines: number = 2): string {
    const sourceFile = node.getSourceFile();
    const startLine = Math.max(1, node.getStartLineNumber() - lines);
    const endLine = node.getEndLineNumber() + lines;

    const text = sourceFile.getText();
    const allLines = text.split("\n");
    const contextLines = allLines.slice(startLine - 1, endLine);

    return contextLines.join("\n");
  }
}
```

#### 사용 예시: 리팩토링 영향도 분석

```typescript
// 시나리오: getUserById 함수명을 findUserById로 변경하려고 함

User: "getUserById 함수가 어디서 사용되는지 찾아줘"

// hi-ai 실행
const result = await findReferences("getUserById");

// 결과
{
  symbol: "getUserById",
  totalReferences: 24,
  definition: {
    location: {
      file: "src/services/UserService.ts",
      line: 45,
      column: 16
    },
    isDefinition: true,
    isWriteAccess: false,
    context: `
async function getUserById(id: number): Promise<User | null> {
  return await db.users.findOne({ id });
}
    `
  },
  usages: [
    {
      location: {
        file: "src/controllers/UserController.ts",
        line: 23,
        column: 29
      },
      isDefinition: false,
      isWriteAccess: false,
      context: `
const user = await userService.getUserById(req.params.id);
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}
      `
    },
    {
      location: {
        file: "src/middleware/auth.ts",
        line: 67,
        column: 23
      },
      isDefinition: false,
      isWriteAccess: false,
      context: `
const user = await getUserById(userId);
if (!user || !user.isActive) {
  throw new UnauthorizedError();
}
      `
    }
    // ... 22개 더
  ],
  summary: {
    reads: 23,
    writes: 0,
    files: [
      "src/controllers/UserController.ts",
      "src/middleware/auth.ts",
      "src/services/NotificationService.ts",
      "src/services/FollowService.ts",
      "src/utils/helpers.ts"
    ]
  }
}

// AI 분석
/*
리팩토링 영향도 분석:

총 5개 파일에서 24회 사용되고 있습니다.
모든 사용처가 읽기 접근이므로 함수명 변경이 안전합니다.

변경이 필요한 파일:
1. src/controllers/UserController.ts (8회)
2. src/middleware/auth.ts (5회)
3. src/services/NotificationService.ts (4회)
4. src/services/FollowService.ts (4회)
5. src/utils/helpers.ts (2회)

권장사항:
- IDE의 "Rename Symbol" 기능 사용
- 또는 전체 검색/치환 (getUserById → findUserById)
- 변경 후 TypeScript 컴파일 확인
- 테스트 실행 필수
*/
```

### 4. 시맨틱 분석 활용 예시

#### 예시 1: 순환 의존성 탐지

```typescript
// 도구: find_symbol + find_references 조합

User: "ServiceA와 ServiceB 사이에 순환 의존성 있어?"

// hi-ai 분석 과정
async function detectCircularDependency(service1: string, service2: string) {
  // 1. ServiceA에서 ServiceB 참조 확인
  const service1Info = await findSymbol(service1);
  const service1File = service1Info.location.file;

  const imports = extractImports(service1File);
  const importsService2 = imports.includes(service2);

  // 2. ServiceB에서 ServiceA 참조 확인
  const service2Info = await findSymbol(service2);
  const service2File = service2Info.location.file;

  const imports2 = extractImports(service2File);
  const importsService1 = imports2.includes(service1);

  // 3. 순환 의존성 판별
  if (importsService2 && importsService1) {
    return {
      hasCircularDependency: true,
      path: [service1, service2, service1]
    };
  }

  return { hasCircularDependency: false };
}

// 결과
{
  hasCircularDependency: true,
  path: ["ServiceA", "ServiceB", "ServiceA"],
  details: `
ServiceA imports ServiceB
ServiceB imports ServiceA

이는 순환 의존성 문제입니다.
해결 방법:
1. 공통 로직을 별도 서비스로 분리
2. 의존성 주입(DI) 패턴 사용
3. 이벤트 기반 아키텍처로 전환
  `
}
```

#### 예시 2: 미사용 코드 탐지

```typescript
User: "이 프로젝트에서 안 쓰는 함수 찾아줘"

async function findUnusedFunctions() {
  const sourceFiles = project.getSourceFiles();
  const unusedFunctions: string[] = [];

  for (const file of sourceFiles) {
    const functions = file.getFunctions();

    for (const func of functions) {
      const name = func.getName();
      if (!name) continue;

      // 참조 찾기
      const refs = await findReferences(name);

      // 정의만 있고 사용처가 없는 경우
      if (refs.usages.length === 0 && !func.isExported()) {
        unusedFunctions.push(name);
      }
    }
  }

  return unusedFunctions;
}

// 결과
{
  unusedFunctions: [
    "formatOldDate",      // src/utils/date.ts
    "legacyHashPassword", // src/auth/crypto.ts
    "debugLog"            // src/utils/logger.ts
  ],
  recommendation: "이 함수들은 제거해도 안전합니다."
}
```

#### 예시 3: 타입 안정성 검증

```typescript
User: "이 API 응답 타입이 일관되게 사용되고 있어?"

async function verifyTypeConsistency(typeName: string) {
  // 타입 정의 찾기
  const typeInfo = await findSymbol(typeName);
  const typeDefinition = typeInfo.type;

  // 모든 사용처 찾기
  const refs = await findReferences(typeName);

  // 각 사용처에서 타입 확인
  const inconsistencies = [];

  for (const usage of refs.usages) {
    const actualType = getTypeAtLocation(usage.location);

    if (actualType !== typeDefinition) {
      inconsistencies.push({
        location: usage.location,
        expected: typeDefinition,
        actual: actualType
      });
    }
  }

  return {
    consistent: inconsistencies.length === 0,
    inconsistencies
  };
}

// 결과
{
  consistent: false,
  inconsistencies: [
    {
      location: {
        file: "src/api/users.ts",
        line: 89
      },
      expected: "ApiResponse<User>",
      actual: "any"
    }
  ],
  suggestion: "타입 단언을 제거하고 명시적 타입 선언을 사용하세요."
}
```

### 5. 브라우저 유틸리티 개선

웹 페이지 분석 성능과 정확도가 향상되었습니다.

#### 개선 사항

**성능 최적화:**

```typescript
// Before (v1.0.x)
async function fetchWebPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();

  // DOM 파싱 (느림)
  const dom = new JSDOM(html);
  return extractContent(dom);
}
// 평균 응답 시간: 2.5초

// After (v1.1.0)
async function fetchWebPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();

  // 스트리밍 파싱 (빠름)
  const parser = new StreamingHTMLParser();
  const content = await parser.parse(html);
  return content;
}
// 평균 응답 시간: 1.7초 (32% 개선)
```

**정확도 향상:**

```typescript
// 메타데이터 추출 개선
interface WebPageMetadata {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  language: string;
}

// v1.1.0의 향상된 메타데이터 추출
function extractMetadata(html: string): WebPageMetadata {
  return {
    title: extractTitle(html),           // <title>, og:title, twitter:title
    description: extractDescription(html), // <meta name="description">, og:description
    author: extractAuthor(html),         // <meta name="author">, article:author
    publishDate: extractDate(html),      // <time>, article:published_time
    keywords: extractKeywords(html),     // <meta name="keywords">
    ogImage: extractOGImage(html),       // og:image
    canonicalUrl: extractCanonical(html), // <link rel="canonical">
    language: extractLanguage(html)      // <html lang>, og:locale
  };
}
```

## 기술적 세부사항

### 시맨틱 분석 아키텍처

```typescript
// src/analyzers/SemanticAnalyzer.ts

export class SemanticAnalyzer {
  private project: Project;
  private typeChecker: TypeChecker;
  private symbolCache: Map<string, SymbolInfo>;
  private referenceCache: Map<string, Reference[]>;

  constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: ScriptTarget.ESNext,
        module: ModuleKind.ESNext,
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true
      }
    });

    this.symbolCache = new Map();
    this.referenceCache = new Map();
  }

  public async analyze(
    code: string,
    options: AnalysisOptions = {}
  ): Promise<SemanticAnalysisResult> {
    // 1. 프로젝트 설정
    const sourceFile = this.project.createSourceFile("temp.ts", code, {
      overwrite: true
    });

    // 2. 프로그램 생성 및 타입 체커 초기화
    const program = this.project.createProgram();
    this.typeChecker = program.getTypeChecker();

    // 3. 심볼 테이블 구축
    const symbols = this.buildSymbolTable(sourceFile);

    // 4. 참조 그래프 구축
    const references = this.buildReferenceGraph(symbols);

    // 5. 의존성 분석
    const dependencies = this.analyzeDependencies(sourceFile);

    // 6. 타입 분석
    const types = this.analyzeTypes(sourceFile);

    return {
      symbols,
      references,
      dependencies,
      types,
      metrics: this.calculateMetrics(sourceFile)
    };
  }

  private buildSymbolTable(sourceFile: SourceFile): Map<string, SymbolInfo> {
    const table = new Map<string, SymbolInfo>();

    sourceFile.forEachDescendant(node => {
      const symbol = this.typeChecker.getSymbolAtLocation(node);

      if (symbol) {
        const name = this.getSymbolName(symbol);
        const info = this.buildSymbolInfo(symbol, node);
        table.set(name, info);
      }
    });

    return table;
  }

  private buildReferenceGraph(
    symbols: Map<string, SymbolInfo>
  ): Map<string, Reference[]> {
    const graph = new Map<string, Reference[]>();

    symbols.forEach((info, name) => {
      const refs = this.findAllReferences(name);
      graph.set(name, refs);
    });

    return graph;
  }
}
```

### 성능 최적화 전략

**1. 캐싱 메커니즘**

```typescript
class CachedSemanticAnalyzer {
  private cache = new LRUCache<string, SemanticAnalysisResult>({
    max: 100,
    ttl: 1000 * 60 * 5 // 5분
  });

  async analyze(code: string): Promise<SemanticAnalysisResult> {
    const hash = this.hashCode(code);

    // 캐시 확인
    const cached = this.cache.get(hash);
    if (cached) {
      return cached;
    }

    // 분석 실행
    const result = await this.analyzer.analyze(code);

    // 캐시 저장
    this.cache.set(hash, result);

    return result;
  }
}
```

**2. 증분 분석**

```typescript
// 전체 재분석 대신 변경된 부분만 분석
class IncrementalAnalyzer {
  private previousCode: string = "";
  private previousResult: SemanticAnalysisResult;

  async analyze(code: string): Promise<SemanticAnalysisResult> {
    // 변경 감지
    const diff = this.computeDiff(this.previousCode, code);

    if (diff.changes.length === 0) {
      // 변경 없음 - 캐시 반환
      return this.previousResult;
    }

    if (this.isMinorChange(diff)) {
      // 작은 변경 - 증분 업데이트
      return this.updateIncremental(this.previousResult, diff);
    }

    // 큰 변경 - 전체 재분석
    const result = await this.fullAnalysis(code);

    this.previousCode = code;
    this.previousResult = result;

    return result;
  }
}
```

## 사용 예시

### 예시 1: 코드 네비게이션

```typescript
User: "User 인터페이스가 어디 정의되어 있어?"

// hi-ai 실행
const symbol = await findSymbol("User");

// 응답
{
  name: "User",
  kind: "interface",
  type: "User",
  location: {
    file: "src/types/User.ts",
    line: 12,
    column: 18
  },
  declarations: [{
    kind: "interface",
    code: `
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
    `
  }]
}
```

### 예시 2: 리팩토링 준비

```typescript
User: "updateUser 함수를 리팩토링하려고 하는데 어디서 사용되는지 알려줘"

// hi-ai 실행
const refs = await findReferences("updateUser");

// 응답
{
  symbol: "updateUser",
  totalReferences: 15,
  definition: { /* ... */ },
  usages: [
    // 15개의 사용처
  ],
  summary: {
    reads: 12,
    writes: 0,
    files: [
      "src/controllers/UserController.ts",
      "src/services/AdminService.ts",
      "src/utils/userHelpers.ts"
    ]
  },
  impactAnalysis: `
영향받는 파일: 3개
총 호출 횟수: 15회

리팩토링 시 주의사항:
1. 모든 호출부의 파라미터 타입 확인 필요
2. AdminService에서의 사용은 권한 체크 로직 포함
3. userHelpers의 래퍼 함수도 함께 수정 필요
  `
}
```

## 업그레이드 가이드

### v1.0.x에서 v1.1.0으로

**1. 패키지 업데이트**

```bash
npm update @su-record/hi-ai
```

**2. 새 기능 활성화**

설정 파일에 시맨틱 분석 기능 추가:

```json
{
  "mcpServers": {
    "hi-ai": {
      "command": "npx",
      "args": ["-y", "@su-record/hi-ai"],
      "env": {
        "HI_AI_FEATURES": "ast,prompt,nlp,semantic"
      }
    }
  }
}
```

**3. 호환성 확인**

```typescript
// 기존 도구는 모두 호환
const complexity = await tools.execute("analyze_complexity", { code });

// 새 도구 사용 가능
const symbol = await tools.execute("find_symbol", { name: "MyClass" });
const refs = await tools.execute("find_references", { name: "myFunction" });
```

### Breaking Changes

없음. 모든 변경사항은 하위 호환성을 유지합니다.

### 새로 추가된 도구

- `find_symbol`: 심볼 정의 및 정보 검색
- `find_references`: 심볼 참조 위치 검색

## 성능 벤치마크

### 분석 속도

| 작업 | v1.0.6 | v1.1.0 | 개선율 |
|------|--------|--------|--------|
| 심볼 찾기 | N/A | 80ms | - |
| 참조 분석 (100줄) | N/A | 120ms | - |
| 참조 분석 (1000줄) | N/A | 450ms | - |
| 웹 페이지 분석 | 2.5s | 1.7s | 32% |

### 메모리 사용량

```
v1.0.6: 50MB
v1.1.0: 65MB (+15MB)

증가 이유: 타입 체커 및 심볼 테이블 메모리
```

### 정확도

```
심볼 탐색 정확도: 99.8%
참조 찾기 정확도: 99.5%
타입 추론 정확도: 98.2%
```

## 알려진 제한사항

### 1. 대규모 프로젝트 지원

현재는 단일 파일 또는 소규모 프로젝트에 최적화되어 있습니다.

```typescript
// 권장: 1000줄 이하
// 지원: 5000줄 이하
// 제한적 지원: 5000줄 이상
```

### 2. JavaScript 파일

JavaScript 파일은 타입 정보가 제한적입니다.

```javascript
// JavaScript: 타입 추론 제한적
function getUser(id) {
  // 파라미터와 반환 타입을 정확히 알 수 없음
  return users.find(u => u.id === id);
}

// TypeScript: 정확한 타입 정보
function getUser(id: number): User | undefined {
  return users.find(u => u.id === id);
}
```

## 다음 버전 계획

**v1.2.0 (예정: 2024-10-17)**
- UI 미리보기 시스템 추가
- 6가지 레이아웃 타입 지원
- ASCII 아트 기반 시각화

## 참고 자료

- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [시맨틱 분석 이론](https://en.wikipedia.org/wiki/Semantic_analysis_(compilers))
- [코드 탐색 패턴](https://refactoring.guru/design-patterns/catalog)
- [hi-ai GitHub](https://github.com/su-record/hi-ai)

---

**릴리즈 날짜:** 2024-08-13
**도구 개수:** 33개
**주요 기능:** 시맨틱 코드 분석, find_symbol, find_references
