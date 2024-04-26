let bw;

// 开发环境下使用localStorage
switch (process.env.NODE_ENV) {
  case "development": {
    let callback;
    const parse = ["websiteList"];
    const i18n = require("../../public/_locales/en_US/messages.json");
    console.log(i18n);
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
      i18n: {
        getMessage(str) {
          if (i18n[str]) return i18n[str]["message"];
          else throw `[Error]The message ${str} does not exist.`;
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
