//CONFIGURANDO O SERVIDOR
const express = require('express');
const server = express()

//CONFIGURAR SERVIDOR PARA APRESENTAR ARQUIVOS ESTÁTICOS
server.use(express.static('public'));

server.use(express.urlencoded({ extended: true}))


/*CONFIGURAR CONEXÃO COM O BANCO DE DADOS*/
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Americanidiot.02',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

//CONFIGURANDO A TEMPLATE ENGINE
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
    express: server,
    noCache: true
});



//CONFIGURANDO A APRESENTAçÃO DA PÁGINA
server.get('/', function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send('Erro de banco de dados.');

        const donors = result.rows;

        return res.render('index.html', { donors });
    })
    
});


//PEGAR DADOS DO FORMULÁRIO
server.post('/', function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    //ADICIONAR valores no bando de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if(err) return res.send('erro no banco de dados.')


        return res.redirect('/');
    });

    
   
});



//LIGAR O SERVIDOR E PERMITIR ACESSO À PORTA 3000
server.listen(3000, function() {
    console.log('Servidor iniciado com nodemon!');
});


/*iniciar server com "npm start"*/