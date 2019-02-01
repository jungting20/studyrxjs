//const rxjs = require('rxjs');
const { Observable, fromEvent, from, Subject } = rxjs;
const { map, mergeAll, mergeMap, debounceTime, filter, tap, distinctUntilChanged, switchMap, retry, finalize, multicast,publish,share } = rxjs.operators;
const { ajax } = rxjs.ajax;
const $layer = document.getElementById('suggestLayer');
const $loading = document.getElementById('loading');



const islength = query => query.trim().length > 1;
const keyup$ = fromEvent(document.getElementById('search'), "keyup")
    .pipe(
        debounceTime(300),
        map(e => e.target.value),
        distinctUntilChanged(),
        tap(v => console.log("from keyup$", v)),
        share()
    );

const user$ = keyup$
    .pipe(
        filter(islength),
        tap(showLoading),
        switchMap(query => ajax.getJSON(`https://api.github.com/search/users?q=${query}`)),
        tap(hideLoading),
        retry(2),
        finalize(hideLoading)
    );
const reset$ = keyup$
    .pipe(
        filter(query => query.trim().length === 0),
        tap(v => $layer.innerHTML = "")
    );

user$.subscribe(drawLayer, e => {
    console.error(e);
    alert(e.message);
});
reset$.subscribe();
//keyup$.connect();










function drawLayer(obj) {
    $layer.innerHTML = obj.items.map(user => {
        return `<li class="user">
    <img src="${user.avatar_url}" width="50px" height="50px">
    <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
</li>`
    }).join("");
}
function showLoading() {
    $loading.style.display = "block";
}
function hideLoading() {
    $loading.style.display = "none";
}


