"use strict";

// Dependencies
const bottleneck = require("bottleneck")
const revolt = require("revolt.js")

// Variables
const thread = new bottleneck.default({
    minTime: 3 * 1000
})

const client = new revolt.Client()

// Functions
function deleteMessage(message){
    try{
        message.delete()
    }catch{
        thread.schedule(deleteMessage, message)
    }
}

// Main
client.on("ready", ()=>{
    console.log("Bot is running.")
})

client.on("message", async(message)=>{
    const messageArgs = message.content.split(" ")

    if(message.member.hasPermission(message.channel, ["ManageMessages"]) && messageArgs[0] === ";purge"){
        if(!messageArgs[1]) return message.channel.sendMessage("Please specify an amount of messages to purge. Max: 100")
        if(+messageArgs[1] > 100) return message.channel.sendMessage("Maximum message to purge is 100")

        try{
            (await message.channel.fetchMessages({ limit: +messageArgs[1] })).forEach((message)=>thread.schedule(deleteMessage, message))
        }catch{
            message.channel.sendMessage("Failed to purge messages.")
        }
    }
})

client.loginBot("")