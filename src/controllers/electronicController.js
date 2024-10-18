const router = require('express').Router();
const electronicServices = require('../services/electronicServices');

router.get('/electronic/create', (req, res) => {
    if (!res.user) {
        res.redirect('/404');
    }

    res.render('electronic/create');
})

router.post('/electronic/create', async (req, res) => {
    const electronicData = req.body;
    electronicData.owner = res.user._id;

    try {
        await electronicServices.createElectronic(electronicData);
        res.redirect('/electronic/catalog');
    } catch (err) {
        const errorMessage = Object.values(err.errors)[0]?.message;
        res.render('electronic/create', { error: errorMessage, electronicData });
    }

})


router.get('/electronic/catalog', async (req, res) => {

    try {
        const electronics = await electronicServices.getAll().lean();

        res.render('electronic/catalog', { electronics });
    } catch (err) {
        console.log(err);

    }
})

router.get('/electronic/details/:electronicId', async (req, res) => {
    const electronicId = req.params.electronicId;
    const userId = res.user?._id;

    try {
        const electronic = await electronicServices.getById(electronicId).lean();

        const isOwner = electronic.owner == userId;
        const isBuy = electronic.buyingList.find(usersId => usersId == userId);

        res.render('electronic/details', { electronic, isOwner, isBuy });
    } catch (err) {
        console.log(err);
    }
})

router.get('/electronic/buy/:electronicId', async (req, res) => {
    if (!res.user) {
        return res.redirect('/404');
    }

    const electronicId = req.params.electronicId;

    try {
        const electronic = await electronicServices.getById(electronicId);
        if (res.user._id == electronic.owner) {
            return res.redirect('/404');
        }
        electronic.buyingList.push(res.user._id);
        await electronicServices.updateById(electronicId, electronic);
        res.redirect(`/electronic/details/${electronicId}`);
    } catch (err) {
        console.log(err);
    }
})

router.get('/electronic/delete/:electronicId', async (req, res) => {
    const electronicId = req.params.electronicId;

    try {
        const electronic = await electronicServices.getById(electronicId);
        if (res.user?._id != electronic.owner) {
            return res.redirect('/404');
        }
        await electronicServices.deleteById(electronicId);
        res.redirect('/electronic/catalog');
    } catch (err) {
        console.log(err);
    }
})

router.get('/electronic/edit/:electronicId', async (req, res) => {
    const electronicId = req.params.electronicId;

    try {
        const electronicData = await electronicServices.getById(electronicId).lean();
        if (res.user?._id != electronicData.owner) {
            return res.redirect('/404');
        }
        res.render('electronic/edit', { electronicData });
    } catch (err) {
        console.log(err);
    }
});

router.post('/electronic/edit/:electronicId', async (req, res) => {
    const electronicId = req.params.electronicId;
    const electronicData = req.body;

    try {
        await electronicServices.updateById(electronicId, electronicData);
        res.redirect(`/electronic/details/${electronicId}`)
    } catch (err) {
        const errorMessage = Object.values(err.errors)[0]?.message;
        res.render('electronic/edit', { error: errorMessage, electronicData });
    }
})

router.get('/electronic/search', async (req, res) => {
    if (!res.user) {
        return res.redirect('/404');
    }
    const query = req.query;
    try {
        let electronics = await electronicServices.getAll().lean();

        if (query.name) {
            electronics = electronics.filter(electronic => electronic.name.toLowerCase().includes(query.name.toLowerCase().trim()));
        }

        if (query.type) {
            electronics = electronics.filter(electronic => electronic.type.toLowerCase().includes(query.type.toLowerCase().trim()));
        }

        res.render('electronic/search', { electronics, query })
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;