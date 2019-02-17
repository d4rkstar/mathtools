export {};

import * as express from 'express'
import * as path from 'path';
import * as bodyparser from 'body-parser';

import {logger, weblogger} from './lib/Logger'
import Mcd from './lib/Mcd'

class App {
    public express;

    constructor() {

        logger.info('Starting App');

        this.express = express();

        this.express.use(weblogger);
        this.express.use(bodyparser.urlencoded({
            extended: true
        }));

        this.express.set("views", "./views");
        this.express.set('view engine', 'pug');

        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();

        router.get('/',(req,res)=>{
            res.render('index');
        });

        router.get('/ping', (req,res)=>{
            let result = {message: 'Pong'};
            res.json(result);
        });

        router.get('/numeri-primi', (req,res)=>{
            res.render('numeri-primi');
        });

        router.post('/numeri-primi/verifica', (req,res)=>{

            let numero = req.body.numero;

            if (numero.trim()=='') {
                res.render('numeri-primi',{
                    error: 'Inserire dei dati di ingresso'
                });
                return;
            }

            let mcd = new Mcd();
            let risultato = '';
            if (mcd.verificaNumeroPrimo(numero )) {
                risultato = numero + ' è numero primo';
            } else {
                let divisibile = mcd.calcola(numero);
                risultato = numero + ' è divisibile per ' + divisibile;
            }

            res.render('numeri-primi-risultato', {
                risultato: risultato
            });
        });

        router.get('/mcd', (req,res)=>{
            res.render('mcd');
        });

        router.post('/mcd/calcolo', (req,res)=> {

            let numeri = req.body.numeri;

            if (numeri.trim()=='') {
                res.render('mcd',{
                    error: 'Inserire dei dati di ingresso'
                });
                return;
            }

            numeri = numeri.split(',').filter((n) => {
                return parseInt(n.trim());
            });

            if (numeri.length==1) {
                res.render('mcd',{
                    error: 'Inserire almeno due numeri'
                });
                return;
            }

            let mcd = new Mcd();
            let risultato = mcd.mcd(numeri);


            res.render('mcd-risultato', {
                risultato: risultato
            });
        });



        this.express.use('/', router)
    }
}

export default new App().express
