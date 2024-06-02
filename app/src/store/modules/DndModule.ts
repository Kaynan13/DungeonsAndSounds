import { Module, Action, VuexModule, } from "vuex-module-decorators";
import { DndActions } from "../enums/DndEnum";

import axios from "axios";
import fs from 'fs';

@Module
export default class DndModule extends VuexModule {

    // <el-radio-button label="Class" value="classes" />
    // <el-radio-button label="Spells" value="spells" />
    // <el-radio-button label="Feats" value="features" />
    // <el-radio-button label="Items" value="equipment" />

    @Action
    [DndActions.GET_CLASSES]() {
        return new Promise((resolve, reject) => {
            fs.readFile('./src/book-data/class/index.json', 'utf-8', (err, data) => {
                if (err) {
                    console.error(`unable to scan file: ${err}`)
                    reject({ message: `unable to scan file: ${err}` })
                }

                let classes = Object.keys(JSON.parse(data)).map(item => {
                    return {
                        name: item
                    }
                })
                console.log(classes)

                resolve(classes ?? [])
            })
        })
    }

    @Action
    [DndActions.GET_CLASS_BY_NAME](name: string) {
        return new Promise(async (resolve, reject) => {
            let classesFiles: any[] = []
            await fs.readdir('./src/book-data/class/', (err, files) => {
                if (err) {
                    console.error(`Unable to scan directory: ${err}`);
                    reject(`Unable to scan directory: ${err}`);
                }

                classesFiles = files.filter(item => item.toLowerCase().includes(name.toLowerCase()));
            })

            debugger

            if (classesFiles.length > 0) {                
                Promise.all(classesFiles.map(async (file: string) => {
                    let classData: any = {}
                    await fs.readFile(`./src/book-data/class/${file}`, 'utf-8', (err, data) => {
                        if (err) {
                            console.error(`unable to scan file: ${err}`)
                            reject({ message: `unable to scan file: ${err}` })
                        }
                        
                        classData = {
                            source: file.replace('.json', ''),
                            data: JSON.parse(data)
                        }
                    })

                    return classData
                })).then((res) => {
                    resolve(res)
                })

            }
        })
    }
}