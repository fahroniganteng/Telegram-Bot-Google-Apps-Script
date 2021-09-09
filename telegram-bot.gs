/*
 * Telegram Bot - Google Apps Script
 * ***********************************************************************************
 * Code by    : fahroni|ganteng
 * Contact me : fahroniganteng@gmail.com
 * YouTube    : https://www.youtube.com/c/FahroniGanteng
 * Github     : https://github.com/fahroniganteng
 * Date       : Sep 2021
 * License    : MIT
 */

var token = '[put your bot token here]';

// only need to run once
function setWebhook() {
  // only to create permission
  let drive = DriveApp.getRootFolder();
  
  let Bot = new TelegramBot();
  let result = Bot.request('setWebhook', {
    url: 'https://script.google.com/macros/s/[Google_Apps_Script_file_ID]/exec'
  });
  Logger.log(result);
}





// Global variable to store post data from telegram
var TelegramData;
function doPost(e) {
  let ws = SpreadsheetApp.getActiveSheet();
  ws.appendRow([e.postData.type, e.postData.contents]);
  if (e.postData.type == "application/json") {
    TelegramData = JSON.parse(e.postData.contents);
    let Bot = new TelegramBot();
    let Request = new RequestType();

    // if request is bot command --> execute class BotCommand
    // you can add/edit response bot command in the class BotCommand
    if (Request.botCommand()) {
      Bot.setType('bot_command');
      new BotCommand(Bot);
    }

    // if response from callback from inline keyboard
    else if (Request.callbackInlineKeyboard()) {
      Bot.setType('callback_query');
      let message = TelegramData.callback_query.message.text;

      // response for DeliciousFood
      if (message == new DeliciousFood().getQuestion()) {
        new DeliciousFood().getAnswer(Bot);
      }

      // response for simpleInlineKeyboard
      else if (message == 'Do you like this library?') {
        let response = TelegramData.callback_query.data;
        if (response == 'Y')
          Bot.sendMessage("Thank's");
        else
          Bot.sendMessage("Oh no!");
      }
    }

    // if request is map
    else if (Request.map()) {
      Bot.setType('map');
      Bot.sendMessage(
        'Your location :' +
        '\n- Latitude : ' + TelegramData.message.location.latitude +
        '\n- Longitude : ' + TelegramData.message.location.longitude
      );
    }

    // other
    // ----------------
    // many features on telegram requests.
    // this library only responds from bot_command, callback_query and map.
    // otherwise it will be treated as text.
    else {
      Bot.setType('text');
      let text = `Hi ` + TelegramData.message.from.first_name + '!';
      if (Request.textAvailable())
        text += '\nYour response text : ' + TelegramData.message.text;
      text += `\nPlease run command /help to start using bot.`
      Bot.sendMessage(text);
    }

  }
}






// Example using inline keyboard handle
class DeliciousFood {
  getKeyboard(type) {
    let keyboard = {
      'firstKeyboard': [
        [
          { 'text': 'Apple', 'callback_data': 'A' },
          { 'text': 'Banana', 'callback_data': 'B' }
        ],
        [
          { 'text': 'Other food »', 'callback_data': 'other' }
        ]
      ],
      'secondKeyboard': [
        [
          { 'text': 'Cendol', 'callback_data': 'C' },
          { 'text': 'Dawet', 'callback_data': 'D' },
        ],
        [
          { 'text': 'Gorengan', 'callback_data': 'G' },
          { 'text': 'Jengkol', 'callback_data': 'J' },
          { 'text': 'Lontong', 'callback_data': 'L' },
        ],
        [
          { 'text': 'All indonesian food', 'callback_data': 'indo' }
        ]
      ]
    };
    return keyboard[type];
  }
  getAnswer(Bot) {
    let answer = {
      A: 'apple',
      B: 'banana',
      C: 'cendol',
      D: 'dawet',
      G: 'gorengan',
      J: 'jengkol',
      L: 'lontong sayur',
      'indo': 'indonesian food'
    };
    if (TelegramData.callback_query.data == 'other') {
      // change inline keyboard
      Bot.editInlineKeyboard(this.getKeyboard('secondKeyboard'));
    }
    else {
      Bot.sendMessage('Yeah! ' + answer[TelegramData.callback_query.data] + ' is the best.');

      // This function will delete the keyboard
      Bot.editInlineKeyboard();
    }
  }
  getQuestion() {
    return "What do you like, apple or banana?";
  }
}











