// components/ui/sonner.tsx

"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      <style>{`
        .toaster [data-sonner-toast][data-type="success"] {
          background-color: #f0fdf4 !important;
          border-color: #bbf7d0 !important;
          color: #15803d !important;
        }
        .toaster [data-sonner-toast][data-type="success"] [data-icon] {
          color: #16a34a !important;
        }
        .toaster [data-sonner-toast][data-type="error"] {
          background-color: #fef2f2 !important;
          border-color: #fecaca !important;
          color: #b91c1c !important;
        }
        .toaster [data-sonner-toast][data-type="error"] [data-icon] {
          color: #dc2626 !important;
        }
        .toaster [data-sonner-toast][data-type="warning"] {
          background-color: #fffbeb !important;
          border-color: #fde68a !important;
          color: #92400e !important;
        }
        .toaster [data-sonner-toast][data-type="warning"] [data-icon] {
          color: #d97706 !important;
        }
        .toaster [data-sonner-toast][data-type="info"] {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
          color: #1d4ed8 !important;
        }
        .toaster [data-sonner-toast][data-type="info"] [data-icon] {
          color: #2563eb !important;
        }
        .toaster [data-sonner-toast] {
          position: relative !important;
          padding-right: 2.5rem !important;
        }
        .toaster [data-sonner-toast] [data-close-button] {
          position: absolute !important;
          top: 50% !important;
          right: 0.75rem !important;
          left: unset !important;
          transform: translateY(-50%) !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          opacity: 0.5 !important;
          cursor: pointer !important;
        }
        .toaster [data-sonner-toast] [data-close-button]:hover {
          opacity: 1 !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        closeButton
        icons={{
          success: <CircleCheckIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <TriangleAlertIcon className="size-4" />,
          error: <OctagonXIcon className="size-4" />,
          loading: <Loader2Icon className="size-4 animate-spin" />,
        }}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--border-radius": "var(--radius)",
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  )
}

export { Toaster }