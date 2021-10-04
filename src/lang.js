'use strict';

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  DATE: `Поле дата обязательно к заполнению`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE: `Поле анонс обязательно к заполнению`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  PICTURE: `Тип изображения не поддерживается`,
  TEXT_MAX: `Текст публикации не может содержать более 1000 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  SURNAME: `Фамилия содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

const ErrorCategoryMessage = {
  EMPTY: `Название категории обязательно к заполнению`,
  MIN: `Название содержит меньше 5 символов`,
  MAX: `Название не может содержать более 30 символов`,
};

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`,
};

module.exports = {
  ErrorArticleMessage,
  ErrorCommentMessage,
  ErrorRegisterMessage,
  ErrorCategoryMessage,
  ErrorAuthMessage
};
