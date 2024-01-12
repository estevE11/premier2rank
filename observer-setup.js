const observe = (query, callback) => {
    var observer = new WebKitMutationObserver(callback);

    let elementToListen = document.querySelector(query);
    console.log("attempting")

    if (!elementToListen) setTimeout(() => observe(query, callback), 100);
    else observer.observe(elementToListen, { childList: true, subtree: true });
}