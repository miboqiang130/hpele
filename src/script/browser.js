let bw;

// 开发环境下使用localStorage
switch (process.env.NODE_ENV) {
  case "development": {
    let callback;
    const parse = ["websiteList"];
    bw = {
      storage: {
        local: {
          get: async keys => {
            let rt = {};
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
          set: async obj => {
            for (const k in obj) {
              const isString = typeof obj[k] === "string";
              localStorage.setItem(k, isString ? obj[k] : JSON.stringify(obj[k]));
            }
            if (obj["websiteList"]) callback({ websiteList: { newValue: obj["websiteList"] } });
          },
          clear: async () => {
            localStorage.clear();
          },
          onChanged: {
            addListener(cb) {
              callback = cb;
            },
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
