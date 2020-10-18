var Userskillrank = require("../models/userskillrank");
var models = require("../models");


// AN API ENDPOINT THAT LIST ALL THE SKILLS FOR A USER IN A DEPARTMENT
exports.getSkillByUser = async function(req, res, next) {
    
    // FUNCTION FOR UPDATING THE SKILL RANK TABLE
    var populateUserSkillRankmodel = await PopulateUserSkillRankmodel (req, res);
    if(populateUserSkillRankmodel){
        console.log('Error occured while Creating UserSkillrank table');
        return res.status(422).json({ status: false,  error: 'Error occured while Creating UserSkillrank table'});
    }
    
    // get the current logged in user id and his dept id
    const userId = req.user.id
    const departmentId = req.user.DepartmentId
    
    if(!(userId && departmentId)){
        console.log("Cannot find the User or the Department");
        return res.status(422).json({ status: false,  error: 'ERROR! Cannot find the User or the Department'});
    }else{
        // search the userskillrank model based on the current user info
        await models.Userskillrank.findAll({
        where: {
            UserId: userId,
            DepartmentId: departmentId
        }
        })
        .then(function(skillranks){
            // console.log(skillranks)
            res.json({
                message: `Here is the list of all skills for User:${req.user.username} in Department:${req.user.DepartmentId}`,
                data: skillranks,
                status: true
            })
            console.log("Skill List rendered successfully");
        })
        .catch((error) => {
            console.log("There was an error listing all skills for the User in that Department: " + error);
            res.json({
                message: `There was an error retrieving all skills for the User in that Department: ${error}`,
                status: false
            })
        })
        
    }
    
};

// Asychronous function to automatically populate userskillrank model
async function PopulateUserSkillRankmodel(req, res) {
    
    // UPSERT FUNCTION
    var findOrCreate = async function(values, condition) {
    return models.Userskillrank
        .findOne({ where: condition })
        .then(function(obj) {
            // create
            if(!obj){
                return models.Userskillrank.create(values);
            }else{
                
            }
                
        })
    }
    
    // get the logged-in user obj from the db, including the skill relation
    const user_obj = await models.User.findOne({
        where: {id: req.user.id},
        include: [{
            model: models.Skill,
            as: 'skills',
            attributes: ['id', 'skillName']
        }]
    });
    
    let user_skills = user_obj.skills        // assign the user skills here
    let skillNameList = [];                 // a variable to hold the names of the user skills
    
    // iteratively push the skill names to skillNameList
    user_skills.forEach((skill)=>{
        skillNameList.push(skill.skillName)
    })
    
     // iteratively populate the UserSkillrank table based on the names in skillNameList
        await skillNameList.forEach(async (skill) => {
            
            await findOrCreate({
                UserId: req.user.id,
                DepartmentId: req.user.DepartmentId,
                skillName: skill
            },{
                UserId: req.user.id,
                DepartmentId: req.user.DepartmentId,
                skillName: skill
            })
            .then((skillrank) => {
                console.log(`UserSkillRank table updated/created successfully for User:${req.user.username}, Skill:${skill}`);
            })
            .catch((error) => {
                console.log(`There was an error updating/creating a UserSkillRank table for User:${req.user.username}, Skill:${skill}`)
                console.log(error)
            })
            
        })
    
};



// API ENDPOINT TO UPDATE USER SKILL RANK
exports.updateRank = async function(req, res, next){
    
    let skillIds = req.body.skillName;
    let skillRanks = req.body.user_rank;
    
    var int_skillIds = [];
    var int_skillRanks = [];
    
    skillIds.forEach((id)=>{int_skillIds.push(parseInt(id))})
    skillRanks.forEach((rank)=>{int_skillRanks.push(parseInt(rank))})
    
    console.log(`int SKILL IDs ${int_skillIds}`)
    console.log(`int SKILL Ranks ${int_skillRanks}`)
    
    try{
        
         for (var i = 0; i < skillIds.length; i++) {
            const skill = await models.Userskillrank.findByPk(skillIds[i])
            
            if(!skill){
            console.log("Cannot find the skill selected");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that skill selected'});
            }else{
                
                // // get the user and dept id from skill obj
                // const user_id = skill.UserId
                // const dept_id = skill.DepartmentId
                
                // let duplicate = await models.Userskillrank.findOne({
                //     where: {
                //         UserId: user_id,
                //         DepartmentId: dept_id,
                //         user_rank: int_skillRanks[i]
                //     }
                // })
                
                // if(duplicate){
                //     console.log("Duplicate! There is a duplicate skill rank")
                //     res.json({
                //         message: "Duplicate! There is a duplicate skill rank",
                //         data: [0]
                //     })
                    
                // }else{
                console.log(`SKILL ID ${int_skillIds[i]}`)
                console.log(`SKILL RANK ${int_skillRanks[i]}`)
                    
                    await models.Userskillrank.update({
                    user_rank: int_skillRanks[i]
                    }, {
                        where: {id: skillIds[i]}
                    })
                    .then((skill)=>{
                        console.log("User Skill Status was updated successfully")
                    })
                      
                }
            // }
        }
        
        console.log("ALL USER SKILL RANKS WERE UPDATED SUCCESSFULLY!")
        res.json({
            message: "User Skill Ranks were updated successfully",
            data: [1],
            status: true
        })
        
            
    }catch(error){
        res.json({
            message: "There was an error updating the User Skill Status",
            status: false
        })
    }
        
};



// Endpoint for a User to remove her Skill
exports.deleteSkill = async function(req, res, next) {
    
    if(isNaN(req.params.skill_id)!=true){
        const skill = await models.Userskillrank.findByPk(req.params.skill_id)
        
        if(!skill){
            console.log("Cannot find the skill selected");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that skill selected'});
        }else{
            
            await models.Userskillrank.destroy({
                where: {id: req.params.skill_id}
            })
            .then(function() {
                
                res.json({
                    message: 'User skill Deleted Successfully',
                    status: true
                });
                console.log("User Skill deleted successfully");
                
            })
            .catch((error) => {
                
                console.log("There was an error deleting the User skill " + error);
                res.json({
                    message: `There was an error deleting the User skill: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError(req, res)
    }
};



// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Userskillrank id ${req.params.skill_id} passed is not an integer`);
    res.json({
        message: `This Userskillrank id ${req.params.skill_id} passed is not an integer`,
        status: false
    })
}