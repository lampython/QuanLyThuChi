import http.server
import socketserver
import os
import sys

PORT = 5188
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Quiet log to keep console clean
        pass

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    # Enable address reuse to prevent "address already in use" errors on quick restarts
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler) as httpd:
            print(f"[*] May chu So Thu Chi dang chay tai: http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Da dung may chu.")
        sys.exit(0)
