<template>
  <div id="About">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="介绍" name="1">
        <div>本站域名：ppicture.xyz</div>
        <div>一个提供图片分享、搜索、收藏的小破网站；</div>
        <div>一个弱鸡程序员做的毕业设计；</div>
      </el-collapse-item>
      <el-collapse-item title="说明" name="2">
<!--        <div>短信验证码暂时不发送（因为付不起短信通知服务，只有免费送的100条）,</div>-->
        <div>  需要验证码的地方可以直接填写“ojxhdy”（因为付不起短信通知服务，只有免费送的100条）</div>
        <div>讨论区暂（永）时（远）不会开；</div>
        <div>对不起好友关注功能被我鸽了。</div>
      </el-collapse-item>
      <el-collapse-item title="开发者" name="3">
        <div style="color: #E2264D">【一个垃圾】</div>
      </el-collapse-item>
      <el-collapse-item title="声明" name="4">
        <div>忘了；</div>
        <div>无。</div>
        <div style="color: #409EFF">备案号：湘ICP备2021003515号-1</div>
      </el-collapse-item>
      <el-collapse-item title="更新日志" name="5">
        <div><em>2021-05-06:</em></div>
        <div>刷新界面不会404了</div>
        <div>退出登录可以正常跳回主页</div>
        <div>相册详情界面，用户名显示合理化</div>
        <div>添加评论字体更加显眼</div>
        <div>图片详情界面增加显示上传时间和作者</div>
        <div>可以正常获取验证码了</div>
        <div>各个输入框增加最大输入字符数限制</div>
        <div><del>修改个人信息可以立即生效了吧（网络延迟请手动F5刷新网页）</del></div>
        <div>可点击部分鼠标悬停显示</div>
        <br />
        <div><em>2021-05-07:</em></div>
        <div>上传图片大小限制从1M改为5M</div>
        <div>修改头像存在延迟...</div>
        <br />
        <div><em>2021-05-09:</em></div>
        <div>登录过期时长为1天</div>
        <div>创建相册能够立即生效</div>
        <div>优化显示...</div>
        <div>可以从图片详情界面点击图片查看大图</div>
        <div>刷新页面后左侧导航栏被选中图标正确显示</div>
        <br />
        <div><em>2021-05-10:</em></div>
        <div>显示细节优化（创建相册图片的可选提示）</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "About",
  data(){
    return {
      activeName: '0',
    }
  }
}
</script>

<style scoped lang="less">

#About{
  width: 80%;
  margin: 50px auto;
}
</style>