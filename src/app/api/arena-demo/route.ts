import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const DJANGO_URL = (
  process.env.NEXT_PUBLIC_ARENA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  process.env.DJANGO_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

let isSpawning = false;
let lastSpawnTime = 0;

async function checkServerOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${DJANGO_URL}/demo/status/`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

function launchLocalDjangoServer(): { success: boolean; message: string } {
  const isLocal =
    DJANGO_URL.includes("127.0.0.1") || DJANGO_URL.includes("localhost");

  if (!isLocal) {
    return {
      success: true,
      message: "Ping de inicialização enviado para o servidor na nuvem.",
    };
  }

  const now = Date.now();
  if (isSpawning || now - lastSpawnTime < 15000) {
    return {
      success: true,
      message: "Inicialização já solicitada. Aguardando servidor responder...",
    };
  }

  try {
    isSpawning = true;
    lastSpawnTime = now;

    const projectDir = path.join(
      process.cwd(),
      "projetos",
      "sistema_de_agenda_para_arenas"
    );

    const venvPythonWin = path.join(projectDir, "venv", "Scripts", "python.exe");
    const venvPythonwWin = path.join(projectDir, "venv", "Scripts", "pythonw.exe");
    const venvPythonUnix = path.join(projectDir, "venv", "bin", "python");

    let pythonExe = "python";
    if (process.platform === "win32") {
      if (fs.existsSync(venvPythonwWin)) {
        pythonExe = venvPythonwWin;
      } else if (fs.existsSync(venvPythonWin)) {
        pythonExe = venvPythonWin;
      }
    } else if (fs.existsSync(venvPythonUnix)) {
      pythonExe = venvPythonUnix;
    }

    const child = spawn(
      pythonExe,
      ["manage.py", "runserver", "127.0.0.1:8000"],
      {
        cwd: projectDir,
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      }
    );

    child.unref();

    setTimeout(() => {
      isSpawning = false;
    }, 6000);

    return {
      success: true,
      message: "Servidor Django acionado em segundo plano.",
    };
  } catch (err: any) {
    isSpawning = false;
    return {
      success: false,
      message: `Erro ao acionar servidor: ${err.message}`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "status";

    if (action === "wake") {
      const isOnline = await checkServerOnline();
      if (isOnline) {
        return NextResponse.json({
          status: "online",
          message: "Servidor Django já está online e operante.",
        });
      }
      const launch = launchLocalDjangoServer();
      return NextResponse.json({
        status: "starting",
        message: launch.message,
      });
    }

    if (action === "reset") {
      const res = await fetch(`${DJANGO_URL}/demo/reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default: status check
    const isOnline = await checkServerOnline();
    if (isOnline) {
      const res = await fetch(`${DJANGO_URL}/demo/status/`, {
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json({ ...data, backendUrl: DJANGO_URL });
    }
    return NextResponse.json({ status: "offline", backendUrl: DJANGO_URL }, { status: 503 });
  } catch (error: any) {
    return NextResponse.json(
      { status: "offline", error: error.message, backendUrl: DJANGO_URL },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "wake") {
      const isOnline = await checkServerOnline();
      if (isOnline) {
        return NextResponse.json({
          status: "online",
          message: "Servidor Django já está online.",
          backendUrl: DJANGO_URL,
        });
      }
      const launch = launchLocalDjangoServer();
      return NextResponse.json({
        status: "starting",
        message: launch.message,
        backendUrl: DJANGO_URL,
      });
    }

    const isOnline = await checkServerOnline();
    if (isOnline) {
      const res = await fetch(`${DJANGO_URL}/demo/status/`, {
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json({ ...data, backendUrl: DJANGO_URL });
    }
    return NextResponse.json({ status: "offline", backendUrl: DJANGO_URL });
  } catch {
    return NextResponse.json({ status: "offline", backendUrl: DJANGO_URL });
  }
}
