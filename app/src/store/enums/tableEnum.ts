enum tableActions {
    GET_TABLES = "GetTables",
    CREATE_TABLE = "CreateTable",
    DELETE_TABLE = "DeleteTable",
    GET_SOUNDS = "GetSounds",
    POST_SOUND = "PostSound",
    PUT_SOUND = "PutSound",
    POST_GROUP = "PostGroup",
    PUT_GROUP = "PutGroup",
    POST_GROUP_RANGE = "PostGroupRange",
    DELETE_SOUND = "DeleteSound",
    SET_TABLE_GETTER_ACTION = "SetTableGetterAction",
    GET_VIDEO_INFOS = "GetVideoInfos",
}

enum tableMutations{
    SET_TABLE_GETTER = "SetTableGetter"
}

export {
    tableActions,
    tableMutations
}