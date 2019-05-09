// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
        
        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {            
            // pick suggested actions
            await this.pickSuggestedActions(context);            

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                const welcomeMessage = `Welcome to suggestedActionsBot ${ activity.membersAdded[idx].name }. ` +
                    `This bot will introduce you to Suggested Actions. ` +
                    `Please select an option.`;
                await turnContext.sendActivity(welcomeMessage);
                await this.sendSuggestedActions(turnContext);
            }
        }
    }

    async sendSuggestedActions(turnContext) {
        var actionOptions = ['Red', 'Yellow', 'Blue'];
        var reply = MessageFactory.suggestedActions(actionOptions, 'What is the best color?');
        reply.channelData = {chatBox: 'disable'};
        await turnContext.sendActivity(reply);
    }

    async pickSuggestedActions(turnContext) {
        const text = turnContext.activity.text;

        if (text === "Red") {
            await turnContext.sendActivity(`I agree, ${ text } is the best color.`);
            await this.sendSuggestedActions(turnContext);
        } else if (text === "actions") {            
            await this.sendSuggestedActions(turnContext);
        } else {
            if(text !== "actions"){
                await turnContext.sendActivity(`you typed ${text} .. what's next?`);
            }
            await turnContext.sendActivity(`Please type your query.\n If wanted actions again, type 'actions'.`);
            
            var disableReply = MessageFactory.text('');
            disableReply.channelData = {chatBox: 'enable'};
            await turnContext.sendActivity(disableReply);
        }
    }
}

module.exports.MyBot = MyBot;
