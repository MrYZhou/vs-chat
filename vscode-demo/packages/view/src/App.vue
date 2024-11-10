<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue';

const form = reactive({
    name: '',
    host: '',
    port: '22',
    account: '',
    password: '',
    secretValue:'',
})
declare let acquireVsCodeApi: any;
const vscode = acquireVsCodeApi()
let eventData = reactive({ data: '', type: '' })
const confirm = () => {
    vscode.postMessage({ type: 'hostAdd', data: toRaw(form) });
}
//监听插件消息
    window.addEventListener('message', ({data}) => {
    // 确保消息来源是可信的，通常是检查event.origin
    console.log(data,222);
    eventData.type = data.port
    });
</script>
<template>
  <el-row>
    <el-form :model="form" label-width="auto" :label-position="'right'">
      {{ eventData.type }}222
      <el-form-item label="主机名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="主机地址">
        <el-input v-model="form.host" />
      </el-form-item>
      <el-form-item label="端口">
        <el-input v-model="form.port" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="密钥">
        <el-input v-model="form.secretValue" />
      </el-form-item>
      <el-form-item
        ><el-row class="confirm-wrap">
          <el-button
            class="confirm-btn"
            type="primary"
            @click="confirm"
            style="width: 100%;"
            >确定</el-button
          >
        </el-row></el-form-item
      >
    </el-form>
  </el-row>
</template>
<style scoped>
.confirm-wrap{
    width: 110px;
    margin-left: 108px;
}
</style>
