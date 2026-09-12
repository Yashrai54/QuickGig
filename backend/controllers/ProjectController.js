import ProjectModel from "../models/project.model.js";

export const addProject = async (req, res) => {
    const { title, description, lat, lng } = req.body;

    if (!title || !description || lat == null || lng == null) {
        console.log("not all fields are present")
        return res.status(400).json({ message: "All fields are required" });
    }
    if(!req.user.userId){
        console.log("user not authenticated")
        return res.status(400).json({'message':"user not authenticated"})
    }
    const newProject = new ProjectModel({
        clientId: req.user.userId,
        title,
        description,
        location:{
            type:"Point",
            coordinates:[lng,lat]
        }
    });

    await newProject.save();
    console.log("success")
    return res.status(201).json({ message: "Project created" ,createdProject : newProject});
};

export const getProjects = async (req, res) => {
    const clientId = req.user.userId

    if (!clientId) {
        return res.status(400).json({ "message": "user not authenticated" })
    }
    try {
        const userProjects = await ProjectModel.find({ clientId })
        return res.status(200).json({ "message": "Projects Found", projects: userProjects })
    }
    catch (error) {
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const updateProject = async (req, res) => {
    const {projectId} = req.params
    const updates = {}

    const { updatedTitle, updatedDescription } = req.body

    if (updatedTitle) updates.title = updatedTitle
    if (updatedDescription) updates.description = updatedDescription

    if (Object.keys(updates).length === 0) {
        console.log("nothing recieved")
        return res.status(400).json({ message: "Nothing to update" });
    }

    if (!projectId) {
        console.log("no project")
        return res.status(400).json({ "message": "no project id found" })
    }

    try {
        const project = await ProjectModel.findOneAndUpdate({ _id: projectId, clientId: req.user.userId }, {
            $set:updates
        },{new:true})

        if (!project) {
            console.log("no project")
            return res.status(400).json({ "message": "No project found" })
        }
        console.log("updated")
        console.log(project)
        return res.status(200).json({ "message": "Successfully updated" ,updatedProject:project})
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const deleteProject = async (req, res) => {
    const {projectId} = req.params
    if (!projectId) {
        console.log("no params found")
        return res.status(400).json({ "message": "no project id found" })
    }
    try {
        const project = await ProjectModel.deleteOne({ _id: projectId, clientId: req.user.userId })

        if (!project) {
            console.log("no project found")
            return res.status(400).json({ "message": "No project found" })
        }
        console.log("deleted")
        return res.status(200).json({ "message": "Successfully deleted" })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ "message": "Server Error" })
    }
}