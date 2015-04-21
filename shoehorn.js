var Map = require('hackmap');
var util = require('util');

function Shoehorn() {
    var models = new Map();

    this.register = function(name, schema) {
        if(models.containsKey(name)) {
            console.warn('Overriding pre-existing schema: ' + name);
        }

        models.put(name, schema);
    }

    this.bind = function(name, obj) {
        var model = models.get(name);

        if(model) {
            return createFromSchema(model, obj)
        } else {
            throw 'Unknown schema: ' + name;
        }
    }

    // TODO: can make this parallel for better speeeeeeds
    function createFromSchema(model, obj) {
        var bindingResult = {};
        bindingResult.errors = [];
        bindingResult.form = {};

        for(variableName in model) {
            try {
                bindingResult.form[variableName] = getField(variableName, model[variableName], obj[variableName]);
            } catch(err) {
                bindingResult.errors.push(err);
            }
        }

        return bindingResult;
    }

    function getField(variableName, constraints, value) {
        if(!value) {
            if(constraints.required) {
                var requiredError = constraints.requiredErrorMessage;
                throw (requiredError) ? requiredError : util.format('%s is required', variableName);
            } else {
                return undefined;
            }
        }

        var converted = convert(constraints.type, value);
        if(converted === undefined) {
            var typeError = constraints.typeErrorMessage;

            if(typeError) {
                if(typeError.indexOf('%s') >= 0) {
                    typeError = util.format(typeError, value);
                }
            } else {
                typeError = util.format('"%s" is an invalid value for %s', String(value), variableName);
            }

            throw typeError;
        } else {
            return converted;
        }
    }

    function convert(toType, value) {
        if(!toType) return value;

        if(toType === Number) {
            var num = Number(value);
            return (!isNaN(num)) ? num : undefined;
        } else if(toType === String) {
            return String(value);
        } else if(toType === Date) {
            return new Date(value);
        }

        throw 'Unable to convert to unknown type: ' + toType;
    }
}

var singleton = new Shoehorn();

module.exports = singleton;
