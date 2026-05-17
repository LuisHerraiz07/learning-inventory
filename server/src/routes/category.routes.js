'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/category.controller');

const router = Router();

router.get ('/', ctrl.getCategories);
router.post('/', ctrl.createCategory);

module.exports = router;
