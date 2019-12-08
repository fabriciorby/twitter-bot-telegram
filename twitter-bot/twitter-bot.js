const TelegramBot = require('node-telegram-bot-api');
const kb = require('node-telegram-keyboard-wrapper');
const twitterClient = require('../twitter-api/twitter');
const utils = require('./utils');
const token = process.env['TOKEN'];

const bot = new TelegramBot(token, { polling: true });
const inlineKeyboard = new kb.InlineKeyboard();

(async function buildInlineKeyboard() {
  try {
    (new kb.InlineKeyboard()).push(0, { text: 'foo', callback_data: 'bar' });
  } catch (e) {
    console.log("Iniciando o teclado, bug no primeiro push. Sim, isso é uma gambiarra.")
    //Falei com o dono da biblioteca e não tem fix vindo, hehe.
    //O jeito vai ser meter um fork ou implementar sem biblioteca.
    //Coisa que eu não vou fazer porque tá quebrando mas tá funcionando.
  }
  //Adicionem quem quiser aqui no teclado, só editar o utils.twitterUsers e pegar o id.
  //Pra pegar o id mais fácil dá pra pegar por esse site: http://gettwitterid.com/
  for (const id of Object.values(utils.twitterUsers)) {
    const username = await twitterClient.getUsernameById(id);
    if (inlineKeyboard.length == 0) inlineKeyboard.addRow()
    if (inlineKeyboard.rowLength(inlineKeyboard.length - 1) == 2)
      inlineKeyboard.addRow({ text: username, callback_data: username })
    else
      inlineKeyboard.push(inlineKeyboard.length - 1, { text: username, callback_data: username })
  };
})();

bot.onText(/^\/tweet (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const allTtext = match[1];
  const twitterUsername = allTtext.split(" ")[0];
  const singleTweetSchema = await twitterClient.getRandomTweetSchemaFrom(twitterUsername);
  const response = utils.format(singleTweetSchema);
  console.log(chatId, singleTweetSchema.user.screen_name, singleTweetSchema.tweet);
  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

bot.onText(/^\/tweet(@.+)?$/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Escolha um usuário para pegar um tweet aleatório.", inlineKeyboard.build());
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const username = query.data;
  bot.answerCallbackQuery(query.id, { text: 'Carregando tweet...' });
  const singleTweetSchema = await twitterClient.getRandomTweetSchemaFrom(username);
  const response = utils.format(singleTweetSchema);
  console.log(chatId, singleTweetSchema.user.screen_name, singleTweetSchema.tweet);
  bot.deleteMessage(chatId, messageId);
  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

module.exports = bot;