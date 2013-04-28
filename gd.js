/**
 * GD Javascript library  version 0.1.0
 * Copyright (c) 2012, tongjo.com, All rights reserved.
 * @package core
 * @author guo dong
 * @email gd@tongjo.com
 */

(function(window){
  var doc = window.document, navigator = window.navigator, location = window.location;
	function gdom(){
		this.elems = [];
		if(arguments[0]){
			this.setElems(arguments[0]);
		}
		
	}
	gdom.prototype = {	//一个dom节点，包含原始dom对象，并封装一些方法
		addElem: function(el){
			this.elems.push(el);
		},
		setElems: function(elems){
			this.elems = elems;
		},
		getElems: function(){
			return this.elems;
		},
		value: function(){
			if(arguments[0] !== undefined){
				for (var i in this.elems) {
					this.elems[i].value = arguments[0];	//必须把数字转换为字符串
				}
				return this;
			} else {
				return this.elems[0].value;
			}
		},
		find: function(selector){
			return G.dom(selector, this.elems[0]);
		},
		html: function(){
			if (arguments[0] !== undefined) {
				for (var i in this.elems) {
					this.elems[i].innerHTML = arguments[0];
				}
				return this;
			} else {
				return this.elems[0].innerHTML;
			}
		},
		text: function(){
			if (arguments[0] !== undefined) {
				text = doc.createTextNode(arguments[0]);
				for (var i in this.elems) {
					this.elems[i].innerHTML = '';
					this.elems[i].appendChild(text);
				}
				return this;
			} else {
				return this.elems[0].innerHTML.replace(/<(.|\n)+?>/gi, "");
			}
		},
		attr: function(name){
			return this.elems[0].getAttribute(name);
		},
		append: function(text){
			var e = document.createElement('div');	//先加到div中，然后append到elems
			e.innerHTML = text;
			
			for (var i in this.elems) {//alert(i)
				if(typeof this.elems[i] == 'object'){	//解决IE下通过getbytagename返回的html collection时，length属性被for出来
					while(e.firstChild) {
					    this.elems[i].appendChild(e.firstChild);
					}
				}
				
				//var old = this.elems[i].innerHTML;
				//var newstr = old+text;
				//this.elems[i].innerHTML = newstr;
				//this.elems[i].appendChild(text);
			}
			return this;
		},
		parent: function(){
			var el = this.elems[0].parentNode || this.elems[0].parent;	//IE
			var dom = new gdom();
			dom.addElem(el);
			return dom;
		},
		on: function(action, callback){
			if(this.elems[0].addEventListener){
				for (var i in this.elems) {
					this.elems[i].addEventListener(action, callback, false);
				}
			} else if(this.elems[0].attachEvent){	//IE
				for (var i in this.elems) {
					var e = this.elems[i];
					var fn = callback;
					e.attachEvent('on'+action, function(){	//解决this指向window
						callback.call(e);
					});
				}
			}
			return this;
		},
		un: function(action, callback){
			if(this.elems[0].removeEventListener){
				for (var i in this.elems) {
					this.elems[i].removeEventListener(action, callback, false);
				}
			} else if(this.elems[0].detachEvent){
				for (var i in this.elems) {
					this.elems[i].detachEvent('on'+action, callback);
				}
			}
			return this;
		},
		addClass: function(name){
			for (var i in this.elems) {
        		this.elems[i].className += ' ' + name;
			}
			return this;
		},
		removeClass: function(name){
			for (var i in this.elems) {
				var classes = this.elems[i].className.split(' ');
				for(var j in classes){
					if (classes[j] == name) {
						classes[j] = '';
					}
				}
        		this.elems[i].className = classes.join(' ');
			}
			return this;
		},
		checked: function(){
			if(arguments[0] !== undefined){
				this.elems[0].checked = arguments[0];
				return this;
			} else {
				return this.elems[0].checked;
			}
		},
		style: function(objStyle){
			if (typeof objStyle === 'string'){
				if (this.elems[0].currentStyle) {         
					return this.elems[0].currentStyle[objStyle];      
				} else if (window.getComputedStyle) {
					return document.defaultView.getComputedStyle(this.elems[0],null)[objStyle];      
				}
			} else {
				for(var k in objStyle){
					for (var i in this.elems) {
						this.elems[i].style[k] = objStyle[k];
					}
				}
				return this;
			}
			
		},
		setOpacity: function(level){
			if (this.elems[0].filters) {
				for (var i in this.elems) {
					this.elems[i].style.filter = 'alpha(opacity='+level+')';
				}
			} else {
				for (var i in this.elems) {
					this.elems[i].style.opacity = level/100;
				}
			}
			return this;
		},
		fadeOut: function(time){
			for (var i in this.elems) {
				Helpers.fadeOut(this.elems[i], time);
			}
			return this;
		},
		fadeIn: function(time){
			for (var i in this.elems) {
				this.elems[i].style.display = "block";
				Helpers.fadeIn(this.elems[i], time);
			}
			return this;
		},
		show: function(){
			for (var i in this.elems) {
				this.elems[i].style.display = "block";
			}
			return this;
		},
		hide: function(){
			for (var i in this.elems) {
				this.elems[i].style.display = "none";
			}
			return this;
		},
		toggle: function(){
			for (var i in this.elems) {
				this.elems[i].style['display'] = (this.elems[i].style['display'] === 'none' || '') ? 'block' : 'none';
			}
			return this;
		},
		remove: function(){
			for (var i in this.elems) {
				this.elems[i].parentNode.removeChild(this.elems[i]);
			}
			return this;
		},
		width: function(){
			
		}
	};
	
	
	function GD(){
		var execReg = function(reg, str){
			return reg.exec(str);
		};
		this.dom = function(selector, context){
			if(execReg(/^#.*/, selector)){	//#id
				var domdes = selector.substr(1);
				return this.domById(domdes, context);
			} else if (execReg(/^\..*/, selector)){	//.class
				var domdes = selector.substr(1);
				return this.domByClass(domdes, context);
			} else if (execReg(/.+=.+/, selector)){	//G.dom('attr=sb')
				var arr = selector.split('=');
				return this.domByAttr(arr[0], arr[1], context);
			} else {	//G.dom('div')
				return this.domByTag(selector, context);
			}
		};
		this.domById = function(id, context){
			var d = context || doc;
			var e = d.getElementById(id);
			var dom = new gdom();
			dom.addElem(e);
			return dom;
		};
		this.domByName = function(name, context){
			var d = context || doc;
			return new gdom(d.getElementsByName(name));
		};
		this.domByTag = function(name, context){
			var d = context || doc;
			return new gdom(d.getElementsByTagName(name));
		};
		this.domByClass = function(name, context){
			var tmpElems = [];
			var pattern = new RegExp("(^|)" + name + "(|$)");
			var d = context || doc;
			var e = d.getElementsByTagName('*');
			for(var i = 0; i < e.length; i++){
				if(pattern.test(e[i].className)){
					tmpElems.push(e[i]);
				}
			}
			return new gdom(tmpElems);
		};
		this.domByAttr = function(attr, value, context){
			var tmpElems = [];
			var d = context || doc;
			var e = d.getElementsByTagName('*');
			for(var i = 0; i < e.length; i++){
				if(e[i].getAttribute(attr) === value){
					tmpElems.push(e[i]);
				}
			}
			return new gdom(tmpElems);
		};
	}
	
	GD.prototype = {
		baseDir: "",
		ui: function(){},

		/***** cookie *****/
		setCookie: function(index, value, time){
			var Days = time || 30; //此 cookie 将被保存 30 天
			var exp = new Date();	//new Date("December 31, 9998");
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = index + "="+ escape(value) + ";path=/"+";expire*="+ exp.toGMTString();   //保存于根目录
		},
		getCookie: function(index){
			var arr = document.cookie.match(new RegExp("(^| )"+index+"=([^;]*)(;|$)"));
			if(arr != null) return unescape(arr[2]); return null;
		},		
		
		ready: function(callback){
			var done = false;
			var checkLoaded = setInterval(function(){
				if(document.body && document.getElementById){
					done = true;
				}
			},
			10);
			var checkInter = setInterval(function(){
				if(done){
					clearInterval(checkLoaded);
					clearInterval(checkInter);
					callback();
				}
			},
			10);
		},
		i: function(obj){	//将普通dom变为gdom对象
			var dom = new gdom();
			dom.addElem(obj);
			return dom;
		},
		
		/********** actions **********/
		refresh: function(){
			location.reload();
		},
		jump: function(url, newwindow){
		    var flag = arguments[1] || false;
		    if(flag){
		        window.open(url);
		    }else{
			   window.location.href=url;
		    }
		},
		back: function(){
			history.go(-1);
		},
		
		/********** ajax **********/
		getXHR: function(){
			var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
			return xhr;
		},
		ajax: function(config){
			var xhr = this.getXHR();
			var method = config.method || 'GET';
			var url = config.url;
			var valObj = config.data || null;
			var callbackObj = config.callbackObj || null;
			var async = config.async || true;	//同步异步，默认异步
			var recjson = config.recjson || false;
			
			var values = '?';
			for(var k in valObj){
				values += encodeURIComponent(k) + '=' + encodeURIComponent(valObj[k]) + '&';
			}
			
			if (method === 'GET') {
				url += values;
				
				if (async === "true") {	//异步
					xhr.open(method, url, true);
					xhr.send(null);
					if(config.loading){
						config.loading();
					}
					xhr.onreadystatechange = function(){
						if(xhr.readyState == 4){
							switch(xhr.status){
							case 200:
								if(config.success){
									var rec = recjson ? this.parseJSON(xhr.responseText) : xhr.responseText;
									config.success(rec);
								}
								break;
							default:
								config.error(xhr.responseText);
							}
						}
					};
				} else {	//同步
					xhr.open(method, url, false);
					xhr.send(null);
					if(config.loading){
						config.loading();
					}
					if(config.success){
						var rec = recjson ? this.parseJSON(xhr.responseText) : xhr.responseText;
						config.success(rec);
					}
				}
			} else {
				values = values.substring(1, values.length-1);
				if (async === "true") {	//异步
					xhr.open(method, url, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.send(values);
					if(config.loading){
						config.loading();
					}
					xhr.onreadystatechange = function(){
						if(xhr.readyState == 4){
							switch(xhr.status){
							case 200:
								if(config.success){
									var rec = recjson ? this.parseJSON(xhr.responseText) : xhr.responseText;
									config.success(rec);
								}
								break;
							default:
								config.error(xhr.responseText);
							}
						}
					};
				} else {	//同步
					xhr.open(method, url, false);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.send(values);
					if(config.loading){
						config.loading();
					}
					if(config.success){
						var rec = recjson ? this.parseJSON(xhr.responseText) : xhr.responseText;
						config.success(rec);
					}
				}
			}
		},
			
		
		/********** require module **********/
		require: function(name){
			this.ajax.sendRequest('get', this.baseDir+name+'.js', null, {success: function(d){
					eval(d);
				}});
			
		},
		/**
		 * 模仿php的autoload，实例化时候引入相关文件并且执行，返回实例化的对象，
		 * 必须用同步执行，等引入的js执行完毕再继续,由于是ajax引入在不同域名下需做处理
		 * @param cls 类名称，也是文件路径
		 * @param constructParam 从第二个参数开始，作为实例化的构造参数
		 * @returns G.*
		 */
		gnew: function(cls){
			var file = this.baseDir + cls.replace('.', '/') + '.js?'+Math.random();
			var arr = cls.split(".");
			//var t = arr.pop();
			var oo = null;
			var pmstr = "";
			var pmarr = new Array();
			for(var i = 0; i < arguments.length - 1; i++) {
				pmarr.push(arguments[i+1]);
				pmstr += "pmarr["+i+"],";
			}
			pmstr = pmstr.substr(0, pmstr.length - 1);
			this.ajax({
				'url': file,
				'async': false,
				'success': function(d){
					eval(d);
					var n = "new G."+cls+"("+pmstr+")";
					var o = eval(n);
					oo = o;
				}
			});
			return oo;
		},
		toJSON: function(obj) {
			return JSON.stringify(obj);
		},
		parseJSON: function(str){
			return JSON.parse(str);
		},
		browser: {
			ie: !!(window.attachEvent && !window.opera),
     		opera: !!window.opera,
     		webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
     		gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
		},
		
		init: function(){
			this.baseDir = Helpers.getBaseDir();
		}
	};
	
	var Helpers = {
		setOpa: function(elem, level){
			if(level >= 0 && level <=100){
				elem.style.opacity = (level/100);
				elem.style.filter = 'alpha(opacity='+level+')';
			}
		},
		fadeOut: function(elem, time){
			var level = 100;
			var interval = setInterval(function(){
				Helpers.setOpa(elem, --level);
				if(level == 0){
					clearInterval(interval);
				}
			}, time/100);
		},
		fadeIn: function(elem, time){
			var level = 0;
			var interval = setInterval(function(){
				Helpers.setOpa(elem, ++level);
				if(level == 100){
					clearInterval(interval);
				}
			}, time/100);
		},
		
		getBaseDir: function(){
			var scripts = document.getElementsByTagName("script");
			if(scripts.length){
				for(var i = 0; i < scripts.length; i++){
					if(scripts[i].src.indexOf("gd.js") > -1){
						return scripts[i].src.substring(0, scripts[i].src.lastIndexOf("/")+1);
					}
				}
			}
			return null;
		}
	};
	if(!window.G){
		window.G = new GD();
		G.init();
	}
})(window);


var JSON;
if (!JSON) {
    JSON = {};
}
(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);

        case 'object':
            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

          return str('', {'': value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());
