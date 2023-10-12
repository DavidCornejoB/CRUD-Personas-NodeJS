import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM persona");
        res.render('personas/list', {personas: result});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/add', (req, res) => {
    try {
        res.render('personas/add');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/add', async (req, res) => {
    try {
        const {name, lastname, age} = req.body;
        const newPersona = {
            name, lastname, age
        }
        await pool.query("INSERT INTO persona SET ?", [newPersona]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/edit/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const [persona] = await pool.query("SELECT * FROM persona WHERE id = ?", [id]);
        const personaEdit = persona[0];
        res.render('personas/edit', {persona: personaEdit});
    } catch (error) {
        res.status(500).json({message: error.message});

    }
});

router.post('/edit/:id', async(req, res) => {
    try {
        const {name, lastname, age} = req.body;
        const {id} = req.params;
        const editPersona = {name, lastname, age};
        await pool.query("UPDATE persona SET ? WHERE id = ?", [editPersona, id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});

    }
});

router.get('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM persona WHERE id = ?", [id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

export default router;