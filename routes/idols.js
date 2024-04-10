const express = require('express');
const router = express.Router();
const Idol = require('../models/Idol');
const {
    getIdols,
    createIdol,
    updateIdol,
    deleteIdol,
    getIdol,
    optionsIdols,
    optionsIdol
} = require("../controllers/idols");

router.route('/').get(getIdols)
    .post(createIdol)
    .options(optionsIdols)
router.route('/:id').put(updateIdol).delete(deleteIdol)
    .get(getIdol)
    .options(optionsIdol)


module.exports = router;

