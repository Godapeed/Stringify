
<<<<<<< HEAD
function serialize(obj) {
    const visited = new WeakSet();

    return serializeProcess(obj);



    function serializeProcess(obj){
        if (visited.has(obj)) {
            console.log("Обнаружен цыкл")
            return;
        }
        if (typeof obj === "object")
            visited.add(obj);

        if (typeof obj !== undefined && obj !== null) {
            switch (typeof obj) {
                case "string": 
                    return serSring(obj);
                case "object":
                    return serObject(obj);
                default:
                    return String(obj);
            }
        }
    }

    function serSring(obj) {
        return "\"" + obj + "\"";
    }
    
    function serObject(obj) {
        if (Array.isArray(obj)) {
            return serObjectArray(obj);
        } else if (obj instanceof Date) {
            return serObjectDate(obj);
        } else {
            return serObjectLiteral(obj);
        }
    }
    
    function serObjectDate(obj) {
        obj = "\"" + obj.getFullYear() + '-' + ("0"+(obj.getMonth()+1)).slice(-2) + '-' + ("0"+(obj.getDate())).slice(-2) +
        "T" + ("0" + (obj.getHours()-3)).slice(-2) + ":" + ("0" + obj.getMinutes()).slice(-2) + ":" + 
        ("0" + obj.getSeconds()).slice(-2) + "." + ("0" + obj.getMilliseconds()).slice(-3) + "Z\"";
        return obj.toString();
    }
    
    function serObjectArray(obj) {
        let serializeObj = "[";
    
        for (let i in obj) {
            serializeObj += serialize(obj[i]);
            if (i < obj.length - 1) {
                serializeObj += ","
            }
        }
    
        serializeObj += "]";
        return serializeObj;
    }
    
    function serObjectLiteral(obj) {
        let serializeObj = "{";
    
        for (const key in obj) {
                serializeObj += "\"" + key + "\"" + ":" + serializeProcess(obj[key]) + ",";
        }
    
        serializeObj = serializeObj.slice(0, -1);
        serializeObj += "}";
        return serializeObj;
    }
=======
function serSring(obj) {
    return "\"" + obj + "\"";
}

function serObject(obj) {
    if (Array.isArray(obj)) {
        return serObjectArray(obj);
    } else if (obj instanceof Date) {
        return serObjectDate(obj);
    } else {
        return serObjectLiteral(obj);
    }
}

function serObjectDate(obj) {
    obj = "\"" + obj.getFullYear() + '-' + ("0"+(obj.getMonth()+1)).slice(-2) + '-' + ("0"+(obj.getDate())).slice(-2) +
    "T" + ("0" + (obj.getHours()-3)).slice(-2) + ":" + ("0" + obj.getMinutes()).slice(-2) + ":" + 
    ("0" + obj.getSeconds()).slice(-2) + "." + ("0" + obj.getMilliseconds()).slice(-3) + "Z\"";
    return obj.toString();
}

function serObjectArray(obj) {
    let serializeObj = "[";

    for (let i in obj) {
        serializeObj += serialize(obj[i]);
        if (i < obj.length - 1) {
            serializeObj += ","
        }
    }

    serializeObj += "]";
    return serializeObj;
}

function serObjectLiteral(obj) {
    let serializeObj = "{";

    for (const key in obj) {
        serializeObj += "\"" + key + "\"" + ":" + serialize(obj[key]) + ",";
    }

    serializeObj = serializeObj.slice(0, -1);
    serializeObj += "}";
    return serializeObj;
}

function serialize(obj) {
    if (typeof obj !== undefined && obj !== null) {
        switch (typeof obj) {
            case "string": 
                return serSring(obj);
            case "object":
                return serObject(obj);
            default:
                return String(obj);
        }
    }  
>>>>>>> dda474629b3a390e5f973e43834154f721d3fd09
}

//проверка на цикл
//претиэр

objects = {
    string: "Юки",
    number: 25,
    float: 2.3333,
    array: ["плавание", "горные лыжи"],
    literal: {
      city: "Москва",
      country: "Россия",
    },
    date: new Date,
<<<<<<< HEAD
    bool: true,
    circular: null,
}

objects.circular = objects;

for (const key in objects) {
    console.log(serialize(objects[key]) === JSON.stringify(objects[key]) ? true: serialize(objects[key])+" ||| "+JSON.stringify(objects[key]));
}
=======
}

for (const key in objects) {
    console.log(serialize(objects[key]) === JSON.stringify(objects[key]) ? true: serialize(objects[key])+" ||| "+JSON.stringify(objects[key]));
}
>>>>>>> dda474629b3a390e5f973e43834154f721d3fd09
