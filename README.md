# Telegram-Bot-Google-Apps-Script
Library for Bot Telegram with Google Apps Script

### Demo
[Demo bot on Telegram](http://t.me/FahroniGantengBot) 

### Instalation Guide
[![Instalation](http://img.youtube.com/vi/BxP9oMzFRhs/0.jpg)](https://youtu.be/BxP9oMzFRhs)
> Video in indonesian language

1. Create bot from telegram
  - Open telegram
  - Find BotFather
  - Follow the instruction to create a new bot
2. Copy token to access the HTTP API (telegram bot token) to variable token
  ```javascript
  var token = '[put your bot token here]';
  ```
3. Deploy Google Apps Script as web  
  make sure **who can access** is **everyone**
4. Copy web app URL into webHook URL
  ```javascript
  let result = Bot.request('setWebhook', {
    url: 'https://script.google.com/macros/s/[Google_Apps_Script_file_ID]/exec'
  });
  ```
5. Run function setWebhook()  
  make sure **success**
6. Telegram bot is ready to use.

> **NOTE :**  
> If you change the code in the google apps script, make sure to edit deploy to the new version  
> - Click **Manage Deployment**
> - Click edit **(pencil icon on top right corner)**
> - Change version to **New version**
> - And then click **Deploy**
>   
> If you create a **new deployment**, you have to run the **function setWebhook()** again because the website address (url) will be change.

### License and credits
My code under MIT license, other libraries follow their own license.

### Donation  
Support me  
- [Send me coffee](https://sociabuzz.com/fahroniganteng/tribe)
- [or maybe ice cream](https://trakteer.id/fahroniganteng/tip) 



