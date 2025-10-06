import discord from 'discord.js'
import dotEnv from 'dotenv'
import {joinVoiceChannel } from '@discordjs/voice'

dotEnv.config(); //todo: deprecate

const botPresence = {
    "activities": [{
        "name": "Divided!",
        "type": 0
    }]
    //,
    //"status": "online",
    //"since": 1,
    //"afk": false
}

class discordAPI{
    constructor(p1ID, p2ID, p3ID, p4ID,
        token=process.env.TOKEN, 
        serverID=process.env.DIS_SERVER_ID,
        voiceServerID=process.env.DIS_CHANNEL_ID
    ){
        //map of last entered player answers
        this.playerAnswers = new Map([[p1ID, null], [p2ID, null], [p3ID, null], [p4ID, null]]);

        //login to discord bot and set presence
        this.client = new discord.Client({ 
            intents: 641,
            presence: botPresence
        });
        this.client.login(token);

        //connect voice
        this.client.once('ready', () => {
            const myGuild = client.guilds.cache.get(serverID);
            const connection = joinVoiceChannel({
                channelId: voiceServerID,
                guildId: myGuild.id,
                adapterCreator: myGuild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false,
            });

            this.audio = connection.receiver.speaking;
        });

        //set player message
        this.client.on("messageCreate", function incoming(data){
            if(this.playerAnswers.has(data.author.id)){
                this.playerAnswers.set(data.author.id, data.content)
            }
        });
    }

    getLastPlayerAnswers(){return this.playerAnswers}

    getSpeakingStatus(){
        return new Map([
            [p1ID, (this.audio.users.get(p1ID) ? true : false)], 
            [p2ID, (this.audio.users.get(p2ID) ? true : false)], 
            [p3ID, (this.audio.users.get(p3ID) ? true : false)], 
            [p4ID, (this.audio.users.get(p4ID) ? true : false)]]);
    }
}

export default discordAPI