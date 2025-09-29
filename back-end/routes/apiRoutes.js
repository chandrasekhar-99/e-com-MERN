const router = require('express').Router();
const {initialize,transactions,search, statistics,barChart,pieChart,roxApi} = require('../controller/controller');

router.get('/initializeDatabase',initialize);
router.get('/transactions',transactions);
router.get('/transactions/search',search);
router.get('/statistics',statistics);
router.get('/bar-chart',barChart);
router.get('/pie-chart',pieChart);
router.get('/rox-api',roxApi);

module.exports= router;
