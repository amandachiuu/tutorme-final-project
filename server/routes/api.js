const express = require('express');
const bodyParser = require('body-parser');

const router = new express.Router();

const User = require('mongoose').model('User');
const TutorRequest = require('mongoose').model('TutorRequest');
const Course = require('mongoose').model('Course');

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message.",
    // user values passed through from auth middleware
    user: req.user
  });
});

router.get('/myprofile', (req, res) => {
  res.status(200).json({
    // user values passed through from auth middleware
    user: req.user
  });
});

router.put('/users/updateBio', (req, res) => {
  const userQuery = {'netid': req.user.netid};
  User.findOneAndUpdate(userQuery, req.body, {new: true}, function(err, user){
      if (err) res.status(500).send({ error: err });
      res.send(user);
  });
});

router.post('/users/addTutorCourse', (req, res) => {
  // console.log("req.body: ", req.body);
  const newTutorRequest = new TutorRequest(req.body);
  newTutorRequest.save(function (err, tutorReq, count) {
    if (err) return res.status(500).send({ error: err });
    // console.log('added new tutor req', tutorReq);
    Course.findOne(
      {'courseCode': tutorReq.courseCode},
      function(err, courseFound){
        if (err) return res.status(500).send({ error: err });
        if (!courseFound) {
          const courseData = {
            courseCode: tutorReq.courseCode,
            availableTutors: [tutorReq._id]
          }
          const newCourse = new Course(courseData);
          newCourse.save(function(err, course, count) {
            if (err) return res.status(500).send({error: err});
            // console.log("new course added and tutor added: ", course);
          });
        } else {
          courseFound.update(
            {$push: {availableTutors: tutorReq._id}},
            {},
            function(err, course, count) {
              if (err) return res.status(500).send({error: err});
              // console.log('added tutor to Course: ', course);
            }
          );
        }
        // User.findOneAndUpdate(
        //   {'netid': tutorReq.tutorId},
        //   {$push: {coursesAsTutor: tutorReq._id}},
        //   {safe: true, upsert: true, new: true},
        //   function(err, user){
        //     if (err) return res.status(500).send({ error: err });
        //     user.populate('coursesAsTutor');
        //     res.status(200).send(user);
        // });
        User.findOneAndUpdate(
          {'netid': tutorReq.tutorId},
          {$push: {coursesAsTutor: tutorReq._id}},
          {safe: true, upsert: true, new: true})
          .populate('coursesAsTutor')
          .exec(function(err, user){
            if (err) return res.status(500).send({ error: err });
            res.status(200).send(user);
          })
    });
  });
});

router.post('/users/addTuteeCourse', (req, res) => {
  console.log(req.user.netid, req.body);
  User.findOneAndUpdate(
    {'netid': req.user.netid},
    {$set: {coursesAsTutee: req.body.coursesAsTutee}},
    {safe: true, upsert: true, new: true},
    function(err, user){
      if (err) return res.status(500).send({ error: err });
      res.status(200).send(user);
  });
});

router.get('/users/:netid', (req, res) => {
  User.findOne({'netid': req.params.netid})
  .populate('coursesAsTutor')
  .exec(function(err, user) {
    if (err) res.status(500).send({error: err});
    res.status(200).send(user);
  });
});

router.get('/tutorreq/:slug', (req, res) => {
  TutorRequest.findOne({'slug': req.params.slug}, function(err, tutorReq) {
    if (err) res.status(500).send({error: err});
    res.status(200).send(tutorReq);
  })
});

router.get('/search', (req,res) => {
  // console.log(req.query);
  Course.findOne({'courseCode': req.query.criteria})
  .populate('availableTutors')
  .exec(function(err, results) {
      if (err) return res.status(500).send({ error: err });
      res.status(200).send(results);
    }
  );
});



module.exports = router;
