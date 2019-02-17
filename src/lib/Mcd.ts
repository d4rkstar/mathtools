import * as _ from 'underscore';

class Mcd {

    constructor() {

    }

    public verificaNumeroPrimo(n) {
        if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false;
        var m = Math.sqrt(n);
        for (var i=2;i<=m;i++) if (n%i==0) return false;
        return true;
    }

    public *generatoreNumeriPrimi() {
        var count = 0;
        while(1) {
            if(this.verificaNumeroPrimo(count)) yield count;
            count++;
        }
    }

    public calcola(n1 : number) : number {
        let continua = true;
        if (this.verificaNumeroPrimo(n1)) {
            return;
        }
        // Inizializziamo il generatore di numeri primi
        let generatore = this.generatoreNumeriPrimi();
        let numeroPrimo = 0;
        // Andiamo a cercare la divisibilità del numero n1 con
        // un numero primo
        do {
            // Ci salviamo il numero primo
            numeroPrimo = generatore.next().value;
            // Calcoliamo il resto della divisione di n1 con il numero primo a disposizione
            let resto = (n1 % numeroPrimo);
            // Stabiliamo se dobbiamo continuare a cercare
            continua = resto > 0;
            let risultato = (n1/numeroPrimo);
            // console.log(n1 + '/' + numeroPrimo + '= ' + risultato +  ' - resto = ' + resto);
        } while(continua);
        return numeroPrimo;
    }

    public mcd(numbers : number[]) : any {
        // In questa variabile salveremo gli insiemi (array) con i risultati
        let results = {};
        // In questa variabile salveremo il valore dei numeri primi identificati
        // nella ricerca della divisibilità dei numeri in ingresso.
        let numeriPrimi = [];
        // Cerchiamo la divisibilità per ciascun numero passato alla funzione
        // in args abbiamo i vari numeri passati alla funzione.
        for (let i=0; i<numbers.length; i++) {

            // Qui mettiamo di volta in volta il numero su cui faremo l'elaborazione
            let numeroPartenza = numbers[i];
            console.log('Divisibilita del numero: ' + numeroPartenza);

            // Questa variabile cambierà di stato quando arriveremo alla divisibilità
            // per 1
            let isPrimo = false;

            // Ci salviamo il numero di partenza come numero di riferimento
            let numeroRiferimento = numeroPartenza;

            /*if (this.verificaNumeroPrimo(numeroRiferimento)) {
                numeriPrimi.push(numeroRiferimento);
                continue;
            }*/

            // Qui salveremo i risultati della ricerca della divisibilità
            let divisori = [];
            do {
                // continua servirà a determinare quando continuare la divisione
                let cont = true;
                // inizializziamo il generatore di numeri primi
                let generatore=this.generatoreNumeriPrimi();
                do {
                    // Recupera il prossimo numero
                    let nPrimo = generatore.next().value;
                    let div = numeroRiferimento / nPrimo;

                    // Se il resto della divisione tra il numero di riferimento ed il
                    // numero primo da zero, abbiamo trovato la divisibilità..
                    if ((numeroRiferimento % nPrimo) === 0) {
                        divisori.push(nPrimo);

                        // Memorizziamo il numero primo tra i numeri "comuni"
                        // se non l'abbiamo già fatto prima
                        if (numeriPrimi.indexOf(nPrimo)===-1) {
                            if ((numeroRiferimento===numeroPartenza) && this.verificaNumeroPrimo(numeroPartenza)) {
                                console.log('Non aggiungo ' + numeroRiferimento + ' ai numeri primi');
                            } else {
                                numeriPrimi.push(nPrimo);
                            }
                        }

                        console.log(numeroRiferimento + ' / ' + nPrimo + ' = ' + div);
                        numeroRiferimento = div;
                        cont = false;

                        if (div===1) {
                            isPrimo=true;
                        }
                    }
                } while(cont);
            } while(!isPrimo);
            results[numeroPartenza] = divisori;
        }

        console.log(JSON.stringify(numeriPrimi));
        console.log(JSON.stringify(results));

        // Ordiniamo i numeri comuni in modo crescente
        numeriPrimi = numeriPrimi.sort();

        // Prendi i risultati per ciascun numero in ingresso
        for (let i=0; i<Object.keys(results).length; i++) {
            // In elements avremo l'elenco dei divisori trovati per ogni numero in ingresso
            let elements = results[Object.keys(results)[i]];

            // Per ciascun numero dell'elenco dei divisori
            for(let j=0; j<elements.length;j++) {
                // Per ciascun numero primo trovato
                for(let k=0; k<numeriPrimi.length; k++) {
                    let np = numeriPrimi[k];
                    // se il numero primo non è presente tra i divisori...
                    if (elements.indexOf(np)==-1) {
                        // rimuovilo
                        numeriPrimi.splice(k,1);
                    }
                }
            }
        }

        let mappaRisultati = {};

        // Pulizia dei risultati
        // Prendi i risultati per ciascun numero in ingresso
        for (let i=0; i<Object.keys(results).length; i++) {
            // In elements avremo l'elenco dei divisori trovati per ogni numero in ingresso
            let elements = results[Object.keys(results)[i]];

            elements = elements.filter(this.controllaInsiemi.bind(this, numeriPrimi));
            elements = elements.sort();

            results[Object.keys(results)[i]] = elements;
            // es. {"2":5,"3":1}
            let risultatiProvvisori = _.countBy(elements);
            for (let j=0; j<Object.keys(risultatiProvvisori).length; j++) {
                let chiave = Object.keys(risultatiProvvisori)[j];
                let valore = risultatiProvvisori[chiave];

                if (Object.keys(mappaRisultati).indexOf(chiave)==-1) {
                    mappaRisultati[chiave] = valore;
                } else {
                    if (valore < mappaRisultati[chiave]) {
                        mappaRisultati[chiave]=valore
                    }
                }
            }
        }

        console.log(JSON.stringify(results));
        console.log(JSON.stringify(mappaRisultati));

        let valoreMcd = 0;
        let valoriFinali = [];
        let stringaValoriFinali = [];
        for(let i=0; i<Object.keys(mappaRisultati).length; i++) {
            let chiave = parseInt(Object.keys(mappaRisultati)[i]);
            let valore = parseInt(mappaRisultati[chiave]);
            valoriFinali.push( chiave**valore);
            if (valore==1) {
                stringaValoriFinali.push(chiave);
            } else {
                stringaValoriFinali.push(chiave+'^'+valore);
            }
        }

        for(let i=0; i<valoriFinali.length; i++) {
            if (valoreMcd==0) {
                valoreMcd=valoriFinali[i];
            } else {
                valoreMcd = valoreMcd * valoriFinali[i];
            }
        }

        let elaborato = valoreMcd>0;
        if (valoreMcd===0) valoreMcd = undefined;

        return  {
            elaborato: elaborato,
            numeriPartenza: numbers,
            risultati: mappaRisultati,
            valoriFinali: valoriFinali,
            stringaFinale: stringaValoriFinali.join(' * '),
            mcd: valoreMcd
        };
    }


    /***
     * Questa funzione consente di filtrare un insieme di elementi
     * a fronte di un altro passato in ingresso
     * (element viene verificato a fronte di insiemeDiVerifica)
     *
     * @param numeriPrimi elenco dei numeri primi
     * @param element
     */
    public controllaInsiemi(insiemeDiVerifica, element) : boolean {
        return insiemeDiVerifica.indexOf(element) > -1;
    }
}

export default Mcd;