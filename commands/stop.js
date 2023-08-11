const { SlashCommandBuilder } = require('@discordjs/builders');
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Disconnects the bot from the voice channel.'),
    run: async ({client, interaction}) => {
        try{
            const queue = interaction.client.player.nodes.get(interaction.guild.id)

            if (!queue || !queue.isPlaying()) return await interaction.reply("No song is currently playing!");

            // Delete queue
            interaction.client.player.nodes.delete(interaction.guild.id);
            await interaction.reply("Left the voice channel!")
        } catch (error) {
            await interaction.reply(`There was an error disconnecting from the voice channel: ${error.message}`);
        }
    }   
}