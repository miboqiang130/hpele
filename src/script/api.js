export default {
  async getData() {
    return {
      websites: [
        {
          id: 1,
          host: "https://hao.shejidaren.com/",
          icon: "https://hao.shejidaren.com/images/favicon.ico",
          isEnable: true,
          lastTime: "2023-07-25",
          title: "设计导航 - 精选最好的设计网站大全",
          style: {
            removeList: ["#app ul.list", "html body div"],
          },
          script: {},
        },
        {
          id: 1,
          host: "https://hao.shejidaren.com/",
          icon: "https://hao.shejidaren.com/images/favicon.ico",
          isEnable: true,
          lastTime: "2023-07-25",
          title: "设计导航 - 精选最好的设计网站大全",
          style: {},
          script: {},
        },
      ],
      setting: {
        removeCss:
          "{position:absolute;right:100vw;top:100vh;display:none;opacity:0;z-index:-1;width:0px;height:0;overflow:hidden;}",
      },
    };
  },
  setData() {},
};
