//1. setTimeout
    if (typeof setTimeout === "function" ){
       var dynamicsetTimeout = "set" + "Timeout";
       setTimeout(()=>{console.log('setTimeOut static')},0);
       eval(dynamicsetTimeout + "(()=>{console.log('setTimeOut dynamic')},0)") 
    }

    //2. document.cookie => getCookie [Property access]
    if (typeof document.cookie === "string" ){
       console.log("document.cookie=" + document["coo" +"kie"]); 
    }

    // 3 setInterval
    if (typeof setTimeout === "function" ){
        console.log("setInterval");
        // let timerId = setTimeout(function tick() {
        //     alert('This is setInterval function');
        //     timerId = setTimeout(tick, 2000); 
        // }, 2000);
    }

    //4 clearAttributes
        console.log("clearAttributes");
        function clearAttributesd () {
            var marquee = document.getElementById ("myMarquee");
            for (var i = marquee.attributes.length - 1; i >= 0; i--) {
                var attr = marquee.attributes[i];
                if (attr.name.toLowerCase () == "id") {
                    continue;
                }
                if (attr.name.toLowerCase () == "style") {
                    continue;
                }
                if (attr.name.substring (0,2).toLowerCase () == "on") {
                    continue;
                }
                marquee.removeAttribute (attr.name, 0);
            }
        }
   
    //5 unescape
   
    if (typeof unescape === "function" ){
        console.log('unescape')
        var data = `une`+`scape`;
        eval(`${data}('element')`);
    }

    //6 eval()

     if (typeof eval === "function" ){
         console.log('eval')
        var data = `une`+`scape`;
        eval(`${data}('element')`);
    }

    // 7 fireEvent
    if (typeof dispatchEvent === "function" ){
        console.log('dispatchEvent');
        var myMarquee = document.getElementById('myMarquee');
        var ddd = new Event('click')
        var data = 'dispat'+'chEvent'
        // eval(`${data}(myMarquee)`);
        myMarquee.dispatchEvent(ddd)
    }

    // 8 split
    console.log('split');
   
        var string = 'ele1,'+'ele2'+',ele3';
        string.split(',');

    // 9 Math.random()
    console.log("Math.random()");
    if (typeof Math === "object" ){
        
        var string = "Ma"+"t"+'h'+'.random';
       eval(string);
    }

    // 10 XMLHTTPRequest
    console.log("xmlhttpRequest");
    if ( typeof XMLHttpRequest === 'function' ) {
       
        var xhttp = new XMLHttpRequest();
        var openString = "xht"+"tp.op"+"en('GET', "+"'dd.php', tr"+"ue)";
        var sendString  = "xh"+"ttp"+"."+"sen"+"d()";
        eval(openString);
        eval(sendString);
    } 

    // 11 unescape
    console.log("unescape");
    if ( typeof unescape === 'function' ) {
        
        var data = `une`+`scape`;
        eval(`${data}('element')`);
    }

    // 12 element.appendChild()
    console.log("element.appendChild");
    var parentChild = document.getElementById('myMarquee');
    var childElement = document.createElement('p')
    var string  = "parentC"+"hi"+"ld.append"+"Ch"+"ild(childElement)"
    eval(string);

    //13 dateObject.toGMTString()
    console.log('Date.toGMTString')
    if(typeof Date === 'function'){
       
        var today = new Date();
        var string  = "to"+"da"+"y"+".toG"+"MTS"+"tring()"
        console.log(eval(string))
    }


    // 15 location.assign()
    console.log("location.assign");
    var string = 'locat'+'ion'+'.as'+'sign("./sample.html")';
    eval(string);

    
    
    //18 location.replace()
    console.log("location.replace");
    var string = 'locat'+'ion'+'.'+'replace("")';
    eval(string);

   

    // 20 fromCharCode
    console.log("fromCharCode")
    var res = String.fromCharCode(65);
    var string = 'con'+'sole.l'+'og(St'+'ring.f'+'romCh'+'arCode('+'65))';
    eval(string); 

    // 21 String.charAt()
        console.log("String.charAt");
        var string = 'element';
        console.log(string.charAt(2));
        var data = "con"+"sol"+"e.log(st"+"ring.cha"+"rAt("+"2))"
        eval(data);
    // 22 String.indexOf()
        console.log('String.indexOf')
        var string = 'element';
        console.log(string.indexOf());
        var data = "con"+"sol"+"e.log(st"+"ring.index"+"Of("+"))"
        eval(data);
    // 21 navigate.userAgent()
        console.log("navigator.userAgent");
        var x = "User-agent header sent: " + navigator.userAgent;
        eval('console.log(eval("navigator.userAgent"))')
   
        // 21 addEventListener()
        console.log('addEventListener()')
        var firstButton = document.getElementById('myMarquee');
        myMarquee.addEventListener("click", () => {
            eval("console.log('This is addEventListener function')");
        })

    //dispatchEvent()
        console.log("dispatchEvent")
        const event = new Event('build');
        var firstButton = document.getElementById('myMarquee');
        firstButton.addEventListener('build', function (e) { console.log('This is new event I have defined') }, false);
        firstButton.dispatchEvent(event);
    //removeAttribute()
        console.log("removeAttribute()")
        var firstButton = document.getElementById('myMarquee');
        firstButton.removeAttribute('style');
        eval("firstBut"+"ton.removeA"+"ttribute('d"+"ata-id')")
    //SetCookie
    console.log("setCookie")
    if (typeof document.cookie === "string" ){
       eval("document.cookie = 'element'")
    }
