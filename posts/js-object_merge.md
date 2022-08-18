## Object Merge
사용하는 객체를 새로운 데이터 객체로 업데이트해야 할 상황이 생겼다.  
이것을 해결하기 위해 객체 병합 방법에 대해 알아본 내용을 정리했다.

### 반복문
>for in, forEach 루프문을 사용하여 병합하려는 객체의 속성값으로 대상 객체에 직접 복사해 주는 방식으로 병합할 수 있다.
```js
const obj1 = {
    name: 'obj1',
    index: 0,
    alphabet: ['a', 'b', 'c'],
    fruit: {
        name: 'apple',
        sugar: 50
    }
}

const obj2 = {
    name: 'obj2',
    index: 1,
    alphabet: ['d', 'e'],
    price: 10000
}

// obj1에 obj2를 병합
// for loop
for (const key in obj2) {
    obj1[key] = obj2[key]
}

// forEach
Object.keys(obj2).forEach(function (key) {
    obj1[key] = obj2[key]
})

console.log(obj1)
/*
{
    name: 'obj2',
    index: 1,
    alphabet: ['d', 'e'],
    fruit: {name: 'apple', sugar: 50},
    price: 10000
}
 */
```

### Object.assign()
>Object,assign(target, ...sources)  
>함수는 파라미터로 입력받은 ***sources 객체들***의 속성을 target 객체로 복사한다.  

```js
const obj3 = {
    name: 'obj3',
    alphabet: ['f', 'g'],
    fruit: {
        name: 'strawberry',
        sugar: 99
    },
    price: 20000,
}

Object.assign(obj1, obj2, obj3)

console.log(obj1)
/*
{
    name: 'obj3',
    index: 1,
    alphabet: ['f', 'g'],
    fruit: {name: 'strawberry', sugar: 99},
    price: 20000
}
 */
```
객체와 객체를 병합하지 않고, 새로운 객체를 만들기 위해서는 target 객체 위치에 빈 객체({})를 전달하면 된다.
```js
Object.assign({}, obj1, obj2, obj3)
/*
{
    name: 'obj3',
    index: 1,
    alphabet: ['f', 'g'],
    fruit: {name: 'strawberry', sugar: 99},
    price: 20000
}
 */

console.log(obj1)
/*
{
    name: 'obj1',
    index: 0,
    alphabet: ['a', 'b', 'c'],
    fruit: {name: 'apple', sugar: 50}
}
 */
```

### Spread Operator : 전개연산자
>Spread Operator는 '...'으로 표시하고, 객체나 배열의 원소를 하나씩 펼쳐서 반환하기 때문에, 여러 개의 객체를 하나로 병합할 수 있다.

```js
const newObj = {...obj1, ...obj2, ...obj3}
console.log(newObj)
/*
{
    name: 'obj3',
    index: 1,
    alphabet: ['f', 'g'],
    fruit: {name: 'strawberry', sugar: 99},
    price: 20000
}
 */
```

위의 방법들은 모두 ***Shallow Copy(얕은 복사)*** 가 되면서 대상 객체를 덮어쓰기처럼 합쳐진다.  
객체의 속성값이 Object, Array의 Reference Type 일 경우에는 해당 객체의 값이 복사되는 게 아니라, 해당 객체를 참조하는 주소값을 복사하면서 객체들을 병합하게 된다.  
>Reference Type이 아닌 Primitive(원시 값) 은 주소값이 아닌 실제 값이 복사된다.  

실제 값이 아닌 주소값이 복사되었기 때문에, 위 코드에서 마지막 객체인 obj3.alphabet의 배열에 새로운 값을 추가하면 newObj.alphabet의 값도 변경된다.
```js
obj3.alphabet.push('mz')
console.log(newObj)
/*
{
    name: 'obj3',
    index: 1,
    alphabet: ['f', 'g', 'mz'],
    fruit: {name: 'strawberry', sugar: 99},
    price: 20000
}
 */

obj3.fruit.price = 300
console.log(newObj)
/*
{
    name: 'obj3',
    index: 1,
    alphabet: ['f', 'g', 'mz'],
    fruit: {name: 'strawberry', sugar: 99, price: 300},
    price: 20000
}
 */
console.log(newObj.alphabet === obj3.alphabet)
// true
```

