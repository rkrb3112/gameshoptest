const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const game = require('../models/game');

const {checkAdmin, checkLoggedIn} = require('../middlewares/index');


router.get('/games/:id/questions', checkLoggedIn, checkAdmin, async (req, res)=>{
    try {
        const game = await Game.findById(req.params.id);
        // const questions = game.questions;
        res.render('questions/index', {game});
    } catch (error) {
        req.flash('error', 'Something went wrong while displaying questions of the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});
router.get('/games/:id/questions/new', checkLoggedIn, checkAdmin, (req, res)=>{
    res.render('questions/new', {id: req.params.id});
});
router.post('/games/:id/questions', checkLoggedIn, checkAdmin, async (req, res)=>{
    try {
        const newQuestion = {
            title: req.body.title,
            answer: req.body.answer
        };
        const game = await Game.findById(req.params.id);
        game.questions.push(newQuestion);
        await game.save();
        req.flash('success', 'successfully created a new question');
        res.redirect(`/games/${req.params.id}/questions`);
    } catch (error) {
        req.flash('error', 'Something went wrong while displaying questions of the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});
router.get('/games/:id/questions/:idx/edit', checkLoggedIn, checkAdmin, async (req, res)=>{
    try {
        const game = await Game.findById(req.params.id);
        if(req.params.idx >= game.questions.length){
            req.flash('error', 'invalid access to index');
            res.redirect(`/games/${req.params/id}/questions`);
        };
        const question = game.questions(req.params.idx);
        res.render('questions/edit', {question, id: game._id, idx: req.params.idx});
    } catch (error) {
        req.flash('error', 'Something went wrong while editing questions of the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});
router.patch('/games/:id/questions/:idx', checkLoggedIn, checkAdmin, async (req, res)=>{
    try {
        const game = await Game.findById(req.params.id);
        if(req.params.idx >= game.questions.length){
            req.flash('error', 'invalid access to index');
            res.redirect(`/games/${req.params/id}/questions`);
        };
        const updatedQuestion = {
            title: req.body.title,
            answer: req.body.answer
        };
        game.questions[req.params.idx] = updatedQuestion;
        await game.save();
        req.flash('success', 'Updated the question');
        res.redirect(`/games/${req.params.id}/questions`);
    } catch (error) {
        req.flash('error', 'Something went wrong while updating questions of the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});
router.delete('/games/:id/questions/:idx', checkLoggedIn, checkAdmin, async (req, res)=>{
    try {
        const game = await Game.findById(req.params.id);
        if(req.params.idx >= game.questions.length){
            req.flash('error', 'invalid access to index');
            res.redirect(`/games/${req.params/id}/questions`);
        };
        
        game.questions.splice(req.params.idx, 1);
        await game.save();
        req.flash('success', 'Deleted the question');
        res.redirect(`/games/${req.params.id}/questions`);
    } catch (error) {
        req.flash('error', 'Something went wrong while deleting questions of the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});


module.exports = router