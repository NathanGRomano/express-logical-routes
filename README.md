# Express Logical Routes (WIP)


Now you can reuse your business rules all over the place

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

    app.put('/user/:id/edit', getUser, or(isAdmin, isSameUser), function (req, res) {
      util.extend(req.user, req.body)
      req.user.save(function (err) {
        res.redirect('/user/'+req.user.id);
      })
    })

    app.post('/user/:id/items', getUser, or(isAdmin, isSameUser), function (req, res) {
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

Or better yet

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

