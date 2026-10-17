"""Локальный сервер для TMR: python start.py [порт]"""
import http.server, socketserver, webbrowser, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")  # изменения файлов видны сразу
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", port), Handler) as srv:  # только этот компьютер
    url = f"http://localhost:{port}/TMR.html"
    print("TMR запущен:", url, "(Ctrl+C — остановить)")
    webbrowser.open(url)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
