const mongoose = require('mongoose');
const dbUrl = require('../../config/db.js').url;
mongoose.connect(dbUrl);
const Schema = mongoose.Schema;


const userSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    phone: Number,
    ip: String,
    address: String,
    citystatezip: String,
    city: String,
    state: String,
    zipcode:Number,
    password: String,
    rentZestimate: Number,
    monthlyLow: Number,
    monthlyHigh: Number,
    userExpectation: Number
});

const User = mongoose.model('Users', userSchema);

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        //Do not expose in Json
        delete result._id;
        delete result.__v;
        delete result.password;
        delete result.ip;
        return result;
    });
};

exports.patchUser = (id, userData) => {

    console.log("Inside Patch 2",userData);
    return new Promise((resolve, reject) => {

        User.findById(id, function (err, user) {
            if (err) reject(err);
            
            console.log("Patching user - User found");

            for (let i in userData) {
                user[i] = userData[i];
            }

            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                console.log("Patching user - User updated"); 
                console.log(userData);

                console.log(user);
                resolve(updatedUser);
            });

        });
    })
};


exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.findByEmail = (email) => {
    return User.find({
        email: email
    });
};


exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({
            _id: userId
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};