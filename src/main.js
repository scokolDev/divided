//import './discord_players.js'
import { app, BrowserWindow } from 'electron'

// import { startDiscordBot} from './discord_players.js'
// import { app, BrowserWindow } from ('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('src/UI/pages/index.html')
  win.webContents.openDevTools();
}
console.log("hello")
app.whenReady().then(() => {
    createWindow()
})