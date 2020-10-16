import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI + '', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if(err) return console.log(err.message);
    console.log('Database is online');
});
