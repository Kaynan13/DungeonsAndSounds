import { Module, Action, VuexModule, Mutation } from "vuex-module-decorators";
import { tableActions, tableMutations } from "../enums/tableEnum";

import fs from 'fs';
import Table from "../entity/table";
import Sound from "../entity/sound";
import type { createTable, postSound, putSound, deleteSound } from "../interface/tableInterface";



@Module
export default class TableModule extends VuexModule {

    private static folderDir: string = `${__dirname.substring(0, __dirname.indexOf('resources') + 10).replaceAll(/\\/g, "/")}`

    // tables: any = {}; 
    

    // @Mutation
    // [tableMutations.SET_TABLE_GETTER](table: createTable){
    //     this.tables[table.fileName!] = table.data;
    // }

    // @Action
    // [tableActions.SET_TABLE_GETTER_ACTION](table: createTable){
    //     this.context.commit(tableMutations.SET_TABLE_GETTER, table)
    // }

    @Action
    [tableActions.GET_TABLES]() {
        return new Promise((resolve, reject) => {
            fs.readdir(TableModule.folderDir, (err, files) => {
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
            if(!data.data)
                data.data = '{"scenes": [], "sounds": []}'
            else
                data.data = JSON.stringify(data.data)

            if (!data.fileName)
            data.fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

            fs.writeFileSync(`${TableModule.folderDir}/${data.fileName}.json`, data.data, `utf-8`)

            resolve(true)
        })
    }

    @Action
    [tableActions.DELETE_TABLE](tableName: string){
        return new Promise((resolve, reject) => {
            if(tableName && tableName != ''){
                fs.unlink(`${TableModule.folderDir}/${tableName.includes('.json') ? tableName : tableName + '.json'}`, err => {
                    if(err) {
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
            fs.readFile(`${TableModule.folderDir}/${tableName}`, 'utf-8', (err, data: any) => {
                if(err){
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
    [tableActions.POST_SOUND] (data: postSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: Table = JSON.parse(fs.readFileSync(`${TableModule.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));
                        
            data.sound.id = model.sounds.length > 0 ? model.sounds[model.sounds.length - 1].id! + 1 : 1;
            model.sounds.push(data.sound)

            fs.writeFile(`${TableModule.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if(err){
                    console.error(`Unable to save data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.PUT_SOUND] (data: putSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${TableModule.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));;
                        
            if(model.sounds.findIndex((item: Sound) => item.id == data.sound.id) < 0){
                console.error('Sound does not exist in table');
                reject('Sound does not exist in table');
            }

            let newModelSounds = model.sounds.map((item: Sound)=> {
                if(item.id == data.sound.id)
                    item = data.sound;      
                    
                return item;
            })

            model.sounds = newModelSounds;

            fs.writeFile(`${TableModule.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if(err){
                    console.error(`Unable to update data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

    @Action
    [tableActions.DELETE_SOUND] (data: deleteSound) {
        return new Promise((resolve, reject) => {
            let tableName = data.table.includes('.json') ? data.table : `${data.table}.json`;
            let model: any = JSON.parse(fs.readFileSync(`${TableModule.folderDir}/${tableName}`, { encoding: 'utf8', flag: 'r' }));;
                        
            let index = model.sounds.findIndex((item: Sound) => item.id == data.soundId);

            if(index < 0){
                console.error('Sound does not exist in table');
                reject('Sound does not exist in table');
            }

            model.sounds.splice(index, 1)

            fs.writeFile(`${TableModule.folderDir}/${tableName}`, JSON.stringify(model), err => {
                if(err){
                    console.error(`Unable to delete data: ${err}`);
                    reject(err);
                }

                resolve(true);
            })
        })
    }

}