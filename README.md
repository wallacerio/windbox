<h1>WindBox 1.3</h1>
Plugin javascript Modal box cross-browser
<p>Developed by Wallace Rio <wallrio@gmail.com></p>

last update: 19/05/2016
<hr>

<h3>Cross-Browser</h3>
<p>Tested on Firefox 45 / IE 8 / Opera 12 / Chrome 38 / Safari 5</p>

<h3>Use</h3>
<p>Insert script tag and link tag into your head document html</p>

    <link  rel="stylesheet" href="windbox.css">
    <script type="text/javascript" src="windbox.js"></script>

<h2>Change the style on css file (windbox.css)</h2>
<p>Is recommend include other file css for changes</p>
    <p>Your can change style via javascript</p>
<hr>

<h3>Example</h3>

<h2>Example 1 - Modal minimal</h2>
<p>Use script above:</p>

    windbox('plugin',{
        icon:'[info]',
        title:'WindBox',                        
        content:{
             value:'hello world',           
        }           
    }).show();



<h2>Example 2 - Modal default</h2>
<p>Use script above:</p>

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
    


<h2>Example 3 - Ajax request with callback to content</h2>
<p></p>

    windbox('plugin',{
        icon:'[info]',
        title:'WindBox',            
        fixed:true,     
        drag:true,      
        content:{
             url:'example2.txt',            
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



<h2>Example 4 - Show modal with image</h2>
<p></p>

    windbox('plugin',{
        icon:'[info]',
        title:'WindBox',            
        fixed:true,     
        drag:true,      
        content:{
             img:{              
                size:0.7,               
                src:'example3.jpg'
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

<hr>

<h2>Example 5 - Show/Hide modal with link action</h2>
<p>Your can create windbox without '.show()' or '.hide()' and call last</p>

    windbox('plugin').show();
    or
    windbox('plugin').hide();


<h3>Example 6 - Show modal custom css style</h3>
<p></p>

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


<h2>input actions/attribute </h2>
<p>call functions to run on action of inputs</p>

<h4>click</h4> 

    input:{         
        "id_of_input":{
            "container":"control-right",
            "type":"a",
            "value":"button",                                   
            click:function(){
                // script to run
            }
        }
    }


<h4>keyup</h4>

    input:{         
        "id_of_input":{
            container:"control-right",
            type:"a",
            value:"button",                                 
            keyup:function(){
                // script to run
            }
        }
    }


<h4>change</h4> 

    input:{         
        "id_of_input":{
            container:"content",
            type:"text",
            value:"button",                                 
            change:function(){
                // script to run
            }
        }
    }


<h4>Attribute</h4>

    input:{         
        "id_of_input":{
            container:"content",
            type:"text",
            value:"button",                                 
            attr:{
                "required":"required"
            }
        }
    }


<h4>Css</h4>

    input:{         
        "id_of_input":{
            container:"content",
            type:"text",
            value:"button",                                 
            css:{
                "background":"red"
            }
        }
    }



<hr>

<h3>API - javascript</h3>
    
<strong>icon = </strong> define icon to box - (info/question/success/error/loading/success_email)<br>
<strong>title = </strong> (string) define text title to box<br>
<strong>cssclass = </strong> (string) string of class css<br>
<strong>css = </strong> (string) string of css style by json<br>
<strong>target = </strong> (boolean) define locate to load box<br>
<strong>fixed = </strong> (boolean) define if box fixed or absolute<br>
<strong>drag = </strong> (boolean) define if box movable<br>
<strong>limitWindow = </strong> (boolean) define limit to movable box <br>
<strong>escape = </strong> (boolean) define if close box on 'esc' key <br>
<strong>content = </strong> define content of box<br>
<strong>content.value =</strong> (string) define content with string<br>
<strong>content.url =</strong> (string) define content by ajax<br>
<strong>content.img =</strong> (string) define content with image<br>
<strong>content.img.size = </strong> define size of image - (auto/full/parcent)<br>
<strong>content.img.src =</strong> (string) define source of image<br>
<strong>callback = </strong> (function clousure) define callback after load content<br>
<strong>input = </strong> define buttons to box<br>
<strong>input.container =</strong> define locate to insert button - (control-right/control-center/control-left)<br>
<strong>input.type =</strong> define type of button - (a/button/submit/text/textarea/select)<br>
<strong>input.required =</strong> (boolean)<br>
<strong>input.placeholder =</strong> (string)<br>
<strong>input.options =</strong> options of select - (json)<br>
<strong>makeinput =</strong> create input to use on inputs<br>
<strong>parameters =</strong> (json) use to pass parameters to functions of WindBox<br>
<strong>pattern =</strong> (regex) use to format input<br>



<hr>
<strong>actions </strong><br>
call functions to run on click button and callback<br><br>

<strong>action.close(id); =</strong> close box<br>
<strong>action.title(string); =</strong> change title of box<br>
<strong>action.icon(string); =</strong> change icon of box<br>
<strong>action.loading.show(id); =</strong> show loading info<br>
<strong>action.loading.hide(id); =</strong> hide loading info<br>
<strong>action.ajax(json); =</strong> ajax similary jquery <br>

<hr>
<strong>actions out plugin function</strong><br>
call functions to run on click button and callback<br><br>

<strong>windbox(id).show(id); =</strong> show the modal box (id optional)<br>
<strong>windbox(id).hide(id); =</strong> hide the modal box (id optional)<br>
<strong>windbox(id).change(json); =</strong> hide the modal box (content json use parameters of windbox create)<br>
<strong>windbox(id).stringChange.noaccents(string); =</strong> convert string to no accents<br>
<strong>windbox(id).stringChange.toUrl(string); =</strong> convert string to url format<br>


