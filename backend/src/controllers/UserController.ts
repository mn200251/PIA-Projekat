import * as express from "express";
import User from "../models/User";
import Reservation from "../models/Reservation";
import * as crypto from "crypto";
import * as os from "os";

// const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

export class UserController {

    login = async (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await User.findOne({ username: username, password: hashedPassword})

        if (!user)
        {
            // return res.json({ msg: 'Incorrect username or password!' });
            return
        }

        // const profilePicture = await fs.readFileSync(user.profilePicture, 'base64')

        // user.profilePicture = profilePicture;
        return res.json(user);
    };

    uploadPicture = async (req: express.Request, res: express.Response) => {
        const profFile = req.files;

        if (
        typeof profFile === "object" &&
        profFile !== null &&
        "profilePicture" in profFile
        ) {
        const picFileName = profFile.profilePicture[0].filename;
        const profilePicPath = "http://localhost:4000/images/" + picFileName;
        res.json(profilePicPath);
        } else {
                console.log(profFile);
           }
    }  

    register = async (req: express.Request, res: express.Response) => {
        let username = req.body.username
        let password = req.body.password
        let forename = req.body.forename
        let surname = req.body.surname
        let sex = req.body.sex
        let type = req.body.type
        let address = req.body.address
        let email = req.body.email
        let contactPhone = req.body.contactPhone
        let securityQuestion = req.body.securityQuestion
        let securityAnswer = req.body.securityAnswer

        let profilePicture = req.body.profilePicture;//////////////////////////////

        let creditCardNumber = req.body.creditCardNumber


        let accountStatus = 0

        const existingUser = await User.findOne({ $or: [{ username:username }, { email:email }] })

        if (existingUser)
            return res.json({ msg: 'User already exists!' });

        // add image or set default image
        if (profilePicture == "" || profilePicture == null || profilePicture == undefined)
        {
            profilePicture = "http://localhost:4000/images/default.jpg"
        }
        else
        {
            // console.log("alo");
            // const profilePicturesDir = path.join('src', 'images', 'profilePictures', username);
            // if (!fs.existsSync(profilePicturesDir)) {
            //     fs.mkdirSync(profilePicturesDir);
            // }
            
            // const profilePicurePath = path.join('src', 'images', 'profilePictures', username, username + '.jpg');

            /*
            const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
            const bufferData = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(profilePicurePath, bufferData);
            */

            // profilePicture = profilePicurePath;
            console.log(profilePicture);
        }


        // Encrypt the password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const newUser = new User({
            username,
            password: hashedPassword,
            forename,
            surname,
            sex,
            type,
            address,
            email,
            contactPhone,
            securityQuestion,
            securityAnswer,
            profilePicture,
            creditCardNumber,
            accountStatus,
        });

        await newUser.save();
        return res.json({ msg: 'Success!' });
    }

    updateInfo = async (req: express.Request, res: express.Response) => {
        try {
            const { username, forename, surname, address, email, contactPhone, profilePicture, creditCardNumber } = req.body;
        
            const user = await User.findOne({ username });
            if (!user) {
              return res.json({ msg: 'User not found' });
            }

            // check if new email is already used by another user
            const user2 = await User.findOne({ email });
            if (user2)
            {
                if (user2.email != user.email)
                {
                    return res.json({ msg: 'New email is already taken!' });
                }
            }
            
            // Update user information
            user.forename = forename;
            user.surname = surname;
            user.address = address;
            user.email = email;
            user.contactPhone = contactPhone;
            user.creditCardNumber = creditCardNumber;
            user.profilePicture = profilePicture;
        
            // Save the updated user information
            await user.save();
        
            res.json({ msg: 'User information updated successfully!' });
          } catch (error) {
            res.json({ msg: 'An error occurred while updating user information!'});
          }
    
    }

    getUsers = async (req: express.Request, res: express.Response) => {
        
        const users = await User.find({ type: { $ne: "admin" } });

        return res.json(users);
    }

    setStatus = async (req: express.Request, res: express.Response) => {
        let username = req.body.username
        let newStatusValue = req.body.accountStatus

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: 'User not found' });
        }

        user.accountStatus = newStatusValue

        await user.save();

        if (newStatusValue == -2)
            return res.json({ msg: 'User banned successfully!' });
        else if (newStatusValue == 1)
            return res.json({ msg: 'User is now active!' });
        else if (newStatusValue == -1)
            return res.json({ msg: 'User rejected successfully!' });
    }

    resetPasswordKnow = async (req: express.Request, res: express.Response) => {
        let username = req.body.username
        let oldPassword = req.body.oldPassword
        let newPassword = req.body.newPassword

        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ msg: 'User not found!' });
        }

        const oldHashedPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');
        const newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        if (oldHashedPassword == newHashedPassword)
        {
            return res.json({ msg: "New password can not be same as old password!" });
        }

        if (user.password != oldHashedPassword)
        {
            return res.json({ msg: 'Incorrect password for user!' });
        }

        user.password = newHashedPassword

        await user.save();

        return res.json({ msg: 'Success!' });

    }

    getSecurityDetails = async (req: express.Request, res: express.Response) => {
        let username = req.body.username

        const user = await User.findOne({ username });

        if (!user)
        {
            return res.json({ msg: 'User not found!' });
        }

        return res.json(user);
    }

    resetPasswordDontKnow = async (req: express.Request, res: express.Response) => {
        let username = req.body.username

        let newPassword = req.body.newPassword

        const newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        const user = await User.findOne({ username });

        if (!user) // should never happen!
        {
            return res.json({ msg: 'User not found!' });
        }

        user.password = newHashedPassword

        await user.save();

        return res.json({ msg: 'Success!' });
    }

    getReservations = async (req: express.Request, res: express.Response) => {
        let username = req.body.username

        const reservations = await Reservation.find({ username });

        return res.json(reservations);
    }

    cancelReservation = async (req: express.Request, res: express.Response) => {
        let reservationID = req.body._id

        const reservation = await Reservation.findOne({ _id: reservationID });

        if (!reservation)
        {
            return res.json({ msg: 'Reservation not found!' });
        }

        if (reservation.cancelledByUser == true)
        {
            return res.json({ msg: 'Reservation already cancelled!' });
        }

        reservation.cancelledByUser = true

        await reservation.save();

        return res.json({ msg: 'Success!' });
    }
}