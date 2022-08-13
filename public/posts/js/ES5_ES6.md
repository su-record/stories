## ECMAScript
> Ecma International이 ECMA-262 기술 규격에 따라 정의하고 표준화된 스크립트 프로그래밍 언어를 말한다.  
> 자바스크립트를 표준화하기 위해 만들어졌다.

### ES5
> 2009년 12월에 발행.  
> ES3에 'strict mode'를 추가하고 ES3의 규격에 있단 수많은 애매한 부분을 명확히 한다.  
> 5.1판은 2011년 6월에 발행했고, ISO/IEC 16262:2011 국제 표준 제3판과 함께 한다.

### ES6 (ES2015)
> 클래스와 모듈같은 복잡한 응용 프로그램을 작성하기 위한 새로운 문법이 추가되었다.  
> 이러한 문법의 의미는 ES5의 'strict mode'와 같은 방법으로 정의된다.  
> ECMAScript Harmony 혹은 ES6 Harmony 등으로 불리기도 한다.  
> ES6 이후부터 매년 추가되는 판을 발행하고 있다.

### 차이점
- let, const
  >var 키워드는 선언과 초기화가 동시에 이뤄지며, 변수의 재선언이 가능.  
  이런 단점을 보완하기 위해 선언 이후에 사용할 수 있고, 변수의 재선언이 되지 않는 블록 레벨 스코프 let, const가 추가.  
  let, const 둘의 차이점은 immutable 여부로서 let은 값의 재할당이 가능하지만, const는 불가능.
- arrow function
  ```js
  // es5
  var sum = function(a, b) {
    return a+b;
  }
  
  // es6
  const sum = (a, b) => a+b;
  ```
  >전통적인 함수표현의 간편한 대안.
    - this, super에 대한 바인딩이 없고, methods로 사용될 수 없다.
    - new.target 키워드가 없다.
    - 일반적으로 스코포를 지정할 때 사용하는 call, apply, bind methods를 이용할 수 없다.
    - 생성자(Constructor)로 사용할 수 없다.
    - yeild를 화살표 함수 내부에서 사용할 수 없다. (제네레이터로 사용할 수 없다.)


- default function parameter
  >기본값 함수 매개변수(default function parameter)를 사용하면 값이 없거나 undefined가 전달될 경우 이름붙은 매개변수를 기본값으로 초기화할 수 있다.
  ```js
  function sum(a, b = 3) {
    return a + b;
  }
  
  console.log(sum(3)) // 6
  console.log(sum(3, 5)) // 8
  ```
- template literal
  >내장된 표현식을 허용하는 문자열을 리턴.  
  여러 줄로 이뤄진 문자열과 문자 보간기능을 사용할 수 있다.  
  source 내에 삽입되는 newline characters(\n)은 template literal의 일부가 된다.  
  공백도 인식.
  ```js
  `string text` === 'string text'
  `string ${code} text` === 'string' + ' ' + code + ' ' + 'text'
  
  'string text line 1\n'+
  'string text line 2'
  
  `string text line 1
  string text line2`
  ```
- class
  >클래스는 객체 지향 프로그래밍에서 특정 객체를 생성하기 위한 변수와 메소드를 정의하는 일종의 틀로, 객체를 정의하기 위한 상태(멤버 변수)와 메소드(함수)로 구성된다.  
  자바스크립트에서 클래스는 객체 생성 방식 중 하나이며 함수의 한 종류이다.
  ```js
  class User {
    constructor(name) {
      this.name = name; // 멤버 변수
    }
    //메소드
    sayHi() {
      console.log(this.name)
    }
  }
  
  // 클래스는 함수.
  typeof User // function
  // 정확히는 생성자 메소드와 동일.
  User === User.prototype.constructor
  // 내부에서 정의한 메소드는 User.prototype에 저장된다.
  User.prototype.sayHi()
  // 현재 프로토타입에는 메소드가 두 개이다.
  Object.getOwnPropoertyNames(User.prototype) // constructor, sayHi
  
  const user = new User('Willy')
  typeof user // object
  console.log(user) // { name: 'Willy' } 
  ```
- module
  >재사용하기 위한 코드 조각을 뜻하며, 세부사항은 캡슐화시키고, API 부분만 외부에 노출시킨 코드이다.
  ```js
  // type에 module을 추가하고, 파일 확장자를 mjs로 변경시켜 사용한다.
  <script type="module" src="lib.mjs"></script>
  <script type="module" src="app.mjs"></script>
  
  // 모듈 스코프를 가지며 특수한 지시자 export, import 키워드로 사용한다.
  // lib.js
  export function sayHi(user) { /* ... */ }
  // app.js
  import { sayHi } from "~/lib.js"
  ```
    - 엄격모드로 실행 됨.
      >선언되지 않은 변수에 값을 할당하는 등의 코드는 에러를 발생시킨다.
    - 모듈 레벨 스코프
      >모듈은 자신만의 스코프가 있습니다. 따라서 모듈 내부에 정의한 변수나 함수는 다른 스크립트에서 접근할 수 없다.
    - 단 한번만 평가됨
      >동일한 모듈이 여러 곳에서 사용되더라도 모듈은 최초 호출 시 단 한번만 실행횐다. 실행 후 결과는 이 모듈을 가져가려는 모든 모듈에 내보내 진다.
    - import.meta
      >import.meta 객체는 현대 모듈에 대한 정보를 제공한다.
    - this는 undefined
      >일반 스크립트의 this는 전역 객체인 것과 달리 모듈 최상위 레벨의 this는 undefined이다.
    - 실제 애플리케이션을 출시할 때는 성능 개선 등의 이점 때문에 웹팩과 같은 번들러를 사용하여 모듈을 한데 묶어(번들링) 프로덕션 서버에 올리는 방식을 사용한다.


