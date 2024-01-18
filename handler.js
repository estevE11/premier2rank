const hoverDelay = 100;
let hoverTracker = [];
let popupTracker = [];

let eloPerRank;


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
    /*
    "scope": {
        "mainContainerQuery": "#main-layout__wrapper",
        "getRankFromElo": scopeEloToRank,
        "containerClass": "PremierRatingIcon__Container-y0zrk4-0",
        "getPopupParent": () => document.getElementById("main-layout__wrapper")
    },
    */
};

const KEY = (() => {
    const url = window.location.href;
    for (let key in mappings) {
        if (url.includes(key)) return key;
    }
})();

const showPopup = async (key, element) => {
    if(!hoverTracker[key]) return;
    const csgorank = await mappings[KEY].getRankFromElo(element);
    const popup = createPopup(csgorank, element);
    mappings[KEY].getPopupParent().appendChild(popup);
    popupTracker[key] = popup;
}



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

const calcRank = (elo) => {
    console.log("bueans")
    if(!eloPerRank) return 'unranked';
    let currentRank = -1;
    const ranks = Object.keys(eloPerRank);
    for (let i = 0; i < ranks.length; i++) {
        if (eloPerRank[ranks[i]] > elo) {
            currentRank = i;
            continue;
        }
        currentRank = i;
        break;
    }

    return ranks[currentRank];
}

window.onload = async () => {
    observe(mappings[KEY].mainContainerQuery, (mutations) => {
        const ratings = document.getElementsByClassName(mappings[KEY].containerClass);
        hoverTracker = new Array(ratings.length);
        for (let key in ratings) {
            const element = ratings[key];
            if(!element.addEventListener) continue;
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

    eloPerRank = await (() => {
        return new Promise((resolve, reject) => {
            const cached = localStorage.getItem("eloPerRank");
            if (cached) {
                const timestamp = new Date(parseInt(localStorage.getItem("eloPerRankTimestamp")));
                // Check if since last update, a sunday has passed
                let now = new Date();
                now.setHours(0, 0, 0, 0);
                timestamp.setHours(0, 0, 0, 0);
                now.setDate(now.getDate() - now.getDay());
                timestamp.setDate(timestamp.getDate() - timestamp.getDay());
                let shouldUpdate = now > timestamp;

                if (!shouldUpdate) return resolve(JSON.parse(cached));
            }
            fetch("https://whereisglobal.vercel.app/api/ranks").then(data => data.json()).then(data => {
                localStorage.setItem("eloPerRank", JSON.stringify(data.eloPerRank));
                localStorage.setItem("eloPerRankTimestamp", Date.now());
                resolve(data.eloPerRank);
            });
        });
    })();
};
