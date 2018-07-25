require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { Bookmark } = require('../items/models');

const {app, runServer, closeServer} = require('../server');  //import server.js and create variable for server.app

const expect = chai.expect;
chai.use(chaiHttp);

let token_test; //global variable

function seedBookmarkData() {
	console.info('seeding bookmark data');
	const seedData = [];

  for (i = 0; i < 5; i++) { //total 30 entries
    seedData.push({
		userId: userId,	//variable created at login under beforeEach
		category: 'Other',
		link: faker.internet.url(),
		description: faker.lorem.words(),
		importance: faker.lorem.words(),
		knowledge: faker.lorem.words()
  	},
	{
	    userId: userId, 
	    category: 'Front-end HTML',
		link: faker.internet.url(),
		description: faker.lorem.words(),
		importance: faker.lorem.words(),
		knowledge: faker.lorem.words()
	},
	{
	    userId: userId, 
	    category: 'Back-end Other',
		link: faker.internet.url(),
		description: faker.lorem.words(),
		importance: faker.lorem.words(),
		knowledge: faker.lorem.words()
	},
	{
	    userId: userId, 
	    category: 'Testing',
		link: faker.internet.url(),
		description: faker.lorem.words(),
		importance: faker.lorem.words(),
		knowledge: faker.lorem.words()
	});
  }
  return Bookmark.insertMany(seedData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('Bookmark API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);	//put environmental variables in Travis CI settings                                     
  });

  beforeEach(function() {
  	return chai.request(app)
  	.post('/users')
  	.send({firstName:'Roger', lastName:'Hwang', username:'rogertest', password:'123456'})
  	.then(function(res) {
  		userId = res.body.id; 
  		return chai.request(app)
  			.post('/auth/login')
  			.send({username:'rogertest', password:'123456'})
  			.then(function(res) {
  				token_test = res.body.authToken; //becomes global variable
  			})
  			.then(function() {
  				return seedBookmarkData();
  			});
  	});
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  //test get request for each category using for loop
  describe('GET endpoint', function() {

	  it('should 200 on GET requests', function() {
	    return chai.request(app)
	      .get('/items/api')
	      .then(function(res) {
	        expect(res).to.have.status(200);
	        expect(res).to.be.json;
	      });
	  });

      it('list bookmarks based on Other category on GET', function() {
        let res;
        
        return chai.request(app)   
          .get('/items/Other')
          .set('Authorization', `Bearer ${token_test}`)
          .then(function(_res) {
            res = _res;
            console.log(res.body)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.bookmarks).to.be.a('array');
            expect(res.body.bookmarks).to.have.lengthOf.at.least(1);

            const expectedKeys = ['created', 'category', 'link', 'description', 'knowledge', 'importance']; //'created' in response only. Id is in db.
            res.body.bookmarks.forEach(function(item) {
              expect(item).to.be.a('object');
              expect(item).to.include.keys(expectedKeys);
            });
            resBookmark = res.body.bookmarks[0];
            return Bookmark.findById(resBookmark.created); //find in db using id from response body (created).
          })
          .then(function(bookmark) {
            expect(resBookmark.created).to.equal(bookmark.id); //compare response body to db
            expect(resBookmark.category).to.equal(bookmark.category);
            expect(resBookmark.link).to.equal(bookmark.link);
            expect(resBookmark.description).to.equal(bookmark.description);
            expect(resBookmark.knowledge).to.contain(bookmark.knowledge);
            expect(resBookmark.importance).to.contain(bookmark.importance);
          });
      });

      it('list bookmarks based on Front-end HTML category on GET', function() {
        let res;
        
        return chai.request(app)   
          .get('/items/Front-end HTML')
          .set('Authorization', `Bearer ${token_test}`)
          .then(function(_res) {
            res = _res;
            console.log(res.body)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.bookmarks).to.be.a('array');
            expect(res.body.bookmarks).to.have.lengthOf.at.least(1);

            const expectedKeys = ['created', 'category', 'link', 'description', 'knowledge', 'importance']; //'created' in response only. Id is in db.
            res.body.bookmarks.forEach(function(item) {
              expect(item).to.be.a('object');
              expect(item).to.include.keys(expectedKeys);
            });
            resBookmark = res.body.bookmarks[0];
            return Bookmark.findById(resBookmark.created); //find in db using id from response body (created).
          })
          .then(function(bookmark) {
            expect(resBookmark.created).to.equal(bookmark.id); //compare response body to db
            expect(resBookmark.category).to.equal(bookmark.category);
            expect(resBookmark.link).to.equal(bookmark.link);
            expect(resBookmark.description).to.equal(bookmark.description);
            expect(resBookmark.knowledge).to.contain(bookmark.knowledge);
            expect(resBookmark.importance).to.contain(bookmark.importance);
          });
      });

      it('list bookmarks based on Back-end Other category on GET', function() {
        let res;
        
        return chai.request(app)   
          .get('/items/Back-end Other')
          .set('Authorization', `Bearer ${token_test}`)
          .then(function(_res) {
            res = _res;
            console.log(res.body)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.bookmarks).to.be.a('array');
            expect(res.body.bookmarks).to.have.lengthOf.at.least(1);

            const expectedKeys = ['created', 'category', 'link', 'description', 'knowledge', 'importance']; //'created' in response only. Id is in db.
            res.body.bookmarks.forEach(function(item) {
              expect(item).to.be.a('object');
              expect(item).to.include.keys(expectedKeys);
            });
            resBookmark = res.body.bookmarks[0];
            return Bookmark.findById(resBookmark.created); //find in db using id from response body (created).
          })
          .then(function(bookmark) {
            expect(resBookmark.created).to.equal(bookmark.id); //compare response body to db
            expect(resBookmark.category).to.equal(bookmark.category);
            expect(resBookmark.link).to.equal(bookmark.link);
            expect(resBookmark.description).to.equal(bookmark.description);
            expect(resBookmark.knowledge).to.contain(bookmark.knowledge);
            expect(resBookmark.importance).to.contain(bookmark.importance);
          });
      });

      it('list bookmarks based on Testing category on GET', function() {
        let res;
        
        return chai.request(app)   
          .get('/items/Testing')
          .set('Authorization', `Bearer ${token_test}`)
          .then(function(_res) {
            res = _res;
            console.log(res.body)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.bookmarks).to.be.a('array');
            expect(res.body.bookmarks).to.have.lengthOf.at.least(1);

            const expectedKeys = ['created', 'category', 'link', 'description', 'knowledge', 'importance']; //'created' in response only. Id is in db.
            res.body.bookmarks.forEach(function(item) {
              expect(item).to.be.a('object');
              expect(item).to.include.keys(expectedKeys);
            });
            resBookmark = res.body.bookmarks[0];
            return Bookmark.findById(resBookmark.created); //find in db using id from response body (created).
          })
          .then(function(bookmark) {
            expect(resBookmark.created).to.equal(bookmark.id); //compare response body to db
            expect(resBookmark.category).to.equal(bookmark.category);
            expect(resBookmark.link).to.equal(bookmark.link);
            expect(resBookmark.description).to.equal(bookmark.description);
            expect(resBookmark.knowledge).to.contain(bookmark.knowledge);
            expect(resBookmark.importance).to.contain(bookmark.importance);
          });
      });
  });

  describe('POST endpoint', function() {
    it('should add a new bookmark', function() {
	    const newBookmark = {
		    userId: userId, 
		    category: 'Front-end HTML',
			link: faker.internet.url(),
			description: faker.lorem.words(),
			importance: faker.lorem.words(),
			knowledge: faker.lorem.words()
		};

      return chai.request(app)
      .post('/items/entry')
      .set('Authorization', `Bearer ${token_test}`)
      .send(newBookmark)
        .then(function(res) {

          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'created', 'category', 'link', 'description', 'knowledge', 'importance');
          expect(res.body.created).to.not.be.null;
          expect(res.body.category).to.equal(newBookmark.category);
          expect(res.body.importance).to.equal(newBookmark.importance);
          expect(res.body.knowledge).to.equal(newBookmark.knowledge);
          expect(res.body.description).to.equal(newBookmark.description);
          expect(res.body.link).to.equal(newBookmark.link);
          return Bookmark.findById(res.body.created);
        })
        .then(function(bookmark) {
          expect(bookmark.category).to.equal(newBookmark.category);
          expect(bookmark.importance).to.equal(newBookmark.importance);
          expect(bookmark.description).to.equal(newBookmark.description);
          expect(bookmark.knowledge).to.equal(newBookmark.knowledge);
          expect(bookmark.link).to.equal(newBookmark.link);
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        description: 'setting up forms',
        category: 'Other'
      };

      return Bookmark
        .findOne()
        .then(function(bookmark) {
          updateData.id = bookmark.id;
          return chai.request(app)
            .put(`/items/update/${bookmark.id}`)
            .set('Authorization', `Bearer ${token_test}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);

          return Bookmark.findById(updateData.id);
        })
        .then(function(bookmark) {
          expect(bookmark.description).to.equal(updateData.description);
          expect(bookmark.category).to.equal(updateData.category);
        });
    });
  });

});