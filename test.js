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
    }
});

it('should work', function() {
    var someObj = {};
    someObj.requiredNum = '2';
    someObj.someString = 'asdf';

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 0);
    assert.equal(convertedObj.requiredNum, 2);
    assert.equal(convertedObj.someString, 'asdf');
});
