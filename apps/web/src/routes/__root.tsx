import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { title } from "@/lib/meta";
import { getThemeServerFn } from "@/lib/theme";
import "../styles.css";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const theme = await getThemeServerFn();

    return { theme };
  },
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, minimum-scale=1",
      },
      { title: title() },
    ],

  }),
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TooltipProvider>
          <Outlet />
          <Toaster richColors />
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}
