const hoverDelay = 100;
let hoverTracker = [];
let popupTracker = [];

const getRankFromElo = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const lg = ratingContainer.getElementsByClassName("label-large ng-star-inserted")[0].innerHTML; const sm = ratingContainer.getElementsByClassName("label-small ng-star-inserted")[0].innerHTML; const elo =  parseInt(lg.substring(0, lg.length-1) + sm);
        fetch("https://whereisglobal.vercel.app/api/rank?elo=" + elo).then((data) => data.json()).then((data) => {
            resolve(data.rank);
        })
    });
}

const showPopup = async (key, element) => {
    const csgorank = await getRankFromElo(element);
    const popup = createPopup(csgorank, element);
    document.body.appendChild(popup);
    popupTracker[key] = popup;
}

observe("app-matches-list", (mutations) => {
    const ratings = document.getElementsByClassName("cs-rating");
    hoverTracker = new Array(ratings.length);
    for (let key in ratings) {
        const element = ratings[key];
        element.addEventListener("mouseover", function() {
            if (hoverTracker[key]) return;
            hoverTracker[key] = true;
            setTimeout(async function () {
                if (!hoverTracker[key]) return;
                await showPopup(key, element);
            }, hoverDelay);
        })

        element.addEventListener("mouseleave", function() {
            hoverTracker[key] = false;
            if (popupTracker[key]) {
                document.body.removeChild(popupTracker[key]);
                popupTracker[key] = undefined;
            }
        })
    }
});


const createPopup = (rank, element) => {
    const position = element.getBoundingClientRect();    

    const elementHTML = `
        <div style="z-index: 99999; background-color: black; color: white; position: absolute; top: ${position.top - 50}px; left: ${position.left}px;">
            <img style="width: 90px" src="https://whereisglobal.vercel.app/matchmaking_${rank}.png"></img>
        </div> 
    `;

    const temp = document.createElement("div");
    temp.innerHTML = elementHTML.trim();
    return temp.children[0];
}
