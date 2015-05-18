$(function(){
    var common = require("./js/common"),
        async = require("async"),
        settings = require("./settings"),
        path = require("path"),
		fs= require('fs'),
        hasUnInstall = false;
		
	var cwd = process.cwd();
	var jar_home = cwd + "\\bin\\jre1.7.0_25";
	var jar_bin = jar_home + "\\bin;";
	var php_home = cwd + "\\bin\\php;";
	var npm_home = cwd + "\\bin\\npm";
	var npm_installed_bin = npm_home + "\\npm-data\\npm;"
	process.env.Jre_HOME = jar_home;
	process.env.Path = npm_installed_bin + npm_home + ";" + jar_bin + php_home + process.env.Path;
	process.env.NODE_PATH = npm_home + ";" + npm_home + "\\node_modules";
	console.log(process.env);
	
	var npmrc_file = cwd + "\\.npmrc";
	fs.unlink(npmrc_file);
	fs.writeFile(npmrc_file, "cache=" + npm_home + "\\npm-data\\npm-cache\nprefix=" + npm_home + "\\npm-data\\npm\nregistry=https://registry.npm.taobao.org");

   /**
    * 通过命令行检查是否安装了必要的软件
    */
   async.parallel([function(cb){
        common.execCommand(settings.command.checkNode,{encoding: 'utf-8'},function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        });
    },function(cb){
        common.execCommand(settings.command.checkJava,{encoding: 'utf-8'},function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        });
    },function(cb){
        common.execCommand(settings.command.checkPHP,function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        })
    },function(cb){
        // common.execCommand(settings.command.checkFis,function(err,stdout,stderr){
		common.execCommand(settings.command.checkFis + npmrc_file,function(err,stdout,stderr){
            var result = 1;
            if(err){
                result = 0;
            }
            cb(null,result);
        })
    }],function(err,values){//全部检查完成之后的回调
            console.log(values);
       var unsoft = [];
        for(var value in values){
            unsoft.push(values[value]);
            if(!parseInt(values[value])){
                hasUnInstall = true;
            }
        }

       if(hasUnInstall){
            window.location.href = "./install.html?unsoft=" + unsoft.toString();
       }else{
           window.location.href = "./main.html";
       }


    });




});

