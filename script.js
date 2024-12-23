const { Usuario } = require('./models');
const bcrypt = require('bcrypt');

(async () => {
    try {
        // Busca todos os usuários
        const usuarios = await Usuario.findAll();

        for (let usuario of usuarios) {
            // Verifica se a senha parece já estar criptografada
            if (!usuario.senha.startsWith('$2')) {
                // Criptografa a senha
                const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
                
                // Atualiza no banco de dados
                await Usuario.update(
                    { senha: senhaCriptografada },
                    { where: { id: usuario.id } }
                );

                console.log(`Senha do usuário ${usuario.id} atualizada.`);
            } else {
                console.log(`Senha do usuário ${usuario.id} já está criptografada.`);
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar senhas:', error);
    }
})();