const Twit = require("twit");

const config = require("../config/config.js");

const T = new Twit(config);

module.exports = async (tweet) => {
    return await T.post('statuses/update', { status: tweet })
}