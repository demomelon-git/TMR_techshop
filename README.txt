TMR Engine 0.2.0 — игра «Магазин техники» (версия для GitHub, cookies, без папок mods и plugins)

ЗАПУСК
Локально: python start.py (откроет http://localhost:8000/TMR.html). file:// не работает.
GitHub Pages: загрузите все файлы в корень репозитория, Settings → Pages → ветка main, папка /(root). Подробности в README.md.

ФАЙЛЫ
index.html, TMR.html    оболочка: полоса движка + контейнер #tmr-root, canvas скрыт; подключает cookie-consent.js
cookie-consent.js       окно согласия и запись сохранения в cookies (base64, части по 3000 символов, не более ~7,5 КБ)
engine.js, start.py     ядро и локальный сервер движка 0.2 (без изменений)
engine.json             подключены libraries/save-lib.js и libraries/storage-lib.js; pauseOnBlur и hotkeys выключены
libraries/save-lib.js   библиотека сохранений движка 0.2 (без изменений): r.save, папка на диске
libraries/storage-lib.js  подменяет запись localStorage на cookies после согласия; r.save работает как раньше
games/tech-shop/        game.json (данные), shop-lib.js (каталог 7 × 85, дни, продажи, наборы), ui-lib.js (интерфейс на DOM)

Подключение собственной библиотеки: добавьте путь в "libraries" (engine.json или game.json); файл регистрирует window.TMRLibs.<имя> = { init, update, render }.
Библиотеки выполняются как обычный JavaScript — подключайте только доверенные файлы.
