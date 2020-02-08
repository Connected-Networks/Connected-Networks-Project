export default interface EditableObject<RowData> {
    isEditable?: (rowData: RowData) => boolean;
    isDeletable?: (rowData: RowData) => boolean;
    onRowAdd?: (newData: RowData) => Promise<void>;
    onRowUpdate?: (newData: RowData, oldData?: RowData | undefined) => Promise<void>;
    onRowDelete?: (oldData: RowData) => Promise<void>;
}