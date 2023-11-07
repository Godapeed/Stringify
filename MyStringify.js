function serialize(value, replacer, space) {
    const visited = new WeakSet();
  
    if (typeof space === "number") {
      space = " ".repeat(space);
    } else if (space === "\t") {
      space = "\t";
    } else if (typeof space !== "string") {
      space = undefined;
    }
  
    try {
      return serializeProcess(value, visited, replacer, space, 1);
    } catch (error) {
      if (error instanceof TypeError) {
        console.log(
          "Ошибка сериализации: Сериализация данного типа объекта не предусмотренна"
        );
      }
      if (error instanceof RangeError) {
        console.log("Ошибка сериализации: превышено ограничение по глубине");
      }
      if (error instanceof SyntaxError) {
        console.log("Ошибка сериализации: некорректный JSON");
      }
    }
  }
  
  //replacer - не только циклы
  
  function serializeProcess(value, visited, replacer, space, space_level) {
    if (typeof replacer === "function") {
      value = replacer("", value);
    } 
    if (visited.has(value)) {
      throw new SyntaxError("Встречен цикл");
    }
    if (typeof value === "object") {
      visited.add(value);
    }
  
    if (typeof value !== undefined && value !== null) {
      switch (typeof value) {
        case "string":
          return serSring(value);
        case "object":
          return serObject(value, visited, replacer, space, space_level);
        case "string":
          return String(value);
        case "number":
          return String(value);
        case "boolean":
          return String(value);
        case "symbol":
          return undefined;
        default:
          throw new TypeError("Непредусмотренный тип");
      }
    }
  }
  
  function serSring(value) {
    return '"' + value + '"';
  }
  
  function serObject(value, visited, replacer, space, space_level) {
      //символ в массиве
    if (Array.isArray(value)) {
      return serObjectArray(value, space, space_level);
    } else if (value instanceof Date) {
      return serObjectDate(value);
    } else {
      return serObjectLiteral(value, visited, replacer, space, space_level);
    }
  }
  
  function serObjectDate(value) {
    value =
      '"' +
      value.getFullYear() +
      "-" +
      ("0" + (value.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + value.getDate()).slice(-2) +
      "T" +
      ("0" + (value.getHours() - 3)).slice(-2) +
      ":" +
      ("0" + value.getMinutes()).slice(-2) +
      ":" +
      ("0" + value.getSeconds()).slice(-2) +
      "." +
      ("0" + value.getMilliseconds()).slice(-3) +
      'Z"';
    return value.toString();
  }
  
  function serObjectArray(value, space, space_level) {
    let serializeObj = "";
  
    local_space = space.repeat(space_level);
    serializeObj += "[";
  
    if (space !== undefined) {
      serializeObj += "\n";
    }
  
    for (let i in value) {
      if (space !== undefined) {
        serializeObj += local_space;
      }
  
      serializeObj += serialize(value[i]);
  
      if (i < value.length - 1) {
        serializeObj += ",";
        if (space !== undefined) {
          serializeObj += "\n";
        }
      }
    }
  
    if (space !== undefined) {
      serializeObj += "\n";
    }
  
    serializeObj += local_space.slice(0, -space.length) + "]";
    return serializeObj;
  }
  
  function serObjectLiteral(value, visited, replacer, space, space_level) {
    let serializeObj = "";
  
    local_space = space.repeat(space_level);
    serializeObj += "{";
  
    if (space !== undefined) {
      serializeObj += "\n";
    }
  
    for (const key in value) {
      if (space !== undefined) {
        serializeObj += local_space;
      }
      serializeObj +=
        '"' +
        key +
        '"' +
        ": " +
        serializeProcess(value[key], visited, replacer, space, space_level + 1) + //проверка на символ
        ",";
      if (space !== undefined) {
        serializeObj += "\n";
      }
    }
  
    serializeObj = serializeObj.slice(0, -1);
  
    if (space !== undefined) {
      serializeObj = serializeObj.slice(0, -1);
      serializeObj += "\n";
    }
  
    local_space = local_space.slice(0, -space.length);
    serializeObj += local_space + "}";
    return serializeObj;
  }
  
  objects = {
    string: "Юки",
    number: 25,
    float: 2.3333,
    array: ["плавание", "горные лыжи"],
    literal: {
      city: "Москва",
      country: "Россия",
    },
    date: new Date(),
    bool: true,
    symbol: Symbol("id"),
    circular: null,
  };
  
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
  
  //даты -> сменить формат
  //npm + pacagjson
  
  for (const key in objects) {
    jsonSerialize = JSON.stringify(objects[key], getCircularReplacer(), "\t");
    mySerialize = serialize(objects[key], getCircularReplacer(), "\t");
  
    console.log(
      mySerialize === jsonSerialize ? true : mySerialize + " ||| " + jsonSerialize
    );
  }