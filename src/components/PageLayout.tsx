import Header from "./Header";

export interface PageLayoutProps {
    title : string
}

const PageLayout : React.FC<PageLayoutProps> = ({title, children}) => {
    return (<div className="pageLayout">
        <Header title={title} />
        <div className="pageContainer">
            {children}
        </div>
        <div className="pageFooter">
            made with ❤ by teamflatly
        </div>
    </div>)
}

export default PageLayout;