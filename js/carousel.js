const { fromEvent } = rxjs;
const { map,takeUntil,mergeAll,mergeMap,switchMap,take } = rxjs.operators;
const $view = document.getElementById('carousel');

const $container = $view.querySelector(".container");

const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const SUPPORT_TOUCH = "ontouchstart" in window;

const EVENTS = {
    start:SUPPORT_TOUCH ? "touchstart" : "mousedown",
    move:SUPPORT_TOUCH ? "touchmove" : "mousemove",
    end:SUPPORT_TOUCH ? "touchend" : "mouseup"
}

function toPos($obj){
    return $obj
    .pipe(
        map(v => SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)
    )
}

const start$ = fromEvent($view,EVENTS.start).pipe(toPos);
const move$ = fromEvent($view,EVENTS.move).pipe(toPos);
const end$ = fromEvent($view,EVENTS.end);
const drag$ = start$
.pipe(
    switchMap(start => move$.pipe(
        map(move => move - start),
        takeUntil(end$)
        )//end pipe
        )//end switchMap
);
const drop$ = drag$
.pipe(
    switchMap(drag => end$.pipe(take(1)))
);


drag$.subscribe(distance => console.log("start$와 movd$의 차이 값",distance));