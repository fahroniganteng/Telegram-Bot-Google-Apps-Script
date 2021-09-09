/*
 * Simple Telegram Bot - Google Apps Script
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
  // check valid request
  if (!validRequest_(e)) return;

  let Bot = new TelegramBot();
  let Cmd = TelegramData.message.text;

  // Start process request
  if (Cmd == '/start') {
    Bot.sendMessage("Congratulations! It works!\nPlease run command /help to start using bot.");
  }
  else if (Cmd == '/help') {
    let text =
      '<b>Available Command</b>\n' +
      '/start - Bot Info\n' +
      '/help - This manual\n' +
      '/whoami -  Show your telegram ID and name\n\n' +
      '/sendlocation - Send map\n' +
      '/senddice - Send dice\n\n' +
      '/replykeyboard - Message with keyboard\n' +
      '/removereplykeyboard - Remove keyboard\n'
      ;
    Bot.sendMessage(text, 'HTML');
  }
  else if (Cmd == '/whoami') {
    let text =
      'Your ID :\n<b>' + TelegramData.message.from.id + '</b>\n\n' +
      'Your Name :\n<b>' + TelegramData.message.from.first_name + '</b>\n\n' +
      '⚠ Note :\n<u><i>Your id is like your phone number. keep it a secret</i></u>'
      ;
    Bot.sendMessage(text, 'HTML');
  }
  else if (Cmd == '/sendlocation') {
    Bot.sendLocation('-6.088319', '106.997827');
  }
  else if (Cmd == '/senddice') {
    Bot.sendDice();
  }
  else if (Cmd == '/replykeyboard') {
    let keyboard = [
      [{ 'text': 'Yes' }, { 'text': 'No' }],
      [{ 'text': "/removereplykeyboard" }]
    ];
    Bot.sendMessageKeyboard('Do you like this bot?', keyboard);
  }
  else if (Cmd == '/removereplykeyboard') {
    Bot.sendMessageKeyboard('Reply keyboard removed!', false);
  }
  else if (Cmd == 'Yes') {
    Bot.sendMessage("Thank's");
  }
  else if (Cmd == 'No') {
    Bot.sendMessage('Oh no!');
  }
  else {
    let text =
      `Hi ` + TelegramData.message.from.first_name + '!' +
      '\nYour response text : ' + TelegramData.message.text +
      `\nPlease run command /help to start using bot.`;
    Bot.sendMessage(text);
  }
}


function validRequest_(e) {
  // Only response if type is text message
  try {
    if (e.postData.type == 'application/json') {
      TelegramData = JSON.parse(e.postData.contents);
      return typeof TelegramData.message.text != 'undefined';
    }
    else return false;
  }
  catch (e) {
    return false;
  }
}



/**
 * Telegram Bot function
 * ******************************************
 */
class TelegramBot {
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
      'chat_id': TelegramData.message.from.id,
      'text': text,
      'parse_mode': mode
    });
  }
  sendLocation(latitude, longitude) {
    return this.request('sendLocation', {
      'chat_id': TelegramData.message.from.id,
      'latitude': latitude,
      'longitude': longitude
    });
  }
  sendDice() {
    return this.request('sendDice', {
      'chat_id': TelegramData.message.from.id,
    });
  }
  sendMessageKeyboard(text, keyboard, mode) {
    mode = mode || 'None';
    keyboard = keyboard ?
      { 'keyboard': keyboard } :
      { 'remove_keyboard': true };
    return this.request('sendMessage', {
      'chat_id': TelegramData.message.from.id,
      'text': text,
      'parse_mode': mode,
      'reply_markup': JSON.stringify(keyboard)
    });
  }
}

