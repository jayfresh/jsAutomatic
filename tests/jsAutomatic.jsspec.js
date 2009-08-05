// <![CDATA[
describe('Automatic(endHandler,errorHandler)', {
	'it should take a function as its optional first argument': function() {
		var a;
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			{a:'a'},
			"thisIsNotAFunction",
			true
		];
		for(var i=0;i<args.length;i++) {
			try {
				a = new Automatic(null,args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		value_of(exceptionCount).should_be(args.length);
		try {
			a = new Automatic(null,function() {});
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length);
	},
	'it should take a function as its optional second argument': function() {
		var a;
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			{a:'a'},
			"thisIsNotAFunction",
			true
		];
		for(var i=0;i<args.length;i++) {
			try {
				a = new Automatic(function() {}, args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		value_of(exceptionCount).should_be(args.length);
		try {
			a = new Automatic(function() {},function() {});
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length);
	},
	'it should return an object': function() {
		var a = new Automatic();
		value_of(typeof a).should_be('object');
		value_of(a).should_not_be_null();
		value_of(a).should_not_be_undefined();
	}
});
/*
describe('Automatic setContext(params) private method', {
	'it should take an object as its first argument': function() {
	
	},
	'it should set the "url" property of the context property of the Automatic object, if that property is present in params': function() {
	
	},
	'it should set the "method" property of the context property of the Automatic object, if that property is present in params': function() {
	
	},
	'it should set the "form" property of the context property of the Automatic object, if that property is present in params': function() {
	
	},
	'it should set the "userInputs" property of the context property of the Automatic object, if that property is present in params': function() {
	
	},
	'it should set the "nextStep" property of the context property of the Automatic object, if that property is present in params': function() {
	
	}
});

describe('Automatic end(status) private method', {
	'it should take a boolean as its optional first parameter': function() {
		
	},
	'it should call the endHandler method the Automatic object was constructed with, if status is true': function() {
	
	},
	'it should call the errorHandler method the Automatic object was constructed with, if status is false ': function() {
	
	}
});
*/
describe('Automatic.prototype.go(firstStep)', {
	'it should throw an exception if its first argument is not a string': function() {
		var a = new Automatic();
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			{a:'a'},
			true,
			function() {},
			null
		];
		for(var i=0;i<args.length;i++) {
			try {
				a.go(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			a.go();
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
	},
	'it should have set the nextStep property of context to firstStep by the time nextStep() is called': function() {
		var a = new Automatic();
		a.steps["does exist"] = {};
		var exceptionCount = 0;
	}
});

describe('Automatic.prototype.stop()', {
    'it should stop the progress of the Automatic if called': function() {
        var called = false;
        var endHandler = function() {
            called = "endHandler";
        };
        var errorHandler = function() {
            called = "errorHandler";
        };
        var a = new Automatic(endHandler,errorHandler);
        a.addStep('first', {
            handler: function() {
                a.stop();
            },
            nextStep: 'two'
        });
        a.addStep('two', {
            handler: function() {
                called = "two";
            }
        });
        a.go('first');
        value_of(called).should_be_false();
    }
});

describe('Automatic.prototype.addStep(name,obj)', {
	'it should throw an exception if a string is not provided as the first argument': function() {
		var a = new Automatic();
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			{a:'a'},
			true,
			null
		];
		for(var i=0;i<args.length;i++) {
			try {
				a.addStep(args[i],{});
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			a.addStep(undefined,{});
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
	},
	'it should throw an exception if an object is not provided as the second argument': function() {
		var a = new Automatic();
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			"thisIsNotAnObject",
			true,
			null
		];
		for(var i=0;i<args.length;i++) {
			try {
				a.addStep("a name",args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			a.addStep("a name");
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);

	},
	'it should add "obj" as the step named "name" in the steps array of the Automatic object': function() {
		var a = new Automatic();
		var obj = {
			test1:'test1',
			test2:'test2'
		};
		a.addStep("a name",obj);
		value_of(a.steps["a name"]).should_be(obj);
	}
});

describe('Automatic.prototype.branchStep(name)', {
    'it should throw an exception if a string is not provided as the first argument': function() {
        var a = new Automatic();
		var exceptionCount = 0;
		var args = [
			1,
			[1,2],
			{a:'a'},
			true,
			null
		];
		for(var i=0;i<args.length;i++) {
			try {
				a.branchStep(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			a.branchStep(undefined);
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
    },
    'it should throw an exception if the named step is not present in the steps array of the Automatic object': function() {
        var a = new Automatic();
        var exceptionCount = 0;
        try {
            a.branchStep('doesNotExist');
        } catch(ex) {
            exceptionCount++;
        }
        value_of(exceptionCount).should_be(1);
    },
    'it should set the current next step to the named step': function() {
        var a = new Automatic();
        var called = false;
        a.addStep('first', {
            handler: function() {
                a.branchStep('branch');
            },
            nextStep:'second'
        });
        a.addStep('branch', {
            handler: function() {
                called = true;
            }
        });
        a.addStep('second', {});
        a.go('first');
        value_of(called).should_be_true();
    }
});

describe('Automatic.prototype.nextStep()', {
	'it should throw an exception if there is no step with the name provided': function() {
		var a = new Automatic();
		a.steps["does exist"] = {};
		a.context = {
			nextStep:'does not exist'
		};
		var exceptionCount = 0;
		try {
			a.nextStep();
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(1);
		a.context.nextStep = 'does exist';
		tests_mock.before('Automatic.prototype.makeRequest',function() {});
		try {
			a.nextStep('does exist');
		} catch(ex) {
			exceptionCount++;
		}
		tests_mock.after('Automatic.prototype.makeRequest');
		value_of(exceptionCount).should_be(1);
	},
	'it should call makeRequest having set the context to the context of the next step': function() {
		tests_mock.before('Automatic.prototype.makeRequest',function() {
			value_of(this.context).should_be({
				url:'http://www.example.com'
			});
		});
		var a = new Automatic();
		a.context = {
			nextStep:'testStep'
		};
		a.addStep('testStep',{
			url:'http://www.example.com'
		});
		a.nextStep();
		tests_mock.after('Automatic.prototype.makeRequest');
	},
	'it should call the endHandler method if there is no next step': function() {
		var actual = false;
		var endHandler = function() {
			actual = true;
		};
		var a = new Automatic(endHandler);
		a.context = {};
		a.nextStep();
		value_of(actual).should_be_true();
	}
});

describe('Automatic.prototype.makeRequest()', {
	'it should make a HTTP request and use the Automatic object\'s data property as the POST data if the method is "POST"; otherwise it should use it as the query string for the request': function() {
	   var rootUrl = "http://www.google.com";
	   var dataIn = "test1=hello&test2=goodbye";
	   var count = 0;
	   tests_mock.before('httpReq', function(method,url,callback,params,headers,data) {
           count++;
	       if(count===2) {
    	       tests_mock.after('httpReq');
    	   }
	       if(method==="GET") {
	           value_of(url).should_be(rootUrl+'?'+dataIn);
	           value_of(data).should_be_null();
	       } else if(method==="POST") {
	           value_of(url).should_be(rootUrl);
	           value_of(data).should_be(dataIn);
	       }
	   });
	   var a = new Automatic();
	   a.context = {
	       url:rootUrl
	   };
	   a.data = dataIn;
	   a.makeRequest();
	   var a2 = new Automatic();
	   a2.context = {
	       method:'POST',
	       url:rootUrl
	   }
	   a2.data = dataIn;
	   a2.makeRequest();
	},
	'it should catch any exceptions thrown by the HTTP request and send them to the error function along with any error message specified for this step': function() {
		tests_mock.before('httpReq',function() {
			var e = new Error();
			e.message = "test error";
			e.name = "test HTTP error";
			throw e;
		});
		var errorHandler = function(ex,errorMessage) {
			value_of(ex.name).should_be('test HTTP error');
			value_of(ex.message).should_be('test error');
			value_of(errorMessage).should_be('first step error message');
		};
		var a = new Automatic(null,errorHandler);
		a.addStep('first step', {
			url:'http://www.example.com',
			errorMessage:'first step error message'
		});
		a.go('first step');
		tests_mock.after('httpReq');
	},
	'it should call extractData() with the returned responseText if there is a url specified': function() {
		tests_mock.before('Automatic.prototype.extractData',function(source) {
			value_of(source).should_be('test data');
			tests_mock.after('Automatic.prototype.extractData');
		});
		var a = new Automatic();
		a.context = {
			url:'test_data.txt',
			method:'GET'
		};
		a.makeRequest();
	},
	'it should call extractData() if there is no url specified': function() {
		var a = new Automatic();
		tests_mock.before('Automatic.prototype.extractData',function(source) {
			value_of(source).should_be_undefined();
			tests_mock.after('Automatic.prototype.extractData');
		});
		a.context = {};
		a.makeRequest();
	},
	'it should use method "GET" if there is a url specified but no method': function() {
		tests_mock.before('Automatic.prototype.extractData',function(source) {
			value_of(source).should_be('test data');
			tests_mock.after('Automatic.prototype.extractData');
		});
		var a = new Automatic();
		a.context = {
			url:'test_data.txt'
		};
		a.makeRequest();
	},
	'it should add any HTTP headers provided as the "headers" property to the request': function() {
		tests_mock.before('httpReq', function(type,url,callback,params,headers) {
			value_of(headers).should_not_be_undefined();
			value_of(headers["test"]).should_be("some_text");
		});
		var a = new Automatic();
		a.context = {
			url:'test_data.txt',
			headers:{
				test:"some_text"
			}
		};
		a.makeRequest();
		tests_mock.after('httpReq');
	}
});

describe('Automatic.prototype.extractData(source)', {
	'before_each': function() {
		source = '<html><body><form name="defaultForm"><input name="test1" type="hidden" value="hello"></input><input name="test2" type="text" value="good&bye"></input></form></body></html>';
		source2 = '<html><body><form id="defaultForm"><input name="test1" type="hidden" value="hello"></input><input name="test2" type="text" value="good&bye"></input></form></body></html>';
		source3 = '<html><body><form><input name="test1" type="hidden" value="hello"></input><input name="test2" type="text" value="good&bye"></input></form><form><input name="test3" type="hidden" value="hello again"></input><input name="test4" type="text" value="goodbye once more"></input></form></body></html>';
		f = document.createElement('form');
		f.id = "defaultForm";
		var i = f.appendChild(document.createElement('input'));
		i.name = "test1";
		i.value = "hello";
		var j = f.appendChild(document.createElement('input'));
		j.name = "test2";
		j.value = "good&bye";
		document.body.appendChild(f);
	},
	'after_each': function() {
		delete source;
		delete source2;
		delete source3;
		removeNode(f);
		delete f;
	},
	'it should throw an exception if the optional first argument is not a string or undefined': function() {
		var args = [
			1,
			[1,2],
			{a:'a'},
			true,
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				extractData(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		value_of(exceptionCount).should_be(args.length);
	},
	'it should set the "data" property to the POST-ready string created from all inputs of the target form in the HTML document created from "source", if the form is specified': function() {
		tests_mock.before('Automatic.prototype.nextStep',function() {
			try {
				value_of(this.data).should_be("test1=hello&test2=good%26bye");
			} catch(ex) {
				console.log(ex);
			}
			tests_mock.after('Automatic.prototype.nextStep');
		});
		var a = new Automatic();
		a.context = {
			form:'defaultForm'
		};
		a.extractData(source);

	},
	'it should set the "data" property to the POST-ready string created from all inputs of the target form in the current document if "source" is not provided, if the form is specified': function() {
		tests_mock.before('Automatic.prototype.nextStep',function() {
			try {
				value_of(this.data).should_be("test1=hello&test2=good%26bye");
			} catch(ex) {
				console.log(ex);
			}
			tests_mock.after('Automatic.prototype.nextStep');
		});
		var a = new Automatic();
		a.context = {
			form:'defaultForm'
		};
		a.extractData();
	},
	'it should look for the form by name first and then by ID': function() {
	   tests_mock.before('Automatic.prototype.nextStep',function() {
			try {
				value_of(this.data).should_be("test1=hello&test2=good%26bye");
			} catch(ex) {
				console.log(ex);
			}
			tests_mock.after('Automatic.prototype.nextStep');
		});
		var a = new Automatic();
		a.context = {
			form:'defaultForm'
		};
		a.extractData(source2);
	},
	'it should look for the form by index if the provided form parameter is a number': function() {
	   tests_mock.before('Automatic.prototype.nextStep', function() {
	       try {
	           value_of(this.data).should_be("test3=hello%20again&test4=goodbye%20once%20more");
	       } catch(ex) {
	           console.log(ex);
	       }
	       tests_mock.after('Automatic.prototype.nextStep');
	   });
	   var a = new Automatic();
	   a.context = {
	       form:1
	   };
	   a.extractData(source3);
	},
	'it should merge with keyValuePairs any custom key-value pairs supplied via the context\'s userInputs property': function() {
		tests_mock.before('Automatic.prototype.nextStep',function() {
			try {
				value_of(this.data).should_be("test1=hi&test2=good%26bye");
			} catch(ex) {
				console.log(ex);
			}
			tests_mock.after('Automatic.prototype.nextStep');
		});
		var a = new Automatic();
		a.context = {
			form:'defaultForm',
			userInputs: {
				'test1':'hi'
			}
		};
		a.extractData();
	},
	'it should use the handler method to process the extracted keyValuePairs if it is provided': function() {
		var a = new Automatic();
		var actual = "";
		tests_mock.before('Automatic.serialize',function(keyValuePairs) {
			actual = keyValuePairs;
		});
		a.addStep('a first step',{
			userInputs:{
				test1:'hello'
			},
			handler:function(keyValuePairs) {
				keyValuePairs.test1 = "hi!",
				keyValuePairs.test2 = "and this is a test"
			}
		});
		a.go('a first step');
		tests_mock.after('Automatic.serialize');
		value_of(actual).should_be({
			test1:"hi!",
			test2:"and this is a test"
		});
	},
	'it should pass to the handler the keyValuePairs as the first argument, the responseText as the second argument, the doc as the third argument and the Automatic object as the fourth argument': function() {
		var a = new Automatic();
		tests_mock.before('httpReq',function(type,url,callback) {
			callback(true,null,'test responseText');
		});
		a.addStep('a first step', {
			url:'http://www.example.com',
			userInputs:{
				test1:'value1'
			},
			handler:function(keyValuePairs,responseText,doc,scraper) {
				value_of(keyValuePairs).should_be({
					test1:'value1'
				});
				value_of(responseText).should_be('test responseText');
				// doc is not tested!
				value_of(scraper).should_be(a);
			}
		});
		a.go('a first step');
		tests_mock.after('httpReq');
	},
	'it should not create context.data until the handler function has run': function() {
		var a = new Automatic();
		var actual = "";
		a.addStep('a first step',{
			userInputs:{
				test1:'hello'
			},
			handler:function(keyValuePairs,responseText,doc,scraper) {
				value_of(scraper.data).should_be_undefined();
			}
		});
		a.go('a first step');
	},
	'it should set context.data to the empty string if neither form, nor userInputs nor handler are provided': function() {
		var a = new Automatic();
		var actual;
		tests_mock.before('Automatic.prototype.nextStep',function() {
			actual = this.data;
			tests_mock.frame['Automatic.prototype.nextStep'].savedFunc.call(this);
		});
		a.addStep('a first step',{});
		a.go('a first step');
		tests_mock.after('Automatic.prototype.nextStep');
		value_of(actual).should_be("");
	},
	'it should throw an exception if the specified form is not found': function() {
		var a = new Automatic();
		var exceptionCount = 0;
		a.addStep('a first step', {
			form:'doesNotExist'
		});
		try {
			a.go('a first step');
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(1);
	},
	'it should call Automatic.prototype.nextStep()': function() {
		tests_mock.before('Automatic.prototype.nextStep',function() {
			try {
				value_of(tests_mock.after('Automatic.prototype.nextStep').called).should_be_true();
			} catch(ex) {
				console.log(ex);
			}
		});
		var a = new Automatic();
		a.context = {
			form:'defaultForm',
		};
		a.extractData();
	}
});

describe('Automatic.prototype.addEndVars(obj)', {
	'it should throw an exception if its first argument is not an object': function() {
		var a = new Automatic();
		var args = [
			1,
			[1,2],
			"thisIsNotAnObject",
			true,
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				a.addEndVars(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			replaceValues();
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
	},
	'it should merge obj with the object passed as the second argument to the end function (which should be passed the data as the first argument)': function() {
		var endHandler = function(data,endVars) {
			value_of(endVars).should_be({
				test2:'value2'
			});
			value_of(data).should_be('test1=value1');
		};
		var a = new Automatic(endHandler);
		a.addStep('a first step', {
			userInputs:{
				test1:'value1'
			}
		});
		a.addEndVars({
			test2:'value2'
		});
		a.go('a first step');
	}
});

describe('Automatic.replaceValues(keyValuePairs,userInputs)', {
	'before_each': function() {
		replaceValues = Automatic.replaceValues;
		keyValuePairs = {
			key1:'value1',
			key2:'value2'
		};
		userInputs = {
			key2:'value1',
			key3:'value3'
		};
	},
	'after_each': function() {
		delete replaceValues;
		delete keyValuePairs;
		delete userInputs;
	},
	'it should throw an exception if it is not provided with an object as its first argument': function() {
		var args = [
			1,
			[1,2],
			"thisIsNotAnObject",
			true,
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				replaceValues(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			replaceValues();
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
	},
	'it should throw an exception if its optional second argument is not an object or undefined': function() {
		var args = [
			1,
			[1,2],
			"thisIsNotAnObject",
			true,
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				replaceValues(keyValuePairs,args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		value_of(exceptionCount).should_be(args.length);
	},
	'it should copy each property in "userInputs" into keyValuePairs, overwriting any existing properties': function() {
		replaceValues(keyValuePairs,userInputs);
		value_of(keyValuePairs.key1).should_be('value1');
		value_of(keyValuePairs.key2).should_be('value1');
		value_of(keyValuePairs.key3).should_be('value3');
	}
});

describe('Automatic.serialize(obj,encode)', {
	'before_each': function() {
		serialize = Automatic.serialize;
		obj = {
			key1:'val&ue1',
			key2:'val ue2',
			key3:'value3'
		};
	},
	
	'after_each': function() {
		delete obj;
		delete serialize;
	},

	'it should return a string': function() {
		value_of(typeof serialize(obj)).should_be('string');
	},
	'it should throw an exception if an object is not provided as the first argument': function() {
		var args = [
			1,
			[1,2],
			"thisIsNotAnObject",
			true,
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				serialize(args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		try {
			serialize();
		} catch(ex) {
			exceptionCount++;
		}
		value_of(exceptionCount).should_be(args.length+1);
	},

	'it should throw an exception if the optional second argument is not a boolean or undefined': function() {
		var args = [
			1,
			[1,2],
			"thisIsNotABoolean",
			{a:'a'},
			null
		];
		var exceptionCount = 0;
		for(var i=0;i<args.length;i++) {
			try {
				serialize(obj,args[i]);
			} catch(ex) {
				exceptionCount++;
			}
		}
		value_of(exceptionCount).should_be(args.length);
	},
	'it should uriEncode the output string if "encode" is true': function() {
		value_of(serialize(obj,true)).should_be(
			"key1=" + encodeURIComponent(obj.key1) +
			"&key2=" + encodeURIComponent(obj.key2) +
			"&key3=" + encodeURIComponent(obj.key3)
		);
	},
	'it should return a string structured for use as POST data or as a query string for a GET; the key and value of each property of obj are used as the key and value, respectively, of each item in the data string': function() {
		value_of(serialize(obj)).should_be("key1=val&ue1&key2=val ue2&key3=value3");
	}
});
// ]]>