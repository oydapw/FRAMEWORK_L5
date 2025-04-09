const fs = require('fs');
const path = require('path');

const machinesFilePath = path.join(__dirname, '../db/machines.json');

exports.getAllMachines = () => {
    const data = fs.readFileSync(machinesFilePath, 'utf8');
    return JSON.parse(data);
};

exports.getMachineById = (id) => {
    const machines = this.getAllMachines();
    return machines.find(machine => String(machine.id) === String(id));
};

exports.createMachine = (machineData) => {
    const machines = this.getAllMachines();
    machineData.id = String(machines.length + 1);
    machines.push(machineData);
    fs.writeFileSync(machinesFilePath, JSON.stringify(machines, null, 2));
    return machineData;
};

exports.updateMachine = (id, updatedData) => {
    let machines = this.getAllMachines();
    const index = machines.findIndex(machine => String(machine.id) === String(id));
    if (index !== -1) {
        machines[index] = { ...machines[index], ...updatedData };
        fs.writeFileSync(machinesFilePath, JSON.stringify(machines, null, 2));
        return machines[index];
    }
    return null;
};

exports.patchMachine = (id, patchData) => {
    let machines = this.getAllMachines();
    const index = machines.findIndex(machine => String(machine.id) === String(id));
    if (index !== -1) {
        machines[index] = { ...machines[index], ...patchData };
        fs.writeFileSync(machinesFilePath, JSON.stringify(machines, null, 2));
        return machines[index];
    }
    return null;
};