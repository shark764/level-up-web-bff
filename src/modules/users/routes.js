
const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares required
const {
      fieldsValidation
      
} = require('../../middlewares');

//Helpers required
const {
    emailvalidation,
    userById
} = require('../../helpers/field-dbvalidations');

//Controller required
const { userGet,
        userGetbyId,
        userPost,
        userPut,
        userDelete,
        userAll} = require('./controllers');

const router = Router();

//Routes
router.get('/',userGet );

router.get('/:id',[
    check('id', 'id is not valid').isMongoId(),
    check('id').custom( userById ),    
    fieldsValidation
],userGetbyId );

router.put('/:id',[
    check('id', 'id is not valid').isMongoId(),
    check('id').custom( userById ),
    check('firstName', 'Field "firstName" is required').not().isEmpty(),
    check('lastName', 'Field "lastName" is required').not().isEmpty(),
    check('location', 'Field "location" is required').not().isEmpty(),
    check('location.type', 'Field "location.type" is required').not().isEmpty(),
    check('location.coordinates', 'Field "location.coordinates" is required').not().isEmpty(),
    check('userProfile', 'Field "userProfile" is required').not().isEmpty(),
    check('userProfile.about', 'Field "userProfile.about" is required').not().isEmpty(),
    check('userProfile.photoURL', 'Field "userProfile.photoURL" is required').not().isEmpty(),
    check('userProfile.coverPhotoURL', 'Field "userProfile.coverPhotoURL" is required').not().isEmpty(),
    check('roleId', 'Field "roleId" is required').not().isEmpty(),
    check('nickName', 'Field "nickName" is required').not().isEmpty(),
    check('nickName', 'nickName must be greater than 4').isLength({ min: 4}),
    check('verifiedAccount', 'Field "verifiedAccount" is required').not().isEmpty(),
    check('verifiedAccount', 'Field "verifiedAccount" is required').not().isEmpty(),
    check('birthDay', 'Field "birthDay" is required').not().isEmpty(),
    fieldsValidation
],userPut );

router.post('/',[
    check('firstName', 'Field "firstName" is required').not().isEmpty(),
    check('lastName', 'Field "lastName" is required').not().isEmpty(),
    check('location', 'Field "location" is required').not().isEmpty(),
    check('location.type', 'Field "location.type" is required').not().isEmpty(),
    check('location.coordinates', 'Field "location.coordinates" is required').not().isEmpty(),
    check('userProfile', 'Field "userProfile" is required').not().isEmpty(),
    check('userProfile.about', 'Field "userProfile.about" is required').not().isEmpty(),
    check('userProfile.photoURL', 'Field "userProfile.photoURL" is required').not().isEmpty(),
    check('userProfile.coverPhotoURL', 'Field "userProfile.coverPhotoURL" is required').not().isEmpty(),
    check('roleId', 'Field "roleId" is required').not().isEmpty(),
    check('roleId', 'roleId is not mongoid valid').isMongoId(),
    check('email', 'Field "email" is required').not().isEmpty(),
    check('email', 'Field "email" is wrong').isEmail(),
    check('email').custom( emailvalidation ),
    check("password",
    "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one number.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{7}[^'\s]/, "i"),
    check('nickName', 'Field "nickName" is required').not().isEmpty(),
    check('nickName', 'nickName must be greater than 4').isLength({ min: 4}),    
    check('verifiedAccount', 'Field "verifiedAccount" is required').not().isEmpty(),
    check('verifiedAccount', 'Field "verifiedAccount" is required').not().isEmpty(),
    check('birthDay', 'Field "birthDay" is required').not().isEmpty(),
    fieldsValidation
], userPost );

router.delete('/:id',[
    check('id', 'id is not valid').isMongoId(),
    check('id').custom( userById ),
    
    fieldsValidation
], userDelete );

router.all('/', userAll);






module.exports = router;
