/************************
* jsAutomatic  *
* v1.0, 5/8/09 *
*************************

Description:
The Automatic object provides methods which allow you to describe a set of interactions or 'steps'
with a remote system that achieves a particular goal, e.g. adding an item to a database. It assumes
that each interaction is made up of an HTTP request to the remote system, which returns HTML containing
a form, that itself contains the INPUT elements used to construct the next request to the system. It is
possible to provide custom inputs at this point, useful if, for instance, the system expects human input.
The last part in the interaction is to create a data string suitable for use by the next interaction.

Creating a new Automatic:
	var a = new Automatic(endHandler);

where:
	endHandler is a function to call when the step is done; endHandler is called with the Automatic object as a parameter

Adding a generic step to the Automatic:
	a.addStep(name,{
		url:"http://www.example.com",
		method:"POST",
		form:"DefaultForm",
		userInputs:{
			i_1:"some",
			i_2:"test",
			i_3:"custom",
			i_4:"data"
		},
		handler:myHandlerFunc,
		errorMessage:"Error getting http://www.example.com",
		nextStep:"TestStep2"
	});

where:
	name is a string used to identify this step
	url is the url for the remote system used in this step
	method is the HTTP verb used in this step
	form is the name or id of the form to look for in the response from the host (name used in preference)
	customInputs is an object of extra/replacement key-value pairs to include in data sent to the host
	handler is a function that gives you access to the key-value pairs, the responseText, any HTML document created from that and the Automatic object before moving onto the next step
	errorMessage is the message to put in the error thrown if the HTTP request fails
	nextStep is the 'name' of the step to use next

Starting off a series of steps: 
	a.go(firstStep);

where:
	firstStep is the value of the 'name' key of the step to start from

Often you will want to use some data in the first request, which can come from the current document. If a step does not have a url parameter, the current document will be searched for the form instead. If you provide a userInputs parameter, these will be used even if there is no form parameter. An as example, a pair of steps, starting by pulling data from a form in the document:
	a.addStep('a first step', {
		form:'myForm',
		nextStep:'login'
	});
	a.addStep('login', {
		url:'http://www.mydomain.com/login',
		method:'POST'
	});
	a.go('firstStep');

This example illustrates the use of custom inputs in the first step:
	a.addStep('another first step', {
		userInputs: {
			name:'ANOther',
			password:'password'
		},
		nextStep('login')
	});
	a.addStep('login', {
		url:'http://www.mydomain.com/login',
		method:'POST'
	});

Using a custom handler function in a step:
	a.addStep('myCustomStep', {
		form:'DefaultForm',
		userInputs:{
			test1:'testValue'
		},
		handler:function(keyValuePairs,responseText) {
			global_var_step_length = responseText.length;
		}
	});

handler is called with the keyValuePairs as the first argument, the responseText as the second argument, the doc as the third argument and the Automatic object as the fourth argument

Error handling:
	a.addStep('myErrorStep', {
		url:'http://www.doesnotexist.om',
		errorMessage:'Error in myErrorStep'
	});

If an exception occurs during the HTTP request for a step, errorMessage will be passed to the Automatic error function along with the exception.

Branching:
	function firstBit() {
		var a = new Automatic(secondBit);
		a.addStep('a first step', {
			url:'http://www.example.com/step1',
			handler:function(keyValuePairs,responseText,doc,scraper) {
				var skipAStep;
				if(responseText.indexOf('Skip this step')!==-1) {
					skipAStep = true;
				} else {
					skipAStep = false;
				}
				scraper.addEndVars({
					skipAStep:skipAStep,
					keyValuePairs:keyValuePairs
				});
			}
		});
	}
	function secondBit(params) {
		var skipAStep = params.skipAStep;
		var keyValuePairs = params.keyValuePairs;
		var a = new Automatic();
		a.addStep('handleBranch', {
			userInputs:keyValuePairs,
			url:skipAStep ? http://www.example.com/step3 : http://www.example.com/step2
		});
	}

Future Development ideas
------------------------

1. Branching

Branching is not currently very easy, but you can do it. By branching, the general case I am referring to is changing the logical
progression through a series of steps based on the response to a request. The example above illustrates one method of branching, using
the Automatic object's addEndVars method to set some variables to be passed through to the second stage, which is called as the
endHandler to the first stage. The first step of the second stage deals uses the passed variables to decide, in this case, which url
to call - it could just as easily make a decision about which nextStep to set.

What we really want to be able to do for branching is something like this:
	var a = new Automatic();
	a.addStep('a first step', {
		url:'http://www.example.com/step1',
		handler:function() {
			if(responseText.indexOf('Skip this step')!==-1) {
				stepVars.skipAStep = true;
			} else {
				stepVars.skipAStep = false;
			}
		},
		nextStep:'my branching step'
	});
	a.addStep('my branching step', {
		url:stepVars.skipAStep ? http://www.example.com/step3 : http://www.example.com/step2
	});

This is not doable with the current framework, since the variable stepVars.skipAStep used when adding 'my branching step' would be evaluated at the moment of adding the step, not when the step is called, which is the desirable behaviour. A way around this could be to use a function for the second argument of the addStep method, although I have not worked through this idea yet. (22/10/08)

2. use of 'this' in handler functions to represent the Automatic object (5/8/09)

3. At the moment, all errors other than HTTP request errors are handled by throwing exceptions with internal information; this could change to include step-specific information and be routed through the Automatic error function.

*/

