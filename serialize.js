/**
 * Сериализация сущности.
 * @param {*} value Сущность который надо сериализовать.
 * @param {*} replacer Функция предобрабатывающая сущность перед сериализации.
 * @param {*} space Форматирование сериализации.
 * @returns Сериализованная сущность.
 */
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

/**
 * Процесс сераализации.
 * @param {*} value Сущность который надо сериализовать.
 * @param {*} visited Список сериализованных сущностей.
 * @param {*} replacer Функция предобрабатывающая сущность перед сериализации.
 * @param {*} space Форматирование сериализации.
 * @param {*} space_level Уровень вложенности в сложных сущностях.
 * @returns Сериализованная сущность.
 */
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

/**
 * Сериализация строки.
 * @param {*} value Сущность который надо сериализовать.
 * @returns Сериализованная сущность.
 */
function serSring(value) {
  return '"' + value + '"';
}

/**
 * Сериализация объекта.
 * @param {*} value Сущность который надо сериализовать.
 * @param {*} visited Список сериализованных сущностей.
 * @param {*} replacer Функция предобрабатывающая сущность перед сериализации.
 * @param {*} space Форматирование сериализации.
 * @param {*} space_level Уровень вложенности в сложных сущностях.
 * @returns Сериализованная сущность.
 */
function serObject(value, visited, replacer, space, space_level) {
  if (Array.isArray(value)) {
    return serObjectArray(value, space, space_level);
  } else if (value instanceof Date) {
    return serObjectDate(value);
  } else {
    return serObjectLiteral(value, visited, replacer, space, space_level);
  }
}

/**
 * Сериализация даты.
 * @param {*} value Сущность который надо сериализовать.
 * @returns Сериализованная сущность.
 */
function serObjectDate(value) {
  return "\"" + value.toISOString() + "\"";
}

/**
 * Сериализация массива.
 * @param {*} value Сущность который надо сериализовать.
 * @param {*} space Форматирование сериализации.
 * @param {*} space_level Уровень вложенности в сложных сущностях.
 * @returns Серриализованный массив.
 */
function serObjectArray(value, space, space_level) {
  let serializeObj = "";

  if (space !== undefined) {
    local_space = space.repeat(space_level);
  }
  serializeObj += "[";

  if (space !== undefined) {
    serializeObj += "\n";
  }

  for (let i in value) {
    if (typeof value[i] === "symbol") { //Если в массиве встретился символ, превратим его в нуль
      serializeObj += null + ",";
      continue;
    }
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
    local_space = local_space.slice(0, -space.length);
    serializeObj += "\n" + local_space;
  }

  serializeObj += "]";
  return serializeObj;
}

/**
 * Сериализация literal block.
 * @param {*} value Сущность который надо сериализовать.
 * @param {*} visited Список сериализованных сущностей.
 * @param {*} replacer Функция предобрабатывающая сущность перед сериализации.
 * @param {*} space Форматирование сериализации.
 * @param {*} space_level Уровень вложенности в сложных сущностях.
 * @returns Сериализованная сущность.
 */
function serObjectLiteral(value, visited, replacer, space, space_level) {
  let serializeObj = "";

  if (space !== undefined) {
    local_space = space.repeat(space_level);
  }
  serializeObj += "{";

  if (space !== undefined) {
    serializeObj += "\n";
  }

  for (const key in value) {
    if (typeof value[key] === "symbol") { //Если в объекте встретился символ то удалим его
      delete value;
      continue;
    }
    if (space !== undefined) {
      serializeObj += local_space;
    }
    serializeObj += '"' + key + '"' + ":";
    if (space !== undefined) {
      serializeObj += " ";
    }
    serializeObj +=
      serializeProcess(value[key], visited, replacer, space, space_level + 1) + ",";
    if (space !== undefined) {
      serializeObj += "\n";
    }
  }

  serializeObj = serializeObj.slice(0, -1);

  if (space !== undefined) {
    serializeObj = serializeObj.slice(0, -1);
    local_space = local_space.slice(0, -space.length)
    serializeObj += "\n" + local_space;
  }

  serializeObj += "}";
  return serializeObj;
}

module.exports = serialize;