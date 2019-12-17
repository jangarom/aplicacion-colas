const fs = require('fs');


class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {

    constructor() {

        //ultimo ticket que hemos dado
        this.ultimo = 0;
        //dia que estamos hoy
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        let data = require('../data/data.json');

        //si es el mismo dia
        if (data.hoy === this.hoy) {
            //continuar con los tickets que ya existian
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else  { //reiniciar todo
            this.reiniciarConteo();
        }
    }

    siguiente() {
        //incrementar en 1 el ultimo ticket
        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);

        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];
        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    };

    getUltimos4() {
        console.log('ultimos4');
        return this.ultimos4;
    };


    atenderTicket(escritorio) {
        if (this.tickets.length == 0) {
            return 'No hay tickets';
        }

        //obtener numero del primer ticket pendiente
        let numeroTicket = this.tickets[0].numero;

        //eliminar imediatamente el primer ticket del array
        this.tickets.shift();

        //crear nuevo ticket con el numero y el escritorio que será atendido
        let atenderTicket = new Ticket(numeroTicket, escritorio);

        //agregar al inicio del arreglo
        this.ultimos4.unshift(atenderTicket);

        //verificar que solo hay 4 tickets a la vez
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); //borra el ultimo elemento
        }

        // console.log('Ultimos 4');
        // console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;
    }
}

module.exports = {
    TicketControl
}