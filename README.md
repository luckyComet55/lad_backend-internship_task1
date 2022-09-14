# Инструкция по использованию

## Установка зависимостей

Введите `npm i` и дожидайтесь установки пакетов необходимых
зависимостей

## Запуск

Введите в консоль команду `npm start`. Сервер запустится по адресу
`http://localhost:8000`

## Использование

Чтобы получить данные о словах на определённых сайтах,
надо отправить GET запрос на `http://localhost:8000/api`. Далее в строке
запроса необходимо по ключу `sites` перечислить полные URL сайтов.
Множество сайтов передаётся через знак & и повторение ключа.
Спустя небольшое время, необходимое на обработку данных,
автоматически скачается PDF файл с отчётом.