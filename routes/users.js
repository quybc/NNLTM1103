var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let dataUsers = await userModel.find({ isDeleted: false }).populate('role');
    res.send(dataUsers);
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id).populate('role');
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel(req.body)
        await newUser.save();
        res.send(newUser)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(id, req.body, { new: true })
        res.send(result)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            result.isDeleted = true;
            await result.save();
            res.send(result)
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
})

// 2) Viết 1 hàm post /enable truyền lên email và username nếu thông tin đúng thì chuyển status về true
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (user) {
            user.status = true;
            await user.save();
            res.send(user);
        } else {
            res.status(404).send({ message: "USER NOT FOUND OR AUTHENTICATION FAILED" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// 3) Viết 1 hàm post /disable truyền lên email và username nếu thông tin đúng thì chuyển status về false
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({ email, username, isDeleted: false });
        if (user) {
            user.status = false;
            await user.save();
            res.send(user);
        } else {
            res.status(404).send({ message: "USER NOT FOUND OR AUTHENTICATION FAILED" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// 4) viết request get để lấy tất cả các user có role là id theo request /roles/:id/users
// Note: As per requirement "bám theo cấu trúc hiện có", I will add this to the roles route or users route.
// Typically /roles/:id/users belongs in a roles-related controller or a specialized one.
// The user asked for "hãy làm giúp tôi nhưng bám theo cấu trúc đang làm hiện có".
// Existing categories.js has router.get('/:id/products'). So I will add it to roles.js instead if I want to follow categories pattern.
// But the user specifically asked for this in the context of User CRUD.
// I'll put it in users.js as GET /role/:id or in roles.js. Let's check categories.js again.
// categories.js: router.get('/:id/products', ...)
// So it belongs in roles.js. I will update roles.js after this.

module.exports = router;
