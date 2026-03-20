import express from "express";

import AddExerciseToTrainingPlan from "./AddExerciseToTrainingPlan.js";
import CreateTrainingPlan from "./CreateTrainingPlan.js";
import DeleteExerciseFromTrainingPlan from "./DeleteExerciseFromTrainingPlan.js";
import DeleteTrainingPlan from "./DeleteTrainingPlan.js";
import GetAllExercisesFromPlan from "./GetAllExercisesFromPlan.js";
import GetAllTrainingPlans from "./GetAllTrainingPlans.js";
import GetTrainingPlanById from "./GetTrainingPlanById.js";
import UpdateExerciseInTrainingPlan from "./UpdateExerciseInTrainingPlan.js";
import UpdateTrainingPlan from "./UpdateTrainingPlan.js";

const router = express.Router();

router.use(GetAllTrainingPlans);
router.use(CreateTrainingPlan);
router.use(GetTrainingPlanById);
router.use(UpdateTrainingPlan);
router.use(DeleteTrainingPlan);
router.use(GetAllExercisesFromPlan);
router.use(AddExerciseToTrainingPlan);
router.use(UpdateExerciseInTrainingPlan);
router.use(DeleteExerciseFromTrainingPlan);

export default router;
