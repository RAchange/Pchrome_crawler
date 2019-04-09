<!--
    eventUtil = window.eventUtil || {
        addEvent: function() {
            if(window.addEventListener) {
                return function(el, eventName, fn) {
                    el.addEventListener(eventName.replace(/^on/i, ""), fn, false);  
                };
            } else if (window.attachEvent) {
                return function(el, eventName, fn) {
                    if(eventName.match(/^onmouse/i) && el == window) el = document.body;
                    el.attachEvent(eventName, fn);
                };  
            } else {  
                return function(el, eventName, fn) {  
                    el["on" + eventName] = fn;  
                };  
            }  
        }(),
        ready : function(callback) {
            if(document.addEventListener) {
                document.addEventListener('DOMContentLoaded', callback, false); 
            }else if(document.attachEvent) {
                document.attachEvent('onreadystatechange',function(){
                    if(document.readyState == 'complete'){ //document.readyState == 'interactive'
                        document.detachEvent('onreadystatechange', arguments.callee); //為了避免2次觸發
                        callback();
                    }
                });
            }else{
                window.onload = callback;
            }            
        },
        defineEvent: function() {
            if(window.event) return;
            window.constructor.prototype.__defineGetter__("event",
                function () {
                    for(var func= arguments.callee.caller; func; func=func.caller) {
                        var arg0=func.arguments[0];
                        if(arg0){
                            if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)) return  arg0;
                        }
                    }
                    return null;
                }
            )
        }
    }

    scriptUtil = window.scriptUtil || {
        me : (function() {
            var scripts = document.getElementsByTagName('script');
            return function() { return scripts[scripts.length - 1]; };
        }()()),
        addScript : function(proto){
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.charset = 'big5';

            //if(proto.onload && !window.addEventListener) {
            if(proto.onload && (!window.addEventListener || navigator.userAgent.match(/MSIE (\d)/))) {
                proto.onreadystatechange = function() {
                    
                    if(this.readyState == 'loaded' || this.readyState =='complete') {
                        this.onreadystatechange = null;
                        (document.readyState === "complete")?proto.onload():eventUtil.ready(proto.onload);
                    }
                }
            }
            
            for(var k in proto) newScript[k] = proto[k];
            return document.getElementsByTagName("head")[0].appendChild(newScript);
        },
        Utilevadd : function(){
            if(!scriptUtil.evList) scriptUtil.evList = new Array();
            scriptUtil.evList.push(arguments);
        }   
    }

  window.defaultStatus = "PChome 商店街";
  window.status =	"PChome 商店街";
  var checkedit = 1;
  var XMLHTTP_val = "", xmlhttp;
  var menu_bar = new Object;

  window.onerror = HandleError;

  function HandleError(message, url, line) {
    var str = "An error has occurred in this dialog." + "\n\n"
    + "Error: " + line + "\n" + message;
//alert(str);
    //window.status = str;
    return true;
  }

  function store_submit(){
    var fun_string = "";
    var argv = new Array();
    var result, err = 0;
    for(var i=0; i <store_submit.arguments.length; i++){
      if(i == 0){
      	fun_string = "result=" + store_submit.arguments[i];
      }else{
        argv[i - 1] = '"' + store_submit.arguments[i] + '"';
      }
    }
    if(fun_string.length){
      eval(fun_string + "(" + argv.join(',') + ")");
      if(result < 0) return;
    }
    if(checkedit) if(check_value(document.main_store)) return;
    document.main_store.submit();
  }
  
  function check_value(obj){
    var m_title;
    var err = 0;
    for(var i=0;i<obj.elements.length;i++){
      if(obj.elements[i].isContentEditable){
      	m_title = "";
        if(obj.elements[i].title) m_title = obj.elements[i].title;
        if(m_title.match(/NOT_CHECK/)) continue;
        var tmp_value =  obj.elements[i].value.replace(/^\s*/,"");
        if(!tmp_value.replace(/\s*$/,"")){ alert(" " + ((m_title)?m_title:"") + "資料填寫內容不可空白！"); err=1;}
        // if(!document.main.elements[i].value.replace(/^\s*(.*?)\s*$/,"$1")){ alert(" " + ((m_title)?m_title:"") + "資料填寫內容不可空白！"); err=1;}
        //if(!err && obj.elements[i].value.match(/('|"|\$|\%|\&|\\|\|)/i)){ alert(" " + ((m_title)?m_title:"") + "資料填寫內容不可有\n『 \'、 \"、\$、\%、\&、\\ 或 \|』符號"); err=1;}
        if(!err && obj.elements[i].value.match(/('|"|\\)/i)){ alert(" " + ((m_title)?m_title:"") + "資料填寫內容不可有\n『 \'  \"  \\ 』符號"); err=1;}
        if(err) {
          obj.elements[i].focus();
          return -1;
        }
      }
    }
  }
  function check_lens(obj){
    for(var i=0;i<obj.elements.length;i++){
      if(obj.elements[i].isContentEditable && strlens(obj.elements[i].value) > obj.elements[i].lang){
        var s_title = obj.elements[i].title.replace("/NOT_CHECK/","");
        alert(s_title +" 字元過長 (上限字元-"+ obj.elements[i].lang+")");
        obj.elements[i].focus();
        return -1;
      }
    }
  }
  function go_store(){
    var store_name = "";
    store_name = get_cookie("store_name");
    if(!store_name){
      window.top.location.href = "http://www.pcstore.com.tw/";
    }else{
      window.top.location.href = "http://www.pcstore.com.tw/" + store_name + "/";
    }
  }

  function make_exh(e_id){
    this.exh_no = c_exh_no[e_id];
    this.exh_parent = c_exh_parent[e_id];
    if(c_exh_sort_new) this.sort = parseInt(c_exh_sort_new[e_id]);
    this.name = c_exh_name[e_id];
  }

  function make_menu_bar(){
    if(!window.exh_arr || menu_bar.P000000) return;
    window.main_exh_counts = 0;
    for(var i=0; i < exh_arr.length; i++) if(exh_arr[i].exh_no == exh_arr[i].exh_parent) {
      eval("menu_bar." + exh_arr[i].exh_no + "= new Object");
      window.main_exh_counts ++;
    }
    for(var i=0; i < exh_arr.length; i++) {
      if(!menu_bar[exh_arr[i].exh_parent]) continue;
      eval("menu_bar." + exh_arr[i].exh_parent + "." + exh_arr[i].exh_no + "= exh_arr[i]");
      if(menu_bar[exh_arr[i].exh_parent].length){
      	menu_bar[exh_arr[i].exh_parent].length ++;
      }else{
        menu_bar[exh_arr[i].exh_parent].length = 1;
      }
    }
  }
  
  function make_left_bar(){
    var exhs = 0, is_show, s_link = "",re, icon = "storegreen_66.gif";
    var left_str ='';
    make_menu_bar();
    
    for(var i=0; i < window.document.styleSheets.length; i ++){
      if( re= window.document.styleSheets[i].href.match(/store([\w_]+)\.css/)){
         icon =  "store" + re[1].replace("_ssl","") + "_66.gif";
         break;
      }
    }
    
    for(var main_exh in menu_bar){
      var parent_name = main_exh;
      var tmpobj = eval( "menu_bar." + main_exh);
      var main_obj = eval( "menu_bar." + main_exh + "." + main_exh);
      if((!window.location.href.match(/preview/) && tmpobj.length == 1) || main_obj.name=="首頁" || (main_obj.show && main_obj.show == "N")) continue;
        left_str +='<div class=cate_s><img height="15" hspace="3" src="'+ img_url +'/web_img/supimg/'+ icon +'" width="15" align="absMiddle" border="0">'+ main_obj.name +'<span style="font-size: 11px"></span></div>';

      var tmp_str = "<ul class=category_lo>";
      for(var sub_exh in tmpobj){
        if(sub_exh == parent_name || sub_exh=="length") continue;
        if( (is_show = eval("menu_bar." + parent_name + "." + sub_exh + ".show")) ){
          if(is_show == "N") continue;
        }
        s_link = c_store_name+'/' + sub_exh + '.htm';
        if(window.sup_sub_exh && window.sup_sub_exh == sub_exh){
          tmp_str += '<li><a href="/'+ s_link +'"><font color="red">'+ eval( "menu_bar." + parent_name + "." + sub_exh + ".name") +'</font></A></li>';
        }else{
          tmp_str += '<li><a href="/'+ s_link +'">'+ eval( "menu_bar." + parent_name + "." + sub_exh + ".name") +'</A></li>';
        }
      }
      tmp_str +='</ul>';
      if(tmp_str.length) left_str += tmp_str;
      exhs ++;
    }
    var left_obj = document.getElementById("left_bar");
    if(left_obj) left_obj.innerHTML = left_str;
  }


///////////// TOOL function ///////////////
  function reg_check(){
    var reg_value = "^[A-Z0-9_a-z]+$";
    if(arguments.length == 2) reg_value = arguments[1];
    var re = new RegExp(reg_value);
    if(re.exec(arguments[0])) return true;
    return null;
  }

  function lock_edit(obj){
    for(i=0;i<obj.elements.length;i++){
      if(obj.elements[i].type.match(/select/) && obj.elements[i].title !="nolock") obj.elements[i].disabled = true;
      if(obj.elements[i].isContentEditable) obj.elements[i].contentEditable = false;
    }
  }

  function make_search_option(){
    var obj=document.main_store.slt_k_range;
    if (!obj) return;
    var o_len = obj.length;
    for(var main_exh in menu_bar){
      if(menu_bar[main_exh][main_exh].name == "首頁") {
        var option = new Option("PChome全館", "all");
      }else{
        var option = new Option(menu_bar[main_exh][main_exh].name, main_exh);
      }
      obj[o_len++] = option;
    }
    if(window.search_range){
      for(var i=0; obj.length; i++){
        if(obj[i].value == window.search_range){
          obj[i].selected = true; break;
        }
      }
    }
  }

  function s_k_search(act_url){
     var act_arg="";

     //sell 目錄沒有/adm/ 所以要直接導 store.pchome
     if(window.location.host.indexOf('sell')<0){var new_urlhost='';}
     else{var new_urlhost='http://' + window.location.host.substring(window.location.host.indexOf('.')+1,window.location.host.length);}
     
     if(document.main_store.store_k_word.value == "請輸入關鍵字"){
        alert("請輸入輸入關鍵字!!");
        document.main_store.store_k_word.focus();
        return false;
     }
     if(document.main_store.slt_k_option.value=="10"){ //商品編號
      	s_value=document.main_store.store_k_word.value.replace(/^M|C/i,"");
        s_value=s_value.replace(/\s/g,"");
        if(!s_value.match(/^\d+$/i) || strlens(s_value) > 10 || strlens(s_value) == 9){
          alert("請輸入商品編號，如:M0000001 或 C1000000001");
          return false;
        }
        if(strlens(s_value) == 10){
          begin = s_value.length - 10;
          s_value='C'+s_value.substr(begin,10);
        }else{
          s_value='0000000'+s_value;
          begin = s_value.length - 8;
          s_value='M'+s_value.substr(begin,8);
        }
        document.main_store.store_k_word.value=s_value;         
     /*
     }else if(document.main_store.slt_k_option.value=="11"){ //賣家編號
      	s_value=document.main_store.store_k_word.value.replace(/^S/i,"");
        s_value=s_value.replace(/\s/g,"");
        if(!s_value.match(/^\d+$/i) || strlens(s_value) > 9){
          alert("請輸入賣家編號，如:S000000001");
          return false;
        }
        s_value='000000000'+s_value;
        begin = s_value.length - 9;
        s_value='S'+s_value.substr(begin,9);
        document.main_store.store_k_word.value=s_value;
     */
     }else if(strlens(document.main_store.store_k_word.value) < 2) {
        alert("輸入關鍵字資料太少，請重新輸入");        
        document.main_store.store_k_word.focus();        
        return false;
     }
     // 1、商店街全部商品 2、店家全部商品 3、個人市場全部商品 4、店家名稱 5、個人ID
     // Old No 1.商店街全部商品 3.店家全部商品 4.個人市場全部商品 2.店家名稱 5.個人ID
     // 20061213 Fion 修改 若指定act_url,將資料送至act_url
     if(act_url){
     	 ss=encodeURIComponent(convert_unicode(document.main_store.store_k_word.value));
       if (document.main_store.store_k_word) act_arg += "?store_k_word="+ss.base64_encode();
       if (document.main_store.slt_k_option) act_arg += "&slt_k_option="+document.main_store.slt_k_option.value;
       if (document.main_store.slt_k_range) act_arg += "&slt_k_range="+document.main_store.slt_k_range.value;
       if ( document.main_store.slt_k_option.value == 2 || document.main_store.slt_k_option.value == 5) {
      	 document.main_store.action = act_url.replace("psearch.htm","psearch_store.htm")+act_arg;
     	   //document.main_store.action = new_urlhost + "/adm/psearch_store.htm" + act_arg;
       }
       else if ( document.main_store.slt_k_option.value == 11){
         act_url = act_url.replace("www","seller");
         document.main_store.action = act_url.replace("/adm/psearch.htm","/srch/search_seller.htm")+act_arg;
       } 
       else {
     	   document.main_store.action = act_url + act_arg;
     	   //document.main_store.action = new_urlhost + act_url + act_arg;
       }       
     }else if( document.main_store.slt_k_option ) {
     	return;
      /* act_url 已是必填參數 20090305
     	 if ( document.main_store.slt_k_option.value == 2 || document.main_store.slt_k_option.value == 5 )
     	   document.main_store.action = new_urlhost + "/adm/search_store.htm";
     	 else
     	   document.main_store.action = new_urlhost +"/adm/search.htm";
     */
     }
     document.main_store.submit();
  }

  function sup_k_search(act_url){
     var act_arg="";

     if(document.main_store.store_k_word.value == "請輸入關鍵字"){
        alert("請輸入輸入關鍵字!!");
        document.main_store.store_k_word.focus();
        return false;
     }
     if(strlens(document.main_store.store_k_word.value) < 2) {
        alert("輸入關鍵字資料太少，請重新輸入");        
        document.main_store.store_k_word.focus();        
        return false;
     }
     
     ss=encodeURIComponent(convert_unicode(document.main_store.store_k_word.value));
     if (document.main_store.store_k_word) act_arg += "?store_k_word="+ss.base64_encode();
     if (document.main_store.slt_supk_option) act_arg += "&slt_supk_option="+document.main_store.slt_supk_option.value;
     if (document.main_store.inexh) act_arg += "&inexh="+document.main_store.inexh.value;

     var httpurl="";
     //if(!window.location.host.match("pcstore.com.tw")) httpurl="http://www.pcstore.com.tw";
     act_url=(document.main_store.slt_supk_option.value == 1)?act_url:"/adm/psearch.htm";
     document.main_store.action = httpurl+act_url+act_arg;

     document.main_store.submit();
  }
  
  function set_keycode(m_env){
    if(window.event) return;
    window.m_env = m_env;
    eval(document.key_fun);
    if(window.click_src) {
      eval("document.onclick=" + window.click_src);
      eval(window.click_src + "(e);");
    }else{
      document.onclick = null;
    }
  }
  
  // 20061218 Fion 修改 指定psearch或search
  function p_keydown(s_value, opt, act_url, s_try ,ee) {
    var act_arg="";

    if(ee && (!ee.keyCode && !s_try)){
      document.key_fun = "keyDown('"+s_value+"','"+opt+"','"+act_url+"', 'retry')";
      if(document.onkeydown) window.click_src = document.onkeydown.name;
      document.onkeydown = set_keycode;
      return;
    }
    var keyCode = (ee.keyCode)?ee.keyCode:ee.which;
    if (keyCode != 13) return -1;

    if (opt == "search" || opt =="psearch"){
      if(document.main_store.slt_k_option.value=="10"){ //商品編號
      	s_value=s_value.replace(/^M|C/i,"");
        s_value=s_value.replace(/\s/g,"");        
        if(!s_value.match(/^\d+$/i) || strlens(s_value) > 10 || strlens(s_value) == 9){
          alert("請輸入商品編號，如:M0000001 或 C1000000001");
          return false;
        }
        if(strlens(s_value) == 10){
          begin = s_value.length - 10;
          s_value='C'+s_value.substr(begin,10);
        }else{
          s_value='0000000'+s_value;
          begin = s_value.length - 8;
          s_value='M'+s_value.substr(begin,8);
        }
        document.main_store.store_k_word.value=s_value; 
      /*  
      }else if(document.main_store.slt_k_option.value=="11"){ //賣家編號
      	s_value=s_value.replace(/^S/i,"");
        s_value=s_value.replace(/\s/g,"");
        if(!s_value.match(/^\d+$/i) || strlens(s_value) > 9){
          alert("請輸入賣家編號，如:S000000001");
          return false;
        }
        s_value='000000000'+s_value;
        begin = s_value.length - 9;
        s_value='S'+s_value.substr(begin,9);
        document.main_store.store_k_word.value=s_value;
      */        
      }else if(strlens(s_value) < 2) {
        alert("輸入關鍵字資料太少，請重新輸入");
        document.main_store.store_k_word.focus(); 
        return false;
      }
    }
    if (opt == "search" || opt =="psearch"){
      if(window.location.host.indexOf('sell')<0){var new_urlhost='';}else{var new_urlhost='http://' + window.location.host.substring(window.location.host.indexOf('.')+1,window.location.host.length);}

      ss=encodeURIComponent(convert_unicode(document.main_store.store_k_word.value));
      if (document.main_store.store_k_word) act_arg += "?store_k_word="+ss.base64_encode();
      if (document.main_store.slt_k_option) act_arg += "&slt_k_option="+document.main_store.slt_k_option.value;
      if (document.main_store.slt_k_range) act_arg += "&slt_k_range="+document.main_store.slt_k_range.value;

      if(document.main_store.slt_k_option ) {
      	 // 1.商店街全部商品 3.店家全部商品 4.個人市場全部商品 2.店家名稱 5.個人ID
      	 if ( document.main_store.slt_k_option.value == 2 || document.main_store.slt_k_option.value == 5) {
      	   //act_url = new_urlhost+"/adm/"+opt+"_store.htm"+act_arg;
      	   act_url = act_url.replace("psearch.htm","psearch_store.htm")+act_arg;
         }
         else if ( document.main_store.slt_k_option.value == 11){
           act_url = act_url.replace("www","seller");
           act_url = act_url.replace("/adm/psearch.htm","/srch/search_seller.htm")+act_arg;
         } 
      	 else {
      	   //act_url = new_urlhost+"/adm/"+opt+".htm"+act_arg;
      	   //act_url = act_url+"/adm/"+opt+".htm"+act_arg;
      	   act_url = act_url.replace("/adm/*.htm","/adm/"+opt+".htm")+act_arg;
         }
      }
    }

    document.main_store.action = act_url;    
    store_submit(); 
  } 

  function sup_p_keydown(s_value, opt, act_url, s_try) {
    var act_arg="";

    if(!window.event && !s_try){
      document.key_fun = "keyDown('"+s_value+"','"+opt+"','"+act_url+"', 'retry')";
      if(document.onkeydown) window.click_src = document.onkeydown.name;
      document.onkeydown = set_keycode;
      return;
    }
    var keyCode = (window.event)?event.keyCode:window.m_env.which;
    if (keyCode != 13) return -1;
    if(opt == "search"){
      if(strlens(s_value) < 2) {
        alert("輸入關鍵字資料太少，請重新輸入");
        document.main_store.store_k_word.focus();
        return false;
      }

      ss=encodeURIComponent(convert_unicode(document.main_store.store_k_word.value));
      if (document.main_store.store_k_word) act_arg += "?store_k_word="+ss.base64_encode();
      if (document.main_store.slt_supk_option) act_arg += "&slt_supk_option="+document.main_store.slt_supk_option.value;
      if (document.main_store.inexh) act_arg += "&inexh="+document.main_store.inexh.value;

      var httpurl="";
      //if(!window.location.host.match("pcstore.com.tw")) httpurl="http://www.pcstore.com.tw";
      act_url=(document.main_store.slt_supk_option.value == 1)?act_url:"/adm/psearch.htm";
      document.main_store.action = httpurl+act_url+act_arg;
    }
    
    store_submit();
  }

  function keyDown(act_url){
    var keyCode = event.keyCode;
    if (keyCode != 13) return -1;
    document.main_store.action = act_url;
    store_submit();
  }

  function keyDown_event(fun){
    var keyCode = event.keyCode;
    if (keyCode != 13) return -1;
    eval(fun + '()');
  }

  function emailCheck(eMail){
    re = /^([\w\.%-]+)\@([\w%-]+\.[\w\.%-]+)$/i;
    found=eMail.match(re);
    if(!found){
      alert('請填入正確email');
      return;
    }
    return found[0];
  }

  function check_uid(uid){
    uid = uid.toUpperCase();
    if(!uid.match(/^[A-Z][0-9|A-D]\d{8}$/) && !uid.match(/^[0-9]{12}$/)) return alert("身份證格式不正確！");
    if(uid == "A123456789") return alert("請輸入正確身份證字號！");
    var eng2num = new Array(1,10,19,28,37,46,55,64,39,73,82,2,11,20,48,29,38,47,56,65,74,83,21,3,12,30);
    var uidsum = eng2num[uid.charCodeAt(0) - 65];    
    for(var i=1;i<10;i++) {
      if(uid.charAt(i)=="A" || uid.charAt(i)=="B" || uid.charAt(i)=="C" || uid.charAt(i)=="D"){
        if(uid.charAt(i)=="A") num=5; 
        if(uid.charAt(i)=="B") num=6;
        if(uid.charAt(i)=="C") num=7; 
        if(uid.charAt(i)=="D") num=8;
      }else{
        num = uid.charAt(i);
      }      
      uidsum += parseInt(num)*((9-i)?(9-i):1);      
    }
    if(uidsum%10) return alert("您的身份證字號有誤,請查看一下!!\n");
    return uid;
  }
  
  function up2tab(s_obj,len,next_obj){
    var tmp_obj;
    if((s_obj.value.length >= len) && next_obj && (tmp_obj = eval("document.main_store." + next_obj))) return tmp_obj.focus();
  }

  function change_len(obj, t_obj, maxlen){
    var tmp_obj = document.getElementById(t_obj);
    var lens = strlens(obj.value);
    if(maxlen && lens > maxlen) {      
      alert("已超過" + maxlen + "個字元!!");
      obj.value = cut_len(obj.value, maxlen);      
      
      document.body.focus();
      if ((re = window.location.host.match(/adm\.(.+)/i)))
        //var bstr="window.parent.document.frames.mainFrame.main_store."+obj.name;
        var bstr="window.frames['mainFrame'].main_store."+obj.name;
      else 
        var bstr="document.main_store."+obj.name;      
      ///eval(bstr).focus(); 先拿掉
    }
    if(tmp_obj) tmp_obj.innerHTML = strlens(obj.value);
  } 

  function cut_len(str, len){
    var tmplen =0,i=0;
    for(var i=0;i< str.length;i++){
      tmplen += (str.charCodeAt(i) > 255)?2:1;
      if(tmplen > len) {        
        return str.substr(0, i);
      }
    }
    return str;
  }

  function j_trim(str){
    str = str.replace(/^\s*/,"");
    str = str.replace(/\s*$/,"");
    return str;
  }
  function strlens(text){
    var len =0,i=0;
    for(var i=0;i< text.length;i++){
      len += (text.charCodeAt(i) > 255)?2:1;
    }
    return len;
  }
  
  function xmlhttp_close(){
    if(xmlhttp) {
      xmlhttp.abort();
      xmlhttp = null;
    }
  }
  
  function xml_post(url,post_value, fun){
      if (window.ActiveXObject) {
        try {
          xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
        } catch(e) {
          try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          } catch(e2) {
            xmlhttp = null;
          }
        }
      } else if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = null;
      }
      xmlhttp.open("POST",url,true);
      xmlhttp.setRequestHeader("Man", "POST "+url+" HTTP/1.1");
      xmlhttp.setRequestHeader("Content-Type", "text/html");
      //xmlhttp.setRequestHeader("Accept-Language", "zh-tw");         // 先註解,utf8也許用不到
      xmlhttp.send(post_value);
      if(window.xmlclose) clearTimeout(window.xmlclose);
      window.xmlclose = window.setTimeout('xmlhttp_close()', 30000);  // 暫設30秒
      xmlhttp.onreadystatechange=function() {
        if(xmlhttp.readyState==4) {
          XMLHTTP_val = xmlhttp.responseText;
      	  xmlhttp.abort();
      	  xmlhttp = null;
      	  eval(fun + "()");
        }
      }
  }
  
  function open_gift(gpno,pic) {
    var mx = window.event.clientX;
    var my = window.event.clientY + document.documentElement.scrollTop; //IE
    //var my = window.event.clientY + document.body.scrollTop;
    
    // 防止在IE6中商品介紹一撐版的時候，贈品位置跑掉
    var xpxpos = document.getElementById('inside_content').style.left.lastIndexOf('px');
    var ypxpos = document.getElementById('inside_content').style.top.lastIndexOf('px');
    mx = mx - document.getElementById('inside_content').style.left.substring(0,xpxpos);
    my = my - document.getElementById('inside_content').style.top.substring(0,ypxpos);
    
    if (window.location.href.match(/preview/)) return;
    xml_post('/adm/opt/get_ginfo.php', gpno+'&'+pic+'&'+mx+'&'+my, 'get_ginfo');
  }
  
  function get_ginfo() {
    var str = XMLHTTP_val;
    var str_arr = new Array();
    str_arr = str.split('<#*#>');
    var ginfo = str_arr[0];
    var pic = str_arr[1];
    var mx = str_arr[2];
    var my = str_arr[3];
    var gift_obj = document.getElementById("gift_win");
    gift_obj.style.left = mx;
    gift_obj.style.top = my;    
    gift_obj.innerHTML = '<div align="center" style="padding:1px;"><img src="'+pic+'" />';
    if (ginfo != '') gift_obj.innerHTML += '<div style="width:120px;" align="left" style="color:#000;padding:2px;">'+ginfo+'</div>';
    gift_obj.innerHTML += '<input type="button" value="關 閉" style="border:1px solid gray;" onclick="javascript:close_gift(\'gift_win\');" \></div>';
    gift_obj.style.visibility='visible';
    gift_obj.focus();
  }
  function close_gift(obj) {
    document.getElementById(obj).style.visibility='hidden';
  }

//##### for pch bar #####
  function swapimg(exh_no, type){
    var obj = document.getElementById("img_" + exh_no);
    if(type == 1){
      obj.src = img_url +'/pch_exh_img/'+ exh_no +'_o.gif?P='+ bar_time;
    }else if(type == 0){
      obj.src = img_url +'/pch_exh_img/'+ exh_no +'.gif?P='+ bar_time;
    }
  }

  function exh_search(s_exh_no){
    for(var i=0; i < c_exh_no.length; i++){
      if(s_exh_no == c_exh_no[i]){
        return "exh_no="+s_exh_no;
      }
    }
    //alert("無法尋找你要的關鍵字!!");
  }

  function make_tab_bar(){  	
    var all_tabs = ((window.teeth)?(teeth.length / 2):0) + window.main_exh_counts, second_tabs = 0;
    var show_all = 0, ssl_host = 0, itmp = 0;
    var tmp_img = "", s_link = "", st_host = "", re, img_host;
    var line1 = line2 = "";

    second_tabs = Math.ceil(all_tabs / 2) + ((all_tabs & 1)?0:1);
    //second_tabs ++;

    make_menu_bar();
    if(window.location.host.match(/mypchome/) && !img_url.match(/mypchome/)) img_url = img_url.replace("pchome", "mypchome");
    
    if((re = window.location.host.match(/storessl/i))) {
      st_host = "http://store.pchome.com.tw";
      ssl_host = 1;
    }else if((re = window.location.host.match(/ssl\.(.+)/i))) {
      st_host = "http://" + re[1];
      ssl_host = 1;
    }else if((re = window.location.host.match(/sell\.(.+)/i))||(re = window.location.host.match(/user\.(.+)/i))) {
      st_host = "http://" + re[1];
    }else{
      if((re = window.location.host.match(/(p?store\..+)/i))) img_url = "http://img." + re[1];
    }
    if(!pch_exh_no) pch_exh_no = "P000000";
    for(var i=0; i < c_exh_no.length; i++) if(c_exh_no[i] == pch_exh_no) {pch_big_exh = c_exh_parent[i]; break;}
    
    if(menu_bar[pch_exh_no] && menu_bar[pch_exh_no][pch_exh_no].name == "首頁") show_all = 1;
    var left_str = '<table width="970" border="0" cellpadding="0" cellspacing="0"><tr><td align="center"><table border="0" cellpadding="0" cellspacing="0"><tr valign="bottom">';
    for(var main_exh in menu_bar){
      var parent_name = main_exh;
      var tmpobj = eval( "menu_bar." + main_exh);
      var main_obj = eval( "menu_bar." + main_exh + "." + main_exh);
      if(main_obj.show && main_obj.show == "N") continue;
      
      //s_link = (main_exh=="P000000")?st_host + '/': st_host + '/stexh/'+ main_exh;
      if (main_exh=="P000000") {
        s_link =st_host + '/';
      }
      else {
      	if (main_exh == "P000992"){ continue;} // 99大館
      	if (main_exh == "P000070"){ continue;} // LCD大館
      	if (main_exh == "P000032"){ continue;} // NB大館
	if (main_exh == "P000017") s_link =st_host + '/stexh/P100002';
        else s_link =st_host + '/stexh/'+ main_exh;
      }

      if(show_all || pch_big_exh == main_exh) {
        if(ssl_host) {
          tmp_img = '<img src="'+ img_url +'/pch_exh_img/'+ main_exh +'.gif?P='+ bar_time +'&pimg=static" width="55" height="32" border="0" id="img_'+ main_exh +'">';
        }else{
          tmp_img = '<img src="'+ img_url +'/pch_exh_img/'+ main_exh +'.gif?P='+ bar_time +'&pimg=static" width="55" height="32" border="0" id="img_'+ main_exh +'">';
        } 
        if(itmp ++ < second_tabs){
          line2 += '<td><a href="'+ s_link +'">'+ tmp_img +'</a></td>'
        }else{
          line1 += '<td><a href="'+ s_link +'">'+ tmp_img +'</a></td>'
        }
      }else{
        if(ssl_host) {
          tmp_img = '<img src="'+ img_url +'/pch_exh_img/'+ main_exh +'_o.gif?P='+ bar_time +'&pimg=static" width="55" height="32" border="0" id="img_'+ main_exh +'">';
        }else{
          //tmp_img = '<img src="'+ img_url +'/web_img/spacer.gif" width="55" height="32" border="0" id="img_'+ main_exh +'" title="IMG_HOST/pch_exh_img/'+ main_exh +'_o.gif?P='+ bar_time +'">';
          tmp_img = '<img src="'+ img_url +'/pch_exh_img/'+ main_exh +'_o.gif?P='+ bar_time +'&pimg=static" width="55" height="32" border="0" id="img_'+ main_exh +'">';
        }
        if(itmp ++ < second_tabs){
          line2 += '<td><a href="'+ s_link +'" onMouseOut="swapimg(\''+ main_exh +'\', 1)" onMouseOver="swapimg(\''+main_exh +'\', 0)">'+ tmp_img +'</a></td>';
        }else{
          line1 += '<td><a href="'+ s_link +'" onMouseOut="swapimg(\''+ main_exh +'\', 1)" onMouseOver="swapimg(\''+main_exh +'\', 0)">'+ tmp_img +'</a></td>';
        }
      }
      
    }
    left_str += line1;

    if(window.teeth){
      for(itmp=0; itmp < teeth.length; itmp+=2 ){
        tmp_img = '<img src="'+ img_url + '/' + teeth[itmp] +'?P='+ tooth_time +'&pimg=static" border="0">';
        left_str +='<td><a href="'+ teeth[itmp + 1] +'">' + tmp_img +'</a></td>';
      }
    }
    
    //var wloc=""+window.location;    
    left_str += '</tr></table><img src="'+ img_url + '/web_img/space.gif" width="1" height="1"><br><table border="0" cellpadding="0" cellspacing="0"><tr valign="bottom">';
    left_str += line2;
    left_str += '</tr></table></td></tr><tr><td height="4" bgcolor="#FF8827">';
/*
    if(!ssl_host && !wloc.match(/search_plus/i)) {
      left_str += '<table height="34" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td width="36"><img src="'+ img_url + '/web_img/search_icon_o.gif" width="24" height="34"></td>';            
      left_str += '<input type="hidden" name="slt_k_range" value="all">';    
      left_str += '<td width="80"><select name="slt_k_option"><option value="1">商品名稱</option><option value="2">店家名稱</option></select></td>';
      left_str += '<td width="195"><input name="store_k_word" type="text" value="" size="30" maxlength="20" onkeydown="p_keydown(this.value,' + "'search'" + ",'/adm/search.htm'" + ')" title="NOT_CHECK"></td>';    
      left_str += '<td><img src="'+ img_url + '/web_img/search_btn.gif" onclick="s_k_search()" style="cursor:hand;"></td>';
      left_str += '<td width="70" align="right"><a href="/adm/search_plus.htm"><font class=t12>進階搜尋</font><strong style="font-size:11px;font-family:verdana">&raquo;</strong></a></td></tr></table>';
    }

    left_str += '</td></tr><tr>';
    left_str += '<td height="34" bgcolor="FF8827"><table width="100%" border="0" cellspacing="0" cellpadding="0">';
    left_str += '<tr><td width="2%">&nbsp;</td><td width="98%" style="color:ffffff"><a href="http://www.pchome.com.tw" style="color:ffffff">PChome</a> &gt; <a href="'+ st_host +'/" style="color:ffffff">商店街</a>';
    if(pch_big_exh && (show_all == 0 || window.title_bar_name)) left_str += ' &gt; ' + ((title_bar_name)?title_bar_name:menu_bar[pch_big_exh][pch_big_exh].name);
    left_str += '</td></tr></table></td></tr></table>';
*/
    //
    var add_left_str_flag=0;

    if((re = window.location.host.match(/user\.(.+)/i))) {
      //for 個人市場(前端)
      //(原)
      //left_str += '</td></tr></table>';
      //left_str += '</td></tr><tr>';
      //left_str += '<td height="34" ></td></tr></table>';
      //
      //left_str += '<table class="pathbg" align="center" border="0" cellpadding="0" cellspacing="0" height="35" width="970">';
      //left_str += '  <tr>';
      //left_str += '    <td style="color: rgb(255, 83, 12);" width="98%">　<a style="color: rgb(255, 83, 12);" href="http://www.pchome.com.tw/">PChome</a> &gt; <a style="color: rgb(255, 83, 12);" href="http://store.pchome.com.tw/">商店街</a> &gt; <a style="color: rgb(255, 83, 12);" href="http://store.pchome.com.tw/">美妝</a> &gt;pmendostongue</td>';
      //left_str += '  </tr>';
      //left_str += '</table>';

      left_str += '<table height="34" border="0" cellpadding="0" cellspacing="0"><tr><td width="36"></td>';            
      left_str += '<tr><td width="2%">&nbsp;</td><td width="98%" style="color:#ffffff"><a href="http://www.pchome.com.tw" style="color:ffffff">PChome</a> &gt; <a href="'+ st_host +'/" style="color:ffffff">商店街</a>';
      //if(pch_big_exh && (show_all == 0 || window.title_bar_name)) left_str += ' &gt; <a href="/adm/psell/readme.htm" style="color:#FFFFFF">個人市場</a> &gt; ' + ((title_bar_name)?title_bar_name:menu_bar[pch_big_exh][pch_big_exh].name);
      //if(pch_big_exh && (show_all == 0 || window.title_bar_name)) left_str += ' &gt; <a href="/" style="color:#FFFFFF">個人市場</a>' + ((title_bar_name==' ')?'':' &gt; ' + title_bar_name);      
      if(pch_big_exh && (show_all == 0 || window.title_bar_name) && title_bar_name=='')title_bar_name = menu_bar[pch_big_exh][pch_big_exh].name;
      if(window.location.href.match(/HM\/eval\.htm/)) left_str += ' &gt; ' + title_bar_name;
      
      //else if(pch_big_exh && (show_all == 0 || window.title_bar_name)) left_str += ' &gt; <a href="/" style="color:#FFFFFF">個人市場</a>' + ((title_bar_name==' ')?'':' &gt; ' + title_bar_name); // by auc
      
      left_str += '</td></tr></table></td></tr></table>';
      left_str += '</td></tr><tr>';
      left_str += '<td height="34" ></td></tr></table>';
      add_left_str_flag=1;

    }

    //if((re = window.location.host.match(/sell\.(.+)/i))) {
    //  //for 個人市場(後端)
    //  left_str += '<table height="34" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td width="36"></td>';            
    //  left_str += '<tr><td width="2%">&nbsp;</td><td width="98%" style="color:ffffff"><a href="http://www.pchome.com.tw" style="color:ffffff">PChome</a> &gt; <a href="'+ st_host +'/" style="color:ffffff">商店街</a>';
    //  left_str += ' &gt; <a href="/" style="color:#FFFFFF">我要賣東西</a>';
    //  left_str += '</td></tr></table></td></tr></table>';
    //  left_str += '</td></tr><tr>';
    //  left_str += '<td height="34" ></td></tr></table>';
    //  //left_str += '<table width="970" height=35 border=0 align=center cellpadding=0 cellspacing=0 class="pathbg"><tr><td style="color: #ff530c" width="98%"></td></tr></table>';
    //      
    //  add_left_str_flag=1;
    //}


    if(!add_left_str_flag){
      //for 商店街
      left_str += '<table height="34" border="0" cellpadding="0" cellspacing="0"><tr><td width="36"></td>';            
      left_str += '<tr><td width="2%">&nbsp;</td><td width="98%" style="color:#ffffff"><a href="http://www.pchome.com.tw" style="color:ffffff">PChome</a> &gt; <a href="'+ st_host +'/" style="color:ffffff">商店街</a>';
      if(pch_big_exh && (show_all == 0 || window.title_bar_name)) left_str += ' &gt; ' + ((title_bar_name)?title_bar_name:menu_bar[pch_big_exh][pch_big_exh].name);
      left_str += '</td></tr></table></td></tr></table>';
      left_str += '</td></tr><tr>';
      left_str += '<td height="34" ></td></tr></table>';
    }
    //

    var obj = document.getElementById("tab_bar");
    if(obj) obj.innerHTML = left_str;
  }

  function get_page_bar(now_page, page_sum, record_sum, fun_name){
    var r_value="";
    var pg_start = Math.floor(((now_page - 1) / 10)) * 10 + 1;
    r_value = '<table border="0" cellspacing="0" cellpadding="0" align="center">';
    r_value += '<tr><td valign="bottom">';
    now_page = parseInt(now_page);
    if(now_page!=1 && pg_start > 0){
      r_value += '<a href="javascript:'+ fun_name + '(\'' + ( now_page-1 ) + '\')" style="font-size:9pt"><b style="font-family:verdana">&#139;</b>上一頁</a>';
    }
    r_value +='</td><td width="20">&nbsp;</td><td style="font-size:12pt;font-family:Arial;color:000000" valign="top">';
    if(pg_start <0) pg_start = 1;
    var pg_end = (pg_start + 10 > page_sum)?page_sum:(pg_start + 10 - 1);

    for(var i=pg_start ; i<= pg_end; i++){
      if(i == now_page){
        r_value += '<span style="font-size:13pt;font-weight:bold">'+i+'</span>&nbsp;'+((i==pg_end)?"":".")+'&nbsp;'; 
      }else{
        r_value += '<a href="javascript:'+ fun_name + '(\''+i+'\')">'+ i +'</a>&nbsp;'+((i==pg_end)?"":".")+'&nbsp;';
      }
    }
    r_value +='</td><td width="20">&nbsp;</td><td valign="bottom">';
    if(now_page != page_sum && record_sum) r_value += '<a href="javascript:'+fun_name  +'(\'' + (parseInt(now_page) + 1)+ '\')" style="font-size:9pt">下一頁<b style="font-family:verdana">&#155;</b></a>';
    r_value +='</td></tr></table>';
    r_value +='<table border="0" cellspacing="0" cellpadding="3" align="center"><tr> <td valign="bottom">';
    if(pg_start > 10) r_value +='<a href="javascript:'+ fun_name + '(\''+(pg_start - 10)+'\')" style="font-size:9pt"><b style="font-family:verdana">&laquo;</b>上10頁</a>';
    r_value +='</td><TD width=20>&nbsp;</TD>';
    r_value +='<TD vAlign=bottom style="font-size:9pt">第 ' + now_page +' / ' + page_sum +' 頁，共 '+record_sum+' 筆 </TD>';
    r_value +='<TD width=20>&nbsp;</TD><td valign="bottom">';
    if( pg_end < page_sum) r_value +='<a href="javascript:'+fun_name  +'(\'' + (pg_start + 10)+ '\')" style="font-size:9pt">下10頁<b style="font-family:verdana">&raquo;</b></a>';
    r_value +='</td></tr></table>';    
    return r_value;
  }
  
  function re_bind_img(){
    var host_len;
    window.re_bind = 1;
    if(window.img_host) host_len = img_host.length;
    for(var i=0, j=0; i < document.images.length; i ++){
      if(document.images[i].title && document.images[i].title.match(/\./)){
      	if(window.img_host) {
      	  document.images[i].src = document.images[i].title.replace("IMG_HOST", img_host[j++ % host_len]);
      	}else{
      	  document.images[i].src = document.images[i].title.replace("IMG_HOST", img_url);
      	}
      }
    }
  }

  function bind_sub_title(sub_exh_no){
    for(var i=0; i < c_exh_no.length; i ++){
      if(c_exh_no[i] == sub_exh_no){
      	main_exh = c_exh_parent[i];
      	sup_sub_exh = sub_exh_no;
        var obj = document.getElementById("sub_title");
        if(obj) obj.innerHTML = "&nbsp; &gt; <a href='"+sub_exh_no+".htm'>" + c_exh_name[i] + "</a>";
        return;
      }
    }
  }

  function store_set_cookie(name, value) {
    var argv = store_set_cookie.arguments;
    var argc = store_set_cookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : null;
    document.cookie = escape(name) + "=" + escape(value) +
    //document.cookie = name + "=" + value +
    ((expires == null || expires == "") ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == null) ? "" : ("; secure=" + secure));
    
  }

  function set_prod_info(e){
    var src_obj = (e)?e.target:event.srcElement;
    
    if(src_obj.tagName == "IMG"){
      src_obj = (e)?src_obj.parentNode:src_obj.parentElement;
    }
    
    if(src_obj.tagName == "A"){
      var re = src_obj.href.match(/M[0-9]{8}/);
      if(re) store_set_cookie("prod_ck", main_exh + "--" + sup_sub_exh + "--" + re[0], null, "/", window.location.host);
    }
  }
  
  function order_paper(sup_url,surl){
    //var reh=surl.urldecode().base64_decode();
    var reh=surl.base64_decode();
    /* 
    if (!window.location.host.match(/^p?store.(my)?pchome.com.tw$/i))
      reh=(typeof(img_url) == "undefined")?'http://store.pchome.com.tw':img_url.replace("img.","");  	
   */  
    document.main_store.edm_sup_url.value=sup_url;
    document.main_store.action=reh+"/adm/myacc_edm.htm";
    document.main_store.submit();
  }

  function order_sup_epaper(sup_url,surl){
    //var reh=surl.urldecode().base64_decode();
    var reh=surl.base64_decode();
    /*
    if (!window.location.host.match(/^p?store.(my)?pchome.com.tw$/i))
      reh=(typeof(img_url) == "undefined")?'http://store.pchome.com.tw':img_url.replace("img.","");  	
    */  
    document.main_store.edm_sup_url.value=sup_url;
    document.main_store.action=reh+"/adm/myacc_sup_epaper_ok.htm";
    document.main_store.submit();
  }

  function check_radio(radio_obj){
    if((!radio_obj.length) && radio_obj.checked)return radio_obj.value;
    for(var $i=0;$i<radio_obj.length;$i++){
      if(radio_obj[$i].checked)	return radio_obj[$i].value;
    }
    return -1;
  }

  function cal_impression_tp(impression_url) {
return;
    var uri = window.location.pathname, re, store_url = "", prod_no="", pch_bigexh_no="", pch_nexh_no="", pch_hexh_no="";
    var locts=""+window.location, img_url="", nowdate, s_time, run_show_count, dfg=0;
var obj,obj_html='';
    if (!window.location.host.match(/^www\.(pc|p|mypc)store\.com\.tw$/i)) return;

    if( re = uri.match(/^\/([-\w]+)\/HM\//) ) {
      if ( uri.match(/\/search\.htm/i) ) {
        //img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
        img_url = impression_url + "?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
        //document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUP_SEARCH "+img_url); 
obj_html+="<img src='" + img_url + "' width=0 height=0 dy=1>";
      }
    }
    else if ( re = uri.match(/\/adm\/psearch\.htm/i) ) {
      //img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
      img_url = impression_url + "?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
      //document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("PCH_SEARCH "+img_url); 
obj_html+="<img src='" + img_url + "' width=0 height=0 dy=1>";
    }

obj=document.createElement("DIV");
obj.setAttribute("id","cal_impression_tp");
obj.style.position = 'absolute'; obj.style.visibility = 'hidden'; obj.style.width = '0px'; obj.style.height = '0px';
obj.innerHTML = obj_html;
  }

  function cal_impression(impression_url){
    var uri = window.location.pathname, re, store_url = "", prod_no="", pch_bigexh_no="", pch_nexh_no="", pch_hexh_no="";
    var locts=""+window.location, img_url="", nowdate, s_time, run_show_count=0, dfg=0;

    if (!window.location.host.match(/^www\.(pc|p|mypc)store\.com\.tw$/i)) { return; }
/*
    if (document.location.protocol == "http:") {
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_store_impression&store_type=ALL&big_exh=ALL&ana_ct=impressions&ana_dt=pv_date";
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("ALL "+img_url);   
    }
*/
    //if( re = uri.match(/^\/([-\w]+)\/$/) ){        
    if( re = uri.match(/^\/([-\w]+)\/?$/) ){        
      store_url = re[1];      

      //img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_sup_impression&sup_real_url=" + store_url + "&ana_ct=homepage&ana_dt=pv_date";
      //img_url = impression_url + "?pimg=dynamic&ana_tb=cal_sup_impression&sup_real_url=" + store_url + "&ana_ct=homepage&ana_dt=pv_date";
      //document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUP1 "+img_url); 
    }
    else if( re = uri.match(/^\/([-\w]+)\/HM\//) ){  //uri.match(/^\/([-\w]+)\/HM\//)
      store_url = re[1];
      
      if ( uri.match(/\/search\.htm/i) ) {
return;
      	/*
        img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
        document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUP_SEARCH "+img_url); 
        */
      }
    }
    else if( re = uri.match(/^\/([-\w]+)\/S\d{6}.htm/) ){
return;
      store_url = re[1];
    }
    else if( re = uri.match(/^\/([-\w]+)\/(M\d{8}).htm/) ){
      store_url = re[1];
      prod_no = re[2];    
    }
    else if( re = uri.match(/^\/([-\w]+)\/(F\d{8}).htm/) ){
      store_url = re[1];      
    }
    else if( re = uri.match(/^\/stexh\/(P\d{6})/) ){      
return;
    	/*
      pch_bigexh_no = re[1];
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_store_impression&store_type=" + pch_bigexh_no + "&big_exh=" + pch_bigexh_no + "&ana_ct=impressions&ana_dt=pv_date";      
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("BEXH "+img_url);   
      */
      run_show_count=1; 
    }
    else if( re = uri.match(/^\/stexh\/(N\d{6})/) ){  
return;
    	/*
      pch_nexh_no = re[1];      
      var nof=locts.indexOf("pa=",0);
      pch_bigexh_no="P"+locts.substr(nof+3,6);
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_store_impression&store_type=" + pch_nexh_no + "&big_exh=" + pch_bigexh_no + "&ana_ct=impressions&ana_dt=pv_date";      
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("NEXH "+img_url);   
      */
      run_show_count=1; 
    }
    else if( re = uri.match(/^\/stexh\/(H\d{6})/) ){
return;
    	/*
      pch_hexh_no = re[1];      
      var nof=locts.indexOf("pa=",0);
      pch_bigexh_no="P"+locts.substr(nof+3,6);
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_store_impression&store_type=" + pch_hexh_no + "&big_exh=" + pch_bigexh_no + "&ana_ct=impressions&ana_dt=pv_date";      
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("HEXH "+img_url);   
      */
      run_show_count=1;      
    }
    else if( uri == "/" || uri == "/index.htm" ){
return;    
    	/*
      pch_bigexh_no = "P000000";
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_store_impression&store_type=" + pch_bigexh_no + "&big_exh=" + pch_bigexh_no + "&ana_ct=impressions&ana_dt=pv_date";
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("INDEX "+img_url);
      */
      if (window.location.host.match(/^www\.pcstore\.|^www\.pstore\./i)) run_show_count=1; 
    }
    else if ( re = uri.match(/\/adm\/psearch\.htm/i) ) {
return;
    	/*
      img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=search_date_analysis&ana_ct=pv_num&ana_dt=date_ana";
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("PCH_SEARCH "+img_url); 
      */
    }

    if (run_show_count == 1) {
return;
      var payad_js_bk_array = make_ad_impression_js_code();
      if (payad_js_bk_array.length > 0) {
        for(var bk=0; bk<payad_js_bk_array.length; bk++) {          
          img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_payad_click&bk_no=" + payad_js_bk_array[bk] + "&ana_ct=show_count&ana_dt=click_date";      
          //img_url = impression_url + "?pimg=dynamic&ana_tb=cal_payad_click&bk_no=" + payad_js_bk_array[bk] + "&ana_ct=show_count&ana_dt=click_date";      
          document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("payad "+img_url);   
        }      
      }   
    }

    if(store_url == "") { return; }
    nowdate = new Date();
    s_time = nowdate.getTime();
    var month_m='0'+(nowdate.getMonth()+1);    
    if (month_m.length > 2) month_m=month_m.substr(1,2);    
    var day_m='0'+(nowdate.getDate());    
    if (day_m.length > 2) day_m=day_m.substr(1,2);    
    s_date = nowdate.getFullYear()+""+month_m+""+day_m;

/*    
    img_url = impression_url + "?pimg=dynamic&ana_tb=cal_sup_impression&sup_real_url=" + store_url + "&ana_ct=impressions&ana_dt=pv_date" +
              "#r#npimg=static&p="+s_date+"&ana_tb=cal_sup_view_times_day&sup_real_url=" + store_url + "&ana_ct=v_times&ana_dt=v_date";
    if (prod_no != "") {
      img_url += "#r#npimg=dynamic&ana_tb=cal_prod_impression&sup_real_url=" + store_url + "&prod_no=" + prod_no + "&ana_ct=impressions&ana_dt=pv_date";
    }
    document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUPSUM "+img_url); 
*/

    //img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_sup_impression&sup_real_url=" + store_url + "&ana_ct=impressions&ana_dt=pv_date";
    img_url = impression_url + "?pimg=dynamic&ana_tb=cal_sup_impression&sup_real_url=" + store_url + "&ana_ct=impressions&ana_dt=pv_date";
    document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUP2 "+img_url); 
 
    //img_url = impression_url + "/web_img/spacer.gif?pimg=static&p="+s_date+"&ana_tb=cal_sup_view_times&sup_real_url=" + store_url + "&ana_ct=v_times&ana_dt=v_date";
    img_url = impression_url + "?pimg=static&p="+s_date+"&ana_tb=cal_sup_view_times&sup_real_url=" + store_url + "&ana_ct=v_times&ana_dt=v_date";
    document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUPVIEW "+img_url); 

    //img_url = impression_url + "/web_img/spacer.gif?pimg=static&p="+s_date+"&ana_tb=cal_sup_view_times_day&sup_real_url=" + store_url + "&ana_ct=v_times&ana_dt=v_date";
    img_url = impression_url + "?pimg=static&p="+s_date+"&ana_tb=cal_sup_view_times_day&sup_real_url=" + store_url + "&ana_ct=v_times&ana_dt=v_date";
    document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("SUPVIEW_DAY "+img_url); 
    
    if(prod_no != ""){
      s_time ++;
      //img_url = impression_url + "/web_img/spacer.gif?pimg=dynamic&ana_tb=cal_prod_impression&sup_real_url=" + store_url + "&prod_no=" + prod_no + "&ana_ct=impressions&ana_dt=pv_date";
      img_url = impression_url + "?pimg=dynamic&ana_tb=cal_prod_impression&sup_real_url=" + store_url + "&prod_no=" + prod_no + "&ana_ct=impressions&ana_dt=pv_date";
      document.write("<img src='" + img_url + "' width=0 height=0>");  if (dfg) alert("PROD "+img_url); 
    } 

  }

  function open_instmtbank(opt,s,wurl,supmode) {
    if (typeof(supmode) == "undefined") supmode="INV";

    if (opt == "R03" || opt == "R06" || opt == "R12" || opt == "R15" || opt == "R24") {
      if (s == "ssl") ibwin = window.open(wurl+'/adm/instmt_banks.htm?ktype='+opt+'&s='+s+'&supmode='+supmode,'instmtbanks','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=270,height=310');
      else jswinopen('instmtbanks','/adm/instmt_banks.htm?ktype='+opt+'&supmode='+supmode,'線上分期銀行','100','','270','366');
    }
    else {
      if (s == "ssl") ibwin = window.open(wurl+'/adm/instmt_banks.htm?ktype=&s='+s+'&supmode='+supmode,'instmtbanks','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=270,height=310');
      else jswinopen('instmtbanks','/adm/instmt_banks.htm?ktype='+'&supmode='+supmode,'線上分期銀行','100','','270','514');
    }
  }
  
  function open_redpbank(opt,wurl,supmode) {
    if (typeof(supmode) == "undefined") supmode="INV";

    if (opt == "ssl") {
      window.open(wurl+'/adm/redp_banks.htm?opt='+opt+'&supmode='+supmode,'redpbanks_win','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=250,height=270');
    }
    else {
      jswinopen('redpbanks_win',wurl+'/adm/redp_banks.htm'+'?supmode='+supmode,'信用卡紅利折抵銀行','100','','256','302');
    }
  }
  
  function my_list_proc(opt, surl) {
    //var reh=surl.urldecode().base64_decode();
    var reh=surl.base64_decode();

    /* 暫時註解
    hosts=window.location.host;    
    if (!hosts.match(/^p?store.(my)?pchome.com.tw$/i))
      reh=(typeof(img_url) == "undefined")?'http://store.pchome.com.tw':img_url.replace("img.","");
    */

    if (opt == "myalert") {
      document.main_store.action=reh+"/adm/alert_sub.htm";      
    }
    else if (opt == "mytag") {      
      document.main_store.action=reh+"/adm/taginsert.htm";
    }
    document.main_store.submit();      
  }

  function buy_process(opt, surl) {
    var tobj=document.getElementById("p_spec");
    var reh="";   
    //surl=surl.urldecode().base64_decode();
    surl=surl.base64_decode();

    // for 轉址店家
    /*
    hosts=window.location.host;
    if (!hosts.match(/p?store.(my)?pchome.com.tw$/i))
      reh=(typeof(img_url) == "undefined")?'http://store.pchome.com.tw':img_url.replace("img.","");
    */

    if (tobj != null) {
      if (tobj.value == "") {
        alert("請選擇規格");
        tobj.focus();
        return;
      }
    }

    reh=surl;
    if (opt == "PD") { document.main_store.action=reh+"/adm/buy.htm"; }
    else if (opt == "PDNV") { document.main_store.action=reh+"/adm/buy_nv.htm"; }
    //else { document.main_store.action=reh+"/adm/buy_cart.htm?r="+opt; }
    else {join_cart(opt, reh);return;}
    /*
    else if (opt == "CT") {
      document.main_store.action=reh+"/adm/buy_cart.htm";
    }
    */
    document.main_store.submit();
  }

  function buy_process_person(opt) {
    var tobj=document.getElementById("p_spec");
    if (tobj != null) {
      if (tobj.value == "") {
        alert("請選擇規格");
        tobj.focus();
        return;
      }
    }
    
    if (opt == "PD") {
      document.main_store.action="/fun/buy.htm";   
    }
    else if (opt == "CT") {
      document.main_store.action="/fun/buy_cart.htm";
    }
    
    document.main_store.submit();
  }

  function make_exh_radio_slt_bar(user_pch_exh_value){
    var radio_slt_top = "", radio_slt = "", radio_slt_end = "",radio_checked_str='';
    var td_maxnum=6;
    
    var radio_slt_top = '<table class="mcont" border="0" cellpadding="0" cellspacing="0" width="409"><tr>';

    for(var main_exh in menu_bar){
      var main_obj = eval( "menu_bar." + main_exh + "." + main_exh);
      //main_obj.name:大館名稱
      if(main_obj.show && main_obj.show == "N" || main_obj.name=="首頁") continue;
      radio_checked_str = (user_pch_exh_value == main_exh)?' checked':'';

      if(td_maxnum==0){
        radio_slt += '</tr><tr>';
        td_maxnum=6;
      }
      radio_slt += '<td class="mtitle_sec"><input name="user_pch_exh" value="'+ main_exh +'" type="radio"'+ radio_checked_str +'>'+ main_obj.name +'</td>';
      td_maxnum--;
    }

    radio_slt_end ='</tr></table>';
    var obj = document.getElementById("user_pch_exh");
    if(obj) obj.innerHTML = radio_slt_top + radio_slt + radio_slt_end;
  }

function set_chkbx_all(ck_flag,obj_name){
  var del_obj = document.getElementsByName(obj_name);
  for(var i=0;i<del_obj.length;i++){
    if(ck_flag){
      del_obj[i].checked = true;
    }else{
      del_obj[i].checked = false;
    }
  }  
}

//////

  function check_acc(){
    document.main_store.userid.value = document.main_store.userid.value.replace(/[ ]/g,"");

    if(!document.main_store.userpass.value.match(/^[\w]+$/)) {
      alert("密碼輸入格式錯誤!");
      return document.main_store.userpass.focus();
    }
    if(document.main_store.userid.value != "" && !(document.main_store.userid.value.match(/@/)))
      document.main_store.userid.value = document.main_store.userid.value+"@pchome.com.tw";
    if(!emailCheck(document.main_store.userid.value)) 
      return document.main_store.userid.focus();

    document.main_store.userid.value=document.main_store.userid.value.toLowerCase();
    document.main_store.ltg_p.value="T";
    document.main_store.action="adm/chk_login.php";   
    document.main_store.submit();
  }

  function index_login(hosttp){
    document.main_store.ltg_p.value="T";
    document.main_store.after_login.value="/adm/myacc_ordlist.htm";
    document.main_store.action=hosttp+"/adm/login.htm";   
    document.main_store.submit();
  }

  function change_ordlist(){
     var post_var="";
     //xml_post_test("/adm/opt/user_ordlist.htm",post_var,'bind_ordlist');
     xml_post("/adm/opt/user_ordlist.htm",post_var,'bind_ordlist');
   }
   
  function show_calender_sheet(name, fun){
    var scrollY;
    try {
      window.cal = new Calender.create({id: name, url : '/css/calender/calender_sheet.htm', onSelect : fun, x : window.event.clientX, y: window.event.clientY + (document.body.scrollTop || document.documentElement.scrollTop), display: true});
    } catch(err) {
      if( (cal = Calender.getElementById(name)) ) {
        cal.onSelect(fun);
        scrollY = document.body.scrollTop || document.documentElement.scrollTop;
        cal.moveto(window.event.clientX, window.event.clientY + scrollY);
        if(cal) cal.display();
      }
    }    
  }
  
  function jswinopen(id, action, jwinname, in_x, in_y, in_width, in_height, jswin_arg, ssl_arg) {
    var jswin_width,jswin_height,jswin_x,jswin_y,myscrollLeft,myscrollTop;
    var img_min_str,img_max_str,img_close_str,dragable_fg,resizeable_fg,reht="",v_backgroundColor="#FF7F00";   

    if (ssl_arg && typeof(ssl_arg) != 'undefined') { 
      ssl_arg=ssl_arg.toLowerCase(); 
      if (ssl_arg == "ssl") { reht="https://paystore.pcstore.com.tw"; }
    }   
    if (reht == "") { reht="http://img.pcstore.com.tw"; }

    // var jswin_arg = { img_min:0, img_max:0, img_close:1, dragable:0, resizeable:0 };
    img_left_str=reht+"/web_img/st/up-l.gif";
    img_min_str=reht+"/web_img/st/bn_small.gif";
    img_max_str=reht+"/web_img/st/bn_big.gif";
    img_close_str=reht+"/web_img/st/bn_close.gif";
    img_right_str=reht+"/web_img/st/up-r.gif";
    dragable_fg=true;
    resizeable_fg=true;

    if (jswin_arg && typeof(jswin_arg) != 'undefined') {
      if (jswin_arg.img_min == 0) img_min_str="";
      if (jswin_arg.img_max == 0) img_max_str="";
      if (jswin_arg.img_close == 0) img_close_str="";
      if (jswin_arg.dragable == 0) dragable_fg=false;
      if (jswin_arg.resizeable == 0) resizeable_fg=false;
      if (jswin_arg.backgroundColor != "") v_backgroundColor=jswin_arg.backgroundColor;
      if (typeof(jswin_arg.left_img) != 'undefined' && jswin_arg.left_img == 0) img_left_str="";
      if (typeof(jswin_arg.right_img) != 'undefined' && jswin_arg.right_img == 0) img_right_str="";
    }

    //var canvas = document[ 'CSS1Compat' == document.compatMode ? 'documentElement' : 'body'];
    //if (browser.safari) { myscrollLeft = document.body.scrollLeft; myscrollTop = document.body.scrollTop; }
    //else { myscrollLeft = canvas.scrollLeft; myscrollTop = canvas.scrollTop; }
    myscrollTop=document.body.scrollTop || document.documentElement.scrollTop;
    myscrollLeft=document.body.scrollLeft || document.documentElement.scrollLeft;

    jswin_x=(!in_x) ? (25 + myscrollLeft) : in_x;    
    jswin_y=(!in_y) ? (40 + myscrollTop) : in_y;
    jswin_width=(!in_width) ? (document.body.clientWidth - 60) : in_width;
    jswin_height=(!in_height) ? (document.body.clientHeight - 28 - Math.floor((window.screen.height - 210) / 15)) : in_height;

    try {
      var head_imgs = new Array(img_left_str,img_min_str,img_max_str,img_close_str,img_right_str);
      var winAction = {src: action, onComplete : function(response){}}
      //, backgroundColor: "#FF7F00"
      var jwin = new JsWindow({id: id, width : jswin_width, Height : jswin_height, title : jwinname, action : winAction, head_imgs: head_imgs , backgroundColor: v_backgroundColor});
      jwin.dragable=dragable_fg;
      jwin.resizeable=resizeable_fg;
      jwin.SizeRange.min_width=200;      
      jwin.moveTo(jswin_x, jswin_y);
    } catch(err) {
      var jwin = JSWin.getWinById(id);
      var winAction = {src: action, onComplete : function(response){}}
      jwin.action(winAction);      
      jwin.moveTo(jswin_x, jswin_y);
      jwin.resize(jswin_width, jswin_height);
      jwin.display();
    }
  }

  
//===  
  var ad_store_check_loc=false,ad_store_mouseover_fg=false;
  var first_run=false,ad_store_globobj="";  
  function ad_store_onmouseover(self,id,pno,bno,bseq) {
    var obj;
    if (typeof(bno) == 'undefined') var bno="";
    if (typeof(bseq) == 'undefined') var bseq="";

    //gobj=document.getElementById("search");  gobj.innerHTML += pno+" ";

    //if (!$(id)) {  
    if (!first_run) {
    	first_run=true;
      if (!html_end_js_var) return;
      var obj=document.body.appendChild(document.createElement("DIV"));
      obj.setAttribute('id', id);
      obj.style.backgroundColor = "#FFFFFF";
      obj.style.position="absolute";      
      obj.style.zIndex = 99;
      obj.style.float="left";      
      obj.onmouseover=function(){
        ad_store_check_loc=true; 
        ad_store_mouseover_fg=true;
      }
      obj.onmouseout=function(){
      	var canvas = document[ 'CSS1Compat' == document.compatMode ? 'documentElement' : 'body']
        var offx = (document.all)?(canvas.scrollLeft+event.clientX):(document.getElementById)?event.pageX:"";
        var offy = (document.all)?(canvas.scrollTop+event.clientY):(document.getElementById)?event.pageY:"";
        var minX = parseInt(obj.style.left) + 2;
        var maxX = minX + parseInt(obj.offsetWidth);
        var minY = parseInt(obj.style.top) + 2;
        var maxY = minY + parseInt(obj.offsetHeight);
       
        if(offx <= minX || offx > maxX || offy < minY || offy > maxY) {          	
          obj.style.visibility = "hidden";
          
          ad_store_check_loc=false;
          ad_store_mouseover_fg=false;
        }
      }
      ad_store_globobj=obj;
    } 
    else {
      obj = ad_store_globobj;
      //obj = $(id);
    }    
    ad_store_check_loc=true;

    var m1fg=false;
    if (typeof(m1_index_ad_small_img_flag) == 'undefined') { m1fg=false; }  
    else { m1fg=true; }    

    if (obj.style.visibility == "hidden" || first_run) 
      ad_store_data_detail(self,obj,pno,bno,bseq,m1fg);
    else 
      Args_setTimeout(ad_store_data_detail,200,self,obj,pno,bno,bseq,m1fg);
  }

  function ad_store_data_detail(self,obj,pno,bno,bseq,m1fg) {
    var jswleft,jswtop,gstr,difv=0,rtype=""; 

    if (ad_store_mouseover_fg) return;
    obj.innerHTML='';
    if (pno.match(/^P\d{6}$/i)) {
      obj.innerHTML=idx_stexh_det_arr[pno];
      rtype="stexh";      
    }
    else {    
    	var request = new HTTPXML();
    	request.setOpt({'onComplete' : ad_store_completeCallback, 'custom': obj, 'timeout' : 30000});
      gstr="prod_no="+pno+"&bk_no="+bno+"&seq="+bseq;      
      request.setStringData(gstr);
      request.get("/adm/opt/ad_prod_detail.php");      
    }

    //obj.style.overflow="hidden";
    obj.style.visibility = "";        
    var self_os=getOffset(self);
    var canvas = document[ 'CSS1Compat' == document.compatMode ? 'documentElement' : 'body']
    var vr1=parseInt(self_os.top - canvas.scrollTop);
    var vr2=parseInt(screen.height * 0.39);

    if (m1fg) {
      jswleft=self_os.left + 25;
      jswtop=self_os.top + 22;
    } 
    else {
      jswleft=self_os.left - 185;
      if (vr1 > vr2) jswtop=245;
      else jswtop=self_os.top + 5;
    }

    if (rtype == "stexh") {
      var screenBottom = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      var send_px=scrollTop+screenBottom;
      var divhds=getOffset(obj).top+getOffset(obj).height;

      jswleft=self_os.left+173;
      if (divhds > (send_px-28) && getOffset(obj).top <= (send_px+20) ) { jswtop=self_os.top-getOffset(obj).height+36; }
      else { jswtop=self_os.top-10; }
    }

    obj.style.left=jswleft+"px";
    obj.style.top=jswtop+"px";
  }
  
  function ad_store_onmouseout(self,id) {  	
    ad_store_check_loc=false;
    //Args_setTimeout(ad_store_close_jswin, 500, self, $(id));
    Args_setTimeout(ad_store_close_jswin, 500, self, ad_store_globobj);
  }

  function ad_store_close_jswin(self,obj) {   	
  	if (obj && !ad_store_check_loc) {  	
      obj.style.visibility = "hidden";
    }   
  }
  
  function ad_store_completeCallback(response) {
    if(response.timeout) return;
    var custom = response.custom;
    var content = response.content;
    custom.innerHTML=content;        
  }

  function stpgflag() {
return;
    var hlevel = 3;
    var r_time = 30 * 60;
    //var r_time = 5;

    if(!location.pathname.match(/(\/.+\/).+/)) return;
    
    try {
      var jscookie = new CookieHaldle(
                                      location.pathname.replace(/(\/.+\/).+/, "$1"),
                                      window.location.host.replace(/(.+\.)(.*pchome.com.tw)/, "$2")
                                      );
      var jsckRoot = new CookieHaldle("/",
                                      window.location.host.replace(/(.+\.)(.*pchome.com.tw)/, "$2")
                                      );
    }catch(e){ return;}
    
    jscookie.setCookie("hpages", parseInt(jscookie.getCookie("hpages")).NaN0() + 1, 1);
    if(jscookie.getCookie("hpages") > hlevel) jscookie.setCookie("hpages_black", location.pathname.replace(/\/(.+)\/.+/, "$1"), r_time);
    
    if(!jsckRoot.getCookie("allstart")) jsckRoot.setCookie("allstart", (new Date().getTime()), 60 * 3);
    
    if( re = window.location.pathname.match(/^\/([-\w]+)\/(M\d{8}).htm/) ){
      jsckRoot.setCookie("allpages", parseInt(jsckRoot.getCookie("allpages")).NaN0() + 1, 60 * 3);
      if(((new Date().getTime()) - jsckRoot.getCookie("allstart")) > (60 * 3 * 1000)) {
      	jsckRoot.setCookie("allstart", (new Date().getTime()),60 * 3);
      	jsckRoot.setCookie("allpages", 1, 60 * 3);
      }
      if(jsckRoot.getCookie("allpages") > 85) {
        jsckRoot.setCookie("all_black", "all_black", r_time);
      	jsckRoot.setCookie("allstart", (new Date().getTime()),60 * 3);
      	jsckRoot.setCookie("allpages", 1, 60 * 3);
      }
    }
    
    //jscookie.deleteCookie("lpages");
    var lpagesinfo = jscookie.getCookie("lpages");
    if(!lpagesinfo) {
      lpagesinfo = (new Date().getTime()) + ":1";
    }else {
      var pgnow = new Date().getTime();
      var tmp=lpagesinfo.split(":");
      var difftime = parseInt(((pgnow - tmp[0]) / 1000));
      if(difftime > r_time) {
      	jscookie.setCookie("lprepages", tmp[1], r_time);
      	lpagesinfo = (new Date().getTime()) + ":1";
      } else {
        lpagesinfo = tmp[0] + ":" + (parseInt(tmp[1]) + 1);
      }
    }
    jscookie.setCookie("lpages", lpagesinfo, r_time);
  }


  function bind_ordlist(){
    if(XMLHTTP_val.match(/^system convert error/i) || XMLHTTP_val.match(/^system can't convert/i)){
      alert("瀏覽器無法正確傳送資料,請洽程式設計人員!!!");
      return -1;
    }else{
//          eval(XMLHTTP_val);
      if(XMLHTTP_val!="") eval("res = "+ XMLHTTP_val);
      xmlhttp_close();
      for(var res_key in res){
      	var num_text_obj = document.getElementById(res_key); //首頁列表的物件
      	eval("res_key_value = " + 'res.' + res_key); //遠端取回的物件 value
     		num_text_obj.innerHTML =(res_key=='ord_list')?res_key_value:"(" + res_key_value + ")"; // set value
      }
      my_eval_count_2.innerHTML = "(" + res.my_eval_count + ")"; // 特例
      return;
    }
  }


 function xml_post_test(url,post_value, fun){
      //Xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST",url,true);
      xmlhttp.setRequestHeader("Man", "POST "+url+" HTTP/1.1");
      xmlhttp.setRequestHeader("Content-Type", "text/html");
      xmlhttp.setRequestHeader("Accept-Language", "zh-tw");
      xmlhttp.send(post_value);
//      window.setTimeout('xmlhttp_close()', 30000);
      xmlhttp.onreadystatechange=function() {
        if(xmlhttp.readyState==4) {
          XMLHTTP_val = xmlhttp.responseText;
      	  xmlhttp.abort();
      	  xmlhttp = null;
      	  eval(fun + "()");
        }
      }
  }

function make_ad_impression_js_code(){
	var impression_ad_bk_no_obj = document.getElementsByName('sup_ad');
	var payad_js_bk_array = new Array();
	for(var i=0,j=0;i<impression_ad_bk_no_obj.length;i++){
 	 if(impression_ad_bk_no_obj[i].id == '')continue;
 	 payad_js_bk_array[j++] = impression_ad_bk_no_obj[i].id;
	}

	return payad_js_bk_array;
}

  function go_sep_print(ecno,subno,odno,odnm,amt,cvslink) {
    // http://store.mypchome.com.tw/adm/opt/cvs_ebill.htm
    var won_tst=window.open('https://paystore.pcstore.com.tw/adm/opt/cvs_ebill.htm?ecno='+ecno+'&subno='+subno+'&odno='+odno+'&odnm='+odnm+'&amt='+amt+'&cvslink='+cvslink,'sep_print_winopen_tst','left=100,top=50,width=760,height=1050,resizable=1,scrollbars=1');
    won_tst.focus();

/*
    // http://ebill.cvs.com.tw/ebilling.asp  http://ebill.cvs.com.tw/cvsdefault.asp
    var won_tcv=window.open('http://ebill.cvs.com.tw/ebilling.asp?ecno='+ecno+'&subno='+subno+'&odno='+odno+'&odnm='+odnm+'&amt='+amt+'&cvslink='+cvslink,'sep_print_winopen_tcv','left=100,top=50,width=760,height=1050,resizable=1,scrollbars=1');
    won_tcv.focus();
*/
  }

  function go_sep_711_print(henv,account,order_no,paymentno,validationno) {    
    //var henvstr="https://"+henv;
    //var henvstr="https://paystore.pcstore.com.tw";
    var won_sep711=window.open(henv+'/adm/opt/cvs_711_ebill.htm?account='+account+'&orderno='+order_no+'&paymentno='+paymentno+'&validationno='+validationno,'sep_711_print_winopen_tst','left=20,top=20,width=970,height=900,resizable=1,scrollbars=1');
    won_sep711.focus();
  }
  
//=== member change password--> START


  
  //數字 英文大 英文小 其他  原始權重分數
  score_psd_weight = new Array(10,10,10,15);
  //全都數字 英文大 英文小 其他  扣分權重分數
  score_psd_weight_minus = new Array(3,1,3,1);
  //重複多少字元扣分
  score_psd_char_repeat = 4;
  //重複數字 英文大 英文小 其他  扣分權重分數
  score_psd_weight_repeat_minus = new Array(3,1,3,1);
  //最小字元字
  score_psd_min_passwd = 4;
  //秀圖間距
  score_psd_img = new Array(15,30,40);

  
  function score_psd_total(pwd) {
	var rating=0;
	if(!pwd) return false;  
	passwd=pwd.value;
	if (passwd.length < score_psd_min_passwd)  {
		return 0;
	} else {
		rating = score_psd_rate(passwd);
		if (rating > 0)	return rating;
		else return 0;
	}
  }
  
  function score_psd_CharMode(iN){  
	if (iN>=48 && iN <=57) //數字  
	return 1;  
	if (iN>=65 && iN <=90) //英文大寫  
	return 2;  
	if (iN>=97 && iN <=122) //英文小寫  
	return 4;  
	else  return 8;  
  }
  
  function score_psd_bitTotal(num){  
	modes=0;  
	for (i=0;i<4;i++){  
		if (num & 1)modes = modes + score_psd_weight[i];
			num>>>=1;  
	}
	return modes;  
  }
  
  function score_psd_rate(sPW){  
	Modes=0;Minus=0,total=0;
	//加分
	for (i=0;i<sPW.length;i++){  
		Modes|=score_psd_CharMode(sPW.charCodeAt(i));  
	}
	total = score_psd_bitTotal(Modes);
	//減分
	//只有小大寫英文 數字 或特殊符號
	if (Modes==1)Minus = score_psd_weight_minus[0];
	if (Modes==2)Minus = Minus + score_psd_weight_minus[1];
	if (Modes==4)Minus = Minus + score_psd_weight_minus[2];
	if (Modes==8)Minus = Minus + score_psd_weight_minus[3];
	//重複字 減分
	if (score_psd_CharMode_check(sPW,0))Minus = Minus + score_psd_weight_repeat_minus[0];
	if (score_psd_CharMode_check(sPW,1))Minus = Minus + score_psd_weight_repeat_minus[1];
	if (score_psd_CharMode_check(sPW,2))Minus = Minus + score_psd_weight_repeat_minus[2];
	if (score_psd_CharMode_check(sPW,3))Minus = Minus + score_psd_weight_repeat_minus[3];
	
	return (total-Minus);  
  }
  
  function score_psd_CharMode_check(sPW,type){  
	var num=0,iN=0,type_num=0;
	for (i=0;i<sPW.length;i++){  
		iN = sPW.charCodeAt(i);
		type_num = 3;
		if (iN>=48 && iN <=57) type_num = 0;
		if (iN>=65 && iN <=90) type_num = 1;
		if (iN>=97 && iN <=122)type_num = 2;
		if(type_num==type)num++;
		else num = 0;
		if (num >= score_psd_char_repeat){
			return num;
		}
	}        
  }
  
  function check_password_format(objvalue,flag){
  	var Modes=0,havenum=0,haveeng=0;
	var ok = 0;
	for (i=0;i<objvalue.length;i++){  
		Modes = score_psd_CharMode(objvalue.charCodeAt(i));  
		if(Modes==1)havenum = 1;
		if(Modes==2)haveeng = 1;
		if(Modes==4)haveeng = 1;
		//只接受五種符號 # . %  [ ]
		if(Modes==8){
			ok = 0;
			if(objvalue.charCodeAt(i)==35)ok = 1;
			if(objvalue.charCodeAt(i)==46)ok = 1;
			if(objvalue.charCodeAt(i)==37)ok = 1;
			if(objvalue.charCodeAt(i)==91)ok = 1;
			if(objvalue.charCodeAt(i)==93)ok = 1;
			if(objvalue.charCodeAt(i)==95)ok = 1;
			if (ok==0){
				if(flag)alert("密碼只可包含英文或數字或 # . %  [ ] _ 符號");
				return -1;
			}
		}
	}
	if((havenum!=1) || (haveeng!=1)){
		if(flag)alert("密碼須同時包含數字與英文");
		return -2;
	}
	if (objvalue.length<6){
		if(flag)alert("密碼不可少於6位");
		return -3;
	}
	
	if (objvalue.length>24){
		if(flag)alert("密碼不可多於24位");
		return -3;
	}
	
  	return 1;
  }
  
  function score_img_show(pwd){

	  var result = score_psd_total(pwd);
	  if(pwd.value.length>0){
	  	obj = document.getElementById("score_strong1");
		obj.style.visibility="visible";
	  }else{
	  	obj = document.getElementById("score_strong1");
		obj.style.visibility="hidden";
	  }
	  
	  
	  if(result>=score_psd_img[0]){
	  	obj = document.getElementById("score_strong2");
		obj.style.visibility="visible";
	  }else{
	  	obj = document.getElementById("score_strong2");
		obj.style.visibility="hidden";
	  }
	  if(result>=score_psd_img[1]){
	  	obj = document.getElementById("score_strong3");
		obj.style.visibility="visible";
	  }else{
	  	obj = document.getElementById("score_strong3");
		obj.style.visibility="hidden";
	  }
	  if(result>=score_psd_img[2]){
	  	obj = document.getElementById("score_strong4");
		obj.style.visibility="visible";
	  }else{
	  	obj = document.getElementById("score_strong4");
		obj.style.visibility="hidden";
	  }
	  
  } 
  
  function score_img_data_old(){
  	  var imgdata='<div>強度：<strong style="color:#F00">弱</strong>　<strong style="color:#F30">普通</strong>　<strong style="color:#090">強</strong>　<strong style="color:#009">非常強</strong></div><div style="width:135px;border:1px solid #CCC; padding:2px; margin-left:33px; background:#fff"><img src="https://img.pcstore.com.tw/web_img/st/save1.gif" style="visibility:hidden" id=score_strong1 /><img src="https://img.pcstore.com.tw/web_img/st/save2.gif" style="visibility:hidden" id=score_strong2 /><img src="https://img.pcstore.com.tw/web_img/st/save3.gif" style="visibility:hidden" id=score_strong3 /><img src="https://img.pcstore.com.tw/web_img/st/save4.gif" style="visibility:hidden" id=score_strong4 /></div>';
	  document.write(imgdata);
  }
  function score_img_data(){
  	  var imgdata='<div class="level">&nbsp;&nbsp;<strong style="color:#F00">弱</strong>　<strong style="color:#F00">普通</strong>　<strong style="color:#F00">強</strong>　<strong style="color:#F00">非常強</strong><div style="width:131px;border:1px solid #CCC; padding:2px; margin-top:5px; background:#fff"><img src="https://img.pcstore.com.tw/web_img/st/save2_1.gif" id="score_strong1" style="visibility:hidden"><img src="https://img.pcstore.com.tw/web_img/st/save2_2.gif" id="score_strong2" style="visibility:hidden"><img src="https://img.pcstore.com.tw/web_img/st/save2_3.gif" id="score_strong3" style="visibility:hidden"><img src="https://img.pcstore.com.tw/web_img/st/save2_4.gif" id="score_strong4" style="visibility:hidden"></div></div>';
	  document.write(imgdata);
  }
  
//=== member change password--> END

  function stern_setctk_proc1(topt,usvpt) {
    var jscookie,vdm,vpt,sternctk,nm,nm2;
    vdm=window.location.host;
    if (usvpt) { vpt=location.pathname.replace(/(\/.+\/).+/, "$1"); } else { vpt="/"; }
    nm=Math.floor(Math.random()*(1999-10+1)+10); 
    jscookie = new CookieHaldle();
    nm2 = (new Date().getTime())/100000000000*nm;
    sternctk=nm2.toString().substr(0,10);
    if (topt == "HOME") { jscookie.setCookie("sternhomectk", sternctk, 60, vpt, vdm); }
    else if (topt == "ADM") { jscookie.setCookie("sternadmctk_advrn", sternctk, 60, vpt, vdm); }
    else if (topt == "WEB") { jscookie.setCookie("sternctkweb_inc", sternctk, 60, vpt, vdm); }
    else if (topt == "WEBLR") { vdm=vdm.substring(vdm.indexOf('.')+1,vdm.length); jscookie.setCookie("sternctkweb_inc", sternctk, 60, vpt, vdm); }
    return sternctk;
  }

  function stern_process_adv(str1,value1) {
    //_pO1.svt = "";
    var str2=_pO1._pF11(str1, value1, 256);
    return str2;
  }
  
  function stern_ac2process(spnss) {
  	var jscookie,vsd="",nysr="";
  	
  	jscookie = new CookieHaldle();
  	vsd=jscookie.getCookie("ac2admctk_ctr");
    nysr=_pO1._pF13(spnss, vsd, 256, 0);
    return nysr;
  }

  function do_order(exopt){
    ev = arguments.callee.caller.arguments[0] || window.event;
    sre = ev.target || ev.srcElement;
    var o_no = sre.innerHTML.trim();
		//var o_no = event.srcElement.innerHTML.trim();
		/*var my_ev = "jswinopen('order_detail','/order_manage/order_detail.htm?order_id=no&rnd=jrnd','訂單明細','','','','','','ssl');";*/
    var my_ev = "swin_obj=window.open('/order_manage/order_detail.htm?order_id=no&rnd=jrnd','order_detail','left=50,top=20,width=800,height=650,resizable=1,scrollbars=1');";
    var nev = my_ev.replace("=no", "=" + sre.innerHTML.trim());
    window.tmp_rnd=Math.round(Math.random()*1000000);
    if(typeof(exopt) == 'undefined') exopt = '';
    eval(nev.replace("jrnd", (new Date().getTime() +'&t=' + window.tmp_rnd + exopt )));
    swin_obj.focus();
    return;
	}

  function convert_unicode(str){
    result = "";

    for(i = 0 ; i < str.length ; i++) {
      c = str.charAt(i);
      cstr = "";
      if((' ' <= c && c <= '~') || (c == '\r') || (c == '\n')) {
        /*if(c == '&') {
          cstr = "&amp;";
        } else*/ if(c == '<') {
          cstr = "&lt;";
        } else if(c == '>') {
          cstr = "&gt;";
        } else {
          cstr = c.toString();
        }
      }
      if(c.charCodeAt().toString()=="33971" || c.charCodeAt().toString()=="34766" || c.charCodeAt().toString()=="29319" || 
      c.charCodeAt().toString()=="21452" || c.charCodeAt().toString()=="32957" || c.charCodeAt().toString()=="33747" || c.charCodeAt().toString()=="32171"
      || c.charCodeAt().toString()=="31913" || c.charCodeAt().toString()=="34100" || c.charCodeAt().toString()=="40059" || c.charCodeAt().toString()=="12293"
      || c.charCodeAt().toString()=="31453" || c.charCodeAt().toString()=="29800" || c.charCodeAt().toString()=="22531" || c.charCodeAt().toString()=="32118"
      || c.charCodeAt().toString()=="23572" || c.charCodeAt().toString()=="22586" || c.charCodeAt().toString()=="28201" || c.charCodeAt().toString()=="36394"
      || c.charCodeAt().toString()=="28278" || c.charCodeAt().toString()=="30423" || c.charCodeAt().toString()=="28801" || c.charCodeAt().toString()=="37444"
      || c.charCodeAt().toString()=="24419" || c.charCodeAt().toString()=="21441" || c.charCodeAt().toString()=="21790" || c.charCodeAt().toString()=="21894"
      || c.charCodeAt().toString()=="38609"){
        cstr = "&#" + c.charCodeAt().toString() + ";";
      }

      if(cstr){
        result = result + cstr;
      }else{
        result = result + c;	
      }
    }
    return result;
  }
  
  function brwsckidsn_fnc() {
  	var nmt,nma,md,ns,teks,mii,mxx,brwsckidsn="";
    try {
      var jscookie = new CookieHaldle("/",window.location.host.replace(/(.+\.)(.*pc?store.com.tw)/, "$2"));
    }catch(e){ return;}
    if (jscookie.getCookie("brwsckidsn") != null && jscookie.getCookie("brwsckidsn") != "") { return; }
    teks='hijk89VWXYZ4ABCDlnopqrstuvwxyz123NOQRSTU56abcde_fg7FGHIJKM';
    md=teks.length;
    mii=32; mxx=40;
    var bs=Math.floor(Math.random()*899+100);
    nmt=Math.floor((new Date().getTime())/10)*1000+bs;
    nma=Math.floor(Math.random()*(mxx-mii)+mii);
    if (nma < mii || nma > mxx) { nma=35; }
    for (var n=0; n<nma; n++) {
      ns=Math.floor(nmt/md);
      nmt-=ns;
      brwsckidsn+=teks.charAt(ns%md);
    }
    jscookie.setCookie("brwsckidsn", brwsckidsn, 86400*365*10);
  }  
  brwsckidsn_fnc();

  var v_xinfo_mn=0;
  function getXinfo(genv, gurl, gstr) {
    var gdata;
    gdata = (genv == "DEV") ? "MYDEBUG=jrbin&pa="+gstr : "pa="+gstr;
    if ('admstore.pcstore.com.tw' == window.location.host) gurl = gurl.replace("adm.pcstore.com.tw","admstore.pcstore.com.tw");
    //alert(gurl); 
//    if ("function" == typeof(openProgress)) { proSlp_rfg=0; setTimeout('openProgress()',1000); }    
    $.ajax({
      type: "GET",
      url: gurl,
      cache: false,
      timeout: 9000,
      data: gdata,
      dataType: "JSON",
      error: function (xhr, ajaxOptions, thrownError) {
        //if (v_xinfo_mn < 3) { v_xinfo_mn+=1; Args_setTimeout(getXinfo, 900, genv, gurl, gstr); return; }
        if (v_xinfo_mn < 2) { v_xinfo_mn+=1; setTimeout(function(){ getXinfo(genv,gurl,gstr) }, 900); return; }
        if (v_xinfo_mn >= 2) { 
          getXinfo_emsg(v_xinfo_mn+1,thrownError,xhr.status,xhr.responseText); 
        }
        if (thrownError.indexOf("Unknown") == "-1" && xhr.status != 0) alert(thrownError+"("+xhr.status+")");
        else alert("請稍後重新整理！");
      },
      complete : function (XMLHttpRequest, textStatus) {
      },
      success: function(myData) {
      	//if ("undefined" == typeof(progressBarFun)) { proSlp_rfg=1; }
        //else if ("function" == typeof(setProgress)) { setProgress(100); }
        if ("function" == typeof(setProgress)) {
          if ("undefined" == typeof(progressBarFun)) { proSlp_rfg=1; }
          else { setProgress(100); }
        }
      	v_xinfo_mn=0;
        if (myData.st == "OK") {
          putUs(myData);
          //alert(myData.st);
          /*alert(myData.<?=get_encode_order($hdOrderID);?>.B[0]);*/
          /*alert("[success] "+myData['<?=get_encode_order($hdOrderID);?>']['B'][0]);*/
          /*$("#textid").html(msg['buyer']+msg['japan']+msg['china']+msg['words']+msg['korea']);*/
        }
        else {
          //alert("連線錯誤["+myData.st+"]");
          alert("資料有誤，請重新整理["+myData.st+"]");
        }
//        if ("function" == typeof(closeProgress) && "undefined" != typeof(progressBarFun)) { closeProgress(); }
      }
    });   
  }
  
  function getXinfo_emsg(xn,errstr,errn,etext) {
    var gxu,gdst;    
    gxu=window.location.protocol+"//"+window.location.host+"/component/gxinfo.php";
    gdst="xn="+xn+"&errstr="+errstr+"&errn="+errn+"&etext="+etext;
    $.ajax({
      type: "GET",
      url: gxu,
      cache: false,
      timeout: 5000,
      data: gdst,
      dataType: "JSON",
      error: function (xhr, ajaxOptions, thrownError) { },
      success: function(myData) { }
    });
  }

	//(2018.10.25) Get Elements By Name (Default Get 1st Element)
  function JS_GetElementsByName(szTagName, nIndex)
  {
  	//alert(szTagName);
  	var oRet = null;			// Return Object
  	if (typeof nIndex == 'undefined')
  		nIndex = 0;
  	//console.log(szTagName+","+nIndex);
  	
    var oTemp = document.getElementsByName(szTagName);
    //console.log(oTemp);
    if(oTemp.length > nIndex)
    	oRet = oTemp[nIndex];
    //console.log(oRet);
  	return oRet;
  }

// fix buy car
if(window.location.host.match(/^(www\d?|paystore).(mypc|p|pc)store.com.tw/i)) {
	//alert(window.location.protocol);
  //if (window.location.protocol == "https:" && (window.location.href.indexOf('/',8) == window.location.href.lastIndexOf('/') || window.location.href.match(/\/adm\/(buy|clause|buy_nv|buy_nv_prc|webatm_select|sep_select|cod_select|login_dynps|login|buy_othinfo|osivn_select)\.htm/i) )) { }
  if (window.location.protocol == "https:" && (window.location.href.match(/\/adm\/(buy|clause|buy_nv|buy_nv_prc|webatm_select|sep_select|cod_select|login_dynps|login|buy_othinfo|osivn_select)\.htm/i) )) { }
  else if (window.location.protocol == "https:" && (window.location.href.match(/\/adm\/(m_pay_sucess|m_pay_card_sw|m_pay_first|m_pay_first_g|m_pay_atm|m_pay_atm_sw|m_pay_other|m_pay_other_sw)\.htm/i) )) { }
  else if (window.location.protocol == "https:" && (window.location.href.match(/\/adm\/pp\/(pp_buy|pp_buy_behind|pp_swift_behind|pp_m_pay_addbook|pp_m_pay_first|pp_m_pay_instant|pp_m_pay_atm|pp_m_pay_crd|pp_m_pay_711|pp_m_pay_fa)\.htm/i) )) { }
  else if (window.location.protocol == "http:" && (window.location.href.match(/\/adm\/(qsurvey_main).htm/i) || window.location.href.match(/\/adm\/pp\/(pp_buyprdlist|pp_swift_buyprdlist|pp_viewpaper)\.htm/i) )) { }
  else {
  scriptUtil.addScript({src: scriptUtil.me.src.replace(/(.*)\/.*/, '$1/shoppingcar.js?t=8'),charset:'utf-8',
            onload : function(){
                shoppingcarDiv.MsgDiv();
            }
        });
  }
}

  function chkbox_sel(id){
    var a_obj=document.getElementById(id);
    if(a_obj.checked==true){
      a_obj.checked=false;  
    }else{
      a_obj.checked=true;
    }
  }

//-->