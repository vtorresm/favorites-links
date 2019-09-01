const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Probando App')
})

module.exports = router