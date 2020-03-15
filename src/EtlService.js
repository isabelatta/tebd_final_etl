const conMySQL = require('./utils/connectionMySQL');
const MongoDB = require('./utils/connectionMongoDB');
const paginate = require('./utils/paginateArray');
const convertObj = require('./utils/convertObj');
const nodeLogger = require('./utils/nodeLogger');

class EtlService {

  constructor () {};

  getJSON(_req, res) {
    const proQuery = new Promise((resolve, _reject) => {
      const sql = `SELECT *
      FROM autor_artigo
      JOIN artigo ON artigo.id = autor_artigo.artigo_id
      JOIN autor ON autor.id = autor_artigo.autor_id
      JOIN revisao ON revisao.artigo_id = artigo.id`;
      conMySQL.query(sql, async function(err, rows, _fields) {
        if (err) throw err;
        const result = [];
        rows.forEach(row => {
          const obj = {
            autor: {
              ...convertObj.convertAutor(row),
              artigos: [
                {
                  ...convertObj.convertArtigo(row),
                  revisao: convertObj.convertRevisao(row)
                }
              ]
            }
          }
          result.push(obj);
        });
        resolve(result);
      });
    });

    proQuery.then(async (value) => {
      const totalPages = paginate(value, 1, 10000).totalPages;
      let loteProcess = 0;
      let lotesInseridos = 0;
      try {
        await MongoDB.connect();
        for (let index = 1; index <= totalPages; index++) {
          loteProcess = index;
          const result = paginate(value, index, 10000);
          const res = await MongoDB.insertAll(result.data);
          if (res === 'err') throw 'erro ao inserir lote';
          nodeLogger.info(`Lote ${loteProcess} INSERIDO`);
          lotesInseridos = index;
        }
      } catch (err) {
        nodeLogger.info(`Lote ${loteProcess} FALHOU, erro: ${err}`);
      } finally {
        return res
        .send({
          lotes: totalPages,
          lotesInseridos,
        });
      }
    })
  };
}

module.exports = new EtlService();