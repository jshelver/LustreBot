const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('Displays info about the current song.'),
    run: async ({client, interaction}) => {
        try {
            const queue = interaction.client.player.nodes.get(interaction.guild.id)

            if (!queue || !queue.isPlaying()) return await interaction.reply("No song is currently playing!");

            return await interaction.reply({ embeds: [new EmbedBuilder()
                .setDescription(`Currently playing **[${queue.currentTrack.title}](${queue.currentTrack.url})** - ${queue.currentTrack.author}`)
                .setThumbnail(queue.currentTrack.thumbnail)
                .addFields({ name: 'Duration', value: `${queue.currentTrack.duration}`, inline: true })
                ]
            })
        } catch (error) {
            return await interaction.reply(`There was an error getting the song info: ${error.message}`);
        }
    }
}