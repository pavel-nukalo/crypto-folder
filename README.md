# CryptoFolder

![Превью проекта](preview.jpg?raw=true)

[Демо-версия](https://3202.pavel-nukalo.com/)

Веб-приложение, позволяющее создавать и редактировать текстовые файлы и папки. Данные хранятся в облаке с ипользованием сквозного шифрования.

Аутентификация пользователя происходит путем подтверждения электронной почты. Пользователь вводит свой email, после чего, он должен ввести пин-код доступа, который будет отправлен ему на электронный адрес. Пин-код одноразовый и действителен в течении 2 минут.

Данный проект использует следующие технологии:

  - Javascript ES8
  - Node.js
  - Express.js
  - MongoDB
  - Passport.js
  - Webpack
  - jQuery
  - Bootstrap 4
  - CryptoJS
  - Nodemailer
  

### Установка

CryptoFolder требует [Node.js](https://nodejs.org/) v8+ для запуска.
Установите все необходимые пакеты:

```sh
$ cd crypto-folder
$ npm install
```

### Конфигурирование

1. Установите MongoDB или создайте облачный MongoDB сервер, например с помощью сервиса [mLab](https://mlab.com/).
2. В настройках Google аккаунта разрешите испольование менее безопасных приложений, подробнее в [данной статье](https://nodemailer.com/usage/using-gmail/) 
3. Заполните файл `config.js` параметрами доступа к БД и Google аккаунту.

Создайте одного или несколько пользователей:
```sh
$ npm run create-user
```


### Запуск
Запустите проект, используя следующую команду:

```sh
$ npm run start
```
Лицензия
----

MIT
