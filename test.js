// mochaaaaaaaaaa

var assert = require('assert');
var shoehorn = require('./shoehorn');

shoehorn.register('TestSchema', {
    'requiredNum': {
        type: Number,
        required: true,
        requiredErrorMessage: 'OMG this is required!'
    },
    'optionalNumber': {
        type: Number,
        typeErrorMessage: '"%s" is not a number!'
    },
    'optionalString': {
        type: String
    },
    'optionalDate': {
        type: Date // if Number, assumes Epoch. If String, assumes formated
    }
});

it('should work going from strings to types', function() {
    var someObj = {};
    someObj.requiredNum = '2';
    someObj.optionalString = 'asdf';

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 0);
    assert.equal(convertedObj.requiredNum, 2);
    assert.equal(convertedObj.optionalString, 'asdf');
});

it('should handle dates', function() {
    var now = new Date();

    var someObj = {};
    someObj.requiredNum = now;
    someObj.optionalString = now;
    someObj.optionalDate = new Date().toString();

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 0);
    assert.equal(convertedObj.requiredNum, now.getTime());
    assert.equal(convertedObj.optionalString, now.toString());
    assert.equal(convertedObj.optionalDate instanceof Date, true);
});

it('should catch type exceptions', function() {
    var someObj = {};
    someObj.requiredNum = 'a';

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 1);
    assert.equal(convertedObj.requiredNum, undefined);
});

it('should catch required exceptions', function() {
    var someObj = {};

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 1);
    assert.equal(convertedObj.requiredNum, undefined);
});

it('should use custom error messages', function() {
    var expectedRequiredErrorMessage = 'OMG this is required!';
        var expectedTypeErrorMessage = '"a" is not a number!';

    var someObj = {};
    someObj.optionalNumber = 'a';

    var convertedObj = shoehorn.bind('TestSchema', someObj);
    assert.equal(convertedObj.errors.length, 2);
    assert.equal(convertedObj.errors.indexOf(expectedRequiredErrorMessage) >= 0, true);
    assert.equal(convertedObj.errors.indexOf(expectedTypeErrorMessage) >= 0, true);
});
