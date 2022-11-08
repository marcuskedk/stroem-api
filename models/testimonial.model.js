const mongoose = require( 'mongoose' );

const testimonialSchema = new mongoose.Schema( {

    title: {
        type: String,
        required: [ true, 'Testimonial: Title/titel er påkrævet!' ]
    },
    name: {
        type: String,
        required: [ true, 'Testimonial: Name/navn er påkrævet!' ]
    },
    review: {
        type: String,
        required: [ true, 'Testimonial: Review/kundeudtalelse er påkrævet!' ]
    },
    image: {
        type: String,
        required: [ true, 'Testimonial: Image er påkrævet!' ]
    }
} )


module.exports = mongoose.model( 'Testimonial', testimonialSchema, 'testimonial' )