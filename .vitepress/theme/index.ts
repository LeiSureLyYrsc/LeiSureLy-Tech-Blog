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
    name: 'キズナヒトツ(一丝羁绊)',
    author: '山本希望',
    file: 'https://music.163.com/song/media/outer/url?id=413077159.mp3',
  },
  {
    name: 'ふたつの影(二人的映影)',
    author: 'Famishin / 春風まゆき',
    file: 'https://music.163.com/song/media/outer/url?id=473403185.mp3',
  },
  {
    name: '我简直就是有地将臣！',
    author: '凡思特 / 喜欢咩噶内烧酒',
    file: 'https://music.163.com/song/media/outer/url?id=2118561956.mp3',
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
