export interface ModalButtonProps {
    name : string,
    action : () => void
}

export interface ModalProps {
    title : string,
    buttons : ModalButtonProps []   
}

const Modal : React.FC<ModalProps> = ({ title, buttons, children }) => {
    const buttonList : React.ReactNode [] = [];

    for (const buttonProps of buttons) {
        buttonList.push (<button onClick={buttonProps.action}>{buttonProps.name}</button>);
    }

    return (<div className="modalWrapper">
        <div className="modal">
            <div className="modalHeader">
                <h1>{title}</h1>
            </div>
            <div className="modalContent">
                {children}
            </div>
            <div className="modalFooter">
                {buttonList}
            </div>
        </div>
    </div>)
};

export default Modal;