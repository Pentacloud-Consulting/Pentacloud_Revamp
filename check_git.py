import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('31.97.207.239', username='root', password='Pentacloud@2026', timeout=15)

def run(cmd, label=""):
    if label: print(f"\n=== {label} ===")
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    if out.strip(): print(out)

# Check both app directories - git remote and recent commit
run("ls /var/www/", "All apps in /var/www/")
run("cd /var/www/pentacloud && git remote -v && echo '---' && git log --oneline -3", "pentacloud git info")
run("cd /var/www/pentacloud-in && git remote -v && echo '---' && git log --oneline -3", "pentacloud-in git info (if exists)")
run("ls /var/www/ | grep -i penta", "Penta directories")
run("pm2 show 48 | grep -E 'script|cwd|exec'", "pentacloud-in PM2 app dir")
run("pm2 show 25 | grep -E 'script|cwd|exec'", "pentacloud PM2 app dir")

client.close()
