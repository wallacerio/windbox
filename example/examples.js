function example0(){	
	windbox('plugin',{
	    icon:'[info]',
	    title:'WindBox',                        
	    content:{
	         value:'hello world',           
	    }           
	}).show();
}

function example1(){	
	windbox('example1',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,	
		escape:false,	
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
	windbox('example2',{
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
	windbox('example3',{
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

	


	if( windbox('example4').status != 'opened'){

			windbox('example4',{
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
		windbox('example4').show();
	else
		windbox('example4').hide();

}



function example5(){
	windbox('example5',{
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



function example6(){
	windbox('example6',{
		icon:'[info]',
		title:'WindBox',			
		fixed:true,		
		drag:true,			
		content:{
			value:"This is a example 6"		
		},
		callback:function(result){	
			action.icon("[loading]");
			action.title("Example 6");
		},
		input:{			
			"close":{
				"container":"control-right",
				"type":"a",
				"value":"Close",									
				click:function(){
				    action.close();
				
					return false;
				}
			},
			"ok":{
				"container":"control-left",
				"type":"submit",
				"value":"OK",									
				click:function(){							
				    action.close();
				
					return false;
				}
			},
			"number":{
				"container":"content",
				"type":"text",
				"placeholder":"Number",	
				attr:{
					"required":"required"
				},	
				change:function(){					
					action.input('labelresult').innerHTML = windbox().stringChange.noaccents(this.value);
				}											
			},
			"label":{
				"container":"content",
				"type":"label",
				"value":"Result no accents:",	
				attr:{
					"for":"number"
				}										
			},
			"labelresult":{
				"container":"content",
				"type":"label",
				"value":"#",	
				attr:{
					"for":"number"
				}										
			}
		}
	}).show();	
}