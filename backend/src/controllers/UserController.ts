import * as express from "express";
import User from "../models/User";

export class UserController {

    login = (req: express.Request, res: express.Response) => {
      let username = req.body.username;
      let password = req.body.password;
  
      User.findOne({ username: username, password: password})
        .then((user) => {
          res.json(user);
        })
        .catch((err) => console.log(err));
    };

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
      // let profilePicure = req.body.profilePicure
      let creditCardNumber = req.body.creditCardNumber

      let verified = false

      const existingUser = await User.findOne({ $or: [{ username:username }, { email:email }] })

      if (existingUser)
        return res.json({ msg: 'User already exists!' });

      const newUser = new User({
        username,
        password,
        forename,
        surname,
        sex,
        type,
        address,
        email,
        contactPhone,
        securityQuestion,
        securityAnswer,
        creditCardNumber,
        verified,
      });

      await newUser.save();
      return res.json({ msg: 'Sent registration request successfully!' });
    }

    updateInfo = async (req: express.Request, res: express.Response) => {
        try {
            const { username, forename, surname, address, email, contactPhone, creditCardNumber } = req.body;
        
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
        
            // Save the updated user information
            await user.save();
        
            res.json({ msg: 'User information updated successfully!' });
          } catch (error) {
            res.json({ msg: 'An error occurred while updating user information!'});
          }
    
    }


}