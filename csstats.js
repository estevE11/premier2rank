const csstatsEloToRank = (ratingContainer) => {
    return new Promise((resolve, reject) => {
        const text = ratingContainer.querySelector("span").innerText.replace(",", "");
        const elo = parseInt(text);
        fetch("https://whereisglobal.vercel.app/api/rank?elo=" + elo).then((data) => data.json()).then((data) => {
            resolve(data.rank);
        })
    });
}