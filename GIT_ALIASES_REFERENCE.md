# 🚀 Git Aliases Reference Guide

**Comprehensive git aliases added to `~/.zshrc` for faster development workflow.**

---

## 📋 Quick Reference

### Basic Commands

| Alias | Command | Description |
|-------|---------|-------------|
| `g` | `git` | Short for git |
| `ga` | `git add` | Stage files |
| `gaa` | `git add --all` | Stage all changes |
| `gap` | `git add -p` | Stage interactively |
| `gc` | `git commit -v` | Commit with verbose diff |
| `gcm` | `git commit -m` | Commit with message |
| `gcam` | `git commit -a -m` | Commit all with message |
| `gco` | `git checkout` | Checkout branch |
| `gcb` | `git checkout -b` | Create and checkout branch |
| `gcl` | `git clone` | Clone repository |

---

### Status & Diff

| Alias | Command | Description |
|-------|---------|-------------|
| `gs` | `git status` | Show status |
| `gss` | `git status -s` | Short status |
| `gd` | `git diff` | Show diff |
| `gds` | `git diff --staged` | Show staged diff |
| `gdt` | `git difftool` | Open diff tool |

---

### Git Log (Beautifully Formatted)

| Alias | Command | Description |
|-------|---------|-------------|
| `gl` | `git log --oneline --decorate --graph` | One-line log with graph |
| `gla` | `git log --oneline --decorate --graph --all` | All branches graph |
| `glog` | Pretty colored log | Beautiful log with colors |
| `glol` | Pretty log | Graph with author and date |
| `glola` | Pretty log all branches | Full graph of all branches |

---

### Push & Pull

| Alias | Command | Description |
|-------|---------|-------------|
| `gp` | `git push` | Push to remote |
| `gpu` | `git push -u origin` | Push and set upstream |
| `gpf` | `git push --force-with-lease` | Safe force push |
| `gpom` | `git push origin main` | Push to main |
| `gpod` | `git push origin develop` | Push to develop |
| `gpl` | `git pull` | Pull from remote |
| `gplr` | `git pull --rebase` | Pull with rebase |

---

### Branches

| Alias | Command | Description |
|-------|---------|-------------|
| `gb` | `git branch` | List branches |
| `gba` | `git branch -a` | List all branches |
| `gbd` | `git branch -d` | Delete branch |
| `gbD` | `git branch -D` | Force delete branch |
| `gcurr` | `git branch --show-current` | Show current branch |
| `gbclean` | Clean merged branches | Delete merged branches |
| `gbprune` | `git remote prune origin` | Prune deleted remote branches |

---

### Remote Operations

| Alias | Command | Description |
|-------|---------|-------------|
| `gr` | `git remote` | List remotes |
| `gra` | `git remote add` | Add remote |
| `grv` | `git remote -v` | List remotes verbose |
| `grmv` | `git remote rename` | Rename remote |
| `grrm` | `git remote remove` | Remove remote |
| `grset` | `git remote set-url` | Set remote URL |

---

### Fetch & Merge

| Alias | Command | Description |
|-------|---------|-------------|
| `gf` | `git fetch` | Fetch from remote |
| `gfa` | `git fetch --all` | Fetch all remotes |
| `gfo` | `git fetch origin` | Fetch origin |
| `gfp` | `git fetch --prune` | Fetch and prune |
| `gm` | `git merge` | Merge branch |
| `gma` | `git merge --abort` | Abort merge |
| `gmc` | `git merge --continue` | Continue merge |

---

### Rebase

| Alias | Command | Description |
|-------|---------|-------------|
| `grb` | `git rebase` | Rebase |
| `grba` | `git rebase --abort` | Abort rebase |
| `grbc` | `git rebase --continue` | Continue rebase |
| `grbi` | `git rebase -i` | Interactive rebase |
| `grbm` | `git rebase main` | Rebase on main |
| `grbd` | `git rebase develop` | Rebase on develop |

---

### Stash

| Alias | Command | Description |
|-------|---------|-------------|
| `gst` | `git stash` | Stash changes |
| `gsta` | `git stash apply` | Apply stash |
| `gstd` | `git stash drop` | Drop stash |
| `gstl` | `git stash list` | List stashes |
| `gstp` | `git stash pop` | Pop stash |
| `gsts` | `git stash show` | Show stash |

---

### Reset & Undo

