const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'About: Title/titel er påkrævet'],
    },
    teaser: {
        type: String,
        required: [true, 'About: Teaser er påkrævet'],
    },
    content: {
        type: String,
        required: [true, 'About: Content/indhold er påkrævet!'],
    },
    image: {
        type: String,
        required: [ true, 'Banner: Image/foto er påkrævet!' ]
    }
})

module.exports = mongoose.model('About', aboutSchema, 'about')