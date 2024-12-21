
const verificaLogin = function verificaLogin(req,res,next){
    
    if(!req.session.estaLogado){
        res.redirect('/login')
        return
    }
    next()
}



module.exports = verificaLogin