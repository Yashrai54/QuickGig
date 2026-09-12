import ProjectModel from "../models/project.model.js"

export default async function nearbyProjects(req,res){
      const  {lat,lng} = req.params
      
      const projects = await ProjectModel.find({
        location:{
            $near:{
                $geometry:{
                    type:"Point",
                    coordinates:[lng,lat]
                },
                $maxDistance: 5000 // 5 km radius
            }
        }
      })

      if(!projects){
        console.log("No Projects found in your area")
        return res.status(400).json({"message":"No Projects  found in your area"})
      }
      return res.status(200).json({"message":"Success",foundProjects:projects})
}


export default async function searchProjects(req, res) {
  const { query } = req.query

  if (!query?.trim()) {
    return res.status(400).json({
      message: "Search query is required",
      foundProjects: []
    })
  }

  try {
    const projects = await ProjectModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    })

    return res.status(200).json({
      message: "Success",
      foundProjects: projects
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: "Something went wrong",
      foundProjects: []
    })
  }
}