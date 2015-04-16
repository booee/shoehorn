// mochaaaaaaaaaa

var assert = require('assert');
var shoehorn = require('./shoehorn');

shoehorn.registerSchema('TestSchema', {
    'requiredNum': {
        type: Number,
        required: true
    },
    'someString': {
        type: String
    },
    'someDate': {
        type: Date // if Number, assumes Epoch. If String, assumes formated
    }
});

it('should work going from strings to types', function() {
    var someObj = {};
    someObj.requiredNum = '2';
    someObj.someString = 'asdf';

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 0);
    assert.equal(convertedObj.requiredNum, 2);
    assert.equal(convertedObj.someString, 'asdf');
});

it('should work going from types to other types', function() {
    var someObj = {};
    someObj.requiredNum = 2;
    someObj.someString = 2;
    someObj.someDate = new Date().toString();

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 0);
    assert.equal(convertedObj.requiredNum, 2);
    assert.equal(convertedObj.requiredNum, '2');
    assert.equal(convertedObj.someDate instanceof Date, true);
});
