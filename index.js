require("dotenv").config()

const { Client, IntentsBitField } = require("discord.js")
const { CommandKit } = require("commandkit")
const { Player } = require("discord-player")
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const path = require("path");

async function main() {
    const client = new Client({
        intents: [ IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildVoiceStates ]
        });
    
    new CommandKit({
        client: client,
        commandsPath: path.join(__dirname, "commands"),
        eventsPath: path.join(__dirname, "events"),
        devGuildIds: [process.env.GUILD_ID]
    });
    
    client.player = new Player(client);

    await client.player.extractors.register(SpotifyExtractor, {});
    await client.player.extractors.register(SoundCloudExtractor, {});

    client.login(process.env.TOKEN);
}

main();