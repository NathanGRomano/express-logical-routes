# Express Logical Routes (WIP)

A library built on top of async to apply business rules to routes as middleware.

Now you can reuse your business rules all over the place.

## Getting Started

     npm install
     npm test

Typically writing business rules in your routes may look like this.

```javascript
app.put('/user/:id/edit', getUser, editUser )

app.post('/user/:id/items', getUser, addItem )

function editUser (req, res) {
	if (!(req.currentUser.isAdmin || req.currentUser.id == req.user.id))
		return next(Error('Unauthorized'))
	util.extend(req.user, req.body)
	req.user.save(function (err) {
		res.redirect('/user/'+req.user.id);
	})
}

function addItem (req, res) {
	if (!(req.currentUser.isAdmin || req.currentUser.id == req.user.id))
		return next(Error('Unauthorized'))
	UserItem(req.body).save(function (err, doc) {
		res.redirect('/user/'+req.user.id+'/item/'+doc._id);
	})
}

//And so on!
```

Notice we have duplicated this line 

```javascript
if (!(req.currentUser.isAdmin || req.currentUser.id == req.user.id))
	return next(Error('Unauthorized'))
```

Instead of copying and pasting that logic around we can put it into middleware functions 

```javascript
var isAdmin = function (req, res, next) { next(req.user.isAdmin) }
  , isSameUser = function (req, res, next) { next(req.user.id == req.target.id) }
```

Now lets wrap those logical tests into an or() 

```javascript
app.put('/user/:id/edit', getUser, or(isAdmin, isSameUser).then(editUser))

app.post('/user/:id/items', getUser, or(isAdmin, isSameUser).then(addItem))

//we took out the busness logic out of our domain logic

function editUser (req, res, next) {
	util.extend(req.user, req.body)
	req.user.save(function (err) {
		res.redirect('/user/'+req.user.id);
	})
}

function addItem (req, res, next) {
	UserItem(req.body).save(function (err, doc) {
		res.redirect('/user/'+req.user.id+'/item/'+doc._id);
	})
}
```

Or we could combine the isAdmin and isSameUser into a middleware

```javascript
var isValidUser = or(isAdmin, isSameUser)
```
and then apply it

```javascript
app.put('/user/:id/edit', getUser, isValidUser.succeed(editUser))

app.post('/user/:id/items', getUser, isValidUser.succeed(addItem))
```
Here we used the "succeed()" method to editUser and addItem, we can also support a failure

```javascript
app.put('/user/:id/edit', getUser, isValidUser.succeed(editUser).failure(goAway))

app.post('/user/:id/items', getUser, isValidUser.succeed(addItem).failure(goAway))
```

Say we want to combine all this logic into a single object

```javascript
var getAndValidateUser = [getUser, or(isAdmin, isSameUser).failure(goAway)];

app.put('/user/:id/edit', getAndValidateUser , editUser)

app.post('/user/:id/items', getAndValidateUser, addItem)
```

## API

### fn(method)

This method will build us a function that will internally used the passed async method

e.g.

```javascript
var every = fn('every')
	, validUser = every( isLoggedIn, isAllowed )
```

This object has the following chainable methods 

#### succeed(fn)

When the operation succeeds, the passed method will be called

```javascript
validUser.succeed(function (req, res, next) { /* do something */ next() })
```

#### failure(fn)

When the operation fails, the passed method will be called

```javascript
validUser.failure(function (req, res, next) { /* do something with the errors */ next() })
```

The errors are stored on the request object

```javascript
every.failure(function (req, res, next) {
	res.status(400).json(req.errors);
});
```

#### then(fn)

After the succeed() or failure() method is called then the fn() passed will be called

```javascript
validUser
	.succeed(function (req, res, next) { 
		req.awesome = true
	})
	.then(function (req,res) { 
		res.json({awesome:req.awesome}) 
	})
```

### and(...)

This method will produce an object with the same chainable functions as the result of fn('every')

```javascript
var validUser = and (isLoggedIn, isAllowedToView)
	.failure(function (req, res) { 
		res.status(403).json(req.errors)
	})

app.get('/resource/:id', validUser, getResource);
```

### or(...)

This method will produce an object with the same chainable functions as the result of fn('some')

```javascript
var validUser = or (isAdmin, isAllowedToView )

app.get('/resource/:id', validUser, getResource);
```

### not(...)

This method will produce an object with the same chainable functions as the result of fn('every') but only supports
one middleware function

```javascript
var notLoggedIn = not(isLoggedIn);

app.get('/resource/:id', notLoggedIn.succeed(showLogin), validUser, getResource);
```
