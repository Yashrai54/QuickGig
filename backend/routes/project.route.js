import { Router } from "express";
import { addProject, deleteProject, getProjects, updateProject } from "../controllers/ProjectController.js";
import {nearbyProjects,searchProjects} from "../controllers/GeoController.js";

const projectRouter = Router()

projectRouter.post("/add",addProject)
projectRouter.get("/all",getProjects)
projectRouter.put("/update/:projectId",updateProject)
projectRouter.delete("/delete/:projectId",deleteProject)

projectRouter.get("/near/:lat/:lng",nearbyProjects)
projectRouter.get("/search",searchProjects)


export default projectRouter