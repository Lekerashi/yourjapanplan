"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Train, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { TRANSPORT_ROUTES, JR_PASS_PRICES } from "@/lib/data/transport-routes";

const ROUTES = TRANSPORT_ROUTES.map((r) => ({
  from: r.from_name,
  to: r.to_name,
  cost: r.cost_jpy,
  duration: r.duration,
  line: r.primary_method,
}));

interface SelectedRoute {
  id: number;
  from: string;
  to: string;
  cost: number;
  duration: string;
  roundTrip: boolean;
}

export function JRPassCalculator() {
  const [selectedRoutes, setSelectedRoutes] = useState<SelectedRoute[]>([]);
  const [passType, setPassType] = useState<"7-day" | "14-day" | "21-day">(
    "7-day"
  );

  const addRoute = (route: (typeof ROUTES)[number]) => {
    setSelectedRoutes((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: route.from,
        to: route.to,
        cost: route.cost,
        duration: route.duration,
        roundTrip: false,
      },
    ]);
  };

  const removeRoute = (id: number) => {
    setSelectedRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRoundTrip = (id: number) => {
    setSelectedRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, roundTrip: !r.roundTrip } : r))
    );
  };

  const totalCost = useMemo(
    () =>
      selectedRoutes.reduce(
        (sum, r) => sum + r.cost * (r.roundTrip ? 2 : 1),
        0
      ),
    [selectedRoutes]
  );

  const passCost = JR_PASS_PRICES[passType].ordinary;
  const savings = totalCost - passCost;
  const isWorthIt = savings > 0;

  return (
    <div className="space-y-8">
      {/* Pass type selector */}
      <div>
        <h2 className="font-semibold">Select Pass Duration</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(JR_PASS_PRICES) as (keyof typeof JR_PASS_PRICES)[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setPassType(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  passType === type
                    ? "bg-rose-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type} — ¥{JR_PASS_PRICES[type].ordinary.toLocaleString()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Route list */}
      <div>
        <h2 className="font-semibold">Add Your Routes</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ROUTES.map((route, i) => (
            <button
              key={i}
              onClick={() => addRoute(route)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              <span className="flex-1">
                {route.from}{" "}
                <ArrowRight className="inline h-3 w-3 text-muted-foreground" />{" "}
                {route.to}
              </span>
              <span className="text-muted-foreground">
                ¥{route.cost.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Selected routes */}
      {selectedRoutes.length > 0 && (
        <div>
          <h2 className="font-semibold">Your Journey</h2>
          <div className="mt-3 space-y-2">
            {selectedRoutes.map((route) => (
              <div
                key={route.id}
                className="flex items-center gap-3 rounded-lg border px-4 py-3"
              >
                <Train className="h-4 w-4 shrink-0 text-rose-500" />
                <div className="flex-1">
                  <span className="font-medium">
                    {route.from} → {route.to}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {route.duration}
                  </span>
                </div>
                <button
                  onClick={() => toggleRoundTrip(route.id)}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    route.roundTrip
                      ? "bg-rose-100 text-rose-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {route.roundTrip ? "Round trip" : "One way"}
                </button>
                <span className="text-sm font-medium">
                  ¥{(route.cost * (route.roundTrip ? 2 : 1)).toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => removeRoute(route.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {selectedRoutes.length > 0 && (
        <Card
          className={
            isWorthIt
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-amber-200 bg-amber-50/50"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isWorthIt ? (
                <>
                  <Check className="h-5 w-5 text-emerald-600" />
                  JR Pass is worth it!
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  JR Pass may not be worth it
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Individual tickets
                </p>
                <p className="text-xl font-bold">
                  ¥{totalCost.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {passType} JR Pass
                </p>
                <p className="text-xl font-bold">
                  ¥{passCost.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isWorthIt ? "You save" : "Extra cost"}
                </p>
                <p
                  className={`text-xl font-bold ${isWorthIt ? "text-emerald-600" : "text-amber-600"}`}
                >
                  ¥{Math.abs(savings).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {isWorthIt
                ? "The JR Pass covers all your Shinkansen rides plus unlimited local JR trains, buses, and the Miyajima ferry. Great value for your route!"
                : "You might save money buying individual tickets. Consider the JR Pass only if you plan additional day trips by JR trains."}
            </p>
            <div className="mt-3">
              <Badge variant="outline">
                Prices are approximate and may vary
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedRoutes.length === 0 && (
        <div className="text-center py-8">
          <Train className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-muted-foreground">
            Add routes above to see if the JR Pass is worth it for your trip.
          </p>
        </div>
      )}
    </div>
  );
}
