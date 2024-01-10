const observe = (query, callback) => {
    var observer = new WebKitMutationObserver(callback);

    let elementToListen = document.querySelector(query);

    if (!elementToListen) setTimeout(() => observe(query, callback), 100);
    else observer.observe(elementToListen, { childList: true });
}