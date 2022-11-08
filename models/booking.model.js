const mongoose = require( 'mongoose' );

const bookingSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [ true, 'Booking: Name/navn er påkrævet!' ],
    },
 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [ true, 'Booking: Email er påkrævet!' ]
    },
    phone: {
        type: String,
        required: [ true, 'Booking: Phone/telefonnummer er påkrævet!' ],
    },
    note: {
        type: String,
        default: ""
    },
    accept: {
        type: Boolean,
        default: false
    },
    received: {
        type: Date,
        default: Date.now
    }
} )


module.exports = mongoose.model( 'Booking', bookingSchema, 'booking' )