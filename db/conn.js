const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test_db', {}).then(() => {
    console.log("DB connection successful");
}).catch((e) => {
    console.log("Error Occured", e);
});