import sqlite3
import os

try:
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "auth.db"))
    print(f"Opening DB at: {path}")
    conn = sqlite3.connect(path, timeout=5) # 5s timeout
    c = conn.cursor()
    c.execute("PRAGMA table_info(users)")
    columns = [row[1] for row in c.fetchall()]
    print("Columns:", columns)
    
    c.execute("SELECT id, email, role, status FROM users LIMIT 5")
    rows = c.fetchall()
    print("Users:", rows)
    conn.close()
except Exception as e:
    print("Error:", e)
