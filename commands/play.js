const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { QueryType } = require('discord-player');
const { isValidUrl, isSpotifyUrl, isSpotifyPlaylist, isYoutubeUrl, isYoutubePlaylist } = require('../utils/validator');

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

        // Ensure bot has necessary permissions
        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply('I need the permissions to join and speak in your voice channel!');
        }

        // Delay response so error doesn't occur
        await interaction.deferReply();

        const query = interaction.options.getString("searchterms", true);

        if (isValidUrl(query)) {
            const url = new URL(query);

            // Spotify song/playlist url
            if (isSpotifyUrl(url)) {
                try {
                    // Play track
                    const { track, queue } = await client.player.play(channel, query, {
                        nodeOptions: {
                            metadata: interaction.channel, // we can access this metadata object using queue.metadata later on
                            initialVolume: 50, // Adjust volume as needed
                            bufferingTimeout: 5000, // Adjust buffering timeout as needed
                        },
                        searchEngine: isSpotifyPlaylist(url) ? QueryType.SPOTIFY_PLAYLIST : QueryType.SPOTIFY_SONG
                    });

                    // Create embed with playlist/song information
                    const embed = isSpotifyPlaylist(url) 
                        ? new EmbedBuilder().setDescription(`Added **[${track.playlist.title}](${track.playlist.url})** - ${track.playlist.author.name} to the queue from Spotify.`)
                            .setThumbnail(track.playlist.thumbnail)
                        : new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue from Spotify.`)
                            .setThumbnail(track.thumbnail)
                            .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });

                    // Send embed
                    return interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    console.log(error);
                    return interaction.editReply(`Something went wrong when trying to play the song/playlist from Spotify.`);
                }
            }
            // Youtube song/playlist
            else if (isYoutubeUrl(url)) {
                try {
                    // Play track
                    const { track, queue } = await client.player.play(channel, query, {
                        nodeOptions: {
                            metadata: interaction.channel, // we can access this metadata object using queue.metadata later on
                            initialVolume: 50, // Adjust volume as needed
                            bufferingTimeout: 5000, // Adjust buffering timeout as needed
                        },
                        searchEngine: isYoutubePlaylist(url) ? QueryType.YOUTUBE_PLAYLIST : QueryType.YOUTUBE_VIDEO
                    });

                    // Create embed with playlist/song information
                    const embed = isYoutubePlaylist(url) 
                        ? new EmbedBuilder().setDescription(`Added **[${track.playlist.title}](${track.playlist.url})** - ${track.playlist.author.name} to the queue from YouTube.`)
                            .setThumbnail(track.playlist.thumbnail)
                        : new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue from YouTube.`)
                            .setThumbnail(track.thumbnail)
                            .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });

                    // Send embed
                    return interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    console.log(error);
                    return interaction.editReply(`Something went wrong when trying to play the song/playlist url from Youtube.`);
                }
            }
            // Invalid url
            else {
                return interaction.editReply(`Invalid URL. This bot can only play songs from YouTube and Spotify.`);
            }
        }

        // Youtube search
        try {
            const query = interaction.options.getString('searchterms', true);
            // Play track
            const { track, queue } = await client.player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction.channel, // we can access this metadata object using queue.metadata later on
                    initialVolume: 50, // Adjust volume as needed
                    bufferingTimeout: 5000, // Adjust buffering timeout as needed
                },
                searchEngine: QueryType.YOUTUBE_SEARCH
            });

            // Create embed with song information
            const embed = new EmbedBuilder().setDescription(`Added **[${track.title}](${track.url})** - ${track.author} to the queue from YouTube.`)
                .setThumbnail(track.thumbnail)
                .addFields({ name: 'Duration', value: `${track.duration}`, inline: true });

            // Send embed
            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            return interaction.editReply(`Something went wrong when trying to play the song from YouTube search.`);
        }
    }
};
