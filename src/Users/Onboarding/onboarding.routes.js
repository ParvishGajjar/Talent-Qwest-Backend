/* eslint-disable no-undef */
import { signup, login, getUsers} from './onboarding.functions.js'
import express from 'express'
import { isAuthenticated } from '../../auth/authentication.js'
var router=express.Router()

router.post('/signup',signup)

router.post('/login',login)

router.get('/getusers', isAuthenticated, getUsers)

module.exports = router;