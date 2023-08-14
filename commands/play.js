const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song from Spotify.")
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("search")
                .setDescription("Searches for a song on Spotify.")
                .addStringOption((option) => {
                    return option.setName("searchterms")
                        .setDescription("Search keywords for the song.")
                        .setRequired(true);
                })
        })
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("song")
                .setDescription("Plays a song from Spotify")
                .addStringOption((option) => {
                    return option.setName("url")
                        .setDescription("URL of the song.")
                        .setRequired(true);
                })
        })
        .addSubcommand((subcommand) => {
            return subcommand
                .setName("playlist")
                .setDescription("Plays a playlist from Spotify")
                .addStringOption((option) => {
                    return option.setName("url")
                        .setDescription("URL of the playlist.")
                        .setRequired(true);
                })
        }),
    run: async ({ client, interaction }) => {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        await interaction.deferReply();
        
        if (interaction.options.getSubcommand() === 'search') {
            try {
                const query = interaction.options.getString('searchterms', true);
                // Play track
                const { track } = await client.player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction, // we can access this metadata object using queue.metadata later on
                        searchEngine: QueryType.SPOTIFY_SEARCH
                    }
                });
    
                // Create embed with song information
                const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                    .setThumbnail(track.thumbnail)
                    .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });
    
                // Send embed
                return interaction.editReply({ embeds: [embed] });
            } catch (e) {
                // let's return error if something failed
                return interaction.editReply(`Something went wrong: ${e.message}`);
            }
        }
        else if (interaction.options.getSubcommand() === 'song') {
            try {
                const query = interaction.options.getString('url', true);
                // Play track
                const { track } = await client.player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction, // we can access this metadata object using queue.metadata later on
                        searchEngine: QueryType.SPOTIFY_SONG
                    }
                });
    
                // Create embed with song information
                const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                    .setThumbnail(track.thumbnail)
                    .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });
    
                // Send embed
                return interaction.editReply({ embeds: [embed] });
            } catch (e) {
                // let's return error if something failed
                return interaction.editReply(`Something went wrong: ${e.message}`);
            }
        }
        else if (interaction.options.getSubcommand() === 'playlist')
        {
            try {
                const query = interaction.options.getString('url', true);
                // Play track
                const { track } = await client.player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction, // we can access this metadata object using queue.metadata later on
                        searchEngine: QueryType.SPOTIFY_PLAYLIST
                    }
                });
    
                // Create embed with song information
                const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                    .setThumbnail(track.thumbnail)
                    .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });
    
                // Send embed
                return interaction.editReply({ embeds: [embed] });
            } catch (e) {
                // let's return error if something failed
                return interaction.editReply(`Something went wrong: ${e.message}`);
            }
        }
    }

}