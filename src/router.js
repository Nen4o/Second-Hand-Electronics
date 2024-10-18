const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const electronicController = require('./controllers/electronicController');

router.use(homeController);
router.use(authController);
router.use(electronicController);

router.all('*', (req, res) => {
    res.redirect('/404');
})
module.exports = router;