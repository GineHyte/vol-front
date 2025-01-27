Remove-Item -Recurse -Force out; `
Remove-Item -Recurse -Force .svelte-kit; `
npm i; `
npm run build:svelte; `
npm run build:electron; `
node ./buildwinstaller.cjs;
