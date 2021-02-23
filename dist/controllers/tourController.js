"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tourModel_1 = require("../models/tourModel");
const tourPath = path_1.default.resolve(__dirname, '../../data/data/tours-simple.json');
const tours = JSON.parse(fs_1.default.readFileSync(tourPath, 'utf-8'));
function getAllTours(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tours = yield tourModel_1.Tour.find();
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    tours,
                },
            });
        }
        catch (error) {
            res.status(404).json({
                status: 'success',
                message: error,
            });
        }
    });
}
exports.getAllTours = getAllTours;
function getTour(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tour = yield tourModel_1.Tour.findById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    tour,
                },
            });
        }
        catch (error) {
            res.status(404).json({
                status: 'success',
                message: error,
            });
        }
    });
}
exports.getTour = getTour;
function createTour(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newTour = yield tourModel_1.Tour.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
        catch ({ message }) {
            res.status(400).json({
                status: 'error',
                message,
            });
        }
    });
}
exports.createTour = createTour;
function updateTour(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedTour = yield tourModel_1.Tour.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTour,
                },
            });
        }
        catch ({ message }) {
            res.status(400).json({
                status: 'error',
                message,
            });
        }
    });
}
exports.updateTour = updateTour;
function deleteTour(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield tourModel_1.Tour.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        }
        catch ({ message }) {
            res.status(400).json({
                status: 'error',
                message,
            });
        }
    });
}
exports.deleteTour = deleteTour;
//# sourceMappingURL=tourController.js.map