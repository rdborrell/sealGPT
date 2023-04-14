require('dotenv').config();

const {Client, IntentsBitField} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');

const openai = new OpenAIApi(new Configuration ({
    organization: process.env.ORG,
    apiKey: process.env.API_KEY
}))

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const prefix = '!';

client.on('ready', () => {
    console.log(`${client.user.tag} is ready >:)`);
  });
  
  client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    switch (command) {
      case 'ask':
        openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{role: "user", content: args.join(' ')}],
        }).then(res => {
          console.log(res.data.choices[0].message.content);
          message.channel.send(res.data.choices[0].message.content);
        })
        break;
      case 'help':
        message.channel.send('Use !ask to ask sealGPT anything!');
        break;
      case 'pet':
        message.channel.send('Thank you :)');
        break;
      default:
        message.channel.send(`Unknown command: \`${command}\``);
        break;
    }
  });

  
  
  client.login(process.env.TOKEN);