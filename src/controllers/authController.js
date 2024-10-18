const router = require('express').Router();
const authServices = require('../services/authServices');
const bcrypt = require('bcrypt');
const { isAuth } = require('../middlewares/authMiddleware')

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/constants');

router.get('/register', (req, res) => {
    if (res.user) {
        return res.redirect('/404');
    }

    if (res.user) {
        return res.redirect('/');
    }
    res.render('auth/register');
})

router.post('/register', async (req, res) => {
    const registerData = req.body;

    try {
        if (registerData.password != registerData.rePassword) {
            throw new Error('Password does not match!');
        }

        const user = await authServices.createUser(registerData);
        const JWT = createJwt(user);
        res.cookie('auth', JWT);
        res.redirect('/');
    } catch (err) {
        const errorMessage = err.errors ? Object.values(err.errors)[0]?.message : err.message;
        res.render('auth/register', { error: errorMessage, registerData })
    }
})

router.get('/login', (req, res) => {
    if (res.user) {
        return res.redirect('/404');
    }
    res.render('auth/login')
})

router.post('/login', async (req, res) => {
    const loginData = req.body;

    try {
        const user = await authServices.findUserByEmail(loginData.email);

        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Password is not valid!');
        }

        const JWT = createJwt(user);
        res.cookie('auth', JWT);
        res.redirect('/');
    } catch (err) {
        const errorMessage = err.errors ? Object.values(err.errors)[0]?.message : err.message;
        res.render('auth/login', { error: errorMessage, loginData });
    }
})

router.get('/logout', (req, res) => {
    if (!res.user) {
        return res.redirect('/404');
    }
    res.clearCookie('auth');
    res.redirect('/');
})

function createJwt(user) {
    const payload = {
        email: user.email,
        _id: user._id,
        username: user.username
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

module.exports = router;