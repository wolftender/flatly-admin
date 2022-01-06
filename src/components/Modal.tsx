export interface ModalButtonProps {
    name : string,
    action : () => void
}

export interface ModalProps {
    title : string,
    buttons : ModalButtonProps [] ,
    extended? : boolean  
}

const Modal : React.FC<ModalProps> = ({ title, buttons, children, extended }) => {
    const buttonList : React.ReactNode [] = [];

    for (const buttonProps of buttons) {
        buttonList.push (<button key={buttonProps.name} onClick={buttonProps.action}>{buttonProps.name}</button>);
    }

    return (<div className={!!extended ? 'modalWrapper extendedModalWrapper' : 'modalWrapper'}>
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