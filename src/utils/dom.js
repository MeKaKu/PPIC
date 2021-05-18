//获取屏幕宽高
function getClient() {
  return {
    width: document.body.clientWidth || document.documentElement.clientWidth,
    height: document.body.clientHeight || document.documentElement.clientHeight,
  };
}

export {
  getClient,
}