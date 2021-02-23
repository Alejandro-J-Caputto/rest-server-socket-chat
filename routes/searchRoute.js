

const express = require('express');

const {searchDoc} = require('../controllers/searchController');

const router = express.Router();


router.get('/:colection/:terminus', searchDoc)


module.exports = router;