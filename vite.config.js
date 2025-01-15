import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
  resolve: {
    alias: {
      "": path.join(__dirname, 'src/app')
    },
  },
  plugins: [sveltekit()],
};

export default config;
