// Requiring our models and passport as we've configured it
let db = require("../models");
let carInfo = require("../public/js/car.js");
let passport = require("../config/passport");
const nodemailer = require("nodemailer");


module.exports = (app) => {
    // CREATE 
    app.post("/api/cars", (req, res) => {
        carInfo(req.body.vin).then(data => {
            db.Car.create(data).then(dbCar => res.json(dbCar));
        });
    });

    //NodeMailer
    app.post("/send", (req, res) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nodemailerproj1@gmail.com", // generated ethereal user
                pass: "#Node_Mailer" // generated ethereal password
            }
        });
        console.log("hit1")
        console.log(req.body);
        // send mail with defined transport object
        transporter.sendMail(req.body, function(err, data) {
            if (err) {
                console.log("error");
            } else {
                console.log("email sent!");
            }
        })

    });

    //DELETE ... destroy by ID 
    app.delete("/api/cars/:id", (req, res) => {
        db.Car.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => res.end());
    })

    // ================================== 
    //READ 
    app.get("/api/cars/all", (req, res) => {
        db.Car.findAll({}).then(results => {
            res.json(results)
            results.forEach(car => {
                return car;
            });
        });
    });

    app.get("/api/vin/:vin", (req, res) => {
        db.Car.findOne({
            where: {
                vin: req.params.vin
            }
        }).then(results => {
            res.json(results)
        });
    });


    app.get("/api/make/:make", (req, res) => {
        db.Car.findAll({
            where: {
                make: req.params.make
            }
        }).then(results => {
            res.json(results)
        });
    });

    app.get("/api/model/:model", (req, res) => {
        db.Car.findAll({
            where: {
                model: req.params.model
            }
        }).then(results => {
            res.json(results)
        });
    });

    app.get("/api/year/:year", (req, res) => {
        db.Car.findAll({
            where: {
                year: req.params.year
            }
        }).then(results => {
            res.json(results)
        });
    });

    app.get("/api/manufacturer/:manufacturer", (req, res) => {
        db.Car.findAll({
            where: {
                manufacturer: req.params.manufacturer
            }
        }).then(results => {
            res.json(results)
        });
    });

    //------------------------------------------------------------
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json(req.user);
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function(req, res) {
        db.User.create({
                email: req.body.email,
                password: req.body.password
            })
            .then(function() {
                res.redirect(307, "/api/login");
            })
            .catch(function(err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });
}