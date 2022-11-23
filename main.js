//Importing Files For Bots Work

import "dotenv/config"; // Load Enviroment Variables.
import { createServer } from "http";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import Akinator from "./akinator.js";

//Requireing INTENTS And Partials
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"],
  },
  partials: PARTIALS,
  retryLimit: 3,
});


//Ready.JS Part In Here
client.on("ready", async () => {

  //Bot's Global (/) Command List
  const commands = [
    {
      name: "akinator",
      description: "Play Akinator Game! 🧞",
    },
  ];

  // Deploy Global (/) Commands
  await client.application.commands.set(commands);
});


//Main Code Of The Bot (Like app.js/index.js/server.js/bot.js)
client.on("interactionCreate", async (ctx) => {
  if (!ctx.isCommand()) return;
  if (ctx.commandName !== "akinator") return;

  await ctx.deferReply();


  // Setting Language Like en , English And tr , Turkish 👍
  const language = "en";
  const game = new Akinator(language);

  //Bots Start And Sending Process

  await game.start(); // Starting The Akinator Game 👌

  
  await ctx.editReply({
    components : [game.component], // Sending The Buttons Of The Embed  
    embeds: [game.embed], // Sending The Question Embed Of The Akinator Game
  });
  const filter = (intercation) => intercation.user.id === ctx.user.id; //Getting The User (I THi)
   const channel = await client.channels.fetch(ctx.channelId); // Getting Channel

  while (!game.ended) //Meaning : If The Game Not Ends Do It The Code Inside 
    // Asking Questions For The Game
    try { //Trying To Ask Question
      await game.ask(channel, filter); // Code Of Asking The Question Proccess
      if (!game.ended) //Meaning : If The Game Not Ends Do It The Code Inside 
        await ctx.editReply({
          embeds: [game.embed], // Sending The Question Embed .. Example : { The Charecter Is A YOUTUBER ? }
          components: [game.component], // Sending The Buttons Of The Question Options Like Yes , No , Myba
        });
    } catch (err) { //Else
      if (err instanceof Error) console.error(err); // If We Have A Error It Will Send The CONSOLE
      
      return await ctx.editReply({ 
        components: [],
        embeds: [],
        content: "This Command Is De-Active.", // If Anyone Not Answer It The Question In 1 Min It Will Say This Message 
        //To Edit Time Go akinator.js line 37 and 60_000 is 1 min / 30_000 30 sec ( LIKE THAT )
      });
    }

  await game.stop(); //Stoping The Fame
  await ctx.editReply({ components: [], embeds: [game.embed] }); //Sending The Answer
});


//Bot's Login Online Go To .env File And Write Your Token
client.login(process.env.TOKEN || null).then((_) => { //Logining The Token To Get Online The Bot
    console.log("[LOGIN] Succesfully Logined");
}).catch((e) => {
    console.log("[ERROR] Your Token Is Not Right Or INTENT'S Are Off!!."); // The Error Of Not Getting Loginned
});