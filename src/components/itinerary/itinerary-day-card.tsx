import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityItem } from "./activity-item";
import { MapPin, ArrowRight, Bed, Train } from "lucide-react";

interface DayCardProps {
  day: {
    day_number?: number;
    destination_name?: string;
    theme?: string;
    activities?: ({
      time?: string;
      title?: string;
      description?: string;
      duration_minutes?: number;
      reservation_required?: boolean;
      cost_estimate?: string;
      tip?: string | null;
    } | undefined)[];
    transport?: {
      from?: string;
      to?: string;
      method?: string;
      duration?: string;
      cost?: string;
      tip?: string | null;
    } | null;
    accommodation?: {
      name?: string;
      area?: string;
      type?: string;
      reasoning?: string;
    };
  };
}

export function ItineraryDayCard({ day }: DayCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge className="mb-2">Day {day.day_number ?? "..."}</Badge>
            <CardTitle className="text-xl">
              {day.theme ?? "Planning..."}
            </CardTitle>
            {day.destination_name && (
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {day.destination_name}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {/* Activities timeline */}
        {day.activities && day.activities.length > 0 && (
          <div>
            {day.activities
              .filter((a): a is NonNullable<typeof a> => !!a)
              .map((activity, i) => (
                <ActivityItem key={i} activity={activity} />
              ))}
          </div>
        )}

        {/* Transport to next destination */}
        {day.transport && (
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm">
            <Train className="h-4 w-4 shrink-0 text-blue-600" />
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              <span className="font-medium">{day.transport.from}</span>
              <ArrowRight className="h-3 w-3 text-blue-400" />
              <span className="font-medium">{day.transport.to}</span>
              {day.transport.method && (
                <span className="text-blue-600">
                  via {day.transport.method}
                </span>
              )}
              {day.transport.duration && (
                <span className="text-muted-foreground">
                  ({day.transport.duration})
                </span>
              )}
              {day.transport.cost && (
                <span className="text-muted-foreground">
                  &middot; {day.transport.cost}
                </span>
              )}
            </div>
          </div>
        )}

        {day.transport?.tip && (
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: {day.transport.tip}
          </p>
        )}

        {/* Accommodation */}
        {day.accommodation && day.accommodation.name && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border px-4 py-3">
            <Bed className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div>
              <p className="text-sm font-medium">{day.accommodation.name}</p>
              {day.accommodation.area && (
                <p className="text-xs text-muted-foreground">
                  {day.accommodation.area}
                  {day.accommodation.type
                    ? ` · ${day.accommodation.type}`
                    : ""}
                </p>
              )}
              {day.accommodation.reasoning && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {day.accommodation.reasoning}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
