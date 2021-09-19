const fs = require("fs");
const fetch = require("node-fetch");

const config = require("./config/config.js");

const localDB = require("./utils/db.json");
const tweet = require("./utils/tweet");

const getData = async () => {
    localDB.forEach(async item => {
        const data = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${item.channelId}&key=${config.yt_api_key}&part=snippet&maxResults=1`, {
            timeout: 2000
        }).then(res => res.json());

        let lastUploadId = data.items[0].snippet.resourceId.videoId;
        let channelName = data.items[0].snippet.channelTitle

        if (item.lastUpload == lastUploadId) return;

        item.lastUpload = lastUploadId

        fs.writeFileSync('./utils/db.json', JSON.stringify(localDB, null, 2));

        return await tweet(`${channelName} has just uploaded a new video on YouTube!\nhttps://www.youtube.com/watch?v=${lastUploadId}`)
    })
}

setInterval(() => {
    getData();
}, 1 * 60 * 1000)
