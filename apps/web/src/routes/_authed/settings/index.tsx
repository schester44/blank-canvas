import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authed/settings/")({
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  const { session } = useRouteContext({ from: "/_authed" });
  const { user } = session;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{user.name}</p>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
