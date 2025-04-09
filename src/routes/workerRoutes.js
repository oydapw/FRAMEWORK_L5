const workerController = require('../controllers/workerController');

const endpoints = {
    '/api/v1/workers': {
        GET: workerController.getWorkers,
        POST: workerController.createWorker
    },
    '/api/v1/workers/:id': {
        GET: workerController.getWorker,
        PUT: workerController.updateWorker,
        PATCH: workerController.patchWorker
    }
};

module.exports = { endpoints };