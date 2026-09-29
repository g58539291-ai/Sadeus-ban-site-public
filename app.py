from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8080"))

# Deplexo fournit /data comme espace persistant.
# En local, on utilise le dossier du projet.
if os.path.isdir("/data") and os.access("/data", os.W_OK):
    DATA_DIR = "/data"
else:
    DATA_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(DATA_DIR, exist_ok=True)

HISTORY_FILE = os.path.join(DATA_DIR, "history.json")


def load_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return []


def save_history(items):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)


class BanSiteHandler(SimpleHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")

        self.send_response(status)
        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )
        self.end_headers()

    def do_GET(self):

        if self.path == "/" or self.path == "":
            self.path = "/templates/index.html"
            return super().do_GET()

        if self.path == "/gojo-check":
            self.path = "/templates/gojo-check.html"
            return super().do_GET()

        if self.path == "/api/history":
            items = load_history()
            self.send_json({
                "success": True,
                "items": items
            })
            return

        if self.path == "/api/health":
            self.send_json({
                "success": True,
                "service": "BAN SITE",
                "status": "online"
            })
            return

        return super().do_GET()

    def do_POST(self):

        if self.path != "/api/report":
            self.send_json({
                "success": False,
                "message": "Route inconnue."
            }, 404)
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            raw_data = self.rfile.read(length).decode("utf-8")
            data = parse_qs(raw_data)

            target = data.get("target", [""])[0].strip()
            report_type = data.get("type", ["autre"])[0].strip()
            description = data.get("description", [""])[0].strip()

            if not target:
                self.send_json({
                    "success": False,
                    "message": "Cible manquante."
                }, 400)
                return

            allowed_types = {
                "spam",
                "abus",
                "fraude",
                "autre"
            }

            if report_type not in allowed_types:
                report_type = "autre"

            item = {
                "target": target,
                "type": report_type,
                "description": description
            }

            history = load_history()
            history.insert(0, item)

            # On garde seulement les 100 derniers signalements.
            history = history[:100]
            save_history(history)

            print()
            print("╔══════════════════════════════════════╗")
            print("║          NOUVEAU SIGNALEMENT         ║")
            print("╚══════════════════════════════════════╝")
            print(f"Cible     : {target}")
            print(f"Catégorie : {report_type}")
            print()

            self.send_json({
                "success": True,
                "message": "Signalement reçu par le serveur.",
                "target": target,
                "type": report_type
            })

        except Exception as error:
            print("[API] Erreur :", error)

            self.send_json({
                "success": False,
                "message": "Erreur interne du serveur."
            }, 500)

    def log_message(self, format, *args):
        print("[BAN SITE]", format % args)


os.chdir(BASE_DIR)

print("╔══════════════════════════════════════╗")
print("║          🌐 BAN SITE                 ║")
print("║          Serveur unifié              ║")
print("╚══════════════════════════════════════╝")
print()
print(f"➡️  Port : {PORT}")
print("➡️  API  : /api/report")
print("➡️  API  : /api/history")
print("➡️  Check: /gojo-check")
print()

server = ThreadingHTTPServer(("0.0.0.0", PORT), BanSiteHandler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 BAN SITE arrêté.")
    server.server_close()
