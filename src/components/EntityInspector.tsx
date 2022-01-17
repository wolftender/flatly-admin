import { User } from "../schema/User";
import HiddenValue from "./HiddenValue";
import Modal from "./Modal";

export interface EntityInspectorProps {
    entity : any,
    onClose : () => void
};

const EntityInspector : React.FC<EntityInspectorProps> = (props : EntityInspectorProps) => {
    const rows : React.ReactNode [] = [];

    for (const propName in props.entity) {
        let propValue : string = String ((props.entity as any)[propName]);
        if (propName.toLocaleLowerCase ().indexOf ('timestamp') !== -1) {
            propValue = (new Date ((props.entity as any)[propName])).toLocaleString ();
        }

        rows.push (<tr key={propName}>
            <td>{propName}</td>
            <td>{propValue}</td>
        </tr>)
    }
    
    return (<Modal extended={true} title="User Inspector" buttons={[
        { name: "close", action: props.onClose }
    ]}>
        <table className="table modalTable"cellPadding={0} cellSpacing={0}>
            <thead>
                <tr>
                    <td>property</td>
                    <td>value</td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </Modal>);
}

export default EntityInspector;