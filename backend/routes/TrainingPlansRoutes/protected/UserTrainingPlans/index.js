import express from "express";

import AssignTrainingPlanToUser from "./AssignTrainingPlanToUser.js";
import DeleteUserTrainingPlan from "./DeleteUserTrainingPlan.js";
import GetCurrentTrainingWithExercises from "./GetCurrentTrainingWithExercises.js";
import GetSelectedTrainingPlan from "./GetSelectedTrainingPlan.js";
import GetUserTrainingPlans from "./GetUserTrainingPlans.js";
import SelectActiveTrainingPlan from "./SelectActiveTrainingPlan.js";

const router = express.Router();

router.use(GetUserTrainingPlans);
router.use(AssignTrainingPlanToUser);
router.use(GetSelectedTrainingPlan);
router.use(GetCurrentTrainingWithExercises);
router.use(SelectActiveTrainingPlan);
router.use(DeleteUserTrainingPlan);

export default router;
