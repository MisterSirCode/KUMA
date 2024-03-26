# KUMA

Basic utility bot I designed specifically for my server.

The `.env` file is not included. If you wish to test, provide your own token within it. 

Standard notation -> `TOKEN=DEVTOKENHERE`

### Developer specific things

Kuma has some builtin owner-only behaviors. 
Rather then traditional slash commands, these are calls. 
Type any of them in a chat Kuma can see to use them.

`kuma end` -> Kills the bot process remotely

`kuma host` -> Output host machine info

`kuma reset` -> Delete application commands from discord database

`kuma reload` -> Reload the application commands back onto the database

`keval <expression>` -> Basic protected eval to grab values or run functions. Output must be a string or single value. 
Requires a returnable or voidable output (No semicolon. Its a single line output)
If it has no value, the bot will say so in chat, or will return the error back into chat.