const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

//disparar constructor de la clase
const ticketControl = new TicketControl();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        callback(siguiente);
        console.log(siguiente);
    });

    //emitir un evento 'estadoActual'
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });




    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            })
        }

        //emitir a todo el mundo los ultimos 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });

        let atenderTiclet = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTiclet);


        //actualizar / notificar cambios en los ultimos 4
    })

});