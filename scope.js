const scopeEloToRank = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const lg = ratingContainer.getElementsByClassName("eSJJyX")[0].innerHTML;
        const sm = ratingContainer.getElementsByClassName("eHfbVv")[0].innerHTML;
        const elo = parseInt(lg + sm);
        resolve(calcRank(elo));
    });
}