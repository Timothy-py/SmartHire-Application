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


// Handle Skill Delete on GET request
exports.getSkillDelete = async function(req, res, next) {
    
    if (isNaN(req.params.skill_id)!=true){
        const skill = await models.Skill.findByPk(req.params.skill_id)
        
        if(!skill){
            console.log("Cannot find the skill that you wish to delete");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that skill that you wish to delete'});
        }else{
            models.Skill.destroy({
            where: {
              id: req.params.skill_id
            }
          })
            .then(function() {
                
                res.json({
                    message: 'Skill Deleted Successfully',
                    status: true
                });
                console.log("Skill deleted successfully");
                
            })
            .catch((error) => {
                
                console.log("There was an error deleting the Skill " + error);
                res.json({
                    message: `There was an error deleting the skill: ${error}`,
                    status: false
                })
            })
        }
    }else{
        idError(req, res)
    }
    
};


// Handle Skill Update on POST request API
exports.postSkillUpdate = async (req, res, next) => {

    if(isNaN(req.params.skill_id)!=true){
        const skill = await models.Skill.findByPk(req.params.skill_id)
        
        if(!skill){
            console.log("Cannot find the skill selected");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that skill selected'});
        }else{
            
            // now update
            await models.Skill.update({
            skillName: req.body.skillName,
            dept_rank: req.body.dept_rank
        },{
            where: {id: req.params.skill_id}
        })
        .then((skill) => {
            res.json({
            message: `Skill with id ${req.params.skill_id} was updated successfully`,
            data: skill,
            status: true
            })
        })
        .catch((error) => {
            console.log("There was an error updating the skill: " + error);
            res.json({
                message: `There was an error updating the skill: ${error}`,
                status: false
            })
        })
        }
        
    }else{
        idError(req, res)
    }

};


// Display a Skill Detail on GET request
exports.getSkillDetails = async function(req, res, next) {
    
    if(isNaN(req.params.skill_id)!=true){
        const skill = await models.Skill.findByPk(req.params.skill_id)

        if(!skill){
            console.log("Cannot find the skill selected");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that skill selected'});
        }else{
            models.Skill.findByPk(req.params.skill_id, {
            include: [{
                model: models.User,
                as: 'users',
                attributes: ['id', 'username', 'first_name', 'last_name'],
                through: {
                    model: models.UserSkills
                }
            }, {
                model: models.Skillpool,
                as: 'skillpool',
                attributes: ['id', 'skillpoolName'],
            }]
            })
            .then(function(skill){
                
                res.json({
                    message: `This is the detail of the skill with ID ${req.params.skill_id}`,
                    data: skill,
                    status: true
                })
                console.log("SKill Details retrieved successfully");
                
            })
            .catch((error)=>{
                
                console.log("There was an error retrieving the skill details: "+ error);
                res.json({
                    message: `There was an error retrieving the skill details: ${error}`,
                    status: false
                })
            })
        }
    }else{
        idError(req, res)
    }
    
};


// AN API ENDPOINT THAT LIST ALL THE SKILLS FOR A DEPARTMENT(through the skillpool)
exports.getSkillByDepartment = async function(req, res, next) {
    
    
    // find the skillpool id of the current user department
    const skillpool = await models.Skillpool.findOne({
        where: {DepartmentId: req.user.DepartmentId, CurrentBusinessId: req.user.CurrentBusinessId}
    });
    
    
    if(!skillpool){
        console.log("Cannot find a skillpool for this Department");
        res.json({
            message: "There is no Skillpool for this department yet}",
            data: ['no skillpool'],
            status: true
        })
    }else{
        
        // find all the skills that belong to that skillpoool
        models.Skill.findAll({
        include: [{
            model: models.Skillpool,
            where: {id: skillpool.id},
            as: 'skillpool',
            attributes: ['id', 'skillpoolName'],
        }]
        })
        .then(function(skills){
            if(skills.length > 0){
                res.json({
                message: "Here is the list of all skills for Department}",
                skillpoolId: skillpool.id,
                data: skills,
                status: true
            })
            }else{
                res.json({
                message: "There are no skills for this department yet}",
                skillpoolId: skillpool.id,
                data: ['no skill'],
                status: true
            })
            }
            console.log("Skill List rendered successfully");
        })
        .catch((error) => {
            console.log("There was an error listing all skills for the Department: " + error);
            res.json({
                message: `There was an error retrieving all skills for the Department : ${error}`,
                status: false
            })
        })
        
    }
    
};


// Display all Skills on GET request
exports.getSkillList = async function(req, res, next) {
    
    models.Skill.findAll({
        include: [{
            model: models.Skillpool,
            as: 'skillpool',
            attributes: ['id', 'skillpoolName'],
        }]
    })
    .then(function(skills){
        res.json({
            message: "Here is the list of all skills",
            data: skills,
            status: true
        })
        console.log("Skill List rendered successfully");
    })
    .catch((error) => {
        console.log("There was an error listing all skills: " + error);
        res.json({
            message: `There was an error retrieving all skills: ${error}`,
            status: false
        })
    })
    
};


// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Skill id ${req.params.skill_id} passed is not an integer`);
    res.json({
        message: `This Skill id ${req.params.skill_id} passed is not an integer`,
        status: false
    })
}