const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    run: async ({client, interaction}) => {
        try {
            const queue = interaction.client.player.nodes.get(interaction.guild.id);
    
            if (!queue || !queue.isPlaying()) return await interaction.reply("No song is currently playing!");
                        
            await queue.node.skip();
                
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setDescription(`Skipped **[${queue.currentTrack.title}](${queue.currentTrack.url})** - ${queue.currentTrack.author}`)
                    .setThumbnail(queue.currentTrack.thumbnail)
                ]
            });
        } catch (error) {
            await interaction.reply(`There was an error skipping the song: ${error.message}`);
            console.log(error);
        }
    }
}