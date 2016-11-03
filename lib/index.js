import SteamUser from 'steam-user'
import request from 'axios'
import express from 'express'

let app = express()
require('dotenv').config()
let client = new SteamUser()
let args = process.argv.slice(2)

client.logOn({
        "accountName": process.env.STEAMUSER,
        "password": process.env.PASSWORD,
        "twoFactorCode": args[0]
})

client.on('loggedOn', (details) => {
        console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID())
    if(process.env.MODE === 'dev') client.setPersona(SteamUser.EPersonaState.Online)
})

client.on('error', (e) => {
        console.log(e)
})

client.on('webSession', (sessionID, cookies) => {
        console.log("Got web session")
})

client.on('emailInfo', (address, validated) => {
        console.log("Our email address is " + address + " and it's " + (validated ? "validated" : "not validated"))
})

client.on('licenses', (licenses) => {
        console.log("Our account owns " + licenses.length + " license" + (licenses.length == 1 ? '' : 's') + ".")
})

app.post('/play/with/:secret', (req, res) => {
    if(req.params.secret == process.env.SECRET) {
        res.send('ok')
        client.gamesPlayed(require('../games.json'))
    } else {
        res.send('Wrong secret')
    }
})

app.post('/stop/with/:secret', (req, res) => {
    if(req.params.secret == process.env.SECRET) {
        res.send('ok')
        client.gamesPlayed()
    } else {
        res.send('Wrong secret')
    }
})

app.listen(process.env.PORT)