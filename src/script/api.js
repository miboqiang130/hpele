import bw from "./browser";

const local = bw.storage.local;

export default {
  /**
   * @returns 所有数据
   */
  async getData() {
    return local.get();
  },

  /**
   * @param {*} data 要设置的数据
   */
  setData(data) {
    return local.set(data);
  },

  /**
   * 导入数据
   */
  importData(data) {
    local.clear();
    local.set(data);
  },

  /**
   * @returns 网站列表
   */
  getWebsiteList() {
    return local.get(["websiteList"]);
  },

  /**
   * 设置网站列表
   * @param {Array} websiteList
   */
  setWebsiteList(websiteList) {
    return local.set({ websiteList });
  },

  /**
   * 新增网站
   * @param {Object} website
   */
  async newWebsite(website) {
    const { websiteList } = await this.getWebsiteList();
    websiteList.push(
      Object.assign(
        {
          id: new Date().getTime(),
          host: "",
          icon: "",
          isEnable: true,
          lastTime: "",
          title: "",
          desc: "",
          style: {
            removeList: [],
            code: "",
          },
          script: {
            code: "",
          },
        },
        website
      )
    );
    local.set({ websiteList });
  },

  /**
   * 更新网站
   * @param {Number} id 网站对象的id
   * @param {Object} params 要修改的属性对象
   * @returns
   */
  async updateWebsite(id, params) {
    const { websiteList } = await this.getWebsiteList();
    const index = websiteList.findIndex(w => w.id === id);
    websiteList[index] = Object.assign({}, websiteList[index], params);
    local.set({ websiteList });
    // 配置userScripts
    const scripts = await bw.userScripts.getScripts({ ids: [id.toString()] });
    if (scripts.length > 0) {
      const match = params.host + (params.host.endsWith("/") ? "*" : "/*");
      bw.userScripts.update([{ id: id.toString(), js: [{ code: websiteList[index].script.code }], matches: [match] }]);
    }
  },

  /**
   * @param {*} id 网站对象的id
   * @param {*} list 移除列表
   * @returns 网站列表
   */
  async updateRemoveList(id, list) {
    const { websiteList } = await this.getWebsiteList();
    const index = websiteList.findIndex(i => i.id === id);
    websiteList[index].style.removeList = list;
    local.set({ websiteList });
  },

  /**
   * @param {*} id 网站对象的id
   * @param {*} list 移除列表
   * @returns 网站列表
   */
  async updateStyleCode(id, code) {
    const { websiteList } = await this.getWebsiteList();
    const index = websiteList.findIndex(i => i.id === id);
    websiteList[index].style.code = code;
    local.set({ websiteList });
  },

  /**
   * @param {*} id 网站对象的id
   * @param {*} list 移除列表
   * @returns 网站列表
   */
  async updateJs(data, code) {
    const id = data.id;
    const { websiteList } = await this.getWebsiteList();
    const index = websiteList.findIndex(i => i.id === id);
    websiteList[index].script.code = code;
    local.set({ websiteList });
    // 配置userScripts
    const scripts = await bw.userScripts.getScripts({ ids: [id.toString()] });
    if (scripts.length > 0) {
      bw.userScripts.update([{ id: id.toString(), js: [{ code }], matches: [data.host + "*"] }]);
    } else {
      bw.userScripts.register([{ id: id.toString(), js: [{ code }], matches: [data.host + "*"] }]);
    }
  },

  /**
   * 改变是否启用状态
   * @param {*} id 网站对象的id
   */
  async toggleEnable(id) {
    const { websiteList } = await this.getWebsiteList();
    const website = websiteList.find(i => i.id === id);
    website.isEnable = !website.isEnable;
    local.set({ websiteList });
  },

  /**
   * 获取配置
   */
  getConfig() {
    return local.get(["removeCss"]);
  },

  /**
   * 设置配置
   */
  setConfig(config) {
    return local.set({ removeCss: config });
  },
};
