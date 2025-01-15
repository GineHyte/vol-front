npm i & ^
set CI=0 & ^
npm run build:svelte & ^
npm run package & ^
node ./buildwinstaller.cjs