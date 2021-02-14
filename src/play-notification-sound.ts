import path from 'path';
const sound = require("sound-play");

const filePath = path.join(__dirname, '..', 'assets', "bike-horn.mp3");

export const playNotificationSound = () => {
    sound.play(filePath);
};
