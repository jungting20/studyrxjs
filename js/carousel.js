const { fromEvent,merge,concat } = rxjs;
const { map, takeUntil, mergeAll, mergeMap, switchMap, take, startWith, tap, first, withLatestFrom,share,scan } = rxjs.operators;
const THRESHOLD = 30;

const $view = document.getElementById('carousel');

const $container = $view.querySelector(".container");

const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const SUPPORT_TOUCH = "ontouchstart" in window;

const EVENTS = {
    start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
    move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
    end: SUPPORT_TOUCH ? "touchend" : "mouseup"
}

function toPos($obj) {
    return $obj
        .pipe(
            map(v => SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX)
        )
}

function translateX(posX){
    $container.style.transform = `translate3d(${posX}px,0,0)`;
}


const size$ = fromEvent(window, "resize")
    .pipe(
        startWith(0),//구독시에 값전달하면서 실행함 그러면 꼭 이벤트 발생하지 않아도 1번 실행 할 수있음
        map(event => $view.clientWidth)
    );
const start$ = fromEvent($view, EVENTS.start).pipe(toPos);
const move$ = fromEvent($view, EVENTS.move).pipe(toPos);
const end$ = fromEvent($view, EVENTS.end);
const drag$ = start$
    .pipe(
        switchMap(start => move$.pipe(
            map(move => move - start),
            map(distance => ({distance})),
            takeUntil(end$),
            )//end pipe
            )//end switchMap
        ,share()
    );
const drop$ = drag$
    .pipe(
        switchMap(drag => end$.pipe(
            map(event => drag),
            first(),
        )
        ),
        withLatestFrom(size$,(drag,size) => {
            return {...drag,size}
        })//[위에서 내려온 값,이 시점에 최신데이터] 이렇게 리턴인듯
    );
const carousel$ = merge(drag$,drop$).pipe(
    scan((store,{distance,size}) => {
        const updateStore = {
            from:-(store.index * store.size) + distance
        };
        if(!size){
            updateStore.to = updateStore.from;
        }else{//drop 시점
            let tobeIndex = store.index;
            if(Math.abs(distance) >= THRESHOLD){
                tobeIndex = distance < 0 ? Math.min(tobeIndex + 1,PANEL_COUNT - 1) :
                Math.max(tobeIndex - 1,0); 
            }
            updateStore.index = tobeIndex;
            updateStore.to = -(tobeIndex*size);
            updateStore.size = size;
        }
        return {...store,...updateStore};
    },{
        from:0,
        to:0,
        index:0,
        size:0
    })
); 
carousel$.subscribe(store => {
    console.log("캐러셀 데이터",store);
    translateX(store.to);
});
//drag$.subscribe(distance => console.log("start$와 movd$의 차이 값", distance));
//size$.subscribe(width => console.log('넓이', width));
//drop$.subscribe(a => console.log(a));