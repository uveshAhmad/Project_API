const expres = require("express")
const router = expres.Router()

const {homePage , register , login   } = require("../../controllers/views/controller")

router.get('/' , homePage)
router.get('/register' , register)
router.get('/login' , login)
 

module.exports = router
