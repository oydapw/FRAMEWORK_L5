const workerService = require('../services/workerService');

exports.getWorkers = (req, res) => {
    const workers = workerService.getAllWorkers();
    res.json(workers);
};

exports.getWorker = (req, res) => {
    const worker = workerService.getWorkerById(req.params.id);
    if (worker) {
        res.json(worker);
    } else {
        res.status(404).json({ error: 'Рабочий не найден' });
    }
};

exports.createWorker = (req, res) => {
    const newWorker = workerService.createWorker(req.body);
    res.status(201).json(newWorker);
};

exports.updateWorker = (req, res) => {
    const updatedWorker = workerService.updateWorker(req.params.id, req.body);
    if (updatedWorker) {
        res.json(updatedWorker);
    } else {
        res.status(404).json({ error: 'Рабочий не найден' });
    }
};

exports.patchWorker = (req, res) => {
    const patchedWorker = workerService.patchWorker(req.params.id, req.body);
    if (patchedWorker) {
        res.json(patchedWorker);
    } else {
        res.status(404).json({ error: 'Рабочий не найден' });
    }
};