<template>
    <div class="page">
        <ExitBT />

        <div class="switch_box">
            <h1 class="title">请选择项目</h1>
            <el-select v-model="projectSetect" class="m-2" placeholder="点击选择 / 直接搜索" size="large" fit-input-width
                @change="selectChange" filterable>
                <template #header>
                    <div class="select-header">
                        <el-text>
                            <i class="fa-duotone fa-thumbtack " style="color: #79bbff; padding: 0 5px 0 10px;" />
                            <a style="color: #d4d7de;">不要选错哦</a>
                        </el-text>
                        <el-button type="primary" size="small" plain @click="centerDialogVisible = true">
                            <template #icon>
                                <i class="fa-duotone fa-circle-plus "
                                    style="color: #409eff; --fa-primary-color:#ffffff; padding: 0 5px 0 10px;" />
                            </template>
                            新建项目
                        </el-button>
                    </div>
                </template>
                <el-option v-for="item in projectList" :key="item.id"
                    :label="item.name + '(' + item.id + ') - ' + item.version" :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" size="large" @click="enter" :disabled="btEnable">
                <template #icon>
                    <i class="fa-duotone fa-circle-check" style="color: #FAFCFF;" />
                </template>
                确定
            </el-button>
        </div>

        <FootView />

        <el-dialog v-model="centerDialogVisible" width="760px" center align-center draggable modal :show-close="false">
            <template #header>
                <h1 class="title">新建项目</h1>
            </template>
            <el-form ref="createFromRef" :inline="true" label-position="right" :model="createProForm"
                :rules="createProFormRules" :status-icon="true">

                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="项目编号" prop="id">
                            <el-input v-model.number="createProForm.id" placeholder="例如:61765" :maxlength="5" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文简称" prop="code">
                            <el-input v-model="createProForm.code" placeholder="例如:fuge" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="createProForm.name" placeholder="例如:富格蒸烤箱" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前版本" prop="version">
                            <el-input v-model="createProForm.version" placeholder="例如:V1.0.0.0" />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button size="large" @click="centerDialogVisible = false">取消</el-button>
                    <el-button size="large" type="primary" @click="toUpload">确认</el-button>
                </span>
            </template>
        </el-dialog>


        <el-dialog v-model="uploadDialogVisible" width="400px" center align-center draggable modal :show-close="false">
            <el-upload ref="uploadRef" class="upload" drag :http-request="customUpload" action=""
                :before-upload="beforeAvatarUpload" :auto-upload="false" :limit="1" :on-exceed="handleExceed" multiple>
                <i class="upload-icon fa-duotone fa-upload fa-2x"></i>
                <div class="el-upload__text">
                    拖动OTA升级包到此处或者 <em>点击选择文件</em>
                </div>
            </el-upload>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="uploadDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="uploadBag">上传</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
import FootView from '@/components/FootView.vue'
import ExitBT from '@/components/ExitButton.vue'

import _api from '@/script/api'
import { checkString, checkNumber } from '@/script/checkFrom'
import { ref, onMounted } from 'vue'
import { genFileId } from 'element-plus'

export default {
    components: {
        ExitBT,
        FootView
    },
    created() {
    },
    setup() {
        const createFromRef = ref(null);
        const uploadRef = ref(null);
        return {
            createFromRef,
            uploadRef,
        }
    },
    data() {
        this.getProjectList();
        return {
            btEnable: true,
            projectList: [],
            projectSetect: "",

            centerDialogVisible: false,
            createProForm: {
                id: "",
                code: "",
                name: "",
                version: "",
            },
            createFromRef: null,
            createProFormRules: {
                id: [{ validator: checkNumber, trigger: 'blur' },],
                code: [{ validator: checkString, trigger: 'blur' },],
                name: [{ validator: checkString, trigger: 'blur' },],
                version: [{ validator: checkString, trigger: 'blur' },],
            },

            uploadRef: null,
            upLoadUrl: '',
            uploadDialogVisible: false,
        }
    },
    methods: {
        async getProjectList() {
            try {
                const response = await _api.get('/prjList');
                if (response.status === 200) {
                    if (response.data.code === 200) {
                        this.projectList = response.data.data.list;
                        this.$message.success("获取项目列表成功");
                    } else {
                        this.$message.error(response.data.message);
                    }
                } else {
                    this.$message.error("网络异常");
                }
            } catch (error) {
                this.$message.error("网络异常");
            }
        },

        selectChange() {
            if (this.projectSetect != "") this.btEnable = false;
        },
        enter() {
            console.log("选择了项目：" + this.projectSetect);
            this.$router.push({ name: 'manage', params: { id: this.projectSetect } });
        },
        toUpload() {
            if (!this.createFromRef) return;
            this.createFromRef.validate(async (valid) => {
                if (valid) {
                    this.upLoadUrl = "/upload?id=" + this.createProForm.id;
                    this.uploadDialogVisible = true;
                } else {
                    this.$message.warning("蠢猪！！！看错误提示🙈");
                }
            })
        },
        beforeAvatarUpload(rawFile) {
            if (rawFile.type !== 'application/x-gzip') {
                this.$message.error('仅支持上传tar.gz格式升级包!')
                return false
            }
            return true
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${ files.length } 个文件`);
            this.uploadRef.clearFiles();
            const file = files[0];
            file.uid = genFileId();
            this.uploadRef.handleStart(file);
        },
        uploadBag() {
            this.uploadRef.submit();
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
    }
}
</script>

<style lang="less">
@keyframes fadeIn {
    from {
        opacity: 0;
        width: 0;
    }

    to {
        opacity: 1;
        width: 360px;
    }
}

.page {
    display: flex;
    justify-content: center;
    align-items: center;
}

.switch_box {
    animation: fadeIn 0.5s cubic-bezier(0, 0.87, 1, 0.23);
    width: 360px;
    height: auto;
    background: #f6f5f5eb;
    border-radius: 10px;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;

    .el-select {
        width: 300px;
        margin: 15px 0 15px 0;
    }
}

.select-header {
    display: flex;
    align-content: center;
    justify-content: space-between;
}

.el-dialog {
    border-radius: 14px;

    .el-dialog__body {
        padding: 10px 30px 5px 30px;
    }

    .el-form {
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

}
</style>