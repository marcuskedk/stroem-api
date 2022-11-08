const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({

    image: {
        type: String,
        required: [true, 'image/Sliderbillede er påkrævet!']
    },
    caption: {
        type: String,
        required: [true, 'caption/Sliderbilledets alt-text er påkrævet!']
    }
})


module.exports = mongoose.model('Slider', sliderSchema, 'slider')