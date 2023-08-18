import { Module, Action, VuexModule, Mutation } from "vuex-module-decorators";
import { tableActions, tableMutations } from "../enums/tableEnum";

import fs from 'fs';
import Table from "../entity/table";
import Sound from "../entity/sound";
import type { createTable, postSound, putSound, deleteSound, postGroupRange, putGroup, postGroup } from "../interface/tableInterface";
import axios from "axios";



@Module
export default class TableModule extends VuexModule {
    storage = window.localStorage
    folderDir: string = this.storage.getItem('folderDir')??''
    resourceDir: string = `${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`

    // GETTERS

    get getFolderDir() {
        if(this.folderDir == '')
            this.context.commit(tableMutations.SET_FOLDER_DIR, this.storage.getItem('folderDir'))
        return this.folderDir
    }

    // MUTATIONS

    @Mutation
    [tableMutations.SET_FOLDER_DIR](path: string){
        this.folderDir = path
        this.storage.setItem('folderDir', path)
    }

    // ACTIONS

    @Action
    [tableActions.SET_FOLDER_DIR_ACTION](path: string){
        this.context.commit(tableMutations.SET_FOLDER_DIR, path)
    }

    @Action
    [tableActions.GET_TABLES]() {
        return new Promise((resolve, reject) => {   
            fs.readdir(this.folderDir, (err, files) => {
                if (err) {
                    console.error(`Unable to scan directory: ${err}`);
                    reject(`Unable to scan directory: ${err}`);
                }

                let result = files.filter(item => item.split('.')[1] == 'json').map(item => {
                    return {
                        fileName: item,
                        name: item.split('.')[0].replaceAll('-', ' ')
                    }
                })

                resolve(result);
            })
        })
    }

    @Action
    [tableActions.CREATE_TABLE](data: createTable) {
        return new Promise(resolve => {            
            if (!data.data)
                data.data = '{"scenes": [], "groups": [], "sounds": []}'
            else
                data.data = JSON.stringify(data.data)

            if (!data.fileName)
                data.fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

            fs.writeFileSync(`${this.folderDir}/${data.fileName}.json`, data.data, `utf-8`)

            resolve(true)
        })
    }

    @Action
    [tableActions.DELETE_TABLE](tableName: string) {
        return new Promise((resolve, reject) => {
            if (tableName && tableName != '') {
                fs.unlink(`${this.folderDir}/${tableName.includes('.json') ? tableName : tableName + '.json'}`, err => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    }

                    resolve(true);
                })
            }
        })
    }

    @Action
    [tableActions.GET_SOUNDS](table: string) {
        return new Promise((resolve, reject) => {
            let tableName = table.includes('.json') ? table : `${table}.json`;
            fs.readFile(`${this.folderDir}/${tableName}`, 'utf-8', (err, data: any) => {
                if (err) {
                    console.error(`Unable to scan file: ${err}`);
                    reject(err);
                }

                let result = !data || data.length <= 0 ? [] : JSON.parse(data);

                while (typeof result == 'string') {
                    result = JSON.parse(result);
                }
                // result.sounds.filter((item: any) => !this.tables[table]._id == item._videoId)

                resolve(result);
            })
        })
    }

    @Action
    [tableActions.POST_SOUND](data: postSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: Table = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));

            data.sound.id = model.sounds.length > 0 ? model.sounds[model.sounds.length - 1].id! + 1 : 1;
            model.sounds.push(data.sound)

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to save data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.PUT_SOUND](data: putSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));

            if (model.sounds.findIndex((item: Sound) => item.id == data.sound.id) < 0) {
                console.error('Sound does not exist in table');
                reject('Sound does not exist in table');
            }

            let newModelSounds = model.sounds.map((item: Sound) => {
                if (item.id == data.sound.id)
                    item = data.sound;

                return item;
            })

            model.sounds = newModelSounds;

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to update data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.DELETE_SOUND](data: deleteSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));;

            let index = model.sounds.findIndex((item: Sound) => item.id == data.soundId);

            if (index < 0) {
                console.error('Sound does not exist in table');
                reject('Sound does not exist in table');
            }

            model.sounds.splice(index, 1)

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to delete data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.POST_GROUP_RANGE](data: postGroupRange) {
        return new Promise((resolve, reject) => {            
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));

            while(typeof model == 'string')
                model = JSON.parse(model)

            if(model.groups)
                model.groups.concat(data.groups);
            else
                model.groups = data.groups;

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to update data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }
    
    @Action
    [tableActions.POST_GROUP](data: postGroup) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: Table = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));
            
            model.groups.push(data.group)

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to save data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }
    
    @Action
    [tableActions.PUT_GROUP](data: putGroup) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${this.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));;

            if (model.groups.findIndex((item: any) => item.name == data.group.name) < 0) {
                console.error('Group does not exist in table');
                reject('Group does not exist in table');
            }

            let newModelSounds = model.groups.map((item: any) => {
                if (item.name == data.group.name)
                    item = data.group;

                return item;
            })

            model.groups = newModelSounds;

            fs.writeFile(`${this.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if (err) {
                    console.error(`Unable to update data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.GET_VIDEO_INFOS](data: string) {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:9000/getInfos', {
                params: {
                    id: data
                }
            }).then(res => {
                let returnData = {
                    image: res.data.thumbnails[1].url,
                    name: res.data.title
                }

                resolve(returnData)
            }).catch(err => {
                reject(err)
            })
        })
    }

    @Action
    [tableActions.CREATE_CONFIG_FILE](data: any){
        return new Promise((resolve, reject) => {
            fs.writeFile(`${this.resourceDir}/configFile.json`, JSON.stringify(data), err => {
                if (err) {
                    console.error(`Unable to create configFile: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
            
            resolve(true)
        })
    }

    @Action
    [tableActions.GET_CONFIG_FILE](){
        return new Promise((resolve, reject) => {            
            fs.readFile(`${this.resourceDir}/configFile.json`,'utf-8', (err, data: any) => {
                if (err) {
                    console.error(`Unable to scan file: ${err}`);
                    reject(err);
                }

                let result = !data || data.length <= 0 ? [] : JSON.parse(data);

                while (typeof result == 'string') {
                    result = JSON.parse(result);
                }
                // result.sounds.filter((item: any) => !this.tables[table]._id == item._videoId)

                this.context.commit(tableMutations.SET_FOLDER_DIR, result.tablesPath)
                resolve(true);
                
            })
        })
    }
}