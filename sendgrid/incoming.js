class Script {
    process_incoming_request({request}) {
        console.log(request);
        const boundary = this.getBoundary(request.headers['content-type']);
        const parts = this.parse(this.bufferFromString(request.content_raw.replace(/\r?<br>/g, "\n")), boundary);
        /*console.log('-->>--');
        console.log(boundary);
        console.log('--!!--');
        console.log('from:', parts.from, this.bufferToString(parts.from));
        console.log('--!!--');
        console.log('text:', this.bufferToString(parts.text));
        console.log('--!!--');
        console.log('parts:', parts);
        //console.log(request.content_raw.replace(/\r?\n|\r/g, "\\n"));
        console.log('--<<--');*/
        return {
            content: {
                text: this.bufferToString(parts.from),
                "attachments": [{
                    "title": this.bufferToString(parts.from),
                    "text": this.bufferToString(parts.text),
                    "collapsed": true
                }]
            }
        }
    }

    getBoundary(header) {
        var items = header.split(';');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = new String(items[i]).trim();
                if (item.indexOf('boundary') >= 0) {
                    var k = item.split('=');
                    return new String(k[1]).trim().replace(/^["']|["']$/g, "");
                }
            }
        }
        return '';
    }

    parse(multipartBodyBuffer, boundary) {
        var lastline = '';
        var header = '';
        var info = '';
        var state = 0;
        var buffer = [];
        var allParts = {};
        for (var i = 0; i < multipartBodyBuffer.length; i++) {
            var oneByte = multipartBodyBuffer[i];
            var prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
            var newLineDetected = oneByte === 0x0a && prevByte === 0x0d ? true : false;
            var newLineChar = oneByte === 0x0a || oneByte === 0x0d ? true : false;
            if (!newLineChar)
                lastline += String.fromCharCode(oneByte);
            if (0 === state && newLineDetected) {
                if ('--' + boundary === lastline) {
                    state = 1;
                }
                lastline = '';
            } else if (1 === state && newLineDetected) {
                header = lastline;
                state = 2;
                if (header.indexOf('filename') === -1) {
                    state = 3;
                }
                lastline = '';
            } else if (2 === state && newLineDetected) {
                info = lastline;
                state = 3;
                lastline = '';
            } else if (3 === state && newLineDetected) {
                state = 4;
                buffer = [];
                lastline = '';
            } else if (4 === state) {
                if (lastline.length > boundary.length + 4)
                    lastline = ''; // mem save
                if ('--' + boundary === lastline) {
                    var j = buffer.length - lastline.length;
                    var part = buffer.slice(0, j - 1);
                    var p = {
                        header: header,
                        info: info,
                        part: part
                    };
                    var partObj = this.process(p);
                    allParts[partObj.name] = partObj.data;
                    buffer = [];
                    lastline = '';
                    state = 5;
                    header = '';
                    info = '';
                } else {
                    buffer.push(oneByte);
                }
                if (newLineDetected)
                    lastline = '';
            } else if (5 === state) {
                if (newLineDetected)
                    state = 1;
            }
        }
        return allParts;
    }

    process(part) {
        // will transform this object:
        // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
        // info: 'Content-Type: text/plain',
        // part: 'AAAABBBB' }
        // into this one:
        // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
        var obj = function(str) {
            var k = str.split('=');
            var a = k[0].trim();
            var b = JSON.parse(k[1].trim());
            var o = {};
            Object.defineProperty(o, a, {
                value: b,
                writable: true,
                enumerable: true,
                configurable: true
            });
            return o;
        };
        var header = part.header.split(';');
        var filenameData = header[2];
        var input = {};
        if (filenameData) {
            input = obj(filenameData);
            var contentType = part.info.split(':')[1].trim();
            Object.defineProperty(input, 'type', {
                value: contentType,
                writable: true,
                enumerable: true,
                configurable: true
            });
        } else {
            Object.defineProperty(input, 'name', {
                value: header[1].split('=')[1].replace(/"/g, ''),
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        Object.defineProperty(input, 'data', {
            value: Uint8Array.from(part.part),
            writable: true,
            enumerable: true,
            configurable: true
        });
        return input;
    }

    bufferFromString(s) {
        return Uint8Array.from(s, x => x.charCodeAt(0))
    }

    bufferToString(b) {
        return String.fromCharCode.apply(null, b);
    };
}