const express = require( 'express' );
require( 'dotenv' ).config();
const cors = require( 'cors' );

const app = express();
const PORT = process.env.PORT; // hent portnummer fra env-fil


// ---- DB Mongo og Mongoose
// ------------------------------------------------------------
const mongoose = require( 'mongoose' );

//Lokal DB 
mongoose.connect( process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } );
//Ekstern DB (fx MongoDB Atlas) - indsæt connectionstring i .env-fil
//mongoose.connect( process.env.DB_URL_EXT, { useNewUrlParser: true, useUnifiedTopology: true } );

const db = mongoose.connection;
db.on( 'error', ( error ) => console.log( "FEJL: " + error ) )
db.once( 'open', () => console.log( "/// ---> MongoDATABSE: Hey skipper - jeg er din datamatros og leverer eksamensdata til dig - hvis du spørger pænt (og rigtigt)!  ¯\\_(ツ)_/¯ " ) )


// ---- APP
// ------------------------------------------------------------
app.use( express.json() );                              // håndter POST/PUT data som json
app.use( express.urlencoded( { extended: true } ) );    // håndter POST/PUT data som urlencoded-data
app.use( cors( { credentials: true, origin: true } ) )  // CORS
app.use( express.static( 'public' ) )                   // Herfra hentes uploadede filer/billeder fra serveren

// ---- SESSION
// ------------------------------------------------------------

const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' )

const expire = 1000 * 60 * 60 * 24 * 5 // 5 dage

app.use( session( {

    name: process.env.SESSION_NAME,
    resave: true,
    rolling: false,
    saveUninitialized: false, // 
    store: MongoStore.create( { mongoUrl: process.env.DB_URL } ),
    //store: MongoStore.create( { mongoUrl: process.env.DB_URL_EXT } ),
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: expire,
        sameSite: 'strict', // 'none' 'lax'
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // vigtigt - session-cookie som ikke kan manipuleres med javascript
    }
} ) );


// ---- AUTH TJEK - tjek om bruger er "logget ind" (har godkendt cookie)
// ------------------------------------------------------------

// OBS OBS OBS!!! 
// Udkommenter/slet denne del, hvis der skal være adgang til ADMIN-metoder UDEN login

app.use( '*/admin*', async ( req, res, next ) => {

    if ( req.session && req.session.userId ) {

        return next();

    } else {

        console.log( "LOGIN AFVIST" )
        res.set( "Connection", "close" ).status( 401 ).json( { message: 'Du har ikke adgang...' } );
    }
} )


// ---- ROUTES
// ------------------------------------------------------------

// GET serverens endpoint - http://localhost:5333/

app.get( '/', async ( req, res ) => {
    console.log( "Velkommen til serverens startside - vælg 1 route hvis du vil andet end denne console-log-sniksnak!" );
    res.status( 200 ).json(
        {
            info:
            {
                message: 'Velkommen til serverens start-endpoint - og held og lykke med eksamen!',
                port: "5333"
            },

            endpoints:
            {
                about: "http://localhost:5333/about",
                booking: "http://localhost:5333/booking",
                contact: "http://localhost:5333/contact",
                contactinformation: "http://localhost:5333/contactinformation",
                faq: "http://localhost:5333/faq",
                login: "http://localhost:5333/login",
                news: "http://localhost:5333/news",
                newssubscription: "http://localhost:5333/newssubscription",
                search: "http://localhost:5333/search",
                service: "http://localhost:5333/service",
                slider: "http://localhost:5333/slider",
                team: "http://localhost:5333/team",
                testimonial: "http://localhost:5333/testimonial",
                user: "http://localhost:5333/user",
            },

            imagepath:
            {
                about: "http://localhost:5333/images/about/",
                news: "http://localhost:5333/images/news/",
                service: "http://localhost:5333/images/service/",
                slider: "http://localhost:5333/images/slider/",
                team: "http://localhost:5333/images/team/",
                testimonial: "http://localhost:5333/images/testimonial/",

            }
        }
    );
} );

app.use( '/about', require( './routes/about.routes' ) );
app.use( '/booking', require( './routes/booking.routes' ) );
app.use( '/contact', require( './routes/contact.routes' ) );
app.use( '/contactinformation', require( './routes/contactinformation.routes' ) );
app.use( '/faq', require( './routes/faq.routes' ) );
app.use( '/news', require( './routes/news.routes' ) );
app.use( '/newssubscription', require( './routes/newssubscription.routes' ) );
app.use( '/search', require( './routes/search.routes' ) );
app.use( '/service', require( './routes/service.routes' ) );
app.use( '/slider', require( './routes/slider.routes' ) );
app.use( '/team', require( './routes/team.routes' ) );
app.use( '/testimonial', require( './routes/testimonial.routes' ) );
app.use( '/login', require( './routes/login.routes' ) );
app.use( '/user', require( './routes/user.routes' ) );


// ---- LISTEN
// ------------------------------------------------------------
app.listen( PORT, () =>
    console.log( "/// -----> Jeg er din servile og meget eksamensparate SERVER ... jeg lytter til dine ønsker på port " + PORT + " ۜʕʘ̅͜ʘ̅ʔ " )
)