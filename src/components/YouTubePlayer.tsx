import { WebView } from 'react-native-webview';

// Loading the embed through an HTML page with a real origin avoids YouTube's
// "video player configuration" error that bare embed URLs get inside a WebView.
const html = (id: string) => `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>html,body{margin:0;height:100%;background:#000}iframe{border:0;width:100%;height:100%}</style>
</head><body>
<iframe src="https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0&modestbranding=1&autoplay=1"
 allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
 referrerpolicy="strict-origin-when-cross-origin"></iframe>
</body></html>`;

export function YouTubePlayer({ id }: { id: string }) {
  return (
    <WebView
      source={{ html: html(id), baseUrl: 'https://calistudy.app' }}
      style={{ flex: 1, backgroundColor: '#000' }}
      allowsInlineMediaPlayback
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
    />
  );
}
