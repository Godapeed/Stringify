function serialize(obj) {
    const visited = new WeakSet();
  
    function process(obj) {
      if (visited.has(obj)) {
        return '[Circular]';
      }
      visited.add(obj);
      
      const serialized = {};
  
      for (const [key, value] of Object.entries(obj)) {
        const valueType = typeof value;
  
        if (valueType === 'object' && value !== null) {
          serialized[key] = process(value);
        } else {
          serialized[key] = value;
        }
      }
  
      return serialized;
    }
  
    return JSON.stringify(process(obj));
  }
  
  const obj = {
    name: 'John',
    age: 25
  };
  
  obj.self = obj; // добавляем ссылку на сам объект в его свойство
  
  const serializedObj = serialize(obj);
  
  console.log(serializedObj);
  