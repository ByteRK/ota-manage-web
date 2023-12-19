<template>
    <div class="page">
        <div class="login_box">
            <h1 class="title">OTA管理系统</h1>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">

                <el-form-item label="账号" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入账号">
                        <template #prefix>
                            <i class="fa-duotone fa-face-disguise fa-beat-fade" style="color: #7694ac;"></i>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <i class="fa-duotone fa-key fa-beat-fade" style="color: #557eaa;"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="large" @click="login">
                <template #loading>
                    <i class="fa-duotone fa-loader"></i>
                </template>
                登陆
            </el-button>
        </div>

        <FootView />
    </div>
</template>

<script>
import _api from '@/script/api'
import FootView from '@/components/FootView.vue'

import { ref, onMounted } from 'vue'

export default {
    components: {
        FootView
    },
    created() {
        window.sessionStorage.clear();
    },
    setup() {
        const loginFormRef = ref(null);
        return {
            loginFormRef,
        }
    },
    data() {
        var checkid = (rule, value, callback) => {
            if (value == '') { return callback(new Error('你账号呢？忘了？')); }
            else { return callback() }
        }
        var checkpass = (rule, value, callback) => {
            if (value == '') { return callback(new Error('谁跟你说登陆不用密码的？？？')); }
            else { return callback() }
        }
        return {
            loginFormRef: null,
            loginForm: {
                username: 'sanboen',
                password: 'sanboen'
            },
            loginFormRules: {
                username: [{ validator: checkid, trigger: 'blur' },],
                password: [{ validator: checkpass, trigger: 'blur' },]
            },
        }
    },
    methods: {
        login() {
            if (!this.loginFormRef) return;
            this.loginFormRef.validate(async (valid) => {
                if (valid) {
                    try {
                        const { data: res, headers: res_h } = await _api.post("/login", {
                            'username': this.loginForm.username,
                            'password': this.loginForm.password
                        });
                        if (res.code == 200) {
                            window.sessionStorage.setItem("coffee", 'cofee');
                            this.$message.success("登陆成功,进入系统");
                            this.$router.push('/switch');
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        this.$message.error("网络异常");
                    }
                } else {
                    this.$message.warning("蠢猪🙈");
                }
            })

        }
    }
}
</script>

<style lang="less">
@keyframes loginBoxIn {
    from {
        opacity: 0;
        width: 900px;
    }

    to {
        opacity: 1;
        width: 450px;
    }
}

.page {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login_box {
    animation: loginBoxIn 1s cubic-bezier(0.93, 0, 0.15, 0.99);
    width: 450px;
    height: auto;
    background: #f6f5f5eb;
    border-radius: 10px;
    box-shadow: var(--el-box-shadow-light);
    padding: 10px;

    .title {
        padding-top: 10px;
        padding-bottom: 20px;
    }

    .el-form {
        margin: 0px 10px 0px 10px;
    }

    .el-button {
        width: 140px;
    }
}
</style>