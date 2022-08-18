const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');






router.get('/contratos/contratos', async (req, res) => {
    usuario = req.user
    const query = `select NoContrato, anio, objeto, valorInicial, valoradiciones, valorFinal,
    fechaInicio, fechaFirma, fechaFin, creadoEn, modificadoEn, nombrecont,
    contratista.cedulaNIT, tipo, nombreest, nombresub, username from contrato
    
    inner join contratistacontrato on idcontrato = contrato_idcontrato
    inner join contratista on idcontratista = contratista_idcontratista
    inner join estados on estados_idestados = idestados
    inner join subcuenta on subcuenta_idsubcuenta = idsubcuenta
    inner join usuarios on modificadoPor = idusuarios
    limit 10`

    const subcuenta = `SELECT idsubcuenta, nombresub from subcuenta ORDER BY nombresub`
    const contratista = `SELECT * from contratista ORDER BY nombrecont`
    const entidad = `SELECT * from entidadsolicitante ORDER BY nombreent`


    const contratistas = await pool.query(contratista);
    const subcuentas = await pool.query(subcuenta);
    const entidads = await pool.query(entidad);
    const registros = await pool.query(query);

    
    
    registros.forEach(element => {
        element.valorInicial = element.valorInicial.toLocaleString('es-CO', {style: 'currency', currency: 'COP'});
        element.valoradiciones = element.valoradiciones.toLocaleString('es-CO', {style: 'currency', currency: 'COP'});
        element.valorFinal = element.valorFinal.toLocaleString('es-CO', {style: 'currency', currency: 'COP'});        
        element.fechaInicio = new Date(element.fechaInicio).toLocaleDateString('es-ES', {year: 'numeric', month: 'short', day: '2-digit'})
        element.fechaFirma = new Date(element.fechaFirma).toLocaleDateString('es-ES', {year: 'numeric', month: 'short', day: '2-digit'})
        element.fechaFin = new Date(element.fechaFin).toLocaleDateString('es-ES', {year: 'numeric', month: 'short', day: '2-digit'})        
    });   

    console.log('---registros: ',registros[0])
    res.render('links/contratos/contratos', { registros, usuario, subcuentas, contratistas, entidads });
});



router.get('/contratistas/contratistas', async (req, res) => {
    usuario = req.user
    const registros = await pool.query('SELECT * FROM contratista');

    console.log('--contratistas: ', registros)
    res.render('links/contratistas/contratistas', { registros, usuario });
});

router.get('/entidades/entidades', async (req, res) => {
    usuario = req.user
    const registros = await pool.query('SELECT * FROM entidadsolicitante');

    console.log('--entidades: ', registros)
    res.render('links/entidades/entidades', { registros, usuario });
});

router.get('/subcuentas/subcuentas', async (req, res) => {
    usuario = req.user
    const registros = await pool.query('SELECT * FROM subcuenta');

    console.log('--subcuentas: ', registros)
    res.render('links/subcuentas/subcuentas', { registros, usuario });
});

router.get('/estados/estados', async (req, res) => {
    usuario = req.user
    const registros = await pool.query('SELECT * FROM estados');

    console.log('--estados: ', registros)
    res.render('links/estados/estados', { registros, usuario });
});

router.get('/usuarios/usuarios', async (req, res) => {
    usuario = req.user
    const registros = await pool.query('SELECT * FROM usuarios');

    console.log('--usuarios: ', registros)
    res.render('links/usuarios/usuarios', { registros, usuario });
});

router.get('/add', async (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});



router.get('/', isLoggedIn, async (req, res) => {
    console.log('req.user: ', req.user)

    if(req.user.roles_idrol = 1){
        permisos = [
            {title: 'lectura',url: 'links/list'},
            {title: 'Generar reportes',url: 'links/reportes'},
            {title: 'Agregar Contrato',url: 'links/add'},
            {title: 'Modificar contrato',url: 'links/edit'},
            {title: 'Eliminar registro',url: 'links/delete'}
            ]
    }else if(req.user.roles_idrol = 2){
        permisos = [
            {title: 'lectura',url: 'links/list'},
            {title: 'Generar reportes',url: 'links/reportes'},
            {title: 'Agregar Contrato',url: 'links/add'}            
            ]
    }else if(req.user.roles_idrol = 3){
        permisos = [
            {title: 'lectura',url: 'links/list'},            
            {title: 'Modificar contrato',url: 'links/edit'},
            {title: 'Eliminar registro',url: 'links/delete'}
            ]
    }else if(req.user.roles_idrol = 4){
        permisos = [
            {title: 'lectura',url: 'links/list'},
            {title: 'Generar reportes',url: 'links/reportes'}            
            ]
    }else{
        permisos = [
            {title: 'lectura',url: 'links/list'}            
            ]
    }
    console.log('permisos: ',permisos)
    const registros = await pool.query('SELECT * FROM contrato');

    res.render('links/list', { registros,permisos });
});




router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

module.exports = router;