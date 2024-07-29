// Define what links an image could be in
const links = /(images-ext-1.discordapp.net\/external\/)|(cdn.discordapp.com\/attachments\/)|(media.discordapp.net\/attachments\/)/;

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

//const { Predict } = import('./test.mjs').then(module => module);
let Predict;
import('./test.mjs').then(test => {Predict = test.Predict;});

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)

//client.once(Events.ClientReady, c => {
//      console.log(`Ready! Logged in as ${c.user.tag}`);
//});

setInterval(() => { client.user.setStatus('invisible');
                                        console.log("Heartbeat");
                                        // Keep the HF Space active by sending it something
                                        Predict("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png",0.4,0.5);
}, 60 * 60 * 1000);

client.on('ready', async() => {
        client.user.setStatus('invisible');
        console.log('Ready! Logged in as ' + client.user.tag);
});

client.on("messageCreate", (message) =>
{
        if (message.channelId != '852249289304703046' || message.author.id == '414457143199006732')
                return; // Only check messages from this channel
        console.log(message.createdAt + ' ' + message.author.username + ': ' + message.content);
        try {
        if (message.embeds.length > 0)
        {
        message.embeds.forEach(embed => {
                console.log("Embed found!");
                if (embed.data.image)
                {
                const url = embed.data.image.url;
                Predict(url,0.4,0.5).then((result) => {
                        if (result=="Anime detected")
                        {
                                message.delete().then(msg => console.log(`Deleted message from ${msg.author.username}`))
                                .catch(console.error);
                                return;
                        }
                        else
                        {
                                console.log("Embed clean");
                        }
                });
                }
                else
                {
                        console.log("No valid image url.");
                }
        });
        }
        } catch (error) {
                console.error(error);
        }

        if (message.attachments.size > 0)
        {
        message.attachments.forEach(attachment => {
                console.log("Attachment found!");
                if (attachment.contentType.split("/")[0] == "image")
                {
                        console.log("Attachment is an image!");
                try
                {
                const url = attachment.url;
                Predict(url,0.4,0.5).then((result) => {
                        if (result=="Anime detected")
                        {
                                message.delete().then(msg => console.log(`Deleted message from ${msg.author.username}`))
                                .catch(console.error);
                                return;
                        }
                        else
                        {
                                console.log("Attachment clean");
                        }
                });
                } catch (error)
                {
                        console.error(error);
                }
        }
        });
        }

        if (links.test(message.content))
        {
        var splits = message.content.split(' ');
        for (element in splits)
        {
        index = splits.findIndex((element) => links.test(element));
        // If index < 0, it hasn't found any matches
        if (index < 0)
                break; // Break
        console.log('Link detected!');
        url = splits[index];
        try
        {
        Predict(url,0.4,0.5).then((result) => {
                        if (result=="Anime detected")
                        {
                                message.delete().then(msg => console.log(`Deleted message from ${msg.author.username}`))
                                .catch(console.error);
                                return;
                        }
                        else
                        {
                                console.log("Link clean");
                        }
                });
        splits.splice(index,1);
        } catch (error)
        {
                console.error(error);
        }


        }
        }
});


// Log in to Discord with your client's token
client.login(token);
