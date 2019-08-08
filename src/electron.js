const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow = null

const width = 900
const height = 680

const createWindow = () => {
  mainWindow = new BrowserWindow({ width, height })
  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})
