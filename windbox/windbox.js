/**
 * WindBox 1.3 - 19/05/2016
 * modal box cross-browser
 * 
 * developed by Wallace Rio <wallrio@gmail.com>
 * wallrio.com
 * 
 * tested on firefox/chrome/opera/ie8/safari
 */

(function(){

	var listWindow = [];
	var zindex = 1000000;
	var contBox = 0;
	var alignBoxTime = 0;
	var documentLoaded = false;
	var detectChange = [];

	var Functions = function(idBox,options){

		if( options != undefined ){

			contBox++;

			var title = options['title'] || null;						
			var icon = options['icon'] || null;
			var content = options['content'] || null;										
			var target = options['target'] || null;										
			var cssclass = options['cssclass'] || null;
			var css = options['css'] || null;											
			var fixed = options['fixed'] || null;										
			var input = options['input'] || null;	
			var callback = options['callback'] || null;	
			var makeinput = options['makeinput'] || null;	

			if(options['parameters'] != null) var parameters = options['parameters']; else var parameters = {};

			if(options['fixed'] != null) var fixed = options['fixed']; else var fixed = true;

			if(options['drag'] != null) var drag = options['drag']; else var drag = true;

			if(options['limitWindow'] != null) var limitWindow = options['limitWindow']; else var limitWindow = true;

			if(options['escape'] != null) var escape = options['escape']; else var escape = true;


			var op = {};
			op.parameters = parameters;					
			op.title = title;					
			op.icon = icon;
			op.content = content;
			op.target = target;
			op.css = css;
			op.cssclass = cssclass;
			op.input = input;
			op.fixed = fixed;
			op.callbackIng = null;
			op.escape = escape; // not implemented
			op.limitWindow = limitWindow; // not implemented
			op.callback = callback;
			op.makeinput = makeinput;
			op.status = "closed";
			op.drag = {status:drag,selected:false,x:0,y:0,elemX:0,elemY:0};
		
			listWindow[idBox] = op;
			this.id = idBox;
			this.status = op.status;



		}

		/**
		 * convert object to query string
		 * @param  {[type]} json [description]
		 * @return {[type]}      [description]
		 */
		this.objectToQueryString = function(json) {
			var queryString = '';
			var seperator = '';
			var index = 0;
			for(key in json){
				if(index>0)
					seperator = '&'
				queryString += seperator+key+'='+encodeURIComponent(json[key]);
				index++;
			}
			

			return {'string':queryString,'count':index};
		}

		/**
		 * ajax connection
		 * @param  {[type]} option [similar to jquery]
		 */
		this.ajax = function(option){
			var type = option['type'] || "GET";
			var url = option['url'] || null;
			var data = option['data'] || null;
			var success = option['success'] || null;
			var progress = option['progress'] || null;
			var sync = option['sync'] || true;
			var files = option['files'] || null;
			var xmlhttp =[];			
			var count = contBox;
			var formdata = null;
			
			// url = url.toLowerCase();
			type = type.toLowerCase();

			try{
				xmlhttp[count] = new XMLHttpRequest();
			}catch(ee){
				try{
					xmlhttp[count] = new ActiveXObject("Msxml2.XMLHTTP");
				}catch(e){
					try{
						xmlhttp[count] = new ActiveXObject("Microsoft.XMLHTTP");
					}catch(E){
						xmlhttp[count] = false;
					}
				}
			}		

			if(typeof data == 'object'){											
				dataString = objectToQueryString(data);				
			}

			if(type == 'get')
				url = url + '?'+dataString.string;
			
			
			xmlhttp[count].open(type, url,sync);	
	
			 if(type == 'post' && files == null)		
				xmlhttp[count].setRequestHeader("Content-type","application/x-www-form-urlencoded");
	
			xmlhttp[count].onreadystatechange=function(response) {	

				if (xmlhttp[count].readyState==4){		      										
					var resposta = xmlhttp[count].responseText;		            
					if(success)
						success(resposta);		           
				}
			}

			xmlhttp[count].upload.onprogress = function(e){
				if(progress)
					progress(e.loaded,e.total,Math.ceil((e.loaded / e.total) * 100))		
			};


			if(files != null){
				formdata = new FormData();

				for(key in files){
					var nowFiles = files[key];					
					var inputfiles = nowFiles.files;						
					if (inputfiles && inputfiles != null && inputfiles.length > 0) {													
						for (var i = 0; i <= inputfiles.length-1; i++) {							
					        formdata.append(key+'_'+inputfiles[i].name, inputfiles[i]);
					    }												
					}
				}
		
				for(key in data){
					formdata.append(key, data[key]);
				}
			}

			if(type == 'post')	
				if(files == null)	
					xmlhttp[count].send(dataString.string); 
				else
					xmlhttp[count].send(formdata); 
			else
				xmlhttp[count].send(); 
		}



		/**
		 * Enable support on ie8 to Object.keys		 
		 */
		if (!Object.keys) {Object.keys = function(obj) {var keys = []; for (var i in obj) {if (obj.hasOwnProperty(i)) {keys.push(i); } } return keys; }; }

		/**
		 * define addEvents cross browser		 
		 */
		this.addEvent = function(objs,event,callback,mode){
			if(objs == undefined)
				objs = window; 
			if(objs.addEventListener) 
				return objs.addEventListener(event,callback,mode); 
			else if(objs.attachEvent) 
				return objs.attachEvent(event,callback); 
		}


		/**
		 * verifica se o navegador atual é moderno		 
		 */
		this.browserModern = function(){if(document.addEventListener) return true; else if(document.attachEvent) return false; }
		
		/**
		 * functions to browser		 
		 */
		this.browser = {
				resize: function(callback){
					var obj = window; 
					if(callback == undefined) return; 
					if(windbox().browserModern()){
						windbox().addEvent(obj,'resize',function(){return callback(obj); }); 
					}else{
						windbox().addEvent(obj,'onresize',function(){return callback(obj); }); 
					} 
				},
				load: function(callback){
					var obj = window; 
					if(callback == undefined) return; 
					if(windbox().browserModern()){
						windbox().addEvent(obj,'load',function(){return callback(obj); }); 
					}else{
						windbox().addEvent(obj,'onload',function(){return callback(obj); }); 
					} 
				},
				events: function(element,event,callback,mode){
					if(typeof element == 'string'){						
						element = document.getElementById(element);

					}

					var obj = element || window; 					
					var eventArray = event.split(',');

					mode = mode || false;

					if(event.indexOf(',')!= -1){				
						for(key in eventArray){
							 key = eventArray[key];																					
								if(windbox().browserModern()){									
									windbox().addEvent(obj,key,function(e){return callback(obj,e); },mode); 
								}else{
									windbox().addEvent(obj,'on'+key,function(e){return callback(obj,e); },mode); 
								} 
						}
							 
						

						return true;
					}

					

					if(windbox().browserModern()){
					
						windbox().addEvent(obj,event,function(e){return callback(obj,e); },mode); 
					}else{
						windbox().addEvent(obj,'on'+event,function(e){return callback(obj,e); },mode); 
					} 
				}			
		};


		this.setKeys = function(id){
			var parent= this;
		
			document.onkeyup = function(e){

				e = e || event;
					
				var code = (e.keyCode) ? e.keyCode : e.which;
						
				if (code == '27') {		
					
					if(listWindow[parent.id].escape == true){		  						  			
						parent.action.close();	
					}
					
				}
				
			}
		}

		/**
		 * get size of document/window
		 * @return {[type]} [description]
		 */
		this.windowSize = function(){
				var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
				var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

			    D = document;
			    var y =  Math.max(
			        D.body.scrollHeight, D.documentElement.scrollHeight,
			        D.body.offsetHeight, D.documentElement.offsetHeight,
			        D.body.clientHeight, D.documentElement.clientHeight
			    );


			    var x =  Math.max(
			        D.body.scrollWidth, D.documentElement.scrollWidth,
			        D.body.offsetWidth, D.documentElement.offsetWidth,
			        D.body.clientWidth, D.documentElement.clientWidth
			    );

				var size = {
					document: {
						width: x,
						height: y
					},
					width: width,
					height: height,
					scrollLeft: scrollLeft,
					scrollTop: scrollTop,
					sizing: function(element){

						return {
							width:width-(document.querySelector(element).offsetLeft*2),
							height:height-(document.querySelector(element).offsetTop*2)
						}
					} 
				}

			return size;
		}

		this.change = function(localOptions){
			// alert(this.id);
			id = idBox;
			var inputOrigin = listWindow[id].input || null;
			var input = localOptions['input'] || null;

		

			var content = localOptions['content'] || null;										
			var target = localOptions['target'] || null;										
			var cssclass = localOptions['cssclass'] || null;										
											
			var input = localOptions['input'] || null;	
			var callback = localOptions['callback'] || null;	

			if(localOptions['parameters'] != null) var parameters = localOptions['parameters']; else var parameters = {};

			if(localOptions['title'] != null) var title = localOptions['title']; else var fixed = null;
			if(localOptions['icon'] != null) var icon = localOptions['icon']; else var icon = null;

			if(localOptions['fixed'] != null) var fixed = localOptions['fixed']; else var fixed = null;

			if(localOptions['drag'] != null) 
				var drag = localOptions['drag']; else var drag = null;

			if(localOptions['limitWindow'] != null) 
				var limitWindow = localOptions['limitWindow']; else var limitWindow = null;

			if(localOptions['escape'] != null) 
				var escape = localOptions['escape']; else var escape = null;


			
			
			if(parameters != null)				
				listWindow[idBox].parameters = parameters;


			
			
			// alert(JSON.stringify(listWindow[idBox].parameters));

			if(icon != null) listWindow[idBox].icon = icon;
			if(title != null) listWindow[idBox].title = title;

			if(content != null){
				if(content.value != null )
				listWindow[idBox].content.value = content.value;
				if(content.url != null )
				listWindow[idBox].content.url = content.url;

				if(content.replace != null )
				listWindow[idBox].content.replace = content.replace;

				if(content.img != null ){
					if(content.img.src != null )
					listWindow[idBox].content.img.src = content.img.src;	
					if(content.img.size != null )
					listWindow[idBox].content.img.size = content.img.size;	
				}
				
			}

			if(target != null) listWindow[idBox].target = target;
			if(cssclass != null) listWindow[idBox].cssclass = cssclass;
			if(fixed != null) listWindow[idBox].fixed = fixed;			
			if(drag != null) listWindow[idBox].drag = drag;
			if(callback != null) listWindow[idBox].callback = callback;

			if(inputOrigin != null && input != null){

				for( key in input){	

					if(inputOrigin[key] != null){					 	
						for(key2 in input[key]){							
							if(inputOrigin[key] != null){		
								  inputOrigin[key][key2] = input[key][key2];								 
							}
						}
					}else{

						// var newInput = {[key]:input[key]};					
						inputOrigin[key] = input[key];					
					}
										
				}
				// alert(JSON.stringify(inputOrigin));
				listWindow[idBox].input = inputOrigin;
			}
			

			// if(input != null) listWindow[idBox].input = input;

			// listWindow[idBox] = op;
			// this.id = idBox;
			return this;
		}
		
		/**
		 * draw the box
		 */
		this.draw = function(id,callback){
			id = id || this.id;

			var target = listWindow[id].target;
			var cssclass = listWindow[id].cssclass;
			var fixed = listWindow[id].fixed;
			var css = listWindow[id].css;
			

			var html = '';				
				html += '<form data-windbox="windbox" id="windbox_'+id+'" class="'+((cssclass!=undefined)?cssclass:'windbox_default')+'" >';
					html += '<div data-windbox="background" id="windbox_background_'+id+'" ></div>';
					html += '<div data-windbox="wrapper" id="windbox_wrapper_'+id+'" >';
						html += '<div data-windbox="box" id="windbox_box_'+id+'" >';

						html += '<div data-windbox="loading" id="windbox_loading_'+id+'" >';
						html += '<div data-windbox="loading-content" id="windbox_loadingcontent_'+id+'" ></div>';
						html += '</div>';

						html += '<div data-windbox="header" id="windbox_header_'+id+'" >';
							html += '<div data-windbox="header-left" id="windbox_headericon_'+id+'" ></div>';
							html += '<div data-windbox="header-center" id="windbox_headertitle_'+id+'" ></div>';
							html += '<div data-windbox="header-right" id="windbox_headerright_'+id+'" ></div>';
						html += '</div>';

						html += '<div data-windbox="content" id="windbox_content_'+id+'" >';
						html += '';
						html += '</div>';

						html += '<div data-windbox="footer" id="windbox_footer_'+id+'" >';
							html += '<div data-windbox="footer-left" id="windbox_footerleft_'+id+'" ></div>';
							html += '<div data-windbox="footer-center" id="windbox_footercenter_'+id+'" ></div>';
							html += '<div data-windbox="footer-right" id="windbox_footerright_'+id+'" ></div>';
						html += '</div>';

					html += '</div>';				
				html += '</form>';

			if(target)
				var d1 = document.querySelector(target);
			else
				var d1 = document.body;

			

			if(d1 != null)
			d1.insertAdjacentHTML('afterbegin',html);	

			zindex++;
		

				document.getElementById("windbox_box_"+id).setAttribute('data-id',id);

			if(css != null && css.content != null)
				windbox().jsonCssToElement(document.getElementById("windbox_content_"+id),css.content);

			if(css != null && css.box != null && css.box.out != null){	
				windbox().jsonCssToElement(document.getElementById("windbox_box_"+id),css.box.out);
				document.getElementById("windbox_box_"+id).setAttribute('data-css-out',JSON.stringify(css.box.out));
			}

			if(css != null && css.box != null && css.box.out != null){
				document.getElementById("windbox_box_"+id).setAttribute('data-css-hover',JSON.stringify(css.box.hover));
				document.getElementById("windbox_box_"+id).onmouseover = function(){				
					var id = this.getAttribute('data-id');				
					var hover = this.getAttribute('data-css-hover');				
					if(hover != null && hover != undefined)
					windbox().jsonCssToElement(this,JSON.parse(hover));

					// clearInterval(alignBoxTime);
					// windbox(id).alignBox(id);
				}
				document.getElementById("windbox_box_"+id).onfocus = function(){				
					var id = this.getAttribute('data-id');				
					var hover = this.getAttribute('data-css-hover');				
					if(hover != null && hover != undefined)
					windbox().jsonCssToElement(this,JSON.parse(hover));

					// clearInterval(alignBoxTime);
					// windbox(id).alignBox(id);
				}
			}

			if(css != null && css.box != null && css.box.out != null){
				document.getElementById("windbox_box_"+id).onmouseout = function(){		
				var id = this.getAttribute('data-id');			
					var out = this.getAttribute('data-css-out');				
					if(out != null && out != undefined)
					windbox().jsonCssToElement(this,JSON.parse(out));

					// windbox(id).alignBox(id);
				}
			}



			if(css != null && css.background != null && css.background.out != null){	
				windbox().jsonCssToElement(document.getElementById("windbox_background_"+id),css.background.out);
				// document.getElementById("windbox_background_"+id).setAttribute('data-css-out',JSON.stringify(css.box.out));
			}


			
			document.getElementById('windbox_box_'+id).style.visibility = "hidden";
			

			// document.getElementById('windbox_wrapper_'+id).style.height = this.windowSize().document.height+'px';
		

			if(fixed == true)
				document.getElementById('windbox_box_'+id).style.position = "fixed";
			else
				document.getElementById('windbox_box_'+id).style.position = "absolute";

			
			document.getElementById('windbox_wrapper_'+id).style.zIndex = zindex;
			document.getElementById('windbox_background_'+id).style.zIndex = zindex;
			document.getElementById('windbox_box_'+id).style.zIndex = zindex;
			

			this.alignBox(id);

			if(callback)
				callback(id);

		}








		/**
		 * execute on move box
		 */
		this.moveDrag = function(id,e){
			var elem = document.getElementById('windbox_box_'+id);			
			var x_pos = document.all ? window.event.clientX : e.pageX;
			var y_pos = document.all ? window.event.clientY : e.pageY;		    		
		}

		/**
		 * initializate on drag to box
		 */
		this.initDrag = function(id){		
			var elem = document.getElementById('windbox_box_'+id);		  	
			listWindow[id].drag.elemX = listWindow[id].drag.x - elem.offsetLeft;
			listWindow[id].drag.elemY = listWindow[id].drag.y - elem.offsetTop;
		 
			listWindow[id].drag.selected = true;
			document.onmousemove = function(e){
				var elem = document.getElementById('windbox_box_'+id);
				var elem_header = document.getElementById('windbox_header_'+id);
				
				if(listWindow[id].drag.status==true && listWindow[id].drag.selected == true)
						elem_header.style.cursor="move";	
					else					
						elem_header.style.cursor="grab";	
					

				listWindow[id].drag.x = document.all ? window.event.clientX : e.pageX;
				listWindow[id].drag.y = document.all ? window.event.clientY : e.pageY;

		
				if(listWindow[id].drag.selected == true){
					
					if(listWindow[id].limitWindow == true){
						var pos_box_x =  (listWindow[id].drag.x - listWindow[id].drag.elemX);
						var max_width =  (windbox().windowSize().width - elem.offsetWidth );
						var gopos_x = 2;

						var pos_box_y =  (listWindow[id].drag.y - listWindow[id].drag.elemY);
						var max_height =  (windbox().windowSize().height - elem.offsetHeight -0);
						var gopos_y = 0;
					}else{
						var pos_box_x = (listWindow[id].drag.x - listWindow[id].drag.elemX);
						var max_width = (windbox().windowSize().width -elem_header.offsetWidth);
						var gopos_x = 0;

						var pos_box_y = (listWindow[id].drag.y - listWindow[id].drag.elemY);
						var max_height = (windbox().windowSize().height -elem_header.offsetHeight);
						var gopos_y = elem.offsetHeight-windbox().windowSize().height+elem_header.offsetHeight-12;

					}

					if(document.getElementById('windbox_box_'+id).style.position == 'absolute')
						max_height = windowSize().document.height;

				

					if((listWindow[id].drag.x - listWindow[id].drag.elemX) >= 10 && pos_box_x <= (max_width)-20){		    			
						elem.style.left = (listWindow[id].drag.x - listWindow[id].drag.elemX) + 'px';
					
					}else if((listWindow[id].drag.x - listWindow[id].drag.elemX) < 10 ){		    			
						elem.style.left = 0+'px';

					}else if( pos_box_x >= (max_width-20) ){
				
						elem.style.left = max_width+"px";
						
					}

					 

				
					if((listWindow[id].drag.y - listWindow[id].drag.elemY) >= 10 && pos_box_y <= max_height){
						elem.style.top = (listWindow[id].drag.y - listWindow[id].drag.elemY) + 'px';				
					}else if((listWindow[id].drag.y - listWindow[id].drag.elemY) < 10){
						elem.style.top = 0+'px';
					}else if( pos_box_y > max_height ){						
						elem.style.top = max_height+"px";
						
					}
				}
				return false;
			};			
			document.onmouseup = function(){
				var elem_header = document.getElementById('windbox_header_'+id);

				if(listWindow[id].drag.status==true)
					elem_header.style.cursor="grab";

				listWindow[id].drag.selected = false;
				return false;
			};

		}

		/**
		 * define drag start	
		 */
		this.setDrag = function(id){

			if(listWindow[id].drag.status == true && !listWindow[id].target){

				var parent = this;
			

				document.getElementById('windbox_header_'+id).style.cursor="grab";

				document.getElementById('windbox_header_'+id).onmouseup = function(e){
					if(listWindow[id].drag.status==true){
						this.style.cursor="auto";						
					}
					
				}

				document.getElementById('windbox_header_'+id).onmousedown = function(e){
					windbox().id = id;	

					/*document.getElementById('windbox_box_'+id).style['-webkit-transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['-moz-transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['-o-transition'] = 0+'ms';
*/

					var CurrentElement_zindex = Number(document.getElementById('windbox_box_'+id).style.zIndex);					
					if(CurrentElement_zindex <= zindex){

						zindex++;	
					
						document.getElementById('windbox_wrapper_'+id).style.zIndex = zindex;
						document.getElementById('windbox_background_'+id).style.zIndex = zindex;
						document.getElementById('windbox_box_'+id).style.zIndex = zindex;
					}


					listWindow[id].drag.x = document.all ? window.event.clientX : e.pageX;
					listWindow[id].drag.y = document.all ? window.event.clientY : e.pageY;

					if(listWindow[id].drag.status==true){

						this.style.cursor="move";
						windbox().initDrag(id);
					}

					
				};
			}
		}











		/**
		 * align box based window
		 */
		this.alignBox = function(id,callback){
			id = id || this.id;
			
				var fixed = listWindow[id].fixed;
		
				if(fixed == true){
					 var adjustTop = 0;
					 var adjustLeft = 0;
				 }else{
					var adjustTop = windowSize().scrollTop;
					var adjustLeft = windowSize().scrollLeft;
				 }

				document.getElementById('windbox_box_'+id).style.visibility = "visible";
				var boxContent_width = document.getElementById('windbox_box_'+id).offsetWidth;
				var boxContent_height = document.getElementById('windbox_box_'+id).offsetHeight;					

			
				document.getElementById('windbox_box_'+id).style.top= ((windowSize().height)/2)-(boxContent_height/2) + adjustTop + 'px';
				document.getElementById('windbox_box_'+id).style.left = ((windowSize().width)/2)-(boxContent_width/2) + adjustLeft + 'px';
					
				
				if(callback)
					callback();

		}

		/**
		 * hide the box
		 */
		this.hide = function(id){
			id = id || idBox;
			this.id = id;	

			action.close(id);

		}


		/**
		 * show the box		 
		 */
		this.show = function(){

			this.id = idBox;
			
			if(documentLoaded == false){

				this.browser.load(function(){
					
					if(listWindow[this.id].status == "opened")
					return;
				
					this.draw(idBox,function(id){
									
						this.setContent(id);
						
					});								
				});
			}else{
					if(listWindow[this.id].status == "opened")
					return;
				
					this.draw(idBox,function(id){
						
						this.setContent(id);	
						
						// listWindow[this.id]
					});								
			}
			

									
			

		}

		/**
		 * draw the inputs in the box
		 */
		this.drawInputs = function(id){	
			id = id || this.id;

			var inputsLoading = '';
			var inputsHeaderRight = '';
			var inputsHeaderCenter = '';
			var inputsHeaderLeft = '';
			var inputsContent = '';
			var inputsControl = '';
			var inputsControlRight = '';
			var inputsControlLeft = '';
			var inputsControlCenter = '';
			var inputsHtml = '';
			var countInputs = 0;

			var inputs = listWindow[id].input || null;
			var makeinput = listWindow[id].makeinput || null;

			var indexLoading = 0;
			var indexControl = 0;
			var indexControlRight  = 0;
			var indexControlLeft = 0;
			var indexControlCenter = 0;
			var indexHeaderRight = 0;
			var indexHeaderLeft = 0;
			var indexHeaderCenter = 0;
			var indexContent = 0;

			countInputs = Object.keys(inputs).length;
			
			

			for( key in inputs){		
				var type = inputs[key].type || 'a';
				var value = inputs[key].value || '';
				var css = inputs[key].css || null;
				var click = inputs[key].click || null;
				var placeholder = inputs[key].placeholder || '';
				var required = inputs[key].required || '';
				var options = inputs[key].options || null;
				var label = inputs[key].label || null;
				var container = inputs[key].container || 'control';

				var optionsval = "";
				var option_selected = "";
				var thumblist_options = "";
				var colname = "";

				if(required)
					required = 'required';
			
				if(options != null){
					// alert(key+'-'+JSON.stringify(options));
					for(keyopt in options){
						option_selected = '';
						if(options[keyopt].selected)
						option_selected = 'selected';
						var img = options[keyopt].img || '';
						optionsval += '<option value="'+options[keyopt].value+'" '+option_selected+'>'+options[keyopt].text+'</option>';
						thumblist_options += '<li  value="'+options[keyopt].value+'" data-value="'+options[keyopt].value+'" data-img="'+img+'" data-text="'+options[keyopt].text+'" '+option_selected+'><a style="background:url('+img+')"><span>'+options[keyopt].text+'</span></a></li>';
					}
				}					
			


				if(type == 'submit'){
					inputsHtml = '<button type="submit" data-type="submit" name="'+key+'" id="windbox_input_'+id+'_'+key+'" >'+value+'</button>';					
				}else if(type == 'button'){
					inputsHtml = '<button type="button" data-type="button" name="'+key+'" id="windbox_input_'+id+'_'+key+'" >'+value+'</button>';
				}else if(type == 'a'){
					inputsHtml = '<a name="'+key+'" id="windbox_input_'+id+'_'+key+'" data-type="a" >'+value+'</a>';

				}else if(type == 'hidden'){
					inputsHtml = '<input type="'+type+'" value="'+value+'"  placeholder="'+placeholder+'" name="'+key+'" id="windbox_input_'+id+'_'+key+'" data-type="text" '+required+' >';
				}else if(type == 'text'){
					inputsHtml = '<input type="'+type+'" value="'+value+'"  placeholder="'+placeholder+'" name="'+key+'" id="windbox_input_'+id+'_'+key+'" data-type="text" '+required+' >';
				}else if(type == 'file'){
					inputsHtml = '<input type="'+type+'" value="'+value+'"  name="'+key+'" id="windbox_input_'+id+'_'+key+'" data-type="file" '+required+' >';
				}else if(type == 'textarea'){
					inputsHtml = '<textarea  name="'+key+'" placeholder="'+placeholder+'" id="windbox_input_'+id+'_'+key+'" data-type="textarea" '+required+' >'+value+'</textarea>';
				}else if(type == 'select'){
					inputsHtml = '<select  name="'+key+'"  id="windbox_input_'+id+'_'+key+'" data-type="select" '+required+' >'+optionsval+'</select>';
				}else if(type == 'column'){					
					inputsHtml = '</div><div name="'+key+'" data-type="col"  id="windbox_input_'+id+'_'+key+'" >';

				}

				
				// alert(JSON.stringify(makeinput));

				// desenha elementos criado via makeinput ----------------------
				if(makeinput != null){
					for(keyMakeinput in makeinput){

						if(type == keyMakeinput ){
							
							inputsHtml = makeinput[keyMakeinput].html;
							inputsHtml = inputsHtml.replace(/\{id\}/ig,' name="'+key+'" id="windbox_input_'+id+'_'+key+'" ');

							if(thumblist_options != '' && thumblist_options != null && thumblist_options != undefined)
								inputsHtml = inputsHtml.replace(/\{options.li\}/ig,thumblist_options);
							inputsHtml = inputsHtml.replace(/\{options\}/ig,optionsval);
							if(value != '' && value != null && value != undefined)
								inputsHtml = inputsHtml.replace(/\{value\}/ig,value);
						}				
					}
				}
				

				if(label != null){
					inputsHtml = '<label id="windbox_inputlabel_'+id+'_'+key+'">'+label+'</label>'+inputsHtml;
				}

				// alert(JSON.stringify(makeinput));


				// if(index==countInputs-1)
					// inputsHtml += '</div>';
				

				

				if(container == 'loading'){
					if(indexLoading==0)
						inputsHtml = '<div data-type="col"  data-rel="colfirst" id="colfirst_'+id+'_loading"  >'+inputsHtml;

					inputsLoading += inputsHtml;
					indexLoading++;
				}else if(container == 'control'){
					if(inputsControl==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_control" >'+inputsHtml;

					inputsControl += inputsHtml;	

					indexControl++;				
				}else if(container == 'control-right'){
					if(inputsControlRight==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_controlright" >'+inputsHtml;

					inputsControlRight += inputsHtml;					
					indexControlRight ++;
				}else if(container == 'control-left'){
					if(inputsControlLeft==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_controlleft" >'+inputsHtml;

					inputsControlLeft += inputsHtml;	

					indexControlLeft++;
				}else if(container == 'control-center'){
					if(inputsControlCenter==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_controlcenter" >'+inputsHtml;

					inputsControlCenter += inputsHtml;	
					
					indexControlCenter++;						
				}else if(container == 'header'){
					if(indexHeader==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_header" >'+inputsHtml;

					inputsHeaderRight += inputsHtml;
					indexHeaderRight++;
				}else if(container == 'header-right'){
					if(indexHeaderRight==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_headerright" >'+inputsHtml;

					inputsHeaderRight += inputsHtml;

					indexHeaderRight++;
				}else if(container == 'header-left'){
					if(indexHeaderLeft==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_headerleft" >'+inputsHtml;

					inputsHeaderLeft += inputsHtml;

					indexHeaderLeft++;
				}else if(indexHeaderCenter == 'header-center'){
					if(indexLoading==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_headercenter" >'+inputsHtml;

					inputsHeaderCenter += inputsHtml;
					
					indexHeaderCenter++;				
				}else if(container == 'content'){
					if(indexContent==0)
						inputsHtml = '<div data-type="col" data-rel="colfirst" id="colfirst_'+id+'_content" >'+inputsHtml;
					inputsContent += inputsHtml;
					
					indexContent++;
				}

				

				
			}


			// 

			inputsLoading += '</div>';
			inputsControl += '</div>';
			inputsControlRight += '</div>';
			inputsControlLeft += '</div>';
			inputsControlCenter += '</div>';
			inputsHeaderRight += '</div>';
			inputsHeaderLeft += '</div>';
			inputsHeaderCenter += '</div>';
			inputsContent += '</div>';


			return {
				control:inputsControl,
				controlRight:inputsControlRight,
				controlCenter:inputsControlCenter,
				controlLeft:inputsControlLeft,
				content:inputsContent,
				headerRight:inputsHeaderRight,
				headerCenter:inputsHeaderCenter,
				headerLeft:inputsHeaderLeft
			};
		}


		/**
		 * define events for inputs
		 * @param {[type]} id [description]
		 */
		this.setEvents = function(id){			
			var parent = this;
			var inputs = listWindow[id].input || null;
			this.setEventsInit(id);
		}

		/**
		 * set events to multiple elements
		 */
		this.setElement = function(id,event,callback,mode){							
				this.browser.events(id,event,callback,mode);									
		}


		this.stringChange = {
			noaccents:function(string){							
				var map = {" ":" ","~":"","'":"","À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A", "Æ": "AE", "Ç": "C", "È": "E", "É": "E", "Ê": "E", "Ë": "E", "Ì": "I", "Í": "I", "Î": "I", "Ï": "I", "Ð": "D", "Ñ": "N", "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O", "Ø": "O", "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U", "Ý": "Y", "ß": "s", "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "æ": "ae", "ç": "c", "è": "e", "é": "e", "ê": "e", "ë": "e", "ì": "i", "í": "i", "î": "i", "ï": "i", "ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ý": "y", "ÿ": "y", "Ā": "A", "ā": "a", "Ă": "A", "ă": "a", "Ą": "A", "ą": "a", "Ć": "C", "ć": "c", "Ĉ": "C", "ĉ": "c", "Ċ": "C", "ċ": "c", "Č": "C", "č": "c", "Ď": "D", "ď": "d", "Đ": "D", "đ": "d", "Ē": "E", "ē": "e", "Ĕ": "E", "ĕ": "e", "Ė": "E", "ė": "e", "Ę": "E", "ę": "e", "Ě": "E", "ě": "e", "Ĝ": "G", "ĝ": "g", "Ğ": "G", "ğ": "g", "Ġ": "G", "ġ": "g", "Ģ": "G", "ģ": "g", "Ĥ": "H", "ĥ": "h", "Ħ": "H", "ħ": "h", "Ĩ": "I", "ĩ": "i", "Ī": "I", "ī": "i", "Ĭ": "I", "ĭ": "i", "Į": "I", "į": "i", "İ": "I", "ı": "i", "Ĳ": "IJ", "ĳ": "ij", "Ĵ": "J", "ĵ": "j", "Ķ": "K", "ķ": "k", "Ĺ": "L", "ĺ": "l", "Ļ": "L", "ļ": "l", "Ľ": "L", "ľ": "l", "Ŀ": "L", "ŀ": "l", "Ł": "l", "ł": "l", "Ń": "N", "ń": "n", "Ņ": "N", "ņ": "n", "Ň": "N", "ň": "n", "ŉ": "n", "Ō": "O", "ō": "o", "Ŏ": "O", "ŏ": "o", "Ő": "O", "ő": "o", "Œ": "OE", "œ": "oe", "Ŕ": "R", "ŕ": "r", "Ŗ": "R", "ŗ": "r", "Ř": "R", "ř": "r", "Ś": "S", "ś": "s", "Ŝ": "S", "ŝ": "s", "Ş": "S", "ş": "s", "Š": "S", "š": "s", "Ţ": "T", "ţ": "t", "Ť": "T", "ť": "t", "Ŧ": "T", "ŧ": "t", "Ũ": "U", "ũ": "u", "Ū": "U", "ū": "u", "Ŭ": "U", "ŭ": "u", "Ů": "U", "ů": "u", "Ű": "U", "ű": "u", "Ų": "U", "ų": "u", "Ŵ": "W", "ŵ": "w", "Ŷ": "Y", "ŷ": "y", "Ÿ": "Y", "Ź": "Z", "ź": "z", "Ż": "Z", "ż": "z", "Ž": "Z", "ž": "z", "ſ": "s", "ƒ": "f", "Ơ": "O", "ơ": "o", "Ư": "U", "ư": "u", "Ǎ": "A", "ǎ": "a", "Ǐ": "I", "ǐ": "i", "Ǒ": "O", "ǒ": "o", "Ǔ": "U", "ǔ": "u", "Ǖ": "U", "ǖ": "u", "Ǘ": "U", "ǘ": "u", "Ǚ": "U", "ǚ": "u", "Ǜ": "U", "ǜ": "u", "Ǻ": "A", "ǻ": "a", "Ǽ": "AE", "ǽ": "ae", "Ǿ": "O", "ǿ": "o"};
				var nonWord = /\W/g;
		        var mapping = function (c) {			        
		        	if(map[c] === false)
		        		return c;
		        	else
		        		return (map[c]==undefined)?c:map[c];
		            
		        };
			    string = string.replace(nonWord, mapping);		
			    string = string.replace(/[\~\']/g, mapping);					
				return string;
			},
			toUrl:function(string){							
				var map = {" ":"-","~":"","'":"","À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A", "Æ": "AE", "Ç": "C", "È": "E", "É": "E", "Ê": "E", "Ë": "E", "Ì": "I", "Í": "I", "Î": "I", "Ï": "I", "Ð": "D", "Ñ": "N", "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O", "Ø": "O", "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U", "Ý": "Y", "ß": "s", "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "æ": "ae", "ç": "c", "è": "e", "é": "e", "ê": "e", "ë": "e", "ì": "i", "í": "i", "î": "i", "ï": "i", "ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ý": "y", "ÿ": "y", "Ā": "A", "ā": "a", "Ă": "A", "ă": "a", "Ą": "A", "ą": "a", "Ć": "C", "ć": "c", "Ĉ": "C", "ĉ": "c", "Ċ": "C", "ċ": "c", "Č": "C", "č": "c", "Ď": "D", "ď": "d", "Đ": "D", "đ": "d", "Ē": "E", "ē": "e", "Ĕ": "E", "ĕ": "e", "Ė": "E", "ė": "e", "Ę": "E", "ę": "e", "Ě": "E", "ě": "e", "Ĝ": "G", "ĝ": "g", "Ğ": "G", "ğ": "g", "Ġ": "G", "ġ": "g", "Ģ": "G", "ģ": "g", "Ĥ": "H", "ĥ": "h", "Ħ": "H", "ħ": "h", "Ĩ": "I", "ĩ": "i", "Ī": "I", "ī": "i", "Ĭ": "I", "ĭ": "i", "Į": "I", "į": "i", "İ": "I", "ı": "i", "Ĳ": "IJ", "ĳ": "ij", "Ĵ": "J", "ĵ": "j", "Ķ": "K", "ķ": "k", "Ĺ": "L", "ĺ": "l", "Ļ": "L", "ļ": "l", "Ľ": "L", "ľ": "l", "Ŀ": "L", "ŀ": "l", "Ł": "l", "ł": "l", "Ń": "N", "ń": "n", "Ņ": "N", "ņ": "n", "Ň": "N", "ň": "n", "ŉ": "n", "Ō": "O", "ō": "o", "Ŏ": "O", "ŏ": "o", "Ő": "O", "ő": "o", "Œ": "OE", "œ": "oe", "Ŕ": "R", "ŕ": "r", "Ŗ": "R", "ŗ": "r", "Ř": "R", "ř": "r", "Ś": "S", "ś": "s", "Ŝ": "S", "ŝ": "s", "Ş": "S", "ş": "s", "Š": "S", "š": "s", "Ţ": "T", "ţ": "t", "Ť": "T", "ť": "t", "Ŧ": "T", "ŧ": "t", "Ũ": "U", "ũ": "u", "Ū": "U", "ū": "u", "Ŭ": "U", "ŭ": "u", "Ů": "U", "ů": "u", "Ű": "U", "ű": "u", "Ų": "U", "ų": "u", "Ŵ": "W", "ŵ": "w", "Ŷ": "Y", "ŷ": "y", "Ÿ": "Y", "Ź": "Z", "ź": "z", "Ż": "Z", "ż": "z", "Ž": "Z", "ž": "z", "ſ": "s", "ƒ": "f", "Ơ": "O", "ơ": "o", "Ư": "U", "ư": "u", "Ǎ": "A", "ǎ": "a", "Ǐ": "I", "ǐ": "i", "Ǒ": "O", "ǒ": "o", "Ǔ": "U", "ǔ": "u", "Ǖ": "U", "ǖ": "u", "Ǘ": "U", "ǘ": "u", "Ǚ": "U", "ǚ": "u", "Ǜ": "U", "ǜ": "u", "Ǻ": "A", "ǻ": "a", "Ǽ": "AE", "ǽ": "ae", "Ǿ": "O", "ǿ": "o"};
				var nonWord = /\W/g;
		        var mapping = function (c) {			        
		        	if(map[c] === false)
		        		return c;
		        	else
		        		return (map[c]==undefined)?c:map[c];
		            
		        };
			    string = string.replace(nonWord, mapping);		
			    string = string.replace(/[\~\']/g, mapping);					
			    string = string.toLowerCase();
				return string;
			}
		}

		this.checkValMode = function(valmode,e,element){
			
			if(valmode == 'only-letter'){				
				var patternNew =new RegExp("[a-zA-z]",'g');											
				e = e || event;				
				var keynum = (e.keyCode) ? e.keyCode : e.which;								    
			    var keyChar = String.fromCharCode(keynum);	
			    // document.title = keynum;										    			   
				if(!keyChar.match(patternNew) && keynum != 8 && keynum != 9 && keynum != 13 && keynum != 37  && keynum != 38  && keynum != 39  && keynum != 40 && keynum != 116  )				
					return false;	
			}else if(valmode == 'only-number'){				
				var patternNew =new RegExp("[0-9]",'g');											
				e = e || event;				
				var keynum = (e.keyCode) ? e.keyCode : e.which;								    
			    var keyChar = String.fromCharCode(keynum);	
			    // document.title = keynum;										    			   
				if(!keyChar.match(patternNew) && keynum != 8 && keynum != 9 && keynum != 13 && keynum != 37  && keynum != 38  && keynum != 39  && keynum != 40 && keynum != 116  )				
					return false;	
			}else if(valmode == 'only-number-sinal'){				
				var patternNew =new RegExp("[0-9]",'g');											
				e = e || event;				
				var keynum = (e.keyCode) ? e.keyCode : e.which;								    
			    var keyChar = String.fromCharCode(keynum);	
			    // document.title = keynum;										    			   
				if(!keyChar.match(patternNew) && keynum != 8 && keynum != 9 && keynum != 13 && keynum != 37  && keynum != 38  && keynum != 39  && keynum != 40 && keynum != 116 )				
					return false;	
			}else if(valmode == 'not-accents'){	
				element.value = windbox().stringChange.noaccents(element.value);				
			}
										
																	
				
			 
		}

		
		this.jsonCssToElement = function(element,json){				
			if(json == undefined)
				return false;
			for(key in json){
				var css_attribute = key;
				var css_val = json[key];				
				element.style[css_attribute] = css_val;
			}			
		}

		this.jsonAttrToElement = function(element,json){				
			if(json == undefined)
				return false;
			for(key in json){
				var attr_attribute = key;
				var attr_val = json[key];				
				element.setAttribute(attr_attribute,attr_val);
			}			
		}

		this.setStyleRunTime = function(type,element,json){
			var css = '';
			var cssString = '';

			if(type == undefined)
				type = '';

			if(json == undefined)
				return false;
			for(key in json){
				var attr_attribute = key;
				var attr_val = json[key];	
				cssString += attr_attribute+':'+attr_val+';';			
				// element.setAttribute(attr_attribute,attr_val);
			}

		
			if(type == 'hover')
				css = '.windbox_default #'+element.id+'[data-type="a"]:'+type+'{ '+cssString+' }';
			else if(type == 'active')
				css = '.windbox_default #'+element.id+'[data-type="a"]:'+type+'{ '+cssString+' }';
			else
				css = '.windbox_default #'+element.id+'[data-type="a"]{ '+cssString+' }';

			style = document.createElement('style');

			if (style.styleSheet) {
			    style.styleSheet.cssText = css;
			} else {
			    style.appendChild(document.createTextNode(css));
			}
			document.getElementsByTagName('head')[0].appendChild(style);
		}


		this.getStyles = function(oElm,strCssRule) {
			var ret = [];
		    /*var strValue = "";
			if(document.defaultView && document.defaultView.getComputedStyle){
				strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
			}
			else if(oElm.currentStyle){
				strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
					return p1.toUpperCase();
				});
				strValue = oElm.currentStyle;
			}*/
			// alert(Object.size(oElm.style));
			for (key in oElm.style) {
				// alert(key+'-'+);
				if(oElm.style[key]){
					// ret[key] = oElm.style[key];
					alert(key+'-'+oElm.style[key]);
				}
        		// if (obj.hasOwnProperty(key)) size++;
    		}	
    		// alert(JSON.stringify(ret));
			return ret;
		}
		/**
		 * initialize setup events		 
		 */
		this.setEventsInit = function(id){
			var inputs = listWindow[id].input || null;
			var parent = this;

			if(inputs != null){	
				
				// detect changes in inputs texts
				detectChange[id] = setInterval(function(){
					var inputs = listWindow[id].input || null;
					for(keys in inputs){
						var change = inputs[keys].change;
						var element = document.getElementById("windbox_input_"+id+'_'+keys);
						if(element.getAttribute('data-content') != element.value){							
							if(change)			
								change();
							element.setAttribute('data-content',element.value);
						}				
					}
				},10);


				var parent = this;
				for(keys in inputs){
				
					var type = inputs[keys].type;
					var value = inputs[keys].value;
					var attr = inputs[keys].attr || null;
					var css = inputs[keys].css || null;
					var click = inputs[keys].click;
					var keyup = inputs[keys].keyup;
					var change = inputs[keys].change;
					var pattern = inputs[keys].pattern || null;
					var valmode = inputs[keys].valmode || null;
					var texttime = null;
					var interval = 300;
					var container = inputs[keys].container || 'control';
					var makeinput = listWindow[id].makeinput || null;


					if( document.getElementById("windbox_input_"+id+'_'+keys) != null && document.getElementById("windbox_input_"+id+'_'+keys) != undefined){
						


						// alert('>'+this.getStyles(document.getElementById("windbox_input_"+id+'_'+keys)));

						if(css == null){

							css = [];
							css.outstyle = document.getElementById("windbox_input_"+id+'_'+keys).style;
						}else{
							css.outstyle = document.getElementById("windbox_input_"+id+'_'+keys).style;
							if(css.interval != null)
							interval = css.interval;
						}


						if(interval){
						     document.getElementById("windbox_input_"+id+'_'+keys).style['-webkit-transition'] = interval+'ms';					   
						     document.getElementById("windbox_input_"+id+'_'+keys).style['-moz-transition'] = interval+'ms';					   
						     document.getElementById("windbox_input_"+id+'_'+keys).style['transition'] = interval+'ms';					   
						     document.getElementById("windbox_input_"+id+'_'+keys).style['-o-transition'] = interval+'ms';					   
						  }
						

						if(attr != null )
							this.jsonAttrToElement(document.getElementById("windbox_input_"+id+'_'+keys),attr);

						if(css != null && css.out != null)
							this.jsonCssToElement(document.getElementById("windbox_input_"+id+'_'+keys),css.out);


						if( css.colfirst != null){
							// alert("windbox_input_"+id+'_'+keys+'_firstcol');
							// alert(JSON.stringify(css.first));
							var el = document.getElementById('colfirst_'+id+'_'+container.replace('-',''));
							// var el = document.getElementById("windbox_input_"+id+'_'+keys).parentNode.getElementById('colfirst_'+id+'_'+container.replace('-',''));
							if(el != undefined)
							this.jsonCssToElement(el,css.colfirst);
						}

						// id="windbox_input_'+id+'_'+key+'_firstcol"

						document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-input',keys);

						document.getElementById("windbox_input_"+id+'_'+keys).onfocusin = function(){						
							var keys = this.getAttribute('data-input');																					
							var css = inputs[keys].css || null;							
							if(css != null && css.focus != null ){																
								windbox().jsonCssToElement(this,css.focus);
							}							
						}

						document.getElementById("windbox_input_"+id+'_'+keys).onfocusout = function(){
							var keys = this.getAttribute('data-input');																					
							var css = inputs[keys].css || null;							
							if(css != null && css.out != null){																
								windbox().jsonCssToElement(this,css.out);
							}							
						}

						document.getElementById("windbox_input_"+id+'_'+keys).onmousemove = function(){
							var keys = this.getAttribute('data-input');																					
							var css = inputs[keys].css || null;

							if(css != null && css.hover != null && document.activeElement !== this){																
								// windbox().setStyleRunTime('hover',this,css.hover);
								windbox().jsonCssToElement(this,css.hover);
							}							
						}

						document.getElementById("windbox_input_"+id+'_'+keys).onmouseout = function(){
							var keys = this.getAttribute('data-input');																					
							var css = inputs[keys].css || null;

							if(css != null && css.out != null && document.activeElement !== this){																								
								windbox().jsonCssToElement(this,css.out);
							}else{
								
								/*if(document.activeElement !== this && css != null ){
									if(css.outstyle != null)
									this.style = css.outstyle;		
								}*/

								// if(css.out && document.activeElement !== this)
									// windbox().jsonCssToElement(this,css.out);

							}				
						}

						

						


						document.getElementById("windbox_input_"+id+'_'+keys).onclick = null;					
						
						document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-content',document.getElementById("windbox_input_"+id+'_'+keys).value);

						if(type == 'text' || type == 'textarea'){

							
							


							document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-pattern',pattern);
							document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-valmode',valmode);
							document.getElementById("windbox_input_"+id+'_'+keys).onkeypress = function(e){
								// var valmode = this.getAttribute('data-valmode');								
								// return parent.checkValMode(valmode,e,this);
														
							};

							// document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-content',document.getElementById("windbox_input_"+id+'_'+keys).value);

							
							document.getElementById("windbox_input_"+id+'_'+keys).onkeyup = function(e){
								var valmode = this.getAttribute('data-valmode');								
								var returns = parent.checkValMode(valmode,e,this);
								var keys = this.getAttribute('data-input');														
								var keyup = inputs[keys].keyup;
								// var change = inputs[keys].change;
								
								if(returns == false)
									return returns;
								if(keyup)
									return keyup(this);
								// if(change)
								// 	return change(this);	
														
							};




							
							document.getElementById("windbox_input_"+id+'_'+keys).onfocus = function(e){
								var parent = this;

								texttime = setInterval(function(){
									// parent.setAttribute('data-content',parent.value)

									var valmode = parent.getAttribute('data-valmode');	
									// document.title = windbox().checkValMode;																
									windbox().checkValMode(valmode,e,parent);


									/*var keys = parent.getAttribute('data-input');																							
									var change = inputs[keys].change;
									

									if(parent.getAttribute('data-content') != parent.value){
										if(change)
										 change(this);
									}
									*/
									
									

									 // 

									/*var pattern = parent.getAttribute('data-pattern');	
												
									if(pattern != null){																																			
										var regex = new RegExp("[^" + pattern + "]", "g");
										var input = parent.value;
										var output = input.replace(regex, "");									
										parent.value = output;		
									
									}
									*/
								},10);
							}

							document.getElementById("windbox_input_"+id+'_'+keys).onblur = function(e){
								var parent = this;
								clearInterval(texttime);
							}

						}else if(type == 'submit'){
	 
								document.getElementById("windbox_"+id).onsubmit = function(){return false;};								
								document.getElementById("windbox_"+id).setAttribute('data-input',keys);
								document.getElementById("windbox_"+id).onsubmit = function(){

										var form = false;
									var length = document.getElementById("windbox_"+id).length;
									for(var i = 0; i < length; i++) {
										var input = document.getElementById("windbox_"+id)[i];

										 if(input.getAttribute('required') != null && input.value == ''){
											input.focus();
											return false;
										 }
									   
									}
								
									var keys = this.getAttribute('data-input');								
									var click = inputs[keys].click;

									var returns = true;
									var returns = inputs[keys].returns;									 
									if(returns != false || returns == undefined){										
										windbox().id = id;
										if(click){
											return click(this);												
										}
									}
								};
								
								
					
						}else if(type == 'button'){
								
								document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-input',keys);
							this.setElement("windbox_input_"+id+'_'+keys,'click',function(element){

								
								var keys = element.getAttribute('data-input');								
								var click = inputs[keys].click;

								parent.id = id;
								if(click)
									return click(this);		
							});

							
						}else if(type == 'a'){						
					
							document.getElementById("windbox_input_"+id+'_'+keys).setAttribute('data-input',keys);
							document.getElementById("windbox_input_"+id+'_'+keys).onclick = function(){
								var keys = this.getAttribute('data-input');								
								var click = inputs[keys].click;

								if(click)
									return click(this);							
							}
							
						}



						



					}
				}




				// define as ações de click/select e outros, nos elementos criados via makeinput
				for(keys in inputs){				
					var type = inputs[keys].type;
					var value = inputs[keys].value;
					var attr = inputs[keys].attr || null;
					var css = inputs[keys].css || null;
					var click = inputs[keys].click;
					var keyup = inputs[keys].keyup;
					var change = inputs[keys].change;
					var pattern = inputs[keys].pattern || null;
					var valmode = inputs[keys].valmode || null;
					var texttime = null;
					var interval = 300;
					var container = inputs[keys].container || 'control';
					var makeinput = listWindow[id].makeinput || null;

					if( document.getElementById("windbox_input_"+id+'_'+keys) != null && document.getElementById("windbox_input_"+id+'_'+keys) != undefined){
						if(makeinput != null){
							for( keyMInput in makeinput){
								if(makeinput[keyMInput] != null){
									makeinput_action = makeinput[keyMInput].action || null;		
									for(makeinput_action_op in makeinput_action){
										// exemplo: makeinput_action[makeinput_action_op] = makeinput_action.click
										makeinput_action[makeinput_action_op]( document.getElementById("windbox_input_"+id+'_'+keys) ,keys,inputs);
									}																
								}
							}
						}

					}
				}





				
			}
		}


		/**
		 * adjust image defined by attribute content.img
		 */
		this.imgAdjust = function(id,callback){
			var content = listWindow[id].content || null;

			var contentImgSrc = ""; 
			var contentImgSize = ""; 
			if(content != null){		
				if(content.img ){
					var contentImgSrc = content.img.src || ""; 
					var contentImgSize = content.img.size || ""; 
				}
			

			

				var ImgWidth = document.getElementById('windbox_contentimg_'+id).offsetWidth;
				var ImgHeight = document.getElementById('windbox_contentimg_'+id).offsetHeight;
				
				if(contentImgSize == 'auto'){
					var forceImgWidth = 'auto';
				}else if(contentImgSize == 'full'){
					var forceImgWidth = '100%';
				}else{				
					if(contentImgSize == '')
						contentImgSize = 0.5;

					var forceImgWidth = (this.windowSize().width) * contentImgSize + 'px';
					var forceImgHeight = (this.windowSize().height) * contentImgSize + 'px';
				}


				
				if(ImgHeight+100 >= this.windowSize().height)
				document.getElementById('windbox_contentimg_'+id).style.width = forceImgWidth;

				var ImgHeight = document.getElementById('windbox_contentimg_'+id).offsetHeight+100;

				if(ImgHeight+100 >= this.windowSize().height){
					document.getElementById('windbox_contentimg_'+id).style.height = forceImgHeight;
					document.getElementById('windbox_contentimg_'+id).style.width = 'auto';
				}

			
			}

			if(callback)
				callback();
		}

		/**
		 * adjust icon defined by string
		 */
		this.adjustIcon = function(icon){

			icon = icon.replace('[info]','<div class="iconinfo"></div>');
			icon = icon.replace('[loading]','<div class="iconloading"></div>');
			icon = icon.replace('[success]','<div class="iconsuccess"></div>');
			icon = icon.replace('[error]','<div class="iconerror"></div>');
			icon = icon.replace('[question]','<div class="iconquestion"></div>');

			return icon;
		}


		/**
		 * actions for use by user	
		 */
		this.action = {	
			change:function(inputKey,optionsGet,iDwin){

				// if(iDwin) var id = iDwin; else var id = windbox().id;

				var inputsHtml = '';

				var op_val = null;				
				var inputs = listWindow[id].input || null;
				
				var type = inputs[inputKey].type || null;
				
				// alert(JSON.stringify(optionsGet));

				inputsHtml = document.getElementById('windbox_input_'+id+'_'+inputKey).innerHTML;

				
				// alert(inputsHtml);

				for(op in optionsGet){

					
					if(optionsGet[op] != null){
						op_val = optionsGet[op];
						
						 // alert(inputKey+'-'+op+'='+JSON.stringify(op_val));
						 // inputs[inputKey].push({[op]:op_val});
						 // inputs[inputKey].push({"a":"a"});
						

						 // inputs[inputKey][op] = op_val;
						
						// alert(JSON.stringify({[op]:op_val}));
						 // inputs[inputKey]['options'] = 3;
						 // inputs[inputKey][op] = op_val;
						

						if(op == 'value'){						
							if(op_val != '' && op_val != null && op_val != undefined)
								inputsHtml = inputsHtml.replace(/\{value\}/ig,op_val);

						}else if(op == 'options'){		

							if(op_val != '' && op_val != null && op_val != undefined){
								var optionsval = "";
								var option_selected = "";
								var thumblist_options = "";
							
								if(op_val != null){
									for(keyopt in op_val){

										option_selected = '';
										if(op_val[keyopt].selected)
										option_selected = 'selected';

										var img = op_val[keyopt].img || '';
										var obs = op_val[keyopt].obs || '';

										optionsval += '<option value="'+op_val[keyopt].value+'" '+option_selected+'>'+op_val[keyopt].text+'</option>';
										thumblist_options += '<li  value="'+op_val[keyopt].value+'" data-value="'+op_val[keyopt].value+'" data-img="'+img+'" data-obs="'+obs+'" data-text="'+op_val[keyopt].text+'" '+option_selected+'><a style="background:url('+img+')"><span>'+op_val[keyopt].text+'</span></a></li>';
									
									}

									

									inputsHtml = inputsHtml.replace(/\{options\}/ig,optionsval);
									inputsHtml = inputsHtml.replace(/\{options.li\}/ig,thumblist_options);
								}
							}
						}

					}

					

					

				}

				
				inputsHtml = inputsHtml.replace(/\{options\}/ig,'');
				inputsHtml = inputsHtml.replace(/\{options.li\}/ig,'');
			
				document.getElementById('windbox_input_'+id+'_'+inputKey).innerHTML = inputsHtml;

				
				// listWindow[id].input = inputs;
				windbox().setEventsInit(id);
				

			},
			ajax:function(options){
				Functions().ajax(options);
			},
			parameters:function(attribute,iDwin){
				if(iDwin) var id = iDwin; else var id = windbox().id;
				if(attribute == undefined)				
					return listWindow[id].parameters;
				else
					return listWindow[id].parameters[attribute];
			},
			input:function(name,iDwin){
				if(iDwin) var id = iDwin; else var id = windbox().id;
				return document.getElementById('windbox_input_'+id+'_'+name);
			},

			setOnload:function(string){
				documentLoaded = true;
			},
			title:function(string,iDwin){
				if(iDwin) var id = iDwin; else var id = windbox().id;

				document.getElementById('windbox_headertitle_'+id).innerHTML = string;
			},
			icon:function(string,iDwin){
				if(iDwin) var id = iDwin; else var id = windbox().id;

				string = windbox().adjustIcon(string);
				document.getElementById('windbox_headericon_'+id).innerHTML = string;
			},

			loading:{
				show:function(iDwin){
					if(iDwin) var id = iDwin; else var id = windbox().id;
					document.getElementById('windbox_loading_'+id).style.visibility = "visible";
					document.getElementById('windbox_loadingcontent_'+id).innerHTML = "Carregando...";

					if(windbox().browserModern()){
						var BoxHeight = document.getElementById('windbox_box_'+id).offsetHeight;						
						document.getElementById('windbox_loading_'+id).style.height = BoxHeight+(0)+'px';
					}

				},
				hide:function(iDwin){
					if(iDwin) var id = iDwin; else var id = windbox().id;
					document.getElementById('windbox_loading_'+id).style.visibility='hidden';					
					document.getElementById('windbox_box_'+id).style.visibility='visible';
					var BoxHeight = document.getElementById('windbox_box_'+id).offsetHeight;						
					document.getElementById('windbox_loading_'+id).style.height = BoxHeight+(1)+'px';
				}
			},
			close:function(iDwin,callback){

				if(iDwin) var id = iDwin; else var id = windbox().id;

				

				var listWindow_test = Object.keys(listWindow);							
				var listWindow_test = listWindow;				
				listWindow_test = listWindow_test.reverse(); 

				listWindow[id].status = "closed";
				

				for(key in listWindow_test){
					if(listWindow[key].status == 'opened'){		
						windbox().id = key;	

						// if( listWindow.indexOf(key) != -1 )
						// listWindow.splice(listWindow.indexOf(key),1);
					}		
				}

				// alert(listWindow[0]);

				document.body.removeChild(document.getElementById('windbox_'+id));
				
				clearInterval(detectChange[id]);

				if(callback)
					callback();
			
			}
		}

		/**
		 * adjust the content	
		 */
		this.setContent = function(id){
			id = id || this.id;

			this.setDrag(id);
			this.setKeys(id);

			

			listWindow[id].status = "opened";
			this.status = listWindow[id].status;

			var icon = listWindow[id].icon;
			var title = listWindow[id].title;
			var content = listWindow[id].content || null;
			var callback = listWindow[id].callback;


			
			
			if(content != null){
							
				var urlTarget = content.url || null;
				var contentValue = content.value || ""; 
				var contentType = content.type || "get"; 
				var contentReplace = content.replace || null; 
				var contentImgSrc = ""; 
				var contentImgSize = ""; 

				if(content.img){
					var contentImgSrc = content.img.src || ""; 
					var contentImgSize = content.img.size || ""; 
				}

				var contentHtml = '<div id="content-value_'+id+'" data-windbox="content-value" >'+contentValue+'</div>';

					

			}else{
				var contentHtml = '<div id="content-value_'+id+'" data-windbox="content-value" ></div>';

			}
			


			if(contentImgSize == 'auto'){
				var sizeAjust = 'width:auto';
			}else if(contentImgSize == 'full'){
				var sizeAjust = 'width:100%';
			}else{
				var sizeAjust = 'width:100%';
			}

			if(content != null){
				contentHtml += '<img id="windbox_contentimg_'+id+'" src="'+contentImgSrc+'">';
			}else{
				contentHtml += '';
			}


			icon = this.adjustIcon(icon);

			
			var drawInputs = this.drawInputs(id);		
			
			

			document.getElementById('windbox_footerleft_'+id).innerHTML = drawInputs.controlLeft+''+drawInputs.control;
			document.getElementById('windbox_footercenter_'+id).innerHTML = drawInputs.controlCenter;
			document.getElementById('windbox_footerright_'+id).innerHTML = drawInputs.controlRight;		

			document.getElementById('windbox_headericon_'+id).innerHTML = icon+drawInputs.headerLeft;
			document.getElementById('windbox_headertitle_'+id).innerHTML = title+drawInputs.headerCenter;
			document.getElementById('windbox_headerright_'+id).innerHTML = drawInputs.headerRight;

			

			document.getElementById('windbox_content_'+id).innerHTML = contentHtml+'<div data-rel="inputContentWrapper">'+drawInputs.content+'</div>';

			


			
				// return false;

			this.imgAdjust(id);	
			if(content != null){	
				document.getElementById('windbox_contentimg_'+id).style.display='none';

			}


			action.loading.show();

			alignBoxTime = setInterval(function(){					
	 			windbox(id).alignBox(id);
				action.loading.show();	
			},100);
			

			if(urlTarget != null){		

				

					windbox(id).ajax({
						url:urlTarget,
						type:contentType,
						success:function(response){	

							if( contentReplace != null){
								for(rep in contentReplace){								
									response = response.replace(new RegExp(rep, 'g'),contentReplace[rep]);	
								}
							}
							

							// document.getElementById('windbox_content_'+id).innerHTML = document.getElementById('windbox_content_'+id).innerHTML+response;
							document.getElementById('content-value_'+id).innerHTML = response;

							clearInterval(alignBoxTime);
							windbox(id).alignBox(id);							
							action.loading.hide(id);		

							if(callback)
								callback({
									type:'ajax',
									value:response
								});					

						}
					});
					
			}else{

				if(content != null){
					if(!content.img){					
						clearInterval(alignBoxTime);
						action.loading.hide();	
						windbox(id).alignBox(id);
						if(callback)
								callback({
										type:'string',
										value:contentValue
									});
					}
				}
								
			}


			
			

		
			if(content != null){
				if(content.img){


					document.getElementById('windbox_contentimg_'+id).style.visibility='hidden';
					document.getElementById('windbox_contentimg_'+id).style.display='block';				
					document.getElementById('windbox_contentimg_'+id).onload = function(){												
						windbox(id).imgAdjust(id,function(){	
									document.getElementById('windbox_contentimg_'+id).style.visibility='visible';
								clearInterval(alignBoxTime);
								windbox(id).alignBox(id);
								action.loading.hide();	
								if(callback)
									callback({
										type:'img',
										value:document.getElementById('windbox_contentimg_'+id).src
									});
						
						});	
					};
				}
			}else{				
				clearInterval(alignBoxTime);
				windbox(id).alignBox(id);							
				action.loading.hide(id);
				
				if(callback)
					callback({
						type:null,
						value:null
					});
			}

			this.setEvents(id);
		}


		

		return this;
	}

	

	window.windbox = Functions;
})();
// essential for use with call function
windbox().browser.load(function(){	
	action.setOnload();
});