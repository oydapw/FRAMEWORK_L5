const machineService = require('../services/machineService');

exports.getMachines = (req, res) => {
    const machines = machineService.getAllMachines();
    res.json(machines);
};

exports.getMachine = (req, res) => {
    const machine = machineService.getMachineById(req.params.id);
    if (machine) {
        res.json(machine);
    } else {
        res.status(404).json({ error: 'Машина не найдена' });
    }
};

exports.createMachine = (req, res) => {
    const newMachine = machineService.createMachine(req.body);
    res.status(201).json(newMachine);
};

exports.updateMachine = (req, res) => {
    const updatedMachine = machineService.updateMachine(req.params.id, req.body);
    if (updatedMachine) {
        res.json(updatedMachine);
    } else {
        res.status(404).json({ error: 'Машина не найдена' });
    }
};

exports.patchMachine = (req, res) => {
    const patchedMachine = machineService.patchMachine(req.params.id, req.body);
    if (patchedMachine) {
        res.json(patchedMachine);
    } else {
        res.status(404).json({ error: 'Машина не найдена' });
    }
};