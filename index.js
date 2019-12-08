require("dotenv").config();

var bot = require('./twitter-bot/twitter-bot');
require('./web')(bot);