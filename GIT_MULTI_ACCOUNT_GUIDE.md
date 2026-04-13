# Git Multiple Accounts - Quick Guide

## Accounts Setup
| Account | Username | Email |
|---|---|---|
| Personal/Work | Kamlesh480 | kamleshchhipa480@gmail.com |
| Project Account | Kittu0707 | ayushinama07@gmail.com |

---

## Part 1: Setting Up a New Repo from Scratch

### Step 1 — Initialize git in your project folder
```bash
cd "your/project/folder"
git init
```

### Step 2 — Set local identity (only for this repo, won't change global)
```bash
git config user.name "Kittu0707"
git config user.email "ayushinama07@gmail.com"
```

### Step 3 — Add remote (your GitHub repo URL)
```bash
git remote add origin https://github.com/Kittu0707/YOUR-REPO-NAME.git
```

### Step 4 — Create .gitignore
```bash
echo "node_modules/
.env
*.log" > .gitignore
```

### Step 5 — Commit and push
```bash
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

## Part 2: After Creating a New Token (Token Rotation)

When you delete an old token and create a new one, run these 3 commands:

### Option A — One command to update stored credentials
```bash
git credential reject <<EOF
protocol=https
host=github.com
username=Kittu0707
EOF
```
Then push once and git will prompt you — enter `Kittu0707` as username and the new token as password. It auto-saves.

### Option B — Manually update the credentials file
Open this file in Notepad:
```
C:\Users\ASUS\.git-credentials
```
Find the line starting with `https://Kittu0707:` and replace the old token with the new one:
```
https://Kittu0707:YOUR_NEW_TOKEN@github.com
```
Save the file. Done — no prompts needed.

### Option C — Push once with token in URL (easiest)
```bash
git remote set-url origin https://Kittu0707:YOUR_NEW_TOKEN@github.com/Kittu0707/REPO-NAME.git
git push
git remote set-url origin https://github.com/Kittu0707/REPO-NAME.git
```
The token gets saved automatically. Then clean the URL at the end.

---

## Part 3: Switching Between Accounts

### Check which identity is active in current repo
```bash
git config user.name
git config user.email
```

### Switch to Kittu0707 (for current repo only)
```bash
git config user.name "Kittu0707"
git config user.email "ayushinama07@gmail.com"
```

### Switch to Kamlesh (for current repo only)
```bash
git config user.name "Kamlesh480"
git config user.email "kamleshchhipa480@gmail.com"
```

### Check global default account
```bash
git config --global user.name
git config --global user.email
```

### Change global default
```bash
git config --global user.name "Kamlesh480"
git config --global user.email "kamleshchhipa480@gmail.com"
```

---

## Part 4: Day-to-Day Commands

### Regular push after initial setup
```bash
git add .
git commit -m "your message"
git push
```

### Check remote URL
```bash
git remote -v
```

### Check full local config for a repo
```bash
git config --list --local
```

### View stored credentials file location
```
C:\Users\ASUS\.git-credentials
```

---

## Part 5: Quick Reference — Full Setup for a New Kittu0707 Repo

```bash
# 1. Go to your project folder
cd "C:/path/to/your/project"

# 2. Init git
git init

# 3. Set Kittu0707 identity (local only)
git config user.name "Kittu0707"
git config user.email "ayushinama07@gmail.com"

# 4. Add remote
git remote add origin https://github.com/Kittu0707/YOUR-REPO.git

# 5. Create .gitignore (edit as needed)
echo "node_modules/" > .gitignore

# 6. Commit and push
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

## Notes
- `git config` (no flag) = applies to current repo only
- `git config --global` = applies to all repos on this machine
- Token is stored in: `C:\Users\ASUS\.git-credentials`
- Always revoke old tokens on GitHub after replacing them
- Never share tokens in chat or commit them to code


```
Once you have your new token, run:


cd "C:/Users/ASUS/OneDrive/Desktop/MAJOR_PROJECT"
git remote set-url origin https://Kittu0707:YOUR_NEW_TOKEN@github.com/Kittu0707/MERN-major-project.git
git push
git remote set-url origin https://github.com/Kittu0707/MERN-major-project.git
```