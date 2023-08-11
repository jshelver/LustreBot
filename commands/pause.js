const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song.'),
    run: async ({client, interaction}) => {
        try {
            const queue = interaction.client.player.nodes.get(interaction.guild.id)

            if (!queue || !queue.isPlaying()) return await interaction.reply("No song is currently playing!");

            queue.node.setPaused(true)

            return await interaction.reply({ embeds: [new EmbedBuilder()
                .setDescription(`Paused playing **[${queue.currentTrack.title}](${queue.currentTrack.url})** - ${queue.currentTrack.author}`)
                .setThumbnail(queue.currentTrack.thumbnail)
                ] 
            })
        } catch (error) {
            return await interaction.reply(`There was an error pausing the song: ${error.message}`);
        }
    }
}