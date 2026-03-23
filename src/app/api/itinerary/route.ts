import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    title,
    travel_style,
    season,
    duration_days,
    budget,
    pace,
    interests,
    destinations,
    days,
    jr_pass_recommended,
    jr_pass_reasoning,
    total_budget_estimate,
    packing_tips,
  } = body;

  const share_token = crypto.randomUUID();

  // Store the full generated plan in preferences_snapshot alongside preferences
  const { data: itinerary, error: itineraryError } = await supabase
    .from("itineraries")
    .insert({
      user_id: user.id,
      title,
      status: "draft",
      travel_style,
      num_travelers: 1,
      total_budget_estimate,
      jr_pass_recommended,
      jr_pass_reasoning,
      share_token,
      is_public: false,
      preferences_snapshot: {
        preferences: {
          travel_style,
          interests,
          season,
          duration_days,
          budget,
          pace,
        },
        generated_plan: {
          title,
          days,
          destinations,
          jr_pass_recommended,
          jr_pass_reasoning,
          total_budget_estimate,
          packing_tips,
        },
      },
    })
    .select("id")
    .single();

  if (itineraryError) {
    return NextResponse.json(
      { error: itineraryError.message },
      { status: 500 }
    );
  }

  // Insert days into itinerary_days table
  if (days && days.length > 0) {
    const dayRows = days.map(
      (day: {
        day_number: number;
        destination_slug: string;
        theme: string;
        accommodation?: {
          name?: string;
          area?: string;
          type?: string;
          reasoning?: string;
        };
      }) => ({
        itinerary_id: itinerary.id,
        day_number: day.day_number,
        notes: day.theme,
        accommodation_suggestion: day.accommodation ?? null,
      })
    );

    const { error: daysError } = await supabase
      .from("itinerary_days")
      .insert(dayRows);

    if (daysError) {
      return NextResponse.json({ error: daysError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    id: itinerary.id,
    share_token,
  });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");
  const shareToken = searchParams.get("share_token");

  // Fetch single itinerary by ID
  if (id) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // Public access via share token
  if (shareToken) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("share_token", shareToken)
      .eq("is_public", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // List authenticated user's itineraries
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("itineraries")
    .select(
      "id, title, status, created_at, share_token, is_public, travel_style, total_budget_estimate"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
