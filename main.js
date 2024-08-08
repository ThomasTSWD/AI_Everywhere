const { app, BrowserWindow, globalShortcut, Menu, screen, BrowserView } = require('electron');

let mainWindow;
let isFollowingCursor = true;


const views = {};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            ignoreCertificateErrors: true,
            alwaysOnTop: true,
        },
        icon: 'assets/icon.png'
    });

    // Création des BrowserView pour chaque page
    views['webGpt'] = new BrowserView();
    views['chatGpt'] = new BrowserView();
    views['Mistral'] = new BrowserView();
    views['Claude'] = new BrowserView();
    views['Otio'] = new BrowserView();
    views['Perplexity'] = new BrowserView();
    views['Huggingface'] = new BrowserView();
    views['customUrl'] = new BrowserView();

    // Charger les URL dans les vues respectives
    views['webGpt'].webContents.loadURL(`file://${__dirname}/gpt/index.html`);
    views['chatGpt'].webContents.loadURL(`https://chat.openai.com/`);
    views['Mistral'].webContents.loadURL(`https://chat.mistral.ai/`);
    views['Claude'].webContents.loadURL(`https://claude.ai/`);
    views['Otio'].webContents.loadURL(`https://app.otio.ai/`);
    views['Perplexity'].webContents.loadURL(`https://www.perplexity.ai/collections/Rdaction-Email-_ue7BZDJR9iEKpi9Htpcxg`);
    views['Huggingface'].webContents.loadURL(`https://huggingface.co/chat/`);
    views['customUrl'].webContents.loadURL(`file://${__dirname}/url/index.html`);

    const menuOptions = [
        { label: 'ChatGPT (3.5)', view: 'chatGpt' },
        { label: 'WebGPT (API)', view: 'webGpt' },
        { label: 'Mistral (FR)', view: 'Mistral' },
        { label: 'Claude (PDF, IMG)', view: 'Claude' },
        { label: 'Huggingface (GPT\'S)', view: 'Huggingface' },
        { label: 'Otio (URL)', view: 'Otio' },
        { label: 'Perplexity (Mail, Search)', view: 'Perplexity' },
        { label: 'URL', view: 'customUrl' },
    ];



    mainWindow.setBrowserView(views['chatGpt']);
    views['chatGpt'].setBounds({ x: 0, y: 0, width: 700, height: 800 });
    mainWindow.on('resize', () => {
        const { width, height } = mainWindow.getContentBounds();
        Object.values(views).forEach(view => {
            view.setBounds({ x: 0, y: 0, width, height });
        });
    });
    mainWindow.setAlwaysOnTop(true);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    setInterval(followCursor, 10);


    // Création du sous-menu pour les vues spécifiques
    const intelligenceSubMenu = menuOptions.map(option => ({
        label: option.label,
        click: () => loadView(option.view)
    }));
    // Menu principal
    const mainMenu = Menu.buildFromTemplate([
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'togglefullscreen' },
                { role: 'toggledevtools' },
                { role: 'quit' },
                { type: "separator" },
                { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" }
            ]
        },

        {
            label: 'Intelligence',
            submenu: intelligenceSubMenu
        }
    ]);
    Menu.setApplicationMenu(mainMenu);
}

function followCursor() {
    if (isFollowingCursor) {
        const { x, y } = screen.getCursorScreenPoint();
        mainWindow.setPosition(x + 10, y + 10);
    }
}

function loadView(viewName) {
    if (views[viewName]) {
        mainWindow.setBrowserView(views[viewName]);
        mainWindow.on('resize', () => {
            const { width, height } = mainWindow.getContentBounds();
            views[viewName].setBounds({ x: 0, y: 0, width, height });
        });
        const { width, height } = mainWindow.getContentBounds();
        views[viewName].setBounds({ x: 0, y: 0, width, height });
    }
}





app.on('ready', () => {
    createWindow();
    globalShortcut.register('Ctrl+Space', () => {
        isFollowingCursor = !isFollowingCursor;
        if (mainWindow.isAlwaysOnTop()) {
            mainWindow.setAlwaysOnTop(false);
        } else {
            mainWindow.setAlwaysOnTop(true);
        }
    });

});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
