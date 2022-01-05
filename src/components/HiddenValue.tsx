import { useState } from "react";

export interface HiddenValueProps {
    show : boolean
}

const HiddenValue : React.FC<any> = ({ children, show }) => {
    const [hidden, setHidden] = useState (!show);

    return (<div className="hiddenValueContainer">
        {hidden ? '' : <span>{children} &nbsp;</span>}
        <a href="#" onClick={() => {
            setHidden (!hidden);
        }}>{hidden ? 'Show' : 'Hide'}</a>
    </div>)
}

export default HiddenValue;