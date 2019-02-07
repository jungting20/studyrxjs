
/* const {of,asyncScheduler,animationFrameScheduler,interval} = require('rxjs');
const {map,tap,observeOn,subscribeOn} = require('rxjs/operators'); */
const { of, asyncScheduler, animationFrameScheduler, interval, concat,defer } = window ? rxjs : require('rxjs');
const { map, tap, observeOn, subscribeOn, takeWhile } = window ? rxjs.operators : require('rxjs/operators');



const animation$ = animation(100,500,300);
setTimeout(() => {
    animation$.subscribe(v => console.log('animation$', v));
},500)


function animation(from, to, duration) {
    return defer(() => {
    const scheduler = animationFrameScheduler;
    const start = scheduler.now();
    //함수를 만든 시점에 이미 값이 결정 구독시점까지 미뤄야하는게 포인트!
    //함수로 리턴하여 실행하면서 하는 방법이있고 defer함수를 사용하는 방법이 있다
    console.log(start);
    const interval$ = interval(0, scheduler)
        .pipe(
            map(() => (scheduler.now() - start) / duration),
            takeWhile(x => x <= 1)//사실상 이부분이 시간을 결정해줌 저건 비율이니까
        )
    return concat(interval$, of(1))
        .pipe(
            map(rate => from + (to - from) * rate)
        )
    })
}