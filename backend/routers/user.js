import { request, Router } from "express";
import User from "../models/user.js";
//import Contact from "../models/contact.js"
import {
  hash,
  compareHashes,
  setCookie,
  getTokenData,
  createToken,
  generateKey,
  sanitizeInput,
} from "../utilities/general.js";
import { log } from "../middlewares/logger.js";
import authenticate from "../middlewares/authentication.js";
import authorize from "../middlewares/authorization.js";
import { sendMail, templates } from "../services/mail.js";
const { APP_NAME, ADMIN_EMAIL, LOGIN_EXPIRE } = process.env;

const app = Router();

// for account registration in Sadiq Sharp Sub
app.post("/register", async (req, res, next) => {
  try {
    for (const field in req.body) {
      if (field !== "password" && req.body[field])
        req.body[field] = sanitizeInput(req.body[field]);
    }

    let {
      name,
      email,
      address,
      password,
      phone,
      gender = "male",
      country = "nigeria",
    } = req.body;

    if (name.length >= 100)
      return res.json({
        success: false,
        message: "your name is too long",
      });

    if (address.length >= 500)
      return res.json({
        success: false,
        message: "your address is too long",
      });

    if (!name || !email.includes("@")) {
      throw new req.AppError(
        !name ? "invalid user name" : "invalid email address",
      );
    }

    if (!phone || phone.length < 11 || typeof phone !== "string")
      throw new req.AppError("invalid phone number");

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing)
      throw new req.AppError(
        existing.email == email
          ? "user with this email already existed"
          : "user with this phone number already existed",
      );

    const hashedPassword = await hash(password);
    req.body.role = email == ADMIN_EMAIL ? "super" : "user";
    const user = await User.create({ ...req.body, password: hashedPassword });
    if (!user)
      throw new req.AppError("fail to create account, check your details");

    const token = await createToken({
      _id: user._id.toString(),
      email: user.email,
    });
    req.token = token;

    sendMail({ email }, req, (sent) => {
      setCookie(res, "token", token, LOGIN_EXPIRE);

      res.json({
        success: true,
        message: `Registration Successful, ${sent ? "Wait A Bit!" : "Please Login!"}`,
        redirect: sent
          ? encodeURI(
              `${req.domain}/message?title=Registration Succesfull &description= Registration Succesful, Please Check Your Email  including spam folder For Verification &redirect=false`,
            )
          : false,
      });

      log(user.name + " registered an account");
    });
  } catch (er) {
    req.err = er;
    next();
  }
});

// for account confirmation in Sadiq Sharp Sub
app.get("/verify", async (req, res) => {
  try {
    const { token = false, type = "email" } = req.query;

    if (!token) {
      return res.redirect(
        `${req.domain}/message?title=invalid token &description=the token provided is invalid, please relogin and try again&spinner =true &redirect=/login `,
      );
    }

    try {
      const {
        email = "",
        _id = "",
        newPassword = "",
      } = await getTokenData(token);
      let user = await User.findOne({ _id });
      if (!user) throw new req.AppError("user not found");

      if (type == "email") {
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              emailVerified: true,
              updatedAt: Date.now(),
            },
          },
          { new: true },
        );

        const destination = encodeURI(
          `${req.domain}/message?title=email verification succesful&description= congratulations ${user.name}, you successfully verified your email address, now your ${APP_NAME} account is ready, please wait a bit while we redirect you to your dashboard &redirect=${user.role == "user" ? "/user" : "/admin"}/dashboard/login`,
        );
        res.redirect(destination); // make it template for message

        // send another email for introducing app

        await sendMail(
          {
            template: "message",
            title: "Sadiq Sharp Sub Overview",
            subject: "Welcome To Sadiq Sharp Sub",
            spinner: false,
            email: user.email,
            description: `
       <div style="text-align: left">
        congratulations dear ${user.name}, welcome to Sadiq Sharp Sub <br>
        you have successfully verufied your Sadiq Sharp Sub account, 
        now what remain ? <hr>
        here is a guide on the Sadiq Sharp Sub  app and how to use it <br> <br>
        here is your  <a href="${url}/${user.role == "user" ? "/user" : "/admin"}/dashboard/login" > dashboard </a>
        <br>
        <h3> detailed overview of the app </h3>
        Sadiq Sharp Sub is a registered telecommunication application that allow you to purchase all your subscription services like
        data airtime electricity cable and more at cheaper prices , we are very reliable and affordable our main focus is to provide 
        a platform that allow users to subscribe at the tip of there hand very fast and reliable, kindly visit your
        <a href="${url}/${user.role == "user" ? "/user" : "/admin"}/dashboard/login" > dashboard </a> to enjoy our services smoothly
        <br> <br>
         thank you for trusting us
        </div>
       `,
          },
          req,
        );
      } else if (type == "reset") {
        const hashedPassword = await hash(newPassword);
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              password: hashedPassword,
              updatedAt: Date.now(),
            },
          },
          { new: true },
        );

        const destination = encodeURI(
          `${url}/message?title=password change succesfull&description= congratulations ${user.name}, you successfully changed your password, please wait a bit while we redirect you to your dashboard &redirect=${user.role == "user" ? "/user" : "/admin"}/dashboard/login`,
        );
        res.redirect(destination); // make it template for message
      }
    } catch (er) {
      throw new req.AppError("Invalid Token Or Token Expired");
    }
  } catch (er) {
    log(er, "bad");
    res.redirect("/login");
  }
});

