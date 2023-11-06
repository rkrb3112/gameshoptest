const Game = require('../models/game');
const User = require('../models/user');
const Notification = require('../models/notification');


module.exports.gameIndex = async (req, res)=>{
    try {
        let pageNo = 1;
        if(req.query.page) pageNo = req.query.pageNo;
        const options = {
            page: pageNo,
            limit: 10
        };
        const allGames = await Game.paginate({}, options);
        res.render('games/index', {allGames});
    } catch (error) {
        req.flash('error', 'there is something wrong');
        console.log(error);
        res.redirect('/');
    }
};

module.exports.gameNewForm =  (req, res)=>{
    res.render('games/new');
};

module.exports.gameCreate = async (req, res)=>{
    try {
        const newGame = new Game({
            gameName: req.body.gameName ,
            studioName: req.body.studioName,
            genre: req.body.genre,
            description: req.body.description,
            cost: req.body.cost
        });
        await newGame.save();
        const newNotif = new Notification({
            title: `New ${newGame.gameName} coming`,
            body: `New game from ${newGame.studioName}`,
            author: newGame.studioName
        });
        await newNotif.save();
        req.flash('success', 'Successfully posted new game');
        res.redirect('/games');
    } catch (error) {
        req.flash('error', 'Something went wrong when creating a new game, please try again');
        res.redirect('/games');
    }
};

module.exports.gameShow = async (req, res)=>{
    try {
        const foundGame = await Game.findById(req.params.id).populate('customers');
        res.render('games/show', {foundGame});
    } catch (error) {
        req.flash('error', 'there is something wrong');
        res.redirect('/games');
    }
};

module.exports.gameEditForm = async (req, res)=>{
    try {
        const foundGame = await Game.findById(req.params.id);
        res.render('games/edit', {foundGame});
    } catch (error) {
        req.flash('error', 'Something went wrong while fetching the game, please try again');
        res.redirect('/games');
    }
};

module.exports.gameUpdate = async (req, res)=>{
    try {
        const gameData = {
            gameName: req.body.gameName,
            studioName: req.body.studioName,
            genre: req.body.genre,
            description: req.body.description,
            cost: req.body.cost
        };
        await Game.findByIdAndUpdate(req.params.id, gameData);
        const newNotif = new Notification({
            title: `${gameData.gameName} updated`,
            body: `game updated from ${gameData.studioName}`,
            author: gameData.studioName
        });
        await newNotif.save();
        req.flash('success', 'updated successfully');
        res.redirect('/games');
    } catch (error) {
        req.flash('error', 'Something went wrong while updating game, please try again');
        res.redirect('/games');
    }
};

module.exports.gameDelete = async (req, res)=>{
    try {
        const gameData = await Game.findById(req.params.id);
        await Game.findByIdAndDelete(req.params.id);
        const newNotif = new Notification({
            title: `${gameData.gameName} deleted`,
            body: `Game from ${gameData.studioName} deleted`,
            author: gameData.studioName
        });
        await newNotif.save();
        req.flash('success', 'Successfully deleted the game');
        res.redirect('/games');
    } catch (error) {
        req.flash('error', 'Something went wrong while deleting game, please try again');
        res.redirect('/games')
    }
};

module.exports.changeGameStatus = async (req, res)=>{
    try {
        const {type} = req.query, {id} = req.params;
        if(!['in stock', 'out of stock'].includes(type)) type = 'out of stock';
        if(!type) return res.redirect(`/games/${id}`);
        await Game.findByIdAndUpdate(id, {status: type});
        req.flash('success', 'status is successfully changed');
        res.redirect(`/games/${id}`);     
    } catch (error) {
        req.flash('error', 'Something went wrong while changing status of a job');
        res.redirect('/games');
    }
};

module.exports.gameWishlist = async (req, res)=>{
    try {
        const {id, userId} = req.params;
        const game = await Game.findById(id);
        const user = await User.findById(userId);
        for(let ids of game.customers){
            if(ids.equals(user._id)){
                req.flash('error', 'You already bought');
                res.redirect(`/jobs/${id}`);
            }
        }
        game.customers.push(user);
        await game.save();
        req.flash('success', 'Successfully wishlisted this game');
        res.redirect(`/games/${id}`);
    } catch (error) {
        req.flash('error', 'Something went wrong while adding the game');
        console.log(error);
        res.redirect(`/games/${req.params.id}`);
    }
};

 