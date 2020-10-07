var express =  require('express');
var router =  express.Router();

// controllers
var userController = require('../controllers/userController');
var skillpoolController = require('../controllers/skillpoolController');
var skillController = require('../controllers/skillController');
var roleController = require('../controllers/roleController');
var departmentController = require('../controllers/departmentController');
var currentbusinessController = require('../controllers/currentbusinessController');


// POST USER SIGNUP
router.post('/user/signup', userController.postUserCreate);

// DASHBOARD
router.get('/', userController.getDashboard);

// SKILLPOOL ROUTES
// POST request for creating a skillpool
router.post('/skillpool/create', skillpoolController.postSkillpoolCreate);
// GET request for deleting a skillpool
router.get('/skillpool/:skillpool_id/delete', skillpoolController.getSkillpoolDelete);
// Post request for updating a skillpool
router.post('/skillpool/:skillpool_id/update', skillpoolController.postSkillpoolUpdate);
// Get request for skillpool details
router.get('/skillpool/:skillpool_id', skillpoolController.getSkillpoolDetails);
// Get request for skillpool List
router.get('/skillpools', skillpoolController.getSkillpoolList);


// SKILL ROUTES
// POST Request API for creating a Skill for a Skillpool
// router.post('/skill/create', skillController.postSkillCreate);
// // Get request for deleting Skill
// router.get('/skill/:skill_id/delete', skillController.getSkillDelete);
// // Post request for updating Skill
// router.post('/skill/:skill_id/updateapi', skillController.postSkillUpdateAPI);
// // Get request for Skill details
// router.get('/skill/:skill_id', skillController.getSkillDetails);
// // GET Request API to list all Skills for a Department
// router.get('/skills/department', skillController.getSkillByDepartment);
// // Get request for Skill List
// router.get('/skills', skillController.getSkillList);


// ROLE ROUTES
// POST request for creating a role
router.post('/role/create', roleController.postRoleCreate);
// GET request for deleting a role
router.get('/role/:role_id/delete', roleController.getRoleDelete);
// Post request for updating a role
router.post('/role/:role_id/update', roleController.postRoleUpdate);
// Get request for role details
router.get('/role/:role_id', roleController.getRoleDetails);
// Get request for role List
router.get('/roles', roleController.getRoleList);


// DEPARTMENT ROUTES
// POST request for creating a department
router.post('/department/create', departmentController.postDepartmentCreate);
// GET request for deleting a department
router.get('/department/:department_id/delete', departmentController.getDepartmentDelete);
// Post request for updating a department
router.post('/department/:department_id/update', departmentController.postDepartmentUpdate);
// Get request for department details
router.get('/department/:department_id', departmentController.getDepartmentDetails);
// Get request for department List
router.get('/departments', departmentController.getDepartmentList);


// CURRENTBUSINESS ROUTES
// POST request for creating a currentbusiness
router.post('/currentbusiness/create', currentbusinessController.postCurrentbusinessCreate);
// GET request for deleting a currentbusiness
router.get('/currentbusiness/:currentbusiness_id/delete', currentbusinessController.getCurrentbusinessDelete);
// Post request for updating a currentbusiness
router.post('/currentbusiness/:currentbusiness_id/update', currentbusinessController.postCurrentbusinessUpdate);
// Get request for currentbusiness details
router.get('/currentbusiness/:currentbusiness_id', currentbusinessController.getCurrentbusinessDetails);
// Get request for currentbusiness List
router.get('/currentbusinesses', currentbusinessController.getCurrentbusinessList);

module.exports = router;

