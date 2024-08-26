# noanimebot
Simple discord.js bot that deletes messages containing recognizable anime faces.

Uses an [object detection model](https://github.com/zymk9/yolov5_anime) to recognize anime and delete it. You may choose to use your own model for detection; this project is configured to use a model hosted on Hugging Face and interact with it using Gradio.

## Requirements
- @gradio/client v0.2.1
- axios v1.7.5
- discord.js v14.15.3
- Node.js v18.17.1
Versions other than listed are untested.
