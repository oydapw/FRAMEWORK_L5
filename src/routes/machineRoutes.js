const machineController = require('../controllers/machineController');

const endpoints = {
    '/api/v1/machines': {
        GET: machineController.getMachines,
        POST: machineController.createMachine
    },
    '/api/v1/machines/:id': {
        GET: machineController.getMachine,
        PUT: machineController.updateMachine,
        PATCH: machineController.patchMachine
    }
};

module.exports = { endpoints };