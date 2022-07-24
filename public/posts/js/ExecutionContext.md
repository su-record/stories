# 실행컨텍스트
>코드를 실행하는데 환경을 제공하는 객체. (식별자 결정을 더욱 효율적으로 하기 위한 수단)  
✴︎환경 (Environment): 코드 실행에 영향을 주는 조건이나 상태
- Record
  >환경 레코드(Environment Record)  
  식별자와 식별자에 바인딩된 값을 기록해두는 객체.
- Outer
  >외부 환경 참조(Outer Environment Reference)  
  바깥 Lexical Environment(정적 환경)를 가리킴

## 호이스팅
>선언되기 전에 호출해도 에러가 나지 않고, 변수나 함수를 참조할 수 있는 현상.  
>즉, 선언문이 마치 최상단에 끌어올려진 듯한 현상.
```
console.log(netflix); // undefined

var netflix = "오징어 게임";

console.log(netflix); // 오징어 게임
```
- 호이스팅이 발생하는 이유는 선언문이 있는 코드라인을 물리적으로 최상단에 끌어 올렸기 때문이 아닌, 자바스크립트 엔진이 먼저 전체 코드를 스캔하면서 변수, 함수 같은 정보를 실행컨텍스트 어딘가에 미리 기록해두기 때문이다. 이 때 기록해는 곳을 Environment Record(환경 레코드) 라고 한다.

### 변수 호이스팅 (Variable Hoisting)
- #### var
  >선언과 초기화가 동시에 이루어져서 선언문 이전에도 변수를 참조할 수 있다.
    - 선언 단계  
      변수 선언시 메모리 공간을 확보해두고 메모리 주소에 식별자를 연결한다.
    - 초기화 단계  
      식별자를 암묵적으로 undefined 값으로 초기화 한다.
  ```
  console.log(netflix); // undefined 1

  var netflix = "오징어 게임"; // 2

  console.log(netflix); // 오징어 게임 3
  ```
    - 생성단계 (Creation Phase)
      >Execution Context 생성  
      선언문만 실행해서 Environment Record에 기록
        1. 전역 실행 컨테스트가 실행되면서 선언할 게 있는지 찾아보고(1) 있다면 선해둔다.
        2. 선언하는 과정에서 생성해둔 실행컨텍스트 안에 있는 환경레코드에 새로운 식별자 netflix를 기록한다.
        3. var 키워드로 선언했기 때문에 undefined로 값을 초기화 한다.
    - 실행 단계 (Execution Phase)
      >선언문 외 나머지 코드 순차적 실행  
      필요한 경우 생성 단계에서 Environment Record에 기록해둔 정보를 참조하거나 업데이트
        1. netflix의 값을 출력하는 console.log를 실행  
           netflix를 출력하려면 바인딩된 값을 알아야함
        2. (1) 자바스크립트 엔진이 현재 활성화된 실행컨텍스트 내에 환경레코드를 보고 이미 기록된 netflix의 값을 참조해서 값을 출력.
        3. (2) 생성단계에서 netflix가 선언되었기 때문에 값의 할당만 실행  
           netflix의 값을 '오징어 게임'으로 업데이트 해서 기록
        4. (3) 자바스크립트 엔진이 환경레코드를 참조해서 netflix의 값을 출력.
- #### let, const
  >선언문 이전에는 변수를 참조할 수 없다.
  ```
  console.log(netflix); // ? 1
  
  const netflix = "오징어 게임"; // 2
  
  console.log(netflix); // 오징어 게임 3
  ```
  >자바스크립 엔진이 netflix 식별자를 기록해두긴 하지만, 값을 초기화 하지 않는다.  
  따라서 선언문(2) 이전에 netflix를 참조하려고(1) 하면 Reference Error가 발생한다.
    - 일시적 사각지대(Temporal Dead Zone)
  >let, const로 선언한 경우에는 선언 라인 이전에 식별자를 참조할 수 없는데, 이 구역(1과 2사이)을 일시적 사각지대라고 부른다.