function Automatic(endHandler,errorHandler) {
	if(endHandler && typeof endHandler !== "function") {
		var e = new Error();
		e.message = "Error in Automatic constructor - first argument should be a function or undefined";
		throw e;
	} else {
	   this.endHandler = endHandler;
	}
	if(errorHandler && typeof errorHandler !== "function") {
		var e = new Error();
		e.message = "Error in Automatic constructor - second argument should be a function or undefined";
		throw e;
	} else {
	   this.errorHandler = errorHandler;
	}
	this.steps = {};
	this.endVars = {};
	this.context = {};
	this.setContext = function(params) {
		this.context = {};
		if(params.url) {
			this.context.url = params.url;
		}
		if(params.method) {
			this.context.method = params.method;
		}
		if(params.headers) {
			this.context.headers = params.headers;
		}
		if(params.form) {
			this.context.form = params.form;
		}
		if(params.userInputs) {
			this.context.userInputs = params.userInputs;
		}
		if(params.handler) {
			this.context.handler = params.handler;
		}
		if(params.errorMessage) {
			this.context.errorMessage = params.errorMessage;
		}
		if(params.nextStep) {
			this.context.nextStep = params.nextStep;
		}
	};
	// note: should think about whether this is what I really want to do - thinking about chucking this.data or putting it second
	this.end = function() {
		this.endHandler ? this.endHandler(this.data,this.endVars) : this.genericEnd(this.data,this.endVars);
	};
	this.error = function(ex,errorMessage) {
		this.errorHandler ? this.errorHandler(ex,errorMessage) : this.genericError(ex,errorMessage);
	};
	this.genericEnd = function(data,endVars) {
		console.log('genericEnd',data,endVars);
	};
	this.genericError = function(ex,errorMessage) {
		console.log('genericError',ex,errorMessage);
	};
}

Automatic.prototype.go = function(firstStep) {
	if(!firstStep || typeof firstStep !== 'string') {
		var e = new Error();
		e.message = 'Error in Automatic.prototype.go - the first argument should be a string';
		throw e;
	}
	this.context.nextStep = firstStep;
	this.nextStep();
};

Automatic.prototype.stop = function() {
    this.context.nextStep = null;
    this.endHandler = function() {};
};

Automatic.prototype.addStep = function(name,obj) {
	if(!name || typeof name !== "string") {
		var e = new Error();
		e.message = "Error in Automatic.prototype.addStep - first argument should be a string";
		throw e;
	}
	if(!Automatic.is_object(obj)) {
		var e = new Error();
		e.message = "Error in Automatic.prototype.addStep - second argument should be an object";
		throw e;
	}
	this.steps[name] = obj;
};

Automatic.prototype.branchStep = function(name) {
    var e;
    if(!name || typeof name !== "string") {
        e = new Error();
        e.message = "Error in Automatic.prototype.branchStep - first argument should be a string";
        throw e;
    }
    if(!this.steps[name]) {
        e = new Error();
        e.message = "Error in Automatic.prototype.branchStep - there is no step called "+name;
        throw e;
    } else {
        this.context.nextStep = name;
    }
    
};

