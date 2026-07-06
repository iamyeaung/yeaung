---
name: run-project
description: Docker project lifecycle manager. Setup, start (offline mode), reboot, and stop the frontend and backend services.
---

# /run-project — Docker Project Lifecycle Manager

## When to use

Run this skill when the user wants to start, stop, or reboot the project's Docker containers. It provides clear commands to differentiate between a fresh build (which requires internet/VPN) and an offline start.

## What it does

Executes predefined Docker Compose commands based on the requested action:

1. **`setup`**: Runs `docker-compose up -d --build`. This forces a rebuild of all images. **Requires Internet/VPN** to download `apt`, `pip`, and `npm` packages.
2. **`start-offline`**: Runs `docker-compose up -d` without building. Uses existing cached images. **No Internet required**.
3. **`reboot`**: Runs `docker-compose restart`. Restarts all running containers.
4. **`stop`**: Runs `docker-compose down`. Stops and removes the containers and networks (data volumes are preserved).

*(Note: The `clear-cache` feature is pending a future interview to define exact requirements).*

## How to run

**Windows:**
```powershell
.agents\skills\run-project\scripts\run_project.ps1 <command>
```

**Linux/Mac:**
```bash
bash .agents/skills/run-project/scripts/run_project.sh <command>
```

**Available Commands:**
- `setup`
- `start-offline`
- `reboot`
- `stop`

---

*Myanmar — အနှစ်ချုပ်:*
*Docker project ကို စတင်ရန်၊ ပိတ်ရန် သို့မဟုတ် restart ချရန် ဤ skill ကို အသုံးပြုပါ။ အင်တာနက်/VPN လိုအပ်သော `setup` နှင့် အင်တာနက်မလိုသော `start-offline` တို့ကို ခွဲခြားလုပ်ဆောင်ပေးပါသည်။*
