let bw;

// 开发环境下使用localStorage
switch (process.env.NODE_ENV) {
  case "development": {
    bw = {
      storage: {
        local: {
          get: async keys => {
            let rt = {};
            const parse = ["websiteList"];
            if (keys) {
              keys.forEach(i => {
                rt[i] = parse.includes(i) ? JSON.parse(localStorage.getItem(i)) : localStorage.getItem(i);
              });
            } else {
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                rt[key] = parse.includes(key) ? JSON.parse(value) : value;
              }
            }
            return rt;
          },
          set: async (key, data) => {
            const isString = typeof data === "string";
            localStorage.setItem(key, isString ? data : JSON.stringify(data));
          },
        },
      },
    };
    break;
  }
  case "production": {
    bw = chrome || browser;
    break;
  }
  default:
    throw Error("Unknown envirment!");
}

export default bw;