Automatic.prototype.nextStep = function() {
	var nextStep = this.context.nextStep;
	if(!nextStep) {
		this.end();
	} else {
		step = this.steps[nextStep];
		if(!step) {
			var e = new Error();
			e.message = 'Error in Automatic.prototype.nextStep - there is no step called '+nextStep;
			throw e;
		} else {
			this.setContext(step);
			this.makeRequest();
		}
	}
};

Automatic.prototype.makeRequest = function() {
	var context = this.context;
	if(context.url) {
		if(!context.method) {
			context.method = "GET";
		}
		var that = this;
		var callback = function(status,params,responseText,url,xhr) {
			console.log('in callback');
			that.extractData(responseText);
		};
		try {
			var queryString = this.data ? "?"+this.data : "";
			httpReq(
				context.method,
				context.method==="POST" ? context.url : context.url+queryString,
				callback,
				null,
				context.headers ? context.headers : null,
				context.method==="POST" ? this.data : null,
				null,null,null,true
			);
		} catch(ex) {
			this.error(ex,context.errorMessage ? context.errorMessage : "");
		}
	} else {
		this.extractData();
	}
};
	
Automatic.prototype.extractData = function(source) {
	var context = this.context;
	var formId = context.form;
	var keyValuePairs = {};
	var that = this;
	var getPairs = function(doc) {
		if(formId) {
            var form;
            if(typeof formId === "number") {
                form = doc.forms[formId];
            } else {
                form = doc[formId];
            }
            if(!form) {
                form = doc.getElementById(formId);
            }
			if(form) {
				var elem;
				for(var i=0;i<form.length;i++) {
					elem = form[i];
					keyValuePairs[elem.name] = elem.value;
				}
			} else {
				var e = new Error();
				e.message = 'Error in Automatic.prototype.extractData - specified form not found: '+formId;
				throw e;
			}
		}
		if(context.userInputs) {
			keyValuePairs = Automatic.replaceValues(keyValuePairs,context.userInputs);
		}
		if(context.handler) {
			context.handler(keyValuePairs,source,doc,that);
		}
		that.data = Automatic.serialize(keyValuePairs,true);
		that.nextStep();
	};
	if(source) {
		HTMLParser.parseText(source,function(doc) {
			getPairs(doc);
		});
	} else {
		getPairs(document);
	}
};

Automatic.prototype.addEndVars = function(obj) {
	if(!Automatic.is_object(obj)) {
		var e = new Error();
		e.message = "Error in Automatic.prototype.addEndVars";
		throw e;
	}
	merge(this.endVars,obj);
};

// console replacement
if(!window.console) {
	console = {
		log: function(msg){alert(msg)}
	};
}

// crockford
Automatic.is_array = function(value) {
	return value &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		typeof value.splice === 'function' &&
		!(value.propertyIsEnumerable('length'));
};

Automatic.is_object = function(value) {
	return value &&
		typeof value === 'object' &&
		!Automatic.is_array(value);
};

Automatic.replaceValues = function(keyValuePairs,userInputs) {
	if(!Automatic.is_object(keyValuePairs)) {
		var e = new Error();
		e.message = "Error in Automatic.replaceValues - first argument should be an object";
		throw e;
	}
	if(!Automatic.is_object(userInputs) && typeof userInputs !== 'undefined') {
		var e = new Error();
		e.message = "Error in Automatic.replaceValues - second argument should be an object or undefined";
		throw e;
	}
	if(!window.merge || typeof window.merge !== "function") {
		window.merge = function(dst,src,preserveExisting) {
			for(var i in src) {
				if(!preserveExisting || dst[i] === undefined) {
					dst[i] = src[i];
				}
			}
			return dst;
		};
	}
	return window.merge(keyValuePairs,userInputs);
};

Automatic.serialize = function(obj, encode) {	
	if(!obj || typeof obj !== 'object' || Automatic.is_array(obj)) {
		var e = new Error();
		e.message = "Error in Automatic.serialize - first argument should be an object";
		throw e;
	}
	if(encode !== undefined && typeof encode !== 'boolean') {
		var e = new Error();
		e.message = "Error in Automatic.serialize - second argument should be a boolean or undefined";
		throw e;
	}
	var out = '';
	for(var a in obj) {
		if(obj.hasOwnProperty(a)) {
			if(encode) {
				out+= '&' + encodeURIComponent(a) +"="+ encodeURIComponent(obj[a]);		
			} else {
				out+= '&' + a +"="+ obj[a];							
			}
		}
	}
	return out.substr(1);
};