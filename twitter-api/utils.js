module.exports = {
    getRandomItemFrom: list => list[Math.floor(Math.random() * list.length)],
    trata: username => username.startsWith('@') ? username.substring(1) : username,
    retiraRTeMention: tweet => !tweet.text.startsWith('RT') && !tweet.text.startsWith('@'),
    buildSingleTweetSchema: (user, tweet) => ({
        user: {
            name: user.name,
            screen_name: user.screen_name,
        },
        tweet: tweet
    }),
    buildMultipleTweetSchema: (user, tweets) => ({
        user: {
            name: user.name,
            screen_name: user.screen_name,
        },
        tweets: tweets
    }),
}