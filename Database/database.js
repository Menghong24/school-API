const { default: mongoose } = require("mongoose");

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://boymenghongxxx_db_user:Admin123@cluster0.chyzbjh.mongodb.net/?appName=Cluster0')
        console.log('Database connected successfully');    
    } catch (error){
        console.log('Error conecting to the database:',error)
    };
    
}
module.exports = connectDatabase;