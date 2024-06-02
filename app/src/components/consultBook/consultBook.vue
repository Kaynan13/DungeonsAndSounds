<template>
    <div class="consultbook-container">
        <div class="consultbook-header" @click="consultToggle = !consultToggle">
            <el-icon v-if="!consultToggle">
                <ArrowUp />
            </el-icon>
            <el-icon v-if="consultToggle">
                <ArrowDown />
            </el-icon>
            Livro de Consulta
        </div>
        <div class="consultbook-content" v-if="consultToggle">

            <div class="content-header">
                <el-radio-group v-model="tab" size="small" @change="getPrincipal(tab)">
                    <el-radio-button label="Races" value="races" />
                    <el-radio-button label="Class" value="classes" />
                    <el-radio-button label="Spells" value="spells" />
                    <el-radio-button label="Feats" value="features" />
                    <el-radio-button label="Items" value="equipment" />
                </el-radio-group>
            </div>

            <div class="content-body">
                <div class="main-result-container">
                    <el-input v-model="searchItem" placeholder="Buscar" size="small" @keyup="searchHandle"
                        class="searchInput" v-if="itemList.length > 0" />

                    <div class="item-list">
                        <span v-for="item in itemList" @click="getSubItems(item.name)"
                            :class="[item.selected ? 'selected' : '', item.hide ? 'hide' : '']"> {{ item.name }}</span>
                    </div>
                </div>
                <div class="sub-result-container">
                    <bookPage :pageData="subItem" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

import { DndActions } from '../../store/enums/DndEnum'

import bookPage from './bookPage.vue'

export default {
    components: {
        bookPage
    },

    setup() {
        const store = useStore()

        const consultToggle = ref<boolean>(false)

        const tab = ref<string>('')


        const searchItem = ref<string>('')
        const itemList = ref<any[]>([])
        const getPrincipal = (path: string) => {
            store.dispatch(DndActions.GET_CLASSES).then(res => {
                itemList.value = res
            })
        }

        const subItem = ref<any[]>([])
        const getSubItems = (name: string) => {
            itemList.value.filter(item => item.name == name ? item.selected = true : item.selected = false)
            store.dispatch(DndActions.GET_CLASS_BY_NAME, name).then(res => {
                subItem.value = jsonToText(res)

                console.log(res)
            })
        }

        const transformRecursive: any = (data: any) => {
            if (Array.isArray(data) && typeof data[0] == 'object') {
                return data.map((item: any) => {
                    return transformRecursive(item)
                })
            } else {
                return Object.keys(data).map(prop => {
                    let dataResult = data[prop]
                    let hasSubItem = false

                    if (Array.isArray(dataResult) && typeof dataResult[0] == 'string') {
                        dataResult = dataResult.reduce((acc: string, curr: string) => {
                            return `${acc}
                            ${curr}`;
                        }, '')
                    } else if (Array.isArray(dataResult) && typeof dataResult[0] == 'object' || typeof dataResult == 'object') {
                        hasSubItem = true
                        dataResult = transformRecursive(dataResult)
                    }

                    return {
                        title: prop,
                        subItem: hasSubItem,
                        content: dataResult
                    }
                })
            }
        }

        const jsonToText = (json: any,) => {

            function processNode(key: any, value: any) {                
                let node: any = {
                    title: key.replace(/_/g, ' '),
                    subItem: false,
                    content: null
                };

                if (typeof value === 'object' && !Array.isArray(value)) {
                    // Recursively handle nested objects
                    node.subItem = true;
                    node.content = [];
                    for (const subKey in value) {
                        if (value.hasOwnProperty(subKey) && subKey !== 'index' && subKey !== 'url') {
                            node.content.push(processNode(subKey, value[subKey]));
                        }
                    }
                } else if (Array.isArray(value)) {
                    if (value.length === 1 && typeof value[0] === 'string') {
                        // Handle arrays with a single string as a common string
                        node.content = value[0];
                    } else if (value.every(item => typeof item === 'string')) {
                        // Handle arrays of strings, joining them with commas
                        node.content = value.join(', ');
                    } else {
                        // Handle arrays with multiple items or non-string arrays
                        node.subItem = true;
                        node.content = value.map(item => {
                            if (typeof item === 'object') {
                                // Recursively handle arrays of objects
                                let subContent = [];
                                for (const subKey in item) {
                                    if (item.hasOwnProperty(subKey) && subKey !== 'index' && subKey !== 'url') {
                                        subContent.push(processNode(subKey, item[subKey]));
                                    }
                                }
                                return subContent.length === 1 ? subContent[0] : subContent;
                            } else {
                                // Handle arrays of primitives
                                return item;
                            }
                        });
                    }
                } else {
                    // Handle primitive values
                    node.content = value;
                }

                return node;
            }

            let result = [];
            for (const key in json) {
                if (json.hasOwnProperty(key) && key !== 'index' && key !== 'url') {
                    result.push(processNode(key, json[key]));
                }
            }
            return result;
        }

        const searchHandle = () => {
            if (searchItem.value == '') {
                itemList.value.filter(item => item.hide = false)
            } else {
                itemList.value.filter(item => item.name.toLowerCase().includes(searchItem.value.toLocaleLowerCase()) ? item.hide = false : item.hide = true)
            }
        }

        return {
            // Data
            consultToggle,
            searchItem,
            tab,
            itemList,
            subItem,

            // Methods
            searchHandle,
            getPrincipal,
            getSubItems,
        }
    }
}
</script>

<style>
@import url(../../assets/style/consultBook/index.css);
</style>