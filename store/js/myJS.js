var DB_NAME='addr_list';
var OBJ_SPASE_NAME='addrs';
var mydb;



$(document).ready(function(){
    window.indexedDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
    if(window.indexedDB){                                                      
        var request;                                                          
        request=window.indexedDB.open(DB_NAME,'3.0');                           
        request.onsuccess=function(event){
            alert('database open successfully！');
            mydb=request.result;                                                   
            byCursorGet(mydb);
        };
        request.onerror=function(event){
            alert("打开失败,错误号：" + event.target.errorCode);
        };
        request.onupgradeneeded = function(event) {
            mydb=request.result;//获得数据库实例对象
            if(!mydb.objectStoreNames.contains(OBJ_SPASE_NAME)) {                   
                var objectStore = mydb.createObjectStore(OBJ_SPASE_NAME, {keyPath: "ID"});
                objectStore.createIndex("ID",                                
                                        "ID",                                
                                        { unique: true });                      
            }
        }
    } else{
        alert("not support");
    }

    //插入数据，
    function insert(mydb){
        var data = {
            "name": $("#name").val(),
            "ID": $("#ID").val(),
            "sfile": $("#sfile").val(),
            "date":new Date().toLocaleTimeString()
        };
		

        //使用事务
        var transaction = mydb.transaction(OBJ_SPASE_NAME,                        
                                        'readwrite');                         
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var request = objStore.add(data);
        request.onsuccess = function(e) {
            alert("insert successfully，id=" + e.target.result);
        };
    }
    //查询数据
    function get(mydb){
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var request = objStore.get(n);                 //按照id查询
        request.onsuccess=function(e){
            var tr="";
            var obj=e.target.result;
			console.info(obj.sfile);
            tr=tr+"<tr><td>"+(1)+"</td><td>"+obj.name+"</td><td class='p'>"+obj.ID
                +"</td><td>"+obj.sfile+"</td><td>"+obj.date
                +"</td><td><input type='button' id='del' value='delete'>"
				+"</td><td><input type='button' id='get' value='get'></td></tr>";
            //叠加表格内容
            $("#check span").html(
                "<table width='100%'>"
                +"<tr><td>序号</td><td>name</td><td>ID</td><td>file</td><td>time</td><td>operation</td><td>operation</td></tr>"
                +tr+"</table>"
            );
        }
    }
    //更新数据
    function update(mydb){
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var request = objStore.get("110");
        request.onsuccess=function(e){
            var student=e.target.result;
            student.name='wwww1';
            objStore.put(student);
        }
    }
    //删除数据
    function remove(mydb){
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var request = objStore.delete(myID);
        request.onsuccess = function(e) {
            alert("delete successfully");
        };
    }
    //利用索引查询
    function byIndexGet(mydb){
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var index = objStore.index('email');                //索引名
        var request=index.get('liming1@email.com');         //通过索引值获取数据
        request.onsuccess=function(e){
            var student=e.target.result;
            alert(student.name+"：索引查询");
        }
    }
    //游标遍历所有
    function byCursorGet(mydb){
        var tr='';var i=0;
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var request=objStore.openCursor();//打开游标
        request.onsuccess = function(e){
            var cursor = e.target.result;
            if(cursor){
                //alert(cursor.value.name);
                var obj=cursor.value;
                tr=tr+"<tr><td>"+(i+1)+"</td><td>"+obj.name+"</td><td class='p'>"+obj.ID
                    +"</td><td>"+obj.sfile+"</td><td>"+obj.date
                    +"</td><td><input type='button' id='del' value='delete'></td><td><input type='button' id='get' value='get'></td></tr>";i=i+1;
                cursor.continue();
            }else {
                alert('遍历完成');
                //叠加表格内容
                $("#result span").html(
                    "<table width='100%'>"
                    +"<tr><td>number</td><td>name</td><td>ID</td><td>file</td><td>time</td><td>operation</td><td>operation</td></tr>"
                    +tr+"</table>"
                );
            }
        }
    }
    //通过范围和排序条件，游标遍历符合条件的数据
    function byCursorGetForRangeAndSort(mydb){
        var transaction = mydb.transaction(OBJ_SPASE_NAME,'readwrite');
        transaction.oncomplete = function(event) {};
        transaction.onerror = function(event) {};
        transaction.onabort = function(event){};
        var objStore = transaction.objectStore(OBJ_SPASE_NAME);
        var range = IDBKeyRange.bound("110", "113", false, true);  
        var request=objStore.openCursor(range,             
                                        IDBCursor.NEXT);    
        request.onsuccess = function(e){
            var cursor1 = e.target.result;
            if(cursor1){
                alert(cursor1.value.name);
                cursor1.continue();
            }else {
                alert('遍历完成');
            }
        }
    }



    //插入数据
    $("#sm").on('click',function(){
        insert(mydb);
        byCursorGet(mydb);
    });
    //单击删除按钮
    var myID;
    $(document).on('click',"#del",function(){
        myID=$(this).parent().prev().prev().prev().text();
		//console.info(myID);
        $(this).parent().parent().remove();
        remove(mydb);
    });
	//单击获取按钮
	var getFile;
	$(document).on('click',"#get",function(){
		getFile=$(this).parent().prev().prev().prev().file;
		//console.info(getFile);
		return getFile;
	});
    //查询
    var n;
    $("#check input[type='button']").on('click',function(){
        n=$("#check input:first").val();
        get(mydb);
    });





});
