# Contributing to DealDiscover

## Branch Rules

| Branch | Purpose | Push to Main? |
|---|---|---|
| `main` | **Production-ready only** — 100% working, tested, approved code | ❌ No direct push |
| `santhu` | Development branch for Santhu | Via PR only |
| `pk` | Development branch for PK | Via PR only |

> ⚠️ **NEVER push directly to `main`.** All changes must go through a Pull Request.

---

## Development Workflow

### 1. Work on Your Branch

```bash
git checkout santhu      # or: git checkout pk
# make your changes...
git add -A
git commit -m "feat: describe what you did"
git push origin santhu   # or: git push origin pk
```

### 2. Create a Pull Request

1. Go to GitHub → your repo → **Pull Requests** → **New Pull Request**
2. Set **base**: `main` ← **compare**: `santhu` (or `pk`)
3. Fill in the PR template (see below)
4. Click **Create Pull Request**
5. **Wait for approval** — do NOT merge yourself

### 3. PR Will Be Reviewed For

- [ ] Code builds without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] No hardcoded secrets or API keys
- [ ] Feature works correctly (tested locally)
- [ ] No console errors in browser
- [ ] UI works in both light and dark mode
- [ ] Mobile responsive

### 4. After Approval

The admin will merge the PR into `main`. Then sync your branch:

```bash
git checkout santhu      # or pk
git pull origin main     # get latest main
```

---

## Commit Message Format

Use clear prefixes:

```
feat: add user favorites feature
fix: resolve login redirect issue
style: update dark mode colors
refactor: simplify ad filtering logic
docs: update README
```

---

## Before Every PR

Run these locally and make sure they pass:

```bash
npm run build     # Must succeed with 0 errors
npm run lint      # Must show 0 errors, 0 warnings
```

**If either fails, fix it before creating the PR.**
