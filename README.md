### CS2MANAGE ###
Application for managing CS2 skins and items. This application started as a summer project and is not supported anymore.

Frontend via Angular v16 (Typescript).
Backend via Express v4 (Node.js, Javascript).

Use [Chocolatey](https://chocolatey.org/install) to install all necessities like [npm](https://www.npmjs.com/) and [Angular](https://angular.dev/)) if required:
```
choco install nodejs
npm install -g @angular/cli
```

This application is using APIs, mainly [Skinport](https://docs.skinport.com/) and [Steam Community Market](https://steamcommunity.com/market). Logging into the website or using API keys is not required, because only publicly accessible information is handled by this program. To display images of individual items, web scraping is used. This can lead to Steam banning your IP for a few minutes. A cache is implemented to circumvent that, but it is still not recommended to manage high quantities of items via this application. All rights are reserved to the respective owners.

Execute [RUN.cmd](RUN.cmd) to build and start the application. Giving permission might be required.

## Homepage ##

A clean homepage with a similar color palette to the official logo of CS2 is the starting place of this bookkeeping application. Dynamic colors, loading animations and toast notifications help users navigate their CS2 management.

![preview1](https://github.com/user-attachments/assets/71e80fb0-c039-445e-96b6-b5345ad5a489)

## Financial overview ##

All investments and purchases can be accessed in a concise overview. This overview summarizes how much money has been spent on investments, how much yield they would have on the respective platforms with direct links to the individual items and the overall profit. User accessibility features like sorting or searching for an item are also implemented.

![preview2](https://github.com/user-attachments/assets/8452420c-4cbf-462a-8d84-08c7fa1dbe3e)

## Item management ##

Items from a Steam account can be directly added via the Steam ID or individually added by hand. These investments are collected in different profiles that represent different assets in a portfolio.

![preview3](https://github.com/user-attachments/assets/1b283700-740c-40b9-adf4-c1fd71004ba8)
