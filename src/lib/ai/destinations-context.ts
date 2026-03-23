/**
 * Formats destination data from the database into a text context
 * that can be passed to the AI prompt.
 *
 * When Supabase is connected, this will query the real database.
 * For now, it uses the seed data directly.
 */

export interface DestinationRow {
  slug: string;
  name: string;
  region: string;
  description: string;
  highlights: string[];
  best_seasons: string[];
  crowd_level_by_month: Record<string, number>;
  tags: string[];
  jr_accessible: boolean;
  reservation_tips: string;
  accommodation_zones: { name: string; description: string; best_for: string[] }[];
}

export function formatDestinationsForPrompt(destinations: DestinationRow[]): string {
  return destinations
    .map((d) => {
      const zones = d.accommodation_zones
        .map((z) => `  - ${z.name}: ${z.description} (best for: ${z.best_for.join(", ")})`)
        .join("\n");

      return [
        `### ${d.name} (${d.region})`,
        `Slug: ${d.slug}`,
        d.description,
        `Tags: ${d.tags.join(", ")}`,
        `Best seasons: ${d.best_seasons.join(", ")}`,
        `Highlights: ${d.highlights.join(", ")}`,
        `JR accessible: ${d.jr_accessible ? "Yes" : "No"}`,
        d.reservation_tips ? `Reservation tips: ${d.reservation_tips}` : "",
        zones ? `Where to stay:\n${zones}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
}
