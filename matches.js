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
    if(!hoverTracker[key]) return;
    const popup = createPopup(csgorank, element);
    document.body.appendChild(popup);
    popupTracker[key] = popup;
}

observe("main", (mutations) => {
    const ratings = document.getElementsByClassName("cs-rating");
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
                document.body.removeChild(popupTracker[key]);
                popupTracker[key] = undefined;
            }
        })
    }
});


const createPopup = (rank, element) => {
    const position = element.getBoundingClientRect();    

    const elementHTML = `
        <div style="z-index: 998; position: absolute; top: ${position.top - 55}px; left: ${position.left-25}px;">
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
