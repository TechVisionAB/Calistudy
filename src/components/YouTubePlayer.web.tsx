import { createElement } from 'react';

export function YouTubePlayer({ id }: { id: string }) {
  return createElement('iframe', {
    src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`,
    allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
    allowFullScreen: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    style: { border: 0, width: '100%', height: '100%' },
    title: 'YouTube',
  });
}
