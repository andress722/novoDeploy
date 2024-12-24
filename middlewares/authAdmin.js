const { Usuario } = require('../models');

const verificaLoginAdm = async (req, res, next) => {
    try {
        // Verifica se o usuário está logado
        if (!req.session.estaLogado) {
            console.error('Usuário não está logado.');
            return res.redirect('/superadmin/loginempresa');
        }

        // Recupera o ID do usuário logado
        const id = req.session.usuarioLogado.id;

        // Busca o usuário no banco de dados
        const admin = await Usuario.findByPk(id);

        // Verifica se o usuário existe e se é do tipo "Administrador"
        if (!admin || admin.tipo !== 'Administrador') {
            console.error('Acesso negado: Usuário não é um administrador.');
            return res.redirect('/superadmin/loginempresa');
        }

        // Usuário é válido e é administrador
        next();
    } catch (error) {
        console.error('Erro no middleware verificaLoginAdm:', error);
        return res.redirect('/superadmin/loginempresa');
    }
};

module.exports = verificaLoginAdm;
