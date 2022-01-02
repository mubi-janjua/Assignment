const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const session = require('express-session')
const { render } = require('express/lib/response')

const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        console.log('sucess')
        await user.save()
        // for view
        res.render('../public/login')
        // for postman 
        // res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        let remember_with = '5d';
        let remember_without= '25s'
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const expire = req.body.remember_me === true ? remember_with : remember_without;
        const token = await user.generateAuthToken(expire)
        req.session.isAuth = true;
        console.log({ user, token })
        //for view
        res.render('../public/home')
        // for postman
        // res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/logout', async (req, res) => {
    try {
       req.session.destroy()
        res.render('../public/login')
    } catch (e) {
        res.status(500).send()
    }
})

router.get("/login", function (req, res) {
    res.render('../public/login', {
    title: 'Login',
    email: '',
    password: ''     
    })
});

router.get("/home", isAuth, function (req, res) {
    res.render("../public/home");
});

router.get("/register", function (req, res) {
    res.render('../public/register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: ''    
    })
});        

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

module.exports = router