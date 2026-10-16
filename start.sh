#!/bin/sh
(sleep 1; xdg-open http://localhost:8000/TMR.html 2>/dev/null || open http://localhost:8000/TMR.html) &
python3 -m http.server 8000
