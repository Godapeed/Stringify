function serialize(value, replacer) {
    const visited = new WeakSet();

    return serializeProcess(value, visited, replacer);
}

function serializeProcess(value, visited, replacer){
    if (visited.has(value)) {
        if (replacer === undefined) {
            throw new TypeError("Встречен цикл");
        } else {
            replacer();
        }
    }
    if (typeof value === "object") {
        visited.add(value);
    }

    if (typeof value !== undefined && value !== null) {
        switch (typeof value) {
            case "string":
                return serSring(value);
            case "object":
                return serObject(value, visited, replacer);
            default:
                return String(value);
        }
    }
}

function serSring(value) {
    return "\"" + value + "\"";
}

function serObject(value, visited, replacer) {
    if (Array.isArray(value)) {
        return serObjectArray(value);
    } else if (value instanceof Date) {
        return serObjectDate(value);
    } else {
        return serObjectLiteral(value, visited, replacer);
    }
}

function serObjectDate(value) {
    value = "\"" + value.getFullYear() + '-' + ("0"+(value.getMonth()+1)).slice(-2) + '-' + ("0"+(value.getDate())).slice(-2) +
    "T" + ("0" + (value.getHours()-3)).slice(-2) + ":" + ("0" + value.getMinutes()).slice(-2) + ":" + 
    ("0" + value.getSeconds()).slice(-2) + "." + ("0" + value.getMilliseconds()).slice(-3) + "Z\"";
    return value.toString();
}

function serObjectArray(value) {
    let serializeObj = "[";

    for (let i in value) {
        serializeObj += serialize(value[i]);
        if (i < value.length - 1) {
            serializeObj += ",";
        }
    }

    serializeObj += "]";
    return serializeObj;
}

function serObjectLiteral(value, visited, replacer) {
    let serializeObj = "{";

    for (const key in value) {
        serializeObj += "\"" + key + "\"" + ":" + serializeProcess(value[key], visited, replacer) + ",";
    }

    serializeObj = serializeObj.slice(0, -1);
    serializeObj += "}";
    return serializeObj;
}

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
    bool: true,
    circular: null,
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
            return "Обнаружен цикл";
            }
            seen.add(value);
        }
        return value;
    };
};

objects.circular = objects;

for (const key in objects) {
    mySerialize = serialize(objects[key], getCircularReplacer());
    jsonSerialize = JSON.stringify(objects[key], getCircularReplacer());
    
    console.log(mySerialize === jsonSerialize ? true: mySerialize + " ||| " + jsonSerialize);
}

