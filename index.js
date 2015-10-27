'use strict';

const stream = require('stream');

var pressure,
    sink,
    source;

class Source extends stream.Readable {
    constructor () {
        super({objectMode: true, highWaterMark: 4});
        this._iterator = this.stuffGenerator();
    }

    _read () {
        var next = this._iterator.next();
        console.log('Generating.');
        this.push(next.value || null);
    }

    *stuffGenerator () {
        for (let i = 1; i <= 20; i++) {
            yield { idx: i };
        }
    }
}
source = new Source();

class Pressure extends stream.Transform {
    constructor () {
        super({objectMode: true, highWaterMark: 3});
    }

    _transform (data, _, next) {
        console.log('Transform requested.', data);
        setTimeout(() => {
            console.log('Transform performed.');
            next(null, data);
        }, 1000);
    }
}
pressure = new Pressure();

class Sink extends stream.Writable {
    constructor () {
        super({objectMode: true});
    }

    _write (data, _, next) {
        console.log('Sunk data.', data);
        next();
    }
}
sink = new Sink();


source
.pipe(pressure)
.pipe(sink);
