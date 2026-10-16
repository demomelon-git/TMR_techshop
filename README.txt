TMR Engine 0.1.0 — игра «Магазин техники»

Структура:
- TMR.html          игровая оболочка (один пустой контейнер #tmr-root)
- engine.js         загрузчик: читает engine.json и game JSON, подключает библиотеки,
                    вызывает у каждой системы init / update(dt) / render
- engine.json       конфигурация: список библиотек (libraries) и порядок систем (systems)
- games/tech-shop.json   данные игры: 7 компаний, ступени моделей, названия модов,
                    опции идей, встроенные плагины, стартовые деньги, папка сохранений
- libraries/shop-lib.js     модель магазина: каталог (7 × 85), цены, дни и продажи, наборы, плагины
- libraries/storage-lib.js  автосохранение в браузер + подключение папки (подпапка save)
- libraries/ui-lib.js       интерфейс на DOM: вкладки, каталог, интеграции, идеи, наборы, плагины и моды
- plugins/plugin-bundles.json   пример плагина (тема «Мята» + наборы телефонов)
- mods/mod-modular-battery.json пример мода (модульный аккумулятор для наборов)

Удалены за ненадобностью: renderer-lib (canvas), physics-lib, audio-lib.
Движок теперь не требует canvas: он необязателен ("canvas" в engine.json).

Запуск:
1. Распакуйте архив.
2. Запустите start.bat (Windows) или start.sh, либо в папке выполните: python -m http.server 8000
3. Откройте http://localhost:8000/TMR.html

Не открывайте TMR.html через file://: браузер заблокирует загрузку JSON и библиотек.
Папка игры (кнопка «Подключить папку») работает в Chrome и Edge на http://localhost.

В этой сборке сохранение через cookies работает только после согласия пользователя. Кнопка «Cookies» позволяет поменять решение; при отказе сохранение можно скачать JSON-файлом.
Библиотеки исполняются как обычный JavaScript — используйте только доверенные файлы.

Своя библиотека: файл libraries/имя-lib.js, внутри
  window.TMRLibs.имя = { init(runtime){}, update(runtime, dt){}, render(runtime){} };
и добавьте путь в "libraries", а имя — в "systems" в engine.json. Данные игры доступны как window.TMRGame.
