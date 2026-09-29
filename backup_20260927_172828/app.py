from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = 8080

class BanSiteHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/" or self.path == "":
            self.path = "/templates/index.html"

        return super().do_GET()

    def log_message(self, format, *args):
        print("[BAN SITE]", format % args)

os.chdir(BASE_DIR)

print("╔══════════════════════════════════════╗")
print("║          🌐 BAN SITE                 ║")
print("║          Serveur démarré             ║")
print("╚══════════════════════════════════════╝")
print()
print("➡️  http://127.0.0.1:8080")
print("➡️  http://localhost:8080")
print()
print("CTRL+C pour arrêter")

server = HTTPServer(("127.0.0.1", PORT), BanSiteHandler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 BAN SITE arrêté.")
    server.server_close()
