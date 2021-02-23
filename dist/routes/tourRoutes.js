"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourController_1 = require("../controllers/tourController");
const router = express_1.Router();
router.route('/').get(tourController_1.getAllTours).post(tourController_1.createTour);
router.route('/:id').get(tourController_1.getTour).patch(tourController_1.updateTour).delete(tourController_1.deleteTour);
exports.default = router;
//# sourceMappingURL=tourRoutes.js.map