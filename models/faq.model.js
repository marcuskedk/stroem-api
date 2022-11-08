const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, 'Question/spørgsmål er påkrævet!']
    },
    answer: {
        type: String,
        required: [true, 'Answer/svar er påkrævet!']
    }
})


module.exports = mongoose.model('FAQ', faqSchema, 'faq')