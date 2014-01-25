var util = require('util')
var async      =  require('async')
var foodModel = require('../model/userModel')

    exports.userSignup= function(req,res){
    foodModel.userSignup(req, function(err,name){
        if(err){
            console.log(err)
            res.json({isSuccess:false});
        }
        else
        //res.render('food', { firstName: req.param('first_name'), lastName: req.param('last_name')});
            res.json({isSuccess:true})
    });
}

    exports.userLogin= function(req,res){
    foodModel.userLogin(req, function(err,pwdMatched){
        if(err){
            res.send("Error in Extracting the data from DB");
        }
        console.log("Nutrient is is "+pwdMatched);
        //res.render('food', { title: pwdMatched, nutrient: pwdMatched});
        res.json({isAuthorized:pwdMatched})
    });
}

    exports.getPerms = function(req,res){
	var perms = [];
    foodModel.userById(req.params.userId, function(err,usr){
        if(err){
            res.json({Err:true});
        }
        var x = JSON.stringify(usr)
        var w = JSON.parse(x)[0]
		//console.log(w);
		
		   
		   foodModel.roleById(w.roles,function(err,rle){
		   if(err){
            res.json({Err:true});
        }
		//console.log(rle);
		for(i in rle){
        //var A = JSON.stringify(rle[i])
        //var B = JSON.parse(A)[0]
		console.log(rle[i].permissions);
		//for(pers in rle[i].permissions){
		// perms.push(rle[i].permissions[pers]);}
		perms =  perms.concat(rle[i].permissions);
		}
		 res.json(perms);  
		
		});
	});
}

    exports.permit= function(req,res){
    foodModel.permit(req, function(err,name){
        if(err){
            res.json({isSuccess:false});
        }
        else
            res.json({isSuccess:true})
    });
}

     exports.editUsers= function(req,res){
    foodModel.editUsers(req, function(err,name){
        if(err){
            res.json({isSuccess:false});
        }
        else
            res.json({isSuccess:true})
    });
}

    exports.role= function(req,res){
    foodModel.role(req, function(err,name){
        if(err){
            res.json({isSuccess:false});
        }
        else
            res.json({isSuccess:true})
    });
     }

    exports.editPerms = function(req,res){
    foodModel.editPerms(req, function(err,wallComments){
        if(err){
            res.json({isSuccess:false})
        }
        else {
            res.json({isSuccess:true})
        }
    })
    }

    exports.checkPermission= function(req,res){
	var perms = [];
	console.log(req.query.userId)
    foodModel.userById(req.query.userId, function(err,usr){
        if(err){
            res.json({Err:true});
        }
        var x = JSON.stringify(usr)
        var w = JSON.parse(x)[0]
		foodModel.roleById(w.roles,function(err,rle){
		   if(err){
            res.json({Err:true});
        }
		for(i in rle){
       	console.log(rle[i].permissions);
		perms =  perms.concat(rle[i].permissions);
		}
		for(j in perms){
		if(perms[j]==req.query.permissionId){
		res.json({isSuccess:true});
		}}
		res.json({isSuccess:false});  
		});
	});
}

    exports.delPermit= function(req,res){
    foodModel.delPermit(req, function(err,permit){
        if(err){
            res.json({isDeleted:false});
        }
        else
            res.json({isDeleted:true})
    });
}
 