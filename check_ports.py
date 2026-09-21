import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('31.97.207.239', username='root', password='Pentacloud@2026', timeout=15)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip(): print(out)
    if err.strip(): print("[ERR]", err[:200])

print("=== Check what is listening on port 4000 ===")
run("ss -tlnp | grep 4000")

print("=== Check what is listening on port 4001 ===")
run("ss -tlnp | grep 4001")

print("=== pentacloud PM2 env PORT ===")
run("pm2 env 25 | grep -i port")

print("=== pentacloud-in PM2 env PORT ===")
run("pm2 env 48 | grep -i port")

print("=== curl port 4000 title ===")
run("curl -s http://localhost:4000/ | grep -o '<title>.*</title>'")

print("=== curl port 4001 title ===")
run("curl -s http://localhost:4001/ | grep -o '<title>.*</title>'")

client.close()
