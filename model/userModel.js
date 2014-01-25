
var mongoose   =  new  require('mongoose');
var bcrypt     =  new  require('bcrypt-nodejs');
var ObjectId   =  require('mongoose').Types.ObjectId;
var async      =  require('async')
//var redis      =  new  require('redis');
//var client     =  redis.createClient();

var userSchema = mongoose.Schema({
        id:String,
		email_id:String,
		password:String,
		roles:[String]       
      })

var roleSchema = mongoose.Schema({
       id : String,
       permissions: [String]
    })

var  permissionSchema = mongoose.Schema({
     id : String,
     name : String
    })

    exports.userSignup = function(req,callback){
       console.log("the incoming param is "+req.param('name'))
       var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
       var essage = conn.model('user',userSchema);
       var usr = new essage();
       usr.first_name = req.param('first_name');
       usr.last_name  = req.param('last_name');
       bcrypt.hash(req.param('password'), null, null, function(err, hash) {
           usr.password   = hash;
       });
	   usr.id         = req.param('id');
       usr.email_id   = req.param('email');
       usr.dob        = req.param('dob');
       usr.sex        = req.param('sex');
       usr.save(function(err){
           if(err){
               callback(err);
           }
       });
       callback("",usr.id);
         //mongoose.connection.close();


       mongoose.disconnect()

   }

    exports.userLogin = function(req, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var essage = conn.model('user',userSchema);
    essage.find({'email_id':req.param('email')}, function (err, user) {
        if(err){
            onErr(err,callback);
        }
        else{
            user = JSON.stringify(user);
            user = JSON.parse(user)[0];
            bcrypt.compare(req.param('password'), user.password, function(err, pwdMatched) {
                if(pwdMatched)  callback("",user._id)
                else callback("",pwdMatched)

            });
            mongoose.disconnect()
        }
    });
}

    exports.permit = function(req,callback){
     var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var permission = conn.model('permissions',permissionSchema);
    var permit = new permission();
    permit.id = req.param('id');
    permit.name   = req.param('name');
    permit.save(function(err){
        if(err){
            callback(err);
        }
    });
    callback("",permit.id);
    mongoose.disconnect()
}


    exports.role = function(req,callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var role = conn.model('roles',roleSchema);
	console.log("in here");
    var newrole = new role();
    newrole.id = req.param('id');
    newrole.save(function(err){
        if(err){
            callback(err);
        }
    });
	console.log(newrole.id);
    callback("",newrole.id);
    mongoose.disconnect()
}

    exports.editPerms  = function(req, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var role = conn.model('roles',roleSchema);
    role.update({'id':req.params.roleId},{$pushAll:{'permissions':req.param('permissions')}},function(err){
                if(err) callback(err);
            });
     callback("",req.params.roleId);
    
}

    exports.editUsers  = function(req, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var usr = conn.model('users',userSchema);
    usr.update({'id':req.params.userId},{$pushAll:{'roles':req.param('roles')}},function(err){
                if(err) callback(err);
            });
     callback("",req.params.userId);
    
}


    exports.delPermit  = function(req, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var permission = conn.model('permissions',permissionSchema);
    permission.remove({'id':req.params.permissionId},function(err){
                if(err) callback(err);
            });
     callback("",req.params.permissionId);
  }
  
    exports.userById  = function(id, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var user = conn.model('users',userSchema);
    user.find({'id':id}, function (err, usr) {
   if(err){
    onErr(err,callback);
   }else{
    //mongoose.connection.close();
	mongoose.disconnect()
    callback("",usr)
    }
})
  }
  
  exports.roleById  = function(id, callback){
    var conn = mongoose.createConnection('mongodb://ec2-54-201-137-219.us-west-2.compute.amazonaws.com:27017/userroles');
    var role = conn.model('roles',roleSchema);
    role.find({'id':{$in:id}}, function (err, re) {
   if(err){
    onErr(err,callback);
   }else{
    //mongoose.connection.close();
	mongoose.disconnect()
    callback("",re)
    }
})
  }






   
