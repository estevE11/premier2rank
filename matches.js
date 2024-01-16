const hoverDelay = 100;
let hoverTracker = [];
let popupTracker = [];

const mappings = {
    "leetify": {
        "mainContainerQuery": "main",
        "getRankFromElo": leetifyEloToRank,
        "containerClass": "cs-rating",
        "getPopupParent": () => document.body
    },
    "csstats": {
        "mainContainerQuery": "#content-wrapper",
        "getRankFromElo": csstatsEloToRank,
        "containerClass": "cs2rating",
        "getPopupParent": () => document.getElementById("content-wrapper")
    },
};

const KEY = (() => {
    const url = window.location.href;
    for (let key in mappings) {
        if (url.includes(key)) return key;
    }
})();

const showPopup = async (key, element) => {
    const csgorank = await mappings[KEY].getRankFromElo(element);
    if(!hoverTracker[key]) return;
    const popup = createPopup(csgorank, element);
    mappings[KEY].getPopupParent().appendChild(popup);
    popupTracker[key] = popup;
}

observe(mappings[KEY].mainContainerQuery, (mutations) => {
    const ratings = document.getElementsByClassName(mappings[KEY].containerClass);
    hoverTracker = new Array(ratings.length);
    for (let key in ratings) {
        const element = ratings[key];
        element.addEventListener("mouseover", function() {
            if (hoverTracker[key]) return;
            hoverTracker[key] = true;
            setTimeout(async function () {
                await showPopup(key, element);
            }, hoverDelay);
        })

        element.addEventListener("mouseleave", function() {
            hoverTracker[key] = false;
            if (popupTracker[key]) {
                mappings[KEY].getPopupParent().removeChild(popupTracker[key]);
                popupTracker[key] = undefined;
            }
        })
    }
});


const createPopup = (rank, element) => {
    const position = element.getBoundingClientRect();    

    const scrollTop = KEY == "csstats" ? document.documentElement.scrollTop : 0;

    const elementHTML = `
        <div style="z-index: 998; position: absolute; top: ${position.top - 55 + scrollTop}px; left: ${position.left-25}px;">
            <div style="background-color: black; padding: 5px 7px; border-radius: 8px;">
                <img style="z-index: 999; position: relative; width: 90px" src="https://whereisglobal.vercel.app/matchmaking_${rank}.png"></img>
            </div>
            <div style="z-index: 998; background-color: black; width: 10px; height: 10px; transform: rotate(45deg); position: relative; top: -5px; left: 48px"></div>
        </div> 
    `;

    const temp = document.createElement("div");
    temp.innerHTML = elementHTML.trim();
    return temp.children[0];
}
