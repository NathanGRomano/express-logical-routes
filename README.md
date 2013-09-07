# Express Logical Routes (WIP)

A library built on top of async to apply business rules to routes as middleware.

Now you can reuse your business rules all over the place.

## Getting Started

     npm install
     npm test

Instead of doing something along these lines:

    app.put('/user/:id/edit', getUser, function (req, res) {
      if (!(req.currentUser.isAdmin || req.currentUser.id == req.user.id))
	return new Error('Unauthorized')
      util.extend(req.user, req.body)
      req.user.save(function (err) {
        res.redirect('/user/'+req.user.id);
      })
    })

    app.post('/user/:id/items', getUser, function (req, res) {
      if (!(req.currentUser.isAdmin || req.currentUser.id == req.user.id))
	return new Error('Unauthorized')
      UserItem(req.body).save(function (err, doc) {
        res.redirect('/user/'+req.user.id+'/item/'+doc._id);
      })
    })

    //And so on!

We can do this

    app.put('/user/:id/edit', getUser, or(isAdmin, isSameUser).then(editUser))

    app.post('/user/:id/items', getUser, or(isAdmin, isSameUser).then(addItem))

		function editUser (err, req, res, next) {
			if (err) next(err);
      util.extend(req.user, req.body)
      req.user.save(function (err) {
        res.redirect('/user/'+req.user.id);
      })
    }

		function addItem (err, req, res, next) {
			if (err) return next(err);
      UserItem(req.body).save(function (err, doc) {
        res.redirect('/user/'+req.user.id+'/item/'+doc._id);
      })
    }

    function isAdmin (req, res, next) {

      next(req.currentUser.isAdmin);
    }

    function isSameUser (req, res, next) {
      next(req.currentUser.id == req.user.id);
    }

Or even 

    var getAndValidateUser = [getUser, or(isAdmin, isSameUser)];
    
    app.put('/user/:id/edit', getAndValidateUser , function (req, res) {
      util.extend(req.user, req.body)
      req.user.save(function (err) {
        res.redirect('/user/'+req.user.id);
      })
    })

    app.post('/user/:id/items', getAndValidateUser, function (req, res) {
      UserItem(req.body).save(function (err, doc) {
        res.redirect('/user/'+req.user.id+'/item/'+doc._id);
      })
    })

    function isAdmin (req, res, next) {
      next(req.currentUser.isAdmin);
    }

    function isSameUser (req, res, next) {
      next(req.currentUser.id == req.user.id);
    }

