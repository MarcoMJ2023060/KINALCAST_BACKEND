import User from "../users/user.model.js";
import Channel from '../channel/channel.model.js'
import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-JWT.js";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const encryptedPassword = await hash(password);

    const newChannel = await Channel.create({})

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
      channel: newChannel._id
    });

    return res.status(200).json({
      msg: "user has been added to database",
      userDetails: {
        user: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("No se pudo registrar el usuario");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if(user && (await verify(user.password, password))){
      const token = await generarJWT(user.id, user.email)

      res.status(200).json({
        msg: "Login Ok!!!",
        ip: process.env.IP_1,
        userDetails: {
          username: user.username,
          token: token
        },
      });
    }

    if (!user) {
      return res
        .status(400)
        .send(`Wrong credentials, ${email} doesn't exists en database`);
    }

    // verificar la contraseña
    const validPassword = await verify(user.password, password)
    if (!validPassword) {
      return res.status(400).send("wrong password");
    }
   
  } catch (e) {
    res.status(500).send("Comuniquese con el administrador");
  }
};
