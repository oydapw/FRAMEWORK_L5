const fs = require('fs');
const path = require('path');

const workersFilePath = path.join(__dirname, '../db/workers.json');

exports.getAllWorkers = () => {
    const data = fs.readFileSync(workersFilePath, 'utf8');
    return JSON.parse(data);
};

exports.getWorkerById = (id) => {
    const workers = this.getAllWorkers();
    return workers.find(worker => String(worker.id) === String(id));
};

exports.createWorker = (workerData) => {
    const workers = this.getAllWorkers();
    workerData.id = String(workers.length + 1);
    workers.push(workerData);
    fs.writeFileSync(workersFilePath, JSON.stringify(workers, null, 2));
    return workerData;
};

exports.updateWorker = (id, updatedData) => {
    let workers = this.getAllWorkers();
    const index = workers.findIndex(worker => String(worker.id) === String(id));
    if (index !== -1) {
        workers[index] = { ...workers[index], ...updatedData };
        fs.writeFileSync(workersFilePath, JSON.stringify(workers, null, 2));
        return workers[index];
    }
    return null;
};

exports.patchWorker = (id, patchData) => {
    let workers = this.getAllWorkers();
    const index = workers.findIndex(worker => String(worker.id) === String(id));
    if (index !== -1) {
        workers[index] = { ...workers[index], ...patchData };
        fs.writeFileSync(workersFilePath, JSON.stringify(workers, null, 2));
        return workers[index];
    }
    return null;
};