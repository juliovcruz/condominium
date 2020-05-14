function Tool(id,name,iduser,price,disp){
    this.id = id
    this.name = name
    this.iduser = iduser
    this.price = price
    this.disp = disp
}

var db = openDatabase("MyDB", "1.0", "MyBase",4048);

var tools = []

db.transaction(function(create){
   create.executeSql("CREATE TABLE tools (id INTEGER PRIMARY KEY, name TEXT, iduser INTEGER, price REAL,disp INTEGER)")
})

db.transaction(function(create){
    create.executeSql("ALTER TABLE tools ADD disp INTEGER")
})


function insertTools(name,iduser,price){
    console.log("INSERINDO")

    db.transaction(function(tst){
        tst.executeSql("INSERT INTO tools (name,iduser,price,disp) VALUES (?,?,?,?)",[name,iduser,price,1] );
    });
}

function deleteTools(id){
    db.transaction(function(tst){
        tst.executeSql("DELETE FROM tools WHERE id = ?",[id]);
        window.location.reload()
    })
}

function readTools(){

    toolsR = []

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM tools",[],function(tst,result){
            var rows = result.rows;
            for(var i=0;i<rows.length;i++){
                toolsR.push(new Tool(rows[i].id,rows[i].name,rows[i].iduser,rows[i].price,rows[i].disp))
            }
        })
    })
    return toolsR;
}

/*function readTools(id){
    var tool = {}
    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM tools WHERE id = ?",[id],function(tst,result){
            var row = result.rows[0];
            
            tool.id = row.id
            tool.name = row.name
            tool.iduser = row.iduser
            tool.price = row.price
        })
        
    })
    return tool
}*/

function updateTools(id,name,iduser,price,disp){
    db.transaction(function(tst){
        tst.executeSql("UPDATE tools SET name = ?, iduser = ?, price = ?,disp = ? WHERE id = ? ",[name,iduser,price,disp,id])
    })
}


async function noDispTool(id){
    db.transaction(function(tst){
        tst.executeSql("UPDATE tools SET disp = ? WHERE id = ? ",[0,id])
        window.location.reload()
    })
}

function DispTool(id){
    db.transaction(function(tst){
        tst.executeSql("UPDATE tools SET disp = ? WHERE id = ? ",[1,id])
    })
}

function printTools(){
    
    var table = document.getElementById("myTable")

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM tools",[],function(tst,result){
            rows = result.rows;
            for(var i=0;i<rows.length;i++){
                tr = table.insertRow(1)
                var td = document.createElement('td')
                tr.insertCell(0).innerHTML = rows[i].iduser
                tr.insertCell(1).innerHTML = rows[i].name
                tr.insertCell(2).innerHTML = rows[i].price
                if(sessionStorage.getItem('id')==rows[i].iduser)
                    tr.insertCell(3).innerHTML = "<i class=" + "material-icons" + " style=" + "color:red "+"onclick="+"deleteTools("+rows[i].id+")>clear</i>"
                else if(rows[i].disp == 1)
                    //tr.insertCell(3).innerHTML = "<i class=" + "material-icons" + " style=" + "color:green "+"onclick="+"noDispTool("+rows[i].id+");insertRents("+rows[i].id+"," + rows[i].iduser +"," + sessionStorage.getItem('id') + "," + rows[i].name+")>eject</i>"
                    tr.insertCell(3).innerHTML = "<i class=" + "material-icons" + " style=" + "color:green "+"onclick=" + "insertRents("+rows[i].id+"," + rows[i].iduser +"," + sessionStorage.getItem('id') + ",\"" + rows[i].name+"\");noDispTool("+rows[i].id +")>eject</i>"
                tr.appendChild(td)
            }
                
        })
    })


}

function signupTools(){
    var iduser = sessionStorage.getItem('id')
    var name = document.getElementById('input-name').value;
    var price = document.getElementById('input-price').value;

    db.transaction(function(tst){
        insertTools(name,iduser,price)
        window.location.reload();
    })


}