// for login user
app.post("/authenticate", authenticate, async (req, res, next) => {
  try {
    const { user } = req;

    // Create token for the logged-in user
    const token = await createToken({
      _id: user._id.toString(),
      email: user.email,
    });

    // Set the token as a cookie
    setCookie(res, "token", token, LOGIN_EXPIRE);

    if (!user.emailVerified) {
      sendMail({ email: user.email }, req, (sent) => {
        res.json({
          success: true,
          message: sent
            ? "logged in successfully please wait"
            : "something went wrong, please try again!",
          redirect: sent
            ? encodeURI(
                `/message?title=Logged In Successfully &description=You successfully logged in to your account, Please Check Your Email including spam folder To Verify Your Account &redirect=false`,
              )
            : false,
        });
      });
    } else {
      delete user.password;
      delete user.passCode;
      res.json({
        success: true,
        redirect: `/${user.role}/dashboard`,
        user,
        message: "Logged In Successfully, Wait A Bit !",
      });
    }
  } catch (er) {
    req.message = "login failed try again!";
    req.err = er;
    next();
  }
});

app.get("/admin/authorize/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token || typeof token !== "string") return res.redirect("/login");
    const userData = await getTokenData(token);
    if (!userData)
      return res.redirect(
        decodeURI(
          `/message?title=expired token &description=the authorisation token has already expired, this happens when the confirmation email wasn't acted upon quickly, please relogin and try again&spinner =true &redirect=/login `,
        ),
      );
    const { userId, isAdmin = false, keepMe = true } = userData;
    setCookie(res, "token", token, keepMe || true);
    res.redirect(
      `/${isAdmin ? "admin/dashboard/login" : "user/dashboard/login"}`,
    );
  } catch (er) {
    console.error(er);
    res.redirect("/login");
  }
});

// for reseting password , send reset link
app.post("/reset/:type", async (req, res, next) => {
  try {
    const { type = "email" } = req.params;
    const { email, newPassword = "", passCode = "0000" } = req.body;

    if (
      typeof email !== "string" ||
      typeof newPassword !== "string" ||
      typeof passCode !== "string"
    )
      throw new req.AppError("invalid name or transaction pin!");

    if (!email.includes("@") || newPassword.length < 8) {
      throw new req.AppError(
        newPassword.length < 8
          ? "fail to reset, password is short"
          : "fail to reset, invalid email field",
      );
    }

    let query = { email };
    if (type == "info") query = { ...query, passCode };

    const user = await User.findOne(query);

    if (!user) {
      throw new req.AppError(`user with this ${type} doesnt exist`);
    }

    const token = await createToken({ email, _id: user._id, newPassword });
    sendMail(
      {
        email,
        subject: `Confirm Password Change For Sadiq Sharp Sub Account`,
        title: "Confirm Password Change",
        buttonText: "Change Password",
        description: `Click on the link below to reset your password to ${newPassword.slice(0, 5) + "..."}`,
        url: `${req.domain}/api/user/verify?token=${token}&type=reset`,
      },
      req,
      (sent) => {
        res.json({
          success: sent,
          message: sent
            ? "Successful, Please Wait!"
            : "Something Went Wrong Try Again Later!!",
          redirect: sent
            ? encodeURI(
                `${req.domain}/message?title=Reset Success &description= we sent you a password reset link to your email, please check your email  including spam folder and click on the link to reset your password &redirect=false`,
              )
            : false,
        });
      },
    );
  } catch (er) {
    req.err = er;
    next();
  }
});

// for frontend token confirmation and auto login if token is valid
app.get("/profile", authorize, async (req, res, next) => {
  try {
    const { user } = req;
    delete user.password;
    delete user.passCode;
    res.json({ success: true, user });
  } catch (er) {
    req.err = er;
    console.log(er);
    next();
  }
});

// setting & info
app.get("/info", authorize, async (req, res, next) => {
  try {
    const { user } = req;
    delete user.password;
    delete user.passCode;
    delete user.kycDetails;
    res.json({ success: true, data: { user } });
  } catch (er) {
    req.err = er;
    console.log(er);
    req.message = "something went wrong!";
    next();
  }
});

// logout
app.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "you successfully logout!",
    });
  } catch (er) {
    console.log(er);
    req.message = "something went wrong, try again!";
    next();
  }
});

// getting dashboard
app.get("/dashboard", authorize, async (req, res, next) => {
  try {
  } catch (er) {
    req.er = er;
    console.log(er);
    next();
  }
});

const allowedUpdateFields = ["name", "phone", "passCode", "state", "address"];

app.put("/setting", authorize, async (req, res, next) => {
  try {
    const { updates, password } = req.body;
    if (typeof password !== "string")
      throw new req.AppError("invalid password");
    const isCorrect = await compareHashes(password, req.user.password);
    if (!isCorrect) throw new req.AppError("incorrect password try again!");

    for (const field in updates) {
      if (!allowedUpdateFields.includes(field)) {
        delete updates[field];
      } else {
        updates[field] = sanitizeInput(updates[field]);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updates,
      },
      { new: true },
    );

    delete user.password;
    delete user.passCode;
    delete user.apiKey;
    delete user.webhook;
    delete user.kycDetails;

    res.json({
      success: true,
      message: "you successfully updated your settings",
      data: {
        user,
      },
    });
  } catch (er) {
    req.err = er;
    next();
  }
});

export default app;
