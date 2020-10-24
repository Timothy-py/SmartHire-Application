var models = require("../models");
// const { check, validationResult } = require('express-validator/check');
const axios = require("axios");


// Endpoint for getting all the skills for a user
exports.getSkills = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
     try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/userskillrank/skills/user', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE DATA WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var skills = response1.data;
        console.log(skills);
    
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    res.render('pages/index', {
        title: 'Smarthire', 
        skills: skills.data,
        message: req.flash('message'),
        page: 'skillPage',
        display: 'skillList',
        username: current_user,
        role_name: role.role_name,
        layout: 'layouts/main'});
}



// Endpoint for Deleting a SKill in the Skillpool
exports.getSkillDelete = async function(req, res, next) {
    
    try {
        
        let response1 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/skill/${req.params.skill_id}/delete`, {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE SKILL WAS DELETED SUCCESSFULLY BROOOOOO :) ")
        // var skillpool = response1.data;
        console.log(response1.data);
        
        req.flash('message', 'Skill Deleted Successfully')
        res.redirect('/smarthire/main/skillpool');
        
    } catch (e) {
        console.log("UNABLE TO DELETE THE SKILL BROOOOOO!!!!")
        console.log(e)
    }
};


// API ENDPOINT FOR CREATING SKILL FOR A SKILLPOOL
exports.postSkillCreate = async (req, res, next) => {

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
        req.flash('message', 'Skill Created Successfully')
        res.redirect('../skillpool');
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


// Endpoint for Updating a Skill for a Skillpool
exports.postSkillUpdate = async function(req, res, next) {
    console.log("THESE ARE THE PARAMS AND BODY")
    console.log(req.body.skillName)
    console.log(req.body.dept_rank)
    
    try {
        
        let response1 = await axios.post(`https://smarthireapi.herokuapp.com/smarthire/api/skill/${req.params.skill_id}/update`, {
            skillName: req.body.skillName,
            dept_rank: req.body.dept_rank
        })
        
        console.log("THE SKILL WAS UPDATED SUCCESSFULLY BROOOOOO :) ")
        console.log(response1.data);
        
        req.flash('message', 'Skill Updated Successfully')
        res.redirect('/smarthire/main/skillpool');
        
    } catch (e) {
        console.log("UNABLE TO UPDATE THE SKILL BROOOOOO!!!!")
        console.log(e)
    }
};


// ENDPOINT FOR ADDING SKILLS TO A USER
exports.postSkillAdd = async function(req, res, next) {
    
    try {
        
        await models.User.update({}, {
                where: {
                    id: req.user.id
                }
            }
        );
        
        var actionType = 'update';
        
        let user = await models.User.findByPk(req.user.id);
        
        // FUNCTION FOR UPDATING SKILLS FOR A USER
        var updateSkills = await UpdateSkills (req, res, user, actionType);
        if(updateSkills){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Skills'});
        } 
        
        // FUNCTION FOR DELETING EXISTING USER RANK TABLE DATA ASSOCIATED WITH THE USER
        var delete_userank = await DeleteUserRank (req, res, user);
        if(delete_userank){
            return res.status(422).json({ status: false,  error: 'Error occured while Deleting USER SKILL RANK DATA'});
            }
        
        console.log('THE SKILLS WERE ADDED TO USER Successfully');
        
        try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/userskillrank/skills/user', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE DATA WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var skills = response1.data;
        console.log(skills);
    
        } catch (e) {
            console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
            console.log(e)
        }
        
        req.flash('message', 'Skills Updated Successfully')
        res.redirect('/smarthire/main/skills');

    } catch (error) {
        console.log("There was an error adding skills to the user" + error);
        res.json({
            message: `There was an error adding skills to the User: ${error}`,
            status: false
        })
    }
    
};



// Asynchronous function for adding skills to a User
async function UpdateSkills(req, res, user, actionType) {
    
    // get the skill id(s) passed from the front-end
    let skillList = req.body.skills;
    
    console.log(`THESE ARE THE SKILLS TO BE ADDED ${skillList}`);
    
    // convert all ids to integer type
    var int_skillList = []
    
    if(skillList){
        
        if(typeof(skillList) == 'string'){
        
        int_skillList.push(parseInt(skillList))
        
        }else{
        
        skillList.forEach((id)=>{int_skillList.push(parseInt(id))})
        }
        
        console.log(`SKILL LIST ${int_skillList}`);
        
        await int_skillList.forEach(async (id) => {

            const skill = await models.Skill.findByPk(id);
            console.log(`THIS IS A SKILL TO BE ADDED ${skill}`);
            
            // remove previous associations before we update
            if(actionType == 'update') {
                const oldSkills = await user.getSkills();
                await user.removeSkill(oldSkills);
            }
             
            // now add new skill after removal
            await user.addSkill(skill);
            
        });
        
    }else{
        // remove all skills associated with the user
        if(actionType == 'update') {
            const oldSkills = await user.getSkills();
            await user.removeSkill(oldSkills);
        }
    }
}



// Asynchronous function to delete existing user rank data before update
async function DeleteUserRank(req, res, user ){
        
    
    await models.Userskillrank.destroy({
    where: {
        UserId: req.user.id,
        DepartmentId: req.user.DepartmentId,
    }
    })
    .then(()=>{
        console.log("EXISTING USER SKILL RANK DATA DELETED SUCCESSFULLY");
        return true
    })
    .catch((error)=>{
        console.log(`AN ERROR OCCURED WHILE DELETING EXISTING USER SKILL RANK DATA ${error}`)
        return false
    })
};