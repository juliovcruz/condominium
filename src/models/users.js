function User(id,name,password){
    this.id = id
    this.name = name
    this.password = password
}

var db = openDatabase("MyDB", "1.0", "MyBase",4048)

var users = []

db.transaction(function(create){
    create.executeSql("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT)")
});

function insertUser(name,password){
    db.transaction(function(tst){
        tst.executeSql("INSERT INTO users (name,password) VALUES (?,?)",[name,password] );
    });
}

function deleteUser(id){
    db.transaction(function(tst){
        tst.executeSql("DELETE FROM users WHERE id = ?",[id]);
    })
}

function readUser(){

    usersR = []

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM users",[],function(tst,result){
            var rows = result.rows;
            for(var i=0;i<rows.length;i++){
                usersR.push(new User(rows[i].id),rows[i].name,rows[i].password)
            }
        })
    })
    return usersR;
}

function readUser(id){
    var user = {}
    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM users WHERE id = ?",[id],function(tst,result){
            var row = result.rows[0];
            
            user.id = row.id
            user.name = row.name
            user.password = row.password
        })
        
    })
    console.log(user)
    return user
}

function getUserName(id,callback){
    var user = {}
    var str;
    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM users WHERE id = ?",[id],function(tst,result){
            var row = result.rows[0];
            
            str = row.name
            callback(str)
        })
        
    })
}

function updateUser(id,name,password){
    db.transaction(function(tst){
        tst.executeSql("UPDATE users SET name = ?, password = ? WHERE id = ? ",[name,password,id])
    })
}

function loginUser(){
    var user = {}
    var name = document.getElementById('field-name').value;
    var password = document.getElementById('field-pass').value;

    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM users WHERE name = ?",[name],function(tst,result){
            
        if(result.rows[0] == null) alert("Usuário não foi cadastrado!")
            else{
            var row = result.rows[0];
            
            user.id = row.id
            user.name = row.name
            user.password = row.password
            

            if(user.password == password){
                window.location.href = "/condominium/tools.html"
                sessionStorage.setItem('id', row.id);
            }else{
                alert("Senha Incorreta!")
            }


        }

        })
    })
}

async function signupUser(){
    var name = document.getElementById('field-name').value
    var password = document.getElementById('field-pass').value
    let flag = 0
    db.transaction(function(tst){
        tst.executeSql("SELECT * FROM users WHERE name = ?",[name],function(tst,result){
            
        if(result.rows[0] == null){
            if(password=="") alert("Escreva uma senha válida")
            else{
                alert("Usuário cadastro com sucesso!")
                
                return  insertUser(name,password)
            }
        }
            else
                alert("Este usuário já foi utilizado!")

        })
    })

}
