'use strict';

exports.CLIENT_ORIGIN = "*";
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/bookmarksDb';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-bookmarkDb'|| 'mongodb://testuser:123456a@ds139920.mlab.com:39920/test-exp-db';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';