import { useState } from "react";
import Modal from "./Modal";

export interface ConfirmDialogProps {
    onConfirm: () => Promise<void>;
    onReject: () => void;
    prompt: string;
}

const ConfirmDialog : React.FC<ConfirmDialogProps> = (props : ConfirmDialogProps) => {
    const [loading, setLoading] = useState (false);

    const accept = () => {
        if (!loading) {
            setLoading (true);
            props.onConfirm ().finally (() => {
                setLoading (false);
            });
        }
    }

    return (<Modal title="Confirmation" buttons={[
        { name: "Yes", action: accept },
        { name: "No", action: props.onReject }
    ]}>
        {!!loading ? <div className="info">saving...</div> : <></>}
        <p className="confirmModalContent">{props.prompt}</p>
    </Modal>);
}

export default ConfirmDialog;