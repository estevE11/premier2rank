const observe = (query, callback) => {
    var observer = new WebKitMutationObserver(callback);

    let elementToListen = document.querySelector(query);

    if (!elementToListen) {
        console.log("attempt")
        setTimeout(() => observe(query, callback), 100);
    } else {
        observer.observe(elementToListen, { childList: true });
        console.log("observing");
    }
}