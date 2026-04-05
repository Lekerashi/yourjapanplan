import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Train } from "lucide-react";
import { INTEREST_TAGS, REGIONS, SEASONS } from "@/lib/constants";
import type { DestinationRow } from "@/lib/ai/destinations-context";

interface DestinationCardProps {
  destination: DestinationRow;
}

export function DestinationCard({ destination: d }: DestinationCardProps) {
  const region = REGIONS.find((r) => r.value === d.region);

  return (
    <Link href={`/destinations/${d.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        {d.image && (
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={d.image}
              alt={d.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {d.jr_accessible && (
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
                <Train className="h-3 w-3" />
                JR
              </div>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold group-hover:text-rose-600 transition-colors">
                {d.name}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {region?.label}
                  {region?.label_jp ? ` (${region.label_jp})` : ""}
                </span>
              </div>
            </div>
            {!d.image && d.jr_accessible && (
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <Train className="h-3 w-3" />
                JR
              </div>
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {d.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.tags.slice(0, 4).map((tag) => {
              const meta = INTEREST_TAGS.find((t) => t.value === tag);
              return (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {meta ? `${meta.icon} ${meta.label}` : tag}
                </Badge>
              );
            })}
            {d.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{d.tags.length - 4}
              </Badge>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Best in:</span>
            {d.best_seasons.map((s) => {
              const meta = SEASONS.find((ss) => ss.value === s);
              return (
                <span
                  key={s}
                  className="rounded bg-rose-50 px-1.5 py-0.5 font-medium text-rose-600"
                >
                  {meta?.label ?? s}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
