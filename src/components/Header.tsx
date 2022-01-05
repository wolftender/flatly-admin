export interface HeaderProps {
    title : string
}

const Header : React.FC<HeaderProps> = (props : HeaderProps) => {
    return (<div className="headerMain">
        <h1>{props.title}</h1>
    </div>)
};

export default Header;