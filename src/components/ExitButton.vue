<template>
    <div class="exit">
        <el-button type="primary" plain size="large" @click="exit">
            <template #icon>
                <i class="fa-duotone fa-arrow-right-from-bracket "></i>
            </template>
        </el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        exit() {
            this.$message.success("已退出登陆");
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
    }
}
</script>

<style scoped lang="less">
.exit {
    position: absolute;
    right: 30px;
    top: 10px;
}
</style>