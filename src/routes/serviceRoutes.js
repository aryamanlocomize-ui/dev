const express = require('express');
const { listServices, addService } = require('../controllers/serviceController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', listServices);
router.post('/', protect, allowRoles('provider', 'admin'), addService);

module.exports = router;
