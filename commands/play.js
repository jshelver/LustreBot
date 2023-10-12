const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { QueryType } = require('discord-player')
import { isValidUrl, isSpotifyUrl, isSpotifyPlaylist, isYoutubeUrl, isYoutubePlaylist } from '../utils/validator';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song from Youtube/Spotify.")
        .addStringOption((option) => {
            return option.setName("searchterms")
                .setDescription("Search keywords for the song.")
                .setRequired(true);
        }),
    run: async ({ client, interaction }) => {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        // Delay response so error doesn't occur
        await interaction.deferReply();

        const query = interaction.options.getString("searchterms", true);

        if (isValidUrl(query)) {
            const url = new URL(query);

            // Spotify song/playlist url
            if (isSpotifyUrl(url)) {
                try {
                    // Play track
                    const { track } = await client.player.play(channel, query, {
                        nodeOptions: {
                            metadata: interaction, // we can access this metadata object using queue.metadata later on
                            searchEngine: isSpotifyPlaylist(url) ? QueryType.SPOTIFY_PLAYLIST : QueryType.SPOTIFY_SONG
                        }
                    });
    
                    // Create embed with song information
                    const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                        .setThumbnail(track.thumbnail)
                        .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });
        
                    // Send embed
                    return interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    // Let's return error if something failed
                    console.log(error);
                    return interaction.editReply(`Something went wrong: ${error.message}`);
                }
            }
            // Youtube song/playlist
            else if (isYoutubeUrl(url)) {
                try {
                    // Play track
                    const { track } = await client.player.play(channel, query, {
                        nodeOptions: {
                            metadata: interaction, // we can access this metadata object using queue.metadata later on
                            searchEngine: isYoutubePlaylist(url) ? QueryType.YOUTUBE_PLAYLIST : QueryType.YOUTUBE_VIDEO
                        }
                    });
    
                    // Create embed with song information
                    const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                        .setThumbnail(track.thumbnail)
                        .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });
        
                    // Send embed
                    return interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    // Let's return error if something failed
                    console.log(error);
                    return interaction.editReply(`Something went wrong: ${error.message}`);
                }
            }
            // Invalid url
            else {
                return interaction.editReply(`Invalid URL. This bot can only play songs from youtube and spotify.`);
            }
        }
        

        // Youtube search
        try {
            const query = interaction.options.getString('searchterms', true);
            // Play track
            const { track } = await client.player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction, // we can access this metadata object using queue.metadata later on
                    searchEngine: QueryType.YOUTUBE_SEARCH
                }
            });

            // Create embed with song information
            const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue.`)
                .setThumbnail(track.thumbnail)
                .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });

            // Send embed
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            // Let's return error if something failed
            return interaction.editReply(`Something went wrong: ${e.message}`);
        }
    }
}