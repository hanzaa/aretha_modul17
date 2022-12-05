const express = require('express')
const db = require('../db.config/db.config')
const jwt = require('jsonwebtoken');
// const Auth = require('./auth')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bcrypt = require('bcryptjs');
SECRET = process.env.SECRET


const register = async(req, res, next) => {
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const { username, email, password}= req.body
    const hash = await bcrypt.hash(password,10)
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try {
        db.query(`INSERT INTO unhan_modul_17 VALUES (DEFAULT, $1, $2, $3)`, [username, email, hash])
        res.send(`input succeded`)
    }
    catch(err) {
            console.log(err.message)
            return res.status(500).send(`input failed`)
        }
    }



const login = async(req, res, next) => {
    const {email, password}= req.body
   
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    try {
        const user = await db.query(`SELECT * FROM unhan_modul_17 WHERE email=$1`, [email])
        if(user){
            const validPass = await bcrypt.compare(password,user.rows[0].password)
            if (validPass) {
                res.send('login succeded')
            } else {
                res.send('login failed')
            }
        }
        // 10. Generate token menggunakan jwt sign
    
        const token = jwt.sign(user.rows[0],SECRET)
        console.log(token)

        //11. kembalikan nilai id, email, dan username
        res.cookie("token", token).send(user.rows[0])
    }
    catch (err) {
        return res.send('login failed')
    }
    

    
}

const logout = async(req, res, next) => {
                
    try {
        return res.clearCookie('token').send('logout succeded')
        // 14. code untuk menghilangkan token dari cookies dan mengembalikan pesan "sudah keluar dari aplikasi"  
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}

const verify = async(req, res, next) => {
    try {
        // 13. membuat verify
        data = req.verified
        return register.status(200).send(data)
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }
}

module.exports = {
    register,
    login,
    logout,
    verify
}