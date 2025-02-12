const { Singleton } = require("../singleton.js");
const { ConsoleColors, Colors } = require("./colors.js");
const { ConsoleLogLevels, LogLevels } = require("./log-levels.js");
const { Slugs } = require("./slugs.js");



const getTimestamp = () => new Date().toISOString();

function getLogWriter(_slug,config={}){
const logWriters = { // key names are _slug options.
    [Slugs.Console]: WriteToConsoleLog
}

if(typeof logWriters[_slug] === 'undefined') throw new Error('Invalid Log _slug')

return logWriters[_slug];
}

function getLogLevels(_slug=Slugs.Console, config={}){
const logLevels = { // key names are _slug options.
    [Slugs.Console]: ConsoleLogLevels,
}

if(typeof logLevels[_slug] === 'undefined') throw new Error('Invalid Log _slug')

return logLevels[_slug];
}

const createLogFunction = (type, color) => (message) => {
    const timestamp = chalk.gray(`[${getTimestamp()}]`);
    const coloredType = chalk[color](type);
    console.log(`${timestamp} ${coloredType}: ${message}`);
};

 function writeLog(level={}, msg=''){
    
    const {
        _slug = false,
    } = level;

    if(_slug = false) return false;
    
    const logWriter = getLogWriter(_slug,level);

    return logWriter(level, msg);
}

function WriteToConsoleLog(level=LogLevels.Default, msg=''){
    let err;
    if(!(typeof level?.toString === 'function')) level.toString = () => 'CONSOLE';

    let {
        reset='',
        dim='',
        primary='',
        secondary='',
        emoji=false,
    } = level;

    if(!(emoji === false)) emoji = ` ${emoji} `; 
    else emoji = '';
    if(msg instanceof Error) {
        err = msg;
        msg = `Error: ${err.message}`;
    }
    console.log(`${reset}${dim}${secondary}[${getTimestamp()}]${emoji}${reset}${primary}${level.toString()}${reset}\t|: ${msg}`);
}

class Log extends Singleton {

    constructor(slug=Slugs.Console,config={}){
        super();
        this.levels = getLogLevels(slug,config);
        this.writer = getLogWriter(slug, config);
        this.config = config;
    }
    
    system(msg){
        return this.writer(this.levels.System,msg);
    }
    static System(msg){
        const inst = this.GetInstance();
        return inst.system(msg);
    }

    info(msg){
        return this.writer(this.levels.Info,msg);
    }
    static Info(msg){
        const inst = this.GetInstance();
        return inst.info(msg);
    }


    debug(msg){
        return this.writer(this.levels.Debug,msg);
    }
    static Debug(msg){
        const inst = this.GetInstance();
        return inst.debug(msg);
    }

    success(msg){
        return this.writer(this.levels.Success,msg);
    }
    static Success(msg){
        const inst = this.GetInstance();
        return inst.success(msg);
    }

    error(msg){
        return this.writer(this.levels.Error,msg);
    }
    static Error(msg){
        const inst = this.GetInstance();
        return inst.error(msg);
    }

    failed(msg){
        return this.writer(this.levels.Failed,msg);
    }
    static Failed(msg){
        const inst = this.GetInstance();
        return inst.failed(msg);
    }

    warning(msg){
        return this.writer(this.levels.Warning,msg);
    }
    static Warning(msg){
        const inst = this.GetInstance();
        return inst.warning(msg);
    }

    critical(msg){
        return this.writer(this.levels.Critical,msg);
    }
    static Critical(msg){
        const inst = this.GetInstance();
        return inst.critical(msg);
    }

}

module.exports = {
    getTimestamp,
    getLogWriter,
    getLogLevels,
    createLogFunction,
    writeLog,
    WriteToConsoleLog,
    Log,
    Colors,
    ConsoleColors,
}






