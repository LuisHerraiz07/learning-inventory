'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/product.controller');

const router = Router();

router.get   ('/stats', ctrl.getStats);
router.get   ('/',      ctrl.getProducts);
router.post  ('/',      ctrl.createProduct);
router.patch ('/:id',   ctrl.updateStock);
router.delete('/:id',   ctrl.deleteProduct);

module.exports = router;
