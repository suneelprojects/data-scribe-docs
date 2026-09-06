import poster00 from "@/assets/instagram-fallback/00.jpg?inline";
import poster01 from "@/assets/instagram-fallback/01.jpg?inline";
import poster02 from "@/assets/instagram-fallback/02.jpg?inline";
import poster03 from "@/assets/instagram-fallback/03.jpg?inline";
import poster04 from "@/assets/instagram-fallback/04.jpg?inline";
import poster05 from "@/assets/instagram-fallback/05.jpg?inline";
import poster06 from "@/assets/instagram-fallback/06.jpg?inline";
import poster07 from "@/assets/instagram-fallback/07.jpg?inline";
import poster08 from "@/assets/instagram-fallback/08.jpg?inline";
import poster09 from "@/assets/instagram-fallback/09.jpg?inline";
import poster10 from "@/assets/instagram-fallback/10.jpg?inline";
import poster11 from "@/assets/instagram-fallback/11.jpg?inline";
import poster12 from "@/assets/instagram-fallback/12.jpg?inline";
import poster13 from "@/assets/instagram-fallback/13.jpg?inline";
import poster14 from "@/assets/instagram-fallback/14.jpg?inline";
import poster15 from "@/assets/instagram-fallback/15.jpg?inline";
import poster16 from "@/assets/instagram-fallback/16.jpg?inline";
import poster17 from "@/assets/instagram-fallback/17.jpg?inline";
import poster18 from "@/assets/instagram-fallback/18.jpg?inline";
import poster19 from "@/assets/instagram-fallback/19.jpg?inline";
import poster20 from "@/assets/instagram-fallback/20.jpg?inline";
import poster21 from "@/assets/instagram-fallback/21.jpg?inline";
import poster22 from "@/assets/instagram-fallback/22.jpg?inline";
import poster23 from "@/assets/instagram-fallback/23.jpg?inline";
import poster24 from "@/assets/instagram-fallback/24.jpg?inline";
import poster25 from "@/assets/instagram-fallback/25.jpg?inline";
import poster26 from "@/assets/instagram-fallback/26.jpg?inline";
import poster27 from "@/assets/instagram-fallback/27.jpg?inline";
import poster28 from "@/assets/instagram-fallback/28.jpg?inline";
import poster29 from "@/assets/instagram-fallback/29.jpg?inline";

const POSTERS = [
  poster00,
  poster01,
  poster02,
  poster03,
  poster04,
  poster05,
  poster06,
  poster07,
  poster08,
  poster09,
  poster10,
  poster11,
  poster12,
  poster13,
  poster14,
  poster15,
  poster16,
  poster17,
  poster18,
  poster19,
  poster20,
  poster21,
  poster22,
  poster23,
  poster24,
  poster25,
  poster26,
  poster27,
  poster28,
  poster29,
] as const;

function dateOnlyUtc(value: string) {
  return Date.parse(`${value}T00:00:00.000Z`);
}

export function fallbackPosterBytes(dateOrSlot: string | number, requestedSlot?: number) {
  // Keep the previous one-argument call valid while Lovable synchronizes the
  // server and poster files across consecutive GitHub commits.
  const legacyCall = typeof dateOrSlot === "number";
  const slot = legacyCall ? dateOrSlot : (requestedSlot ?? 0);
  const dayNumber = legacyCall ? 0 : Math.floor(dateOnlyUtc(dateOrSlot) / 86_400_000);
  const cursor = dayNumber * 4 + slot;
  const index = ((cursor % POSTERS.length) + POSTERS.length) % POSTERS.length;
  const dataUrl = POSTERS[index];
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Uint8Array.from(Buffer.from(base64, "base64"));
}
