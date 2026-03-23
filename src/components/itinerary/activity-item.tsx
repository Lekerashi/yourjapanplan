import { Badge } from "@/components/ui/badge";
import { Clock, Bookmark, Lightbulb } from "lucide-react";

interface ActivityItemProps {
  activity: {
    time?: string;
    title?: string;
    description?: string;
    duration_minutes?: number;
    reservation_required?: boolean;
    cost_estimate?: string;
    tip?: string | null;
  };
}

export function ActivityItem({ activity: a }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      {/* Time column */}
      <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
        <span className="text-sm font-semibold text-rose-600">
          {a.time ?? "..."}
        </span>
      </div>

      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-rose-400" />
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <h4 className="font-semibold">{a.title ?? "..."}</h4>
        {a.description && (
          <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {a.duration_minutes != null && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {a.duration_minutes >= 60
                ? `${Math.floor(a.duration_minutes / 60)}h${a.duration_minutes % 60 ? ` ${a.duration_minutes % 60}m` : ""}`
                : `${a.duration_minutes}m`}
            </span>
          )}
          {a.cost_estimate && (
            <span className="text-xs text-muted-foreground">
              {a.cost_estimate}
            </span>
          )}
          {a.reservation_required && (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-xs text-amber-700"
            >
              <Bookmark className="mr-0.5 h-3 w-3" />
              Reserve ahead
            </Badge>
          )}
        </div>

        {a.tip && (
          <div className="mt-2 flex items-start gap-1.5 rounded bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
            {a.tip}
          </div>
        )}
      </div>
    </div>
  );
}
