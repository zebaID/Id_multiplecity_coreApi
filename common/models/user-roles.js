module.exports = function(UserRoles) {

	UserRoles.fetchTiles = function(conUserId, cb) {

        // sql query to get details of function

        var sql = 'select tm.id as "tileId",tm.tile_name as "tileName",tm.icon_name as "iconName",tm.initial as "initial",tm.outside_color as "outsideColor",tm.inside_color as "insideColor",tm.url as "url", tm.sref as "sref" '+
				  ' from tiles tm, roles r,role_accesses ra, user_roles ur '+
                  ' where ra.role_id = r.id and ra.tile_id = tm.id and ur.role_id =r.id  and ur.conuser_id = '+conUserId+' order by tm.id ' ;
                  
            // call sql query from postgreSQL
        UserRoles.app.datasources.postgres.connector.query(sql, function(err, result) {
            if (err) {
                console.log('Error to fetch tiles ...');
                console.log(err);
                return cb(err);
            }
            cb(err, result);
        });

    };

    //Remote method to fetch tile details

    UserRoles.remoteMethod(
        'fetchTiles', {
        	 accepts: {
                arg: 'conUserId',
                type: 'string',
                required: true
            },
            returns: [{
                type: 'string',
                required: true,
                root: true
            }],
            http: {
                verb: 'get'
            }
        }
    );
};
