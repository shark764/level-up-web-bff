const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('./model');
const { success, error} = require("../../utils/response");

//get methods

const userAll = (req = request, res = response) => {

  res
    .status(405)
    .json(
      error({ requestId: req.id, code: 405, message: 'Method not allowed' })
    );
};
const userGet = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const query = { active: true,deletedAt: null };

    const [ count, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number( from ) )
            .limit(Number( limit ))
    ]);

    return res
     .status(200)
     .json(success({ requestId: req.id, data: { count,users } }));
};

const userGetbyId = async(req = request, res = response) => { 
    
    const { id } = req.params;
    
    try {
        const users  = await User.findById(id);
        return res
        .status(200)
        .json(success({ requestId: req.id, data: { users } }));
      } catch (err) {
      res
        .status(404)
        .json(error({ requestId: req.id, code: 404, message: err }));
      }
};
//post method
const userPost = async(req, res = response) => {

    const  {password,...body}  = req.body;
    body.password=password;
    const user = new User(body);

    // Encrypt the password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Save to BD
    try {
     await user.save();
     return res
     .status(200)
     .json(success({ requestId: req.id, data: { user } }));
   } catch (err) {
   return res
     .status(500)
     .json(error({ requestId: req.id, code: 500, message: err }));
   }
   
};

///put method
const userPut = async(req, res = response) => {

    const { id } = req.params;
    const {  password, email, ...rest } = req.body;    

    // uodate user to BD
    try {
      const user = await User.findByIdAndUpdate( id, rest );
      return res
      .status(200)
      .json(success({ requestId: req.id, data: { user } }));
    } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
    }
};

//delete method
const userDelete = async(req, res = response) => {
    const { id } = req.params; 

    // delete user(update deleteat field) to BD
    try {
      const user = await User.findByIdAndUpdate( id, {deletedAt:Date.now() } );
      return res
      .status(200)
      .json(success({ requestId: req.id, data: { user } }));
    } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
    }
};




module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userGetbyId,
    userAll,
};
