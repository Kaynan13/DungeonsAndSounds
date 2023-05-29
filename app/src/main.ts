import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElIconModules from '@element-plus/icons-vue'

// font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import * as iconsSolid from '@fortawesome/free-solid-svg-icons'
import * as iconsRegular from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import "./style.css"
import './samples/node-api'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)

const icons = {...iconsRegular, ...iconsSolid};
const iconList = Object.keys(icons);

iconList.forEach((item: any) => {  
  if(item != 'fas' && item != 'prefix')
    library.add((icons as any)[item])
})

for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName) && typeof iconName == 'string') {
    const item = ElIconModules[iconName as keyof typeof ElIconModules];
    app.component(iconName, item)
  }
}

app.component('fas', FontAwesomeIcon)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  });