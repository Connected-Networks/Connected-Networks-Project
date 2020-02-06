import ATable from "./ATable";
import IActionsObject from "./IActionsObject";



export default abstract class DisplayTable<RowData> extends ATable<RowData> {
    
    TableProps = {
        uploadHandler: Function
    }

    

}