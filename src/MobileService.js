const con = require('./utils/connectionMySQL');
const paginate = require('./utils/paginateArray');
const convertObj = require('./utils/convertObj');

class MobileService {

  constructor () {};

  getJSON (req, res) {
    const pagesGet = req.params;

    const proQuery = new Promise((resolve, _reject) => {
      const sql = `SELECT *
      FROM autor_artigo
      JOIN artigo ON artigo.id = autor_artigo.artigo_id
      JOIN autor ON autor.id = autor_artigo.autor_id
      JOIN revisao ON revisao.artigo_id = artigo.id`;
      con.query(sql, async function(err, rows, _fields) {
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

    proQuery.then((value) => {
      const paginateReturn = paginate(value, pagesGet.page);
      return res
      .send({
        autores: paginateReturn
      })
    })

  };
}

module.exports = new MobileService();