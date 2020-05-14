function Rent(id,idtool,idprovider,idclient,days,nameTool){
    this.id = id
    this.idtool = idtool
    this.idprovider = idprovider
    this.idclient = idclient
    this.days = days
    this.nameTool = nameTool
}

var db = openDatabase("MyDB", "1.0", "MyBase",4048);

var days = []

db.transaction(function(create){
    create.executeSql("CREATE TABLE rents (id INTEGER PRIMARY KEY, idtool INTEGER, idprovider INTEGER, idclient INTEGER, days INTEGER, nameTool TEXT)")
});

function insertRents(idtool,idprovider,idclient,nameTool){

    db.transaction(function(tst){
        tst.executeSql("INSERT INTO rents (idtool,idprovider,idclient,days,nameTool) VALUES (?,?,?,?,?)",[idtool,idprovider,idclient,0,nameTool])
    })
}

function deleteRents(id){
    db.transaction(function(tst){
        tst.executeSql("DELETE FROM rents WHERE id = ?",[id]);
        window.location.reload()
    })
}

function readRents(){

    rentsR = []

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM rents",[],function(tst,result){
            var rows = result.rows;
            for(var i=0;i<rows.length;i++){
                rentsR.push(new Rent(rows[i].id,rows[i].idtool,rows[i].idprovider,rows[i].idclient,rows[i].days,rows[i].nameTool))
            }
        })
    })
    return rentsR;
}

function readRents(id){
    var rent = {}
    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM rents WHERE id = ?",[id],function(tst,result){
            var row = result.rows[0];
            
            rent.id = row.id
            rent.idtool = row.idtool
            rent.idprovider = row.idprovider
            rent.idclient = row.idclient
            rent.days = row.days
            rents.nameTool = row.nameTool
        })
        
    })
    return rent
}

function updateRents(idtool,idprovider,idclient,days,nameTool,id){
    db.transaction(function(tst){
        tst.executeSql("UPDATE rents SET idtool = ?, idprovider = ?, idclient = ?, days = ?,nameTool = ? WHERE id = ? ",[idtool,idprovider,idclient,days,nameTool,id])
    })
}

function printRents(){
    var table = document.getElementById("myTable")

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM rents",[],function(tst,result){
            rows = result.rows;
            for(var i=0;i<rows.length;i++){
                tr = table.insertRow(1)
                var td = document.createElement('td')
                tr.insertCell(0).innerHTML = rows[i].idclient
                tr.insertCell(1).innerHTML = rows[i].idprovider
                tr.insertCell(2).innerHTML = rows[i].nameTool
                if(sessionStorage.getItem('id')==rows[i].idclient ||sessionStorage.getItem('id')==rows[i].idprovider)
                    tr.insertCell(3).innerHTML = "<i class=" + "material-icons" + " style=" + "color:red "+"onclick="+"deleteRents("+rows[i].id+")>clear</i>"
                tr.appendChild(td)
            }
                
        })
    })
}