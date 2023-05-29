class Scene {
    public id: number | null;
    public name: string;
    public time: number;
    public data: Array<any>;
    public interval?: any;

    constructor(_id = null, _name = '', _time = 0, _data = [], _group = ''){
        this.id = _id;
        this.name = _name;
        this.time = _time;
        this.data = _data;
    }
}

export default Scene