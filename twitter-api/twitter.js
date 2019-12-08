const Twitter = require('twitter');
const utils = require('./utils');

const twitterClient = new Twitter({
    consumer_key: process.env['TWITTER_API_KEY'],
    consumer_secret: process.env['TWITTER_SECRET_API_KEY'],
    access_token_key: process.env['TWITTER_ACCESS_TOKEN_KEY'],
    access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
});

twitterClient.getUsernameById = async (id) => {
    const user = await twitterClient.get('users/show', { user_id: id });
    return user.screen_name;
}

twitterClient.getMultipleTweetSchemaFromUsername = async (username) => {
    const user = await twitterClient.get('users/show', { screen_name: utils.trata(username) });
    const userId = user.id_str;
    const tweets = await twitterClient.getTweetListFrom(userId);
    const multipleTweetSchema = utils.buildMultipleTweetSchema(user, tweets);
    return multipleTweetSchema;
}

twitterClient.getTweetListFrom = async (userId) => {
    const tweets = await twitterClient.get('statuses/user_timeline', { user_id: userId, count: '200' });
    const listaTweets = tweets
        .filter(utils.retiraRTeMention)
        .map(tweet => tweet.text);
    return listaTweets;
}

twitterClient.getRandomTweetSchemaFrom = async (twitterUsername) => {
    let response;
    try {
        const multipleTweetSchema = await twitterClient.getMultipleTweetSchemaFromUsername(twitterUsername);
        const user = multipleTweetSchema.user;
        const randomTweet = utils.getRandomItemFrom(multipleTweetSchema.tweets);
        response = utils.buildSingleTweetSchema(user, randomTweet);
    } catch (e) {
        console.warn(e);
        response = 'Não foi possível recuperar tweets de @' + twitterUsername + '.';
    }
    return response;
}

module.exports = twitterClient;