export interface NavigationProps {
    pages : string [],
    page : string,
    setPage : (page : string) => void
}

const Navigation : React.FC<NavigationProps> = (props : NavigationProps) => {
    const navigationTabs : React.ReactNode [] = [];

    for (const page of props.pages) {
        navigationTabs.push (<a key={page} className={page == props.page ? "navigationTab active" : "navigationTab"} 
            onClick={() => { props.setPage (page) }}>
            {page}
        </a>)
    }

    return (<div className="navigation">
        {navigationTabs}
    </div>)
}

export default Navigation;