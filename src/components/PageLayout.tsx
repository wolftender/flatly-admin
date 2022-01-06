import Header from "./Header";
import githubIcon from '../resources/github.png';

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
            <div className="copyright">made with ❤ by teamflatly</div>
            <div className="media">
                <a href="https://github.com/pwmini2021/flatly" className="footerIconLink">
                    <img src={githubIcon} alt="github"></img>
                </a>
            </div>
        </div>
    </div>)
}

export default PageLayout;