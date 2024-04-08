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
    local.set(data);
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
    local.set("websiteList", websiteList);
    return websiteList;
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
    Object.assign(websiteList[index], params);
    local.set("websiteList", websiteList);
    return websiteList;
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
    local.set("websiteList", websiteList);
    return websiteList;
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
    local.set("websiteList", websiteList);
    return websiteList;
  },

  /**
   * @param {*} id 网站对象的id
   * @param {*} list 移除列表
   * @returns 网站列表
   */
  async updateJs(id, code) {
    const { websiteList } = await this.getWebsiteList();
    const index = websiteList.findIndex(i => i.id === id);
    websiteList[index].script.code = code;
    local.set("websiteList", websiteList);
    return websiteList;
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
    return local.set("removeCss", config);
  },
};
