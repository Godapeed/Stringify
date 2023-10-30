
function serialize(obj) {
    if (typeof obj === "object" && obj !== null) {
        let serializeObj = "";

        if (Array.isArray(obj)) {
            serializeObj += "[";

            for (let i in obj) {
                serializeObj += serialize(obj[i]);

                if (i < obj.length - 1) {
                    serializeObj += ","
                }
            }

            serializeObj += "]";
        } else {
            serializeObj += "{";

            for (const key in obj) {
                serializeObj += "\"" + key + "\"" + ":" + serialize(obj[key]) + ",";
            }

            serializeObj = serializeObj.slice(0, -1);
            serializeObj += "}";
        }

        return serializeObj;
    }

    if (typeof obj === "string") {
        return "\"" + obj + "\"";
    }

    return String(obj);
}

const obj1 = {name: "gfgv", age: 25};
const obj2 = ["dsd", 555, "wqwq"];
const obj3 = "dsdddddd";
const obj4 = 2343;
const obj5 = 3.1212;
const obj6 = Date;
//проверка на цикл
//претиэр

console.log(serialize(obj1), JSON.stringify(obj1));
console.log(serialize(obj2), JSON.stringify(obj2));
console.log(serialize(obj3), JSON.stringify(obj3));
console.log(serialize(obj4), JSON.stringify(obj4));
console.log(serialize(obj5), JSON.stringify(obj5));