import type { IconName } from "./icons.js";

export const TAB_GROUPS = [
  { label: "聊天", tabs: ["chat"] },
  {
    label: "控制",
    tabs: ["overview", "channels", "instances", "sessions", "cron"],
  },
  { label: "代理", tabs: ["agents", "skills", "nodes"] },
  { label: "设置", tabs: ["config", "debug", "logs"] },
] as const;

export type Tab =
  | "agents"
  | "overview"
  | "channels"
  | "instances"
  | "sessions"
  | "cron"
  | "skills"
  | "nodes"
  | "chat"
  | "config"
  | "debug"
  | "logs";

const TAB_PATHS: Record<Tab, string> = {
  agents: "/agents",
  overview: "/overview",
  channels: "/channels",
  instances: "/instances",
  sessions: "/sessions",
  cron: "/cron",
  skills: "/skills",
  nodes: "/nodes",
  chat: "/chat",
  config: "/config",
  debug: "/debug",
  logs: "/logs",
};

const PATH_TO_TAB = new Map(Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab as Tab]));

export function normalizeBasePath(basePath: string): string {
  if (!basePath) {
    return "";
  }
  let base = basePath.trim();
  if (!base.startsWith("/")) {
    base = `/${base}`;
  }
  if (base === "/") {
    return "";
  }
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return base;
}

export function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  let normalized = path.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function pathForTab(tab: Tab, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  const path = TAB_PATHS[tab];
  return base ? `${base}${path}` : path;
}

export function tabFromPath(pathname: string, basePath = ""): Tab | null {
  const base = normalizeBasePath(basePath);
  let path = pathname || "/";
  if (base) {
    if (path === base) {
      path = "/";
    } else if (path.startsWith(`${base}/`)) {
      path = path.slice(base.length);
    }
  }
  let normalized = normalizePath(path).toLowerCase();
  if (normalized.endsWith("/index.html")) {
    normalized = "/";
  }
  if (normalized === "/") {
    return "chat";
  }
  return PATH_TO_TAB.get(normalized) ?? null;
}

export function inferBasePathFromPathname(pathname: string): string {
  let normalized = normalizePath(pathname);
  if (normalized.endsWith("/index.html")) {
    normalized = normalizePath(normalized.slice(0, -"/index.html".length));
  }
  if (normalized === "/") {
    return "";
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }
  for (let i = 0; i < segments.length; i++) {
    const candidate = `/${segments.slice(i).join("/")}`.toLowerCase();
    if (PATH_TO_TAB.has(candidate)) {
      const prefix = segments.slice(0, i);
      return prefix.length ? `/${prefix.join("/")}` : "";
    }
  }
  return `/${segments.join("/")}`;
}

export function iconForTab(tab: Tab): IconName {
  switch (tab) {
    case "agents":
      return "folder";
    case "chat":
      return "messageSquare";
    case "overview":
      return "barChart";
    case "channels":
      return "link";
    case "instances":
      return "radio";
    case "sessions":
      return "fileText";
    case "cron":
      return "loader";
    case "skills":
      return "zap";
    case "nodes":
      return "monitor";
    case "config":
      return "settings";
    case "debug":
      return "bug";
    case "logs":
      return "scrollText";
    default:
      return "folder";
  }
}

export function titleForTab(tab: Tab) {
  switch (tab) {
    case "agents":
      return "代理";
    case "overview":
      return "概览";
    case "channels":
      return "通道";
    case "instances":
      return "实例";
    case "sessions":
      return "会话";
    case "cron":
      return "定时任务";
    case "skills":
      return "技能";
    case "nodes":
      return "节点";
    case "chat":
      return "聊天";
    case "config":
      return "配置";
    case "debug":
      return "调试";
    case "logs":
      return "日志";
    default:
      return "控制";
  }
}

export function subtitleForTab(tab: Tab) {
  switch (tab) {
    case "agents":
      return "管理代理工作区、工具和身份。";
    case "overview":
      return "网关状态、入口点和快速健康检查。";
    case "channels":
      return "管理通道和设置。";
    case "instances":
      return "来自已连接客户端和节点的存在信标。";
    case "sessions":
      return "检查活动会话并调整每个会话的默认值。";
    case "cron":
      return "安排唤醒和重复的代理运行。";
    case "skills":
      return "管理技能可用性和 API 密钥注入。";
    case "nodes":
      return "配对设备、功能和命令暴露。";
    case "chat":
      return "直接网关聊天会话，用于快速干预。";
    case "config":
      return "安全编辑 ~/.openclaw/openclaw.json。";
    case "debug":
      return "网关快照、事件和手动 RPC 调用。";
    case "logs":
      return "实时跟踪网关文件日志。";
    default:
      return "";
  }
}
