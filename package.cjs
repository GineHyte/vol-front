const packager = require('electron-packager');

async function buildAllThing(options) {
    const appPaths = await packager(options);
    console.log('electron app bundle created')
}

let woptions = {
    appBundleId: "com.vol-techs.app",
    executableName: "VolTechs",
    dir: ".",
    icon: "./src/assets/icon",
    ignore: [
        "^/[.]github$",
        "^/[.]vscode$",
        "^/[.]gitignore$",
        "^/[.]git$",
        "^/[.]yarn$",
        "^/[.]yarnrc$",
        "^/nodemon[.]json$",
        "^/yarn[.]lock$",
        "^/out$",
        "^/dist$",
        "^/examples$",
        "^/node_modules/[.]cache",
    ],
    derefSymlinks: true,
    junk: true,
    name: "VolTechs",
    out: "./out/",
    overwrite: true,
    // "all": true
}

buildAllThing(woptions);