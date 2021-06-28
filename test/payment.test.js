const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Product = require('../models/Product')


// Assertion style ... should
chai.should()
chai.use(chaiHttp)

describe('Product API', () => {
    /**
     * Test the GET Route
     */
    describe('GET /product', () => {
        it('It should get all the products from productsdb', (done) => {
            chai.request(app)
                .get('/product')
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('array')
                   // response.body.length.should.be.eq(3)
                done();
                })
        })
    })
})