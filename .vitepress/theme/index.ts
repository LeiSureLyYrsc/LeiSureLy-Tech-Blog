import Theme from "vitepress/theme";
import Archives from "./components/Archives.vue";
import Tags from "./components/Tags.vue";
import MyLayout from "./components/MyLayout.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";
import vitepressMusic from "vitepress-plugin-music";
import "vitepress-plugin-music/lib/css/index.css";

import "./custom.css";

const playlist = [
  {
    name: '以恋结缘(Piano Version)',
    author: 'Famishin / Angel Note',
    file: 'https://music.163.com/song/media/outer/url?id=473403174.mp3',
  },
  {
    name: 'song2',
    author: 'author2',
    file: 'https://***.***.***/song2.mp3',
    hide: true
  },
]

export default {
  extends: Theme,
  Layout: MyLayout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component("Archives", Archives);
    app.component("Tags", Tags);
    app.use(TwoslashFloatingVue);
    vitepressMusic(playlist);
  },
};
