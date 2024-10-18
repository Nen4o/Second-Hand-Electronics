const Electronic = require('../models/Electronic')

const electronicServices = {
    getAll() {
        return Electronic.find();
    },
    createElectronic(electronicData) {
        return Electronic.create(electronicData);
    },
    getById(electronicId) {
        return Electronic.findById(electronicId);
    },
    updateById(electronicId, updateData) {
        return Electronic.findByIdAndUpdate(electronicId, updateData, { runValidators: true });
    },
    deleteById(electronicId) {
        return Electronic.findByIdAndDelete(electronicId);
    }
}

module.exports = electronicServices;