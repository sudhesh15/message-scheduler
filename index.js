const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
const cron = require('node-cron');

app.use(bodyParser.json());

mongoose.connect(`${MONGO_URL}`);
const Message = require('./model/Message');

app.get('/', (req,res)=>{
    res.send(`Hello World!`);
});

app.post('/schedule-message', async (req, res) => {
    const { message, day, time } = req.body;
    const datetime = moment(`${day} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
    const newMessage = new Message({
        message: message,
        date: datetime
    });

    try {
        console.log('Message scheduled at:', datetime);
        cron.schedule(moment(datetime).format('mm HH DD MM *'), async () => {
            const savedMessage = await newMessage.save();
            console.log('Message saved:', savedMessage);
        });
        res.status(200).json({ message: 'Message scheduled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to schedule message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
