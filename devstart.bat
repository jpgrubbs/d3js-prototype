@echo off
:: I'm no good at batch files. There's probably a better way to handle errors
CALL SET DEBUG=express-locallibrary-tutorial:* & npm run devstart || echo Failed to deploy in devmode && exit /b
