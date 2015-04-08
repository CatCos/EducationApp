/*global module, require */
var views = require('./API/views.js');

module.exports = function(app)
{
    /**
     * Returns the first page of the web site
     */
    app.get("/", function(req, res)
    {

        var db = req.db;
        var dados = db.get("dados");

        var rows = [];

        dados.find(
        {},
        {
            sort:
            {
                ano: 1,
                disciplina: 1
            }
        }, function(e, docs)
        {
            rows = docs;
            var total_creditos = 0;
            var media_total = 0;

            for (var i = 0; i < rows.length; i++)
            {
                var row = rows[i];

                total_creditos += parseFloat(row.creditos);
                var media = 0;

                media = parseFloat(row.creditos) * parseFloat(row.nota);

                media_total += media;
            }

            var media_final = media_total / total_creditos.toFixed(1);
            var html = views.view_index(
            {
                'rows': rows,
                'creditos': total_creditos,
                'media': media_final.toFixed(2)
            });

            res.status(200).send(html);

        });
    });

    app.post("/insert", function(req, res)
    {

        var db = req.db;
        var dados = db.get("dados");

        dados.insert(
        {
            'disciplina': req.body.disciplina,
            'creditos': req.body.creditos,
            'nota': req.body.nota,
            'ano': req.body.ano,
            'codigo': req.body.codigo
        });

        res.redirect("/");

    });


    app.get("/remove", function(req, res)
    {
        var query = req.query;
        var codigo = query.s;

        var db = req.db;
        var dados = db.get("dados");

        dados.remove(
        {
            'codigo':
            {
                $eq: codigo
            }
        });

        res.redirect("/");

    });

    app.post("/update", function(req, res)
    {
        var query = req.query;
        var codigo = query.s;

        var db = req.db;
        var dados = db.get("dados");

        dados.update(
            {
                codigo: codigo
            },
            {
                disciplina: req.body.disciplina,
                creditos: req.body.creditos,
                nota: req.body.nota,
                ano: req.body.ano,
                codigo: req.body.codigo

            },
            function(err, result)
            {

                if (err) console.log("erro:" + err);
                console.log("resultado" + result);
            }
        );

        res.redirect("/");

    });

};
