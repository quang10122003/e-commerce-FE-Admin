"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BrowserNotificationTone = "info" | "success" | "error" | "warning";

const EXIT_ANIMATION_MS = 240;
const DEFAULT_AUTO_HIDE_MS = 4500;

export type BrowserNotificationState = {
  autoHideMs?: number;
  id: number;
  isLeaving?: boolean;
  message: string;
  title?: string;
  tone: BrowserNotificationTone;
};

type ShowNotificationOptions = {
  autoHideMs?: number;
  duration?: number;
  title?: string;
  tone?: BrowserNotificationTone;
  variant?: BrowserNotificationTone;
};

type NotificationContextValue = {
  dismissNotification: (notificationId: number) => void;
  hideNotification: (notificationId?: number) => void;
  showNotification: (
    message: string,
    options?: ShowNotificationOptions,
  ) => number;
};

type BrowserNotificationProps = {
  autoHideMs?: number;
  notifications: BrowserNotificationState[];
  onDismiss: (notificationId: number) => void;
  onRemove: (notificationId: number) => void;
};

type BrowserNotificationItemProps = {
  autoHideMs: number;
  notification: BrowserNotificationState;
  onDismiss: (notificationId: number) => void;
  onRemove: (notificationId: number) => void;
};

const toneConfig = {
  info: {
    accent: "bg-blue-500",
    border: "border-blue-100",
    glow: "shadow-blue-100/80",
    icon: Info,
    iconClass: "bg-blue-50 text-blue-600 ring-blue-100",
    label: "Thong tin",
    role: "status",
  },
  success: {
    accent: "bg-emerald-500",
    border: "border-emerald-100",
    glow: "shadow-emerald-100/80",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    label: "Thanh cong",
    role: "status",
  },
  error: {
    accent: "bg-rose-500",
    border: "border-rose-100",
    glow: "shadow-rose-100/80",
    icon: XCircle,
    iconClass: "bg-rose-50 text-error ring-rose-100",
    label: "Loi",
    role: "alert",
  },
  warning: {
    accent: "bg-amber-500",
    border: "border-amber-100",
    glow: "shadow-amber-100/80",
    icon: AlertTriangle,
    iconClass: "bg-amber-50 text-amber-600 ring-amber-100",
    label: "Canh bao",
    role: "alert",
  },
} satisfies Record<
  BrowserNotificationTone,
  {
    accent: string;
    border: string;
    glow: string;
    icon: LucideIcon;
    iconClass: string;
    label: string;
    role: "alert" | "status";
  }
>;

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

function BrowserNotificationItem({
  autoHideMs,
  notification,
  onDismiss,
  onRemove,
}: BrowserNotificationItemProps) {
  useEffect(() => {
    if (notification.isLeaving || autoHideMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(notification.id);
    }, autoHideMs);

    return () => window.clearTimeout(timeoutId);
  }, [autoHideMs, notification.id, notification.isLeaving, onDismiss]);

  useEffect(() => {
    if (!notification.isLeaving) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onRemove(notification.id);
    }, EXIT_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [notification.id, notification.isLeaving, onRemove]);

  const config = toneConfig[notification.tone];
  const Icon = config.icon;
  const title = notification.title ?? config.label;

  return (
    <div
      className={`browser-notification-card pointer-events-auto overflow-hidden rounded-2xl border bg-white/95 shadow-xl backdrop-blur ${config.border} ${config.glow} ${
        notification.isLeaving
          ? "animate-browser-notification-out"
          : "animate-browser-notification-in"
      }`}
      onAnimationEnd={() => {
        if (notification.isLeaving) {
          onRemove(notification.id);
        }
      }}
      role={config.role}
    >
      <div className="flex min-h-20">
        <div className={`w-1.5 shrink-0 ${config.accent}`} />

        <div className="flex min-w-0 flex-1 items-start gap-3 px-3.5 py-3">
          <span className={`rounded-xl p-2 ring-1 ${config.iconClass}`}>
            <Icon className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">
                {title}
              </p>

              <button
                aria-label="Dong thong bao"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => onDismiss(notification.id)}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>

            <p
              className={`mt-1 line-clamp-2 text-sm leading-5 ${
                notification.tone === "error" ? "text-error" : "text-slate-600"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      </div>

      {!notification.isLeaving ? (
        <div className="h-0.5 bg-slate-100">
          <div
            className={`browser-notification-progress h-full ${config.accent}`}
            style={{ animationDuration: `${autoHideMs}ms` }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function BrowserNotification({
  autoHideMs = DEFAULT_AUTO_HIDE_MS,
  notifications,
  onDismiss,
  onRemove,
}: BrowserNotificationProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5 sm:right-6 sm:top-6"
    >
      {notifications.map((notification) => (
        <BrowserNotificationItem
          autoHideMs={notification.autoHideMs ?? autoHideMs}
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const idRef = useRef(0);
  const [notifications, setNotifications] = useState<BrowserNotificationState[]>(
    [],
  );

  const dismissNotification = useCallback((notificationId: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isLeaving: true }
          : notification,
      ),
    );
  }, []);

  const removeNotification = useCallback((notificationId: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (notification) => notification.id !== notificationId,
      ),
    );
  }, []);

  const hideNotification = useCallback(
    (notificationId?: number) => {
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notificationId === undefined || notification.id === notificationId
            ? { ...notification, isLeaving: true }
            : notification,
        ),
      );
    },
    [],
  );

  const showNotification = useCallback(
    (message: string, options: ShowNotificationOptions = {}) => {
      const id = Date.now() + idRef.current;
      idRef.current += 1;

      setNotifications((currentNotifications) => [
        {
          autoHideMs: options.autoHideMs ?? options.duration,
          id,
          message,
          title: options.title,
          tone: options.tone ?? options.variant ?? "info",
        },
        ...currentNotifications,
      ]);

      return id;
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      dismissNotification,
      hideNotification,
      showNotification,
    }),
    [dismissNotification, hideNotification, showNotification],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <BrowserNotification
        notifications={notifications}
        onDismiss={dismissNotification}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
}
