const con = require('./utils/connection');
const paginate = require('./utils/paginateArray');

class EtlService {

  constructor () {};

  getJSON(_req, res) {
    const proArt = new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM tebd.artigo;';
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });

    const proAut = new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM tebd.autor;';
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });

    const proRevisao = new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM tebd.revisao;';
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });

    const proAutArt = new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM tebd.autor_artigo;';
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });

    Promise.all([proArt, proAut, proRevisao, proAutArt]).then((values) => {
      let artigos = paginate(values[0]);
      let autores = paginate(values[1]);
      let revisoes = paginate(values[2]);
      let autorArtigo = paginate(values[3]);
      try {
        for (let index = 1; index <= artigos.totalPages; index++) {
          artigos = paginate(values[0], index);
          console.log(index);
        }
        for (let index = 1; index <= autores.totalPages; index++) {
          autores = paginate(values[1], index);
          console.log(index);
        }
        for (let index = 1; index <= revisoes.totalPages; index++) {
          revisoes = paginate(values[2], index);
          console.log(index);
        }
        for (let index = 1; index <= autorArtigo.totalPages; index++) {
          autorArtigo = paginate(values[3], index);
          console.log(index);
        }
      } catch (error) {
        
      } finally {
        return res
        .send({
          lotesArtigos: artigos.totalPages,
        });
      }
    });
  };
}

module.exports = new EtlService();