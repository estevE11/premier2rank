const scopeEloToRank = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const lg = ratingContainer.getElementsByClassName("eSJJyX")[0].innerHTML;
        const sm = ratingContainer.getElementsByClassName("eHfbVv")[0].innerHTML;
        const elo = parseInt(lg + sm);
        fetch("https://whereisglobal.vercel.app/api/rank?elo=" + elo).then((data) => data.json()).then((data) => {
            resolve(data.rank);
        })
    });
}