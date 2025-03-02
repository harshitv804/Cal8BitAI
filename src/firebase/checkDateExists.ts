export default function checkDateExists(db,value){
    const dateExists:Boolean = db.some(obj=>obj.date===value);
    
    if (dateExists){
        return true
    }else{
        return false
    }
}