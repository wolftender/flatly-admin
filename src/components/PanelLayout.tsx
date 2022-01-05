import Navigation from "./Navigation";
import PageLayout, { PageLayoutProps } from "./PageLayout";

export interface PanelLayoutProps {
    title : string,
    navigation : React.ReactNode
}

const PanelLayout : React.FC<PanelLayoutProps> = ({ children, title, navigation }) => {
    return (<PageLayout title={title}>
        <div className="navigationWrapper">
            {navigation}
        </div>
        <div className="contentWrapper">
            {children}
        </div>
    </PageLayout>)
}

export default PanelLayout;