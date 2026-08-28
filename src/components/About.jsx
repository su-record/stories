import { useEffect } from 'react'
import metrics from '../data/about-metrics.json'
import { k, kFloor, floorTo } from '../utils/aboutMetrics'
import './About.css'

function About() {
  const printPage = () => window.print()
  const { tory, vibe, lgCms, fallingo } = metrics.repos
  const vibeNpm = metrics.npm['@su-record/vibe']

  useEffect(() => {
    document.title = '함수원 · About'
  }, [])

  return (
    <div className="about">
      {/* ---------- hero ---------- */}
      <header className="ab-hero">
        <div className="ab-hero-main">
          <h1 className="ab-name">함수원</h1>
          <p className="ab-role">
            프론트엔드 개발자 · AI-First 개발
            <br />
            제품과, 그 제품을 잘 만드는 도구까지 직접 만드는 풀스택 개발자
          </p>
          <p className="ab-prompt">
            <span className="c">&gt;</span> exp <b>12년 10개월</b> &nbsp;·&nbsp; projects <b>5</b>
            &nbsp;·&nbsp; 🏆 해커톤 <b>1위</b> &nbsp;·&nbsp; npm <b>×2</b>
          </p>
        </div>
        <div className="ab-hero-side">
          <ul className="ab-contact">
            <li><b>su.lifestory@gmail.com</b></li>
            <li>010-4549-4662</li>
            <li><a href="https://github.com/su-record" target="_blank" rel="noopener noreferrer">github.com/su-record</a></li>
          </ul>
          <button type="button" className="ab-pdf" onClick={printPage}>↓ PDF로 저장</button>
        </div>
      </header>

      {/* ---------- stats ---------- */}
      <div className="ab-stats">
        <div className="ab-stat"><div className="num">12년 10개월</div><div className="lab">프론트엔드 개발 경력</div></div>
        <div className="ab-stat"><div className="num">5</div><div className="lab">단독 설계·구현 개인 프로젝트</div></div>
        <div className="ab-stat"><div className="num">npm ×2</div><div className="lab">공개 배포 (vibe · hi-ai)</div></div>
        <div className="ab-stat"><div className="num">1위</div><div className="lab">cmux × AIM 해커톤 (2026.04)</div></div>
      </div>

      <p className="ab-lead">
        저는 <b>12년 10개월 차 프론트엔드 개발자</b>입니다. React·Vue 기반 웹부터 안내로봇 UI, 여행 커머스,
        사내 AI 에이전트까지 여러 분야의 제품을 <b>실제 사용 단계까지 만들어 현장에 정착</b>시켜 왔습니다.
        최근 2년은 AI를 보조 도구가 아니라 제품과 업무 흐름의 중심에 두는 AI-First 개발에 집중하고 있습니다.
        “AI를 써봤다”에 머무르지 않고, <b>업무에 연결하고 · 사람이 쓰게 만들고 · 팀이 반복할 수 있게 남기는 일</b>을 합니다.
      </p>

      {/* ---------- core ---------- */}
      <section className="ab-sec">
        <h2 className="ab-h2"><span className="meta">// CORE</span> 핵심 역량</h2>
        <div className="ab-grid3">
          <div className="ab-ev">
            <div className="k">FULL-STACK</div>
            <h3>프론트 경력 위에 쌓은 단독 풀스택 구현력</h3>
            <p>RN·Flutter·Next.js 프론트에 FastAPI·Azure Functions 백엔드, PostgreSQL·PostGIS·그래프 DB, 멀티 클라우드(Azure·AWS·GCP)·CI/CD까지 한 사람이 설계·운영합니다.</p>
          </div>
          <div className="ab-ev">
            <div className="k">AI-NATIVE</div>
            <h3>AI를 제품과 업무에 ‘안착’시킨 경험</h3>
            <p>사내 AI 에이전트를 기획부터 실제 사용까지 혼자 구축했고, 바이브코딩 방법론을 사내에 교육·전파해 팀의 일하는 방식으로 자리 잡게 했습니다.</p>
          </div>
          <div className="ab-ev">
            <div className="k">QUALITY</div>
            <h3>품질을 프롬프트가 아닌 ‘시스템’으로</h3>
            <p>SPEC·결정론적 게이트·OWASP LLM 가드·테스트 커버리지로 AI 산출물의 완료 판정을 자동화하는 프레임워크를 직접 만듭니다.</p>
          </div>
        </div>
      </section>

      {/* ---------- stack ---------- */}
      <section className="ab-sec">
        <h2 className="ab-h2"><span className="meta">// STACK</span> 기술 스택</h2>
        <div className="ab-stack">
          <div className="row"><span className="cat">Frontend</span><span className="items">React · Next.js · Vue · Nuxt.js · TypeScript · React Native · Flutter</span></div>
          <div className="row"><span className="cat">State / UI</span><span className="items">TanStack Query · Zustand · SWR · Redux · Tailwind · Storybook</span></div>
          <div className="row"><span className="cat">Backend</span><span className="items">FastAPI · Azure Functions · Node.js · PostgreSQL · PostGIS · Prisma · Redis · OpenSearch</span></div>
          <div className="row"><span className="cat">AI / Agent</span><span className="items">Claude · OpenAI · Gemini · LangGraph · LangChain · MCP · RAG · pgvector</span></div>
          <div className="row"><span className="cat">Infra</span><span className="items">Azure · AWS · GCP · Container Apps · Docker · GitHub Actions · Bicep · Vercel</span></div>
          <div className="row"><span className="cat">Tools</span><span className="items">Git · GitLab · Turborepo · Vite/Webpack · Playwright · Claude Code · Cursor</span></div>
        </div>
      </section>

      {/* ---------- experience ---------- */}
      <section className="ab-sec">
        <h2 className="ab-h2"><span className="meta">// EXPERIENCE</span> 실무에서 만든 AI와 서비스</h2>
        <div className="ab-highlight">
          <div className="hl-head">
            <h3>사내 AI 에이전트 · GROVE (그로브소프트)</h3>
            <span className="pill">● 실사용 중</span>
            <a className="lk" href="https://aistudio.google.com/apps/drive/1WBt--VaI_Uu0CpFiesfmouj1Pbp0AvQq?showPreview=true&showAssistant=true&fullscreenApplet=true" target="_blank" rel="noopener noreferrer">소개 PPT</a>
          </div>
          <p>
            자연어 회의실 예약, 사내 규정 RAG(pgvector + 온톨로지 필터), 조직도·인물 온톨로지(10종 관계), 사용자 확인(Human-in-the-loop),
            Claude/OpenAI 장애 대비(Fallback), PWA 웹 푸시(iOS 대응 포함)까지 포함한 AI 에이전트 시스템을 <b>기획·설계·검수 100%</b>로 혼자 구축했습니다.
            LangGraph로 <b>5개 서브그래프·36개 AI 도구</b>를 설계하고 PostgreSQL Checkpointer로 멀티턴 대화 상태를 영속화했으며,
            <b> 백엔드 225개 파일·54,000+ 라인</b> 규모의 프로덕션 시스템을 AI 협업으로 완성해 사내에서 활발히 사용 중입니다.
          </p>
        </div>
        <div className="ab-highlight">
          <div className="hl-head">
            <h3>LG디스플레이 글로벌 홈페이지 CMS (그로브소프트)</h3>
            <span className="pill">● 개발 중</span>
          </div>
          <p>
            운영 중인 LG디스플레이 글로벌 홈페이지를 <b>컴포넌트 기반 헤드리스·비주얼 하이브리드 CMS</b>로 재구축하는 프로젝트를
            <b> 개발 단독 담당</b>으로 진행하고 있습니다. 관리자·공개 사이트·발행 워커와 컴포넌트·코어·DB 패키지를 나눈
            Turborepo 모노레포(<b>{lgCms.workspaces} 워크스페이스 · TypeScript {floorTo(lgCms.loc, 1000)} 라인 · {lgCms.commits} 커밋</b>)에, 편집자가 드래그로 조립하는
            <b> 컴포넌트 {lgCms.components}개</b>와 <b>Prisma 모델 {lgCms.prismaModels}개</b>를 설계했습니다.
            버전·승인 워크플로우·예약 발행·번역 요청(<b>한/영/중/베트남 {lgCms.locales}개 언어</b>)·문의 메일 라우팅·OpenSearch 검색·
            방문 분석까지 운영에 필요한 흐름을 스키마 단위로 정의했고, 라이브 사이트와의 텍스트·픽셀 대조와
            Lighthouse·axe 접근성 검사를 검증 스크립트로 묶어 <b>이관 품질을 사람 눈이 아니라 기계가 판정</b>하게 만들었습니다.
          </p>
        </div>
        <p className="ab-p">
          그 외에도 <b>KT Brand 박물관 오디오 가이드</b>, <b>뷰티포인트</b> 개발·운영, <b>여행 패키지 커머스 신규 출시</b>,
          <b>프리비아 호텔 상세 리뉴얼</b>, <b>투어비스 호텔 예약 A/B 테스트</b>, <b>클로봇 안내로봇 큐레이팅봇 UI</b> 등
          여러 분야의 실제 프로젝트를 맡으며, 새로운 현장의 문제를 빠르게 파악해 실제 사용 단계까지 이끌어 왔습니다.
        </p>
      </section>

      {/* ---------- projects ---------- */}
      <section className="ab-sec">
        <h2 className="ab-h2"><span className="meta">// PROJECTS</span> 개인 프로젝트</h2>
        <p className="ab-p">
          AI-First 개발의 양 끝 — <b>실사용자가 쓰는 제품</b>과 <b>그 제품을 잘 만들기 위한 도구·프레임워크</b> — 를
          모두 직접 만들고 공개·운영합니다.
        </p>

        <div className="ab-cathead"><span className="tag">PRODUCT</span> 실사용·출시 지향 제품</div>

        <article className="ab-card">
          <div className="card-head">
            <h3><em>토리야</em> · 그래프 기반 개인 AI 동반자</h3>
            <span className="links">
              <a href="https://tory.my/" target="_blank" rel="noopener noreferrer">tory.my</a>
              <a href="https://gist.github.com/su-record/0cc550f5d1434fd4a7c0c10fd9e4e77a" target="_blank" rel="noopener noreferrer">소개 gist</a>
            </span>
          </div>
          <p className="desc">먼저 말 걸어 주는 AI 동반자가 운영하는 “그래프형 개인 위키”. 일상·일정·감정·아이디어를 하나의 그래프에 쌓아 두고, 시간·맥락·루틴에 맞춰 먼저 기억을 떠올려 줍니다. 모바일·웹·백엔드·DB·인프라까지 혼자 설계한 풀스택 모노레포이며, <b>iOS App Store에 출시</b>해 운영 중입니다.</p>
          <div className="metrics">
            <span>TypeScript <b>~{k(tory.loc)} LOC</b></span><span>HTTP 함수 <b>{tory.httpFunctions}개</b></span><span>도메인 모듈 <b>{tory.domainModules}개</b></span><span>{tory.activeDays}일 <b>{floorTo(tory.commits, 10)} 커밋</b></span><span><b>App Store 출시</b> · Play 비공개 테스트</span>
          </div>
          <ul>
            <li><b>아키텍처</b> · React Native(Expo SDK 56) 모바일 + Next.js 15 웹 + Azure Functions 백엔드(HTTP 함수 {tory.httpFunctions}개 · 도메인 모듈 {tory.domainModules}개) + Container Apps 배치 워커의 {tory.workspaces}-workspace 모노레포, OKLCH 디자인 토큰을 web·RN 양쪽으로 자동 생성</li>
            <li><b>데이터·보안</b> · PostgreSQL + Apache AGE(그래프)+pgvector(임베딩) 단일 DB에 마이그레이션 {tory.migrations}개, 행 단위 RLS 멀티테넌시. OpenAI·Claude·Gemini·xAI를 태스크별로 자동 라우팅하되 모든 LLM 경로를 OWASP LLM G1–G7 게이트(프롬프트 격리·출력 안전·툴 인가·소비 예산)와 폴백 기록으로 감쌈</li>
            <li><b>능동 지능</b> · 아침 브리핑·점심 추천·저녁 회상을 materializer→dispatcher→FCM/APNs로 발송하고, 접속 상황(presence)·응답 빈도·조용 모드로 말 걸 시점을 조절. “언제 무엇을 말할지”의 판단권은 규칙이 아니라 모델에 두되, safety-guard와 slop 검사를 발송 직전 마지막 관문으로 둠</li>
            <li><b>음성·통화</b> · 모드별 벤더 이원화 — 통화는 Gemini Live(페르소나 보이스를 ephemeral 토큰에 잠금), 실시간 통역은 OpenAI <code>gpt-realtime-translate</code>로 한국어·상대 언어 두 세션을 동시에 열어 양방향 처리. 요금제별 실시간 분(minute) 예산을 서버가 예약·정산</li>
            <li><b>지식 수집</b> · 활성 사용자 관심사의 합집합으로 RSS 소스를 매일 04:30(KST) 수집→중복 제거→임베딩→매칭하는 뉴스 애그리게이터(KEDA cron Job, 벽시계 예산으로 자체 제한)와 주간 다이제스트. 위치 권한 없이 대화에서 “자주 가는 곳”을 수확하되, 세는 값이 방문 횟수가 아니라 <b>언급된 일수</b>임을 모델에 명시해 단정 오류를 막음</li>
            <li><b>결제·출시</b> · Paddle(웹 MoR) + Apple IAP + Google Play Billing 3중 결제 경로를 서버 검증·웹훅까지 직접 구현, {tory.locales}개 언어 UI와 법적 고지 로케일라이즈로 심사 통과. Azure Bicep {tory.bicepModules}개 모듈 + GitHub Actions {tory.workflows}개 워크플로·EAS OTA 채널로 인프라와 릴리스를 코드로 운영</li>
          </ul>
          <div className="tech">TypeScript · React Native(Expo) · Next.js 15 · Azure Functions · Container Apps · PostgreSQL · Apache AGE · pgvector · Gemini Live · Azure Bicep</div>
        </article>

        <article className="ab-card">
          <div className="card-head">
            <h3><em>fallingo</em> · 위치 기반 검증형 음식 소셜 플랫폼</h3>
            <span className="links">
              <a href={`${import.meta.env.BASE_URL}fallingo-api/`} target="_blank" rel="noopener noreferrer">REST API 문서</a>
              <a href="https://gist.github.com/su-record/269530f1fd2f7193e80424d084b51a91" target="_blank" rel="noopener noreferrer">소개 gist</a>
            </span>
          </div>
          <p className="desc">평점·리뷰 없이 “사진 공유 자체가 추천”이 되는 음식 플랫폼. GPS·비전·OCR로 실제 방문을 검증해 추천 신뢰도를 만들고, 게임처럼 즐기도록 설계했습니다. 100% 바이브코딩으로 풀스택(FastAPI 백엔드 + Flutter 앱)을 완성해 TestFlight 베타까지 올렸습니다. 현재 개발중이던 서버는 기획부터 다시 서비스 설계를 시작하기 위해 내렸고, 기존의 개발을 했었던 {fallingo.restOperations}개 REST 엔드포인트 스키마는 문서로 공개해 두었습니다.</p>
          <div className="metrics">
            <span>코드 <b>~{k(fallingo.loc)} LOC</b></span><span>REST API <b>{fallingo.restOperations}개</b></span><span>다국어 <b>15 로케일</b></span><span><b>GCP→Azure</b> 마이그레이션</span><span><b>TestFlight</b> 베타</span>
          </div>
          <ul>
            <li><b>신뢰도 검증</b> · 50m 지오펜스(PostGIS) + Azure AI Vision 음식 인식(신뢰도 0.8+) + Document Intelligence OCR 영수증(24시간 이내)의 3단계 인증</li>
            <li><b>검색·정규화</b> · BM25 + pgvector + 8개 데이터셋 음식 온톨로지 그래프를 RRF로 병합한 하이브리드 검색. 쿼리뿐 아니라 피드·메뉴·OCR 데이터도 한국어로 번역 저장(원문→한국어→온톨로지 매핑 2단계, alias 우선 + AI 음차 번역)해 글로벌 검색·온톨로지 매칭률 확보</li>
            <li><b>온톨로지 자동 진화</b> · 검색 실패·저신뢰 링킹을 일간 수집 → 월간 분석해 별칭·관계를 자동 제안·적용하고, 3·6개월 미사용 엔티티는 stale 판정으로 정리하는 5단계 파이프라인</li>
            <li><b>인프라 마이그레이션</b> · 운영 중인 서비스를 GCP → Azure로 전면 이관(Container Apps·PostgreSQL·Blob·Key Vault·CI/CD 재구성)</li>
            <li><b>운영·재미</b> · Container Apps 20개 스케줄 잡(월드이벤트·알림·게이미피케이션·검수·온톨로지 진화)으로 무인 운영, 12단계 티어와 인증 기반 포인트로 별점 없이 메뉴 인기를 가늠</li>
          </ul>
          <div className="tech">Flutter · FastAPI · PostgreSQL · PostGIS · pgvector · Redis · Azure AI Vision · Document Intelligence · Firebase</div>
        </article>

        <div className="ab-cathead"><span className="tag">TOOLING</span> 개발자 도구 · 프레임워크 (오픈소스·공개 배포)</div>

        <article className="ab-card">
          <div className="card-head">
            <h3><em>Vibe</em> · SPEC 기반 AI 코딩 프레임워크</h3>
            <span className="links">
              <a href="https://www.npmjs.com/package/@su-record/vibe" target="_blank" rel="noopener noreferrer">npm</a>
              <a href="https://gist.github.com/su-record/acf53ba8d242c2dd422bf817f85d43bc" target="_blank" rel="noopener noreferrer">소개 gist</a>
            </span>
          </div>
          <p className="desc">바이브코딩의 품질 문제를 “더 좋은 프롬프트”가 아니라 SPEC·시나리오·결정론적 게이트로 다루는 <b>검증 하네스</b>. 완료 판정을 모델의 자기보고가 아니라 <b>코드(게이트)가 내리게</b> 만들고, 실행마다 Evidence Bundle을 남기는 것이 핵심 철학입니다.</p>
          <div className="metrics">
            <span>TypeScript <b>{k(vibe.loc)} LOC</b></span><span>Skills <b>{vibe.skills}</b> · Agents <b>{vibe.agents}</b></span><span>테스트 <b>{vibe.tests} 파일</b></span><span>npm <b>{kFloor(vibeNpm.totalDownloads)} 다운로드</b></span><span>v<b>{vibe.version}</b></span>
          </div>
          <ul>
            <li><b>루프 엔지니어링</b> · 자연어 요구 → SPEC 1패스 → 승인 1회 → ANCHOR·ACT·JUDGE·RECORD 루프로 게이트 통과까지 자동 반복. 수렴은 discover-hash가 판정해 2라운드 findings가 같으면 stuck으로 확정하고 사람에게 넘김. 처음 거는 루프는 두 바퀴만 돌고 멈추는 시운전 게이트로 폭주를 막음</li>
            <li><b>3계층 품질 방어</b> · 편집 훅(<code>any</code>·<code>@ts-ignore</code>·<code>console.log</code> 즉시 주입) → 결정론 게이트(PR 전 테스트 스위트 직접 실행·verify 전 커밋 거부·파괴적 명령 차단) → 관점별 병렬 리뷰어로 P1=0까지 수렴</li>
            <li><b>“봤다”도 게이트로</b> · 렌더 결과가 완료 기준인 작업은 <code>verify=visual</code>로 다이어그램·화면을 실제로 렌더해 exit code로 판정하고, 설치된 스킬이 배송본과 동일한지 무결성 검사로 확인. 판정의 근거를 사람의 눈에서 계속 떼어내는 방향</li>
            <li><b>회귀 기억</b> · verify 실패를 회귀 테스트로 자동 등록하고 반복 패턴은 예방 테스트로 승격, 결정·제약은 SQLite + FTS5로 세션 간 유지. SPEC의 근거는 <b>확인 / 해석 / 모름</b> 3등급으로 표시해 추측이 사실로 굳는 것을 차단</li>
            <li><b>확장성</b> · Claude Code·Codex를 한 코드베이스에서 동시 지원(+Cursor·Antigravity), 23개 스택 자동 감지 후 스택별 스킬만 로드, Figma ↔ 코드 양방향과 DESIGN.md(시각 SSOT)</li>
          </ul>
          <div className="tech">TypeScript(ESM) · better-sqlite3(FTS5) · ts-morph · zod · Vitest · Claude Code · Codex 하네스</div>
        </article>

        <article className="ab-card">
          <div className="card-head">
            <h3><em>hi-ai</em> · MCP 기반 AI 개발 어시스턴트</h3>
            <span className="links">
              <a href="https://smithery.ai/server/@su-record/hi-ai" target="_blank" rel="noopener noreferrer">Smithery</a>
              <a href="https://gist.github.com/su-record/25b5f0506fe3bdb86674a26118571805" target="_blank" rel="noopener noreferrer">소개 gist</a>
            </span>
          </div>
          <p className="desc">자연어(한/영) 키워드로 35개 전문 도구를 호출하는 Model Context Protocol 서버. Claude Desktop·Cursor·Windsurf에서 메모리·검색·코드 분석을 즉시 사용합니다. vibe 개발 시점에 추가 업데이트 개발은 중단됐습니다.</p>
          <div className="metrics">
            <span>도구 <b>35개</b></span><span>테스트 <b>89케이스</b></span><span><b>npm + Smithery + Glama</b></span>
          </div>
          <ul>
            <li><b>지식 그래프 메모리</b> · SQLite 관계형 저장소에 BFS/DFS 탐색과 5가지 검색 전략(keyword·graph·temporal·priority·context)</li>
            <li><b>AST 코드 분석</b> · ts-morph로 복잡도(Cyclomatic·Cognitive·Halstead)·순환 의존성 분석(TS·Python), 프로젝트 캐싱으로 반복 분석 가속</li>
          </ul>
          <div className="tech">TypeScript(strict) · @modelcontextprotocol/sdk · ts-morph · better-sqlite3 · Smithery SDK</div>
        </article>

        <article className="ab-card">
          <div className="card-head">
            <h3><em>Torya-ext</em> · 브라우저 에러를 코딩 에이전트로 라우팅 <span className="trophy">🏆 해커톤 1위</span></h3>
            <span className="links">
              <a href="https://youtu.be/ThCDOJLsPkg" target="_blank" rel="noopener noreferrer">시연 영상</a>
              <a href="https://gist.github.com/su-record/9e05e6b4fdbbfa4f8d94ff3465d216c1" target="_blank" rel="noopener noreferrer">소개 gist</a>
            </span>
          </div>
          <p className="desc">크롬 브라우저 익스텐션으로 개발되었고, 브라우저 콘솔·네트워크·DOM 에러를 캡처해 “보는 곳(브라우저) → 고치는 곳(터미널/cmux)”로 직접 연결하는 개발자 도구. cmux × AIM Intelligence 해커톤 Developer Tooling 트랙 1위 수상작입니다.</p>
          <div className="metrics">
            <span><b>9시간</b> 만에 설계·개발·배포</span><span>TS <b>2.6K</b> + Go <b>1.6K</b></span><span><b>크로스 플랫폼</b> 바이너리</span>
          </div>
          <ul>
            <li><b>3계층 아키텍처</b> · Chrome Extension(MV3, React/TS) ↔ Go Native Messaging Bridge ↔ 코딩 에이전트(claude/codex/gemini 자동 감지)를 포트·토큰 없이 stdio로 연결</li>
            <li><b>동작</b> · 에러 디듀프 + origin↔로컬 워크스페이스 매핑, cmux RPC 우선 + OS 터미널 폴백으로 “본 에러를 그 자리에서 바로 수정”</li>
            <li><b>안전성·배포</b> · 워크스페이스 화이트리스트로 path traversal 방지, GitHub Actions로 macOS/Linux/Windows 바이너리 자동 빌드·배포</li>
          </ul>
          <div className="tech">TypeScript · React · Chrome MV3 · Go(무의존) · Native Messaging · GitHub Actions</div>
        </article>
      </section>

      {/* ---------- how I work ---------- */}
      <section className="ab-sec">
        <h2 className="ab-h2"><span className="meta">// HOW I WORK</span> 제가 일하는 방식</h2>
        <div className="ab-grid3">
          <div className="ab-ev"><div className="k">진단</div><p>현장의 요구와 운영 제약을 구분해, 구현 가능한 요구사항과 우선순위로 정리합니다.</p></div>
          <div className="ab-ev"><div className="k">구현</div><p>프로토타입에 그치지 않고 데이터·권한·예외·운영까지 고려한 실제로 쓰이는 결과물을 만듭니다.</p></div>
          <div className="ab-ev"><div className="k">전파</div><p>개인 도구를 넘어 팀이 반복할 템플릿·기준·검증 루프로 남깁니다.</p></div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <div className="ab-closing">
        <p>
          12년 10개월간 쌓은 프론트엔드 실행력을 바탕으로, 최근에는 <b>제품과 그 제품을 잘 만드는 도구를 함께 설계·구현</b>하고 있습니다.
          AI를 한 번 써보는 데 그치지 않고, 실제 업무에 녹여 동료가 쓰게 만들고, 반복 가능한 자산으로 남기는 일에 집중합니다.
          현장의 문제를 구조화해 실제로 쓰이는 결과물로 바꾸는 데, 제가 쌓아온 경험과 도구가 곧바로 기여할 수 있다고 믿습니다.
        </p>
        <div className="sign">함수원</div>
      </div>

      <div className="ab-links">
        <a href="https://github.com/su-record" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://tory.my/" target="_blank" rel="noopener noreferrer">토리야</a>
        <a href={`${import.meta.env.BASE_URL}fallingo-api/`} target="_blank" rel="noopener noreferrer">fallingo API</a>
        <a href="https://www.npmjs.com/package/@su-record/vibe" target="_blank" rel="noopener noreferrer">Vibe</a>
        <a href="https://smithery.ai/server/@su-record/hi-ai" target="_blank" rel="noopener noreferrer">hi-ai</a>
        <a href="https://youtu.be/ThCDOJLsPkg" target="_blank" rel="noopener noreferrer">Torya-ext</a>
        <button type="button" className="ab-linkbtn" onClick={printPage}>PDF로 저장</button>
      </div>
    </div>
  )
}

export default About
