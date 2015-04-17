# shoehorn

So, you're writing a web app. You've got your express app, you're handling the form data, but you need an easy way to enforce formats on the incoming requests that plays nicely with your already-created application...

Just shoehorn it

#### Install
```
npm install shoehorn
```

#### Require
```
var shoehorn = require('shoehorn');
```

#### Usage

##### .register(name, schema)
Declares a schema to use during the binding process

```
var loginFormSchema = {
    'userName': {
        type: String,
        required: true,
        requiredErrorMessage: 'Please input your userName'
    },
    'password': {
        type: String,
        required: true,
        requiredErrorMessage: 'Please input your password'
    },
    'pinNumber': {
        type: Number,
        typeErrorMessage: '%s is not a valid PIN' // %s will be replaced with the value
    }
};

shoehorn.register('LoginForm', loginFormSchema);
```

Schema supports 4 parameters:
* `type` - (Required) type of the form's variable, currently only `Date`, `String`, and `Number`
* `typeErrorMessage` - (Optional) A custom message should type conversion fail. If not included, an automated version will be generated
* `required` - (Optional) A boolean; if left `true`, then the `requiredErrorMessage` will be added to the output in the event there is no value to convert. Left false, undefined may be set in the event there is no value to convert.
* `requiredErrorMessage` - (Optional) A custom message should the value to convert be undefined. If not included, an automated version will be generated

##### .bind(name, obj)
Binds an object to a desired schema type, enforcing the declared requirements

```
var app = express();

// config express application

// register your login schema (see above example)

app.post('/login', function(req, res) {
    var loginForm = shoehorn.bind('LoginForm', req.body);

    if(loginForm.errors.length > 0) {
        console.error('Form was submitted with errors!');
        res.send(loginForm.errors);
    } else {
        // process login
    }
});
```

#### class: Form
Returned from the `shoehorn#bind(name, obj)` execution

##### Form.errors()
Array of any errors encountered during the binding process.

#### Misc notes

##### Dates
* Going to a `Date` from a `Number`, assumes this is an epoch timestamp
* Going from a `Date` from a `String`, assumes this is a formatted `String`
* Going to a `Number` from a `Date`, creates an epoch timestamp (`Date.getTime()`)
* Going to a `String` from a `Date`, creates a formatted `String` (`Date.toString()`)
