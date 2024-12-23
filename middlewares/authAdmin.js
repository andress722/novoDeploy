const { Usuario } = require('../models');

const verificaLoginAdm = async (req, res, next) => {
    if (!req.session.estaLogado) {
        return res.redirect('/superadmin/loginempresa');
    }
    
    const id = req.session.usuarioLogado.id;
    const admin = await Usuario.findByPk(id);

    if (!admin) {
        return res.redirect('/superadmin/loginempresa');
    }

    next();
};

module.exports = verificaLoginAdm;
