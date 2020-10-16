var models = require('../models');



// Endpoint for creating a skill for a Skillpool
exports.postSkillCreate = async (req, res, next)=>{

    // find the skillpool id of the current user department
    const skillpool = await models.Skillpool.findOne({
        where: {DepartmentId: req.user.DepartmentId, CurrentBusinessId: req.user.CurrentBusinessId}
    });
    
    // create the skill
    await models.Skill.create({
    skillName: req.body.skillName,
    SkillpoolId: skillpool.id,
    dept_rank: req.body.dept_rank
    })
    .then((skill) => {
        
        res.json({
            message: `Skill Created successfully for Department: ${skillpool.skillpoolName}`,
            data: skill,
            status: true
        })
        console.log(`Skill Created successfully for Department: ${skillpool.skillpoolName}`);
        
    })
    .catch((error) => {
        
        console.log("There was an error creating the Skill: " + error);
        res.json({
            message: `There was an error creating the skill: ${error}`,
            status: false
        })
        
    })

};