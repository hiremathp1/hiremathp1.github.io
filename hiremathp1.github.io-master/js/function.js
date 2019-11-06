

var injectee = document.createElement("script");
injectee.innerHTML = `
(function() {
  var debug = true;
  function mywebguard_log(s){
      if((!debug) || (!console.log)) return;
      console.log('mywebguard log:'+s);
  }
  mywebguard_log("starting mywebguard.js");
  //store builtin functions to keep their original implementations
  var $Array = Array;
  var $Object = window.Object;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var originalDocument_createElelment = document.createElement; //we need to keep the original copy so that our code will not be intercepted.
  var builtins = {};
  builtins.__proto__ = null;
  with (Function.prototype)
  	builtins.Function = { apply: apply, call: call, /*toSource: toSource,*/toString: toString };
  try {
    // Create a function from a string.  Note that functions created with
    // the Function constructor DO NOT get a scope chain that includes the
    // current lexical scope; their scope chains include only the global
    // context.  To export local function declarations, we do some simple
    // parsing of the string form of the function and append commands that
    // explicitly export each definition.  Ads can obviously defeat this
    // eaprocess in a variety of ways, but doing so just harms themselves.
    function makeFunction(body) {
      mywebguard_log("makeFunction");
        if(body===undefined) throw new Error('makeFunction error: No code to make a function.');
        var locals = body.match(/function\s+\w+\(/g);
        if (locals) {
            body += ';';
            for (var i=0; i<locals.length; ++i) {
                var fname = locals[i].slice(8).match(/\w+/);
                body += 'if(typeof('+fname+')!="undefined")window.'+fname+'='+fname+';';
            }
        }
        return new Function(body);
    }
    // Implement a shadow stack as a list.
    var shadowStack = [];
    // Other code may read (but not write) the current principal.
    thisPrincipal = function() {
        if (shadowStack.length<1) return ''; else
        return shadowStack[shadowStack.length-1];
    };
    // This protected function executes code f at the privileges of a
    // specified principal.
    //revised version supporting AS calls
    function execWith(principal,f) {
      mywebguard_log("execWith");
        if(f==undefined) return;
        if(f===undefined) return;
        shadowStack.push(principal);
        f.apply = builtins.Function.apply;
        try{
          console.log("test")
            var r = f.apply(this,$Array.prototype.slice.call(arguments,2));
        }catch(e){}
        shadowStack.pop();
        //flush_write(principal);
        if (typeof r !== "undefined") return r;
    }
    function execScript(principal, dynamic_script_code){
        mywebguard_log("execScript");
        //alert("execScript -> code= "+ principal+"-----" + dynamic_script_code);
        var dynamic_script = makeFunction(dynamic_script_code); // call our code for turning a string into a global-scoped function
        execWith(principal,dynamic_script);
    }
    /********************** Begin the IRM code ******************************/
    //The common monitor function to intercept a function call with a policy
    var monitorMethod = function(object, method, policy) {
      while (!hasOwnProperty.call(object, method) && object.__proto__)
      object = object.__proto__;
      if (object === null) {
          throw new Error('Failed to find function for alias ' + method);
      }
      var original = object[method];
      if ((original === null) || (original === undefined))
      throw new Error('No method ' + method +'found for '+object);
      //make sure to call the original apply function
      original.apply = builtins.Function.apply;
      object[method] = function wrapper(image) {
          var object = this;
          var orgArgs = arguments;
          var proceed = function() {
            return original.apply(object, orgArgs);
          };
          return policy(orgArgs, proceed,object);
      }
    }
    function getSource(trace){
      var stackLines = trace.split("://");
      var callerIndex = 0;
      //Now walk though each line until we find a path reference
      for(var i in stackLines){
        //mywebguard_log("Stack[" + i +"]:" + stackLines[i]);
        callerIndex = i;
      }
      var callerpath= stackLines[callerIndex];
      return callerpath;
    }
    var imgpolicy = {
          get: function(obj, prop) {
            if (prop === "target") {
              return obj;
            }
            return obj[prop];
          },
           set: function(obj, prop, value) {
             if (prop === 'src') {
               mywebguard_log('src = ' + value);
          /*    Testing the policy on ImgSrc //
            In reality, we need to define some check of the img source
          */
             if(value.indexOf("collect?") > 1){ //just for testing if the image src contains data
                mywebguard_log('image src blocked: ' + value) ;
                value = "";
             }
             obj[prop]=value;
             }
             return obj;
           }
        };
    
    function eval_policy(args, proceed, obj) {
      var code = args[0];
      
      mywebguard_log("eval is monitored. code="+code);
      var callstack = new Error().stack;
       mywebguard_log("source=" + getSource(callstack));
      //return proceed();
      return;
    }
    
  
    function createElement_policy(args, proceed, obj) {
      var elementType = args[0];
      var elementObject = proceed();
      mywebguard_log("document.createElement is monitored. elementType="+elementType);
      var callstack = new Error().stack;
       mywebguard_log(" createElement is monitored. source=" + getSource(callstack));
      if (elementType === "img") {
        mywebguard_log("img type found");
        let imgObject = new Proxy(elementObject, imgpolicy);
        return imgObject;
      }
      return elementObject;
    }
    function getElementById_policy(args, proceed, obj) {
      var elementType = args[0];
      var elementObject = proceed();
      var callstack = new Error().stack;
      getSource(callstack);
      mywebguard_log(" getElementById is monitored. source ="+getSource(callstack));
      
      return elementObject;
    }
    function ImageObjectMonitor(){
      mywebguard_log("ImageObjectMonitor() is called");
      var NativeImage = Image;
      class FakeImage {
        constructor(height, width) {
          var imgObject = new NativeImage(height,width);
          imgObject = new Proxy(imgObject,imgpolicy);
          return imgObject;
        }
      }
      Image = FakeImage;
      //mywebguard_log("ImageObjectMonitor():Image="+Image);
    }
    function XMLHttpRequestMonitor(recorder) {
            var XHR = XMLHttpRequest.prototype;
            var open = XHR.open;
            var send = XHR.send;
            var setRequestHeader = XHR.setRequestHeader;
            // Collect data:
            XHR.open = function(method, url) {
                this._method = method;
                this._url = url;
                this._requestHeaders = {};
                this._startTime = (new Date()).toISOString();
                return open.apply(this, arguments);
            };
            XHR.setRequestHeader = function(header, value) {
                this._requestHeaders[header] = value;
                return setRequestHeader.apply(this, arguments);
            };
            XHR.send = function(postData) {
                this.addEventListener('load', function() {
                    var endTime = (new Date()).toISOString();
                    mywebguard_log("XHR Request from :" + this._url);
                    mywebguard_log("XHR method :" + this._method);
                //  mywebguard_log("XHR Request Headers:" + this._requestHeaders);
               //   mywebguard_log("XHR Request Headers:" + this._requestHeaders);
                });
        return send.apply(this, arguments);
            };
        }
  /*   var websocketpolicy = {
          get: function(obj, prop) {
            if (prop === "target") {
              return obj;
            }
            return obj[prop];
          },
           set: function(obj, prop, value) {
             obj[prop]=value;
             return obj;
           }
        };
*/
    
     function getHostName(url) {
           var url2 = '';
           var count = 0;
           for (var i = 0; i < url ; i++) {
               if (count == 2 && url.charAt(i) == '/')
                   break;
               if (count >= 1)
                   url2 = url2 + url.charAt(i);
               if (url.charAt(i) == '.')
                   count = count + 1;
           }
              return url2;
       }
    
  
   /*  //Checked for another possibility
      function captureXMLHttpRequest(recorder) {
        var XHR = XMLHttpRequest.prototype;
        var open = XHR.open;
        var send = XHR.send;
        var setRequestHeader = XHR.setRequestHeader;
        // Collect data:
        XHR.open = function(method, url) {
            this._method = method;
            this._url = url;
            this._requestHeaders = {};
            this._startTime = (new Date()).toISOString();
            return open.apply(this, arguments);
        };
        XHR.setRequestHeader = function(header, value) {
            this._requestHeaders[header] = value;
            return setRequestHeader.apply(this, arguments);
        };
        XHR.send = function(postData) {
            this.addEventListener('load', function() {
                var endTime = (new Date()).toISOString();
                //alert(this._url);
                mywebguard_log("XHR Request from :" + this._url);
              }
   function getHostName2(url){
     var a = document.createElelment("a");
     a.href=url;
     return a.hostname;
       }
       function websocketURLAllowed(url)
        {
     if (getHostName(window.location.hostname) ===getHostName("www.google.com")) 
        { 
        mywebguard_log("The HostName and WebSocket are same" + window.location.hostname + url);
        
        return true;
      } else
         {
          alert("WebSocket URL doesn't match with Domain URL");
         return false;
        }
          } */
    function websocketURLAllowed(theHref) {
     
      // TODO: implement real checking
       mywebguard_log(" This HostName of this page is=" +window.location.hostname);
     
      //if (url.includes("window.location.hostname")) {
      // return true;
      //}
     //return false;
     return true;
    }
    function WebSocketMonitor(){
      mywebguard_log("WebSocketMonitor is called");
      var NativeWebSocket = WebSocket;
      class FakeWebSocket {
        constructor(url) {
          var wsObject = new NativeWebSocket(url);
          //wsObject = new Proxy(wsObject,websocketpolicy);
          mywebguard_log("WebSocket is intercepted with url="+url);
          var callstack = new Error().stack;
      getSource(callstack);
      mywebguard_log("source ="+getSource(callstack));
      
          if (websocketURLAllowed(url))
            return wsObject;
          mywebguard_log("WebSocket is to "+url + "is blocked");
          return;
        }
      }
      WebSocket = FakeWebSocket;      
    }
    function appendChild_policy(args, proceed, obj) {
      var child = args[0];
      if (child.target !== undefined && child.target.tagName === "IMG") {
        args[0] = child.target;
      }
      return proceed();
    }
    function WebSocketsend_policy(args, proceed, obj) {
      mywebguard_log("WebSocket sent data:" + args[0]);
      return proceed();
    }
    function webRequestMonitor(){
    	if(chrome.webRequest==undefined) {
    		mywebguard_log("Cannot monitor chrome.webRequest: undefined!");
    		return;
    	}
    	const webRequesthandler = function(details) {
    		mywebguard_log("request intercepted for " + details.theHref);
    		if (details.theHref.indexOf("Villainc.svg") > 1) {
    			return {cancel: true};
    		}
    		return;
		};
   
		chrome.webRequest.onBeforeRequest.addListener(
        	webRequesthandler,
        	{ urls: [ 'http://*/*', 'https://*/*' ] },
        	[ 'blocking' ]
        );
    }
	  monitorMethod(window, "eval", eval_policy);
    monitorMethod(document, "createElement", createElement_policy);
    //monitorMethod(window,"XHR", XHRRequestMonitor);
    ImageObjectMonitor();
    monitorMethod(document, "appendChild", appendChild_policy);
    monitorMethod(document, "getElementById", getElementById_policy);
    //monitorMethod(window.WebSocket, "send", WebSocketsend_policy);
    WebSocketMonitor();
    getHostName();
    webRequestMonitor();
    XMLHttpRequestMonitor();
    mywebguard_log("mywebguard.js is completely loaded");
 }
  catch (err) {
    alert(err.message);
  }
})();
`;
document.documentElement.appendChild(injectee);

