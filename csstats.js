const csstatsEloToRank = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const text = ratingContainer.querySelector("span").innerText.replace(",", "");
        const elo = parseInt(text);
        resolve(calcRank(elo));
    });
}