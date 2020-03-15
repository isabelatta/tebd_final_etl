const convertObj = {
  convertAutor: (obj) => ({
    nome: obj.nome,
    endereco: obj.endereco,
    email: obj.email,
    tel: obj.tel,
    local_emprego: obj.local_emprego,
    numero_inscricao: obj.numero_inscricao,
    data_vencimento: obj.data_vencimento,
    cartao_credito: obj.cartao_credito,
    voluntario: obj.voluntario,
  }),
  convertArtigo: (obj) => ({
    resumo: obj.resumo,
  }),
  convertRevisao: (obj) => ({
    nota: obj.nota,
    comentario: obj.comentario,
  })
}

module.exports = convertObj;