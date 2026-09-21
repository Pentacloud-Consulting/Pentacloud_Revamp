import paramiko, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HOST = "31.97.207.239"
USER = "root"
PASS = "Pentacloud@2026"
APP_DIR = "/var/www/pentacloud"
CORRECT_REPO = "https://github.com/Pentacloud-Consulting/Pentacloud_Revamp.git"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, timeout=15)
print("[OK] Connected!\n")

def run(cmd, timeout=300, label=None):
    if label:
        print(f"\n{'='*60}\n>>> {label}\n{'='*60}")
    else:
        print(f"\n{'='*60}\n>>> {cmd}\n{'='*60}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if out.strip(): print(out)
    if err.strip(): print(f"[STDERR]: {err[:500]}")
    return out

print("=== STEP 1: Check current git remote ===")
run(f"cd {APP_DIR} && git remote -v")

print("\n=== STEP 2: Switch git remote to Pentacloud_Revamp (our .me project) ===")
run(f"cd {APP_DIR} && git remote set-url origin {CORRECT_REPO}")
run(f"cd {APP_DIR} && git remote -v")  # confirm

print("\n=== STEP 3: Fetch + hard reset to correct codebase ===")
run(f"cd {APP_DIR} && git fetch origin 2>&1", label="git fetch")
run(f"cd {APP_DIR} && git reset --hard origin/main 2>&1", label="git reset --hard origin/main")
run(f"cd {APP_DIR} && git log --oneline -3", label="Latest 3 commits on server")

print("\n=== STEP 4: Install dependencies ===")
run(f"cd {APP_DIR} && npm install --legacy-peer-deps 2>&1", timeout=120, label="npm install")

print("\n=== STEP 5: Build Next.js app ===")
build_out = run(
    f"cd {APP_DIR} && NODE_OPTIONS='--max-old-space-size=4096' npm run build 2>&1",
    timeout=600,
    label="npm run build"
)
if "Build error occurred" in build_out or "Failed to compile" in build_out:
    print("\n[BUILD FAILED]")
    sys.exit(1)

print("\n=== STEP 6: Restart PM2 ===")
run("pm2 restart pentacloud")
time.sleep(3)

print("\n=== STEP 7: Verify ===")
run("pm2 show pentacloud | grep -E 'status|uptime|restarts'")
time.sleep(2)
run("curl -s http://localhost:4000/ | grep -o '<title>.*</title>'")

client.close()
print("\n[DONE] pentacloud.me now serves the correct Pentacloud_Revamp project!")
