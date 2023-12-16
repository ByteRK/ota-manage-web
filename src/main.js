import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 引入element-plus
import ElementPlus from 'element-plus'
import '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// 引入fontawesome 6 pro
import '@/assets/fontawesome_pro/css/pro.min.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