- destructuring (구조분해할당)
  >구조 분해 할당 구문은 배열이나 객체의 속성을 해체하며 그 값을 개별 변수에 담을 수 있게 하는 Javascript 표현식이다.
  ```js
  let a, b, rest;
  [a, b] = [10, 20];
  a; // expected output: 10
  b; // expected output: 20
  
  [a, b, ...rest] = [10, 20, 30, 40, 50];
  rest; // Array[30, 40, 50]
  
  const arr = [1, 2, 3];
  const [one, two, three] = arr
  one; // 1
  
  const obj = { firstName: 'Jamse', lastName: 'Bond'}
  const { lastName, firstName } = obj
  firstName; // Jamse
  ```
- Promise
  >Promist는 자바스크립트 비동기 처리에 사용되는 객체이다. 자바스크립트의 비동기 처리란 '특정 코드의 실행이 완료될 때까지 기다리지 않고 다음 코드를 먼저 수행하는 자바스크립트의 특성'을 의미한다.  
  자바스크립트 비동기 통신은 콜백 함수를 사용한 콜백 패턴이었으나, 결과적으로 콜백이 되풀이되는 상태를 발생시켰고, 이를 해결하기 위해 Promise가 도입됐다.
  ```js
  // before
  function getData(callbackFunc) {
    $.get('url 주소/products/1', function(response) {
      // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
      callbackFunc(response);
    });
  }
  
  getData(function(tableData) {
    // $.get()의 response 값이 tableData에 전달됨
    console.log(tableData);
  });
  
  // after
  function getData(callback) {
    // new Promise() 추가
    return new Promise(function(resolve, reject) {
      $.get('url 주소/products/1', function(response) {
        // 데이터를 받으면 resolve() 호출
        resolve(response);
      });
    });
  }
  
  // getData()의 실행이 끝나면 호출되는 then()
  getData().then(function(tableData) {
    // resolve()의 결과 값이 여기로 전달됨
    console.log(tableData); // $.get()의 reponse 값이 tableData에 전달됨
  });
  ```
    - Promise 3가지 상태(states)
      >Promist를 사용할 때 알아야 하는 가장 기본적인 개념이 바로 Promise의 상태이다.  
      여기서 말하는 상태란 Promist의 처리 과정을 의미한다. new Promise()로 Promise를 생성하고 종료될 때까지 3가지 상태를 갖는다.
        - Pending(대기) : 비동기 처리 로직이 아직 완료되지 않은 상태
        - Fulfilled(이행) : 비동기 처리가 완료되어 Promist가 결과 값을 반환해준 상태
        - Rejected(실패) : 비동기 처리가 실패하거나 오류가 발생한 상태


- for-of
  >단순히 key만을 받아 제공했던 for-in문과 다르게, for-of 문은 완전한 순회를 제공한다.
  ```js
  let nums = [11, 22, 33, 44];
  for(let e in nums) {
    console.log(e) // 0 1 2 3
  }
  
  for(let e of nums) {
    console.log(e) // 11 22 33 44
  }
  ```
- Generator
  >Generator는 일종의 stack기반 coroutine이다.  
  상태를 저장하며 함수를 정지해서 나오고, 그 상태 그대로 다시 재진입이 가능하다.
  ```js
  function* getCounter() {
    let count = 0;
    
    while(count<100) {
      count += 1;
      yield count; // 상태를 저장한 채로 반환
    }
  }
  
  let counter = getCounter();
  
  console.log(counter.next()); // 1
  console.log(counter.next()); // 2
  console.log(counter.next()); // 3
  ```
- Spread 연산자
  >Spread 연산자는 반복가능한 값을 쉼표로 구분해 풀어낸다.
  인자로 해체해서 전달할 때 유용하다.
  ```js
  const a = [1,2,3];
  const b = [4,5,6];
  console.log([...a, ...b]) // [1,2,3,4,5,6]
  ```
- 오브젝트 축소 표현
  ```js
  const obj = {
    name: name,
    age: age
  }
  
  const obj = {
    name,
    age
  }
  ```
- string method (includes, startsWith, endsWith)
  >문자열 메서드가 추가됨.  
  포함되어 있는지(includes), 시작되는지(startsWith), 끝나는지(endsWith)를 ture/false 값을 리턴하며 문자열 메소드들로 검사 로직을 수행할 수 있다.
  ```js
  const test = "Hello world! Dream come true";
  
  text.includes("Dream") // true
  text.startsWith("Hello") // true
  text.endsWith("true") // true
  ```