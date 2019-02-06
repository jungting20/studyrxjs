const {of,asyncScheduler} = require('rxjs');
const {tap,observeOn,subscribeOn} = require('rxjs/operators');


const obs$ = of('A','B','C')
.pipe(
    tap(v => console.log(v,"데이터 처리1")),
    tap(v => console.log(v,"데이터 처리2")),
    tap(v => console.log(v,"데이터 처리3")),
    tap(v => console.log(v,"데이터 처리4")),
    observeOn(asyncScheduler),
    subscribeOn(asyncScheduler)
)



console.log('subscribe 전');

/* setTimeout(() => {
    const start = new Date().getTime();
    console.log('[1초 후 subscribe]');
    console.log(`subscribe 후 ${new Date().getTime() - start}ms`)
},1000); */
obs$.subscribe(v => console.log("observer recevied",v));
