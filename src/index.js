require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');

const openai = new OpenAIApi(new Configuration ({
    apiKey: process.env.API_KEY,
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
    console.log(`Logged in as ${client.user.tag}`);
  });
  
  client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    switch (command) {
      case 'ask':
        openai.createCompletion({
          engine: 'davinci',
          prompt: args.join(' '),
          maxTokens: 1024,
          n: 1,
          stop: '\n',
        }).then(res => {
          console.log(res.choices[0].text);
          message.channel.send(res.choices[0].text);
        }).catch(err => {
          console.error(err);
          message.channel.send('There was an error processing your request.');
        });
        break;
      default:
        message.channel.send(`Unknown command: \`${command}\``);
        break;
    }
  });
  
  client.login(process.env.TOKEN);