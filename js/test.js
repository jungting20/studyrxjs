/* const rxjs = require('rxjs');
const { map,takeUntil } =require('rxjs/operators');

const observerA = rxjs.interval(5000);
const observerB = rxjs.interval(5000).pipe(
    map(a => a*3)
);


const c = rxjs.merge(observerA,observerB);
c.subscribe(a => console.log(a)); */

let obj = {from : 1,to:2};

let obj2 = {from : 3, to :4};

console.log({...obj,...obj2});