/**
 * COMMAND FOR SEND TO BotFather
 * *************************************************
start - Bot information
help - Show this help
whoami - Show your telegram id and name
joke - With variable [/joke fahroni ganteng]
replykeyboard - Message with reply keyboard
removereplykeyboard - Remove reply keyboard
simpleinlinekeyboard - Simple inline keyboard
deliciousfood - Example inline keyboard handle
sendhtmltext - Parse mode html
sendmarkdownv2text - Parse mode markdown v2
sendlocation - Send location
senddice - Send dice
*****************************************************
*/

var helpText = `
<b>Info </b>
/start - Bot information
/help - Show this help
/whoami - Show your telegram ID and name
/joke - Example with variable [/joke Fahroni Ganteng]

<b>Reply Keyboard</b>
/replykeyboard - Message with reply keyboard
/removereplykeyboard - Remove reply keyboard

<b>Inline Keyboard</b>
/simpleinlinekeyboard - Simple inline keyboard
/deliciousfood - Example inline keyboard handle

<b>Send something</b>
/sendhtmltext - Parse mode = HTML
/sendmarkdownv2text - Parse mode = MarkdownV2
/sendlocation - Send location
/senddice - Send dice

<b>Other</b>
Send map location
Send text
`;


/**
 * Bot Command function
 * ******************************
 */
class BotCommand {
  constructor(bot) {
    this.bot = bot;
    this.text = TelegramData.message.text.split(' ');
    let botCommand = this.text[0].substring(1); // botCommand = first element of text without '/' 
    if (typeof this[botCommand] === "function")
      this[botCommand]();
    else
      this.bot.sendMessage("Invalid command");
  }
  start() { // this is command in telegram without '/'
    this.bot.sendMessage("Congratulations! It works!\nPlease run command /help to start using bot.");
  }
  help() {
    this.bot.sendMessage(helpText, 'HTML');
  }
  sendhtmltext() {
    let text =
      '<b>bold</b>, <strong>bold</strong>\n' +
      '<i>italic</i>, <em>italic</em>\n' +
      '<u>underline</u>, <ins>underline</ins>\n' +
      '<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>\n' +
      '<b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>\n' +
      '<a href="https://www.youtube.com/c/FahroniGanteng">inline URL</a>\n' +
      '<a href="tg://user?id=\n' + TelegramData.message.from.id + '">inline mention of a user</a>\n' +
      '<code>inline fixed-width code</code>\n' +
      '<pre>pre-formatted fixed-width code block</pre>\n' 
      ;
    this.bot.sendMessage(text, 'HTML');
  }
  sendmarkdownv2text() {
    let text =
      '*bold text*\n' +
      '_italic text_\n' +
      '__underline__\n' +
      '~strikethrough~\n' +
      '*bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*\n' +
      '[inline URL](https://www.youtube.com/c/FahroniGanteng)\n' +
      '[inline mention of a user](tg://user?id=' + TelegramData.message.from.id + ')\n' +
      '`inline fixed-width code`\n' +
      '```\n' +
      'pre-formatted fixed-width code block\n' +
      '```\n' 
      ;
    this.bot.sendMessage(text, 'MarkdownV2');
  }
  sendlocation() {
    this.bot.sendLocation('-6.088319', '106.997827');
  }
  senddice() {
    this.bot.sendDice();
  }
  replykeyboard() {
    let keyboard = [
      [{ 'text': 'Yes' }, { 'text': 'No' }],
      [{ 'text': "/removereplykeyboard" }]
    ];
    this.bot.sendMessageKeyboard('Do you like this bot?', keyboard);
  }
  removereplykeyboard() {
    this.bot.sendMessageKeyboard('Reply keyboard removed!', false);
  }
  whoami() {
    this.bot.sendMessage(
      "Your ID :\n<b>" + TelegramData.message.from.id + "</b>\n\n" +
      "Your Name :\n<b>" + TelegramData.message.from.first_name + "</b>\n\n" +
      "⚠ Note :\n<u><i>Your id is like your phone number. keep it a secret</i></u>",
      "HTML"
    );
  }
  deliciousfood() {
    let Food = new DeliciousFood()
    this.bot.sendMessageInlineKeyboard(Food.getQuestion(), Food.getKeyboard('firstKeyboard'));
  }
  simpleinlinekeyboard() {
    let keyboard = [
      [
        { 'text': 'Yes', 'callback_data': 'Y' },
        { 'text': 'No', 'callback_data': 'N' }
      ]
    ];
    this.bot.sendMessageInlineKeyboard('Do you like this library?', keyboard);
  }
  joke() {
    // this function inpirate from :
    // https://gist.github.com/unnikked/828e45e52e217adc09478321225ec3de
    //
    // this.text[0] is bot command ==> [/command, text1, text2, ...]
    let firstName = this.text[1] || null;
    let lastName = this.text[2] || null;

    var url = 'http://api.icndb.com/jokes/random?escape=javascript';

    if (firstName) url += '&firstName=' + firstName;
    if (lastName) url += '&lastName=' + lastName;
    let data = JSON.parse(UrlFetchApp.fetch(url).getContentText());
    this.bot.sendMessage(data.value.joke);
  }
}