보통은 객체 내의 모든 프로퍼티들의 실제 값을 복사하기 위해서 병합을 하는데 위 내용들은 의도에 부합하지 않는다.  
이런 현상을 피하기 위해서는 deep copy (깊은 복사)를 해야 한다.  
위 내용에서도 ```const newObj = Object.assign({}, obj1, obj2) || {...obj1, ...obj2}``` 일 때, newObj의 Reference Type 프로퍼티의 값을 변경하면 obj2의 값은 변경되지만 obj1의 값은 변경되지는 않는다.  
즉, newObj에 obj1은 깊은 복사가 됐지만, newObj를 생성하는 것이 완벽한 깊은 복사라 할 수는 없다.  
깊은 복사를 하기 위한 방법에 대해 알아보자.  

### JSON 객체 메소드
```js
const newObj = JSON.parse(JSON.stringfy(obj1))
console.log(newObj.alphabet === obj1.alphabet)
// false
```
문자열로 변환되었다가 다시 객체로 변환되기 때문에 이전 객체에 대한 참조가 없어진다.  
하지만, ***깊은 복사가 불가능한 타입(함수, Date 객체, 정규 표현식, infinity 등)들이 있고 이 데이터는 유실된다.***  
또한, ***속도가 느리기 때문에 성능 면에서 나쁘다.***

### [lodash 라이브러리](https://lodash.com/docs/)
- [_.cloneDeep](https://lodash.com/docs/#cloneDeep)
  ```ecmascript 6
  const newObj = _.cloneDeep(obj1)
  console.log(newObj === obj1)
  // false
  ```
  두 객체가 서로 다르다고 표현된다.

- [_.merge](https://lodash.com/docs/#merge)
  ```ecmascript 6
  const newObj = _.merge({}, obj1, obj2, obj3)
  obj3.alphabet.push('mz')
  console.log(newObj.alphabet === obj1.alphabet)
  // false
  console.log(newObj)
  /*
  {
  name: 'obj3',
  index: 1,
  alphabet: ['f', 'g', 'c'],
  fruit: {name: 'strawberry', sugar: 99},
  price: 20000
  }
  */
  ```
  Reference Type인 obj3.alphabet에 새로운 요소를 push 해도 newObj의 값에 영향이 없다.

- 직접 구현하기
  >구글 검색으로 좋은 예제 코드가 있어서 가져왔다.  
  >[https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6](https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6)

  ```ts
  const deepMerge = (original: any, source: any, target?: any): object => {
    const originalData = { ...original };
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(
          source[key],
          deepMerge(
            originalData[key],
            source[key],
            target ? target[key] : undefined
          )
        );
      }
    }
    
    Object.assign(originalData || {}, source);
    
    if (target) {
      Object.assign(target, originalData);
      return target;
    } else {
      return originalData;
    }
  };
  ```
  예제 코드를 사용해 보니 여러 번 병합을 하다 보면 최종 사용되는 target 객체에서 새로 병합되지 않는 프로퍼티는 기존 값을 유지하고 있어서 original 객체를 기준으로 병합되지 않는 프로퍼티들이 최초 설정된 기본값을 갖도록 수정했다.  

위 방법들은 하위 레벨의 자식 요소들을 병합시키기는 하지만, 배열에 대한 고민이 필요한 부분이 있다.
```js
const a = {
  c: [
    {
      d: 'd',
      e: 'e'
    },
    {
      f: 'f' 
    }
  ]
}

const b = {
  c: [
    {
      g: 'g' 
    },
    {
      h: 'h' 
    } 
  ]
}

// result
{
  c: [
    {
      d: 'd',
      e: 'e',
      g: 'g'
    },
    {
      f: 'f',
      h: 'h'
    }      
  ] 
}
```
배열의 각 원소 index를 기준으로 덮어 씌우는 형태가 된다.  
배열이 병합되면서 각각의 값이 별개로 병합되기만을 원할 수 있다.  
이런 결과를 얻고자 한다면 NPM package의 deepmerge 라이브러리를 사용하면 된다.
```js
import deepmerge from 'deepmerge'

deepmerge(a, b)
// result
{
  c: [
    {
      d: 'd',
      e: 'e',
    },
    {
      f: 'f',
    },
    {
      g: 'g' 
    },
    {
      h: 'h' 
    } 
  ] 
}
```

### 마침글
편하고 쉽게 해결을 하기 위해 라이브러리의 사용을 생각해 볼 수 있다.  
하지만, 반드시 잊지 말아야 할 것은 내가 원하는 결과를 만들어 주는가?에 대한 ***테스트***를 해야 한다.  
상황에 따라 직접 만들어서 사용할 것인지, 라이브러리를 사용할 것인지를 결정하면 되겠다.

### 참고
- [JavaScript object의 deep merge 방법 알아보기](https://blog.ull.im/engineering/2019/04/01/javascript-object-deep-copy.html)
- [JavaScript로 Deep Copy 하는 여러 방법](https://chaewonkong.github.io/posts/js-deep-copy.html)