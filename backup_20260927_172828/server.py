from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json

HOST = "127.0.0.1"
PORT = 8081

class BanSiteAPI(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

        self.wfile.write(body)


    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):

        if self.path != "/api/report":
            self.send_json({
                "success": False,
                "message": "Route inconnue."
            }, 404)
            return

        length = int(self.headers.get("Content-Length", 0))
        raw_data = self.rfile.read(length).decode("utf-8")

        data = parse_qs(raw_data)

        target = data.get("target", [""])[0].strip()
        report_type = data.get("type", ["autre"])[0].strip()

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

        print()
        print("╔══════════════════════════════════════╗")
        print("║          NOUVEAU SIGNALEMENT         ║")
        print("╚══════════════════════════════════════╝")
        print(f"Cible    : {target}")
        print(f"Catégorie: {report_type}")
        print()

        self.send_json({
            "success": True,
            "message": "Signalement reçu par le serveur.",
            "target": target,
            "type": report_type
        })

    def log_message(self, format, *args):
        print("[API]", format % args)


print("╔══════════════════════════════════════╗")
print("║          BAN SITE — API              ║")
print("║          Port : 8081                 ║")
print("╚══════════════════════════════════════╝")

server = HTTPServer((HOST, PORT), BanSiteAPI)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 API arrêtée.")
    server.server_close()
