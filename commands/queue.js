const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the queue.'),
    run: async ({client, interaction}) => {
        await interaction.deferReply();

        try {
            const queue = interaction.client.player.nodes.get(interaction.guild.id);

            if (!queue) return await interaction.editReply("The queue is empty!");

            const tracksQueue = queue.tracks.toArray();
            
            let description = "";
            for (let i = 0; i < tracksQueue.length; i++) {
                const track = tracksQueue[i];
                description += `${i+1}. ${track.title} - ${track.author} \n`;
            }
            
            let embed = new EmbedBuilder()
                .setTitle(`Queue for ${interaction.guild.name}`)
                .setDescription(description);

            return await interaction.editReply({ embeds: [embed] })
        } catch (error) {
            console.log(error);
            return await interaction.editReply(`There was an error displaying the queue: ${error.message}`);
        }
    }
}