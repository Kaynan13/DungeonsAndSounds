enum tableActions {
    CREATE_CONFIG_FILE = "CreateConfigFile",
    GET_CONFIG_FILE = " GetConfigFile",
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
    SET_FOLDER_DIR_ACTION = "SetFolderDirAction",
    SET_UPDATE_ACTION = "SetUpdateAction",
}

enum tableMutations{
    SET_TABLE_GETTER = "SetTableGetter",
    SET_FOLDER_DIR = "SetFoldeDir",
    SET_UPDATE_MUTATION = "SetUpdateMutation",
}

export {
    tableActions,
    tableMutations
}