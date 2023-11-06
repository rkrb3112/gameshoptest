const express = require('express');
const router = express.Router();


// ! Middlewares
const {checkAdmin, checkLoggedIn} = require('../middlewares/index');
const gameControllers = require('../controllers/games');
const game = require('../models/game');

// ! Index route
router.get('/games', gameControllers.gameIndex);

// ! new route
router.get('/games/new', checkLoggedIn, checkAdmin, gameControllers.gameNewForm);

// ! create route 
router.post('/games', checkLoggedIn, checkAdmin, gameControllers.gameCreate);

// ! show route
router.get('/games/:id', gameControllers.gameShow);

// ! edit route
router.get('/games/:id/edit', checkLoggedIn, checkAdmin, gameControllers.gameEditForm);

// ! update route
router.patch('/games/:id', checkLoggedIn, checkAdmin, gameControllers.gameUpdate);

// ! delete route
router.delete('/games/:id', checkLoggedIn, checkAdmin , gameControllers.gameDelete);

// ! changing game status
router.get('/games/:id/status', checkLoggedIn, checkAdmin, gameControllers.changeGameStatus);

// ! wishlist a game
router.get('/games/:id/add/:userId', checkLoggedIn, gameControllers.gameWishlist);

// ! Mature or not
router.get('/games/:id/test', async (req, res)=>{
    try {
        const game = await Game.findById(req.params.id);
        res.render('game/test', {game});
    } catch (error) {
        req.flash('error', 'Something went wrong while displaying eligibility');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
});
router.post('/games/:id/test');


module.exports = router;