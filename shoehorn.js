var Map = require('hackmap');

function FormBinder() {
    var models = new Map();

    this.registerSchema = function(name, schema) {
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
        var instance = {};
        instance.errors = [];
        for(variableName in model) {
            try {
                instance[variableName] = getField(variableName, model[variableName], obj[variableName]);
            } catch(err) {
                instance.errors.push(err);
            }
        }

        return instance;
    }

    function getField(variableName, constraints, value) {
        if(!value) {
            if(constraints.required) {
                throw (constraints.requiredErrorMessage) ? constraints.requiredErrorMessage : variableName + ' is required';
            } else {
                return undefined;
            }
        }

        var converted = convert(constraints.type, value);
        if(converted === undefined) {
            throw (constraints.typeErrorMessage) ? constraints.typeErrorMessage : variableName + ' is invalid: ' + value;
        } else {
            return converted;
        }
    }

    function convert(toType, value) {
        if(!toType) return value;

        if(toType === Number) {
            var num = new Number(value);
            return (num !== NaN) ? num : undefined;
        } else if(toType === String) {
            return new String(value);
        } else if(toType === Date) {
            return new Date(value);
        }

        throw 'Unable to convert to unknown type: ' + toType;
    }
}

var singleton = new FormBinder();

module.exports = singleton;
