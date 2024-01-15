const leetifyEloToRank = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const lg = ratingContainer.getElementsByClassName("label-large ng-star-inserted")[0].innerHTML; const sm = ratingContainer.getElementsByClassName("label-small ng-star-inserted")[0].innerHTML; const elo =  parseInt(lg.substring(0, lg.length-1) + sm);
        fetch("https://whereisglobal.vercel.app/api/rank?elo=" + elo).then((data) => data.json()).then((data) => {
            resolve(data.rank);
        })
    });
}