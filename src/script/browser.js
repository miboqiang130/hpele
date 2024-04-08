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
            if (typeof key === "string" && data) {
              const isString = typeof data === "string";
              localStorage.setItem(key, isString ? data : JSON.stringify(data));
            } else if (typeof key === "object") {
              for (const k in key) {
                const isString = typeof key[k] === "string";
                localStorage.setItem(k, isString ? data : JSON.stringify(key[k]));
              }
            }
          },
          clear: async () => {
            localStorage.clear();
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
