module.exports = (function(){
    "use strict";
    const collectionVideos = "videos"; 
    var video = {};

    function response(res, statusCode, ending, callback){
        callback();
        return res.status(statusCode).end(ending);
    }
//--------------------------------------------------------------------------------------------
    video.addVideo = function(res, req, result, videoContent, database, callback){
        var collection = database.collection(collectionVideos);
        var date = new Date();
        var lastUpdated = date;
        var id = result.public_id;
        var url = result.secure_url;
        // insert the data about the video
        collection.insert({...videoContent, _id: id, url: url, uploadDate: date, lastUpdated: lastUpdated}, function(err, videoObj){
            if(err) return response(res, 500, err, callback);
            callback();
            return res.json(videoObj);
        });
    }

    video.getVideo = function(res, req, videoId, database, callback){
        var collection = database.collection(collectionVideos);
        collection.findOne({_id: videoId}, function(err, videoObj){
            if(err) return response(res, 500, err, callback);
            if(!videoObj) return response(res, 404, "video not found", callback);
            callback();
            return res.json(videoObj);
        });
    }

    video.getAllVideosFromCreator = function(res, req, username, database, callback){
        var collection = database.collection(collectionVideos);
        collection.find({poster: username}).toArray(function(err, videoObjs){
            if(err) return response(res, 500, err, callback);
            callback();
            return res.json(videoObjs);
        });
    }

    return video;
})();
