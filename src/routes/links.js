const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');




router.get('/contratos', (req, res) => {
    res.render('links/contratos');
});

router.get('/contratistas', (req, res) => {
    res.render('links/contratistas');
});

router.get('/entidades', (req, res) => {
    res.render('links/entidades');
});

router.get('/subcuentas', (req, res) => {
    res.render('links/subcuentas');
});

router.get('/estados', (req, res) => {
    res.render('links/estados');
});

router.get('/add', (req, res) => {
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