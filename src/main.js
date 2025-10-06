import './discord_players.js'
import { app, BrowserWindow } from 'electron'

// import { startDiscordBot} from './discord_players.js'
// import { app, BrowserWindow } from ('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}
console.log("hello")
app.whenReady().then(() => {
    createWindow()
})