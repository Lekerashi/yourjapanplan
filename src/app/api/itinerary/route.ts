import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

// DB enum only has these values; honeymoon maps to couple
const VALID_TRAVEL_STYLES = [
  "solo",
  "couple",
  "friends",
  "family",
  "workcation",
];

function safeTravelStyle(style: string): string {
  if (VALID_TRAVEL_STYLES.includes(style)) return style;
  if (style === "honeymoon") return "couple";
  return "solo";
}

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
    builder_state,
    jr_pass_recommended,
    jr_pass_reasoning,
    total_budget_estimate,
    packing_tips,
    start_date,
    end_date,
  } = body;

  const share_token = crypto.randomUUID();

  const { data: itinerary, error: itineraryError } = await supabase
    .from("itineraries")
    .insert({
      user_id: user.id,
      title,
      status: "draft",
      travel_style: safeTravelStyle(travel_style),
      num_travelers: 1,
      total_budget_estimate,
      jr_pass_recommended,
      jr_pass_reasoning,
      share_token,
      is_public: false,
      start_date: start_date ?? null,
      end_date: end_date ?? null,
      preferences_snapshot: {
        preferences: {
          travel_style,
          interests,
          season,
          duration_days,
          budget,
          pace,
        },
        builder_state,
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
  const isPublicAccess = searchParams.get("public") === "true";

  // Fetch single itinerary by ID
  if (id) {
    // Public access — no auth needed, just check is_public flag
    if (isPublicAccess) {
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("id", id)
        .eq("is_public", true)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(data);
    }

    // Private access — requires auth + ownership
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

export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing itinerary id" },
      { status: 400 }
    );
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("itineraries")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
    builder_state,
    jr_pass_recommended,
    jr_pass_reasoning,
    total_budget_estimate,
    packing_tips,
    start_date,
    end_date,
  } = updateData;

  // Update itinerary row
  const { error: updateError } = await supabase
    .from("itineraries")
    .update({
      title,
      travel_style: safeTravelStyle(travel_style),
      total_budget_estimate,
      jr_pass_recommended,
      jr_pass_reasoning,
      start_date: start_date ?? null,
      end_date: end_date ?? null,
      preferences_snapshot: {
        preferences: {
          travel_style,
          interests,
          season,
          duration_days,
          budget,
          pace,
        },
        builder_state,
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
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Delete old days (cascade deletes activities too) and re-insert
  await supabase.from("itinerary_days").delete().eq("itinerary_id", id);

  if (days && days.length > 0) {
    const dayRows = days.map(
      (day: { day_number: number; theme: string; accommodation?: unknown }) => ({
        itinerary_id: id,
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

  return NextResponse.json({ id });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing itinerary id" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("itineraries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing itinerary id" },
      { status: 400 }
    );
  }

  // Only allow specific fields to be patched
  const allowedFields: Record<string, unknown> = {};
  if ("is_public" in fields) allowedFields.is_public = fields.is_public;
  if ("title" in fields) allowedFields.title = fields.title;

  const { error } = await supabase
    .from("itineraries")
    .update(allowedFields)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
