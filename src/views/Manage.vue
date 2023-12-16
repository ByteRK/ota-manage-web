<template>
    <div class="page">
        <ExitBT />
        <div class="manage_box">
            <h1 class="title">项目信息</h1>

            <el-button class="backBT" size="large" circle color="#f6f5f5eb" @click="backToSwitch">
                <template #icon>
                    <i class="fa-solid fa-xmark fa-2x" style="color: #557eaa;" />
                </template>
            </el-button>

            <el-form ref="editFromRef" :inline="true" label-position="right" :model="editProForm" :rules="editProFormRules"
                :status-icon="true">

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="项目编号" prop="id">
                            <el-input v-model.number="editProForm.id" placeholder="例如:61765" :maxlength="5" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文简称" prop="code">
                            <el-input v-model="editProForm.code" placeholder="例如:fuge" :disabled="finalGetData" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="editProForm.name" placeholder="例如:富格蒸烤箱" :disabled="finalGetData" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前版本" prop="version">
                            <el-input v-model="editProForm.version" placeholder="例如:V1.0.0.0" :disabled="finalGetData" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="15">
                        <el-form-item label="版本链接" prop="url">
                            <el-tooltip class="url-tip" effect="dark" content="点击复制更新检查链接至剪贴板" placement="bottom-start">
                                <el-input v-model="editProForm.url" class="urlbox" placeholder="用于检测当前是否存在更新"
                                    @click="copyText" readonly style="user-select: text;cursor: pointer;" />
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-upload ref="uploadRef" class="select-file" :http-request="customUpload"
                            :before-upload="beforeAvatarUpload" action="" :limit="1" :on-exceed="handleExceed"
                            :auto-upload="false" :on-error="uploadError" :on-success="uplodaSuccess">
                            <template #trigger>
                                <el-button type="primary" :disabled="finalGetData">选择更新包</el-button>
                            </template>
                        </el-upload>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="success" :disabled="finalGetData" @click="uploadBag">上传服务器</el-button>
                    </el-col>
                </el-row>

            </el-form>

        </div>

        <FootView />
    </div>
</template>

<script>
import _api from '@/script/api'
import { baseUrl } from '@/script/api'
import FootView from '@/components/FootView.vue'
import ExitBT from '@/components/ExitButton.vue'

import { ref, onMounted } from 'vue'
import { genFileId } from 'element-plus'
import { checkString, checkNumber } from '@/script/checkFrom'

export default {
    components: {
        ExitBT,
        FootView
    },
    // 注册
    created() {
        this.id = this.$route.params.id;
        if (!this.id) backToSwitch();
        this.upLoadUrl = '/upload?id=' + this.id;
    },
    // 渲染完成
    setup() {
        const createFromRef = ref(null);
        const uploadRef = ref(null);

        const getUploadRef = () => {
            return uploadRef.value;
        }

        const getCreateFromRef = () => {
            return createFromRef.value;
        }

        onMounted(() => {
        });

        return {
            uploadRef,
            createFromRef,
            getUploadRef,
            getCreateFromRef,
        }
    },
    // 普通数据
    data() {
        return {
            id: 0,
            upLoadUrl: '',
            finalGetData: true,

            editProForm: {
                id: "",
                code: "",
                name: "",
                version: "",
                url: "",
            },
            editProFormRules: {
                id: [{ validator: checkNumber, trigger: 'blur' },],
                code: [{ validator: checkString, trigger: 'blur' },],
                name: [{ validator: checkString, trigger: 'blur' },],
                version: [{ validator: checkString, trigger: 'blur' },],
            },
        }
    },
    // 一些函数
    methods: {
        backToSwitch() {
            this.$router.push('/switch');
        },

        async getCloudData() {
            try {
                const formData = new FormData();
                formData.append('file', file.raw);
                const response = await _api.post(this.upLoadUrl, formData);

                if (response.status === 200) {
                    if (response.data.code != 200) {
                        this.editProForm.id = response.data.data.id;
                        this.editProForm.code = response.data.data.code;
                        this.editProForm.name = response.data.data.name;
                        this.editProForm.version = response.data.data.version;
                        this.$message.error("获取项目数据成功");
                        this.finalGetData = false;
                        this.editProForm.url = baseUrl + '/check?id=' + this.id;
                    } else {
                        this.$message.error(response.data.msg);
                    }
                } else {
                    this.$message.error("网络异常");
                }
            } catch (error) {
                this.$message.error("网络异常");
            }
        },

        beforeAvatarUpload(rawFile) {
            console.log("检查数据包");
            if (rawFile.type !== 'application/x-gzip') {
                this.$message.error('仅支持上传tar.gz格式升级包!')
                return false
            }
            return true
        },
        copyText() {
            if (this.finalGetData) {
                this.$message.error("当前未获取到云端数据");
                return;
            }
            navigator.clipboard.writeText(this.editProForm.url)
                .then(() => {
                    this.$message.success("OTA版本检查链接已复制");
                })
                .catch((error) => {
                    console.error("复制内容时发生错误:", error);
                    this.$message.warning("复制内容时发生错误");
                });
        },
        handleExceed(files, fileList) {
            this.$message.warning(`只能上传一个文件，本次选择了 ${ files.length } 个文件`);
            this.getUploadRef().clearFiles();
            const file = files[0];
            file.uid = genFileId();
            this.getUploadRef().handleStart(file);
        },
        uploadBag() {
            this.getUploadRef().submit();
        },
        async customUpload({ file, onSuccess, onError }) {
            try {
                const formData = new FormData();
                formData.append('file', file.raw);
                const response = await _api.post(this.upLoadUrl, formData);

                if (response.status === 200) {
                    if (response.data.code != 200) {
                        onError();
                    } else {
                        onSuccess();
                    }
                } else {
                    onError();
                }
            } catch (error) {
                onError();
            }
        },
        uploadError() {
            this.$message.error('上传OTA升级包失败');
        },
        uplodaSuccess() {
            this.$message.success('上传OTA升级包成功');
        },
        login() {
        }
    }
}
</script>

<style lang="less">
@keyframes manageBoxIn {
    from {
        opacity: 0;
        width: 0px;
    }

    to {
        opacity: 1;
        width: 720px;
    }
}

.page {
    display: flex;
    justify-content: center;
    align-items: center;
}

.manage_box {
    animation: manageBoxIn 1s ease-in;
    position: absolute;
    width: 720px;
    height: auto;
    background: #f6f5f5eb;
    border-radius: 10px;
    box-shadow: var(--el-box-shadow-light);
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .backBT {
        position: absolute;
        right: -12px;
        top: -12px;
        box-shadow: var(--el-box-shadow-light);
    }

    .el-form {
        width: -webkit-fill-available;
        margin-left: 50px;
        margin-right: 50px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .el-form-item {
        margin-right: 0;
        width: -webkit-fill-available;
    }

    .el-input {
        width: 100%;
    }

    .title {
        padding-top: 10px;
        padding-bottom: 20px;
    }
}

.el-dialog {
    border-radius: 14px;

    .el-dialog__body {
        padding: 10px 25px 5px 25px;
    }
}

.select-file {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.upload {
    .el-upload-dragger {
        padding: 0;
        min-height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .upload-icon {
        padding: 0 0 15px 0;
    }
}

.url-tip {
    width: 1800px;
    margin-top: 10px;
}

.urlbox {

    .is-focus {
        box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-input__inner {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: auto;
    }
}
</style>