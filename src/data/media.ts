import { Anim, ANIM_BY_ID, LEVEL_ANIM } from './animations';
import { LADDER_BY_ID } from './ladders';
import VIDEOS from './videos.json';

export type Video = { id: string; title: string; channel: string };

const videos = VIDEOS as Record<string, Video>;

export type Media = { video?: Video & { key: string }; anim?: Anim };

/**
 * Demo media for a level code (e.g. "PL1") or an exercise key (e.g. "calf").
 * For ladder levels without their own video, the closest easier level's video is used
 * (media.video.key tells which level it shows).
 */
export function mediaFor(key: string): Media {
  const ladder = Object.values(LADDER_BY_ID).find((l) => l.levels.some((x) => x.code === key));
  const candidates = ladder
    ? ladder.levels
        .slice(0, ladder.levels.findIndex((x) => x.code === key) + 1)
        .map((x) => x.code)
        .reverse()
    : [key];
  const vKey = candidates.find((c) => videos[c]);
  // Animations are only shown for an exact match — a neighbouring level's movement would mislead.
  const aKey = LEVEL_ANIM[key] ?? (ANIM_BY_ID[key] ? key : undefined);
  return {
    video: vKey ? { ...videos[vKey], channel: videos[vKey].channel.trim(), key: vKey } : undefined,
    anim: aKey ? ANIM_BY_ID[aKey] : undefined,
  };
}

export function hasMedia(key?: string): boolean {
  if (!key) return false;
  const m = mediaFor(key);
  return !!(m.video || m.anim);
}

export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
