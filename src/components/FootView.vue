<template>
    <div class="foot">
        <i>Power By {{ auther }}</i>
    </div>
</template>

<script>
export default {
    data() {
        return {
            auther: 'Ricken'
        }
    }
}
</script>

<style scoped lang="less">
.foot {
    position: absolute;
    bottom: 0;
    left: auto;
    width: auto;
    margin-bottom: 15px;

    i {
        font-size: 1.1em;
        color: #44546e;
        font-style: inherit;
        font-weight: bold;
        text-shadow: 0 0 #909399;
    }
}
</style>