/**
 * WindBox 1.0 - 10/04/2016
 * modal box cross-browser
 * 
 * developed by Wallace Rio <wallrio@gmail.com>
 * wallrio.com
 * 
 * tested on firefox/chrome/opera/ie8/safari
 */

(function(){

	var listWindow = [];
	var zindex = 100;
	var contBox = 0;
	var alignBoxTime = 0;
	var documentLoaded = false;

	var Functions = function(idBox,options){

		if( options != undefined ){

			contBox++;

			var title = options['title'] || null;						
			var icon = options['icon'] || null;
			var content = options['content'] || null;										
			var target = options['target'] || null;										
			var cssclass = options['cssclass'] || null;										
			var fixed = options['fixed'] || null;										
			var input = options['input'] || null;	
			var callback = options['callback'] || null;	

			if(options['fixed'] != null) var fixed = options['fixed']; else var fixed = true;

			if(options['drag'] != null) var drag = options['drag']; else var drag = true;

			if(options['limitWindow'] != null) var limitWindow = options['limitWindow']; else var limitWindow = true;

			if(options['escape'] != null) var escape = options['escape']; else var escape = true;


			var op = {};
			op.title = title;					
			op.icon = icon;
			op.content = content;
			op.target = target;
			op.cssclass = cssclass;
			op.input = input;
			op.fixed = fixed;
			op.callbackIng = null;
			op.escape = escape; // not implemented
			op.limitWindow = limitWindow; // not implemented
			op.callback = callback;
			op.status = "closed";
			op.drag = {status:drag,selected:false,x:0,y:0,elemX:0,elemY:0};
		
			listWindow[idBox] = op;
			this.id = idBox;



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
			var xmlhttp =[];			
			var count = contBox;
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
			xmlhttp[count].open(type, url,true);
			xmlhttp[count].onreadystatechange=function() {
				if (xmlhttp[count].readyState==4){		        	
					var resposta = xmlhttp[count].responseText;		            
					if(success)
						success(resposta);		           
				}
			}
			xmlhttp[count].send(data); 
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


		
		/**
		 * draw the box
		 */
		this.draw = function(id,callback){
			id = id || this.id;

			var target = listWindow[id].target;
			var cssclass = listWindow[id].cssclass;
			var fixed = listWindow[id].fixed;
			
			

			var html = '';				
				html += '<form data-windbox="windbox" id="windbox_'+id+'" class="'+((cssclass!=undefined)?cssclass:'windbox_default')+'" >';
					html += '<div data-windbox="background" id="windbox_background_'+id+'" ></div>';
					html += '<div data-windbox="wrapper" id="windbox_wrapper_'+id+'" >';
						html += '<div data-windbox="box" id="windbox_box_'+id+'" >';

						html += '<div data-windbox="loading" id="windbox_loading_'+id+'" >';
						html += '<div data-windbox="loading-content" id="windbox_loadingcontent_'+id+'" ></div>';
						html += '</div>';

						html += '<div data-windbox="header" id="windbox_header_'+id+'" >';
							html += '<div data-windbox="header-icon" id="windbox_headericon_'+id+'" ></div>';
							html += '<div data-windbox="header-title" id="windbox_headertitle_'+id+'" ></div>';
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

					document.getElementById('windbox_box_'+id).style['-webkit-transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['-moz-transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['transition'] = 0+'ms';					   
					document.getElementById('windbox_box_'+id).style['-o-transition'] = 0+'ms';


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
					});								
			}
			

									
			

		}

		/**
		 * draw the inputs in the box
		 */
		this.drawInputs = function(id){	
			id = id || this.id;

			var inputsLoading = '';
			var inputsHeaderControl = '';
			var inputsContent = '';
			var inputsControl = '';
			var inputsControlRight = '';
			var inputsControlLeft = '';
			var inputsControlCenter = '';

			var inputs = listWindow[id].input || null;
			
		

			for( key in inputs){		
				var type = inputs[key].type || 'a';
				var value = inputs[key].value;
				var css = inputs[key].css;
				var click = inputs[key].click;
				var container = inputs[key].container || 'control';

				

				if(type == 'submit'){
					inputsHtml = '<button type="submit" data-type="submit" name="'+key+'" id="windbox_input_'+id+'_'+key+'" >'+value+'</button>';					
				}else if(type == 'button'){
					inputsHtml = '<button type="button" data-type="button" name="'+key+'" id="windbox_input_'+id+'_'+key+'" >'+value+'</button>';
				}else if(type == 'a'){
					inputsHtml = '<a name="'+key+'" id="windbox_input_'+id+'_'+key+'" data-type="a" >'+value+'</a>';
				}

				if(container == 'loading'){

					inputsLoading += inputsHtml;
				}else if(container == 'control'){
					inputsControl += inputsHtml;					
				}else if(container == 'control-right'){
					inputsControlRight += inputsHtml;
				}else if(container == 'control-left'){
					inputsControlLeft += inputsHtml;	
				}else if(container == 'control-center'){
					inputsControlCenter += inputsHtml;	
						
				}else if(container == 'header'){
					inputsHeaderControl += inputsHtml;
				}else if(container == 'content'){
					inputsContent += inputsHtml;
				}

			}


			return {
				control:inputsControl,
				controlRight:inputsControlRight,
				controlCenter:inputsControlCenter,
				controlLeft:inputsControlLeft
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

		/**
		 * initialize setup events		 
		 */
		this.setEventsInit = function(id){
			var inputs = listWindow[id].input || null;


			if(inputs != null){	
				
				var parent = this;
				for(keys in inputs){
				
					var type = inputs[keys].type;
					var value = inputs[keys].value;
					var css = inputs[keys].css;
					var click = inputs[keys].click;
					
					if( document.getElementById("windbox_input_"+id+'_'+keys) != null){
					
					document.getElementById("windbox_input_"+id+'_'+keys).onclick = null;					
						

						if(type == 'submit'){
	 
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
				
			}
		}


		/**
		 * adjust image defined by attribute content.img
		 */
		this.imgAdjust = function(id,callback){
			var content = listWindow[id].content;
			var contentImgSrc = ""; 
			var contentImgSize = ""; 
			if(content.img){
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

			

			if(callback)
				callback();
		}

		/**
		 * adjust icon defined by string
		 */
		this.adjustIcon = function(icon){

			icon = icon.replace('[info]','<div class="iconinfo"></div<');
			icon = icon.replace('[loading]','<div class="iconloading"></div<');
			icon = icon.replace('[success]','<div class="iconsuccess"></div<');
			icon = icon.replace('[error]','<div class="iconerror"></div<');
			icon = icon.replace('[question]','<div class="iconquestion"></div<');

			return icon;
		}


		/**
		 * actions for use by user	
		 */
		this.action = {	
			setOnload:function(string){
				documentLoaded = true;
			},
			title:function(string){
				document.getElementById('windbox_headertitle_'+id).innerHTML = string;
			},
			icon:function(string){
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
					}		
				}

				document.body.removeChild(document.getElementById('windbox_'+id));
									
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

			listWindow[id].status = "opened";


			var icon = listWindow[id].icon;
			var title = listWindow[id].title;
			var content = listWindow[id].content;
			var callback = listWindow[id].callback;

			var urlTarget = content.url || null;
			var contentValue = content.value || ""; 
			var contentType = content.type || "get"; 
			var contentImgSrc = ""; 
			var contentImgSize = ""; 
			if(content.img){
				var contentImgSrc = content.img.src || ""; 
				var contentImgSize = content.img.size || ""; 
			}

			
			var contentHtml = contentValue;


			if(contentImgSize == 'auto'){
				var sizeAjust = 'width:auto';
			}else if(contentImgSize == 'full'){
				var sizeAjust = 'width:100%';
			}else{
				var sizeAjust = 'width:100%';
			}

			contentHtml += '<img id="windbox_contentimg_'+id+'" src="'+contentImgSrc+'">';


			icon = this.adjustIcon(icon);


			var drawInputs = this.drawInputs(id);			
			document.getElementById('windbox_footerleft_'+id).innerHTML = drawInputs.controlLeft+''+drawInputs.control;
			document.getElementById('windbox_footercenter_'+id).innerHTML = drawInputs.controlCenter;
			document.getElementById('windbox_footerright_'+id).innerHTML = drawInputs.controlRight;		

			document.getElementById('windbox_headericon_'+id).innerHTML = icon;
			document.getElementById('windbox_headertitle_'+id).innerHTML = title;
			document.getElementById('windbox_content_'+id).innerHTML = contentHtml;

			this.imgAdjust(id);		
			document.getElementById('windbox_contentimg_'+id).style.display='none';
			


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
						
							document.getElementById('windbox_content_'+id).innerHTML = document.getElementById('windbox_content_'+id).innerHTML+response;

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

			}


			if(contentValue){					
					clearInterval(alignBoxTime);
					action.loading.hide();	
					windbox(id).alignBox(id);
					if(callback)
							callback({
									type:'string',
									value:contentValue
								});
				}
		

	

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