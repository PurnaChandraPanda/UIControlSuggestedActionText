# suggest-text-chat-bot

having suggested action as well as text input capabilities

This bot has been created using [Bot Framework](https://dev.botframework.com), it shows how to create a simple bot that accepts input from the user and echoes it back.

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```
- Update `.env` with required configuration settings
    - MicrosoftAppId
    - MicrosoftAppPassword

## To run the bot

- Install modules

    ```bash
    npm install
    ```

- Start the bot

    ```bash
    npm start
    ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.3.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3979/api/messages`

### Create an ngrok endpoint for the Bot Framework Emulator level testing
	
While debugging SDK developed bot service application, we have to follow the steps as per [blog](https://blog.botframework.com/2017/10/19/debug-channel-locally-using-ngrok/), which talks about using `ngrok` utility.
-   Run your bot service application in debug mode (via VS).
-   From the command line, run the following command:
        ```bash
		ngrok http 3979 -host-header="localhost:3979"
        ```
-   Copy the https forwarding url
-   Create a `bot channel registration` on Azure portal, fill in all details and provide the messaging endpoint value as `https://<ngrok-url>/api/messages`.
-   Go to `bot channel registration` page, then `Settings`, and then copy `App ID` and `Password`.
-   Update App ID/ password values in your `.env` and `.bot` files.
-   Restart the VS Code level debugging

`Note`: The same ngrok endpoint one can be utilized for webchat level debugging. You just need to get your DirectLine secret key generated and pass it to to client side. Manual approach would be to pass the secret key, or can generate a token and pass to client side.

## Deploy the bot to Azure (once local testing is over)

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.
