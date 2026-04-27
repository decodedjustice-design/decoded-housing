import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "../components/Navbar";
import { QuickAssistSidebar } from "../components/QuickAssistSidebar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Decoded Housing — Housing stability for King County" },
      { name: "description", content: "Find affordable housing, get help with food, utilities, furniture, and rent, and understand your tenant rights in King County." },
      { name: "author", content: "Decoded Housing" },
      { property: "og:title", content: "Decoded Housing — Housing stability for King County" },
      { property: "og:description", content: "Find affordable housing, get help with food, utilities, furniture, and rent, and understand your tenant rights in King County." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Decoded Housing — Housing stability for King County" },
      { name: "twitter:description", content: "Find affordable housing, get help with food, utilities, furniture, and rent, and understand your tenant rights in King County." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e415d407-e306-42d8-bb36-3d351a49b68f/id-preview-502ec7af--a88c4118-917c-4ab6-ad62-dadd7e615949.lovable.app-1777262413541.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e415d407-e306-42d8-bb36-3d351a49b68f/id-preview-502ec7af--a88c4118-917c-4ab6-ad62-dadd7e615949.lovable.app-1777262413541.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <QuickAssistSidebar />
    </div>
  );
}
