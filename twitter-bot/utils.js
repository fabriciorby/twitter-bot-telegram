module.exports = {
    twitterUsers: {
        fabriciorby: '33701068'
    },
    format: data =>
        '<b>' + data.user.name + '</b> | ' +
        '<i>@' + data.user.screen_name + '</i>\n' +
        data.tweet
}