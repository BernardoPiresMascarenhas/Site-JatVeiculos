import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { type MediaSlot, type MediaSlotId, mediaSlots } from "@/config/media";

/** Verifica, no build, se um arquivo existe em /public. */
export function publicFileExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath));
}

export type ResolvedMedia =
  | { status: "real"; src: string; alt: string; slot: MediaSlot }
  | { status: "fallback"; src: string; alt: string; caption: string; slot: MediaSlot }
  | { status: "pending"; slot: MediaSlot };

export function resolveMedia(id: MediaSlotId): ResolvedMedia {
  const slot: MediaSlot = mediaSlots[id];
  if (publicFileExists(slot.file)) return { status: "real", src: slot.file, alt: slot.alt, slot };
  if (slot.fallback) return { status: "fallback", ...slot.fallback, slot };
  return { status: "pending", slot };
}
