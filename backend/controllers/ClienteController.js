//IMPORTANDO MODEL PARA MONGODB DO CLIENTE 
const Cliente = require('../models/Cliente')
//IMPORTANDO MÓDULOS NECESSÁRIOS DO NODE 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// IMPORTANDO HELPERS
const createUserToken = require('../helpers/create-user-token') 
const getToken = require('../helpers/get-token')

/* CLASSE ClienteController */
module.exports = class ClienteController{
    /* Métodos estáticos para serem chamados 
    com a classe ClienteController  */

    /* MÉTODO REGISTRAR */

    static async registrar(req, res){
        
        const {nome, email, telefone, senha, confsenha} = req.body
       
        console.log(req.body)
        /* Validações */
        if (!nome){
            res.status(422).json({mensagem: "O nome é obrigatório"})
            return
        }

        if (!email){
            res.status(422).json({mensagem: "O e-mail é obrigatório"})
            return
        }

        if (!telefone){
            res.status(422).json({mensagem: "O telefone é obrigatório"})
            return
        }

        if (!senha){
            res.status(422).json({mensagem: "A senha é obrigatória"})
            return
        }

        if (!confsenha){
            res.status(422).json({mensagem: "A confirmação de senha é obrigatória"})
            return
        }

        if (senha !== confsenha){
            res.status(422).json({mensagem: "A senha e sua confirmação não conferem"})
            return
        }

        /* Verifica existência de usuário */
        const clienteExiste = await Cliente.findOne({email: email})

        if (clienteExiste){
            res.status(422).json({mensagem: "E-mail já cadastrado!"})
            return
        }

        /* Criação de senha  */
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        /* Criação de usuário */
        const cliente = new Cliente({nome, email, telefone, senha: senhaHash })

        try {
            const novoCliente = await cliente.save()
            await createUserToken(novoCliente, req, res)
        } catch (error) {
            res.status(500).json({mensagem: error})
        }
    }/* fim do registrar */

    /* MÉTODO LOGIN */
    static async login(req,res){
        const {email, senha} = req.body
        if(!email){
            res.status(422).json({
                mensagem: "O e-mail é obrigatório"})
            return
        }
        if(!senha){
            res.status(422).json({
                mensagem: "A senha é obrigatória"})
            return
        } 
        const cliente = await Cliente.findOne({email: email})

        if(!cliente){
            res.status(422).json({mensagem: "Usuário não encontrado!"})
            return
        }
        //VERIFICA SE SENHA CONFERE COM SENHA REGISTRADA
        const verificaSenha = 
        await bcrypt.compare(senha,cliente.senha)
        if (!verificaSenha){
            res.status(422).json({mensagem: "Senha não confere"})
            return
        }
        await createUserToken(cliente,req,res)
    }/* fim do login */

    //NOVO CÓDIGO A PARTIR DE 25/07/2024
    //Método (função) PARA VERIFICAR USUÁRIO
    // métodos estáticos não precisam ter sua 
    // chamada definida em uma instância da classe
    static async verificaUsuario(req, res){
        let usuarioAtual

        console.log(req.headers.autorizacao)

        if (req.headers.autorizacao){
            const token = getToken(req)
            const decodificado = jwt.verify(token,'mysecret')
            usuarioAtual = await Cliente.findById(decodificado.id)
            usuarioAtual.senha = undefined 
            //segurança aqui: esvazia o retorno da senha
        } else{
            usuarioAtual= null
        }

        res.status(200).send(usuarioAtual)
    }

    /* método buscarTodos (os clientes) */
    static async buscarTodos(req,res){
        const users = await Cliente.find().sort('-createdAt')
        res.status(200).json({
          clientes: users  
        })
    }
}/* fim da classe ClienteController  */
