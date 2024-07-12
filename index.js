require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const { CommandKit } = require("commandkit");
const { Player } = require("discord-player");
const { SpotifyExtractor } = require('@discord-player/extractor');
const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const path = require("path");

async function main() {
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildVoiceStates
        ]
    });

    new CommandKit({
        client: client,
        commandsPath: path.join(__dirname, "commands"),
        eventsPath: path.join(__dirname, "events"),
        devGuildIds: [process.env.GUILD_ID]
    });

    client.player = new Player(client);

    client.player.events.on('error', (queue, error) => {
        // Emitted when the player queue encounters error
        console.log(`General player error event: ${error.message}`);
        console.log(error);
    });
    
    client.player.events.on('playerError', (queue, error) => {
        // Emitted when the audio player errors while streaming audio track
        console.log(`Player error event: ${error.message}`);
        console.log(error);
    });

    await client.player.extractors.register(YoutubeiExtractor, {});
    await client.player.extractors.register(SpotifyExtractor, {
        createStream: createYoutubeiStream
    });

    client.login(process.env.TOKEN);
}

main();