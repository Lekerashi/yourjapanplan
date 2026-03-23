import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed } from "lucide-react";

interface Zone {
  name: string;
  description: string;
  best_for: string[];
}

interface AccommodationZonesProps {
  zones: Zone[];
}

export function AccommodationZones({ zones }: AccommodationZonesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {zones.map((zone) => (
        <Card key={zone.name} size="sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bed className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                <h4 className="font-semibold">{zone.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {zone.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {zone.best_for.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
