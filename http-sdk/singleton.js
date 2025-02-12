
/**
 * 
 */
class Singleton {
        
    static _instance;

    /**
     * 
     * @param  {...any} vars 
     * @returns 
     */
    static GetInstance(...vars){
        if(this._instance) return this._instance;

        return new this(...vars);
    }

}

module.exports = {
    Singleton,
    default: Singleton,
};