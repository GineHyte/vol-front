var electronInstaller = require('electron-winstaller');

var settings = {
    appDirectory: './out/VolTechs-win32-x64',
    outputDirectory: './out/installers',
    setupIcon: './static/favicon.ico',
    authors: 'SKFX, LLC',
    exe: './VolTechs.exe',
    noMsi: true
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log('installers were created succesfully');
}, (e) => {
    console.log(e.message)
});