### 함수 호이스팅 (Function Hoisting)
- 함수 선언식
  ```
  start(); // 1
  
  // 2
  function start() { ... }
  ```
  >자바스크립 엔진이 start 함수의 선언과 동시에 완성된 함수 객체를 생성해서 환경레코드에 기록해둔다.  
  >{ start: f {} }  
  >함수가 선언과 동시에 생성되어 선언 전에도 함수를 사용할 수 있다.  
  >사용을 지양하고자 하는 의견들이 있다.

- 함수 표현식
  >함수를 변수에 할당해서 사용하는 방식으로 변수 호이스팅과 동일하게 동작한다.
  ```
  start(); // Type error
  
  var start = function() { ... }
  ```
  >var 키워드에 함수를 담으면 자바스크립트 엔진이 var 변수 호이스팅 동작으로 start에 undefined 값으로 초기화한다.  
  >선언문 이전에 실행하려고 하면 환경레코드에 기록되어있는 start의 값이 undefined이고 undefined의 데이터타입은 함수와 달리 호출될 수 없기 때문에 타입 에러가 발생한다.
  ```
  start(); // ?
  
  const start = function() { ... }
  ```
  >같은 함수를 const 키워드로 선언하면 const 호이스팅 동작으로 아직 환경레코드에 기록된 값이 없어 Reference Error가 발생한다.

## 스코프 체이닝
>스코프 체인 (Scope Chain: 식별자를 결정할 때 활용하는 스코프들의 연결리스트)을 이용해서 식별자를 결정하기 위한 과정
```
/* Global */
let lamp = false;
consol.log(lamp) // false

function goTo2F() {
    let lamp = true;
    console.log(lamp); // true 2, a
    
    goTo3F(); // 1
}

function goTo3F() {
    let pet = 'tory';
    
    console.log(pet); // tory 2, a
    console.log(lamp); // true 2, c
    console.log(corona); // Reference error 2, b
}

goTo2F(); // 1
```

1. 함수가 호출될 때, 함수의 실행컨텍스를 새로 생성하고 자바스크립트 엔진은 새로 생성된 실행 컨텍스트에서 바깥(이전) 렉시컬 환경으로 돌아갈 수 있는 outer를 남겨놓습니다.  
   필요한 경우 바깐(이전) 실행 컨텍스트의 환경레코드에 저장된 식별자도 참조할 수 있게 된다.
    - goTo2F()의 바깥(이전) 렉시컬 환경은 Global
    - goTo3F()의 바깥(이전) 렉시컬 환경은 goTo2F()
2. 자바스크립트 엔진은 변수나 함수의 값을 결정하기 위해 현재 활성화된 실행컨텍스트의 환경레코드를 바라본다.
   >**식별자 결정** (Identifier Resolution)  
   코드에서 변수나 함수의 값을 결정하는 것
- a : 현재 실행 컨텍스트에서 pet을 찾고 값을 출력한다.
- b : 현재 실행 컨텍스트에서 corona를 찾을 수 없으면, outer를 통해서 바깥 렉시컬 환경으로 가서 corona를 찾는다. corona를 찾을 때 까지 이 과정을 반복하다 전역 실행 컨텍스트에서도 찾을 수 없으면 자바스크립트 엔진은 변수를 찾는 것을 중단하고, 찾으려던 corona가 없다는 결론을 내린다.  
  찾을 수 없는 식별자를 참조하려고 했기 때문에 Reference error를 출력한다.
- c : 현재 실행 컨텍스트에서 lamp를 찾을 수 없으면, outer를 통해서 바깥 렉시컬 환경으로 가서 lamp를 찾는다. lamp를 찾게 되면 더 이상 lamp를 찾는 행동을 중단하고 현재 실행 컨텍스트의 lamp 값을 출력한다.
  >goTo2F()의 lamp와 전역의 lamp가 같은 이름을 가지고 있지만, goTo2()나 goTo3F()에서는 전역 lamp의 값을 알 수 없다.  
  이렇게, 동일한 식별자로 인해 상위 스코프에서 선언된 식별자의 값이 가려지는 현상을 **변수 섀도잉** (Variable Shadowing)이라고 한다.
