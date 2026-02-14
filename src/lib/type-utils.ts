import { Media } from "@/payload-types";

export function getMedia(
    data?: number | null | Media
): Media | null {
    if (!data || typeof data === "number") {
        return null;
    }

    return data as Media;
}
