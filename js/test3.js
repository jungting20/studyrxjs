
/* const {of,asyncScheduler,animationFrameScheduler,interval} = require('rxjs');
const {map,tap,observeOn,subscribeOn} = require('rxjs/operators'); */
const {of,asyncScheduler,animationFrameScheduler,interval,concat} = window ? rxjs : require('rxjs');
const {map,tap,observeOn,subscribeOn,takeWhile} = window ? rxjs.operators: require('rxjs/operators');



const scheduler = animationFrameScheduler;
const start = scheduler.now();
const DURATION = 300;
const interval$ = interval(0,scheduler)
.pipe(
    map(() => (scheduler.now()-start)/DURATION),
    takeWhile(x => x <= 1)
)
const animation$ = concat(interval$,of(1));
animation$.subscribe(v => console.log(v));
