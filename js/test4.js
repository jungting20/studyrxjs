const {of,asyncScheduler,animationFrameScheduler,interval,concat} = require('rxjs');
const {map,tap,observeOn,subscribeOn,takeWhile} = require('rxjs/operators');

const test$ = interval(1000)
.pipe(
    takeWhile(x => x <= 4)
);
const test2$ = concat(test$,of(1));

test2$.subscribe(v => console.log(v));