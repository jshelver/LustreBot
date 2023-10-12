const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
    run: async ({client, interaction}) => {
        await interaction.deferReply();

        try {
            const queue = interaction.client.player.nodes.get(interaction.guild.id);

            if (!queue || queue.tracks.toArray().length < 1) return await interaction.editReply("The queue is empty!");

            queue.tracks.shuffle();
            const tracksQueue = queue.tracks.toArray();
            
            let description = "";
            for (let i = 0; i < tracksQueue.length; i++) {
                const track = tracksQueue[i];
                description += `${i+1}. ${track.title} - ${track.author} \n`;
            }
            
            let embed = new EmbedBuilder()
                .setTitle(`Successfully shuffled queue for ${interaction.guild.name}`)
                .setDescription(description);

            return await interaction.editReply({ embeds: [embed] })
        } catch (error) {
            console.log(error);
            return await interaction.editReply(`There was an error shuffling the queue: ${error.message}`);
        }
    }
}