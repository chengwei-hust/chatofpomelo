/**
 * Created by chengwei on 15-1-30.
 */

var groupsDao = require('../dao/groupsDao');



groupsDao.getGroupsByUid(4, function(results) {
   console.info(results);
});

groupsDao.getGroupsByUid(1, function(results) {
    console.info(results);
});