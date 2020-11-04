var express = require("express");
var router = express.Router();
var {ensureAuthenticated} = require("../config/auth");


var goalController = require("../smarthireControllers/goalController");
var indexController = require('../smarthireControllers/indexController');
var skillpoolController = require("../smarthireControllers/skillpoolController");
var skillController = require("../smarthireControllers/skillController");
var userskillrankController = require("../smarthireControllers/userskillrankController");
var goaldetailController = require("../smarthireControllers/goaldetailController");

console.log("I am in SMART HIRE main routes");


// GET ABOUT PAGE
// router.get('/about', aboutController.getAbout);


router.get('/', indexController.getLogin);

router.get('/home', ensureAuthenticated, indexController.getIndex);

router.get('/goals', goalController.getGoals);

router.get('/goals/department', goalController.getGoalsDepartment);

router.post('/goal/create', goalController.postGoalCreate)

router.get('/goal/:goal_id/delete', goalController.getGoalDelete);

router.post('/goal/:goal_id/update', goalController.postGoalUpdate);

router.get('/skillpool', skillpoolController.getSkillpool);

router.get('/skillpool/user', skillpoolController.getSkillpoolUser);

router.get('/skillpool/:skillpool_id/delete', skillpoolController.getSkillpoolDelete);

router.post('/skillpool/create', skillpoolController.postSkillpoolCreate);

router.get('/skills', skillController.getSkills);

router.get('/skill/:skill_id/delete', skillController.getSkillDelete);

router.post('/skill/createapi', skillController.postSkillCreate);

router.post('/skill/add', skillController.postSkillAdd);

router.post('/skill/:skill_id/updateapi', skillController.postSkillUpdate);

router.post('/userskillrank/update', userskillrankController.postUserSkillUpdate);

router.post('/goaldetails/:goal_id/create', goaldetailController.postGoaldetailCreate)

router.post('/goaldetail/update/:goal_id/goal', goaldetailController.postUpdateGoaldetailStatus);

router.get('/goaldetail/:goaldetail_id/delete/:goal_id/goal', goaldetailController.getGoaldetailDelete);

router.get('/goaldetails/goal/:goal_id', goaldetailController.getGoalDetails);



module.exports = router;