const { default: mongoose } = require("mongoose");

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.PORT)
        console.log('Database connected successfully');    
    } catch (error){
        console.log('Error conecting to the database:',error)
    };
    
}
module.exports = connectDatabase;