var models = require('../models')
var bcrypt = require('bcrypt');
const passport = require('passport');

// Sign up
exports.postUserCreate = async (req, res, next)=>{

    var {firstName, lastName, username, email,
         password, DepartmentId, CurrentBusinessId, RoleId} = req.body

    // first find the db if the user exist
    let user = await models.User.findOne({
        where: {
            username: username,
            email: email
        }
    })

    // if user does not exist
    if (!user) {

        let hashedPassword = await bcrypt.hash(password, 10);

        await models.User.create({
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            password: hashedPassword,
            DepartmentId: DepartmentId,
            CurrentBusinessId: CurrentBusinessId,
            RoleId: RoleId
        })
        .then((user)=>{
    
            res.json({
                message: 'User registered successfully',
                data: user,
                status: true
            })
            console.log("User created successfully");
        })
        .catch((err)=>{
            console.log("There was an error creating the user: " + err);
            res.json({
                message: `There was an error creating the user: ${err}`,
                status: false
            })
        })

    } else {
        res.json({
            message: 'User already exist',
            status: false
        })
    }
};

// Dashboard
exports.getDashboard = (req, res, next)=>{

    res.status(200).send({message: `Welcome ${req.user.username}, to SmartHire API`})

};



// ENDPOINT FOR ADDING SKILLS TO A USER
exports.UserAddSkills = async (req, res, next) => {

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
        if(!updateSkills){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Skills'});
        } 
        
        // FUNCTION FOR DELETING EXISTING USER RANK TABLE DATA ASSOCIATED WITH THE USER
        var delete_userank = await DeleteUserRank (req, res, user);
        if(delete_userank){
            return res.status(422).json({ status: false,  error: 'Error occured while Deleting USER SKILL RANK DATA'});
            }
        
        console.log('User Updated Successfully');
        res.json({
            message: `Skills Added Successfully for ${req.user.username}`,
            data: user,
            status: true
            
        })

    } catch (error) {
        console.log("There was an error adding skills to the user" + error);
        res.json({
            message: `There was an error adding skills to the User: ${error}`,
            status: false
        })
    }

};


// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The User id ${req.params.user_id} passed is not an integer`);
    res.json({
        message: `This User id ${req.params.user_id} passed is not an integer`,
        status: false
    })
}


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
    
};


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


// GET ALL USERS AND THEIR INFO IN THE DB
exports.getAllUsers = async function(req, res, next) {
    
    await models.User.findAll({
        include: [{
            model: models.Skillpool,
            as: 'skillpool',
            attributes: ['id', 'skillpoolName']
        }, {
            model: models.Skill,
            as: 'skills',
            through: 'UserSkills',
            attributes: ['id', 'skillName']
        }, {
            model: models.Goal,
            as: 'goals',
            attributes: ['id', 'goalName']
        }, {
            model: models.Userskillrank,
            as: 'ranks',
            attributes: ['id', 'skillName', 'user_rank']
        }]
    })
    .then((users)=>{
        res.json({
            message: "Here is the list of all Users",
            data: users,
            status: true
        })
    })
    .catch((error)=>{
        res.json({
            message: `There was an error retrieving all Users ${error}`,
            status: false
        })
    })
    
};


// API endpoints for getting USER SKILL MATRIX
exports.UserSkillMatrix = async function(req, res, next) {
    
    let skillsName = [];
    let user_ranks = [];
    let dept_ranks = [];
    let numerator_matrix = 0;
    let denominator_counter = 0;
    let matrix = 0;
    
    // get the current logged in user data obj
    let user_data = await models.Userskillrank.findAll({
        where: {
            UserId: req.user.id,
            DepartmentId: req.user.DepartmentId
        }
    })
    
    // iteratively get the user skills and the associated ranks
    user_data.forEach((data)=>{
        skillsName.push(data.skillName);
        user_ranks.push(data.user_rank);
    })
    
    
    // get the Skillpool obj of the user current department
    let skillpool_obj = await models.Skillpool.findOne({
        where: {DepartmentId: req.user.DepartmentId, CurrentBusinessId: req.user.CurrentBusinessId}
    })
    
    // If a skillpool is found for the dept, then skill matrix can be calculated
    if(skillpool_obj){
        
        console.log(`SKILLPOOOL : ${skillpool_obj.id}`)
    
        // iteratively get the dept ranks of the skills in skillsName
        for(let i=0; i<=(skillsName.length)-1; i++){
            
            let skill_obj = await models.Skill.findOne({
                
                where: {skillName: skillsName[i], SkillpoolId: skillpool_obj.id}

            })
            
            // if the skill is still relevant for the departmment i.e if the skill is still in the dept skill pool
            if(skill_obj){
                denominator_counter++;
                dept_ranks.push(skill_obj.dept_rank);
            }else{
                dept_ranks.push(-(user_ranks[i]));
            }
        }
        
        console.log(`USER SKILL NAMES: ${skillsName}`);
        console.log(`USER SKILL RANKS : ${user_ranks}`);
        console.log(`SKILL DEPT RANKS : ${dept_ranks}`);
        
        // calculate the skill matrix
        for(let i=0; i<=(dept_ranks.length)-1; i++){
            let add = (user_ranks[i] - dept_ranks[i]);
            numerator_matrix += add
        }
        console.log(`THIS IS THE NUMERATOR MATRIX : ${numerator_matrix}`)
        console.log(`THIS IS THE DENOMINATOR : ${denominator_counter}`)
        
        matrix = numerator_matrix / denominator_counter;
        console.log(`THIS IS THE TOTAL SKILL MATRIX: ${matrix}`);
        
    }
    
    res.json({
        message: `${req.user.username} SKLL MATRIX`,
        skillsName: skillsName,
        user_ranks: user_ranks,
        dept_ranks: dept_ranks,
        matrix: matrix,
        status: true
    })

    
};