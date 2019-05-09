# suggest-text-chat-bot

This projectory holds sample for both client and service applications. It helps provide a mechanism on client end by which we can toggle to have user input `enabled` (when service replies for input request) or `disabled` (when service replies with suggestedAction). 

## Service

The bot service application is an extension of SuggestedActionsBot [sample](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/08.suggested-actions). 

The suggested action flow is controlled via `MessageFactory.suggestedActions` API, which returns `Partial<Activity>` in response. On the response object, `channelData` property is being populated with an object for `{chatBox: disable}`.

```diff
    async sendSuggestedActions(turnContext) {
        var actionOptions = ['Red', 'Yellow', 'Blue'];
    +   var reply = MessageFactory.suggestedActions(actionOptions, 'What is the best color?');
    +   reply.channelData = {chatBox: 'disable'};
        await turnContext.sendActivity(reply);
    }
```

-   Basically, the idea is to disable user input, whenever there is a suggestedActions response from service. And, this is something achieved via `channelData.chatBox` property value.
-   `disable` is an indication to client disable user control.
-   `enable` is an indication to client enable user control.
-   The user control needs to be enabled when service requests client to provide input text manually. Out here, the propery `channelData.chatBox` property value is set to `enable`.

```diff
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
            
+           var disableReply = MessageFactory.text('');
+           disableReply.channelData = {chatBox: 'enable'};
+           await turnContext.sendActivity(disableReply);
        }
    }
```

## Client

Client app that hosts webchat UI control, would need to read `channelData.chatBox` property and make an assessment whether to `enable` or `disable` input control.

```diff

        // We are using a customized store to add hooks to connect event        
        const store = window.WebChat.createStore({}, ({ dispatch }) => next => action => {
          if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
            dispatch({
              type: 'WEB_CHAT/SEND_EVENT',
              payload: {
                name: 'webchat/join',
                value: { language: window.navigator.language }
              }
            });
          }       
          
          // Toggle on response from service - via client side Event trigger
          // If service responds action.payload.activity.channelData.chatBox as enable, ON the user input capability
          // If service responds action.payload.activity.channelData.chatBox as disable, OFF the user input capability and continue with suggestedActions
+         if (action && action.payload && action.payload.activity && action.payload.activity.channelData && action.payload.activity.channelData.chatBox) {
+           const event = new Event(`chatBox`);
+           event.data = action.payload.activity.channelData.chatBox;
+           window.dispatchEvent(event);
+         }
          
          return next(action);
        });

        // Event listener
        window.addEventListener('chatBox', ({ data }) => {
+           const chatBox = document.querySelector(`[data-id="webchat-sendbox-input"]`);
            if(chatBox !== null){
              switch(data){
                  case 'enable':
+                     chatBox.disabled = false;
                      break;
                  case 'disable':
+                     chatBox.disabled = true;
                      break;
              }
            }
        });

```

## Setup the client app

-   Go to bot `Channels` UI on browser (on the Azure portal)
-   Pick DirectLine secret key
-   Update the WebChat control with generated secret key

```diff
        // Render the webchat control
        window.WebChat.renderWebChat({
+          directLine: window.WebChat.createDirectLine({ token: 'your-DirectLine-secret-key' }),
          store,
          userID: 'YOUR_USER_ID',
          username: 'Web Chat User',
          locale: 'en-US',
          styleOptions
        }, document.getElementById('webchat'));
```