/**
 * Telegram Bot function
 * ******************************************
 */
class TelegramBot {
  setType(type) {
    this.botType = type;
    this.chat_id = type == 'callback_query' ?
      TelegramData.callback_query.from.id :
      TelegramData.message.from.id;
  }
  request(method, data) {
    let options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };
    let response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/' + method, options);
    if (response.getResponseCode() == 200) {
      return JSON.parse(response.getContentText());
    }
    return false;
  }
  sendMessage(text, mode) {
    // mode (string): HTML, Markdown, MarkdownV2
    // https://core.telegram.org/bots/api#formatting-options
    mode = mode || 'None';
    return this.request('sendMessage', {
      'chat_id': this.chat_id,
      'text': text,
      'parse_mode': mode
    });
  }
  sendLocation(latitude, longitude) {
    return this.request('sendLocation', {
      'chat_id': this.chat_id,
      'latitude': latitude,
      'longitude': longitude
    });
  }
  sendDice() {
    return this.request('sendDice', {
      'chat_id': this.chat_id,
    });
  }
  sendMessageKeyboard(text, keyboard, mode) {
    mode = mode || 'None';
    keyboard = keyboard ?
      { 'keyboard': keyboard } :
      { 'remove_keyboard': true };
    return this.request('sendMessage', {
      'chat_id': this.chat_id,
      'text': text,
      'parse_mode': mode,
      'reply_markup': JSON.stringify(keyboard)
    });
  }
  sendMessageInlineKeyboard(text, keyboard, mode) {
    keyboard = keyboard || [];
    mode = mode || 'None';
    return this.request('sendMessage', {
      'chat_id': this.chat_id,
      'text': text,
      'parse_mode': mode,
      'reply_markup': JSON.stringify({ 'inline_keyboard': keyboard })
    });
  }
  editInlineKeyboard(keyboard) {
    if (this.botType != 'callback_query') return false;
    keyboard = keyboard || [];
    return this.request('editMessageReplyMarkup', {
      'chat_id': this.chat_id,
      'message_id': TelegramData.callback_query.message.message_id,
      'reply_markup': JSON.stringify({ 'inline_keyboard': keyboard })
    });
  }

}

/**
 * Check request type
 * *********************************************
 */
class RequestType {
  botCommand() {
    try {
      return (
        TelegramData.message.entities[0].type == 'bot_command' &&
        TelegramData.message.text.charAt(0) == '/'
      ) ? true : false;
    }
    catch (e) {
      return false;
    }
  }
  callbackInlineKeyboard() {
    try {
      return typeof TelegramData.callback_query.message.reply_markup.inline_keyboard != 'undefined';
    }
    catch (e) {
      return false;
    }
  }
  map() {
    try {
      return (
        typeof TelegramData.message.location.latitude != 'undefined' &&
        typeof TelegramData.message.location.longitude != 'undefined'
      );
    }
    catch (e) {
      return false;
    }
  }
  textAvailable() {
    try {
      return typeof TelegramData.message.text != 'undefined';
    }
    catch (e) {
      return false;
    }
  }
}
