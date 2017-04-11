///<refrence path='Scripts/jquery.js' />
///<refrence path='Scripts/Knockout.js' />
///<refrence path='Scripts/Underscore.js' />

var viewModel = function () {
    var sortConditions = ko.observableArray();
    var deepCopy = function (obj) {
        var out, len, i;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            out = [], i = 0;
            len = obj.length;
            for (; i < len; i++) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            out = {};
            for (i in obj) {
                if (obj[i] === null)
                    out[i] = null;
                else
                    out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    };
    var deleteFromList = function (data, event) {
        sortConditions.remove(this);
        updateList();
    }
    var rowAttributeList = [{ Name: "a", Description: "1" }, { Name: "b", Description: "2" }, { Name: "c", Description: "3" }, { Name: "d", Description: "4" }];
    var addCondition = function () {
        if (getRemaining())
        {
            var tempObj = {};
            tempObj.rowList = ko.observableArray(deepCopy(rowAttributeList));
            tempObj.columnName = ko.observable("");
            sortConditions.push(tempObj);
            updateList();
        }
        else {
            alert("Max Conditions Reached");
        }
    }
    var updateRowList = function (data, event) {
        if (event.originalEvent) {
            //console.log(event.target.value);
            data.columnName(event.target.value);
            updateList();
        }
    }
    var updateList = function () {
        _.each(sortConditions(), function (cndtn) {
            var columnName = cndtn.columnName();
            var remaining=getRemaining(cndtn);
            cndtn.rowList([]);
            cndtn.rowList(deepCopy(remaining));
            cndtn.columnName(columnName);
        });
    }
    var getRemaining = function (cndtn) {
        var selectedAttr = $.map(sortConditions(), function (x) { return x.columnName() });
        if (cndtn) {
            var remaining = _.filter(rowAttributeList, function (lst) {
                return $.inArray(lst.Name, selectedAttr) == -1 || lst.Name == cndtn.columnName()
            });
            return remaining;
        }
        else if (sortConditions().length ==rowAttributeList.length) {
            return false;
        }
        else{
            return true;
        }
    }
    return {
        sortConditions: sortConditions,
        rowAttributeList: rowAttributeList,
        addCondition: addCondition,
        updateRowList: updateRowList,
        deleteFromList: deleteFromList
    }
}();

ko.applyBindings(viewModel);