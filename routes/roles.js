var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles')

router.get('/', async function (req, res, next) {
    let dataRoles = await roleModel.find({ isDeleted: false })
    res.send(dataRoles);
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
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
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        })
        await newRole.save();
        res.send(newRole)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(id, req.body, { new: true })
        res.send(result)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
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

router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;
        let userModel = require('../schemas/users');
        let users = await userModel.find({ role: id, isDeleted: false });
        res.send(users);
    } catch (error) {
        res.status(404).send({ message: "ROLE ID NOT FOUND" });
    }
});

module.exports = router;