| Alias | Command | Description |
|-------|---------|-------------|
| `grh` | `git reset HEAD` | Unstage files |
| `grhh` | `git reset --hard HEAD` | Hard reset to HEAD |
| `gundo` | `git reset --soft HEAD~1` | Undo last commit, keep changes |
| `guncmt` | `git reset --soft HEAD~1` | Same as gundo |
| `gnope` | `git checkout .` | Discard all changes |
| `gwhoops` | `git reset --hard HEAD && git clean -df` | Nuclear reset |
| `gamend` | `git commit --amend --no-edit` | Amend without editing |
| `gamendf` | `git commit --amend` | Amend and edit message |

---

### Tags

| Alias | Command | Description |
|-------|---------|-------------|
| `gt` | `git tag` | List tags |
| `gta` | `git tag -a` | Annotated tag |
| `gtd` | `git tag -d` | Delete tag |
| `gtl` | `git tag -l` | List tags with pattern |

---

### Quick Workflows

| Alias | Command | Description |
|-------|---------|-------------|
| `gwip` | `git add -A; git commit -m 'WIP'` | Work in progress commit |
| `gunwip` | Undo WIP | Undo WIP commit |
| `gacp` | `git add --all && git commit -m` | Add all and commit |
| `gacpush` | Add, commit, push | Quick push |
| `gclean` | `git clean -fd` | Clean untracked files |
| `gignore` | Assume unchanged | Ignore file changes |
| `gunignore` | No assume unchanged | Stop ignoring |

---

## 🔧 Git Functions

### Create and Checkout New Branch

```bash
gnb feature-name
# Creates and checks out feature-name branch
```

### Quick Commit with Message

```bash
gcq "Add new feature"
# Stages all and commits
```

### Quick Commit and Push

```bash
gcpush "Fix bug in auth"
# Stages, commits, and pushes
```

### Delete Branch Locally and Remotely

```bash
gbd feature-branch
# Deletes locally and on origin
```

### Clone and CD

```bash
gclcd https://github.com/user/repo.git
# Clones and enters directory
```

### Show Contributors

```bash
gcontrib
# Shows contributor stats
```

### Checkout Pull Request

```bash
gpr 123
# Checks out PR #123
```

### Sync Fork with Upstream

```bash
gsync
# Syncs fork with upstream/main
```

### Get PR URL

```bash
gprurl
# Prints GitHub PR creation URL for current branch
```

---

## 💡 Usage Examples

### Typical Development Workflow

```bash
# Start new feature
gnb feature/awesome-feature

# Make changes, then quick commit
gcq "Add awesome feature"

# Push to remote
gpu HEAD

# Or do it all at once
gcpush "Add awesome feature"
```

### Fix a Typo in Last Commit

```bash
# Make the fix
echo "fixed" > file.txt

# Stage and amend
gaa
gamend

# Force push (safely)
gpfl
```

### Sync with Main Branch

```bash
# Save current work
gwip

# Switch to main and update
gco main
gpl

# Back to feature branch
gco feature/my-feature

# Rebase on main
grbm

# Continue working
gunwip
```

### Clean Up Branches

```bash
# Delete merged branches
gbclean

# Prune deleted remote branches
gbprune
```

### Beautiful Log

```bash
# Pretty log of current branch
glol

# All branches with color
glola
```

---

## 🎨 Customization

### Add Your Own Aliases

Edit `~/.zshrc`:

```bash
nano ~/.zshrc

# Add at the bottom:
alias myalias="git command"

# Save and reload
source ~/.zshrc
```

### Create Custom Functions

```bash
# Add to ~/.zshrc
function myfunc() {
    git command "$1"
}
```

---

## 🔄 Reload Configuration

After editing `~/.zshrc`:

```bash
# Method 1: Source the file
source ~/.zshrc

# Method 2: Restart shell
exec zsh

# Method 3: Open new terminal tab
```

---

## 📋 Cheat Sheet

### Most Used Commands

```bash
# Daily workflow
gs          # Check status
gaa         # Stage all
gcm "msg"   # Commit with message
gp          # Push

# Branch management
gb          # List branches
gcb name    # Create branch
gco name    # Switch branch
gbd name    # Delete branch

# View history
gl          # Simple log
glog        # Pretty log
glola       # All branches

# Undo mistakes
gundo       # Undo commit
gnope       # Discard changes
grhh        # Hard reset

# Quick actions
gwip        # Save WIP
gcpush "x"  # Commit and push
gclean      # Clean untracked
```

---

## ⚙️ Permissions Set

Your `~/.zshrc` has been set with proper permissions:

```bash
chmod 644 ~/.zshrc
# Owner: read/write
# Group: read
# Others: read
```

---

## 🔗 Resources

- [Oh My Zsh Git Plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git)
- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

<div align="center">

**🚀 Git Aliases Loaded!**

Restart your terminal or run `source ~/.zshrc`

**Over 100+ aliases and functions at your fingertips!**

</div>
