function example1(){	
	windbox('plugin',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,		
		content:{
			 value:'hello world',			
		},
		callback:function(result){		
		},
		input:{
			"alert":{
					"container":"control-right",
					"type":"a",
					"value":"Alert",									
					click:function(){								
						alert('this is alert');
						return false;
					}
				},
				"alert2":{
					"container":"control-center",
					"type":"button",
					"value":"Alert2",									
					click:function(){				
					    alert('this is alert 2 ');
					
						return false;
					}
				},
				"close2":{
					"container":"control-left",
					"type":"submit",
					"value":"Close",									
					click:function(){				
					    action.close();
					
						return false;
					}
				}
		}
	}).show();	
}



function example2(){
	windbox('plugin',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,		
		content:{
			 url:'example/example2.txt',			
		},
		callback:function(result){	
			action.icon("[success]");
			action.title("Success request");
			
		},
		input:{			
			"close":{
				"container":"control-center",
				"type":"submit",
				"value":"Close",									
				click:function(){				
				    action.close();
				
					return false;
				}
			}
		}
	}).show();
}


function example3(){
	windbox('plugin',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,		
		content:{
			 img:{				
				size:0.7,				
				src:'example/example3.jpg'
			}		
		},
		callback:function(result){	
			action.icon("[success]");
			action.title("Success load image");
		},
		input:{			
			"close":{
				"container":"control-center",
				"type":"submit",
				"value":"Close",									
				click:function(){				
				    action.close();
				
					return false;
				}
			}
		}
	}).show();	
}







function example4(mode){

	

	if( windbox('plugin').status != 'opened'){

			windbox('plugin',{
				icon:'[info]',
				title:'WindBox',
				css:{
					background:{
						out:{
							'display':'none'
						}
					}
				},			
				fixed:true,		
				drag:true,		
				content:{
					 value:'Show/Hide',			
				},
				callback:function(result){	
					action.icon("[success]");
					action.title("Success request");
					
				},
				input:{			
					"close":{
						"container":"control-center",
						"type":"submit",
						"value":"Close",									
						click:function(){				
						    action.close();
						
							return false;
						}
					}
				}
			});


		}

	if(mode == 'show')
		windbox('plugin').show();
	else
		windbox('plugin').hide();

}



function example5(){
	windbox('plugin',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,	
		cssclass:"custom",
		content:{
			value:"words"		
		},
		callback:function(result){	
			action.icon("[success]");
			action.title("Custom css");
		},
		input:{			
			"close":{
				"container":"control-center",
				"type":"submit",
				"value":"Close",									
				click:function(){				
				    action.close();
				
					return false;
				}
			}
		}
	}).show();	
}